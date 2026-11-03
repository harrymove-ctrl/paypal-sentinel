use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde::Serialize;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum SentinelError {
    #[error("idempotency key (PayPal-Request-Id) is required and must be at least 6 characters")]
    MissingIdempotencyKey,

    #[error("duplicate idempotency key '{key}' blocked to prevent double PayPal charge")]
    DuplicateIdempotencyKey { key: String },

    #[error("amount {amount:.2} USD must be positive and finite")]
    InvalidAmount { amount: f64 },

    #[error("amount {amount:.2} USD exceeds single-order guardrail cap of {cap:.2} USD")]
    SingleOrderCapExceeded { amount: f64, cap: f64 },

    #[error("projected daily spend {projected:.2} USD exceeds daily treasury cap of {cap:.2} USD")]
    DailyBudgetExceeded { projected: f64, cap: f64 },

    #[error("merchant risk score {score} exceeds policy ceiling of {max_allowed}")]
    MerchantRiskTooHigh { score: u8, max_allowed: u8 },

    #[error("PayPal card capture declined ({code}): {reason}")]
    CardInstrumentDeclined { code: String, reason: String },

    #[error("unknown PayPal MCP tool '{tool}' requested")]
    UnknownMcpTool { tool: String },

    #[error("webhook HMAC-SHA256 signature verification failed: {reason}")]
    WebhookSignatureInvalid { reason: String },

    #[error("order '{order_id}' was not found in ledger")]
    OrderNotFound { order_id: String },

    #[error("upstream PayPal Sandbox request failed: {0}")]
    PayPalUpstream(String),
}

#[derive(Debug, Serialize)]
pub struct ErrorEnvelope {
    pub error_code: &'static str,
    pub message: String,
    pub machine_state: &'static str,
    pub recoverable: bool,
}

impl SentinelError {
    pub fn code_and_status(&self) -> (&'static str, StatusCode, &'static str, bool) {
        match self {
            Self::MissingIdempotencyKey => (
                "MISSING_IDEMPOTENCY_KEY",
                StatusCode::BAD_REQUEST,
                "policy_guardrail_check",
                true,
            ),
            Self::DuplicateIdempotencyKey { .. } => (
                "DUPLICATE_IDEMPOTENCY_KEY",
                StatusCode::CONFLICT,
                "policy_guardrail_check",
                true,
            ),
            Self::InvalidAmount { .. } => (
                "INVALID_AMOUNT",
                StatusCode::BAD_REQUEST,
                "policy_guardrail_check",
                true,
            ),
            Self::SingleOrderCapExceeded { .. } => (
                "SINGLE_ORDER_CAP_EXCEEDED",
                StatusCode::UNPROCESSABLE_ENTITY,
                "policy_guardrail_check",
                true,
            ),
            Self::DailyBudgetExceeded { .. } => (
                "DAILY_BUDGET_EXCEEDED",
                StatusCode::UNPROCESSABLE_ENTITY,
                "policy_guardrail_check",
                true,
            ),
            Self::MerchantRiskTooHigh { .. } => (
                "MERCHANT_RISK_TOO_HIGH",
                StatusCode::FORBIDDEN,
                "policy_guardrail_check",
                true,
            ),
            Self::CardInstrumentDeclined { .. } => (
                "INSTRUMENT_DECLINED",
                StatusCode::UNPROCESSABLE_ENTITY,
                "error",
                true,
            ),
            Self::UnknownMcpTool { .. } => (
                "UNKNOWN_MCP_TOOL",
                StatusCode::BAD_REQUEST,
                "error",
                true,
            ),
            Self::WebhookSignatureInvalid { .. } => (
                "WEBHOOK_SIGNATURE_INVALID",
                StatusCode::UNAUTHORIZED,
                "error",
                false,
            ),
            Self::OrderNotFound { .. } => (
                "ORDER_NOT_FOUND",
                StatusCode::NOT_FOUND,
                "error",
                true,
            ),
            Self::PayPalUpstream(_) => (
                "PAYPAL_UPSTREAM_ERROR",
                StatusCode::BAD_GATEWAY,
                "error",
                true,
            ),
        }
    }
}

impl IntoResponse for SentinelError {
    fn into_response(self) -> Response {
        let (error_code, status, machine_state, recoverable) = self.code_and_status();
        let payload = ErrorEnvelope {
            error_code,
            message: self.to_string(),
            machine_state,
            recoverable,
        };
        (status, Json(payload)).into_response()
    }
}
