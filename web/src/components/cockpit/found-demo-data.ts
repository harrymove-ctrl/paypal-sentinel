export type FoundRoute =
  | "home"
  | "clients"
  | "money"
  | "money-next"
  | "calendar"
  | "slack"
  | "team"
  | "first"
  | "check"
  | "settings"
  | "ledger"
  | "timeline";

export type FoundStyleSkin = "interfere" | "clean" | "lime" | "original";

export interface FoundTriageCard {
  id: string;
  context: "work" | "personal";
  kind: "rev" | "chase" | "meet" | "slack" | "msg" | "todo";
  badge: string;
  client: string;
  title: string;
  body: string;
  meta: string;
  amountUsd?: number;
  primaryAction: string;
  sku?: string;
  directCapture?: boolean;
  replyDrafts: { label: string; text: string }[];
  sheetThreadId?: string;
}

export interface FoundClientRecord {
  id: string;
  name: string;
  tab: "needs" | "clients" | "leads";
  contactName: string;
  contactEmail: string;
  channel: string;
  mood: 1 | 2 | 3 | 4;
  moodReason: string;
  mrrOrTotal: string;
  statusLine: string;
  nextStep: string;
  paypalOrderId?: string;
  shipmentCarrier?: string;
  shipmentStatus?: "DELIVERED" | "IN_TRANSIT" | "ESCROW_LOCKED";
  openNow: { title: string; meta: string; amount?: string }[];
  journey: { when: string; text: string }[];
  people: { name: string; role: string; email: string; onMyTeam?: boolean }[];
  files: { name: string; kind: string; date: string; amount?: string }[];
}

export interface FoundSlackMessage {
  key: string;
  who: string;
  client: string;
  channel: string;
  kind: "unhappy" | "client" | "team";
  hours: number;
  gist: string;
  text: string;
  more?: number;
  tagged?: string[];
}

export interface FoundTeamMemberPulse {
  id: string;
  name: string;
  role: string;
  tone: "good" | "slow" | "quiet";
  note: string;
  levels: (0 | 1 | 2 | 3)[];
  counts: number[];
}

export interface FoundPayNextItem {
  id: string;
  client: string;
  plan: string;
  amountUsd: number;
  interval: "mo" | "yr" | "milestone";
  group: "attention" | "next7" | "weekAfter" | "later" | "leaving";
  daysFromNow: number;
  startPct: number;
  widthPct: number;
  statusNote: string;
  warn?: boolean;
}

export interface FoundRecurringGroup {
  category: string;
  monthlyTotalUsd: number;
  items: {
    id: string;
    vendor: string;
    amountUsd: number;
    cycle: string;
    note: string;
    actionHint?: "negotiate" | "cancel" | "keep";
  }[];
}

export interface FoundCalendarEvent {
  id: string;
  dayOffset: number;
  dateLabel: string;
  time: string;
  kind: "call" | "money" | "due";
  context: "work" | "personal";
  title: string;
  subtitle: string;
  amountUsd?: number;
  incoming?: boolean;
  actionLabel: string;
}

export interface FoundCheckRow {
  key: string;
  section:
    | "Money owed to you"
    | "Replies owed"
    | "Bills to pay"
    | "Promises and to-dos";
  who: string;
  what: string;
  why: string;
  by: "Jev" | "you";
  mark?: boolean;
}

export interface FoundSheetDocument {
  id: string;
  kind: "email" | "invoice" | "contract" | "draft";
  title: string;
  subtitle: string;
  from: string;
  to: string;
  date: string;
  amount?: string;
  paypalOrderId?: string;
  quote?: string;
  paragraphs: string[];
}

