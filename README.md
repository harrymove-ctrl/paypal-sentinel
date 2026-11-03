# PayPal Sentinel: All-Concept PayPal and AI Suite (`projects/project_1`)

PayPal Sentinel is a production-grade, high-assurance agentic commerce engine. It unites **Rust (`axum` + `tokio`)** deterministic financial guardrails with the **PayPal Developer Platform Sandbox**, Channel3 agentic catalog search, TypeSafe AI risk judgment, and an enterprise Next.js 16 cockpit.

The system serves as the all-concept flagship submission for the **PayPal AI Hackathon: Build What's Next with PayPal and AI** ($69,750 prize pool), unifying all three project pillars, five official Devpost tracks, and twelve executable patterns into one integrated application.

## Live Submission Links and Artifacts

1. Hosted Live Demo URL: https://paypal-sentinel-production.up.railway.app (Production deployment on Railway with companion Render Blueprint support via `render.yaml`).
2. Public Open-Source GitHub Repository: https://github.com/harrymove-ctrl/paypal-sentinel (MIT License visible in repository About section).
3. Master Demo Film (Runtime: 2 minutes 44 seconds, 1080p at 30fps, strictly under 3 minutes): https://github.com/harrymove-ctrl/paypal-sentinel/releases/download/v1.0.0/paypal-sentinel-hackathon-master.mp4 (Local path: `docs/video/exports/paypal-sentinel-hackathon-master.mp4`).
4. Social and X Launch Video (Runtime: 44 seconds, 1080p at 30fps): https://github.com/harrymove-ctrl/paypal-sentinel/releases/download/v1.0.0/paypal-sentinel-x-launch.mp4 (Local path: `docs/video/exports/paypal-sentinel-x-launch.mp4`).

## Unified Architecture: Three Pillars in One Platform

PayPal Sentinel consolidates three hackathon concepts into a single production suite:

1. Safe Agentic Shopping and Team Procurement Desk (Original Sentinel Core): Enables autonomous agents to discover retail items via Channel3, evaluate counterparty risk via TypeSafe AI Jev, and execute headless card settlement using PayPal Orders v2 with Visa test card ending in 1881.
2. Autonomous Milestone Escrow and Multi-Currency Invoicing (PayPal Pact): Orchestrates vendor agreements, Bryntum timeline scheduling, multi-currency invoicing across EUR, GBP, and JPY, and unlocks milestone payments upon carrier delivery verification via PayPal Shipment Tracking v1.
3. Multi-Party Revenue, Bounty, and Donation Splitting (PayPal SplitStream): Provides programmatic fund routing for dinner bills, GitHub issue bounty bonds, marketplace platform commissions, creator splits, and neighborhood social impact co-op pools via PayPal Batch Payouts v1.

## Five Devpost Tracks and Twelve Live Executable Patterns

All 12 patterns are implemented in `backend-rust/src/patterns.rs` and executable via the Next.js Cockpit:

### Track 1: AI Agents and Automation

1. `a2a_negotiate_settle`: Agent-to-Agent Negotiation and Auto-Settlement ($320 down to $265 settled via PayPal Orders v2 Visa card 1881).
2. `auto_contractor_payout`: Scheduling Assistant Auto-Pays Contractor on Job Complete (PayPal Payouts v1, Shipment Tracking v1, and Bryntum Scheduler).
3. `http402_crawler_paywall`: HTTP 402 and L402 AI Crawler Paywall with Per-Crawl Settlement (PayPal Dev Days 1st-Place Winner Pattern with SHA-256 Permit Receipt).

### Track 2: Money Movement Experiences

4. `receipt_bill_split`: AI Receipt Scanner and Instant Group Dinner Bill Splitter (PayPal Invoicing v2 and QR Links).
5. `phone_instant_send`: Phone Number and Handle Instant Send for Gig Approval Payouts (PayPal Payouts v1 using telephone numbers or email handles).
6. `oss_pr_bounty_payout`: Open-Source Pull Request Bond and Instant Contributor Batch Payout (Patches official PayPal Agent Toolkit issue 107 with 30-day `sender_batch_id` deduplication).

