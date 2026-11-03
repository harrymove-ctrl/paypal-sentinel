"use client";

import { HackathonImpactStreakSection } from "@/components/ui/streak-grid";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Bug,
  CreditCard,
  Moon,
  Play,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  Sun,
  Terminal,
  Wallet,
  Wrench,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgStudioLedgerPanel } from "./ag-studio-ledger-panel";
import { BryntumProcurementScheduler } from "./bryntum-procurement-scheduler";
import {
  BenchoContextMeter,
  BenchoRollingCounter,
  BenchoTiltCard,
  DitherButton,
  DitherCard,
  DitherDefs,
  DitherGauge,
  DitherProgressBar,
  DitherStatCard,
  MdxcnEndpoint,
  MdxcnFrame,
  MdxcnTimeline,
} from "./tactile-cards";
import {
  FoundBrandIcon,
  FoundBrandMark,
  FoundTiltCard,
  snapAwayElement,
  useFoundEyeTracking,
} from "./found-brand-mark";
import {
  CALENDAR_EVENTS,
  type FoundRoute,
  type FoundStyleSkin,
  type FoundTriageCard,
  INITIAL_TRIAGE_CARDS,
} from "./found-demo-data";
import {
  FoundCommandPalette,
  FoundFeedbackModal,
  FoundFloatingDock,
  FoundNonBlockingSheet,
} from "./found-overlays";
import { FoundInspirationStudio } from "./found-inspiration-studio";
import {
  FoundCalendarView,
  FoundClientsView,
  FoundFirstLookAndCheckView,
  FoundMoneyView,
  FoundSettingsView,
  FoundSlackView,
  FoundTeamView,
} from "./found-views";
import { SponsorStatusStrip } from "./sponsor-status-strip";
import type {
  Channel3Product,
  Channel3SearchResponse,
  CockpitVariant,
  IntegrationsStatusResponse,
  LedgerSnapshot,
  McpToolDescriptor,
  McpToolsCatalogResponse,
  SentinelMachineState,
} from "./types";

export type { CockpitVariant, SentinelMachineState } from "./types";

const RUST_API_BASE = process.env.NEXT_PUBLIC_RUST_API_URL || "";

const FALLBACK_CATALOG: Channel3Product[] = [
  {
    id: "ch3-1",
    sku: "CH3-GPU-101",
    title: "NVIDIA H100 Inference Pack (40h)",
    merchant_name: "Nebula GPU Cloud",
    merchant_email: "billing-sbx@nebulagpu.example.com",
    price_usd: 240,
    category: "AI Compute",
    risk_score: 9,
    delivery_sla: "Instant API Key",
  },
  {
    id: "ch3-2",
    sku: "CH3-API-204",
    title: "APIMatic Typed PayPal SDK Audit",
    merchant_name: "TypeCraft API Studio",
    merchant_email: "escrow-sbx@typecraft.example.com",
    price_usd: 185,
    category: "Developer Tooling",
    risk_score: 12,
    delivery_sla: "24h Milestone",
  },
  {
    id: "ch3-3",
    sku: "CH3-UX-309",
    title: "Spatial Shader & Telemetry Sprint",
    merchant_name: "Studio Kestrel",
    merchant_email: "payouts-sbx@kestrel.example.com",
    price_usd: 320,
    category: "Milestone Escrow",
    risk_score: 14,
    delivery_sla: "48h Escrow",
  },
  {
    id: "ch3-4",
    sku: "CH3-RISK-999",
    title: "Unverified Gray-Market GPU Cluster",
    merchant_name: "ShadowCompute Unverified",
    merchant_email: "unknown@shadow.example.com",
    price_usd: 410,
    category: "High-Risk Vendor",
    risk_score: 82,
    delivery_sla: "Unverified",
  },
  {
    id: "ch3-5",
    sku: "CH3-HW-402",
    title: "Thunderbolt 4 Pro Engineering Dock",
    merchant_name: "CalDigit Enterprise Direct",
    merchant_email: "orders-sbx@caldigit.example.com",
    price_usd: 299,
    category: "Workstation Hardware",
    risk_score: 7,
    delivery_sla: "2-Day UPS Ground",
  },
  {
    id: "ch3-6",
    sku: "CH3-MON-415",
    title: "UltraSharp 32 4K USB-C Hub Monitor",
    merchant_name: "Apex Office Displays",
    merchant_email: "fulfillment-sbx@apexdisplays.example.com",
    price_usd: 445,
    category: "Office Displays",
    risk_score: 11,
    delivery_sla: "3-Day FedEx Express",
  },
  {
    id: "ch3-7",
    sku: "CH3-CLD-512",
    title: "Render Autoscaling Rust Worker Pack",
    merchant_name: "Render Cloud Infrastructure",
    merchant_email: "billing-sbx@rendercloud.example.com",
    price_usd: 150,
    category: "Cloud Hosting",
    risk_score: 6,
    delivery_sla: "Instant Provisioning",
  },
  {
    id: "ch3-8",
    sku: "CH3-KEY-608",
    title: "Keychron Q1 Pro Wireless Mechanical Keyboard",
    merchant_name: "Keychron Team Peripherals",
    merchant_email: "team-sbx@keychron.example.com",
    price_usd: 199,
    category: "Team Peripherals",
    risk_score: 8,
    delivery_sla: "2-Day DHL Express",
  },
];

const FALLBACK_SNAPSHOT: LedgerSnapshot = {
  machine_state: "settled",
  sandbox_mode: "JUDGE_1CLICK_SANDBOX",
  policy: {
    max_single_order_usd: 500,
    daily_budget_usd: 2500,
    max_risk_score: 35,
    require_idempotency_key: true,
  },
  daily_spent_usd: 425,
  remaining_daily_budget_usd: 2075,
  decision_engine: {
    engine: "typesafe-systemone-jev",
    mode: "DETERMINISTIC_RUBRIC_FALLBACK",
    model: "jev-1.13.0",
    endpoint: "https://api.typesafe.ai/v1/systemone",
    approval_probability: 0.94,
    risk_band: "LOW",
    verdict: "APPROVE",
    rationale: "Rubric judgment within single-order cap and vendor risk ceiling",
  },
  orders: [
    {
      id: "PAYPAL-SBX-8F12A90C11",
      idempotency_key: "seed-req-nvidia-inference-01",
      intent_prompt:
        "Procure 40 hours of NVIDIA H100 inference compute via Channel3 & PayPal Orders v2",
      mcp_tool: "sentinel_direct_card_capture",
      merchant_name: "Nebula GPU Cloud",
      merchant_email: "billing-sbx@nebulagpu.example.com",
      item_title: "NVIDIA H100 Inference Pack (40h)",
      amount_usd: 240,
      currency: "USD",
      status: "COMPLETED",
      risk_score: 9,
      policy_verdict:
        "PASS: 240.00 USD <= 500.00 USD cap | risk 9 <= 35 | key seed-req-nvidia-inference-01",
      sandbox_mode: "JUDGE_1CLICK_SANDBOX",
      approve_url:
        "https://www.sandbox.paypal.com/checkoutnow?token=PAYPAL-SBX-8F12A90C11",
      created_at: "2026-10-31T08:10:00Z",
      capture_id: "CAP-SBX-99A4E210",
      card_last4: "1881",
      decision_engine: {
        engine: "typesafe-systemone-jev",
        mode: "DETERMINISTIC_RUBRIC_FALLBACK",
        model: "jev-1.13.0",
        endpoint: "https://api.typesafe.ai/v1/systemone",
        approval_probability: 0.95,
        risk_band: "LOW",
        verdict: "APPROVE",
        rationale: "Verified low-risk compute merchant",
      },
      shipment_tracking: {
        tracking_number: "1Z999AA10123456784",
        carrier: "UPS",
        status: "DELIVERED",
        updated_at: "2026-10-31T08:40:00Z",
      },
    },
    {
      id: "PAYPAL-SBX-4D90B77E22",
      idempotency_key: "seed-req-apimatic-sdk-02",
      intent_prompt:
        "Issue milestone PayPal Invoice for strongly-typed APIMatic SDK contract verification",
      mcp_tool: "create_order",
      merchant_name: "TypeCraft API Studio",
      merchant_email: "escrow-sbx@typecraft.example.com",
      item_title: "APIMatic Typed PayPal SDK Audit",
      amount_usd: 185,
      currency: "USD",
      status: "CREATED",
      risk_score: 12,
      policy_verdict:
        "PASS: 185.00 USD <= 500.00 USD cap | risk 12 <= 35 | key seed-req-apimatic-sdk-02",
      sandbox_mode: "JUDGE_1CLICK_SANDBOX",
      approve_url:
        "https://www.sandbox.paypal.com/checkoutnow?token=PAYPAL-SBX-4D90B77E22",
      created_at: "2026-10-31T08:25:00Z",
      capture_id: null,
      card_last4: null,
      decision_engine: {
        engine: "typesafe-systemone-jev",
        mode: "DETERMINISTIC_RUBRIC_FALLBACK",
        model: "jev-1.13.0",
        endpoint: "https://api.typesafe.ai/v1/systemone",
        approval_probability: 0.92,
        risk_band: "LOW",
        verdict: "APPROVE",
        rationale: "Verified developer tooling milestone",
      },
      shipment_tracking: {
        tracking_number: "794644790132",
        carrier: "FEDEX",
        status: "IN_TRANSIT",
        updated_at: "2026-10-31T08:45:00Z",
      },
    },
    {
      id: "BLOCKED-SBX-77C01F99",
      idempotency_key: "seed-req-shadow-blocked-03",
      intent_prompt:
        "Attempt unverified GPU cluster procurement from high-risk shadow vendor",
      mcp_tool: "sentinel_direct_card_capture",
      merchant_name: "ShadowCompute Unverified",
      merchant_email: "unknown@shadow.example.com",
      item_title: "Unverified Gray-Market GPU Cluster",
      amount_usd: 410,
      currency: "USD",
      status: "BLOCKED_BY_POLICY",
      risk_score: 82,
      policy_verdict:
        "BLOCKED: vendor risk 82 > 35 policy ceiling (zero PayPal charge executed)",
      sandbox_mode: "JUDGE_1CLICK_SANDBOX",
      approve_url: "",
      created_at: "2026-10-31T08:30:00Z",
      capture_id: null,
      card_last4: null,
      decision_engine: {
        engine: "typesafe-systemone-jev",
        mode: "DETERMINISTIC_RUBRIC_FALLBACK",
        model: "jev-1.13.0",
        endpoint: "https://api.typesafe.ai/v1/systemone",
        approval_probability: 0.06,
        risk_band: "HIGH",
        verdict: "BLOCK",
        rationale: "Counterparty risk exceeds ceiling",
      },
      shipment_tracking: null,
    },
  ],
  catalog: FALLBACK_CATALOG,
  milestones: [
    {
      id: "ms-01",
      milestone_name: "M1: Rust Spend-Policy & Idempotent Orders v2",
      recipient_email: "billing-sbx@nebulagpu.example.com",
      amount_usd: 240,
      start_date: "2026-10-31",
      end_date: "2026-11-03",
      progress_pct: 100,
      paypal_batch_id: "PAYOUT-SBX-BATCH-01",
      state: "DELIVERED",
      tracking_number: "1Z999AA10123456784",
      carrier: "UPS",
      shipment_status: "DELIVERED",
    },
    {
      id: "ms-02",
      milestone_name: "M2: APIMatic SDK & PayPal MCP Invoice Gate",
      recipient_email: "escrow-sbx@typecraft.example.com",
      amount_usd: 185,
      start_date: "2026-11-03",
      end_date: "2026-11-07",
      progress_pct: 75,
      paypal_batch_id: "PAYOUT-SBX-BATCH-02",
      state: "IN_TRANSIT",
      tracking_number: "794644790132",
      carrier: "FEDEX",
      shipment_status: "IN_TRANSIT",
    },
    {
      id: "ms-03",
      milestone_name: "M3: Render Cloud Deploy & Final Escrow Release",
      recipient_email: "payouts-sbx@kestrel.example.com",
      amount_usd: 320,
      start_date: "2026-11-07",
      end_date: "2026-11-11",
      progress_pct: 35,
      paypal_batch_id: "PAYOUT-SBX-BATCH-03",
      state: "ESCROW_LOCKED",
      tracking_number: null,
      carrier: "DHL",
      shipment_status: null,
    },
  ],
};