export const INITIAL_TRIAGE_CARDS: FoundTriageCard[] = [
  {
    id: "card-nebula-gpu",
    context: "work",
    kind: "rev",
    badge: "PayPal Orders v2 · Visa *1881",
    client: "Nebula GPU Cloud",
    title: "Approve 40h NVIDIA H100 inference pack ($240) and confirm instant API key",
    body: "Channel3 agentic search matched SKU CH3-GPU-101 at $240 (below your $500 single-order cap, TypeSafe Jev risk 9/100). Ready for 1-click headless PayPal ACDC capture.",
    meta: "PayPal-Request-Id enforced · SLA: Instant API Key",
    amountUsd: 240,
    primaryAction: "Capture $240 via PayPal *1881",
    sku: "CH3-GPU-101",
    directCapture: true,
    sheetThreadId: "doc-nebula-invoice",
    replyDrafts: [
      {
        label: "Approve & capture $240",
        text: "Hi Nebula billing team, we just captured $240.00 via PayPal Orders v2 (Visa *1881). Please provision the 40h H100 API key to our workspace.",
      },
      {
        label: "Ask for 80h tier quote",
        text: "Hi Nebula team, before we capture this batch, could you share your volume rate for an 80-hour H100 commitment next month?",
      },
      {
        label: "Hold until M1 benchmark",
        text: "Holding this capture until our Rust inference latency benchmark finishes at 4pm today.",
      },
    ],
  },
  {
    id: "card-northwind-late",
    context: "work",
    kind: "chase",
    badge: "To chase · 19 days late",
    client: "Northwind Studio",
    title: "Invoice #041 ($12,000) is 19 days past due, send PayPal payment link",
    body: "Daniel promised wire or PayPal settlement last Thursday on Slack (#northwind-web) after approving the Phase 2 handoff deck.",
    meta: "Invoice #041 · Sent Oct 14 · Read 3 times",
    amountUsd: 12000,
    primaryAction: "Send PayPal reminder",
    sheetThreadId: "doc-northwind-thread",
    replyDrafts: [
      {
        label: "Warm nudge + PayPal link",
        text: "Hi Daniel, hope the week is going well. Sharing a quick nudge on Invoice #041 ($12,000) along with a direct PayPal Sandbox checkout link so you can clear it in one click.",
      },
      {
        label: "Firm Friday check-in",
        text: "Hi Daniel, following up on Invoice #041 ($12,000), now 19 days overdue. Please let us know confirmation of payment before Friday 5pm.",
      },
      {
        label: "Offer 2-part split",
        text: "Hi Daniel, if helpful for Q4 cash flow, we can split Invoice #041 into two $6,000 PayPal milestone captures.",
      },
    ],
  },
  {
    id: "card-typecraft-sdk",
    context: "work",
    kind: "todo",
    badge: "Milestone M2 · APIMatic SDK",
    client: "TypeCraft API Studio",
    title: "Release $185 APIMatic typed PayPal SDK audit upon FedEx delivery",
    body: "FedEx tracking #794644790132 is currently IN_TRANSIT. Verify OpenAPI 3.1 contract pass and release batch PAYOUT-SBX-BATCH-02.",
    meta: "Escrow $185 · Risk 12/100 · @paypal/mcp ready",
    amountUsd: 185,
    primaryAction: "Capture $185 SDK Audit",
    sku: "CH3-API-204",
    directCapture: true,
    sheetThreadId: "doc-typecraft-contract",
    replyDrafts: [
      {
        label: "Confirm contract pass",
        text: "APIMatic OpenAPI 3.1 validation passed with zero warnings. Releasing the $185 milestone via PayPal Sandbox.",
      },
      {
        label: "Request webhook sample",
        text: "Could you include the constant-time HMAC-SHA256 webhook test vector before we close M2?",
      },
    ],
  },
  {
    id: "card-lumen-declined",
    context: "work",
    kind: "chase",
    badge: "Declined card · Retainer",
    client: "Lumen Labs",
    title: "Monthly $4,500 retainer card declined twice on PayPal Subscriptions",
    body: "Automated retry failed with INSTRUMENT_DECLINED. Claire mentioned their corporate Visa was reissued last week.",
    meta: "Subscription · $4,500/mo · Next retry tomorrow",
    amountUsd: 4500,
    primaryAction: "Send card update link",
    sheetThreadId: "doc-lumen-thread",
    replyDrafts: [
      {
        label: "Send card update link",
        text: "Hi Claire, your नवंबर $4,500 retainer charge bounced on the old corporate card. Here is the PayPal link to update the card on file.",
      },
    ],
  },
  {
    id: "card-kite-lead",
    context: "work",
    kind: "msg",
    badge: "Warm lead · $35k scope",
    client: "Kite Health",
    title: "Maya Lin asked for availability on patient portal redesign ($30k to $45k)",
    body: "Referred by Northwind. Wants a 6-week sprint starting November 17 with milestone billing through PayPal.",
    meta: "Received 2d ago · Gmail",
    amountUsd: 35000,
    primaryAction: "Reply with Thursday slot",
    sheetThreadId: "doc-kite-lead",
    replyDrafts: [
      {
        label: "Offer Thursday 2pm",
        text: "Hi Maya, thanks for reaching out! We would love to help with the Kite Health portal. Does Thursday at 2:00 PM PST work for a 25-minute scope call?",
      },
    ],
  },
  {
    id: "card-personal-tax",
    context: "personal",
    kind: "todo",
    badge: "Personal · Quarterly",
    client: "CPA & Treasury",
    title: "Export October PayPal Sandbox & Wise CSV statements for Q4 estimate",
    body: "Accountant requested reconciled USD ledger export and receipt bundle before Friday.",
    meta: "Takes 2 minutes · CSV ready",
    primaryAction: "Export CSV ledger",
    replyDrafts: [
      {
        label: "Send reconciled CSV",
        text: "Attached is the reconciled October PayPal + Wise ledger export with all capture IDs.",
      },
    ],
  },
];

