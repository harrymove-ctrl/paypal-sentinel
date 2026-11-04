"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  { id: "ai_agents", label: "AI Agents" },
  { id: "money_movement", label: "Money Movement" },
  { id: "business_solutions", label: "Business" },
  { id: "consumer_experiences", label: "Consumer" },
  { id: "social_impact", label: "Social Impact" },
] as const;

const SHORT_PATTERN_TITLES: Record<string, string> = {
  a2a_negotiate_settle: "A2A Negotiation",
  auto_contractor_payout: "Contractor Auto-Pay",
  http402_crawler_paywall: "HTTP 402 Paywall",
  receipt_bill_split: "Dinner Bill Split",
  phone_instant_send: "Phone Instant Pay",
  oss_pr_bounty_payout: "OSS PR Bounty",
  multi_currency_invoice: "Multi-FX Invoice",
  marketplace_split_checkout: "Marketplace Split",
  dispute_evidence_shield: "Dispute Shield",
  consumer_budget_categorizer: "Sub & Budget Shield",
  chat_request_money: "Chat Money Request",
  social_impact_multi_cause: "Solar & Cause Split",
};

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
  const [executing, setExecuting] = useState<boolean>(false);
  const [runningAll, setRunningAll] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<ExecutePatternResponse | null>(
    null,
  );
  const [allPatternResults, setAllPatternResults] = useState<
    ExecutePatternResponse[]
  >([]);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${apiBase}/api/patterns/catalog`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (
          !cancelled &&
          data &&
          Array.isArray(data.patterns) &&
          data.patterns.length > 0
        ) {
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
        onPatternSettled?.(typed);
      }
    } catch {
      setErrorText(
        "Could not reach Rust Axum API on :4180. Check backend connection.",
      );
    } finally {
      setExecuting(false);
    }
  }, [activePattern, apiBase, customAmount, onPatternSettled]);

  const handleRunAll12Patterns = useCallback(async () => {
    if (runningAll || executing) return;
    setRunningAll(true);
    setErrorText(null);
    const collected: ExecutePatternResponse[] = [];

    try {
      for (const pat of patterns) {
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
    Number.parseFloat(customAmount) ||
    (activePattern ? activePattern.default_amount_usd : 265);

  const scaledRows = useMemo(() => {
    if (!activePattern) return [];
    const ratio =
      activePattern.default_amount_usd > 0
        ? parsedCustomAmount / activePattern.default_amount_usd
        : 1;
    return activePattern.sample_breakdown.map((row) => {
      const rawAmt =
        Number.parseFloat(row.amount_display.replace(/[^0-9.]/g, "")) || 40;
      return {
        label: row.label,
        party: row.party,
        scaledAmount: `$${(rawAmt * ratio).toFixed(2)}`,
        status: row.status,
      };
    });
  }, [activePattern, parsedCustomAmount]);

  if (!activePattern) return null;

  return (
    <section data-testid="paypal-inspiration-studio" className="mb-6">
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6">
        {/* Clean Header Row + 5 Track Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--line)]">
          <div>
            <h3 className="text-[16px] font-semibold tracking-tight text-[var(--ink)]">
              12 PayPal + AI Patterns
            </h3>
            <p className="text-[12.5px] text-[var(--muted)]">
              Select a track and run real sandbox settlements with verifiable receipts.
            </p>
          </div>

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
        </div>

        {/* Crisp 2-to-3-Word Pattern Pills (Zero Multi-Line Wrapping) */}
        <div className="mt-4 mb-5 flex flex-wrap items-center gap-1.5">
          {trackPatterns.map((pat) => {
            const isSelected = pat.id === activePattern.id;
            const shortLabel = SHORT_PATTERN_TITLES[pat.id] || pat.title;
            return (
              <button
                key={pat.id}
                type="button"
                data-testid={`inspiration-pattern-${pat.id}`}
                onClick={() => handleSelectPattern(pat)}
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12.5px] transition cursor-pointer ${
                  isSelected
                    ? "bg-[var(--ink)] font-medium text-[var(--bg)]"
                    : "bg-[var(--soft)] text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                <span>{shortLabel}</span>
                <span className="font-mono text-[11px] opacity-75">
                  ${pat.default_amount_usd}
                </span>
              </button>
            );
          })}
        </div>

        {/* Clean 2-Column Split */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: Pattern Summary & Clean Hairline Split */}
          <div className="lg:col-span-7 lg:border-r lg:border-[var(--line)] lg:pr-6">
            <div className="flex items-center justify-between gap-2 text-[11.5px] text-[var(--muted)]">
              <span>{activePattern.track_title}</span>
              <span className="font-mono">{activePattern.mcp_tool}</span>
            </div>

            <h4 className="mt-1 text-[15.5px] font-semibold tracking-tight text-[var(--ink)]">
              {activePattern.title}
            </h4>
            <p className="mt-1 text-[13px] leading-relaxed text-[var(--muted)]">
              {activePattern.subtitle}
            </p>

            <div className="mt-4 divide-y divide-[var(--line)] border-t border-[var(--line)]">
              {scaledRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-3 py-2.5 text-[12.5px]"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-[var(--ink)]">
                      {row.label}
                    </div>
                    <div className="truncate text-[11.5px] text-[var(--muted)]">
                      {row.party}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2.5">
                    <span className="text-[11px] text-[var(--muted)]">
                      {row.status}
                    </span>
                    <span className="font-mono font-semibold text-[var(--ink)]">
                      {row.scaledAmount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Clean Amount Control, Primary CTA & Consolidated Receipt Strip */}
          <div className="flex flex-col justify-between gap-4 lg:col-span-5">
            <div className="space-y-4">
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-[12.5px] text-[var(--muted)]">
                    Settlement amount
                  </span>
                  <span className="font-mono text-[18px] font-semibold text-[var(--ink)]">
                    ${parsedCustomAmount.toFixed(0)}{" "}
                    <span className="text-[12px] font-normal text-[var(--muted)]">
                      {activePattern.default_currency}
                    </span>
                  </span>
                </div>

                <input
                  type="range"
                  min={25}
                  max={500}
                  step={5}
                  value={parsedCustomAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  aria-label="Settlement amount"
                  className="w-full accent-[var(--ink)] cursor-pointer"
                />

                <input
                  type="hidden"
                  data-testid="pattern-amount-input"
                  value={customAmount}
                  readOnly
                />

                <div className="mt-2 flex items-center gap-1.5">
                  {[50, 120, 265, 450].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCustomAmount(String(preset))}
                      className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] transition cursor-pointer ${
                        parsedCustomAmount === preset
                          ? "bg-[var(--ink)] text-[var(--bg)]"
                          : "bg-[var(--soft)] text-[var(--muted)] hover:text-[var(--ink)]"
                      }`}
                    >
                      ${preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  data-testid="execute-pattern-btn"
                  disabled={executing || runningAll}
                  onClick={handleExecutePattern}
                  className="found-sbtn-go flex-1 justify-center py-2.5 text-[12.5px]"
                >
                  {executing
                    ? "Settling..."
                    : `Settle $${parsedCustomAmount.toFixed(0)}`}
                </button>

                <button
                  type="button"
                  data-testid="run-all-12-patterns-btn"
                  disabled={runningAll || executing}
                  onClick={handleRunAll12Patterns}
                  className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2 text-[12px] font-medium text-[var(--ink)] hover:bg-[var(--soft)] disabled:opacity-50 cursor-pointer"
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

            {/* Single Clean Receipt Strip (Replaces Duplicate Status + 3-Col Box) */}
            <div className="border-t border-[var(--line)] pt-3">
              {lastResult?.receipt ? (
                <div
                  data-testid="pattern-receipt-card"
                  className="space-y-1 text-[12px]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-semibold text-[var(--ok)]">
                      ✓ {lastResult.receipt.receipt_id}
                    </span>
                    <button
                      type="button"
                      className="found-tlink cursor-pointer text-[11.5px]"
                      onClick={() =>
                        onOpenReceipt?.(
                          lastResult.order.id,
                          lastResult.receipt,
                          lastResult.order,
                        )
                      }
                    >
                      Inspect Receipt &rarr;
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-2 font-mono text-[11px] text-[var(--muted)]">
                    <span>Gross ${lastResult.receipt.gross_amount_usd.toFixed(2)}</span>
                    <span className="text-[var(--ink)]">
                      Net Received: ${lastResult.receipt.net_amount_usd.toFixed(2)}{" "}
                      {lastResult.receipt.currency}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between text-[11.5px] text-[var(--muted)]">
                  <span>Cap &le; $500/order &middot; Risk &le; 35</span>
                  <span className="font-mono">PayPal Sandbox</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Compact Scrollable 12/12 Receipts Matrix (Shown Only After Run All 12) */}
        {allPatternResults.length >= 2 && (
          <div
            data-testid="all-12-patterns-results-table"
            className="mt-5 border-t border-[var(--line)] pt-4 text-[12px]"
          >
            <div className="flex items-center justify-between pb-2">
              <span className="font-semibold text-[var(--ink)]">
                Batch Sweep ({allPatternResults.length} Verified)
              </span>
              <button
                type="button"
                className="found-tlink text-[11.5px] cursor-pointer"
                onClick={() => setAllPatternResults([])}
              >
                Clear list
              </button>
            </div>

            <div className="max-h-64 divide-y divide-[var(--line)] overflow-y-auto pr-1">
              {allPatternResults.map((item) => (
                <div
                  key={item.pattern.id}
                  data-testid={`pattern-result-row-${item.pattern.id}`}
                  className="flex items-center justify-between gap-3 py-2 text-[12px]"
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-[var(--ink)]">
                      {SHORT_PATTERN_TITLES[item.pattern.id] || item.pattern.title}
                    </span>
                    <span className="ml-2 font-mono text-[11px] text-[var(--muted)]">
                      {item.receipt?.receipt_id || item.order.id}
                    </span>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="font-mono font-medium text-[var(--ok)]">
                      ${item.order.amount_usd.toFixed(2)} {item.order.currency}
                    </span>
                    <button
                      type="button"
                      className="found-tlink cursor-pointer text-[11.5px]"
                      onClick={() =>
                        onOpenReceipt?.(
                          item.order.id,
                          item.receipt,
                          item.order,
                        )
                      }
                    >
                      Receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