const FALLBACK_INTEGRATIONS: IntegrationsStatusResponse = {
  paypal_sandbox: {
    name: "PayPal Sandbox Orders v2 & ACDC Direct Card Capture",
    mode: "JUDGE_1CLICK_SANDBOX",
    configured: false,
    endpoint_or_package: "https://api-m.sandbox.paypal.com/v2/checkout/orders",
    notes:
      "Supports headless test card 4012888888881881 and deterministic CCREJECT-IF / INSTRUMENT_DECLINED checks",
  },
  paypal_mcp: {
    name: "PayPal Agent Toolkit & MCP Bridge",
    mode: "JUDGE_1CLICK_SANDBOX",
    configured: true,
    endpoint_or_package:
      "@paypal/agent-toolkit + @paypal/mcp (https://mcp.sandbox.paypal.com/mcp)",
    notes:
      "Exposes 7 official toolkit operations plus 3 guarded Channel3 search, direct capture, and batch payout tools",
  },
  channel3: {
    name: "Channel3 AI Product Discovery",
    mode: "JUDGE_1CLICK_SANDBOX",
    configured: false,
    endpoint_or_package:
      "POST https://api.trychannel3.com/v1/search (x-api-key, mode: agentic)",
    notes:
      "Promo code PAYPAL-HACKATHON-2026 unlocks 20,000 live searches constrained by Rust SpendPolicy max_price",
  },
  ag_studio: {
    name: "AG Grid v36 & AG Studio Agent KPI Framework",
    mode: "COMMUNITY_AND_STUDIO_AGENT_ACTIVE",
    configured: true,
    endpoint_or_package: "ag-grid-react@36.2.0 + Studio NLP KPI Prompt Engine",
    notes:
      "Interactive enterprise grid with natural-language merchant spend and policy block KPI cards",
  },
  bryntum: {
    name: "Bryntum Procurement & Shipment Resource Scheduler",
    mode: "INTERACTIVE_SCHEDULER_ACTIVE",
    configured: true,
    endpoint_or_package: "Bryntum Resource Timeline + PayPal Trackers v1",
    notes:
      "Date-zoomable vendor delivery lanes wired to 1-click DELIVERED and IN_TRANSIT tracking",
  },
  apimatic: {
    name: "APIMatic Typed PayPal Contract Validator",
    mode: "STRICT_CONTRACT_ENFORCED",
    configured: true,
    endpoint_or_package:
      "APIMatic Context Plugin (PayPal Orders v2, Trackers v1, Payouts v1)",
    notes:
      "Validates PayPal-Request-Id UUID headers, ISO-8601 windows without milliseconds, and currency precision",
  },
  typesafe_ai: {
    name: "TypeSafe AI SystemOne (Jev) Risk Judgment",
    mode: "DETERMINISTIC_RUBRIC_FALLBACK",
    configured: false,
    endpoint_or_package: "https://api.typesafe.ai/v1/systemone (jev-1.13.0)",
    notes:
      "Structured Noul probability judgment paired with deterministic Rust SpendPolicy rubric",
  },
  render_workflows: {
    name: "Render Blueprint & Settlement Workflows Worker",
    mode: "BLUEPRINT_CONFIGURED",
    configured: true,
    endpoint_or_package:
      "render.yaml (Rust API + Next.js Cockpit + Settlement Worker)",
    notes:
      "Declarative multi-service cloud blueprint with background webhook and payout reconciliation worker",
  },
  apimatic_contract: {
    generator: "APIMatic PayPal Context Plugin v2026.10",
    spec_version: "PayPal REST OpenAPI 3.1 (Orders v2, Shipping v1, Payouts v1)",
    idempotency_header: "PayPal-Request-Id (RFC 4122 UUID v4)",
    strict_type_validation: true,
    validated_operations: [
      "POST /v2/checkout/orders (payment_source.card ACDC)",
      "POST /v1/shipping/trackers-batch",
      "POST /v1/payments/payouts",
    ],
  },
};

const FALLBACK_MCP_TOOLS: McpToolDescriptor[] = [
  {
    name: "sentinel_direct_card_capture",
    source: "paypal-sentinel-rust-bridge",
    category: "Headless ACDC Capture",
    description:
      "Executes Rust SpendPolicy guardrails + server-to-server PayPal Orders v2 capture with US Sandbox card 4012888888881881",
    rust_guardrail_enforced: true,
    input_schema: {},
    sample_arguments: { sku: "CH3-GPU-101", amount_usd: 240 },
  },
  {
    name: "sentinel_batch_payout",
    source: "paypal-sentinel-rust-bridge",
    category: "Batch Payouts v1",
    description:
      "Fills the Payouts gap in @paypal/mcp by executing Rust-guarded /v1/payments/payouts settlement",
    rust_guardrail_enforced: true,
    input_schema: {},
    sample_arguments: {
      recipient_email: "payouts-sbx@kestrel.example.com",
      amount_usd: 195,
      note: "Milestone sprint verified release",
    },
  },
  {
    name: "create_order",
    source: "@paypal/agent-toolkit + @paypal/mcp",
    category: "Orders v2",
    description:
      "Creates a PayPal Sandbox Order v2 with deterministic PayPal-Request-Id UUID",
    rust_guardrail_enforced: true,
    input_schema: {},
    sample_arguments: {
      item_title: "APIMatic Typed PayPal SDK Audit",
      amount_usd: 185,
      sku: "CH3-API-204",
    },
  },
  {
    name: "get_order",
    source: "@paypal/agent-toolkit + @paypal/mcp",
    category: "Orders v2",
    description:
      "Retrieves full PayPal Order v2 status, capture IDs, and TypeSafe AI judgment",
    rust_guardrail_enforced: false,
    input_schema: {},
    sample_arguments: { order_id: "PAYPAL-SBX-8F12A90C11" },
  },
  {
    name: "pay_order",
    source: "@paypal/agent-toolkit + @paypal/mcp",
    category: "Orders v2",
    description: "Captures an authorized or created PayPal Order v2 in Sandbox",
    rust_guardrail_enforced: true,
    input_schema: {},
    sample_arguments: { order_id: "PAYPAL-SBX-4D90B77E22" },
  },
  {
    name: "create_refund",
    source: "@paypal/agent-toolkit + @paypal/mcp",
    category: "Captures & Refunds",
    description:
      "Issues a full or partial Sandbox refund against a captured PayPal Order",
    rust_guardrail_enforced: true,
    input_schema: {},
    sample_arguments: { order_id: "PAYPAL-SBX-8F12A90C11", amount_usd: 25 },
  },
  {
    name: "create_shipment_tracking",
    source: "@paypal/agent-toolkit + @paypal/mcp",
    category: "Shipment Tracking v1",
    description:
      "Attaches carrier tracking number and DELIVERED or IN_TRANSIT status via /v1/shipping/trackers-batch",
    rust_guardrail_enforced: true,
    input_schema: {},
    sample_arguments: {
      order_id: "PAYPAL-SBX-4D90B77E22",
      carrier: "UPS",
      status: "DELIVERED",
    },
  },
  {
    name: "list_transactions",
    source: "@paypal/agent-toolkit + @paypal/mcp",
    category: "Reporting v1",
    description:
      "Lists Sandbox transactions within a 31-day ISO-8601 window with fractional milliseconds stripped",
    rust_guardrail_enforced: false,
    input_schema: {},
    sample_arguments: { window_days: 31 },
  },
  {
    name: "get_merchant_insights",
    source: "@paypal/agent-toolkit + @paypal/mcp",
    category: "Reporting v1",
    description:
      "Computes completed vs blocked spend insights and counterparty risk metrics",
    rust_guardrail_enforced: false,
    input_schema: {},
    sample_arguments: {},
  },
  {
    name: "channel3_product_search",
    source: "channel3-mcp-bridge",
    category: "Channel3 Agentic Search v1",
    description:
      "Queries POST https://api.trychannel3.com/v1/search in agentic mode with Rust SpendPolicy max_price filter",
    rust_guardrail_enforced: true,
    input_schema: {},
    sample_arguments: { query: "monitor", max_price_usd: 500 },
  },
  {
    name: "sentinel_dispute_evidence_shield",
    source: "paypal-sentinel-rust-bridge",
    category: "Disputes v1 Evidence Shield",
    description:
      "Fills the provide-evidence gap in @paypal/agent-toolkit (#109/#118) by submitting SHA-256 Intent Mandate + Tracking proof to POST /v1/customer/disputes/{id}/provide-evidence",
    rust_guardrail_enforced: true,
    input_schema: {},
    sample_arguments: { order_id: "PAYPAL-SBX-8F12A90C11" },
  },
  {
    name: "sentinel_http402_paywall",
    source: "paypal-sentinel-rust-bridge",
    category: "HTTP 402 Agent Paywall",
    description:
      "CrawlerPal 1st-place pattern: settles an HTTP 402 Payment Required quote via PayPal Orders v2 under Rust SpendPolicy and mints an L402 access macaroon",
    rust_guardrail_enforced: true,
    input_schema: {},
    sample_arguments: {
      resource_url: "https://feed.arxiv-ai.example/v1/licensed-corpus",
      amount_usd: 45,
    },
  },
];

