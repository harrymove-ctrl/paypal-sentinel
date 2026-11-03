"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FoundBrandIcon } from "./found-brand-mark";
import {
  BenchoSloshSlider,
  BenchoTiltCard,
  DitherButton,
  DitherCard,
  MdxcnEndpoint,
  MdxcnFrame,
  MdxcnInvoice,
  MdxcnTimeline,
  MdxcnWaterfall,
} from "./tactile-cards";
import type { PayPalReceiptBreakdown } from "./found-overlays";
import type { PayPalOrderRecord } from "./types";

export interface InspirationBreakdownRow {
  label: string;
  party: string;
  amount_display: string;
  share_or_meta: string;
  status: string;
}

export interface InspirationPatternDescriptor {
  id: string;
  track_id: string;
  track_title: string;
  title: string;
  subtitle: string;
  devpost_inspiration_quote: string;
  default_amount_usd: number;
  default_currency: string;
  mcp_tool: string;
  paypal_capabilities: string[];
  sponsor_integrations: string[];
  sample_breakdown: InspirationBreakdownRow[];
}

export interface ExecutePatternResponse {
  pattern: InspirationPatternDescriptor;
  machine_state: string;
  execution_steps: string[];
  breakdown: InspirationBreakdownRow[];
  order: PayPalOrderRecord;
  receipt?: PayPalReceiptBreakdown;
  daily_spent_usd: number;
  remaining_daily_budget_usd: number;
}