### Track 3: Business Solutions

7. `multi_currency_invoice`: Multi-Currency Freelancer Invoicing with Pay Later Installments (Invoices in EUR, GBP, or JPY converted to USD with 4x interest-free PayPal Pay Later installments).
8. `marketplace_split_checkout`: Marketplace Platform with Multi-Seller Automatic Split (10 percent platform fee, 60 percent lead creator share, and 30 percent contributor payout).
9. `dispute_evidence_shield`: Seller Chargeback and SNAD Dispute Evidence Shield (Patches official PayPal Agent Toolkit issues 109 and 118 by submitting SHA-256 Buyer Intent Mandates and carrier delivery proofs).

### Track 4: Consumer Experiences

10. `consumer_budget_categorizer`: AI Auto-Budget Categorizer and Duplicate Subscription Shield (PayPal Subscriptions v1 and Transactions Reporting v1).
11. `chat_request_money`: Embedded In-Chat Request Money Card with 1-Tap Settlement (PayPal Payment Links and Orders v2).

### Track 5: Social Impact Ideas

12. `social_impact_multi_cause`: Multi-Cause Split Donation and Neighborhood Solar Co-op Pool (40 percent rooftop solar co-op, 35 percent underbanked microloans, and 25 percent bay cleanup via Donate SDK and Batch Payouts v1).

## Quickstart Guide

### 1. Start the Rust Agentic Settlement API (`http://127.0.0.1:4180`)

```bash
cd /Volumes/Dev/paypal-ai-hackathon/projects/project_1/backend-rust
cargo test
cargo run
```

The Rust backend defaults to the 1-Click Judge Sandbox Mode if environment variables are not supplied. To connect live credentials from developer.paypal.com:

```bash
export PAYPAL_CLIENT_ID="your_sandbox_client_id"
export PAYPAL_CLIENT_SECRET="your_sandbox_client_secret"
export WEBHOOK_HMAC_SECRET="your_webhook_secret"
export CHANNEL3_API_KEY="your_channel3_api_key"
```

### 2. Start the Next.js Web Cockpit (`http://localhost:4100`)

```bash
cd /Volumes/Dev/paypal-ai-hackathon/projects/project_1/web
npm install
npm run dev
```

### 3. Run Real PayPal Sandbox Dev Verification (Zero Browser Popup Needed)

```bash
cd /Volumes/Dev/paypal-ai-hackathon/projects/project_1
cp .env.example .env.local
node scripts/verify-paypal-sandbox.mjs
```

### 4. Run End-to-End Test Suites

```bash
cd /Volumes/Dev/paypal-ai-hackathon/projects/project_1/backend-rust
cargo test

cd /Volumes/Dev/paypal-ai-hackathon/projects/project_1/web
npm run typecheck
npm run test:e2e
```

## Sponsor Integrations

1. Channel3 (Best Use of Channel3, $1,500): Live product search via `POST https://api.trychannel3.com/v1/search` with agentic mode filtering.
2. AG Grid v36 and AG Studio (Best Use of AG Grid, $5,000 / $2,000 / $1,000): Real-time spend telemetry and natural-language KPI synthesis.
3. Bryntum Scheduler (Best Use of Bryntum, $1,000 x3): Visual procurement and restock timeline linked to PayPal Shipment Tracking.
4. APIMatic (Best Use of APIMatic, $1,000 x3 plus 6-month Business Plan): Typed OpenAPI 3.1 contracts for Orders v2, Trackers v1, and Payouts v1.
5. Render and Railway Cloud Hosting (Best Use of Render, $1,000 / $750 / $500 credits): Hosted live demo on Railway and declarative `render.yaml` deployment.

## License

Released under the [MIT License](./LICENSE).