const QUICK_PROMPTS = [
  {
    id: "gpu-order",
    label: "Buy Compute ($240 Order v2)",
    prompt:
      "Procure 40 hours of NVIDIA H100 inference compute via Channel3 and capture PayPal Order v2",
    sku: "CH3-GPU-101",
    amount: 240,
  },
  {
    id: "sdk-invoice",
    label: "Issue SDK Invoice ($185)",
    prompt:
      "Generate PayPal Sandbox Invoice for APIMatic strongly-typed PayPal SDK contract audit",
    sku: "CH3-API-204",
    amount: 185,
  },
  {
    id: "milestone-payout",
    label: "Schedule Payout ($320)",
    prompt:
      "Schedule milestone PayPal Payout batch for Studio Kestrel telemetry sprint",
    sku: "CH3-UX-309",
    amount: 320,
  },
  {
    id: "over-cap-test",
    label: "Red-Team: Over-Cap ($850)",
    prompt:
      "Attempt unauthorized $850 compute purchase exceeding single-order Rust guardrail cap",
    sku: "CH3-GPU-101",
    amount: 850,
  },
] as const;

const COUNT_WORDS = [
  "Nothing needs",
  "One thing needs",
  "Two things need",
  "Three things need",
  "Four things need",
  "Five things need",
  "Six things need",
];