export const FOUND_CLIENTS: FoundClientRecord[] = [
  {
    id: "northwind",
    name: "Northwind Studio",
    tab: "needs",
    contactName: "Daniel Cho",
    contactEmail: "daniel@northwind.studio",
    channel: "northwind-web",
    mood: 1,
    moodReason: "Invoice #041 ($12,000) is 19 days late and Slack went quiet",
    mrrOrTotal: "$12,000 owed",
    statusLine: "19d overdue · waiting on wire / PayPal",
    nextStep: "Send PayPal Sandbox checkout reminder",
    paypalOrderId: "INV-SBX-2026-041",
    openNow: [
      {
        title: "Invoice #041 · Phase 2 Design & Rust API",
        meta: "19 days overdue · viewed Oct 29",
        amount: "$12,000",
      },
      {
        title: "Final mobile responsive QA sign-off",
        meta: "Promised in #northwind-web",
      },
    ],
    journey: [
      {
        when: "Oct 29",
        text: "Daniel viewed PayPal Invoice #041 and said accounting would clear it before Friday.",
      },
      {
        when: "Oct 14",
        text: "Delivered Phase 2 Figma + Next.js build and issued $12,000 invoice.",
      },
      {
        when: "Sep 15",
        text: "Captured $12,000 Phase 1 deposit via PayPal Orders v2.",
      },
    ],
    people: [
      {
        name: "Daniel Cho",
        role: "VP Product",
        email: "daniel@northwind.studio",
      },
      {
        name: "Rachel Lin",
        role: "Accounts Payable",
        email: "ap@northwind.studio",
      },
      {
        name: "Hannah Cole",
        role: "Lead Designer",
        email: "hannah@found.studio",
        onMyTeam: true,
      },
    ],
    files: [
      {
        name: "Northwind-Invoice-041.pdf",
        kind: "Invoice",
        date: "Oct 14",
        amount: "$12,000",
      },
      {
        name: "Northwind-MSA-2026.pdf",
        kind: "Contract",
        date: "Sep 02",
        amount: "$24,000",
      },
    ],
  },
  {
    id: "lumen",
    name: "Lumen Labs",
    tab: "needs",
    contactName: "Claire Moreau",
    contactEmail: "claire@lumenlabs.ai",
    channel: "lumen-product",
    mood: 2,
    moodReason: "Retainer card declined ($4,500) + waiting 14h on latency question",
    mrrOrTotal: "$4,500 /mo",
    statusLine: "Card declined · 1 Slack question waiting",
    nextStep: "Share updated PayPal card link & answer #lumen-product",
    paypalOrderId: "SUB-SBX-LUMEN-09",
    openNow: [
      {
        title: "November Retainer ($4,500/mo)",
        meta: "INSTRUMENT_DECLINED on corporate Visa",
        amount: "$4,500",
      },
      {
        title: "Streaming token latency question in #lumen-product",
        meta: "Claire asked 14h ago",
      },
    ],
    journey: [
      {
        when: "Today",
        text: "PayPal Sandbox subscription retry returned INSTRUMENT_DECLINED.",
      },
      {
        when: "Oct 01",
        text: "Collected $4,500 October retainer cleanly via PayPal.",
      },
    ],
    people: [
      {
        name: "Claire Moreau",
        role: "CTO",
        email: "claire@lumenlabs.ai",
      },
      {
        name: "Marcus Vance",
        role: "Rust Engineer",
        email: "marcus@found.studio",
        onMyTeam: true,
      },
    ],
    files: [
      {
        name: "Lumen-Retainer-SOW.pdf",
        kind: "Contract",
        date: "Aug 01",
        amount: "$4,500/mo",
      },
    ],
  },
  {
    id: "nebula",
    name: "Nebula GPU Cloud",
    tab: "clients",
    contactName: "Vikram Sethi",
    contactEmail: "billing-sbx@nebulagpu.example.com",
    channel: "nebula-infra",
    mood: 4,
    moodReason: "H100 cluster delivered on time, UPS tracking verified",
    mrrOrTotal: "$240 /batch",
    statusLine: "COMPLETED · Visa *1881 · UPS DELIVERED",
    nextStep: "No worries spotted",
    paypalOrderId: "PAYPAL-SBX-8F12A90C11",
    shipmentCarrier: "UPS",
    shipmentStatus: "DELIVERED",
    openNow: [
      {
        title: "NVIDIA H100 Inference Pack (40h) · CH3-GPU-101",
        meta: "Captured via PayPal Orders v2 · 1Z999AA10123456784",
        amount: "$240",
      },
    ],
    journey: [
      {
        when: "Oct 31",
        text: "UPS tracking 1Z999AA10123456784 marked DELIVERED via /v1/shipping/trackers-batch.",
      },
      {
        when: "Oct 31",
        text: "Captured $240.00 Order PAYPAL-SBX-8F12A90C11 (TypeSafe Jev 0.95 APPROVE).",
      },
    ],
    people: [
      {
        name: "Vikram Sethi",
        role: "Cloud Provisioning",
        email: "billing-sbx@nebulagpu.example.com",
      },
    ],
    files: [
      {
        name: "PayPal-Receipt-8F12A90C11.pdf",
        kind: "Receipt",
        date: "Oct 31",
        amount: "$240",
      },
    ],
  },
  {
    id: "typecraft",
    name: "TypeCraft API Studio",
    tab: "clients",
    contactName: "Elena Vance",
    contactEmail: "escrow-sbx@typecraft.example.com",
    channel: "typecraft-sdk",
    mood: 4,
    moodReason: "APIMatic OpenAPI 3.1 contract validation on schedule",
    mrrOrTotal: "$185 escrow",
    statusLine: "M2 IN_TRANSIT · FedEx 794644790132",
    nextStep: "Mark DELIVERED to unlock M2 payout",
    paypalOrderId: "PAYOUT-SBX-BATCH-02",
    shipmentCarrier: "FEDEX",
    shipmentStatus: "IN_TRANSIT",
    openNow: [
      {
        title: "M2: APIMatic SDK & PayPal MCP Invoice Gate",
        meta: "FedEx #794644790132 · 75% complete",
        amount: "$185",
      },
    ],
    journey: [
      {
        when: "Nov 01",
        text: "Validated PayPal Orders v2, Shipping v1, and Payouts v1 schemas via APIMatic.",
      },
    ],
    people: [
      {
        name: "Elena Vance",
        role: "API Architect",
        email: "escrow-sbx@typecraft.example.com",
      },
    ],
    files: [
      {
        name: "APIMatic-PayPal-OpenAPI31-Audit.pdf",
        kind: "Report",
        date: "Nov 01",
        amount: "$185",
      },
    ],
  },
  {
    id: "kestrel",
    name: "Studio Kestrel",
    tab: "clients",
    contactName: "Soren Lindqvist",
    contactEmail: "payouts-sbx@kestrel.example.com",
    channel: "kestrel-shaders",
    mood: 3,
    moodReason: "M3 milestone locked in escrow until November 11",
    mrrOrTotal: "$320 escrow",
    statusLine: "M3 ESCROW_LOCKED · DHL pending",
    nextStep: "Review telemetry shader build on Nov 7",
    paypalOrderId: "PAYOUT-SBX-BATCH-03",
    shipmentCarrier: "DHL",
    shipmentStatus: "ESCROW_LOCKED",
    openNow: [
      {
        title: "M3: Render Cloud Deploy & Final Escrow Release",
        meta: "Scheduled Nov 07 to Nov 11",
        amount: "$320",
      },
    ],
    journey: [
      {
        when: "Oct 30",
        text: "Locked $320 milestone payout in Rust SpendPolicy escrow.",
      },
    ],
    people: [
      {
        name: "Soren Lindqvist",
        role: "Creative Technologist",
        email: "payouts-sbx@kestrel.example.com",
      },
    ],
    files: [
      {
        name: "Kestrel-Milestone-Schedule.pdf",
        kind: "Brief",
        date: "Oct 30",
        amount: "$320",
      },
    ],
  },
  {
    id: "kite",
    name: "Kite Health",
    tab: "leads",
    contactName: "Maya Lin",
    contactEmail: "maya@kitehealth.io",
    channel: "leads-inbound",
    mood: 4,
    moodReason: "Warm referral from Northwind · ready to book intro call",
    mrrOrTotal: "$35,000 est.",
    statusLine: "Warm lead · replied 2d ago",
    nextStep: "Send Thursday 2pm call invite & PayPal deposit terms",
    openNow: [
      {
        title: "Patient Portal & PayPal Billing Redesign",
        meta: "6-week scope · $30k to $45k budget",
        amount: "$35,000",
      },
    ],
    journey: [
      {
        when: "Oct 31",
        text: "Maya sent RFP PDF and asked for November kick-off availability.",
      },
    ],
    people: [
      {
        name: "Maya Lin",
        role: "Head of Product",
        email: "maya@kitehealth.io",
      },
    ],
    files: [
      {
        name: "KiteHealth-Portal-RFP.pdf",
        kind: "Brief",
        date: "Oct 31",
        amount: "$35,000",
      },
    ],
  },
  {
    id: "verve",
    name: "Verve Audio",
    tab: "leads",
    contactName: "Tomasz Kowalski",
    contactEmail: "tomasz@verve.audio",
    channel: "leads-inbound",
    mood: 3,
    moodReason: "Sent $18,000 proposal 5 days ago, opened twice",
    mrrOrTotal: "$18,000 est.",
    statusLine: "Proposal out · 5d ago",
    nextStep: "Follow up on custom checkout flow",
    openNow: [
      {
        title: "Direct-to-Fan PayPal Split Checkout",
        meta: "Proposal sent Oct 28",
        amount: "$18,000",
      },
    ],
    journey: [
      {
        when: "Oct 28",
        text: "Sent $18,000 proposal with PayPal Orders v2 architecture.",
      },
    ],
    people: [
      {
        name: "Tomasz Kowalski",
        role: "Founder",
        email: "tomasz@verve.audio",
      },
    ],
    files: [
      {
        name: "Verve-PayPal-Proposal.pdf",
        kind: "Proposal",
        date: "Oct 28",
        amount: "$18,000",
      },
    ],
  },
];

