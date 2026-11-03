# Project 1: PayPal Sentinel (All-Concept PayPal and AI Suite)

## Concept: Unified Safe Agentic Shopping, Autonomous Milestone Escrow, and Multi-Party Revenue Splitting

1. Current Phase: Phase 3 Complete, November 5, 2026 Early Eligibility Review Ready, November 12, 2026 Final Submission Ready.
2. Target Persona: Small business owners, enterprise engineering leads, freelance collectives, non-profit organizers, and autonomous AI consumer agents.
3. Core Problem Solved: Users want autonomous AI agents to search vendors, negotiate contracts, and settle payments, but nobody trusts LLMs with raw credit card access due to hallucinated totals, duplicate tool calls, or rogue merchant charges.
4. Measurable Solution: PayPal Sentinel unifies AI discovery with deterministic Rust financial guardrails, per-order caps, merchant allowlists, daily budget locks, and instant PayPal Sandbox settlement across all hackathon tracks.

## Live Submission Artifacts and Links

1. Hosted Live Demo URL: https://paypal-sentinel-production.up.railway.app (Production deployment on Railway with companion Render Blueprint support via `render.yaml`).
2. Public Open-Source GitHub Repository: https://github.com/harrymove-ctrl/paypal-sentinel (MIT License visible in repository About section).
3. Master Demo Film (Runtime: 2 minutes 44 seconds, 1080p at 30fps, strictly under 3 minutes): https://github.com/harrymove-ctrl/paypal-sentinel/releases/download/v1.0.0/paypal-sentinel-hackathon-master.mp4 (Local path: `projects/project_1/docs/video/exports/paypal-sentinel-hackathon-master.mp4`).
4. Social and X Launch Video (Runtime: 44 seconds, 1080p at 30fps): https://github.com/harrymove-ctrl/paypal-sentinel/releases/download/v1.0.0/paypal-sentinel-x-launch.mp4 (Local path: `projects/project_1/docs/video/exports/paypal-sentinel-x-launch.mp4`).

## Unified Architecture: Three Hackathon Pillars in One Production System

PayPal Sentinel unifies three core financial workflows into a single coherent application:

1. Pillar 1: Safe Agentic Shopping and Team Procurement Desk (Original Sentinel Core). Enables AI agents to discover physical and digital inventory via Channel3, judge counterparty risk via TypeSafe AI Jev, and execute headless card settlement using PayPal Orders v2 with Visa test card ending in 1881.
2. Pillar 2: Autonomous Milestone Escrow and Multi-Currency Invoicing (PayPal Pact Integration). Automates contractor agreements, Bryntum timeline scheduling, multi-currency invoicing in EUR, GBP, and JPY, and unlocks funds upon carrier delivery verification via PayPal Shipment Tracking v1.
3. Pillar 3: Multi-Party Revenue, Bounty, and Donation Splitting (PayPal SplitStream Integration). Provides instant programmatic money distribution for dinner bills, GitHub issue bounty bonds, marketplace platform commissions, creator splits, and neighborhood social impact co-op pools via PayPal Batch Payouts v1.

## Five Official Devpost Tracks and Twelve Live Executable Patterns

The engine exposes 12 live executable patterns implemented in `backend-rust/src/patterns.rs` and selectable in the Next.js Cockpit (`web/src/components/cockpit/found-inspiration-studio.tsx`):

### Track 1: AI Agents and Automation

1. `a2a_negotiate_settle`: Agent-to-Agent (A2A) Negotiation and Auto-Settlement. Buyer Agent and Merchant Agent negotiate service-level agreements and volume discounts ($320 down to $265) before settling through PayPal Orders v2 with Visa card 1881.
2. `auto_contractor_payout`: Scheduling Assistant Auto-Pays Contractor on Job Complete. Detects verified deliverable and shipment tracking status before triggering an instant PayPal Batch Payout v1.
3. `http402_crawler_paywall`: HTTP 402 and L402 AI Crawler Paywall with Per-Crawl Settlement. Autonomous research agent encounters an HTTP 402 paywall, verifies Rust spend policy, and settles a micro-charge via PayPal Orders v2 to obtain a signed SHA-256 permit receipt.

### Track 2: Money Movement Experiences

1. `receipt_bill_split`: AI Receipt Scanner and Instant Group Dinner Bill Splitter. Parses line items, taxes, and gratuity from dining receipts to generate itemized PayPal Invoicing v2 payment links and QR codes.
2. `phone_instant_send`: Phone Number and Handle Instant Send for Gig Approval Payouts. Dispatches instant contractor payouts via PayPal Payouts v1 using telephone numbers or email handles the moment work is approved.
3. `oss_pr_bounty_payout`: Open-Source Pull Request Bond and Instant Contributor Batch Payout. Solves official PayPal Agent Toolkit issue 107 by providing programmatic Payouts with 30-day `sender_batch_id` deduplication upon merged pull requests.

### Track 3: Business Solutions