const FALLBACK_PATTERNS: InspirationPatternDescriptor[] = [
  {
    id: "a2a_negotiate_settle",
    track_id: "ai_agents",
    track_title: "AI Agents & Automation",
    title: "Agent-to-Agent (A2A) Negotiation & Auto-Settlement",
    subtitle:
      "Buyer Agent and Merchant Agent negotiate SLA + volume discount ($320 -> $265) and settle via PayPal Orders v2.",
    devpost_inspiration_quote:
      "Two agents negotiating and settling a payment between themselves (agent-to-agent commerce), or an AI agent that shops and checks out for you.",
    default_amount_usd: 265,
    default_currency: "USD",
    mcp_tool: "sentinel_direct_card_capture",
    paypal_capabilities: [
      "PayPal Orders v2",
      "PayPal Agent Toolkit (@paypal/agent-toolkit)",
      "PayPal MCP Server (@paypal/mcp)",
      "Idempotent PayPal-Request-Id",
    ],
    sponsor_integrations: [
      "Channel3 Catalog",
      "APIMatic Typed SDK",
      "AG Grid Ledger",
    ],
    sample_breakdown: [
      {
        label: "Round 1 · Initial Ask",
        party: "Nebula-Merchant-Agent",
        amount_display: "$320.00",
        share_or_meta: "64h H100 Spot @ $5.00/hr",
        status: "Countered",
      },
      {
        label: "Round 2 · Buyer Counter-Offer",
        party: "Sentinel-Buyer-Agent",
        amount_display: "$250.00",
        share_or_meta: "Immediate Sandbox Card Capture",
        status: "Countered",
      },
      {
        label: "Round 3 · Signed A2A Clearing Price",
        party: "Both Agents + Rust Guardrail",
        amount_display: "$265.00",
        share_or_meta: "Saved $55.00 (17.2%) · Visa *1881",
        status: "Settled",
      },
    ],
  },
  {
    id: "auto_contractor_payout",
    track_id: "ai_agents",
    track_title: "AI Agents & Automation",
    title: "Scheduling Assistant Auto-Pays Contractor on Job Complete",
    subtitle:
      "Detects verified deliverable + shipment tracking and dispatches instant PayPal Batch Payout.",
    devpost_inspiration_quote:
      "A scheduling assistant that pays contractors automatically when a job is marked complete.",
    default_amount_usd: 185,
    default_currency: "USD",
    mcp_tool: "create_payout_batch",
    paypal_capabilities: [
      "PayPal Payouts v1",
      "Shipment Tracking API",
      "PayPal Webhooks HMAC-SHA256",
    ],
    sponsor_integrations: [
      "Bryntum Scheduler",
      "AG Grid Ledger",
      "Render Workflows",
    ],
    sample_breakdown: [
      {
        label: "Milestone M2 · APIMatic SDK Audit",
        party: "TypeCraft API Studio",
        amount_display: "$185.00",
        share_or_meta: "FedEx #794644790132 · DELIVERED",
        status: "Released",
      },
      {
        label: "Milestone M3 · Bryntum Gantt QA",
        party: "Nordic Timeline Labs",
        amount_display: "$150.00",
        share_or_meta: "DHL #4491200811 · IN_TRANSIT",
        status: "Escrowed",
      },
    ],
  },
  {
    id: "http402_crawler_paywall",
    track_id: "ai_agents",
    track_title: "AI Agents & Automation",
    title: "HTTP 402 / L402 AI Crawler Paywall & Per-Crawl Settlement",
    subtitle:
      "AI research agent hits an HTTP 402 publisher gate, verifies Rust SpendPolicy, and settles via PayPal Orders v2 to unlock a signed bearer token.",
    devpost_inspiration_quote:
      "Like a human paywall checkout, but for AI agents and web crawlers (PayPal Dev Days 1st-Place Winner Pattern).",
    default_amount_usd: 45,
    default_currency: "USD",
    mcp_tool: "sentinel_http402_paywall",
    paypal_capabilities: [
      "HTTP 402 Payment Required + PayPal Orders v2",
      "SHA-256 Permit Receipt",
      "Idempotent PayPal-Request-Id",
    ],
    sponsor_integrations: [
      "Channel3 Licensing SKU",
      "APIMatic Contract Validator",
      "AG Grid Crawl Ledger",
    ],
    sample_breakdown: [
      {
        label: "Step 1 · HTTP 402 Payment Required Quote",
        party: "Publisher Gate (ArXiv / Financial Feed)",
        amount_display: "$45.00",
        share_or_meta: "1,000 licensed API articles @ $0.045/crawl",
        status: "Quoted",
      },
      {
        label: "Step 2 · Rust SpendPermit & SHA-256 Receipt",
        party: "PayPal Sentinel Permit Engine",
        amount_display: "$45.00",
        share_or_meta: "amount <= $500 cap · risk 6 <= 35",
        status: "Permitted",
      },
      {
        label: "Step 3 · PayPal Orders v2 + L402 Bearer Token",
        party: "PayPal Sandbox ACDC *1881",
        amount_display: "$45.00",
        share_or_meta: "200 OK · Signed Macaroon Unlocked",
        status: "Unlocked",
      },
    ],
  },
  {
    id: "receipt_bill_split",
    track_id: "money_movement",
    track_title: "Money Movement Experiences",
    title: "AI Receipt Scanner & Instant Group Dinner Bill Splitter",
    subtitle:
      "Extracts line items, tax, and tip from a group receipt and sends PayPal payment links per person.",
    devpost_inspiration_quote:
      "Splitting a group dinner bill automatically by scanning a receipt, or a payout tool for gig workers that pays out the moment a task is approved.",
    default_amount_usd: 284,
    default_currency: "USD",
    mcp_tool: "create_invoice",
    paypal_capabilities: [
      "PayPal Invoicing v2",
      "Payment Links & QR Codes",
      "PayPal Orders v2",
    ],
    sponsor_integrations: [
      "APIMatic Context Plugin",
      "AG Grid Split Breakdown",
    ],
    sample_breakdown: [
      {
        label: "Alex Rivera (Wagyu + Matcha + Tax/Tip)",
        party: "alex.rivera@paperco.example",
        amount_display: "$82.00",
        share_or_meta: "28.9% share · QR Link Sent",
        status: "Paid",
      },
      {
        label: "Maya Chen (Omakase Set + Tax/Tip)",
        party: "maya.chen@kiln.example",
        amount_display: "$76.00",
        share_or_meta: "26.8% share · QR Link Sent",
        status: "Paid",
      },
      {
        label: "Priya Nair (Tempura + Yuzu + Tax/Tip)",
        party: "priya.nair@northwind.example",
        amount_display: "$64.00",
        share_or_meta: "22.5% share · QR Link Sent",
        status: "Awaiting",
      },
      {
        label: "Marcus Vance (Ramen + Gyoza + Tax/Tip)",
        party: "marcus@studio.example",
        amount_display: "$62.00",
        share_or_meta: "21.8% share · QR Link Sent",
        status: "Paid",
      },
    ],
  },
  {
    id: "phone_instant_send",
    track_id: "money_movement",
    track_title: "Money Movement Experiences",
    title: "Phone Number / Handle Instant Send & Gig Approval Payout",
    subtitle:
      "Send money with just a phone number or pay gig workers the second a task is approved.",
    devpost_inspiration_quote:
      "An app that lets you send a friend money with just a phone number, or a payout tool for gig workers that pays out the moment a task is approved.",
    default_amount_usd: 145,
    default_currency: "USD",
    mcp_tool: "create_payout_batch",
    paypal_capabilities: [
      "PayPal Payouts v1 (PHONE / EMAIL receiver)",
      "Instant Sandbox Settlement",
    ],
    sponsor_integrations: ["Bryntum Task Timeline", "APIMatic Typed SDK"],
    sample_breakdown: [
      {
        label: "SMS / Phone Payout · +1 (415) 890-4421",
        party: "Jordan Lee (Design Sprint Gig)",
        amount_display: "$145.00",
        share_or_meta: "Recipient type: PHONE · Instant",
        status: "Completed",
      },
    ],
  },
  {
    id: "oss_pr_bounty_payout",
    track_id: "money_movement",
    track_title: "Money Movement Experiences",
    title: "Open-Source PR Bond & Instant Contributor Batch Payout (#107 Fix)",
    subtitle:
      "Verifies merged GitHub PR diff + CI checks and executes PayPal Batch Payouts v1 with 30-day sender_batch_id deduplication.",
    devpost_inspiration_quote:
      "Fills the missing Payouts gap in @paypal/mcp (#107) and eliminates multi-week manual invoice delays across 13,187 GitHub bounty issues.",
    default_amount_usd: 250,
    default_currency: "USD",
    mcp_tool: "sentinel_batch_payout",
    paypal_capabilities: [
      "PayPal Batch Payouts v1 (POST /v1/payments/payouts)",
      "30-Day sender_batch_id Replay Guard",
      "Orders v2 AUTHORIZE PR Review Bond",
    ],
    sponsor_integrations: [
      "Bryntum Milestone Timeline",
      "AG Grid Bounty Ledger",
      "Render Workflows Webhook",
    ],
    sample_breakdown: [
      {
        label: "PR #142 · Fix @paypal/mcp Per-Call Request-Id",
        party: "github.com/contributor-dev",
        amount_display: "$250.00",
        share_or_meta: "CI Green · 2/2 Deterministic Checks Passed",
        status: "Verified",
      },
      {
        label: "PayPal Batch Payouts v1 (sender_batch_id Guarded)",
        party: "contributor-sbx@github.example",
        amount_display: "$250.00",
        share_or_meta: "Patches @paypal/agent-toolkit Issue #107",
        status: "Paid Instant",
      },
    ],
  },
  {
    id: "multi_currency_invoice",
    track_id: "business_solutions",
    track_title: "Business Solutions",
    title: "Multi-Currency Freelancer Invoicing + Pay Later 4x",
    subtitle:
      "Bills international clients in EUR, GBP, or JPY with locked FX preview and PayPal Pay Later 4x installments.",
    devpost_inspiration_quote:
      "An invoicing tool built for freelancers who bill in multiple currencies, or a point-of-sale add-on for small merchants.",
    default_amount_usd: 360,
    default_currency: "EUR",
    mcp_tool: "create_invoice",
    paypal_capabilities: [
      "PayPal Invoicing v2 (Multi-Currency)",
      "PayPal Pay Later (4x Installments)",
      "Invoice QR Code Generator",
    ],
    sponsor_integrations: ["AG Grid Multi-FX Ledger", "APIMatic SDK"],
    sample_breakdown: [
      {
        label: "Invoice #INV-2026-EUR-09 (EUR -> USD)",
        party: "Atelier Berlin GmbH",
        amount_display: "€331.20 ($360.00)",
        share_or_meta: "FX Rate: 1 EUR = 1.0869 USD",
        status: "Sent + QR",
      },
      {
        label: "PayPal Pay Later Option Enabled",
        party: "4 Interest-Free Payments",
        amount_display: "$90.00 x 4",
        share_or_meta: "Every 2 weeks · 0% APR",
        status: "Eligible",
      },
    ],
  },
  {
    id: "marketplace_split_checkout",
    track_id: "business_solutions",
    track_title: "Business Solutions",
    title: "Marketplace Platform + Multi-Seller Automatic Split & Creator Tip",
    subtitle:
      "Splits checkout automatically between platform fee (10%) and multiple sellers/creators.",
    devpost_inspiration_quote:
      "A marketplace checkout flow that splits payment automatically between a platform and its sellers, or a tipping/membership tool for creators.",
    default_amount_usd: 450,
    default_currency: "USD",
    mcp_tool: "sentinel_direct_card_capture",
    paypal_capabilities: [
      "PayPal Orders v2 (Platform Split)",
      "PayPal Payouts v1 (Seller Disbursement)",
      "PayPal Subscriptions v1 (Creator Tier)",
    ],
    sponsor_integrations: [
      "Channel3 Marketplace SKU",
      "AG Grid Split Reconciliation",
    ],
    sample_breakdown: [
      {
        label: "Platform Commission (10%)",
        party: "Found Studio Marketplace",
        amount_display: "$45.00",
        share_or_meta: "10.0% Platform Fee",
        status: "Captured",
      },
      {
        label: "Lead Creator Payout (60%)",
        party: "Kite Design Collective",
        amount_display: "$270.00",
        share_or_meta: "60.0% Seller Split",
        status: "Disbursed",
      },
      {
        label: "3D Shader Contributor Payout (30%)",
        party: "Sora Motion Lab",
        amount_display: "$135.00",
        share_or_meta: "30.0% Seller Split",
        status: "Disbursed",
      },
    ],
  },
  {
    id: "dispute_evidence_shield",
    track_id: "business_solutions",
    track_title: "Business Solutions",
    title: "Seller Chargeback & SNAD Dispute Evidence Shield (#109/#118 Fix)",
    subtitle:
      "Auto-defends freelancers and digital sellers against false 'Not as Described' disputes by submitting SHA-256 Intent Mandate + Tracking to PayPal Disputes API.",
    devpost_inspiration_quote:
      "Replaces @paypal/agent-toolkit's surrender-only accept_dispute_claim (#109/#118) with automated provide-evidence chargeback defense.",
    default_amount_usd: 240,
    default_currency: "USD",
    mcp_tool: "sentinel_dispute_evidence_shield",
    paypal_capabilities: [
      "PayPal Disputes v1 (POST /v1/customer/disputes/{id}/provide-evidence)",
      "PayPal Shipment Tracking v1 (PROOF_OF_FULFILLMENT)",
      "SHA-256 Verifiable Intent Mandate",
    ],
    sponsor_integrations: [
      "AG Grid Dispute Win-Rate Ledger",
      "Bryntum SLA Delivery Proof",
      "TypeSafe Jev Win-Probability (96%)",
    ],
    sample_breakdown: [
      {
        label: "Evidence 1 · SHA-256 Signed Buyer Intent Mandate",
        party: "Permit #PRM-8F12A90C11",
        amount_display: "$240.00",
        share_or_meta: "Proves buyer authorized SKU CH3-GPU-101",
        status: "Attached",
      },
      {
        label: "Evidence 2 · Carrier & Digital Fulfillment Proof",
        party: "UPS #1Z999AA10123456784 + API Key Log",
        amount_display: "$240.00",
        share_or_meta: "Status: DELIVERED · Signed Receipt",
        status: "Submitted",
      },
      {
        label: "PayPal Disputes v1 Verdict Prediction",
        party: "POST /v1/customer/disputes/PP-D-88412/provide-evidence",
        amount_display: "$240.00 Saved",
        share_or_meta: "96.0% Win Probability · Hold Released",
        status: "Protected",
      },
    ],
  },
  {
    id: "consumer_budget_categorizer",
    track_id: "consumer_experiences",
    track_title: "Consumer Experiences",
    title: "AI Auto-Budget Categorizer & Duplicate Subscription Shield",
    subtitle:
      "Categorizes PayPal activity automatically, flags duplicate recurring charges, and files dispute protection.",
    devpost_inspiration_quote:
      "A budgeting app that categorizes PayPal transactions automatically, or a simpler checkout flow for students, families, and seniors.",
    default_amount_usd: 129,
    default_currency: "USD",
    mcp_tool: "list_disputes",
    paypal_capabilities: [
      "PayPal Transactions & Reporting",
      "PayPal Subscriptions v1",
      "PayPal Disputes v1 Evidence Guard",
    ],
    sponsor_integrations: [
      "AG Grid Category Pivot",
      "TypeSafe Jev Anomaly Score",
    ],
    sample_breakdown: [
      {
        label: "Cloud & AI Infrastructure",
        party: "Nebula GPU + TypeCraft",
        amount_display: "$425.00",
        share_or_meta: "68% of monthly budget · Verified",
        status: "Healthy",
      },
      {
        label: "Duplicate SaaS Subscription Detected",
        party: "LegacySeat Cloud Plan (#SUB-8821)",
        amount_display: "$49.00/mo",
        share_or_meta: "Auto-paused + refund requested",
        status: "Saved $49",
      },
      {
        label: "Protected Family / Student Safe Checkout",
        party: "Campus Textbook Bundle",
        amount_display: "$129.00",
        share_or_meta: "Risk 6/100 · Buyer Protection Active",
        status: "Approved",
      },
    ],
  },
  {
    id: "chat_request_money",
    track_id: "consumer_experiences",
    track_title: "Consumer Experiences",
    title: "Embedded In-Chat 'Request Money' Card & 1-Tap Settlement",
    subtitle:
      "Drops an interactive PayPal Request Money card directly inside Slack/chat threads with 1-tap card capture.",
    devpost_inspiration_quote:
      "A 'request money' experience embedded in a chat app, or a simpler checkout flow for a niche audience.",
    default_amount_usd: 120,
    default_currency: "USD",
    mcp_tool: "create_order",
    paypal_capabilities: [
      "PayPal Payment Links & Buttons",
      "PayPal Orders v2",
      "PayPal JS SDK v6 Checkout",
    ],
    sponsor_integrations: [
      "Found Slack Thread Embed",
      "APIMatic Contract Validator",
    ],
    sample_breakdown: [
      {
        label: "#paperco-kiln · Chat Money Request",
        party: "Maya Chen -> Found Studio",
        amount_display: "$120.00",
        share_or_meta: "Rush Figma Prototype Add-On",
        status: "Settled in Chat",
      },
    ],
  },
  {
    id: "social_impact_multi_cause",
    track_id: "social_impact",
    track_title: "Social Impact Ideas",
    title: "Multi-Cause Split Donation & Neighborhood Solar Co-op Pool",
    subtitle:
      "Lets donors or neighbors split one contribution across multiple climate/community causes with automated field payouts.",
    devpost_inspiration_quote:
      "A fundraising page that lets donors split a donation across multiple causes in one transaction, or neighbors pooling money for a block's solar co-op.",
    default_amount_usd: 200,
    default_currency: "USD",
    mcp_tool: "create_payout_batch",
    paypal_capabilities: [
      "PayPal Donate SDK",
      "PayPal Payouts v1 (Field Partners)",
      "Accessible WCAG AAA Screen-Reader Flow",
    ],
    sponsor_integrations: [
      "Bryntum Impact Milestone Schedule",
      "AG Grid Transparency Ledger",
    ],
    sample_breakdown: [
      {
        label: "Cause 1 · Block 14 Rooftop Solar Co-op (40%)",
        party: "solar-coop-sbx@community.example",
        amount_display: "$80.00",
        share_or_meta: "40% Split · Microgrid Battery Pool",
        status: "Disbursed",
      },
      {
        label: "Cause 2 · Underbanked Microloan Seed Pool (35%)",
        party: "inclusion-fund-sbx@nonprofit.example",
        amount_display: "$70.00",
        share_or_meta: "35% Split · 0% Interest Microloans",
        status: "Disbursed",
      },
      {
        label: "Cause 3 · Local Bay Cleanup & Reef Restore (25%)",
        party: "bay-cleanup-sbx@eco.example",
        amount_display: "$50.00",
        share_or_meta: "25% Split · Field Partner Verified",
        status: "Disbursed",
      },
    ],
  },
];

