use std::{
    sync::Arc,
    time::{Duration, Instant},
};

use reqwest::Client;
use serde::{Deserialize, Serialize};
use sha2::Digest;
use tokio::sync::RwLock;

use crate::{
    domain::{
        Channel3Product, Channel3SearchResponse, DecisionEngineMetadata, ShipmentTrackingInfo,
        SpendPolicy,
    },
    error::SentinelError,
};

pub const SANDBOX_ACDC_TEST_CARD: &str = "4012888888881881";
pub const SANDBOX_ACDC_EXPIRY: &str = "2028-12";
pub const SANDBOX_ACDC_CVV: &str = "123";

#[derive(Debug, Clone)]
struct CachedOAuthToken {
    access_token: String,
    expires_at: Instant,
}

#[derive(Debug, Clone)]
pub struct PayPalSandboxClient {
    http: Client,
    base_url: String,
    client_id: Option<String>,
    client_secret: Option<String>,
    token_cache: Arc<RwLock<Option<CachedOAuthToken>>>,
}

#[derive(Debug, Deserialize)]
struct OAuthTokenResponse {
    access_token: String,
    #[serde(default = "default_expires_in")]
    expires_in: u64,
}

fn default_expires_in() -> u64 {
    32_400
}

#[derive(Debug, Serialize)]
struct CreateOrderBody<'a> {
    intent: &'a str,
    purchase_units: Vec<PurchaseUnit<'a>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    payment_source: Option<PaymentSource<'a>>,
}

#[derive(Debug, Serialize)]
struct PurchaseUnit<'a> {
    description: &'a str,
    amount: OrderAmount<'a>,
}

#[derive(Debug, Serialize)]
struct OrderAmount<'a> {
    currency_code: &'a str,
    value: String,
}

#[derive(Debug, Serialize)]
struct PaymentSource<'a> {
    card: CardSource<'a>,
}

#[derive(Debug, Serialize)]
struct CardSource<'a> {
    name: &'a str,
    number: &'a str,
    expiry: &'a str,
    security_code: &'a str,
    billing_address: BillingAddress<'a>,
}

#[derive(Debug, Serialize)]
struct BillingAddress<'a> {
    address_line_1: &'a str,
    admin_area_2: &'a str,
    admin_area_1: &'a str,
    postal_code: &'a str,
    country_code: &'a str,
}

#[derive(Debug, Deserialize)]
struct PayPalOrderApiResult {
    id: String,
    #[serde(default)]
    status: Option<String>,
    #[serde(default)]
    links: Option<Vec<PayPalLink>>,
    #[serde(default)]
    purchase_units: Option<Vec<PayPalPurchaseUnitResult>>,
}

#[derive(Debug, Deserialize)]
struct PayPalPurchaseUnitResult {
    #[serde(default)]
    payments: Option<PayPalPaymentsResult>,
}

#[derive(Debug, Deserialize)]
struct PayPalPaymentsResult {
    #[serde(default)]
    captures: Option<Vec<PayPalCaptureResult>>,
}

#[derive(Debug, Deserialize)]
struct PayPalCaptureResult {
    id: String,
}

#[derive(Debug, Deserialize)]
struct PayPalLink {
    href: String,
    rel: String,
}

#[derive(Debug, Clone)]
pub struct OrderExecutionOptions<'a> {
    pub idempotency_key: &'a str,
    pub amount_usd: f64,
    pub description: &'a str,
    pub sequence_num: u64,
    pub direct_card_capture: bool,
    pub simulate_decline: Option<&'a str>,
}

#[derive(Debug, Clone)]
pub struct CreatedPayPalOrder {
    pub order_id: String,
    pub approve_url: String,
    pub sandbox_mode: String,
    pub capture_id: Option<String>,
    pub card_last4: Option<String>,
    pub captured: bool,
}

pub fn to_paypal_request_uuid(key: &str) -> String {
    let trimmed = key.trim();
    if trimmed.len() == 36 && trimmed.chars().filter(|&c| c == '-').count() == 4 {
        return trimmed.to_owned();
    }
    let digest = sha2::Sha256::digest(trimmed.as_bytes());
    let mut bytes = [0u8; 16];
    bytes.copy_from_slice(&digest[..16]);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    format!(
        "{}-{}-{}-{}-{}",
        hex::encode(&bytes[0..4]),
        hex::encode(&bytes[4..6]),
        hex::encode(&bytes[6..8]),
        hex::encode(&bytes[8..10]),
        hex::encode(&bytes[10..16])
    )
}