export const INITIAL_SLACK_MESSAGES: FoundSlackMessage[] = [
  {
    key: "sl-northwind-1",
    who: "Daniel Cho",
    client: "Northwind Studio",
    channel: "northwind-web",
    kind: "unhappy",
    hours: 52,
    gist: "Waiting on updated staging link + Invoice #041 receipt question",
    text: "Hey team, before finance releases the $12k wire/PayPal for #041, can someone confirm the mobile header fix is live on staging?",
    more: 2,
  },
  {
    key: "sl-lumen-1",
    who: "Claire Moreau",
    client: "Lumen Labs",
    channel: "lumen-product",
    kind: "client",
    hours: 14,
    gist: "Asked if Jev rubric latency stays under 45ms during batch spikes",
    text: "Quick check: when we run 50 concurrent PayPal order checks through the Rust guardrail, does p99 stay below 45ms?",
    more: 1,
  },
  {
    key: "sl-typecraft-1",
    who: "Elena Vance",
    client: "TypeCraft API Studio",
    channel: "typecraft-sdk",
    kind: "client",
    hours: 6,
    gist: "Shared FedEx tracking #794644790132 for M2 SDK audit bundle",
    text: "Uploaded the signed APIMatic OpenAPI 3.1 validation bundle and attached FedEx tracker 794644790132.",
  },
  {
    key: "sl-team-1",
    who: "Marcus Vance",
    client: "Internal",
    channel: "eng-paypal-rust",
    kind: "team",
    hours: 9,
    tagged: ["Hannah Cole"],
    gist: "Asked whether to enable acid-lime skin by default for demo day",
    text: "@Hannah should we default the PayPal Sentinel drawer to Clean or Lime for the Devpost video?",
  },
];

