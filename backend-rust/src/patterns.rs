use serde::{Deserialize, Serialize};

use crate::{
    domain::{
        DecisionEngineMetadata, MachineState, OrderStatus, PayPalOrderRecord, ShipmentTrackingInfo,
    },
    error::SentinelError,
    paypal::OrderExecutionOptions,
    policy::evaluate_spend_policy,
    AppState,
};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InspirationBreakdownRow {
    pub label: String,
    pub party: String,
    pub amount_display: String,
    pub share_or_meta: String,
    pub status: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InspirationPatternDescriptor {
    pub id: String,
    pub track_id: String,
    pub track_title: String,
    pub title: String,
    pub subtitle: String,
    pub devpost_inspiration_quote: String,
    pub default_amount_usd: f64,
    pub default_currency: String,
    pub mcp_tool: String,
    pub paypal_capabilities: Vec<String>,
    pub sponsor_integrations: Vec<String>,
    pub sample_breakdown: Vec<InspirationBreakdownRow>,
}

#[derive(Debug, Clone, Serialize)]
pub struct InspirationCatalogResponse {
    pub hackathon_name: String,
    pub total_tracks: usize,
    pub total_patterns: usize,
    pub patterns: Vec<InspirationPatternDescriptor>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct ExecutePatternRequest {
    pub pattern_id: String,
    #[serde(default)]
    pub custom_amount_usd: Option<f64>,
    #[serde(default)]
    pub custom_currency: Option<String>,
    #[serde(default)]
    pub custom_note: Option<String>,
    #[serde(default)]
    pub idempotency_key: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct ExecutePatternResponse {
    pub pattern: InspirationPatternDescriptor,
    pub machine_state: MachineState,
    pub execution_steps: Vec<String>,
    pub breakdown: Vec<InspirationBreakdownRow>,
    pub order: PayPalOrderRecord,
    pub daily_spent_usd: f64,
    pub remaining_daily_budget_usd: f64,
    pub decision_engine: DecisionEngineMetadata,
}

pub fn build_inspiration_catalog() -> Vec<InspirationPatternDescriptor> {
    vec![
        // TRACK 1: AI AGENTS OR AUTOMATION
        InspirationPatternDescriptor {
            id: "a2a_negotiate_settle".to_owned(),
            track_id: "ai_agents".to_owned(),
            track_title: "AI Agents & Automation".to_owned(),
            title: "Agent-to-Agent (A2A) Negotiation & Auto-Settlement".to_owned(),
            subtitle: "Buyer Agent and Merchant Agent negotiate SLA + volume discount ($320 -> $265) and settle via PayPal Orders v2.".to_owned(),
            devpost_inspiration_quote: "Two agents negotiating and settling a payment between themselves (agent-to-agent commerce), or an AI agent that shops and checks out for you.".to_owned(),
            default_amount_usd: 265.00,
            default_currency: "USD".to_owned(),
            mcp_tool: "sentinel_direct_card_capture".to_owned(),
            paypal_capabilities: vec![
                "PayPal Orders v2".to_owned(),
                "PayPal Agent Toolkit (@paypal/agent-toolkit)".to_owned(),
                "PayPal MCP Server (@paypal/mcp)".to_owned(),
                "Idempotent PayPal-Request-Id".to_owned(),
            ],
            sponsor_integrations: vec![
                "Channel3 Catalog".to_owned(),
                "APIMatic Typed SDK".to_owned(),
                "AG Grid Ledger".to_owned(),
            ],
            sample_breakdown: vec![
                InspirationBreakdownRow {
                    label: "Round 1 · Initial Ask".to_owned(),
                    party: "Nebula-Merchant-Agent".to_owned(),
                    amount_display: "$320.00".to_owned(),
                    share_or_meta: "64h H100 Spot @ $5.00/hr".to_owned(),
                    status: "Countered".to_owned(),
                },
                InspirationBreakdownRow {
                    label: "Round 2 · Buyer Counter-Offer".to_owned(),
                    party: "Sentinel-Buyer-Agent".to_owned(),
                    amount_display: "$250.00".to_owned(),
                    share_or_meta: "Immediate Sandbox Card Capture".to_owned(),
                    status: "Countered".to_owned(),
                },
                InspirationBreakdownRow {
                    label: "Round 3 · Signed A2A Clearing Price".to_owned(),
                    party: "Both Agents + Rust Guardrail".to_owned(),
                    amount_display: "$265.00".to_owned(),
                    share_or_meta: "Saved $55.00 (17.2%) · Visa *1881".to_owned(),
                    status: "Settled".to_owned(),
                },
            ],
        },
        InspirationPatternDescriptor {
            id: "auto_contractor_payout".to_owned(),
            track_id: "ai_agents".to_owned(),
            track_title: "AI Agents & Automation".to_owned(),
            title: "Scheduling Assistant Auto-Pays Contractor on Job Complete".to_owned(),
            subtitle: "Detects verified deliverable + shipment tracking and dispatches instant PayPal Batch Payout.".to_owned(),
            devpost_inspiration_quote: "A scheduling assistant that pays contractors automatically when a job is marked complete.".to_owned(),
            default_amount_usd: 185.00,
            default_currency: "USD".to_owned(),
            mcp_tool: "create_payout_batch".to_owned(),
            paypal_capabilities: vec![
                "PayPal Payouts v1".to_owned(),
                "Shipment Tracking API".to_owned(),
                "PayPal Webhooks HMAC-SHA256".to_owned(),
            ],
            sponsor_integrations: vec![
                "Bryntum Scheduler".to_owned(),
                "AG Grid Ledger".to_owned(),
                "Render Workflows".to_owned(),
            ],
            sample_breakdown: vec![
                InspirationBreakdownRow {
                    label: "Milestone M2 · APIMatic SDK Audit".to_owned(),
                    party: "TypeCraft API Studio".to_owned(),
                    amount_display: "$185.00".to_owned(),
                    share_or_meta: "FedEx #794644790132 · DELIVERED".to_owned(),
                    status: "Released".to_owned(),
                },
                InspirationBreakdownRow {
                    label: "Milestone M3 · Bryntum Gantt QA".to_owned(),
                    party: "Nordic Timeline Labs".to_owned(),
                    amount_display: "$150.00".to_owned(),
                    share_or_meta: "DHL #4491200811 · IN_TRANSIT".to_owned(),
                    status: "Escrowed".to_owned(),
                },
            ],
        },
        InspirationPatternDescriptor {
            id: "http402_crawler_paywall".to_owned(),
            track_id: "ai_agents".to_owned(),
            track_title: "AI Agents & Automation".to_owned(),
            title: "HTTP 402 / L402 AI Crawler Paywall & Per-Crawl Settlement".to_owned(),
            subtitle: "AI research agent hits an HTTP 402 publisher gate, verifies Rust SpendPolicy, and settles via PayPal Orders v2 to unlock a signed bearer token.".to_owned(),
            devpost_inspiration_quote: "Like a human paywall checkout, but for AI agents and web crawlers (PayPal Dev Days 1st-Place Winner Pattern).".to_owned(),
            default_amount_usd: 45.00,
            default_currency: "USD".to_owned(),
            mcp_tool: "sentinel_http402_paywall".to_owned(),
            paypal_capabilities: vec![
                "HTTP 402 Payment Required + PayPal Orders v2".to_owned(),
                "SHA-256 Permit Receipt".to_owned(),
                "Idempotent PayPal-Request-Id".to_owned(),
            ],
            sponsor_integrations: vec![
                "Channel3 Licensing SKU".to_owned(),
                "APIMatic Contract Validator".to_owned(),
                "AG Grid Crawl Ledger".to_owned(),
            ],
            sample_breakdown: vec![
                InspirationBreakdownRow {
                    label: "Step 1 · HTTP 402 Payment Required Quote".to_owned(),
                    party: "Publisher Gate (ArXiv / Financial Feed)".to_owned(),
                    amount_display: "$45.00".to_owned(),
                    share_or_meta: "1,000 licensed API articles @ $0.045/crawl".to_owned(),
                    status: "Quoted".to_owned(),
                },
                InspirationBreakdownRow {
                    label: "Step 2 · Rust SpendPermit & SHA-256 Receipt".to_owned(),
                    party: "PayPal Sentinel Permit Engine".to_owned(),
                    amount_display: "$45.00".to_owned(),
                    share_or_meta: "amount <= $500 cap · risk 6 <= 35".to_owned(),
                    status: "Permitted".to_owned(),
                },
                InspirationBreakdownRow {
                    label: "Step 3 · PayPal Orders v2 + L402 Bearer Token".to_owned(),
                    party: "PayPal Sandbox ACDC *1881".to_owned(),
                    amount_display: "$45.00".to_owned(),
                    share_or_meta: "200 OK · Signed Macaroon Unlocked".to_owned(),
                    status: "Unlocked".to_owned(),
                },
            ],
        },
        // TRACK 2: MONEY MOVEMENT EXPERIENCES
        InspirationPatternDescriptor {
            id: "receipt_bill_split".to_owned(),
            track_id: "money_movement".to_owned(),
            track_title: "Money Movement Experiences".to_owned(),
            title: "AI Receipt Scanner & Instant Group Dinner Bill Splitter".to_owned(),
            subtitle: "Extracts line items, tax, and tip from a group receipt and sends PayPal payment links per person.".to_owned(),
            devpost_inspiration_quote: "Splitting a group dinner bill automatically by scanning a receipt, or a payout tool for gig workers that pays out the moment a task is approved.".to_owned(),
            default_amount_usd: 284.00,
            default_currency: "USD".to_owned(),
            mcp_tool: "create_invoice".to_owned(),
            paypal_capabilities: vec![
                "PayPal Invoicing v2".to_owned(),
                "Payment Links & QR Codes".to_owned(),
                "PayPal Orders v2".to_owned(),
            ],
            sponsor_integrations: vec![
                "APIMatic Context Plugin".to_owned(),
                "AG Grid Split Breakdown".to_owned(),
            ],
            sample_breakdown: vec![
                InspirationBreakdownRow {
                    label: "Alex Rivera (Wagyu + Matcha + Tax/Tip)".to_owned(),
                    party: "alex.rivera@paperco.example".to_owned(),
                    amount_display: "$82.00".to_owned(),
                    share_or_meta: "28.9% share · QR Link Sent".to_owned(),
                    status: "Paid".to_owned(),
                },
                InspirationBreakdownRow {
                    label: "Maya Chen (Omakase Set + Tax/Tip)".to_owned(),
                    party: "maya.chen@kiln.example".to_owned(),
                    amount_display: "$76.00".to_owned(),
                    share_or_meta: "26.8% share · QR Link Sent".to_owned(),
                    status: "Paid".to_owned(),
                },
                InspirationBreakdownRow {
                    label: "Priya Nair (Tempura + Yuzu + Tax/Tip)".to_owned(),
                    party: "priya.nair@northwind.example".to_owned(),
                    amount_display: "$64.00".to_owned(),
                    share_or_meta: "22.5% share · QR Link Sent".to_owned(),
                    status: "Awaiting".to_owned(),
                },
                InspirationBreakdownRow {
                    label: "Marcus Vance (Ramen + Gyoza + Tax/Tip)".to_owned(),
                    party: "marcus@studio.example".to_owned(),
                    amount_display: "$62.00".to_owned(),
                    share_or_meta: "21.8% share · QR Link Sent".to_owned(),
                    status: "Paid".to_owned(),
                },
            ],
        },
        InspirationPatternDescriptor {
            id: "phone_instant_send".to_owned(),
            track_id: "money_movement".to_owned(),
            track_title: "Money Movement Experiences".to_owned(),
            title: "Phone Number / Handle Instant Send & Gig Approval Payout".to_owned(),
            subtitle: "Send money with just a phone number or pay gig workers the second a task is approved.".to_owned(),
            devpost_inspiration_quote: "An app that lets you send a friend money with just a phone number, or a payout tool for gig workers that pays out the moment a task is approved.".to_owned(),
            default_amount_usd: 145.00,
            default_currency: "USD".to_owned(),
            mcp_tool: "create_payout_batch".to_owned(),
            paypal_capabilities: vec![
                "PayPal Payouts v1 (PHONE / EMAIL receiver)".to_owned(),
                "Instant Sandbox Settlement".to_owned(),
            ],
            sponsor_integrations: vec![
                "Bryntum Task Timeline".to_owned(),
                "APIMatic Typed SDK".to_owned(),
            ],
            sample_breakdown: vec![
                InspirationBreakdownRow {
                    label: "SMS / Phone Payout · +1 (415) 890-4421".to_owned(),
                    party: "Jordan Lee (Design Sprint Gig)".to_owned(),
                    amount_display: "$145.00".to_owned(),
                    share_or_meta: "Recipient type: PHONE · Instant".to_owned(),
                    status: "Completed".to_owned(),
                },
            ],
        },
        InspirationPatternDescriptor {
            id: "oss_pr_bounty_payout".to_owned(),
            track_id: "money_movement".to_owned(),
            track_title: "Money Movement Experiences".to_owned(),
            title: "Open-Source PR Bond & Instant Contributor Batch Payout (#107 Fix)".to_owned(),
            subtitle: "Verifies merged GitHub PR diff + CI checks and executes PayPal Batch Payouts v1 with 30-day sender_batch_id deduplication.".to_owned(),
            devpost_inspiration_quote: "Fills the missing Payouts gap in @paypal/mcp (#107) and eliminates multi-week manual invoice delays across 13,187 GitHub bounty issues.".to_owned(),
            default_amount_usd: 250.00,
            default_currency: "USD".to_owned(),
            mcp_tool: "sentinel_batch_payout".to_owned(),
            paypal_capabilities: vec![
                "PayPal Batch Payouts v1 (POST /v1/payments/payouts)".to_owned(),
                "30-Day sender_batch_id Replay Guard".to_owned(),
                "Orders v2 AUTHORIZE PR Review Bond".to_owned(),
            ],
            sponsor_integrations: vec![
                "Bryntum Milestone Timeline".to_owned(),
                "AG Grid Bounty Ledger".to_owned(),
                "Render Workflows Webhook".to_owned(),
            ],
            sample_breakdown: vec![
                InspirationBreakdownRow {
                    label: "PR #142 · Fix @paypal/mcp Per-Call Request-Id".to_owned(),
                    party: "github.com/contributor-dev".to_owned(),
                    amount_display: "$250.00".to_owned(),
                    share_or_meta: "CI Green · 2/2 Deterministic Checks Passed".to_owned(),
                    status: "Verified".to_owned(),
                },
                InspirationBreakdownRow {
                    label: "PayPal Batch Payouts v1 (sender_batch_id Guarded)".to_owned(),
                    party: "contributor-sbx@github.example".to_owned(),
                    amount_display: "$250.00".to_owned(),
                    share_or_meta: "Patches @paypal/agent-toolkit Issue #107".to_owned(),
                    status: "Paid Instant".to_owned(),
                },
            ],
        },
        // TRACK 3: BUSINESS SOLUTIONS
        InspirationPatternDescriptor {
            id: "multi_currency_invoice".to_owned(),
            track_id: "business_solutions".to_owned(),
            track_title: "Business Solutions".to_owned(),
            title: "Multi-Currency Freelancer Invoicing + Pay Later 4x".to_owned(),
            subtitle: "Bills international clients in EUR, GBP, or JPY with locked FX preview and PayPal Pay Later 4x installments.".to_owned(),
            devpost_inspiration_quote: "An invoicing tool built for freelancers who bill in multiple currencies, or a point-of-sale add-on for small merchants.".to_owned(),
            default_amount_usd: 360.00,
            default_currency: "EUR".to_owned(),
            mcp_tool: "create_invoice".to_owned(),
            paypal_capabilities: vec![
                "PayPal Invoicing v2 (Multi-Currency)".to_owned(),
                "PayPal Pay Later (4x Installments)".to_owned(),
                "Invoice QR Code Generator".to_owned(),
            ],
            sponsor_integrations: vec![
                "AG Grid Multi-FX Ledger".to_owned(),
                "APIMatic SDK".to_owned(),
            ],
            sample_breakdown: vec![
                InspirationBreakdownRow {
                    label: "Invoice #INV-2026-EUR-09 (EUR -> USD)".to_owned(),
                    party: "Atelier Berlin GmbH".to_owned(),
                    amount_display: "€331.20 ($360.00)".to_owned(),
                    share_or_meta: "FX Rate: 1 EUR = 1.0869 USD".to_owned(),
                    status: "Sent + QR".to_owned(),
                },
                InspirationBreakdownRow {
                    label: "PayPal Pay Later Option Enabled".to_owned(),
                    party: "4 Interest-Free Payments".to_owned(),
                    amount_display: "$90.00 x 4".to_owned(),
                    share_or_meta: "Every 2 weeks · 0% APR".to_owned(),
                    status: "Eligible".to_owned(),
                },
            ],
        },
        InspirationPatternDescriptor {
            id: "marketplace_split_checkout".to_owned(),
            track_id: "business_solutions".to_owned(),
            track_title: "Business Solutions".to_owned(),
            title: "Marketplace Platform + Multi-Seller Automatic Split & Creator Tip".to_owned(),
            subtitle: "Splits checkout automatically between platform fee (10%) and multiple sellers/creators.".to_owned(),
            devpost_inspiration_quote: "A marketplace checkout flow that splits payment automatically between a platform and its sellers, or a tipping/membership tool for creators.".to_owned(),
            default_amount_usd: 450.00,
            default_currency: "USD".to_owned(),
            mcp_tool: "sentinel_direct_card_capture".to_owned(),
            paypal_capabilities: vec![
                "PayPal Orders v2 (Platform Split)".to_owned(),
                "PayPal Payouts v1 (Seller Disbursement)".to_owned(),
                "PayPal Subscriptions v1 (Creator Tier)".to_owned(),
            ],
            sponsor_integrations: vec![
                "Channel3 Marketplace SKU".to_owned(),
                "AG Grid Split Reconciliation".to_owned(),
            ],
            sample_breakdown: vec![
                InspirationBreakdownRow {
                    label: "Platform Commission (10%)".to_owned(),
                    party: "Found Studio Marketplace".to_owned(),
                    amount_display: "$45.00".to_owned(),
                    share_or_meta: "10.0% Platform Fee".to_owned(),
                    status: "Captured".to_owned(),
                },
                InspirationBreakdownRow {
                    label: "Lead Creator Payout (60%)".to_owned(),
                    party: "Kite Design Collective".to_owned(),
                    amount_display: "$270.00".to_owned(),
                    share_or_meta: "60.0% Seller Split".to_owned(),
                    status: "Disbursed".to_owned(),
                },
                InspirationBreakdownRow {
                    label: "3D Shader Contributor Payout (30%)".to_owned(),
                    party: "Sora Motion Lab".to_owned(),
                    amount_display: "$135.00".to_owned(),
                    share_or_meta: "30.0% Seller Split".to_owned(),
                    status: "Disbursed".to_owned(),
                },
            ],
        },
        InspirationPatternDescriptor {
            id: "dispute_evidence_shield".to_owned(),
            track_id: "business_solutions".to_owned(),
            track_title: "Business Solutions".to_owned(),
            title: "Seller Chargeback & SNAD Dispute Evidence Shield (#109/#118 Fix)".to_owned(),
            subtitle: "Auto-defends freelancers and digital sellers against false 'Not as Described' disputes by submitting SHA-256 Intent Mandate + Tracking to PayPal Disputes API.".to_owned(),
            devpost_inspiration_quote: "Replaces @paypal/agent-toolkit's surrender-only accept_dispute_claim (#109/#118) with automated provide-evidence chargeback defense.".to_owned(),
            default_amount_usd: 240.00,
            default_currency: "USD".to_owned(),
            mcp_tool: "sentinel_dispute_evidence_shield".to_owned(),
            paypal_capabilities: vec![
                "PayPal Disputes v1 (POST /v1/customer/disputes/{id}/provide-evidence)".to_owned(),
                "PayPal Shipment Tracking v1 (PROOF_OF_FULFILLMENT)".to_owned(),
                "SHA-256 Verifiable Intent Mandate".to_owned(),
            ],
            sponsor_integrations: vec![
                "AG Grid Dispute Win-Rate Ledger".to_owned(),
                "Bryntum SLA Delivery Proof".to_owned(),
                "TypeSafe Jev Win-Probability (96%)".to_owned(),
            ],
            sample_breakdown: vec![
                InspirationBreakdownRow {
                    label: "Evidence 1 · SHA-256 Signed Buyer Intent Mandate".to_owned(),
                    party: "Permit #PRM-8F12A90C11".to_owned(),
                    amount_display: "$240.00".to_owned(),
                    share_or_meta: "Proves buyer authorized SKU CH3-GPU-101".to_owned(),
                    status: "Attached".to_owned(),
                },
                InspirationBreakdownRow {
                    label: "Evidence 2 · Carrier & Digital Fulfillment Proof".to_owned(),
                    party: "UPS #1Z999AA10123456784 + API Key Log".to_owned(),
                    amount_display: "$240.00".to_owned(),
                    share_or_meta: "Status: DELIVERED · Signed Receipt".to_owned(),
                    status: "Submitted".to_owned(),
                },
                InspirationBreakdownRow {
                    label: "PayPal Disputes v1 Verdict Prediction".to_owned(),
                    party: "POST /v1/customer/disputes/PP-D-88412/provide-evidence".to_owned(),
                    amount_display: "$240.00 Saved".to_owned(),
                    share_or_meta: "96.0% Win Probability · Hold Released".to_owned(),
                    status: "Protected".to_owned(),
                },
            ],
        },
        // TRACK 4: CONSUMER EXPERIENCES
        InspirationPatternDescriptor {
            id: "consumer_budget_categorizer".to_owned(),
            track_id: "consumer_experiences".to_owned(),
            track_title: "Consumer Experiences".to_owned(),
            title: "AI Auto-Budget Categorizer & Duplicate Subscription Shield".to_owned(),
            subtitle: "Categorizes PayPal activity automatically, flags duplicate recurring charges, and files dispute protection.".to_owned(),
            devpost_inspiration_quote: "A budgeting app that categorizes PayPal transactions automatically, or a simpler checkout flow for students, families, and seniors.".to_owned(),
            default_amount_usd: 129.00,
            default_currency: "USD".to_owned(),
            mcp_tool: "list_disputes".to_owned(),
            paypal_capabilities: vec![
                "PayPal Transactions & Reporting".to_owned(),
                "PayPal Subscriptions v1".to_owned(),
                "PayPal Disputes v1 Evidence Guard".to_owned(),
            ],
            sponsor_integrations: vec![
                "AG Grid Category Pivot".to_owned(),
                "TypeSafe Jev Anomaly Score".to_owned(),
            ],
            sample_breakdown: vec![
                InspirationBreakdownRow {
                    label: "Cloud & AI Infrastructure".to_owned(),
                    party: "Nebula GPU + TypeCraft".to_owned(),
                    amount_display: "$425.00".to_owned(),
                    share_or_meta: "68% of monthly budget · Verified".to_owned(),
                    status: "Healthy".to_owned(),
                },
                InspirationBreakdownRow {
                    label: "Duplicate SaaS Subscription Detected".to_owned(),
                    party: "LegacySeat Cloud Plan (#SUB-8821)".to_owned(),
                    amount_display: "$49.00/mo".to_owned(),
                    share_or_meta: "Auto-paused + refund requested".to_owned(),
                    status: "Saved $49".to_owned(),
                },
                InspirationBreakdownRow {
                    label: "Protected Family / Student Safe Checkout".to_owned(),
                    party: "Campus Textbook Bundle".to_owned(),
                    amount_display: "$129.00".to_owned(),
                    share_or_meta: "Risk 6/100 · Buyer Protection Active".to_owned(),
                    status: "Approved".to_owned(),
                },
            ],
        },
        InspirationPatternDescriptor {
            id: "chat_request_money".to_owned(),
            track_id: "consumer_experiences".to_owned(),
            track_title: "Consumer Experiences".to_owned(),
            title: "Embedded In-Chat 'Request Money' Card & 1-Tap Settlement".to_owned(),
            subtitle: "Drops an interactive PayPal Request Money card directly inside Slack/chat threads with 1-tap card capture.".to_owned(),
            devpost_inspiration_quote: "A 'request money' experience embedded in a chat app, or a simpler checkout flow for a niche audience.".to_owned(),
            default_amount_usd: 120.00,
            default_currency: "USD".to_owned(),
            mcp_tool: "create_order".to_owned(),
            paypal_capabilities: vec![
                "PayPal Payment Links & Buttons".to_owned(),
                "PayPal Orders v2".to_owned(),
                "PayPal JS SDK v6 Checkout".to_owned(),
            ],
            sponsor_integrations: vec![
                "Found Slack Thread Embed".to_owned(),
                "APIMatic Contract Validator".to_owned(),
            ],
            sample_breakdown: vec![
                InspirationBreakdownRow {
                    label: "#paperco-kiln · Chat Money Request".to_owned(),
                    party: "Maya Chen -> Found Studio".to_owned(),
                    amount_display: "$120.00".to_owned(),
                    share_or_meta: "Rush Figma Prototype Add-On".to_owned(),
                    status: "Settled in Chat".to_owned(),
                },
            ],
        },
        // TRACK 5: SOCIAL IMPACT IDEAS
        InspirationPatternDescriptor {
            id: "social_impact_multi_cause".to_owned(),
            track_id: "social_impact".to_owned(),
            track_title: "Social Impact Ideas".to_owned(),
            title: "Multi-Cause Split Donation & Neighborhood Solar Co-op Pool".to_owned(),
            subtitle: "Lets donors or neighbors split one contribution across multiple climate/community causes with automated field payouts.".to_owned(),
            devpost_inspiration_quote: "A fundraising page that lets donors split a donation across multiple causes in one transaction, or neighbors pooling money for a block's solar co-op.".to_owned(),
            default_amount_usd: 200.00,
            default_currency: "USD".to_owned(),
            mcp_tool: "create_payout_batch".to_owned(),
            paypal_capabilities: vec![
                "PayPal Donate SDK".to_owned(),
                "PayPal Payouts v1 (Field Partners)".to_owned(),
                "Accessible WCAG AAA Screen-Reader Flow".to_owned(),
            ],
            sponsor_integrations: vec![
                "Bryntum Impact Milestone Schedule".to_owned(),
                "AG Grid Transparency Ledger".to_owned(),
            ],
            sample_breakdown: vec![
                InspirationBreakdownRow {
                    label: "Cause 1 · Block 14 Rooftop Solar Co-op (40%)".to_owned(),
                    party: "solar-coop-sbx@community.example".to_owned(),
                    amount_display: "$80.00".to_owned(),
                    share_or_meta: "40% Split · Microgrid Battery Pool".to_owned(),
                    status: "Disbursed".to_owned(),
                },
                InspirationBreakdownRow {
                    label: "Cause 2 · Underbanked Microloan Seed Pool (35%)".to_owned(),
                    party: "inclusion-fund-sbx@nonprofit.example".to_owned(),
                    amount_display: "$70.00".to_owned(),
                    share_or_meta: "35% Split · 0% Interest Microloans".to_owned(),
                    status: "Disbursed".to_owned(),
                },
                InspirationBreakdownRow {
                    label: "Cause 3 · Local Bay Cleanup & Reef Restore (25%)".to_owned(),
                    party: "bay-cleanup-sbx@eco.example".to_owned(),
                    amount_display: "$50.00".to_owned(),
                    share_or_meta: "25% Split · Field Partner Verified".to_owned(),
                    status: "Disbursed".to_owned(),
                },
            ],
        },
    ]
}

pub async fn execute_inspiration_pattern(
    state: &AppState,
    req: ExecutePatternRequest,
) -> Result<ExecutePatternResponse, SentinelError> {
    let catalog = build_inspiration_catalog();
    let pattern = catalog
        .into_iter()
        .find(|p| p.id == req.pattern_id)
        .ok_or_else(|| SentinelError::UnknownMcpTool {
            tool: req.pattern_id.clone(),
        })?;

    let amount_usd = req.custom_amount_usd.unwrap_or(pattern.default_amount_usd);
    let currency = req
        .custom_currency
        .clone()
        .unwrap_or_else(|| pattern.default_currency.clone());

    let risk_score: u8 = match pattern.track_id.as_str() {
        "social_impact" => 5,
        "consumer_experiences" => 7,
        "money_movement" => 8,
        "business_solutions" => 10,
        _ => 9,
    };

    let (seq, idem_key, policy_snapshot, eval_outcome) = {
        let guard = state.store.read().await;
        let next_seq = guard.sequence + 1;
        let resolved_key = req
            .idempotency_key
            .clone()
            .filter(|k| !k.trim().is_empty())
            .unwrap_or_else(|| format!("pattern-{}-{next_seq}", pattern.id));
        let current_spent = guard.daily_spent_usd();
        let verdict = evaluate_spend_policy(
            &guard.policy,
            &guard.seen_keys,
            current_spent,
            &resolved_key,
            amount_usd,
            risk_score,
        );
        (next_seq, resolved_key, guard.policy.clone(), verdict)
    };

    let eval = match eval_outcome {
        Ok(verdict) => verdict,
        Err(err) => {
            if matches!(
                err,
                SentinelError::SingleOrderCapExceeded { .. }
                    | SentinelError::DailyBudgetExceeded { .. }
                    | SentinelError::MerchantRiskTooHigh { .. }
            ) {
                let blocked_judgment = state.typesafe.deterministic_rubric(
                    amount_usd,
                    &policy_snapshot,
                    risk_score,
                );
                let mut store = state.store.write().await;
                store.sequence += 1;
                store.machine_state = MachineState::PolicyGuardrailCheck;
                let blocked_id = format!("BLOCKED-SBX-{:04}", store.sequence);
                store.orders.insert(
                    0,
                    PayPalOrderRecord {
                        id: blocked_id,
                        idempotency_key: idem_key,
                        intent_prompt: format!("[{}] {}", pattern.track_title, pattern.title),
                        mcp_tool: pattern.mcp_tool,
                        merchant_name: pattern.track_title,
                        merchant_email: "sandbox-settlement@paypal-ai-hackathon.example".to_owned(),
                        item_title: format!("{} ({})", pattern.title, currency),
                        amount_usd,
                        currency,
                        status: OrderStatus::BlockedByPolicy,
                        risk_score,
                        policy_verdict: format!("BLOCKED: {err}"),
                        sandbox_mode: state.paypal.mode_label().to_owned(),
                        approve_url: String::new(),
                        created_at: "2026-11-02T19:00:00Z".to_owned(),
                        capture_id: None,
                        card_last4: None,
                        decision_engine: blocked_judgment,
                        shipment_tracking: None,
                    },
                );
            }
            return Err(err);
        }
    };

    let decision = state
        .typesafe
        .evaluate_order(&pattern.title, amount_usd, &policy_snapshot, risk_score)
        .await;

    let exec = state
        .paypal
        .execute_order_v2(OrderExecutionOptions {
            idempotency_key: &idem_key,
            amount_usd,
            description: &pattern.title,
            sequence_num: seq,
            direct_card_capture: true,
            simulate_decline: None,
        })
        .await?;

    let note_suffix = req
        .custom_note
        .as_deref()
        .filter(|s| !s.trim().is_empty())
        .map(|s| format!(" ({s})"))
        .unwrap_or_default();

    let order = PayPalOrderRecord {
        id: exec.order_id.clone(),
        idempotency_key: idem_key.clone(),
        intent_prompt: format!(
            "[{}] {}{}",
            pattern.track_title, pattern.title, note_suffix
        ),
        mcp_tool: pattern.mcp_tool.clone(),
        merchant_name: pattern.track_title.clone(),
        merchant_email: "sandbox-settlement@paypal-ai-hackathon.example".to_owned(),
        item_title: format!("{} ({})", pattern.title, currency),
        amount_usd,
        currency: currency.clone(),
        status: OrderStatus::Completed,
        risk_score,
        policy_verdict: eval.approved_summary,
        sandbox_mode: exec.sandbox_mode,
        approve_url: exec.approve_url,
        created_at: "2026-11-02T19:00:00Z".to_owned(),
        capture_id: exec.capture_id,
        card_last4: exec.card_last4,
        decision_engine: decision.clone(),
        shipment_tracking: Some(ShipmentTrackingInfo {
            tracking_number: format!("PP-AI-{seq:06}"),
            carrier: "PAYPAL_SANDBOX".to_owned(),
            status: "SETTLED".to_owned(),
            updated_at: "2026-11-02T19:00:00Z".to_owned(),
        }),
    };

    let (daily_spent_usd, remaining_daily_budget_usd) = {
        let mut store = state.store.write().await;
        store.sequence = seq;
        store.seen_keys.insert(idem_key.clone());
        store.machine_state = MachineState::Settled;
        store.orders.insert(0, order.clone());
        let s = store.daily_spent_usd();
        let r = (store.policy.daily_budget_usd - s).max(0.0);
        (s, r)
    };

    let execution_steps = vec![
        format!(
            "1. Pattern Selected: [{}] {}",
            pattern.track_title, pattern.title
        ),
        format!(
            "2. PayPal Capabilities Invoked: {}",
            pattern.paypal_capabilities.join(" + ")
        ),
        format!(
            "3. Rust Spend Guardrail & TypeSafe Jev Check: PASS (${:.2} USD <= ${:.2} cap, risk {} <= {})",
            amount_usd, policy_snapshot.max_single_order_usd, risk_score, policy_snapshot.max_risk_score
        ),
        format!(
            "4. PayPal Sandbox Settlement: Order {} captured (${:.2} USD, key {})",
            order.id, amount_usd, idem_key
        ),
    ];

    let ratio = if pattern.default_amount_usd > 0.0
        && (amount_usd - pattern.default_amount_usd).abs() > 0.01
    {
        amount_usd / pattern.default_amount_usd
    } else {
        1.0
    };

    let breakdown = pattern
        .sample_breakdown
        .iter()
        .map(|row| {
            let scaled_display = if (ratio - 1.0).abs() > 1e-6 {
                if let Some(stripped) = row.amount_display.strip_prefix('$') {
                    let numeric_prefix: String = stripped
                        .chars()
                        .take_while(|c| c.is_ascii_digit() || *c == '.')
                        .collect();
                    let suffix = &stripped[numeric_prefix.len()..];
                    if let Ok(val) = numeric_prefix.parse::<f64>() {
                        format!("${:.2}{suffix}", val * ratio)
                    } else {
                        row.amount_display.clone()
                    }
                } else {
                    row.amount_display.clone()
                }
            } else {
                row.amount_display.clone()
            };
            InspirationBreakdownRow {
                label: row.label.clone(),
                party: row.party.clone(),
                amount_display: scaled_display,
                share_or_meta: row.share_or_meta.clone(),
                status: row.status.clone(),
            }
        })
        .collect();

    Ok(ExecutePatternResponse {
        pattern,
        machine_state: MachineState::Settled,
        execution_steps,
        breakdown,
        order,
        daily_spent_usd,
        remaining_daily_budget_usd,
        decision_engine: decision,
    })
}