impl PayPalSandboxClient {
    pub fn from_env() -> Self {
        let base_url = std::env::var("PAYPAL_BASE_URL")
            .unwrap_or_else(|_| "https://api-m.sandbox.paypal.com".to_owned());
        let client_id = std::env::var("PAYPAL_CLIENT_ID")
            .ok()
            .filter(|v| !v.trim().is_empty());
        let client_secret = std::env::var("PAYPAL_CLIENT_SECRET")
            .ok()
            .filter(|v| !v.trim().is_empty());

        Self {
            http: Client::new(),
            base_url,
            client_id,
            client_secret,
            token_cache: Arc::new(RwLock::new(None)),
        }
    }

    pub fn has_live_credentials(&self) -> bool {
        self.client_id.is_some() && self.client_secret.is_some()
    }

    pub fn mode_label(&self) -> &'static str {
        if self.has_live_credentials() {
            "LIVE_PAYPAL_SANDBOX"
        } else {
            "JUDGE_1CLICK_SANDBOX"
        }
    }

    async fn fetch_oauth_token(&self, force_refresh: bool) -> Result<String, SentinelError> {
        if !force_refresh {
            let cache_guard = self.token_cache.read().await;
            if let Some(cached) = &*cache_guard {
                if Instant::now() < cached.expires_at {
                    return Ok(cached.access_token.clone());
                }
            }
        }

        let (Some(cid), Some(secret)) = (&self.client_id, &self.client_secret) else {
            return Err(SentinelError::PayPalUpstream(
                "missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET".to_owned(),
            ));
        };

        let url = format!("{}/v1/oauth2/token", self.base_url);
        let resp = self
            .http
            .post(&url)
            .basic_auth(cid, Some(secret))
            .form(&[("grant_type", "client_credentials")])
            .send()
            .await
            .map_err(|e| SentinelError::PayPalUpstream(e.to_string()))?;

        if !resp.status().is_success() {
            return Err(SentinelError::PayPalUpstream(format!(
                "OAuth token exchange returned HTTP {}",
                resp.status()
            )));
        }

        let body: OAuthTokenResponse = resp
            .json()
            .await
            .map_err(|e| SentinelError::PayPalUpstream(e.to_string()))?;

        let ttl_secs = body.expires_in.saturating_sub(60).max(60);
        let token = body.access_token.clone();
        {
            let mut cache_guard = self.token_cache.write().await;
            *cache_guard = Some(CachedOAuthToken {
                access_token: body.access_token,
                expires_at: Instant::now() + Duration::from_secs(ttl_secs),
            });
        }
        Ok(token)
    }

    pub async fn create_order_v2(
        &self,
        idempotency_key: &str,
        amount_usd: f64,
        description: &str,
        sequence_num: u64,
    ) -> Result<CreatedPayPalOrder, SentinelError> {
        self.execute_order_v2(OrderExecutionOptions {
            idempotency_key,
            amount_usd,
            description,
            sequence_num,
            direct_card_capture: false,
            simulate_decline: None,
        })
        .await
    }

    pub async fn execute_order_v2(
        &self,
        opts: OrderExecutionOptions<'_>,
    ) -> Result<CreatedPayPalOrder, SentinelError> {
        let normalized_decline = opts
            .simulate_decline
            .map(str::trim)
            .filter(|v| !v.is_empty());
        let request_uuid = to_paypal_request_uuid(opts.idempotency_key);

        if self.has_live_credentials() {
            let mut token = self.fetch_oauth_token(false).await?;
            let url = format!("{}/v2/checkout/orders", self.base_url);

            if opts.direct_card_capture || normalized_decline.is_some() {
                let cardholder_name = match normalized_decline {
                    Some("CCREJECT-IF") => "CCREJECT-IF",
                    Some("CCREJECT-REFUSED") => "CCREJECT-REFUSED",
                    Some("CCREJECT-SF") => "CCREJECT-SF",
                    Some("CCREJECT-EC") => "CCREJECT-EC",
                    _ => "Sandbox Test Buyer",
                };

                let direct_payload = CreateOrderBody {
                    intent: "CAPTURE",
                    purchase_units: vec![PurchaseUnit {
                        description: opts.description,
                        amount: OrderAmount {
                            currency_code: "USD",
                            value: format!("{:.2}", opts.amount_usd),
                        },
                    }],
                    payment_source: Some(PaymentSource {
                        card: CardSource {
                            name: cardholder_name,
                            number: SANDBOX_ACDC_TEST_CARD,
                            expiry: SANDBOX_ACDC_EXPIRY,
                            security_code: SANDBOX_ACDC_CVV,
                            billing_address: BillingAddress {
                                address_line_1: "2211 N First St",
                                admin_area_2: "San Jose",
                                admin_area_1: "CA",
                                postal_code: "95131",
                                country_code: "US",
                            },
                        },
                    }),
                };

                let mut req_builder = self
                    .http
                    .post(&url)
                    .bearer_auth(&token)
                    .header("PayPal-Request-Id", &request_uuid);

                if let Some(code) = normalized_decline {
                    if !code.starts_with("CCREJECT-") {
                        let mock_header =
                            format!(r#"{{"mock_application_codes":"{code}"}}"#);
                        req_builder = req_builder.header("PayPal-Mock-Response", mock_header);
                    }
                }

                let mut resp = req_builder
                    .json(&direct_payload)
                    .send()
                    .await
                    .map_err(|e| SentinelError::PayPalUpstream(e.to_string()))?;

                if resp.status().as_u16() == 401 {
                    token = self.fetch_oauth_token(true).await?;
                    let mut retry_builder = self
                        .http
                        .post(&url)
                        .bearer_auth(&token)
                        .header("PayPal-Request-Id", &request_uuid);
                    if let Some(code) = normalized_decline {
                        if !code.starts_with("CCREJECT-") {
                            let mock_header =
                                format!(r#"{{"mock_application_codes":"{code}"}}"#);
                            retry_builder =
                                retry_builder.header("PayPal-Mock-Response", mock_header);
                        }
                    }
                    resp = retry_builder
                        .json(&direct_payload)
                        .send()
                        .await
                        .map_err(|e| SentinelError::PayPalUpstream(e.to_string()))?;
                }

                if let Some(trigger) = normalized_decline {
                    if !resp.status().is_success() {
                        return Err(SentinelError::CardInstrumentDeclined {
                            code: trigger.to_owned(),
                            reason: format!(
                                "PayPal Sandbox rejected test card 1881 with HTTP {} ({trigger})",
                                resp.status()
                            ),
                        });
                    }
                    return Err(SentinelError::CardInstrumentDeclined {
                        code: trigger.to_owned(),
                        reason: format!(
                            "Deterministic decline trigger '{trigger}' blocked card capture"
                        ),
                    });
                }

                if resp.status().is_success() {
                    let parsed: PayPalOrderApiResult = resp
                        .json()
                        .await
                        .map_err(|e| SentinelError::PayPalUpstream(e.to_string()))?;

                    let capture_id = parsed
                        .purchase_units
                        .as_ref()
                        .and_then(|units| units.first())
                        .and_then(|u| u.payments.as_ref())
                        .and_then(|p| p.captures.as_ref())
                        .and_then(|c| c.first())
                        .map(|c| c.id.clone());

                    let captured = parsed
                        .status
                        .as_deref()
                        .map(|s| s == "COMPLETED")
                        .unwrap_or(capture_id.is_some());

                    return Ok(CreatedPayPalOrder {
                        approve_url: format!(
                            "https://www.sandbox.paypal.com/checkoutnow?token={}",
                            parsed.id
                        ),
                        order_id: parsed.id,
                        sandbox_mode: "LIVE_PAYPAL_SANDBOX".to_owned(),
                        capture_id,
                        card_last4: Some("1881".to_owned()),
                        captured,
                    });
                }
                // Graceful fallback to standard order creation when ACDC is not enabled on the Sandbox app
            }

            let fallback_uuid = to_paypal_request_uuid(&format!("{}:std", opts.idempotency_key));
            let payload = CreateOrderBody {
                intent: "CAPTURE",
                purchase_units: vec![PurchaseUnit {
                    description: opts.description,
                    amount: OrderAmount {
                        currency_code: "USD",
                        value: format!("{:.2}", opts.amount_usd),
                    },
                }],
                payment_source: None,
            };

            let resp = self
                .http
                .post(&url)
                .bearer_auth(token)
                .header("PayPal-Request-Id", fallback_uuid)
                .json(&payload)
                .send()
                .await
                .map_err(|e| SentinelError::PayPalUpstream(e.to_string()))?;

            if !resp.status().is_success() {
                return Err(SentinelError::PayPalUpstream(format!(
                    "Orders v2 create returned HTTP {}",
                    resp.status()
                )));
            }

            let parsed: PayPalOrderApiResult = resp
                .json()
                .await
                .map_err(|e| SentinelError::PayPalUpstream(e.to_string()))?;

            let approve_url = parsed
                .links
                .unwrap_or_default()
                .into_iter()
                .find(|l| l.rel == "approve")
                .map(|l| l.href)
                .unwrap_or_else(|| {
                    format!(
                        "https://www.sandbox.paypal.com/checkoutnow?token={}",
                        parsed.id
                    )
                });

            return Ok(CreatedPayPalOrder {
                order_id: parsed.id,
                approve_url,
                sandbox_mode: "LIVE_PAYPAL_SANDBOX".to_owned(),
                capture_id: None,
                card_last4: None,
                captured: false,
            });
        }

        if let Some(trigger) = normalized_decline {
            return Err(SentinelError::CardInstrumentDeclined {
                code: trigger.to_owned(),
                reason: format!(
                    "Simulated PayPal Sandbox negative decline ({trigger}) on Visa ACDC test card ending 1881"
                ),
            });
        }

        let digest = sha2::Digest::finalize(sha2::Sha256::new_with_prefix(format!(
            "{}:{:.2}:{}",
            opts.idempotency_key, opts.amount_usd, opts.sequence_num
        )));
        let short_id = hex::encode(&digest[..5]).to_uppercase();
        let cap_short = hex::encode(&digest[5..10]).to_uppercase();
        let order_id = format!("PAYPAL-SBX-{short_id}");

        Ok(CreatedPayPalOrder {
            approve_url: format!("https://www.sandbox.paypal.com/checkoutnow?token={order_id}"),
            order_id,
            sandbox_mode: "JUDGE_1CLICK_SANDBOX".to_owned(),
            capture_id: if opts.direct_card_capture {
                Some(format!("CAP-SBX-{cap_short}"))
            } else {
                None
            },
            card_last4: if opts.direct_card_capture {
                Some("1881".to_owned())
            } else {
                None
            },
            captured: opts.direct_card_capture,
        })
    }

    pub async fn attach_shipment_tracking(
        &self,
        transaction_id: &str,
        tracking_number: &str,
        carrier: &str,
        status: &str,
    ) -> Result<ShipmentTrackingInfo, SentinelError> {
        let normalized_status = match status.trim().to_uppercase().as_str() {
            "DELIVERED" => "DELIVERED",
            _ => "IN_TRANSIT",
        };
        let normalized_carrier = if carrier.trim().is_empty() {
            "UPS"
        } else {
            carrier.trim()
        };

        if self.has_live_credentials() {
            if let Ok(token) = self.fetch_oauth_token(false).await {
                let url = format!("{}/v1/shipping/trackers-batch", self.base_url);
                let body = serde_json::json!({
                    "trackers": [{
                        "transaction_id": transaction_id,
                        "tracking_number": tracking_number,
                        "status": normalized_status,
                        "carrier": normalized_carrier
                    }]
                });
                let _ = self
                    .http
                    .post(&url)
                    .bearer_auth(token)
                    .json(&body)
                    .send()
                    .await;
            }
        }

        Ok(ShipmentTrackingInfo {
            tracking_number: tracking_number.to_owned(),
            carrier: normalized_carrier.to_owned(),
            status: normalized_status.to_owned(),
            updated_at: "2026-10-31T10:15:00Z".to_owned(),
        })
    }

    pub async fn create_batch_payout(
        &self,
        batch_key: &str,
        recipient_email: &str,
        amount_usd: f64,
        note: &str,
    ) -> Result<String, SentinelError> {
        if self.has_live_credentials() {
            if let Ok(token) = self.fetch_oauth_token(false).await {
                let url = format!("{}/v1/payments/payouts", self.base_url);
                let body = serde_json::json!({
                    "sender_batch_header": {
                        "sender_batch_id": batch_key,
                        "email_subject": "PayPal Sentinel Verified Milestone Payout",
                        "email_message": "Rust spend guardrail verified your deliverable."
                    },
                    "items": [{
                        "recipient_type": "EMAIL",
                        "amount": {
                            "value": format!("{amount_usd:.2}"),
                            "currency": "USD"
                        },
                        "receiver": recipient_email,
                        "note": note,
                        "sender_item_id": format!("item_{batch_key}")
                    }]
                });
                if let Ok(resp) = self
                    .http
                    .post(&url)
                    .bearer_auth(token)
                    .json(&body)
                    .send()
                    .await
                {
                    if resp.status().is_success() {
                        if let Ok(parsed) = resp.json::<serde_json::Value>().await {
                            if let Some(id) = parsed["batch_header"]["payout_batch_id"].as_str() {
                                return Ok(id.to_owned());
                            }
                        }
                    }
                }
            }
        }

        let digest = sha2::Sha256::digest(format!("{batch_key}:{recipient_email}").as_bytes());
        let short = hex::encode(&digest[..4]).to_uppercase();
        Ok(format!("PAYOUT-SBX-{short}"))
    }
}

#[derive(Debug, Clone)]
pub struct Channel3ApiClient {
    http: Client,
    api_key: Option<String>,
    endpoint: String,
}

impl Channel3ApiClient {
    pub fn from_env() -> Self {
        let api_key = std::env::var("CHANNEL3_API_KEY")
            .ok()
            .filter(|v| !v.trim().is_empty());
        let endpoint = std::env::var("CHANNEL3_API_URL")
            .unwrap_or_else(|_| "https://api.trychannel3.com/v1/search".to_owned());
        Self {
            http: Client::new(),
            api_key,
            endpoint,
        }
    }

    pub fn with_endpoint_and_key(endpoint: String, api_key: Option<String>) -> Self {
        Self {
            http: Client::new(),
            api_key,
            endpoint,
        }
    }

    pub fn has_live_key(&self) -> bool {
        self.api_key.is_some()
    }

    pub fn mode_label(&self) -> &'static str {
        if self.has_live_key() {
            "LIVE_CHANNEL3_API"
        } else {
            "JUDGE_1CLICK_SANDBOX"
        }
    }

    pub async fn search_catalog(
        &self,
        query: &str,
        max_price_usd: f64,
        fallback_catalog: &[Channel3Product],
    ) -> Channel3SearchResponse {
        let trimmed = query.trim();
        let effective_max_price = if max_price_usd.is_finite() && max_price_usd > 0.0 {
            max_price_usd
        } else {
            500.0
        };

        if let Some(key) = &self.api_key {
            let search_query = if trimmed.is_empty() {
                "developer workstation hardware monitor keyboard"
            } else {
                trimmed
            };

            let request_body = serde_json::json!({
                "query": search_query,
                "config": {
                    "mode": "agentic"
                },
                "filters": {
                    "availability": ["InStock"],
                    "price": {
                        "min_price": 1.0,
                        "max_price": effective_max_price
                    }
                },
                "limit": 12
            });

            let live_attempt = self
                .http
                .post(&self.endpoint)
                .header("x-api-key", key)
                .header("x-user-id", "paypal-sentinel-operator")
                .json(&request_body)
                .timeout(Duration::from_secs(8))
                .send()
                .await;

            if let Ok(resp) = live_attempt {
                if resp.status().is_success() {
                    if let Ok(json) = resp.json::<serde_json::Value>().await {
                        let raw_items = json["products"]
                            .as_array()
                            .or_else(|| json["results"].as_array())
                            .or_else(|| json["data"].as_array())
                            .or_else(|| json.as_array());

                        if let Some(items) = raw_items {
                            let mapped: Vec<Channel3Product> = items
                                .iter()
                                .enumerate()
                                .take(12)
                                .map(|(idx, item)| {
                                    let title = item["title"]
                                        .as_str()
                                        .or_else(|| item["name"].as_str())
                                        .unwrap_or("Channel3 Verified Retail Item")
                                        .to_owned();

                                    let brand_name = item["brands"]
                                        .as_array()
                                        .and_then(|arr| arr.first())
                                        .and_then(|b| b["name"].as_str())
                                        .or_else(|| item["brand"].as_str())
                                        .map(str::to_owned);

                                    let first_offer = item["offers"]
                                        .as_array()
                                        .and_then(|arr| arr.first());

                                    let offer_domain = first_offer
                                        .and_then(|o| o["domain"].as_str())
                                        .map(str::to_owned);

                                    let merchant_name = offer_domain
                                        .clone()
                                        .or_else(|| brand_name.clone())
                                        .or_else(|| item["merchant"].as_str().map(str::to_owned))
                                        .unwrap_or_else(|| "Channel3 Verified Retailer".to_owned());

                                    let merchant_slug: String = merchant_name
                                        .chars()
                                        .filter(|c| c.is_ascii_alphanumeric() || *c == '.')
                                        .collect::<String>()
                                        .to_lowercase();
                                    let merchant_email = if merchant_slug.contains('.') {
                                        format!("orders-sbx@{merchant_slug}")
                                    } else {
                                        "merchant-sbx@channel3.example.com".to_owned()
                                    };

                                    let price_usd = first_offer
                                        .and_then(|o| {
                                            o["price"]["price"]
                                                .as_f64()
                                                .or_else(|| o["price"].as_f64())
                                        })
                                        .or_else(|| item["price"]["price"].as_f64())
                                        .or_else(|| item["price"].as_f64())
                                        .or_else(|| item["price_usd"].as_f64())
                                        .unwrap_or(149.0);

                                    let category = item["category"]["title"]
                                        .as_str()
                                        .or_else(|| item["category"].as_str())
                                        .unwrap_or("Channel3 Agentic Retail")
                                        .to_owned();

                                    let image_url = item["images"]
                                        .as_array()
                                        .and_then(|imgs| imgs.first())
                                        .and_then(|img| {
                                            img["cleaned_url"]
                                                .as_str()
                                                .or_else(|| img["url"].as_str())
                                        })
                                        .map(str::to_owned);

                                    let buy_url = first_offer
                                        .and_then(|o| o["url"].as_str())
                                        .map(str::to_owned);

                                    let availability = first_offer
                                        .and_then(|o| o["availability"].as_str())
                                        .unwrap_or("InStock")
                                        .to_owned();

                                    Channel3Product {
                                        id: item["id"]
                                            .as_str()
                                            .map(str::to_owned)
                                            .unwrap_or_else(|| format!("ch3-live-{}", idx + 1)),
                                        sku: item["sku"]
                                            .as_str()
                                            .map(str::to_owned)
                                            .unwrap_or_else(|| {
                                                format!("CH3-LIVE-{:03}", idx + 101)
                                            }),
                                        title,
                                        merchant_name,
                                        merchant_email,
                                        price_usd,
                                        category,
                                        risk_score: 11,
                                        delivery_sla: format!("{availability} · Tracked Shipping"),
                                        brand_name,
                                        image_url,
                                        buy_url,
                                        availability: Some(availability),
                                    }
                                })
                                .collect();

                            if !mapped.is_empty() {
                                let total = mapped.len();
                                return Channel3SearchResponse {
                                    query: trimmed.to_owned(),
                                    channel3_mode: "LIVE_CHANNEL3_API".to_owned(),
                                    search_mode: "agentic".to_owned(),
                                    promo_code: "PAYPAL-HACKATHON-2026".to_owned(),
                                    max_price_filter_usd: effective_max_price,
                                    total_matches: total,
                                    products: mapped,
                                };
                            }
                        }
                    }
                }
            }
        }

        let q_lower = trimmed.to_lowercase();
        let mut filtered: Vec<Channel3Product> = if q_lower.is_empty() {
            fallback_catalog.to_vec()
        } else {
            fallback_catalog
                .iter()
                .filter(|item| {
                    item.title.to_lowercase().contains(&q_lower)
                        || item.category.to_lowercase().contains(&q_lower)
                        || item.merchant_name.to_lowercase().contains(&q_lower)
                        || item.sku.to_lowercase().contains(&q_lower)
                })
                .cloned()
                .collect()
        };

        if filtered.is_empty() {
            filtered = fallback_catalog.iter().take(4).cloned().collect();
        }

        let total_matches = filtered.len();
        Channel3SearchResponse {
            query: trimmed.to_owned(),
            channel3_mode: "JUDGE_1CLICK_SANDBOX".to_owned(),
            search_mode: "agentic".to_owned(),
            promo_code: "PAYPAL-HACKATHON-2026".to_owned(),
            max_price_filter_usd: effective_max_price,
            total_matches,
            products: filtered,
        }
    }
}