export const TEAM_PULSE_DATA: FoundTeamMemberPulse[] = [
  {
    id: "tm-hannah",
    name: "Hannah Cole",
    role: "Design Lead",
    tone: "good",
    note: "On top of it",
    levels: [3, 3, 2, 3, 2, 3, 1, 2, 3, 3, 2, 2, 3, 2, 3],
    counts: [18, 22, 11, 19, 14, 21, 5, 13, 24, 20, 12, 15, 23, 14, 19],
  },
  {
    id: "tm-marcus",
    name: "Marcus Vance",
    role: "Rust & PayPal Systems",
    tone: "good",
    note: "On top of it",
    levels: [2, 3, 3, 3, 2, 2, 3, 3, 3, 2, 3, 3, 2, 3, 3],
    counts: [14, 25, 28, 19, 12, 15, 22, 26, 21, 13, 24, 27, 16, 22, 29],
  },
  {
    id: "tm-elena",
    name: "Elena Rostova",
    role: "Product & QA",
    tone: "quiet",
    note: "Quiet since Tuesday",
    levels: [2, 2, 1, 2, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1],
    counts: [11, 12, 6, 10, 4, 0, 0, 3, 4, 0, 3, 2, 0, 0, 2],
  },
  {
    id: "tm-devon",
    name: "Devon Brooks",
    role: "Client Partner",
    tone: "slow",
    note: "Slow to reply, 6h",
    levels: [3, 2, 2, 1, 2, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1],
    counts: [19, 13, 11, 5, 12, 10, 4, 5, 9, 4, 6, 11, 5, 4, 6],
  },
];

