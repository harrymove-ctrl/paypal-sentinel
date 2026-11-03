export type CockpitVariant = "command" | "ledger" | "timeline";

export type SentinelMachineState =
  | "idle"
  | "seeding_sandbox"
  | "agent_reasoning"
  | "policy_guardrail_check"
  | "paypal_executing"
  | "settled"
  | "disputed"
  | "error";

export interface SpendPolicy {
  max_single_order_usd: number;
  daily_budget_usd: number;
  max_risk_score: number;
  require_idempotency_key: boolean;
}

export interface Channel3Product {
  id: string;
  sku: string;
  title: string;
  merchant_name: string;
  merchant_email: string;
  price_usd: number;
  category: string;
  risk_score: number;
  delivery_sla: string;
  brand_name?: string | null;
  image_url?: string | null;
  buy_url?: string | null;
  availability?: string | null;
}

export interface DecisionEngineMetadata {
  engine: string;
  mode: string;
  model: string;
  endpoint: string;
  approval_probability: number;
  risk_band: string;
  verdict: string;
  rationale: string;
}

export interface ShipmentTrackingInfo {
  tracking_number: string;
  carrier: string;
  status: string;
  updated_at: string;
}

export type OrderStatusValue =
  | "CREATED"
  | "COMPLETED"
  | "INVOICED"
  | "PAYOUT_SCHEDULED"
  | "DISPUTED"
  | "BLOCKED_BY_POLICY";

export interface PayPalOrderRecord {
  id: string;
  idempotency_key: string;
  intent_prompt: string;
  mcp_tool: string;
  merchant_name: string;
  merchant_email: string;
  item_title: string;
  amount_usd: number;
  currency: string;
  status: OrderStatusValue;
  risk_score: number;
  policy_verdict: string;
  sandbox_mode: string;
  approve_url: string;
  created_at: string;
  capture_id?: string | null;
  card_last4?: string | null;
  decision_engine?: DecisionEngineMetadata;
  shipment_tracking?: ShipmentTrackingInfo | null;
}

export interface PayoutMilestone {
  id: string;
  milestone_name: string;
  recipient_email: string;
  amount_usd: number;
  start_date: string;
  end_date: string;
  progress_pct: number;
  paypal_batch_id: string;
  state: string;
  tracking_number?: string | null;
  carrier?: string | null;
  shipment_status?: string | null;
}

export interface LedgerSnapshot {
  machine_state: SentinelMachineState;
  sandbox_mode: string;
  policy: SpendPolicy;
  daily_spent_usd: number;
  remaining_daily_budget_usd: number;
  orders: PayPalOrderRecord[];
  catalog: Channel3Product[];
  milestones: PayoutMilestone[];
  decision_engine?: DecisionEngineMetadata;
}

export interface McpToolDescriptor {
  name: string;
  source: string;
  category: string;
  description: string;
  rust_guardrail_enforced: boolean;
  input_schema: Record<string, unknown>;
  sample_arguments: Record<string, unknown>;
}

export interface McpToolsCatalogResponse {
  toolkit_package: string;
  remote_mcp_endpoint: string;
  sandbox_mode: string;
  total_tools: number;
  tools: McpToolDescriptor[];
}

export interface IntegrationStatusEntry {
  name: string;
  mode: string;
  configured: boolean;
  endpoint_or_package: string;
  notes: string;
}

export interface ApimaticContractDescriptor {
  generator: string;
  spec_version: string;
  idempotency_header: string;
  strict_type_validation: boolean;
  validated_operations: string[];
}

export interface IntegrationsStatusResponse {
  paypal_sandbox: IntegrationStatusEntry;
  paypal_mcp: IntegrationStatusEntry;
  channel3: IntegrationStatusEntry;
  ag_studio: IntegrationStatusEntry;
  bryntum: IntegrationStatusEntry;
  apimatic: IntegrationStatusEntry;
  typesafe_ai: IntegrationStatusEntry;
  render_workflows: IntegrationStatusEntry;
  apimatic_contract: ApimaticContractDescriptor;
}

export interface Channel3SearchResponse {
  query: string;
  channel3_mode: string;
  search_mode?: string;
  promo_code: string;
  max_price_filter_usd?: number;
  total_matches: number;
  products: Channel3Product[];
}