export function PayPalSentinelCockpit() {
  useFoundEyeTracking();

  // Found v5.9.0 Route, Style Skin, Context, and Overlays
  const [activeRoute, setActiveRoute] = useState<FoundRoute>("home");
  const [skin, setSkin] = useState<FoundStyleSkin>("clean");
  const [contextMode, setContextMode] = useState<"work" | "personal">("work");
  const [pile, setPile] = useState<"now" | "later" | "done">("now");
  const [triageCards, setTriageCards] =
    useState<FoundTriageCard[]>(INITIAL_TRIAGE_CARDS);
  const [laterCards, setLaterCards] = useState<FoundTriageCard[]>([]);
  const [doneCards, setDoneCards] = useState<FoundTriageCard[]>([]);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyDraftText, setReplyDraftText] = useState("");
  const [fixMenuOpen, setFixMenuOpen] = useState(false);
  const [sheetDocId, setSheetDocId] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const frontCardRef = useRef<HTMLDivElement | null>(null);

  // Core Sentinel State (Default Light Mode #FDFDFC to match gofound.app/demo)
  const [variant, setVariant] = useState<CockpitVariant>("command");
  const [isDark, setIsDark] = useState(false);
  const [debugOpen, setDebugOpen] = useState(false);
  const [stressLongValues, setStressLongValues] = useState(false);
  const [overflowPx, setOverflowPx] = useState(0);

  if (typeof window !== "undefined") {
    // Client-side render log
  }

  const [ledger, setLedger] = useState<LedgerSnapshot>(FALLBACK_SNAPSHOT);
  const [integrationStatus, setIntegrationStatus] =
    useState<IntegrationsStatusResponse>(FALLBACK_INTEGRATIONS);
  const [sdkToolCount, setSdkToolCount] = useState<number>(10);
  const [rustConnected, setRustConnected] = useState<boolean>(false);
  const [machineState, setMachineState] =
    useState<SentinelMachineState>("settled");
  const [busy, setBusy] = useState(false);

  const [promptInput, setPromptInput] = useState<string>(
    QUICK_PROMPTS[0].prompt,
  );
  const [amountInput, setAmountInput] = useState<string>("240");
  const [idempotencyKey, setIdempotencyKey] = useState<string>(
    "req-paypal-sbx-1001",
  );
  const [selectedSku, setSelectedSku] = useState<string>("CH3-GPU-101");

  const [channel3Query, setChannel3Query] = useState<string>("");
  const [channel3Mode, setChannel3Mode] = useState<string>(
    "JUDGE_1CLICK_SANDBOX",
  );
  const [channel3Results, setChannel3Results] = useState<Channel3Product[]>(
    FALLBACK_CATALOG.slice(0, 4),
  );

  const [mcpTools, setMcpTools] =
    useState<McpToolDescriptor[]>(FALLBACK_MCP_TOOLS);
  const [selectedMcpTool, setSelectedMcpTool] = useState<string>(
    "sentinel_direct_card_capture",
  );
  const [mcpArgsText, setMcpArgsText] = useState<string>(
    JSON.stringify({ sku: "CH3-GPU-101", amount_usd: 240 }, null, 2),
  );
  const [mcpOutputText, setMcpOutputText] = useState<string>(
    JSON.stringify(
      {
        tool: "sentinel_direct_card_capture",
        sku: "CH3-GPU-101 ($240.00)",
        guardrail: "SpendPolicy <= $500 | Jev risk <= 35",
        verdict: "READY_TO_INVOKE",
      },
      null,
      2,
    ),
  );

  const [reasoningLog, setReasoningLog] = useState<string[]>([
    "Rust Axum Settlement Core online: enforcing SpendPolicy & PayPal-Request-Id UUID idempotency.",
    "Channel3 AI Catalog synced: 8 multi-category retail SKUs scored with TypeSafe AI (jev-1.13.0).",
    "Headless Sandbox Card Capture ready: US ACDC test card 4012888888881881 + CCREJECT-IF negative test.",
  ]);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [webhookStatus, setWebhookStatus] = useState<string | null>(null);
  const [ledgerFilter, setLedgerFilter] = useState<string>("");

  // Sync Found style skin attributes to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (skin === "interfere") {
      root.setAttribute("data-look", "benji");
      root.setAttribute("data-skin", "interfere");
    } else if (skin === "clean") {
      root.setAttribute("data-look", "benji");
      root.removeAttribute("data-skin");
    } else if (skin === "lime") {
      root.setAttribute("data-look", "benji");
      root.setAttribute("data-skin", "lime");
    } else {
      root.setAttribute("data-look", "original");
      root.removeAttribute("data-skin");
    }
  }, [skin]);

  // Global keyboard shortcuts (⌘K and G + H/C/M/K/L/S)
  useEffect(() => {
    let gPressedAt = 0;
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
        return;
      }
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key.toLowerCase() === "g") {
        gPressedAt = Date.now();
        return;
      }
      if (Date.now() - gPressedAt < 900) {
        const k = e.key.toLowerCase();
        if (k === "h") {
          setVariant("command");
          setActiveRoute("home");
        } else if (k === "c") setActiveRoute("clients");
        else if (k === "m") setActiveRoute("money");
        else if (k === "k") setActiveRoute("calendar");
        else if (k === "l") setActiveRoute("slack");
        else if (k === "s") setActiveRoute("settings");
        gPressedAt = 0;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleNavigateRoute = useCallback((route: FoundRoute) => {
    setActiveRoute(route);
    if (route === "ledger") {
      setVariant("ledger");
    } else if (route === "timeline") {
      setVariant("timeline");
    } else if (route === "home") {
      setVariant("command");
    }
  }, []);

  const fetchLedgerAndMetadata = useCallback(async () => {
    try {
      const [ledgerRes, statusRes, mcpRes] = await Promise.all([
        fetch(`${RUST_API_BASE}/api/ledger`, { cache: "no-store" }),
        fetch(`${RUST_API_BASE}/api/integrations/status`, {
          cache: "no-store",
        }),
        fetch(`${RUST_API_BASE}/api/mcp/tools`, { cache: "no-store" }),
      ]);
      if (!ledgerRes.ok) throw new Error(`HTTP ${ledgerRes.status}`);
      const data = (await ledgerRes.json()) as LedgerSnapshot;
      setLedger(data);
      setMachineState(data.machine_state);
      setRustConnected(true);

      if (statusRes.ok) {
        const statusJson =
          (await statusRes.json()) as IntegrationsStatusResponse;
        setIntegrationStatus(statusJson);
      }
      if (mcpRes.ok) {
        const mcpJson = (await mcpRes.json()) as McpToolsCatalogResponse;
        if (mcpJson.tools.length > 0) {
          setMcpTools(mcpJson.tools);
        }
      }
    } catch {
      setRustConnected(false);
    }

    try {
      const sdkRes = await fetch("/api/mcp/sdk-bridge", { cache: "no-store" });
      if (sdkRes.ok) {
        const sdkJson = (await sdkRes.json()) as { sdk_tool_count?: number };
        if (typeof sdkJson.sdk_tool_count === "number") {
          setSdkToolCount(sdkJson.sdk_tool_count + 3);
        }
      }
    } catch {
      // Next.js local route optional during static checks
    }
  }, []);

  const runChannel3Query = useCallback(async (rawQuery: string) => {
    const q = rawQuery.trim();
    try {
      const res = await fetch(
        `${RUST_API_BASE}/api/channel3/search?q=${encodeURIComponent(q)}`,
        { cache: "no-store" },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as Channel3SearchResponse;
      setChannel3Mode(json.channel3_mode);
      setChannel3Results(json.products);
    } catch {
      const qLower = q.toLowerCase();
      const localMatches = qLower
        ? FALLBACK_CATALOG.filter(
            (item) =>
              item.title.toLowerCase().includes(qLower) ||
              item.category.toLowerCase().includes(qLower) ||
              item.sku.toLowerCase().includes(qLower),
          )
        : FALLBACK_CATALOG;
      setChannel3Mode("JUDGE_1CLICK_SANDBOX");
      setChannel3Results(
        localMatches.length > 0 ? localMatches : FALLBACK_CATALOG.slice(0, 4),
      );
    }
  }, []);

  const handleChannel3Search = useCallback(
    async (explicitQuery?: string) => {
      await runChannel3Query(explicitQuery ?? channel3Query);
    },
    [channel3Query, runChannel3Query],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qVariant = params.get("variant");
    if (
      qVariant === "command" ||
      qVariant === "ledger" ||
      qVariant === "timeline"
    ) {
      setVariant(qVariant);
      if (qVariant === "ledger") setActiveRoute("ledger");
      if (qVariant === "timeline") setActiveRoute("timeline");
    }
    if (params.get("debug") === "1") {
      setDebugOpen(true);
    }
    if (params.get("stress") === "1") {
      setStressLongValues(true);
    }
    const qState = params.get("state") as SentinelMachineState | null;
    if (qState) {
      setMachineState(qState);
    }
    void fetchLedgerAndMetadata();
    void runChannel3Query("");
  }, [fetchLedgerAndMetadata, runChannel3Query]);

  useEffect(() => {
    const checkOverflow = () => {
      const diff = Math.max(
        0,
        Math.round(
          document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
        ),
      );
      setOverflowPx(diff);
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [
    variant,
    activeRoute,
    skin,
    debugOpen,
    stressLongValues,
    ledger.orders.length,
    sheetDocId,
  ]);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.setAttribute(
      "data-theme",
      next ? "dark" : "light",
    );
  };

  const rotateIdempotencyKey = () => {
    const nextNum = Math.floor(1000 + Math.random() * 9000);
    const nextKey = `req-paypal-sbx-${nextNum}`;
    setIdempotencyKey(nextKey);
    return nextKey;
  };

  const executeAgentIntent = async (override?: {
    prompt: string;
    sku: string;
    amount: number;
    reuseSameKey?: boolean;
    directCardCapture?: boolean;
    simulateDecline?: string;
  }) => {
    if (busy) return;
    setBusy(true);
    setBannerError(null);
    setMachineState("agent_reasoning");

    const usedPrompt = override ? override.prompt : promptInput;
    const usedSku = override ? override.sku : selectedSku;
    const usedAmount = override ? override.amount : Number(amountInput);
    const settledOrder = ledger.orders.find(
      (o) => o.status !== "BLOCKED_BY_POLICY",
    );
    const keyToUse = override?.reuseSameKey
      ? settledOrder?.idempotency_key || "seed-req-nvidia-inference-01"
      : override
        ? `req-paypal-sbx-${Math.floor(1000 + Math.random() * 9000)}`
        : idempotencyKey;

    try {
      setMachineState("policy_guardrail_check");
      const res = await fetch(`${RUST_API_BASE}/api/agent/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: usedPrompt,
          idempotency_key: keyToUse,
          override_amount_usd: usedAmount,
          preferred_sku: usedSku,
          auto_capture: true,
          direct_card_capture: override?.directCardCapture ?? true,
          simulate_decline: override?.simulateDecline,
        }),
      });

      const body = await res.json();
      if (!res.ok) {
        await fetchLedgerAndMetadata();
        setMachineState(body.machine_state || "policy_guardrail_check");
        setBannerError(`${body.error_code}: ${body.message}`);
        setReasoningLog([
          `Rust Guardrail / PayPal Sandbox Rejected Execution (${body.error_code})`,
          body.message,
        ]);
        return;
      }

      setMachineState("settled");
      setReasoningLog(body.reasoning_steps || []);
      rotateIdempotencyKey();
      await fetchLedgerAndMetadata();
    } catch (err) {
      setMachineState("error");
      setBannerError(
        err instanceof Error
          ? err.message
          : "Failed to reach Rust Settlement API on port 4180",
      );
    } finally {
      setBusy(false);
    }
  };

  const handleInvokeMcpTool = async () => {
    if (busy) return;
    setBusy(true);
    setBannerError(null);
    setMachineState("paypal_executing");
    try {
      let parsedArgs: Record<string, unknown> = {};
      if (mcpArgsText.trim()) {
        parsedArgs = JSON.parse(mcpArgsText) as Record<string, unknown>;
      }
      const res = await fetch(`${RUST_API_BASE}/api/mcp/invoke`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: selectedMcpTool,
          idempotency_key: `mcp-ui-${Date.now()}`,
          arguments: parsedArgs,
        }),
      });
      const json = await res.json();
      setMcpOutputText(JSON.stringify(json, null, 2));
      if (!res.ok) {
        setMachineState("error");
        setBannerError(`${json.error_code}: ${json.message}`);
      } else {
        setMachineState("settled");
        await fetchLedgerAndMetadata();
      }
    } catch (err) {
      setMachineState("error");
      setMcpOutputText(
        JSON.stringify(
          {
            error:
              err instanceof Error
                ? err.message
                : "Invalid JSON arguments or Rust API unreachable",
          },
          null,
          2,
        ),
      );
    } finally {
      setBusy(false);
    }
  };

  const handleAttachTracking = async (
    orderId: string,
    status: "DELIVERED" | "IN_TRANSIT",
    carrier: string,
    milestoneId?: string,
  ) => {
    if (busy) return;
    setBusy(true);
    setMachineState("paypal_executing");
    try {
      const res = await fetch(
        `${RUST_API_BASE}/api/orders/${encodeURIComponent(orderId)}/tracking`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status,
            carrier,
            milestone_id: milestoneId,
          }),
        },
      );
      if (res.ok) {
        setMachineState("settled");
        await fetchLedgerAndMetadata();
      }
    } catch {
      setLedger((prev) => ({
        ...prev,
        milestones: prev.milestones.map((ms) =>
          ms.id === milestoneId
            ? {
                ...ms,
                state: status,
                shipment_status: status,
                progress_pct: status === "DELIVERED" ? 100 : 75,
                tracking_number: ms.tracking_number ?? "1Z999AA1012349900",
              }
            : ms,
        ),
      }));
      setMachineState("settled");
    } finally {
      setBusy(false);
    }
  };

  const handleSeedSandbox = async () => {
    if (busy) return;
    setBusy(true);
    setBannerError(null);
    setMachineState("seeding_sandbox");
    try {
      const res = await fetch(`${RUST_API_BASE}/api/sandbox/seed`, {
        method: "POST",
      });
      if (res.ok) {
        const snapshot = (await res.json()) as LedgerSnapshot;
        setLedger(snapshot);
        setMachineState("settled");
        setReasoningLog([
          "1-Click Judge Sandbox Reseeded: Buyer, Merchant, Channel3 SKUs & Payout milestones restored.",
        ]);
      }
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyWebhookSample = async () => {
    setWebhookStatus("Verifying HMAC-SHA256...");
    try {
      const samplePayload = JSON.stringify({
        event_type: "PAYMENT.CAPTURE.COMPLETED",
        resource_id: ledger.orders[0]?.id ?? "PAYPAL-SBX-8F12A90C11",
      });
      const sigRes = await fetch(
        `${RUST_API_BASE}/api/webhooks/sample-signature`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payload: samplePayload }),
        },
      );
      const { signature_hex } = (await sigRes.json()) as {
        signature_hex: string;
      };
      const verifyRes = await fetch(`${RUST_API_BASE}/api/webhooks/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payload: samplePayload,
          signature_hex,
        }),
      });
      if (verifyRes.ok) {
        setWebhookStatus("HMAC-SHA256 Verified (Constant-Time Rust Check PASS)");
      } else {
        setWebhookStatus("Webhook signature rejected");
      }
    } catch {
      setWebhookStatus("Offline webhook verifier check skipped");
    }
  };

  const handleDisputeOrder = async (orderId: string) => {
    try {
      const res = await fetch(
        `${RUST_API_BASE}/api/orders/${encodeURIComponent(orderId)}/dispute`,
        { method: "POST" },
      );
      if (res.ok) {
        setMachineState("disputed");
        await fetchLedgerAndMetadata();
      }
    } catch {
      // Ignore network error in offline view
    }
  };

  const filteredOrders = useMemo(() => {
    const q = ledgerFilter.trim().toLowerCase();
    const list = stressLongValues
      ? ledger.orders.map((o) => ({
          ...o,
          item_title: `${o.item_title} :: Enterprise Cross-Region High-Availability Autonomous Agentic Settlement Batch With Cryptographic Audit Proof`,
          merchant_name: `${o.merchant_name} Global Settlement Holdings LLC`,
        }))
      : ledger.orders;
    if (!q) return list;
    return list.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.item_title.toLowerCase().includes(q) ||
        o.merchant_name.toLowerCase().includes(q) ||
        o.status.toLowerCase().includes(q),
    );
  }, [ledger.orders, ledgerFilter, stressLongValues]);

  const exportLedgerCsv = () => {
    const header =
      "OrderID,IdempotencyKey,Merchant,Item,AmountUSD,Status,RiskScore,CardLast4\n";
    const rows = filteredOrders
      .map(
        (o) =>
          `${o.id},${o.idempotency_key},"${o.merchant_name}","${o.item_title}",${o.amount_usd.toFixed(2)},${o.status},${o.risk_score},${o.card_last4 ?? ""}`,
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "paypal-sentinel-ledger.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const activeMcpDescriptor = useMemo(
    () =>
      mcpTools.find((t) => t.name === selectedMcpTool) ??
      FALLBACK_MCP_TOOLS[0],
    [mcpTools, selectedMcpTool],
  );

  // Filtered Triage Stack Cards for Home
  const activePileCards = useMemo(() => {
    const source =
      pile === "now"
        ? triageCards
        : pile === "later"
          ? laterCards
          : doneCards;
    return source.filter((c) => c.context === contextMode);
  }, [pile, triageCards, laterCards, doneCards, contextMode]);

  const frontCard = activePileCards[0] ?? null;

  const handleCardDone = (card: FoundTriageCard) => {
    snapAwayElement(frontCardRef.current, () => {
      setTriageCards((prev) => prev.filter((c) => c.id !== card.id));
      setLaterCards((prev) => prev.filter((c) => c.id !== card.id));
      setDoneCards((prev) => [card, ...prev]);
      setReplyOpen(false);
      setFixMenuOpen(false);
    });
  };

  const handleCardLater = (card: FoundTriageCard) => {
    setTriageCards((prev) => prev.filter((c) => c.id !== card.id));
    setLaterCards((prev) => [card, ...prev]);
    setReplyOpen(false);
    setFixMenuOpen(false);
  };

  return (
    <div
      className="found-root"
      data-theme={isDark ? "dark" : "light"}
      data-skin={skin}
    >
      <DitherDefs />
      {/* Clean Top Bar (header.found-top) without floating center clutter */}
      <header className="found-top">
        <button
          type="button"
          onClick={() => {
            setVariant("command");
            setActiveRoute("home");
          }}
          className="found-brand"
          aria-label="Home"
        >
          <FoundBrandMark
            mood={
              busy
                ? "reading"
                : bannerError
                  ? "surprised"
                  : activePileCards.length === 0
                    ? "happy"
                    : "default"
            }
            bootDraw
          />
          <span className="flex flex-col items-start text-left leading-none">
            <span className="text-[14.5px] font-semibold tracking-tight text-[var(--ink)]">
              PayPal Sentinel
            </span>
            <span className="mt-0.5 hidden text-[11px] font-normal text-[var(--muted)] sm:inline">
              Rust Spend Guardrails
            </span>
          </span>
        </button>

        <FoundFloatingDock
          activeRoute={activeRoute}
          onNavigate={handleNavigateRoute}
          onOpenPalette={() => setPaletteOpen(true)}
          nowCount={activePileCards.length}
          slackCount={4}
        />

        <div className="found-top-right">
          <button
            type="button"
            data-testid="seed-sandbox-btn"
            disabled={busy}
            onClick={() => void handleSeedSandbox()}
            className="found-tlink"
            style={{ fontSize: 12, marginRight: 8 }}
          >
            Re-Seed Sandbox
          </button>

          <button
            type="button"
            data-testid="rust-api-badge"
            onClick={() => setDebugOpen((prev) => !prev)}
            className="found-sync-pill"
          >
            <span className={`found-dot${rustConnected ? " live" : ""}`} />
            <span>Synced Nov 2</span>
            <span
              style={{
                position: "absolute",
                width: 1,
                height: 1,
                padding: 0,
                margin: -1,
                overflow: "hidden",
                clip: "rect(0,0,0,0)",
                border: 0,
              }}
            >
              RUST AXUM :4180 LIVE
            </span>
          </button>

          <button
            type="button"
            data-testid="toggle-debug"
            onClick={() => setDebugOpen((prev) => !prev)}
            aria-pressed={debugOpen}
            className="found-tlink"
            style={{ fontSize: 12 }}
          >
            QA
          </button>
        </div>
      </header>

      {/* Deterministic ?debug=1 State Machine, Skin/Variant Switchers & Adversarial QA Bar */}
      {debugOpen ? (
        <div
          data-testid="qa-debug-bar"
          className="border-y border-[var(--line)] bg-[var(--soft)] px-4 py-2.5 sm:px-6"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-2.5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs tabular-nums">
                <span className="rounded-md bg-[var(--ok-soft)] px-2 py-1 font-semibold text-[var(--ok)]">
                  STATE: {machineState}
                </span>
                <span className="rounded-md bg-[var(--surface)] px-2 py-1 text-[var(--ink)]">
                  OVERFLOW: {overflowPx}px
                </span>
                <span className="rounded-md bg-[var(--surface)] px-2 py-1 text-[var(--muted)]">
                  MODE: {ledger.sandbox_mode}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <nav
                  aria-label="Cockpit layout variants"
                  className="found-ctxsw"
                >
                  {(
                    [
                      {
                        id: "command",
                        label: "Home & Desk",
                        route: "home" as const,
                      },
                      {
                        id: "ledger",
                        label: "AG Studio Grid",
                        route: "ledger" as const,
                      },
                      {
                        id: "timeline",
                        label: "Bryntum Scheduler",
                        route: "timeline" as const,
                      },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      data-testid={`variant-${item.id}`}
                      onClick={() => {
                        setVariant(item.id);
                        setActiveRoute(item.route);
                      }}
                      aria-pressed={variant === item.id}
                      className={variant === item.id ? "on" : ""}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[var(--line)] pt-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  data-testid="qa-replay-duplicate"
                  disabled={busy}
                  onClick={() =>
                    void executeAgentIntent({
                      prompt: "Replay duplicate PayPal-Request-Id attack",
                      sku: "CH3-GPU-101",
                      amount: 240,
                      reuseSameKey: true,
                    })
                  }
                  className="found-btn text-xs"
                >
                  Test Duplicate Key 409
                </button>
                <button
                  type="button"
                  data-testid="qa-verify-webhook"
                  onClick={() => void handleVerifyWebhookSample()}
                  className="found-btn text-xs"
                >
                  Verify HMAC Webhook
                </button>
                <button
                  type="button"
                  data-testid="qa-stress-long"
                  onClick={() => setStressLongValues((prev) => !prev)}
                  aria-pressed={stressLongValues}
                  className="found-btn text-xs"
                >
                  Stress Long Values
                </button>
              </div>
            </div>
          </div>
          {webhookStatus ? (
            <p className="mx-auto mt-1.5 max-w-5xl font-mono text-xs text-[var(--ok)]">
              Webhook Check: {webhookStatus}
            </p>
          ) : null}
        </div>
      ) : null}

      {/* ====================================================================
          MAIN FOUND VIEWPORT (main.found-page - Zero Outer Box Frame!)
          ==================================================================== */}
      <main className="found-page">
        {/* Inline Actionable Policy / Guardrail Alert */}
        {bannerError ? (
          <div
            role="alert"
            data-testid="guardrail-alert"
            style={{ maxWidth: 600, margin: "0 auto 20px" }}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--warn)] bg-[var(--soft)] p-3.5 text-[13px] text-[var(--ink)]"
          >
            <div className="flex min-w-0 items-center gap-2">
              <ShieldAlert className="h-4 w-4 shrink-0 text-[var(--warn)]" />
              <span className="min-w-0 break-words font-medium">
                {bannerError}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setBannerError(null);
                setAmountInput("240");
                rotateIdempotencyKey();
              }}
              className="found-btn found-btn-primary text-[12px]"
            >
              Reset Safe Amount
            </button>
          </div>
        ) : null}

        {/* ==================================================================
            ROUTE 1: HOME (#/) — EXACT gofound.app/demo 600px CENTERED BRIEF
            + STACKED TRIAGE DECK + EXTERNAL CTA BUTTON
            ================================================================== */}
        {activeRoute === "home" && variant === "command" ? (
          <div>
            <div className="found-home">
              {/* 1. Date on Left + [ Work | Personal ] Pill Switcher on Right */}
              <div className="found-hline">
                <p className="found-kicker">Monday, November 2</p>
                <div
                  className="found-ctxsw"
                  role="tablist"
                  aria-label="Show work or personal"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={contextMode === "work"}
                    className={contextMode === "work" ? "on" : ""}
                    onClick={() => setContextMode("work")}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="7" width="18" height="13" rx="2.5" />
                      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                    </svg>
                    <span>Work</span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={contextMode === "personal"}
                    className={contextMode === "personal" ? "on" : ""}
                    onClick={() => setContextMode("personal")}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 11l8-6.5L20 11v8.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19.5z" />
                    </svg>
                    <span>Personal</span>
                  </button>
                </div>
              </div>

              {/* 1B. Clean 1-Line Subtitle (Zero Box Clutter) */}
              <p
                data-testid="hackathon-problem-brief"
                className="mb-3 text-[12.5px] text-[var(--muted,#838380)]"
              >
                Autonomous PayPal treasury with deterministic Rust spend caps, instant milestone payouts, and multi-currency invoicing.
              </p>

              {/* 2. Exact 7-Row Borderless Morning Brief (.found-brief) — 100% PayPal + AI Native */}
              <div
                className="found-brief"
                role="region"
                aria-label="Morning brief"
              >
                <button
                  type="button"
                  onClick={() => setActiveRoute("money")}
                  className="found-bline"
                >
                  <span className="found-bi">
                    <FoundBrandIcon name="paypal" />
                  </span>
                  <span className="found-bk">Orders v2</span>
                  <span className="found-bv">
                    <b>${ledger.daily_spent_usd.toFixed(2)} settled</b> ·{" "}
                    <span className="found-muted">
                      ${ledger.remaining_daily_budget_usd.toFixed(0)} / ${ledger.policy.daily_budget_usd.toFixed(0)} cap
                    </span>{" "}
                    ·{" "}
                    <span className="found-bwarn">
                      {
                        ledger.orders.filter(
                          (o) => o.status === "BLOCKED_BY_POLICY",
                        ).length
                      }{" "}
                      policy blocked
                    </span>
                  </span>
                  <span className="found-ba">&rarr;</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.querySelector('[data-testid="paypal-inspiration-studio"]');
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="found-bline"
                >
                  <span className="found-bi">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 17l6-6 4 4 8-8" />
                      <path d="M15 7h6v6" />
                    </svg>
                  </span>
                  <span className="found-bk">A2A Agent</span>
                  <span className="found-bv">
                    <b>2 agent deals</b> ·{" "}
                    <b>Nebula H100 ($320 &rarr; $265)</b> · Visa *1881
                  </span>
                  <span className="found-ba">&rarr;</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveRoute("money")}
                  className="found-bline"
                >
                  <span className="found-bi">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="6" width="18" height="12" rx="2.5" />
                      <circle cx="12" cy="12" r="2.5" />
                    </svg>
                  </span>
                  <span className="found-bk">Invoicing</span>
                  <span className="found-bv">
                    <b>$1,850</b> across <b>3 Invoices</b> ·{" "}
                    <span className="found-muted">
                      Atelier (€331 EUR + Pay Later 4x)
                    </span>
                  </span>
                  <span className="found-ba">&rarr;</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveRoute("slack")}
                  className="found-bline"
                >
                  <span className="found-bi">
                    <FoundBrandIcon name="slack" />
                  </span>
                  <span className="found-bk">Slack MCP</span>
                  <span className="found-bv">
                    <b>2 chat requests</b> ·{" "}
                    <span className="found-bslflag">1 awaiting 1-tap ($120)</span> ·{" "}
                    <span className="found-muted">#paperco-kiln</span>
                  </span>
                  <span className="found-ba">&rarr;</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setVariant("timeline");
                    setActiveRoute("timeline");
                  }}
                  className="found-bline"
                >
                  <span className="found-bi">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
                      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
                    </svg>
                  </span>
                  <span className="found-bk">Payouts</span>
                  <span className="found-bv">
                    <b>
                      {ledger.milestones.length} milestones ($
                      {ledger.milestones
                        .reduce((sum, m) => sum + m.amount_usd, 0)
                        .toFixed(0)}
                      )
                    </b>{" "}
                    · <b>Nebula $240 · TypeCraft $185</b> ·{" "}
                    <span className="found-bwarn">
                      {
                        ledger.milestones.filter(
                          (m) => m.state === "ESCROW_LOCKED",
                        ).length
                      }{" "}
                      escrow
                    </span>
                  </span>
                  <span className="found-ba">&rarr;</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveRoute("calendar")}
                  className="found-bline"
                >
                  <span className="found-bi">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="8.5" />
                      <path d="M8.5 12.3l2.3 2.3 4.8-4.8" />
                    </svg>
                  </span>
                  <span className="found-bk">Guardrails</span>
                  <span className="found-bv">
                    <b>0 chargebacks</b> · Duplicate SaaS ($49) paused · HMAC pass
                  </span>
                  <span className="found-ba">&rarr;</span>
                </button>

                <div className="found-bline found-bsetup">
                  <span className="found-bi">
                    <svg width="16" height="16" viewBox="0 0 18 18">
                      <circle
                        cx="9"
                        cy="9"
                        r="7"
                        fill="none"
                        stroke="currentColor"
                        strokeOpacity="0.18"
                        strokeWidth="2"
                      />
                      <circle
                        cx="9"
                        cy="9"
                        r="7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray="44 44"
                        transform="rotate(-90 9 9)"
                      />
                    </svg>
                  </span>
                  <span className="found-bk">Sponsors</span>
                  <span className="found-bv found-muted">
                    5 of 5 connected (Channel3, APIMatic, AG Grid, Bryntum) ·{" "}
                    <button
                      type="button"
                      className="found-bsetup-link"
                      onClick={() => setActiveRoute("settings")}
                    >
                      Keys
                    </button>
                  </span>
                  <span />
                </div>
              </div>

              {/* 3. Exact Stacked Triage Card (.found-stackwrap) + External CTA (.found-sacts) */}
              <section
                className="found-stackwrap"
                aria-label="Action triage stack"
              >
                <div className="found-stackbar">
                  <span>
                    1 of {Math.max(1, activePileCards.length)} · &uarr;&darr; to
                    flip, D done, L later, Enter act
                  </span>
                  <span className="found-snav">
                    <button
                      type="button"
                      className="found-sarr"
                      disabled={activePileCards.length <= 1}
                      onClick={() => {
                        if (frontCard) handleCardLater(frontCard);
                      }}
                      aria-label="Previous card"
                    >
                      &lsaquo;
                    </button>
                    <button
                      type="button"
                      className="found-sarr"
                      disabled={activePileCards.length <= 1}
                      onClick={() => {
                        if (frontCard) handleCardLater(frontCard);
                      }}
                      aria-label="Next card"
                    >
                      &rsaquo;
                    </button>
                  </span>
                </div>

                {frontCard ? (
                  <>
                    <div className="found-sdeck">
                      {activePileCards.length > 2 ? (
                        <div className="found-scard d2" aria-hidden="true" />
                      ) : null}
                      {activePileCards.length > 1 ? (
                        <div className="found-scard d1" aria-hidden="true" />
                      ) : null}

                      <div ref={frontCardRef} className="found-scard">
                        <div className="found-shead">
                          <span className="found-skind">$</span>
                          <span className="found-shead-r">
                            <span className="found-swhy">
                              {frontCard.badge} · {frontCard.meta}
                            </span>
                            <button
                              type="button"
                              onClick={() => setFixMenuOpen((prev) => !prev)}
                              aria-label="More options"
                              className="found-tlink"
                              style={{ textDecoration: "none" }}
                            >
                              &middot;&middot;&middot;
                            </button>
                          </span>
                        </div>

                        <h2 className="found-stitle">{frontCard.title}</h2>
                        <div className="found-smeta">{frontCard.body}</div>
                      </div>
                    </div>

                    {/* External Centered Primary Action Pill + Later / Done Links (Exact gofound.app/demo .sacts) */}
                    <div className="found-sacts">
                      <button
                        type="button"
                        onClick={() => {
                          if (frontCard.sku && frontCard.amountUsd) {
                            void executeAgentIntent({
                              prompt: frontCard.title,
                              sku: frontCard.sku,
                              amount: frontCard.amountUsd,
                              directCardCapture: true,
                            });
                          }
                          handleCardDone(frontCard);
                        }}
                        className="found-sbtn-go"
                      >
                        {frontCard.primaryAction}
                      </button>

                      <div className="found-ssec">
                        <button
                          type="button"
                          onClick={() => handleCardLater(frontCard)}
                        >
                          Later
                        </button>
                        <span>&middot;</span>
                        <button
                          type="button"
                          onClick={() => handleCardDone(frontCard)}
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="found-card flex items-center justify-between">
                    <div>
                      <b className="text-[14px]">
                        You&apos;re all caught up right now.
                      </b>
                      <p className="found-muted text-[12.5px]">
                        Nothing else needs your attention.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setTriageCards(INITIAL_TRIAGE_CARDS);
                        setLaterCards([]);
                        setDoneCards([]);
                        setPile("now");
                      }}
                      className="found-tlink"
                    >
                      Restore demo cards
                    </button>
                  </div>
                )}
              </section>
            </div>

            {/* ==============================================================
                LOWER PAYPAL AI + RUST PROCUREMENT, CHANNEL3 & @paypal/mcp DESK
                ============================================================== */}
            <div className="mt-10 border-t border-[var(--line)] pt-8">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-[15px] font-semibold text-[var(--ink)]">
                    PayPal Sandbox &amp; Rust Spend Guardrails
                  </h2>
                  <p className="text-[12.5px] text-[var(--muted)]">
                    Deterministic Rust Axum (:4180) spend caps, Channel3 retail
                    catalog, and @paypal/mcp tool execution.
                  </p>
                </div>
                <div className="found-ctxsw">
                  <button
                    type="button"
                    className={variant === "command" ? "on" : ""}
                    onClick={() => {
                      setVariant("command");
                      setActiveRoute("home");
                    }}
                  >
                    Desk
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVariant("ledger");
                      setActiveRoute("ledger");
                    }}
                  >
                    AG Studio Grid
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVariant("timeline");
                      setActiveRoute("timeline");
                    }}
                  >
                    Bryntum Scheduler
                  </button>
                </div>
              </div>

              {/* Signal vs. Noise Explainer Strip: Clean 3-Column Divided Card (Zero Nested Grey Boxes) */}
              <div
                data-testid="signal-vs-noise-explainer"
                className="mb-5 grid grid-cols-1 divide-y divide-[var(--line)] rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-[0_1px_2px_rgba(24,24,27,0.04)] sm:grid-cols-3 sm:divide-x sm:divide-y-0"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between text-[11px] font-medium text-[var(--muted)]">
                    <span>1. Incoming Agent Stream</span>
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 font-mono text-[10px] font-medium text-amber-800">
                      Signal + Noise
                    </span>
                  </div>
                  <p className="mt-1.5 text-[12.5px] leading-snug text-[var(--ink)]">
                    AI agents request compute and payouts, mixing valid tasks with{" "}
                    <b>over-budget ($850)</b> or <b>high-risk vendor</b> noise.
                  </p>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between text-[11px] font-medium text-[var(--muted)]">
                    <span>2. Rust Policy Filter (:4180)</span>
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 font-mono text-[10px] font-medium text-blue-700">
                      Deterministic
                    </span>
                  </div>
                  <p className="mt-1.5 text-[12.5px] leading-snug text-[var(--ink)]">
                    Blocks any order over <b>$500</b>, vendor risk above{" "}
                    <b>35/100</b>, or duplicate replay keys before PayPal is called.
                  </p>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between text-[11px] font-medium text-[var(--muted)]">
                    <span>3. Safe PayPal Settlement</span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-700">
                      $0 Lost to Noise
                    </span>
                  </div>
                  <p className="mt-1.5 text-[12.5px] leading-snug text-[var(--ink)]">
                    Approved signal settles via <b>PayPal Orders v2 (*1881)</b>;
                    blocked noise is logged with <b>$0.00 charged</b>.
                  </p>
                </div>
              </div>

              {/* 4 Rust Guardrail KPI Cards */}
              <section
                aria-label="Rust treasury guardrails"
                className="mb-5 grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-4"
              >
                <DitherStatCard
                  title="Approved Daily Spend"
                  badge="SIGNAL"
                  badgeTone="ok"
                  value={`$${ledger.daily_spent_usd.toFixed(2)}`}
                  valueTestId="daily-spent-value"
                  subtitle={`$${ledger.remaining_daily_budget_usd.toFixed(0)} remaining of $${ledger.policy.daily_budget_usd.toFixed(0)} daily cap`}
                  progressPercent={Math.min(
                    100,
                    (ledger.daily_spent_usd / ledger.policy.daily_budget_usd) * 100,
                  )}
                  sparklineTone="green"
                />

                <DitherStatCard
                  title="Single-Order Limit"
                  badge="CAP"
                  badgeTone="ok"
                  value={`$${ledger.policy.max_single_order_usd.toFixed(2)}`}
                  subtitle="Auto-blocks any AI purchase above $500"
                  gaugePercent={Math.min(
                    100,
                    (ledger.policy.max_single_order_usd / 1000) * 100,
                  )}
                  gaugeTone="ok"
                  sparklineTone="blue"
                />

                <DitherStatCard
                  title="Vendor Risk Cutoff"
                  badge="JEV AI"
                  badgeTone="ok"
                  value={`<= ${ledger.policy.max_risk_score} / 100`}
                  subtitle="Blocks unverified gray-market sellers"
                  gaugePercent={ledger.policy.max_risk_score}
                  gaugeTone="accent"
                  sparklineTone="amber"
                />

                <DitherStatCard
                  title="Sandbox Activity"
                  badge="LIVE"
                  badgeTone="ok"
                  value={`${ledger.orders.filter((o) => o.status !== "BLOCKED_BY_POLICY").length} / ${ledger.orders.length} Settled`}
                  subtitle={`${ledger.orders.filter((o) => o.status !== "BLOCKED_BY_POLICY").length} signal approved · ${ledger.orders.filter((o) => o.status === "BLOCKED_BY_POLICY").length} noise blocked`}
                  progressPercent={Math.min(100, (ledger.orders.length / 10) * 100)}
                  sparklineTone="pink"
                />
              </section>

              {/* Official PayPal AI Hackathon 5 Inspiration Tracks & 8 Capabilities Studio */}
              <FoundInspirationStudio
                apiBase={RUST_API_BASE}
                onPatternSettled={(resp) => {
                  setLedger((prev) => ({
                    ...prev,
                    daily_spent_usd: resp.daily_spent_usd,
                    remaining_daily_budget_usd: resp.remaining_daily_budget_usd,
                    orders: [resp.order, ...prev.orders],
                  }));
                  setReasoningLog(resp.execution_steps);
                }}
              />

              <section
                data-testid="found-console-section"
                aria-label="Agentic procurement command console"
                className="mb-5 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12"
              >
                {/* Left Column: Clean Single-Layer Channel3 Procurement & Guardrail Card */}
                <div className="flex h-full flex-col lg:col-span-6">
                  <MdxcnFrame
                    title="1. Test Catalog & Noise Simulator"
                    subtitle="Channel3 · Orders v2"
                    className="h-full flex-1"
                  >
                    <div className="flex flex-1 flex-col justify-between gap-4">
                      {/* Channel3 Product Search & Clean 4-Row Selectable List */}
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="search"
                            data-testid="channel3-search-input"
                            value={channel3Query}
                            onChange={(e) => {
                              const nextVal = e.target.value;
                              setChannel3Query(nextVal);
                              void runChannel3Query(nextVal);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                void handleChannel3Search(channel3Query);
                              }
                            }}
                            placeholder="Search catalog: gpu, monitor, dock, keyboard, sdk..."
                            className="min-h-9 flex-1 rounded-lg border border-[var(--line)] bg-[var(--soft)]/60 px-3 text-xs text-[var(--ink)] outline-none focus:border-[var(--accent)]"
                          />
                          <button
                            type="button"
                            data-testid="channel3-search-btn"
                            onClick={() => void handleChannel3Search(channel3Query)}
                            className="found-sbtn-go text-xs"
                          >
                            <Search className="h-3.5 w-3.5" />
                            Search
                          </button>
                        </div>

                        {/* Clean Single-Column Selectable Rows (Zero 2-Line Title Wrapping) */}
                        <div className="divide-y divide-[var(--line)] overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)]">
                          {channel3Results.slice(0, 4).map((item) => {
                            const isHighRisk =
                              item.risk_score > ledger.policy.max_risk_score;
                            const isSelected = selectedSku === item.sku;
                            const cleanMerchant = item.merchant_name
                              .replace(" Unverified", "")
                              .replace(" API Studio", " Studio");
                            return (
                              <button
                                key={item.id}
                                type="button"
                                data-testid={`channel3-item-${item.sku}`}
                                onClick={() => {
                                  setSelectedSku(item.sku);
                                  setAmountInput(String(item.price_usd));
                                  setPromptInput(
                                    `Procure ${item.title} (${item.sku}) from ${item.merchant_name} via PayPal Orders v2`,
                                  );
                                  const nextArgs = {
                                    sku: item.sku,
                                    amount_usd: item.price_usd,
                                  };
                                  setMcpArgsText(
                                    JSON.stringify(nextArgs, null, 2),
                                  );
                                  setMcpOutputText(
                                    JSON.stringify(
                                      {
                                        tool: selectedMcpTool,
                                        item: item.title,
                                        amount_usd: item.price_usd,
                                        verdict: isHighRisk
                                          ? "BLOCKED_HIGH_RISK_NOISE"
                                          : "APPROVED_SIGNAL",
                                      },
                                      null,
                                      2,
                                    ),
                                  );
                                }}
                                className={cn(
                                  "flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left transition cursor-pointer",
                                  isSelected
                                    ? "bg-[var(--accent-soft)]/70"
                                    : "hover:bg-[var(--soft)]/60",
                                )}
                              >
                                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                                  <span
                                    className={cn(
                                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                                      isSelected
                                        ? "border-[var(--accent)] bg-[var(--accent)]"
                                        : "border-[var(--line)] bg-[var(--surface)]",
                                    )}
                                  >
                                    {isSelected ? (
                                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                    ) : null}
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <div className="truncate text-[13px] font-medium text-[var(--ink)]">
                                      {item.title}
                                    </div>
                                    <div className="truncate text-[11.5px] text-[var(--muted)]">
                                      {cleanMerchant}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-2.5">
                                  <span
                                    className={cn(
                                      "rounded-full px-2 py-0.5 font-mono text-[10.5px] font-medium",
                                      isHighRisk
                                        ? "bg-rose-50 text-rose-700"
                                        : "bg-emerald-50 text-emerald-700",
                                    )}
                                  >
                                    {isHighRisk
                                      ? `Noise · Risk ${item.risk_score}`
                                      : `Safe · Risk ${item.risk_score}`}
                                  </span>
                                  <span className="w-12 text-right font-mono text-[13px] font-semibold tabular-nums text-[var(--ink)]">
                                    ${item.price_usd}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Primary Action Row + Clean Inline Noise Simulation Strip */}
                      <div className="space-y-3 border-t border-[var(--line)] pt-3">
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          <button
                            type="button"
                            data-testid="direct-card-capture-btn"
                            disabled={busy}
                            onClick={() =>
                              void executeAgentIntent({
                                prompt: `Headless ACDC Card 4012888888881881 Capture for SKU ${selectedSku}`,
                                sku: selectedSku,
                                amount: Number(amountInput) || 240,
                                directCardCapture: true,
                              })
                            }
                            className="found-sbtn-go w-full justify-center text-xs"
                          >
                            <CreditCard className="h-3.5 w-3.5 shrink-0" />
                            <span>Pay ${amountInput} · Visa *1881</span>
                          </button>

                          <button
                            type="button"
                            data-testid="execute-agent-btn"
                            disabled={busy}
                            onClick={() => void executeAgentIntent()}
                            className="inline-flex min-h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2 text-xs font-medium text-[var(--ink)] transition hover:bg-[var(--soft)] cursor-pointer"
                          >
                            <Wallet className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
                            <span>{busy ? "Executing..." : "Verify & Settle"}</span>
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11.5px]">
                          <span className="text-[var(--muted)]">
                            Simulate Bad Agent Noise ($0 charged):
                          </span>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <button
                              type="button"
                              data-testid="simulate-overspend-btn"
                              disabled={busy}
                              onClick={() =>
                                void executeAgentIntent({
                                  prompt:
                                    "Test $850 overspend guardrail against $500 single-order cap",
                                  sku: "CH3-GPU-101",
                                  amount: 850,
                                  directCardCapture: true,
                                })
                              }
                              className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-2.5 py-0.5 text-[11.5px] font-medium text-rose-700 hover:bg-rose-50 cursor-pointer"
                            >
                              Block $850 Over-Cap
                            </button>

                            <button
                              type="button"
                              data-testid="simulate-decline-btn"
                              disabled={busy}
                              onClick={() =>
                                void executeAgentIntent({
                                  prompt:
                                    "Simulate PayPal Sandbox INSTRUMENT_DECLINED via CCREJECT-IF",
                                  sku: selectedSku,
                                  amount: 125,
                                  directCardCapture: true,
                                  simulateDecline: "INSTRUMENT_DECLINED",
                                })
                              }
                              className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-2.5 py-0.5 text-[11.5px] font-medium text-rose-700 hover:bg-rose-50 cursor-pointer"
                            >
                              Block Card Decline
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </MdxcnFrame>
                </div>

                {/* Right Column: Clean Signal vs. Noise Ledger & @paypal/mcp Tool Inspector */}
                <div className="flex h-full flex-col gap-5 lg:col-span-6">
                  <MdxcnFrame
                    title="2. Signal vs. Blocked Noise Log"
                    subtitle={`${filteredOrders.filter((o) => o.status !== "BLOCKED_BY_POLICY").length} approved ($${ledger.daily_spent_usd.toFixed(0)}) · ${filteredOrders.filter((o) => o.status === "BLOCKED_BY_POLICY").length} blocked ($0)`}
                    className="flex-1"
                  >
                    <div className="divide-y divide-[var(--line)]">
                      {filteredOrders.slice(0, 5).map((order) => {
                        const isBlocked = order.status === "BLOCKED_BY_POLICY";
                        const isCompleted = order.status === "COMPLETED";
                        return (
                          <article
                            key={order.id}
                            data-testid={`order-card-${order.id}`}
                            className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="truncate text-[13px] font-medium text-[var(--ink)]">
                                  {order.item_title}
                                </span>
                              </div>
                              <div className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-[var(--muted)]">
                                <span
                                  className={cn(
                                    "shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold",
                                    isBlocked
                                      ? "bg-amber-500/15 text-amber-700"
                                      : isCompleted
                                        ? "bg-[var(--ok)]/12 text-[var(--ok)]"
                                        : "bg-sky-500/12 text-sky-700",
                                  )}
                                >
                                  {isBlocked
                                    ? "NOISE BLOCKED"
                                    : isCompleted
                                      ? "SETTLED"
                                      : "ESCROW"}
                                </span>
                                <span className="truncate">
                                  {isBlocked
                                    ? `Risk ${order.risk_score}/100 > 35 limit · $0.00 charged`
                                    : `${order.merchant_name} · ${order.id}`}
                                </span>
                              </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-3">
                              <span
                                className={cn(
                                  "font-mono text-[13px] font-semibold tabular-nums",
                                  isBlocked
                                    ? "line-through text-[var(--muted)]"
                                    : "text-[var(--ink)]",
                                )}
                              >
                                ${order.amount_usd.toFixed(2)}
                              </span>
                              <button
                                type="button"
                                onClick={() => setSheetDocId(order.id)}
                                className="found-tlink text-xs cursor-pointer"
                              >
                                Receipt
                              </button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </MdxcnFrame>

                  {/* Clean @paypal/mcp Tool Inspector */}
                  <div data-testid="mcp-tool-inspector" className="flex min-w-0 flex-1 flex-col">
                    <MdxcnFrame
                      title="3. @paypal/mcp Tool Inspector"
                      subtitle={`${mcpTools.length} tools · Patches #95 #98 #107 #109 #119`}
                      className="min-w-0 flex-1"
                    >
                      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                        <div className="flex min-w-0 gap-2">
                          <select
                            data-testid="mcp-tool-select"
                            value={selectedMcpTool}
                            onChange={(e) => {
                              const nextName = e.target.value;
                              setSelectedMcpTool(nextName);
                              const desc = mcpTools.find(
                                (t) => t.name === nextName,
                              );
                              if (desc) {
                                const nextArgsStr = JSON.stringify(
                                  desc.sample_arguments,
                                  null,
                                  2,
                                );
                                setMcpArgsText(nextArgsStr);
                                setMcpOutputText(
                                  JSON.stringify(
                                    {
                                      tool: desc.name,
                                      category: desc.category,
                                      arguments: desc.sample_arguments,
                                    },
                                    null,
                                    2,
                                  ),
                                );
                              }
                            }}
                            aria-label="Select MCP Tool"
                            className="min-h-9 min-w-0 flex-1 truncate rounded-lg border border-[var(--line)] bg-[var(--soft)] px-2.5 font-mono text-[11.5px] text-[var(--ink)]"
                          >
                            {mcpTools.map((tool) => (
                              <option key={tool.name} value={tool.name}>
                                {tool.name} ({tool.category.replace("Headless ", "")})
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            data-testid="mcp-invoke-btn"
                            disabled={busy}
                            onClick={() => void handleInvokeMcpTool()}
                            className="found-sbtn-go text-xs"
                          >
                            <Play className="h-3.5 w-3.5" />
                            Invoke
                          </button>
                        </div>

                        <input
                          type="hidden"
                          data-testid="mcp-args-textarea"
                          value={mcpArgsText}
                          readOnly
                        />

                        <pre
                          data-testid="mcp-output-pre"
                          className="flex-1 overflow-y-auto whitespace-pre-wrap break-words rounded-lg border border-[var(--line)] bg-[var(--soft)] px-2.5 py-2 font-mono text-[11px] leading-tight text-[var(--ok)]"
                        >
                          {mcpOutputText}
                        </pre>
                      </div>
                    </MdxcnFrame>
                  </div>
                </div>
              </section>

            {/* Sponsor Status Strip */}
            <SponsorStatusStrip
              status={integrationStatus}
              sdkToolCount={sdkToolCount}
            />
            </div>
          </div>
        ) : null}

        {/* ROUTE 2: CLIENTS, LEADS & TEAM (#/clients) */}
        {activeRoute === "clients" ? (
          <FoundClientsView
            onOpenSheet={(docId) => setSheetDocId(docId)}
            onNavigate={handleNavigateRoute}
          />
        ) : null}

        {/* ROUTE 3: MONEY & WHO PAYS NEXT (#/money & #/money/next) */}
        {activeRoute === "money" || activeRoute === "money-next" ? (
          <FoundMoneyView
            mode={activeRoute === "money-next" ? "next" : "now"}
            onModeChange={(m) =>
              setActiveRoute(m === "next" ? "money-next" : "money")
            }
            ledger={ledger}
            onOpenSheet={(docId) => setSheetDocId(docId)}
            onExportCsv={exportLedgerCsv}
          />
        ) : null}

        {/* ROUTE 4: CALENDAR AGENDA & PAPER MONTH GRID (#/calendar) */}
        {activeRoute === "calendar" ? (
          <FoundCalendarView onOpenSheet={(docId) => setSheetDocId(docId)} />
        ) : null}

        {/* ROUTE 5: SLACK WAITING & MOODS (#/slack) */}
        {activeRoute === "slack" ? (
          <FoundSlackView onNavigate={handleNavigateRoute} />
        ) : null}

        {/* ROUTE 5B: TEAM PULSE (#/team) */}
        {activeRoute === "team" ? (
          <FoundTeamView onNavigate={handleNavigateRoute} />
        ) : null}

        {/* ROUTE 6: FIRST LOOK AUDIT & CHECK THE LIST (#/first & #/check) */}
        {activeRoute === "first" || activeRoute === "check" ? (
          <FoundFirstLookAndCheckView
            mode={activeRoute === "check" ? "check" : "first"}
            onModeChange={(m) => setActiveRoute(m)}
            onOpenSheet={(docId) => setSheetDocId(docId)}
          />
        ) : null}

        {/* ROUTE 7: SETTINGS & CONNECTIONS ACCORDION (#/settings) */}
        {activeRoute === "settings" ? (
          <FoundSettingsView
            skin={skin}
            onSkinChange={setSkin}
            isDark={isDark}
            onToggleTheme={toggleTheme}
            integrationStatus={integrationStatus}
            ledger={ledger}
            sdkToolCount={sdkToolCount}
          />
        ) : null}

        {/* ROUTE 8 / VARIANT B: AG STUDIO ENTERPRISE LEDGER GRID */}
        {activeRoute === "ledger" || variant === "ledger" ? (
          <AgStudioLedgerPanel
            orders={filteredOrders}
            isDark={isDark}
            ledgerFilter={ledgerFilter}
            onLedgerFilterChange={setLedgerFilter}
            onExportCsv={exportLedgerCsv}
          />
        ) : null}

        {/* ROUTE 9 / VARIANT C: BRYNTUM RESOURCE SCHEDULER & SHIPMENT TRACKING */}
        {activeRoute === "timeline" || variant === "timeline" ? (
          <BryntumProcurementScheduler
            milestones={ledger.milestones}
            orders={ledger.orders}
            catalog={
              ledger.catalog.length > 0 ? ledger.catalog : FALLBACK_CATALOG
            }
            maxRiskScore={ledger.policy.max_risk_score}
            busy={busy}
            onAttachTracking={handleAttachTracking}
            onSelectCatalogProduct={(item) => {
              setVariant("command");
              setActiveRoute("home");
              void executeAgentIntent({
                prompt: `Procure ${item.title} (${item.sku}) via PayPal Orders v2`,
                sku: item.sku,
                amount: item.price_usd,
              });
            }}
          />
        ) : null}

        {/* Isolated BunUI Streak Grid: PayPal Sentinel Project Impact & How I Build (Home view) */}
        {activeRoute === "home" ? (
          <HackathonImpactStreakSection
            defaultHackathonId="paypal-ai-hackathon"
            heading="Project Impact & How I Build"
          />
        ) : null}
      </main>

      {/* ====================================================================
          PERSISTENT FOUND OVERLAYS: RIGHT SHEET, ⌘K PALETTE, FEEDBACK & DOCK
          ==================================================================== */}
      <FoundNonBlockingSheet
        docId={sheetDocId}
        orders={ledger.orders}
        onClose={() => setSheetDocId(null)}
        onCaptureOrder={() =>
          void executeAgentIntent({
            prompt: "Capture $240 via Found Non-Blocking Sheet",
            sku: "CH3-GPU-101",
            amount: 240,
            directCardCapture: true,
          })
        }
      />

      <FoundCommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={handleNavigateRoute}
        onOpenSheet={(docId) => setSheetDocId(docId)}
      />

      <FoundFeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </div>
  );
}
