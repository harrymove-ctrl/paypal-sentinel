use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum MachineState {
    Idle,
    SeedingSandbox,
    AgentReasoning,
    PolicyGuardrailCheck,
    PaypalExecuting,
    Settled,
    Disputed,
    Error,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SpendPolicy {
    pub max_single_order_usd: f64,
    pub daily_budget_usd: f64,
    pub max_risk_score: u8,
    pub require_idempotency_key: bool,
}

impl Default for SpendPolicy {
    fn default() -> Self {
        Self {
            max_single_order_usd: 500.0,
            daily_budget_usd: 2_500.0,
            max_risk_score: 35,
            require_idempotency_key: true,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Channel3Product {
    pub id: String,
    pub sku: String,
    pub title: String,
    pub merchant_name: String,
    pub merchant_email: String,
    pub price_usd: f64,
    pub category: String,
    pub risk_score: u8,
    pub delivery_sla: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub brand_name: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub image_url: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub buy_url: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub availability: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum OrderStatus {
    Created,
    Completed,
    Invoiced,
    PayoutScheduled,
    Disputed,
    BlockedByPolicy,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DecisionEngineMetadata {
    pub engine: String,
    pub mode: String,
    pub model: String,
    pub endpoint: String,
    pub approval_probability: f64,
    pub risk_band: String,
    pub verdict: String,
    pub rationale: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ShipmentTrackingInfo {
    pub tracking_number: String,
    pub carrier: String,
    pub status: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PayPalOrderRecord {
    pub id: String,
    pub idempotency_key: String,
    pub intent_prompt: String,
    pub mcp_tool: String,
    pub merchant_name: String,
    pub merchant_email: String,
    pub item_title: String,
    pub amount_usd: f64,
    pub currency: String,
    pub status: OrderStatus,
    pub risk_score: u8,
    pub policy_verdict: String,
    pub sandbox_mode: String,
    pub approve_url: String,
    pub created_at: String,
    #[serde(default)]
    pub capture_id: Option<String>,
    #[serde(default)]
    pub card_last4: Option<String>,
    pub decision_engine: DecisionEngineMetadata,
    #[serde(default)]
    pub shipment_tracking: Option<ShipmentTrackingInfo>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PayoutMilestone {
    pub id: String,
    pub milestone_name: String,
    pub recipient_email: String,
    pub amount_usd: f64,
    pub start_date: String,
    pub end_date: String,
    pub progress_pct: u8,
    pub paypal_batch_id: String,
    pub state: String,
    #[serde(default)]
    pub tracking_number: Option<String>,
    #[serde(default)]
    pub carrier: Option<String>,
    #[serde(default)]
    pub shipment_status: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct AgentExecuteRequest {
    pub prompt: String,
    pub idempotency_key: String,
    #[serde(default)]
    pub override_amount_usd: Option<f64>,
    #[serde(default)]
    pub preferred_sku: Option<String>,
    #[serde(default)]
    pub auto_capture: Option<bool>,
    #[serde(default)]
    pub direct_card_capture: Option<bool>,
    #[serde(default)]
    pub simulate_decline: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct AgentExecuteResponse {
    pub machine_state: MachineState,
    pub reasoning_steps: Vec<String>,
    pub order: PayPalOrderRecord,
    pub daily_spent_usd: f64,
    pub remaining_daily_budget_usd: f64,
    pub decision_engine: DecisionEngineMetadata,
}

#[derive(Debug, Clone, Deserialize)]
pub struct WebhookVerifyRequest {
    pub payload: String,
    pub signature_hex: String,
}

#[derive(Debug, Clone, Serialize)]
pub struct LedgerSnapshot {
    pub machine_state: MachineState,
    pub sandbox_mode: String,
    pub policy: SpendPolicy,
    pub daily_spent_usd: f64,
    pub remaining_daily_budget_usd: f64,
    pub orders: Vec<PayPalOrderRecord>,
    pub catalog: Vec<Channel3Product>,
    pub milestones: Vec<PayoutMilestone>,
    pub decision_engine: DecisionEngineMetadata,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct McpToolDescriptor {
    pub name: String,
    pub source: String,
    pub category: String,
    pub description: String,
    pub rust_guardrail_enforced: bool,
    pub input_schema: serde_json::Value,
    pub sample_arguments: serde_json::Value,
}

#[derive(Debug, Clone, Serialize)]
pub struct McpToolsCatalogResponse {
    pub toolkit_package: String,
    pub remote_mcp_endpoint: String,
    pub sandbox_mode: String,
    pub total_tools: usize,
    pub tools: Vec<McpToolDescriptor>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct McpInvokeRequest {
    pub tool: String,
    #[serde(default)]
    pub arguments: serde_json::Value,
    #[serde(default)]
    pub idempotency_key: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct McpInvokeResponse {
    pub tool: String,
    pub source: String,
    pub sandbox_mode: String,
    pub rust_guardrail_checked: bool,
    pub decision_engine: DecisionEngineMetadata,
    pub result: serde_json::Value,
}

#[derive(Debug, Clone, Serialize)]
pub struct Channel3SearchResponse {
    pub query: String,
    pub channel3_mode: String,
    pub search_mode: String,
    pub promo_code: String,
    pub max_price_filter_usd: f64,
    pub total_matches: usize,
    pub products: Vec<Channel3Product>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct AttachTrackingRequest {
    pub status: String,
    #[serde(default)]
    pub carrier: Option<String>,
    #[serde(default)]
    pub tracking_number: Option<String>,
    #[serde(default)]
    pub milestone_id: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct IntegrationStatusEntry {
    pub name: String,
    pub mode: String,
    pub configured: bool,
    pub endpoint_or_package: String,
    pub notes: String,
}

#[derive(Debug, Clone, Serialize)]
pub struct ApimaticContractDescriptor {
    pub generator: String,
    pub spec_version: String,
    pub idempotency_header: String,
    pub strict_type_validation: bool,
    pub validated_operations: Vec<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct IntegrationsStatusResponse {
    pub paypal_sandbox: IntegrationStatusEntry,
    pub paypal_mcp: IntegrationStatusEntry,
    pub channel3: IntegrationStatusEntry,
    pub ag_studio: IntegrationStatusEntry,
    pub bryntum: IntegrationStatusEntry,
    pub apimatic: IntegrationStatusEntry,
    pub typesafe_ai: IntegrationStatusEntry,
    pub render_workflows: IntegrationStatusEntry,
    pub apimatic_contract: ApimaticContractDescriptor,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DisputeEvidenceShieldResponse {
    pub dispute_id: String,
    pub order_id: String,
    pub reason: String,
    pub action_endpoint: String,
    pub upstream_gap_fixed: String,
    pub permit_id: String,
    pub prev_hash: String,
    pub decision_hash: String,
    pub authority_formula: String,
    pub carrier_or_deliverable_proof: String,
    pub win_probability: f64,
    pub status: String,
    pub evidence_items: Vec<String>,
}