const TRACK_TABS = [
  { id: "ai_agents", label: "1. AI Agents & A2A" },
  { id: "money_movement", label: "2. Money Movement" },
  { id: "business_solutions", label: "3. Business Solutions" },
  { id: "consumer_experiences", label: "4. Consumer" },
  { id: "social_impact", label: "5. Social Impact" },
] as const;

interface FoundInspirationStudioProps {
  apiBase: string;
  onPatternSettled?: (resp: ExecutePatternResponse) => void;
  onOpenReceipt?: (
    orderId: string,
    receipt?: PayPalReceiptBreakdown,
    order?: PayPalOrderRecord,
  ) => void;
}

export function FoundInspirationStudio({
  apiBase,
  onPatternSettled,
  onOpenReceipt,
}: FoundInspirationStudioProps) {
  const [patterns, setPatterns] =
    useState<InspirationPatternDescriptor[]>(FALLBACK_PATTERNS);
  const [activeTrackId, setActiveTrackId] = useState<string>("ai_agents");
  const [selectedPatternId, setSelectedPatternId] = useState<string>(
    "a2a_negotiate_settle",
  );
  const [customAmount, setCustomAmount] = useState<string>("265");
  const [customNote, setCustomNote] = useState<string>("");
  const [executing, setExecuting] = useState<boolean>(false);
  const [runningAll, setRunningAll] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<ExecutePatternResponse | null>(
    null,
  );
  const [allPatternResults, setAllPatternResults] = useState<
    ExecutePatternResponse[]
  >([]);
  const [showRawJson, setShowRawJson] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${apiBase}/api/patterns/catalog`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data && Array.isArray(data.patterns) && data.patterns.length > 0) {
          setPatterns(data.patterns);
        }
      })
      .catch(() => {
        // Keep fallback patterns when offline
      });
    return () => {
      cancelled = true;
    };
  }, [apiBase]);

  const trackPatterns = patterns.filter((p) => p.track_id === activeTrackId);
  const activePattern =
    patterns.find((p) => p.id === selectedPatternId) ||
    trackPatterns[0] ||
    patterns[0];

  const handleSelectTrack = useCallback(
    (trackId: string) => {
      setActiveTrackId(trackId);
      const firstInTrack = patterns.find((p) => p.track_id === trackId);
      if (firstInTrack) {
        setSelectedPatternId(firstInTrack.id);
        setCustomAmount(String(firstInTrack.default_amount_usd));
      }
      setErrorText(null);
    },
    [patterns],
  );

  const handleSelectPattern = useCallback(
    (pat: InspirationPatternDescriptor) => {
      setSelectedPatternId(pat.id);
      setCustomAmount(String(pat.default_amount_usd));
      setErrorText(null);
    },
    [],
  );

  const handleExecutePattern = useCallback(async () => {
    if (!activePattern) return;
    setExecuting(true);
    setErrorText(null);

    const parsedAmount =
      Number.parseFloat(customAmount) || activePattern.default_amount_usd;

    try {
      const res = await fetch(`${apiBase}/api/patterns/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pattern_id: activePattern.id,
          custom_amount_usd: parsedAmount,
          custom_currency: activePattern.default_currency,
          custom_note: customNote.trim() || undefined,
          idempotency_key: `pattern-${activePattern.id}-${Date.now()}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorText(
          data?.message || data?.error || `Guardrail rejected (${res.status})`,
        );
      } else {
        const typed = data as ExecutePatternResponse;
        setLastResult(typed);
        setAllPatternResults((prev) => {
          const filtered = prev.filter((r) => r.pattern.id !== typed.pattern.id);
          return [typed, ...filtered];
        });
        onPatternSettled?.(typed);
      }
    } catch {
      setErrorText(
        "Could not reach Rust Axum API on :4180. Check backend connection.",
      );
    } finally {
      setExecuting(false);
    }
  }, [activePattern, apiBase, customAmount, customNote, onPatternSettled]);

  const handleRunAll12Patterns = useCallback(async () => {
    if (runningAll || executing) return;
    setRunningAll(true);
    setErrorText(null);
    const collected: ExecutePatternResponse[] = [];

    try {
      for (const pat of patterns) {
        // Use a compact amount ($50) when sweeping all 12 patterns so all 12 fit comfortably inside the $2,500 daily cap
        const sweepAmount = Math.min(pat.default_amount_usd, 120);
        const res = await fetch(`${apiBase}/api/patterns/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pattern_id: pat.id,
            custom_amount_usd: sweepAmount,
            custom_currency: pat.default_currency,
            custom_note: `12-Pattern Live Verification Sweep (${pat.id})`,
            idempotency_key: `sweep-12-${pat.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          }),
        });
        if (res.ok) {
          const data = (await res.json()) as ExecutePatternResponse;
          collected.push(data);
          setLastResult(data);
          onPatternSettled?.(data);
        }
      }
      if (collected.length > 0) {
        setAllPatternResults(collected);
      } else {
        setErrorText("Could not execute pattern sweep on Rust backend.");
      }
    } catch {
      setErrorText(
        "Could not reach Rust Axum API on :4180 during 12-pattern sweep.",
      );
    } finally {
      setRunningAll(false);
    }
  }, [apiBase, executing, onPatternSettled, patterns, runningAll]);

  const parsedCustomAmount =
    Number.parseFloat(customAmount) || (activePattern ? activePattern.default_amount_usd : 265);

  const asciiFigure = useMemo(() => {
    if (!activePattern) return "";
    const barWidth = 20;
    const splitRows = activePattern.sample_breakdown.map((row) => {
      const rawAmt =
        Number.parseFloat(row.amount_display.replace(/[^0-9.]/g, "")) || 40;
      const pct = Math.min(
        100,
        Math.max(
          5,
          (rawAmt / (activePattern.default_amount_usd || 100)) * 100,
        ),
      );
      const filled = Math.round((pct / 100) * barWidth);
      const empty = Math.max(0, barWidth - filled);
      const bar = "█".repeat(filled) + "░".repeat(empty);
      const label = row.label.slice(0, 24).padEnd(24, " ");
      return `|  ${label} [${bar}] ${pct.toFixed(0).padStart(3, " ")}% ${row.amount_display.padStart(8, " ")}  |`;
    });

    const steps = (
      lastResult
        ? lastResult.execution_steps
        : [
            "Rust spend guardrail pre-check (< $500 single order cap)",
            "TypeSafe Jev rubric (risk score <= 35 PASS)",
            `PayPal Orders v2 / ${activePattern.mcp_tool} dispatch`,
            "Idempotent commit to AG Studio ledger and sponsor state",
          ]
    ).map(
      (s, i) => `|  ● 0${i + 1} ${s.slice(0, 60).padEnd(60, " ")}  |`,
    );

    return [
      "+--------------------------------------------------------------------------------+",
      `|  PAYPAL AI PATTERN: ${activePattern.title.slice(0, 56).padEnd(56, " ")} |`,
      `|  Track: ${activePattern.track_title.padEnd(26, " ")} | Tool: ${activePattern.mcp_tool.padEnd(28, " ")} |`,
      `|  Settlement Amount: $${parsedCustomAmount.toFixed(2).padEnd(10, " ")} | Status: ${(lastResult ? `SETTLED (${lastResult.order.id})` : "READY FOR 1-CLICK DISPATCH").padEnd(34, " ")} |`,
      "+--------------------------------------------------------------------------------+",
      "|  SPLIT WATERFALL & LEDGER ALLOCATION:                                          |",
      ...splitRows,
      "+--------------------------------------------------------------------------------+",
      "|  EXECUTION TIMELINE & REASONING TRACE:                                         |",
      ...steps,
      "+--------------------------------------------------------------------------------+",
    ].join("\n");
  }, [activePattern, parsedCustomAmount, lastResult]);

  const waterfallItems = useMemo(() => {
    if (!activePattern) return [];
    const total = parsedCustomAmount;
    return activePattern.sample_breakdown.map((row) => {
      const rawAmt =
        Number.parseFloat(row.amount_display.replace(/[^0-9.]/g, "")) ||
        total / activePattern.sample_breakdown.length;
      const ratio =
        activePattern.default_amount_usd > 0
          ? total / activePattern.default_amount_usd
          : 1;
      const scaledAmt = rawAmt * ratio;
      return {
        label: row.label,
        party: row.party,
        amount: scaledAmt,
        total: total,
        tone:
          row.status === "Settled" ||
          row.status === "Paid" ||
          row.status === "Released"
            ? ("ok" as const)
            : ("accent" as const),
      };
    });
  }, [activePattern, parsedCustomAmount]);

  const invoiceRows = useMemo(() => {
    if (!activePattern) return [];
    const ratio =
      activePattern.default_amount_usd > 0
        ? parsedCustomAmount / activePattern.default_amount_usd
        : 1;
    return activePattern.sample_breakdown.map((row) => {
      const rawAmt =
        Number.parseFloat(row.amount_display.replace(/[^0-9.]/g, "")) || 40;
      const scaledAmt = rawAmt * ratio;
      return {
        label: row.label,
        detail: `${row.party} · ${row.share_or_meta}`,
        amountDisplay: `$${scaledAmt.toFixed(2)}`,
        badge: row.status,
      };
    });
  }, [activePattern, parsedCustomAmount]);

  if (!activePattern) return null;

  return (
    <section
      data-testid="paypal-inspiration-studio"
      className="mb-6"
    >
      <MdxcnFrame
        title="PayPal + AI Pattern Studio"
        subtitle="5 Official Devpost Tracks"
        ascii={asciiFigure}
        headerAction={
          <div
            className="found-ctxsw flex-wrap"
            role="tablist"
            aria-label="PayPal AI Hackathon Official Inspiration Tracks"
          >
            {TRACK_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={activeTrackId === t.id}
                data-testid={`inspiration-track-${t.id}`}
                className={activeTrackId === t.id ? "on" : ""}
                onClick={() => handleSelectTrack(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        }
      >
        {/* Clean Segmented Pattern Selector (Zero Heavy Box Outlines) */}
        <div className="mb-4 flex flex-wrap items-center gap-1.5 rounded-xl bg-[var(--soft)] p-1">
          {trackPatterns.map((pat) => {
            const isSelected = pat.id === activePattern.id;
            return (
              <button
                key={pat.id}
                type="button"
                data-testid={`inspiration-pattern-${pat.id}`}
                onClick={() => handleSelectPattern(pat)}
                className={`rounded-lg px-3 py-1.5 text-left text-[12px] transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[var(--surface)] font-medium text-[var(--ink)] shadow-[0_1px_2px_rgba(24,24,27,0.06)]"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                <span>{pat.title}</span>
                <span className="ml-2 font-mono text-[11px] tabular-nums opacity-70">
                  ${pat.default_amount_usd}
                </span>
              </button>
            );
          })}
        </div>

        {/* Clean 2-Column Split Separated by 1px Vertical Divider (Zero Nested Box-in-Box) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Active Pattern Info & Split Waterfall */}
          <div className="flex flex-col justify-between lg:col-span-7 lg:border-r lg:border-[var(--line)] lg:pr-6">
            <div>
              <div className="flex items-center justify-between gap-2 text-[11.5px]">
                <span className="font-medium text-[var(--accent)]">
                  {activePattern.track_title}
                </span>
                <span className="font-mono text-[11px] text-[var(--muted)]">
                  @paypal/mcp · {activePattern.mcp_tool}
                </span>
              </div>

              <h4 className="mt-1 text-[15px] font-semibold tracking-tight text-[var(--ink)]">
                {activePattern.title}
              </h4>
              <p className="mt-1 text-[13px] leading-relaxed text-[var(--muted)]">
                {activePattern.subtitle}
              </p>
            </div>

            <div className="mt-4 border-t border-[var(--line)] pt-3">
              <MdxcnWaterfall items={waterfallItems} />
            </div>
          </div>

          {/* Right Column: Clean Tenor-Style Amount Slider & 1-Click Settlement */}
          <div className="flex flex-col justify-between lg:col-span-5">
            <div className="space-y-4">
              <BenchoSloshSlider
                min={25}
                max={500}
                step={5}
                value={parsedCustomAmount}
                onChange={(val) => setCustomAmount(String(val))}
                label="Settlement Amount"
                unit="$"
                viscosity={15}
                momentum={55}
                corner={14}
                tilt={35}
                presets={[50, 100, 240, 265, 450]}
              />

              <input
                type="hidden"
                data-testid="pattern-amount-input"
                value={customAmount}
                readOnly
              />

              <div className="flex gap-2">
                <DitherButton
                  variant="primary"
                  data-testid="execute-pattern-btn"
                  disabled={executing || runningAll}
                  onClick={handleExecutePattern}
                  className="flex-1 py-2.5 text-[12.5px]"
                >
                  {executing
                    ? "Executing PayPal Sandbox..."
                    : `Settle $${parsedCustomAmount.toFixed(0)} via PayPal Sandbox ->`}
                </DitherButton>

                <button
                  type="button"
                  data-testid="run-all-12-patterns-btn"
                  disabled={runningAll || executing}
                  onClick={handleRunAll12Patterns}
                  className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-[12px] font-medium text-[var(--ink)] shadow-sm hover:bg-[var(--soft)] disabled:opacity-50 cursor-pointer"
                  title="Sequentially execute all 12 patterns and generate verifiable receipts"
                >
                  {runningAll ? "Running 12..." : "Run All 12"}
                </button>
              </div>

              {errorText ? (
                <div
                  data-testid="pattern-error-banner"
                  className="rounded-lg bg-rose-50 px-3 py-2 text-[12px] font-medium text-rose-700"
                >
                  {errorText}
                </div>
              ) : null}
            </div>

            <div className="mt-4 border-t border-[var(--line)] pt-2.5">
              {lastResult ? (
                <div
                  data-testid="pattern-execution-steps"
                  className="flex flex-col gap-1.5 font-mono text-[11.5px]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-[var(--ok)]">
                      SETTLED · {lastResult.order.id}
                    </span>
                    <span className="font-semibold text-[var(--ink)]">
                      ${lastResult.order.amount_usd.toFixed(2)} {lastResult.order.currency}
                    </span>
                  </div>
                  {lastResult.receipt && (
                    <div className="flex items-center justify-between gap-2 text-[11px] text-[var(--muted)]">
                      <span>{lastResult.receipt.receipt_id}</span>
                      <button
                        type="button"
                        className="found-tlink cursor-pointer text-[11px]"
                        onClick={() =>
                          onOpenReceipt?.(
                            lastResult.order.id,
                            lastResult.receipt,
                            lastResult.order,
                          )
                        }
                      >
                        Inspect Full Receipt &amp; JSON &rarr;
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2 text-[11.5px] text-[var(--muted)]">
                  <span>
                    Guardrail: <b className="text-[var(--ink)]">&le; $500</b> &middot;{" "}
                    <b className="text-[var(--ink)]">Risk &le; 35</b>
                  </span>
                  <span className="font-mono text-[10.5px] text-[var(--accent)]">
                    Orders v2 + MCP
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Verifiable Pattern Receipt Dossier Card */}
        {lastResult?.receipt && (
          <div
            data-testid="pattern-receipt-card"
            className="mt-5 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3.5 text-[12px]"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-[var(--ok)]">
                  {lastResult.receipt.receipt_id}
                </span>
                <span className="rounded bg-[var(--soft)] px-1.5 py-0.5 font-mono text-[10.5px] text-[var(--muted)]">
                  {lastResult.receipt.paypal_order_id}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-[var(--muted)]">
                  UUID: {lastResult.receipt.paypal_request_id_uuid.slice(0, 18)}...
                </span>
                <button
                  type="button"
                  className="found-tlink cursor-pointer"
                  onClick={() =>
                    onOpenReceipt?.(
                      lastResult.order.id,
                      lastResult.receipt,
                      lastResult.order,
                    )
                  }
                >
                  Open in Receipt &amp; Shield Modal
                </button>
              </div>
            </div>

            <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              <div>
                <span className="text-[11px] text-[var(--muted)]">Gross Settled:</span>
                <div className="font-mono font-semibold text-[var(--ink)]">
                  ${lastResult.receipt.gross_amount_usd.toFixed(2)}{" "}
                  {lastResult.receipt.currency}
                </div>
              </div>
              <div>
                <span className="text-[11px] text-[var(--muted)]">
                  PayPal Fee (2.9% + $0.30):
                </span>
                <div className="font-mono text-[var(--muted)]">
                  ${lastResult.receipt.fee_usd.toFixed(2)}{" "}
                  {lastResult.receipt.currency}
                </div>
              </div>
              <div>
                <span className="text-[11px] text-[var(--muted)]">Net Received:</span>
                <div className="font-mono font-semibold text-[var(--ok)]">
                  ${lastResult.receipt.net_amount_usd.toFixed(2)}{" "}
                  {lastResult.receipt.currency}
                </div>
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-[var(--line)] pt-2 text-[11px]">
              <span className="font-mono text-[var(--muted)] truncate">
                Endpoint: {lastResult.receipt.paypal_api_endpoint}
              </span>
              <button
                type="button"
                className="found-tlink cursor-pointer shrink-0"
                onClick={() => setShowRawJson((v) => !v)}
              >
                {showRawJson ? "Hide Raw JSON" : "Show Raw PayPal JSON"}
              </button>
            </div>

            {showRawJson && (
              <pre className="mt-2 max-h-36 overflow-y-auto rounded-lg bg-[var(--soft)] p-2 font-mono text-[10.5px] leading-relaxed text-[var(--ink)]">
                {JSON.stringify(
                  {
                    request: lastResult.receipt.raw_paypal_request,
                    response: lastResult.receipt.raw_paypal_response,
                  },
                  null,
                  2,
                )}
              </pre>
            )}
          </div>
        )}

        {/* Live 12/12 Verified Pattern Receipts Matrix */}
        {allPatternResults.length > 0 && (
          <div
            data-testid="all-12-patterns-results-table"
            className="mt-5 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3 text-[12px]"
          >
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
              <span className="font-semibold text-[var(--ink)]">
                Live Pattern Receipts Matrix ({allPatternResults.length} Verified)
              </span>
              <span className="font-mono text-[11px] text-[var(--ok)]">
                100% Verifiable Receipts &amp; UUIDs
              </span>
            </div>

            <div className="mt-2 divide-y divide-[var(--line)] overflow-x-auto">
              {allPatternResults.map((item) => (
                <div
                  key={item.pattern.id}
                  data-testid={`pattern-result-row-${item.pattern.id}`}
                  className="flex items-center justify-between gap-3 py-2 text-[11.5px]"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-[var(--ink)] truncate">
                      {item.pattern.title}
                    </div>
                    <div className="font-mono text-[10.5px] text-[var(--muted)] truncate">
                      {item.receipt?.receipt_id || "RCPT-PP-VERIFIED"} ·{" "}
                      {item.order.id} · UUID:{" "}
                      {item.receipt?.paypal_request_id_uuid.slice(0, 8)}...
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="font-mono font-semibold text-[var(--ok)]">
                      ${item.order.amount_usd.toFixed(2)} {item.order.currency}
                    </span>
                    <button
                      type="button"
                      className="found-tlink cursor-pointer text-[11px]"
                      onClick={() =>
                        onOpenReceipt?.(
                          item.order.id,
                          item.receipt,
                          item.order,
                        )
                      }
                    >
                      View Receipt &amp; JSON
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </MdxcnFrame>
    </section>
  );
}