1. `multi_currency_invoice`: Multi-Currency Freelancer Invoicing with Pay Later Installments. Issues cross-border invoices in EUR, GBP, or JPY converted to USD with optional 4-installment interest-free PayPal Pay Later terms.
2. `marketplace_split_checkout`: Marketplace Platform with Multi-Seller Automatic Split and Creator Tips. Automatically disburses gross cart checkout into a 10 percent platform commission, 60 percent lead creator share, and 30 percent contributor payout.
3. `dispute_evidence_shield`: Seller Chargeback and SNAD Dispute Evidence Shield. Solves official PayPal Agent Toolkit issues 109 and 118 by automatically submitting SHA-256 Buyer Intent Mandates and carrier delivery confirmations to `POST /v1/customer/disputes/{id}/provide-evidence`.

### Track 4: Consumer Experiences

1. `consumer_budget_categorizer`: AI Auto-Budget Categorizer and Duplicate Subscription Shield. Audits recurring billing against PayPal Subscriptions v1 and Transactions Reporting v1 to identify redundant SaaS subscriptions and unauthorized charges.
2. `chat_request_money`: Embedded In-Chat Request Money Card with 1-Tap Settlement. Generates interactive payment cards inside collaboration threads backed by PayPal Payment Links and Orders v2.

### Track 5: Social Impact Ideas

1. `social_impact_multi_cause`: Multi-Cause Split Donation and Neighborhood Solar Co-op Pool. Allows donors to split contributions across neighborhood solar grids (40 percent), underbanked microloans (35 percent), and ocean cleanup (25 percent) with accessible WCAG AAA flows and automated field partner disbursement.

## PayPal Developer Platform Capabilities Utilized

1. Orders API v2: Direct server-to-server card capture using `POST /v2/checkout/orders` with idempotent `PayPal-Request-Id` UUID and test card 4012888888881881.
2. Payouts API v1: High-volume batch payouts using `POST /v1/payments/payouts` with deterministic `sender_batch_id` replay protection.
3. Invoicing API v2: Draft, send, and QR generation via `/v2/invoicing/invoices` with multi-currency FX locks.
4. Disputes API v1: Automated chargeback defense via `/v1/customer/disputes/{id}/provide-evidence` with cryptographic proof attachment.
5. Shipment Tracking API v1: Real-time logistics verification via `POST /v1/shipping/trackers-batch` linking carrier tracking numbers with milestone completion.
6. Subscriptions API v1: Active recurring profile inspection and automated cancellation workflows.
7. Reporting and Balances API v1: Account balance audits and 31-day transaction log fetching with fractional millisecond timestamp normalization.
8. PayPal Agent Toolkit and MCP Integration: Ten functional MCP tools combining official `@paypal/agent-toolkit` capabilities with custom Rust-guarded extensions (`sentinel_direct_card_capture`, `sentinel_batch_payout`, `channel3_product_search`).

## Sponsor Bounty Integrations Across Stackable $69,750 Pool

1. Channel3 (Best Use of Channel3, $1,500): Live agentic product discovery via `POST https://api.trychannel3.com/v1/search` with nested offer pricing and availability filtering bounded by Rust spend limits.
2. AG Studio and AG Grid v36 (Best Use of AG Grid, $5,000 / $2,000 / $1,000): Real-time financial telemetry cockpit featuring custom cell renderers, quick search, CSV exports, and natural-language Studio KPI analysis.
3. Bryntum Scheduler (Best Use of Bryntum, $1,000 x3): Visual procurement and restock timeline with multi-scale zoom (7, 14, 30 days) synchronized with live PayPal Shipment Tracking milestones.
4. APIMatic (Best Use of APIMatic, $1,000 x3 plus 6-month Business Plan): Typed OpenAPI 3.1 contract validation across Orders v2, Trackers v1, and Payouts v1.
5. Render and Railway Cloud Infrastructure (Best Use of Render, $1,000 / $750 / $500 credits): Declarative `render.yaml` Blueprint and active production hosting on Railway (`https://paypal-sentinel-production.up.railway.app`).

## Feature Inventory and Milestone Tracking

| Identifier | Capability Description | Target Milestone | Delivery Status |
| :--- | :--- | :--- | :--- |
| F1 | Rust Axum and Tokio Deterministic Spend Guardrail Engine and Root MIT License | M1 | Complete |
| F2 | Channel3 Agentic Product Search and TypeSafe AI Jev Counterparty Risk Judgment | M1 | Complete |
| F3 | PayPal Orders v2 Direct Capture and Ten-Tool Remote MCP Bridge with Shipment Tracking | M2 | Complete |
| F4 | AG Studio Spend Cockpit with AG Grid v36 and Bryntum Vendor Delivery Scheduler | M2 | Complete |
| F5 | Zero-Key 1-Click Judge Sandbox Mode, BunUI Streak Grid, and Playwright 6-Loop QA Suite | M3 | Complete |
| F6 | Railway Production Hosting, Render Blueprint, 2-Minute 44-Second Master Demo Film, and Devpost Submission Kit | M4 | Complete |