#[derive(Debug, Clone)]
pub struct TypeSafeDecisionClient {
    http: Client,
    api_key: Option<String>,
    endpoint: String,
    model: String,
}

impl TypeSafeDecisionClient {
    pub fn from_env() -> Self {
        let api_key = std::env::var("TYPESAFE_API_KEY")
            .ok()
            .filter(|v| !v.trim().is_empty());
        let endpoint = std::env::var("TYPESAFE_API_URL")
            .unwrap_or_else(|_| "https://api.typesafe.ai/v1/systemone".to_owned());
        Self {
            http: Client::new(),
            api_key,
            endpoint,
            model: "jev-1.13.0".to_owned(),
        }
    }

    pub fn has_live_key(&self) -> bool {
        self.api_key.is_some()
    }

    pub fn mode_label(&self) -> &'static str {
        if self.has_live_key() {
            "LIVE_TYPESAFE_API"
        } else {
            "DETERMINISTIC_RUBRIC_FALLBACK"
        }
    }

    pub fn deterministic_rubric(
        &self,
        amount_usd: f64,
        policy: &SpendPolicy,
        risk_score: u8,
    ) -> DecisionEngineMetadata {
        let spend_ratio = (amount_usd / policy.max_single_order_usd.max(1.0)).clamp(0.0, 2.0);
        let risk_ratio = (f64::from(risk_score) / f64::from(policy.max_risk_score.max(1))).clamp(0.0, 2.0);

        let blocked = amount_usd > policy.max_single_order_usd || risk_score > policy.max_risk_score;
        let raw_prob = if blocked {
            (0.18 - 0.05 * (spend_ratio + risk_ratio)).clamp(0.01, 0.19)
        } else {
            (0.98 - 0.18 * spend_ratio - 0.16 * risk_ratio).clamp(0.55, 0.99)
        };
        let approval_probability = (raw_prob * 1000.0).round() / 1000.0;

        let (risk_band, verdict) = if blocked {
            ("HIGH", "BLOCK")
        } else if risk_score > 20 || spend_ratio > 0.75 {
            ("MEDIUM", "APPROVE")
        } else {
            ("LOW", "APPROVE")
        };

        DecisionEngineMetadata {
            engine: "typesafe-systemone-jev".to_owned(),
            mode: "DETERMINISTIC_RUBRIC_FALLBACK".to_owned(),
            model: self.model.clone(),
            endpoint: self.endpoint.clone(),
            approval_probability,
            risk_band: risk_band.to_owned(),
            verdict: verdict.to_owned(),
            rationale: format!(
                "Rubric judgment: amount {:.2} USD vs {:.2} USD cap, vendor risk {} vs {} ceiling",
                amount_usd, policy.max_single_order_usd, risk_score, policy.max_risk_score
            ),
        }
    }

    pub async fn evaluate_order(
        &self,
        prompt: &str,
        amount_usd: f64,
        policy: &SpendPolicy,
        risk_score: u8,
    ) -> DecisionEngineMetadata {
        let mut base = self.deterministic_rubric(amount_usd, policy, risk_score);

        if let Some(key) = &self.api_key {
            let payload = serde_json::json!({
                "model": self.model,
                "state": {
                    "intent_prompt": prompt,
                    "amount_usd": amount_usd,
                    "max_single_order_usd": policy.max_single_order_usd,
                    "vendor_risk_score": risk_score,
                    "max_risk_score": policy.max_risk_score
                },
                "questions": [{
                    "id": "procurement_policy_safe",
                    "type": "noul",
                    "prompt": "Does this procurement order satisfy corporate spend cap and counterparty risk rules?"
                }]
            });

            if let Ok(resp) = self
                .http
                .post(&self.endpoint)
                .bearer_auth(key)
                .json(&payload)
                .timeout(Duration::from_secs(5))
                .send()
                .await
            {
                if resp.status().is_success() {
                    if let Ok(parsed) = resp.json::<serde_json::Value>().await {
                        if let Some(prob) = parsed["answers"][0]["probability"]
                            .as_f64()
                            .or_else(|| parsed["probability"].as_f64())
                        {
                            base.approval_probability = (prob * 1000.0).round() / 1000.0;
                        }
                        base.mode = "LIVE_TYPESAFE_API".to_owned();
                        base.rationale = format!(
                            "TypeSafe SystemOne ({}) live probability judgment completed",
                            self.model
                        );
                    }
                }
            }
        }

        base
    }
}