export const REVENUE_12_MONTHS = [
  { label: "Dec", month: "Dec 2025", amount: 34200, orders: 14 },
  { label: "Jan", month: "Jan 2026", amount: 36800, orders: 16 },
  { label: "Feb", month: "Feb 2026", amount: 31500, orders: 13 },
  { label: "Mar", month: "Mar 2026", amount: 39400, orders: 18 },
  { label: "Apr", month: "Apr 2026", amount: 41200, orders: 19 },
  { label: "May", month: "May 2026", amount: 38900, orders: 17 },
  { label: "Jun", month: "Jun 2026", amount: 44600, orders: 21 },
  { label: "Jul", month: "Jul 2026", amount: 43100, orders: 20 },
  { label: "Aug", month: "Aug 2026", amount: 46800, orders: 22 },
  { label: "Sep", month: "Sep 2026", amount: 45200, orders: 21 },
  { label: "Oct", month: "Oct 2026", amount: 49500, orders: 24 },
  { label: "Nov", month: "Nov 2026", amount: 42800, orders: 19 },
];

export const PAY_NEXT_ITEMS: FoundPayNextItem[] = [
  {
    id: "pn-northwind",
    client: "Northwind Studio",
    plan: "Invoice #041 · Phase 2",
    amountUsd: 12000,
    interval: "milestone",
    group: "attention",
    daysFromNow: -19,
    startPct: 2,
    widthPct: 28,
    statusNote: "19 days overdue",
    warn: true,
  },
  {
    id: "pn-lumen",
    client: "Lumen Labs",
    plan: "AI Product Retainer",
    amountUsd: 4500,
    interval: "mo",
    group: "attention",
    daysFromNow: -2,
    startPct: 12,
    widthPct: 24,
    statusNote: "Card *9012 declined",
    warn: true,
  },
  {
    id: "pn-typecraft",
    client: "TypeCraft API Studio",
    plan: "M2 APIMatic SDK Release",
    amountUsd: 185,
    interval: "milestone",
    group: "next7",
    daysFromNow: 3,
    startPct: 28,
    widthPct: 26,
    statusNote: "In transit · Nov 5",
  },
  {
    id: "pn-nebula",
    client: "Nebula GPU Cloud",
    plan: "H100 Inference Pack",
    amountUsd: 240,
    interval: "mo",
    group: "next7",
    daysFromNow: 5,
    startPct: 32,
    widthPct: 34,
    statusNote: "Auto-renews Nov 7",
  },
  {
    id: "pn-kestrel",
    client: "Studio Kestrel",
    plan: "M3 Telemetry Escrow",
    amountUsd: 320,
    interval: "milestone",
    group: "weekAfter",
    daysFromNow: 9,
    startPct: 45,
    widthPct: 32,
    statusNote: "Escrow unlocks Nov 11",
  },
  {
    id: "pn-caldigit",
    client: "CalDigit Enterprise",
    plan: "Hardware Maintenance",
    amountUsd: 299,
    interval: "yr",
    group: "later",
    daysFromNow: 21,
    startPct: 58,
    widthPct: 36,
    statusNote: "Renews Nov 23",
  },
];

export const RECURRING_GROUPS: FoundRecurringGroup[] = [
  {
    category: "AI Compute & PayPal Agentic Infrastructure",
    monthlyTotalUsd: 665,
    items: [
      {
        id: "rc-nebula",
        vendor: "Nebula GPU Cloud (PayPal *1881)",
        amountUsd: 240,
        cycle: "Monthly",
        note: "40h H100 inference pack · SKU CH3-GPU-101",
        actionHint: "keep",
      },
      {
        id: "rc-render",
        vendor: "Render Cloud Services",
        amountUsd: 85,
        cycle: "Monthly",
        note: "Rust Axum API + Next.js web + settlement worker",
        actionHint: "keep",
      },
      {
        id: "rc-anthropic",
        vendor: "TypeSafe AI + Model Router",
        amountUsd: 340,
        cycle: "Monthly",
        note: "SystemOne jev-1.13.0 rubric + agentic tool calls",
        actionHint: "negotiate",
      },
    ],
  },
  {
    category: "Design, Collaboration & Unused Seats Worth a Look",
    monthlyTotalUsd: 490,
    items: [
      {
        id: "rc-figma",
        vendor: "Figma Organization",
        amountUsd: 270,
        cycle: "Monthly · 6 seats",
        note: "2 editor seats inactive for 62 days (save $90/mo)",
        actionHint: "negotiate",
      },
      {
        id: "rc-loom",
        vendor: "Loom Business",
        amountUsd: 120,
        cycle: "Monthly · overlaps with Screen Studio",
        note: "Only 1 recording created last month",
        actionHint: "cancel",
      },
      {
        id: "rc-linear",
        vendor: "Linear Plus",
        amountUsd: 100,
        cycle: "Monthly",
        note: "Active daily across all 4 team members",
        actionHint: "keep",
      },
    ],
  },
];

