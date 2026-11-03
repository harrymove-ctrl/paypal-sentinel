use std::collections::HashSet;

use hmac::{Hmac, Mac};
use sha2::Sha256;

use crate::{domain::SpendPolicy, error::SentinelError};

type HmacSha256 = Hmac<Sha256>;

#[derive(Debug, Clone)]
pub struct PolicyDecision {
    pub approved_summary: String,
    pub projected_daily_spend: f64,
}

pub fn evaluate_spend_policy(
    policy: &SpendPolicy,
    seen_keys: &HashSet<String>,
    current_daily_spend: f64,
    idempotency_key: &str,
    amount_usd: f64,
    merchant_risk_score: u8,
) -> Result<PolicyDecision, SentinelError> {
    let trimmed_key = idempotency_key.trim();
    if policy.require_idempotency_key && trimmed_key.len() < 6 {
        return Err(SentinelError::MissingIdempotencyKey);
    }

    if seen_keys.contains(trimmed_key) {
        return Err(SentinelError::DuplicateIdempotencyKey {
            key: trimmed_key.to_owned(),
        });
    }

    if !amount_usd.is_finite() || amount_usd <= 0.0 {
        return Err(SentinelError::InvalidAmount { amount: amount_usd });
    }

    if amount_usd > policy.max_single_order_usd {
        return Err(SentinelError::SingleOrderCapExceeded {
            amount: amount_usd,
            cap: policy.max_single_order_usd,
        });
    }

    let projected = current_daily_spend + amount_usd;
    if projected > policy.daily_budget_usd {
        return Err(SentinelError::DailyBudgetExceeded {
            projected,
            cap: policy.daily_budget_usd,
        });
    }

    if merchant_risk_score > policy.max_risk_score {
        return Err(SentinelError::MerchantRiskTooHigh {
            score: merchant_risk_score,
            max_allowed: policy.max_risk_score,
        });
    }

    Ok(PolicyDecision {
        approved_summary: format!(
            "PASS: {:.2} USD <= {:.2} USD cap | risk {} <= {} | key {}",
            amount_usd,
            policy.max_single_order_usd,
            merchant_risk_score,
            policy.max_risk_score,
            trimmed_key
        ),
        projected_daily_spend: projected,
    })
}

pub fn compute_webhook_hmac_hex(secret: &[u8], payload: &[u8]) -> Result<String, SentinelError> {
    let mut mac = HmacSha256::new_from_slice(secret).map_err(|e| {
        SentinelError::WebhookSignatureInvalid {
            reason: e.to_string(),
        }
    })?;
    mac.update(payload);
    Ok(hex::encode(mac.finalize().into_bytes()))
}

pub fn verify_webhook_hmac(
    secret: &[u8],
    payload: &[u8],
    signature_hex: &str,
) -> Result<(), SentinelError> {
    let signature_bytes =
        hex::decode(signature_hex.trim()).map_err(|_| SentinelError::WebhookSignatureInvalid {
            reason: "signature is not valid hexadecimal".to_owned(),
        })?;

    let mut mac = HmacSha256::new_from_slice(secret).map_err(|e| {
        SentinelError::WebhookSignatureInvalid {
            reason: e.to_string(),
        }
    })?;
    mac.update(payload);
    mac.verify_slice(&signature_bytes)
        .map_err(|_| SentinelError::WebhookSignatureInvalid {
            reason: "HMAC digest mismatch".to_owned(),
        })
}