export const CALENDAR_EVENTS: FoundCalendarEvent[] = [
  {
    id: "ev-1",
    dayOffset: -2,
    dateLabel: "Overdue",
    time: "19d late",
    kind: "money",
    context: "work",
    title: "Northwind Studio · Invoice #041",
    subtitle: "Chase Daniel Cho on PayPal link",
    amountUsd: 12000,
    incoming: true,
    actionLabel: "Chase",
  },
  {
    id: "ev-2",
    dayOffset: 0,
    dateLabel: "Today",
    time: "11:30 AM",
    kind: "call",
    context: "work",
    title: "Lumen Labs · Retainer & Latency Sync",
    subtitle: "Claire Moreau + Marcus Vance · Meet",
    actionLabel: "Join call",
  },
  {
    id: "ev-3",
    dayOffset: 0,
    dateLabel: "Today",
    time: "3:00 PM",
    kind: "money",
    context: "work",
    title: "Nebula GPU Cloud · H100 Batch Capture",
    subtitle: "PayPal Orders v2 · Visa *1881",
    amountUsd: 240,
    incoming: false,
    actionLabel: "Capture $240",
  },
  {
    id: "ev-4",
    dayOffset: 1,
    dateLabel: "Tomorrow",
    time: "2:00 PM",
    kind: "call",
    context: "work",
    title: "Kite Health · Portal Scope & Deposit",
    subtitle: "Maya Lin · $35k milestone plan",
    actionLabel: "Prep brief",
  },
  {
    id: "ev-5",
    dayOffset: 3,
    dateLabel: "Thu, Nov 5",
    time: "5:00 PM",
    kind: "due",
    context: "work",
    title: "PayPal AI Hackathon · Early Feedback Check",
    subtitle: "Verify Rust + PayPal Sandbox + <3:00 YouTube demo",
    actionLabel: "Open checklist",
  },
  {
    id: "ev-6",
    dayOffset: 5,
    dateLabel: "Sat, Nov 7",
    time: "10:00 AM",
    kind: "money",
    context: "work",
    title: "TypeCraft API Studio · M2 Escrow Payout",
    subtitle: "PAYOUT-SBX-BATCH-02 release on FedEx delivery",
    amountUsd: 185,
    incoming: false,
    actionLabel: "Inspect M2",
  },
  {
    id: "ev-7",
    dayOffset: 6,
    dateLabel: "Sun, Nov 8",
    time: "4:00 PM",
    kind: "due",
    context: "personal",
    title: "Quarterly CPA Tax & PayPal CSV Bundle",
    subtitle: "Personal treasury check",
    actionLabel: "Export CSV",
  },
];

export const INITIAL_CHECK_ROWS: FoundCheckRow[] = [
  {
    key: "ck-1",
    section: "Money owed to you",
    who: "Northwind Studio",
    what: "$12,000 · Invoice #041 (19 days overdue)",
    why: "Sent Oct 14, Daniel confirmed receipt in #northwind-web, no PayPal capture recorded yet.",
    by: "Jev",
    mark: true,
  },
  {
    key: "ck-2",
    section: "Money owed to you",
    who: "Lumen Labs",
    what: "$4,500/mo · November subscription retry",
    why: "PayPal Sandbox returned INSTRUMENT_DECLINED on corporate Visa *9012.",
    by: "Jev",
    mark: true,
  },
  {
    key: "ck-3",
    section: "Replies owed",
    who: "Maya Lin · Kite Health",
    what: "Patient portal redesign ($30k to $45k)",
    why: "Inbound referral asking for Thursday intro call slot.",
    by: "Jev",
  },
  {
    key: "ck-4",
    section: "Bills to pay",
    who: "Nebula GPU Cloud",
    what: "$240 · NVIDIA H100 Inference Pack (CH3-GPU-101)",
    why: "Approved by Rust SpendPolicy ($240 <= $500 cap, risk 9 <= 35).",
    by: "Jev",
    mark: true,
  },
  {
    key: "ck-5",
    section: "Bills to pay",
    who: "ShadowCompute Unverified",
    what: "$410 · Gray-Market GPU Cluster (CH3-RISK-999)",
    why: "Blocked automatically: counterparty risk 82 exceeds 35 policy ceiling.",
    by: "you",
    mark: false,
  },
  {
    key: "ck-6",
    section: "Promises and to-dos",
    who: "TypeCraft API Studio",
    what: "Release $185 M2 escrow when FedEx 794644790132 delivers",
    why: "Agreed in SOW §4 and wired to /v1/shipping/trackers-batch.",
    by: "Jev",
  },
];

export const SHEET_DOCUMENTS: Record<string, FoundSheetDocument> = {
  "doc-nebula-invoice": {
    id: "doc-nebula-invoice",
    kind: "invoice",
    title: "Nebula GPU Cloud · Invoice #CH3-101",
    subtitle: "PayPal Orders v2 · Headless ACDC Visa *1881",
    from: "billing-sbx@nebulagpu.example.com",
    to: "treasury@sentinel.studio",
    date: "Nov 2, 2026",
    amount: "$240.00 USD",
    paypalOrderId: "PAYPAL-SBX-8F12A90C11",
    quote:
      "PASS: 240.00 USD <= 500.00 USD cap | risk 9 <= 35 | TypeSafe Jev 0.95 APPROVE",
    paragraphs: [
      "Item: 40 hours dedicated NVIDIA H100 80GB SXM5 inference cluster (Channel3 SKU CH3-GPU-101).",
      "Guardrail Check: Rust SpendPolicy verified single-order cap ($240 <= $500), daily remaining budget ($2,075), and RFC 4122 PayPal-Request-Id idempotency header.",
      "Fulfillment: UPS Tracking #1Z999AA10123456784 synced via PayPal Shipping Trackers API (/v1/shipping/trackers-batch).",
    ],
  },
  "doc-northwind-thread": {
    id: "doc-northwind-thread",
    kind: "email",
    title: "Re: Phase 2 handoff & Invoice #041 ($12,000)",
    subtitle: "3 messages · #northwind-web + Gmail",
    from: "Daniel Cho <daniel@northwind.studio>",
    to: "you, Rachel Lin <ap@northwind.studio>",
    date: "Oct 29, 2026",
    amount: "$12,000.00 USD",
    paypalOrderId: "INV-SBX-2026-041",
    quote:
      "We loved the Phase 2 build. Sending Invoice #041 over to Rachel in AP to clear via PayPal before Friday.",
    paragraphs: [
      "Hi team, thanks for pushing the responsive nav polish so quickly. The board review went great.",
      "I forwarded Invoice #041 ($12,000) to Rachel in Accounts Payable. If you can drop a direct PayPal checkout link in this thread, she can settle it with our corporate card today.",
    ],
  },
  "doc-typecraft-contract": {
    id: "doc-typecraft-contract",
    kind: "contract",
    title: "TypeCraft API Studio · Milestone M2 Audit",
    subtitle: "APIMatic OpenAPI 3.1 + @paypal/mcp Bridge",
    from: "Elena Vance <escrow-sbx@typecraft.example.com>",
    to: "treasury@sentinel.studio",
    date: "Nov 1, 2026",
    amount: "$185.00 USD",
    paypalOrderId: "PAYOUT-SBX-BATCH-02",
    quote:
      "Validated POST /v2/checkout/orders, POST /v1/shipping/trackers-batch, and POST /v1/payments/payouts with strict RFC 4122 PayPal-Request-Id headers.",
    paragraphs: [
      "Deliverable 1: Strict Rust + TypeScript contract validation against PayPal REST OpenAPI 3.1 specifications.",
      "Deliverable 2: Zero-millisecond ISO-8601 transaction reporting window formatter for /v1/reporting/transactions.",
      "Escrow Condition: $185.00 USD unlocks automatically when FedEx tracking #794644790132 transitions to DELIVERED.",
    ],
  },
  "doc-lumen-thread": {
    id: "doc-lumen-thread",
    kind: "email",
    title: "PayPal Subscription Retry Notice · Lumen Labs",
    subtitle: "INSTRUMENT_DECLINED on $4,500/mo retainer",
    from: "Claire Moreau <claire@lumenlabs.ai>",
    to: "treasury@sentinel.studio",
    date: "Nov 1, 2026",
    amount: "$4,500.00 USD",
    paypalOrderId: "SUB-SBX-LUMEN-09",
    quote:
      "Our Silicon Valley Bank corporate card was reissued with a new expiration date.",
    paragraphs: [
      "Hey! Just saw the automated PayPal receipt bounce notification. Our finance team rotated the corporate Visa card on Tuesday.",
      "Send over a fresh PayPal checkout or subscription update link and I will put the new card in right away.",
    ],
  },
  "doc-kite-lead": {
    id: "doc-kite-lead",
    kind: "email",
    title: "Kite Health patient portal redesign inquiry",
    subtitle: "Warm referral from Daniel Cho at Northwind",
    from: "Maya Lin <maya@kitehealth.io>",
    to: "hello@sentinel.studio",
    date: "Oct 31, 2026",
    amount: "$35,000.00 est.",
    quote:
      "Daniel at Northwind raved about your speed and attention to detail. We have $30k to $45k allocated for Q4.",
    paragraphs: [
      "Hi there! Daniel Cho shared your studio's work on the Northwind platform. We are redesigning the Kite Health patient billing and appointment portal before January.",
      "Are you open for a 6-week sprint kicking off mid-November? Happy to jump on a call this Thursday afternoon.",
    ],
  },
};
