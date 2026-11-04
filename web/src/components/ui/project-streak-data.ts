/* Isolated single-project streak & daily idea data for PayPal Sentinel.
 * Auto-synced from /Volumes/Dev/paypal-ai-hackathon/projects/project_1/streak-log.json via update-project-streak.mjs.
 * Contains ONLY this project's telemetry, real GitHub contribution calendar (@harrymove-ctrl), and ideas.
 */
export interface ProjectImpactMetric {
  label: string;
  value: string;
  detail: string;
}

export interface ProjectBuildStage {
  step: string;
  phase: string;
  category: "architecture" | "rust_core" | "ai_agents" | "spatial_ui" | "qa_verify" | "ship_demo";
  tool: string;
  outcome: string;
}

export interface ProjectDailyEntry {
  date: string;
  count: number;
  category: ProjectBuildStage["category"];
  title: string;
  note: string;
  ideas: string[];
}

export interface GitHubContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface GitHubContributionProfile {
  login: string;
  url: string;
  totalContributions: number;
  commits: number;
  pullRequests: number;
  reviews: number;
  issues: number;
  restricted: number;
  fetchedAt: string;
  days: GitHubContributionDay[];
}

export interface SingleProjectStreakData {
  projectId: string;
  projectName: string;
  competitionBadge: string;
  headline: string;
  impactSummary: string;
  baseSeed: number;
  targetActivities: number;
  lastSyncedAt: string;
  projectDir: string;
  stats: {
    codeFiles: number;
    rustFiles: number;
    testFiles: number;
  };
  gitDates: Record<string, number>;
  githubContributions?: GitHubContributionProfile | null;
  impactMetrics: ProjectImpactMetric[];
  buildStages: ProjectBuildStage[];
  dailyEntries: ProjectDailyEntry[];
}

export const PROJECT_STREAK_DATA: SingleProjectStreakData = {
  "projectId": "paypal-ai-project-1",
  "projectName": "PayPal Sentinel",
  "competitionBadge": "PayPal AI Hackathon · Rust + Agentic Commerce",
  "headline": "High-Assurance Rust Spend-Policy Engine & PayPal Sandbox Agentic Cockpit",
  "impactSummary": "Prevents unsafe autonomous AI spending by enforcing deterministic Rust spend caps, PayPal-Request-Id replay deduplication, and constant-time HMAC webhook verification across PayPal Sandbox Orders v2, Invoices, and Payouts.",
  "baseSeed": 31302,
  "targetActivities": 1190,
  "impactMetrics": [
    {
      "label": "Settlement Core",
      "value": "Rust + Axum",
      "detail": "Zero-unwrap Tokio spend guardrails & HMAC-SHA256 verifier"
    },
    {
      "label": "Judge Onboarding",
      "value": "1-Click Seed",
      "detail": "Instant Sandbox Buyer, Merchant, Channel3 & Payout ledger"
    },
    {
      "label": "PayPal Platform",
      "value": "Orders + MCP",
      "detail": "Orders v2, Invoicing, Payouts & Agent Toolkit schemas"
    },
    {
      "label": "Sponsor Stack",
      "value": "5 Integrated",
      "detail": "AG Grid ledger, Channel3 catalog, APIMatic, Bryntum & Render"
    }
  ],
  "buildStages": [
    {
      "step": "01",
      "phase": "Eligibility & MIT License",
      "category": "architecture",
      "tool": "COMPETITION.md + Root LICENSE",
      "outcome": "Locked top-level GitHub MIT license & Nov 12 rush roadmap"
    },
    {
      "step": "02",
      "phase": "Rust Guardrail Spine",
      "category": "rust_core",
      "tool": "Cargo + Axum + Tokio + Thiserror",
      "outcome": "Per-order cap, daily budget cap & 409 idempotency guard"
    },
    {
      "step": "03",
      "phase": "PayPal Sandbox & MCP",
      "category": "ai_agents",
      "tool": "PayPal REST v2 + Agent Toolkit",
      "outcome": "Autonomous procurement, invoice creation & payout batches"
    },
    {
      "step": "04",
      "phase": "3-Variant Financial Cockpit",
      "category": "spatial_ui",
      "tool": "Command Split + Ledger + Scheduler",
      "outcome": "Enterprise ledger filtering, CSV export & payout timeline"
    },
    {
      "step": "05",
      "phase": "Adversarial QA & Tests",
      "category": "qa_verify",
      "tool": "cargo test + Playwright + ?debug=1",
      "outcome": "Verified $850 over-cap block, 409 replay & HMAC check"
    },
    {
      "step": "06",
      "phase": "Daily 14h/15h Rush Sync",
      "category": "ship_demo",
      "tool": "render.yaml + Daily Streak Log",
      "outcome": "Tracks daily rush milestones & <3:00 YouTube video script"
    }
  ],
  "dailyEntries": [
    {
      "date": "2026-11-04",
      "count": 6,
      "category": "qa_verify",
      "title": "Daily Automation Check (2026-11-04)",
      "note": "Verified 168 source files (15 Rust, 5 tests) in PayPal Sentinel.",
      "ideas": []
    },
    {
      "date": "2026-11-03",
      "count": 6,
      "category": "qa_verify",
      "title": "Daily Automation Check (2026-11-03)",
      "note": "Verified 35 source files (7 Rust, 1 tests) in PayPal Sentinel.",
      "ideas": []
    },
    {
      "date": "2026-11-02",
      "count": 6,
      "category": "qa_verify",
      "title": "Daily Automation Check (2026-11-02)",
      "note": "Verified 26 source files (6 Rust, 1 tests) in PayPal Sentinel.",
      "ideas": []
    },
    {
      "date": "2026-11-01",
      "count": 8,
      "category": "qa_verify",
      "title": "Daily Automation Check (2026-11-01)",
      "note": "Verified 24 source files (6 Rust, 0 tests) in PayPal Sentinel.",
      "ideas": [
        "Verified Channel3 POST v1 agentic search with Rust SpendPolicy max_price filter, 10-tool @paypal/mcp bridge, and Nov 5 early eligibility submission kit"
      ]
    },
    {
      "date": "2026-10-31",
      "count": 16,
      "category": "rust_core",
      "title": "Implemented Rust Axum Settlement API (:4180) & 3-Variant Cockpit (:4100)",
      "note": "Shipped zero-unwrap Rust policy guardrails, PayPal Orders v2 + MCP tools, sponsor panels, render.yaml, and E2E tests.",
      "ideas": [
        "Record 2:40 end-to-end demo showing live $240 settlement followed by $850 guardrail block"
      ]
    },
    {
      "date": "2026-10-30",
      "count": 9,
      "category": "architecture",
      "title": "Scaffolded PayPal AI Rush Workspace & Eligibility Gates",
      "note": "Configured 14:00 & 15:00 rush reminders, competition rules, and stackable sponsor architecture.",
      "ideas": [
        "Include 1-Click Judge Sandbox Seeder so judges never need API keys to test"
      ]
    }
  ],
  "lastSyncedAt": "2026-11-04T11:14:57.137Z",
  "projectDir": "/Volumes/Dev/paypal-ai-hackathon/projects/project_1",
  "stats": {
    "codeFiles": 168,
    "rustFiles": 15,
    "testFiles": 5
  },
  "gitDates": {
    "2026-11-03": 4
  },
  "githubContributions": {
    "login": "harrymove-ctrl",
    "url": "https://github.com/harrymove-ctrl",
    "totalContributions": 1190,
    "commits": 407,
    "pullRequests": 451,
    "reviews": 175,
    "issues": 127,
    "restricted": 0,
    "fetchedAt": "2026-11-04T11:14:57.064Z",
    "days": [
      {
        "date": "2025-11-02",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-11-03",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-11-04",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-11-05",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-11-06",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-11-07",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-11-08",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-11-09",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-11-10",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-11-11",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-11-12",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-11-13",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-11-14",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-11-15",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-11-16",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-11-17",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-11-18",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-11-19",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-11-20",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-11-21",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-11-22",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-11-23",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-11-24",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-11-25",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-11-26",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-11-27",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-11-28",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-11-29",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-11-30",
        "count": 1,
        "level": 1
      },
      {
        "date": "2025-12-01",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-12-02",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-12-03",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-12-04",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-12-05",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-12-06",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-12-07",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-12-08",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-12-09",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-12-10",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-12-11",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-12-12",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-12-13",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-12-14",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-12-15",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-12-16",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-12-17",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-12-18",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-12-19",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-12-20",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-12-21",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-12-22",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-12-23",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-12-24",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-12-25",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-12-26",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-12-27",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-12-28",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-12-29",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-12-30",
        "count": 0,
        "level": 0
      },
      {
        "date": "2025-12-31",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-01-01",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-01-02",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-01-03",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-01-04",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-01-05",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-01-06",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-01-07",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-01-08",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-01-09",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-01-10",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-01-11",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-01-12",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-01-13",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-01-14",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-01-15",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-01-16",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-01-17",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-01-18",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-01-19",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-01-20",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-01-21",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-01-22",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-01-23",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-01-24",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-01-25",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-01-26",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-01-27",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-01-28",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-01-29",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-01-30",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-01-31",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-02-01",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-02-02",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-02-03",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-02-04",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-02-05",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-02-06",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-02-07",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-02-08",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-02-09",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-02-10",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-02-11",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-02-12",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-02-13",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-02-14",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-02-15",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-02-16",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-02-17",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-02-18",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-02-19",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-02-20",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-02-21",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-02-22",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-02-23",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-02-24",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-02-25",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-02-26",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-02-27",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-02-28",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-03-01",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-03-02",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-03-03",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-03-04",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-03-05",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-03-06",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-03-07",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-03-08",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-03-09",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-03-10",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-03-11",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-03-12",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-03-13",
        "count": 1,
        "level": 1
      },
      {
        "date": "2026-03-14",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-03-15",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-03-16",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-03-17",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-03-18",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-03-19",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-03-20",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-03-21",
        "count": 6,
        "level": 1
      },
      {
        "date": "2026-03-22",
        "count": 4,
        "level": 1
      },
      {
        "date": "2026-03-23",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-03-24",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-03-25",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-03-26",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-03-27",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-03-28",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-03-29",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-03-30",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-03-31",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-04-01",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-04-02",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-04-03",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-04-04",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-04-05",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-04-06",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-04-07",
        "count": 1,
        "level": 1
      },
      {
        "date": "2026-04-08",
        "count": 1,
        "level": 1
      },
      {
        "date": "2026-04-09",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-04-10",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-04-11",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-04-12",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-04-13",
        "count": 2,
        "level": 1
      },
      {
        "date": "2026-04-14",
        "count": 17,
        "level": 2
      },
      {
        "date": "2026-04-15",
        "count": 4,
        "level": 1
      },
      {
        "date": "2026-04-16",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-04-17",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-04-18",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-04-19",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-04-20",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-04-21",
        "count": 1,
        "level": 1
      },
      {
        "date": "2026-04-22",
        "count": 1,
        "level": 1
      },
      {
        "date": "2026-04-23",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-04-24",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-04-25",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-04-26",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-04-27",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-04-28",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-04-29",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-04-30",
        "count": 3,
        "level": 1
      },
      {
        "date": "2026-05-01",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-05-02",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-05-03",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-05-04",
        "count": 2,
        "level": 1
      },
      {
        "date": "2026-05-05",
        "count": 2,
        "level": 1
      },
      {
        "date": "2026-05-06",
        "count": 1,
        "level": 1
      },
      {
        "date": "2026-05-07",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-05-08",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-05-09",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-05-10",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-05-11",
        "count": 5,
        "level": 1
      },
      {
        "date": "2026-05-12",
        "count": 1,
        "level": 1
      },
      {
        "date": "2026-05-13",
        "count": 1,
        "level": 1
      },
      {
        "date": "2026-05-14",
        "count": 3,
        "level": 1
      },
      {
        "date": "2026-05-15",
        "count": 4,
        "level": 1
      },
      {
        "date": "2026-05-16",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-05-17",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-05-18",
        "count": 3,
        "level": 1
      },
      {
        "date": "2026-05-19",
        "count": 8,
        "level": 1
      },
      {
        "date": "2026-05-20",
        "count": 1,
        "level": 1
      },
      {
        "date": "2026-05-21",
        "count": 3,
        "level": 1
      },
      {
        "date": "2026-05-22",
        "count": 2,
        "level": 1
      },
      {
        "date": "2026-05-23",
        "count": 3,
        "level": 1
      },
      {
        "date": "2026-05-24",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-05-25",
        "count": 4,
        "level": 1
      },
      {
        "date": "2026-05-26",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-05-27",
        "count": 4,
        "level": 1
      },
      {
        "date": "2026-05-28",
        "count": 2,
        "level": 1
      },
      {
        "date": "2026-05-29",
        "count": 1,
        "level": 1
      },
      {
        "date": "2026-05-30",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-05-31",
        "count": 1,
        "level": 1
      },
      {
        "date": "2026-06-01",
        "count": 2,
        "level": 1
      },
      {
        "date": "2026-06-02",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-06-03",
        "count": 10,
        "level": 1
      },
      {
        "date": "2026-06-04",
        "count": 4,
        "level": 1
      },
      {
        "date": "2026-06-05",
        "count": 3,
        "level": 1
      },
      {
        "date": "2026-06-06",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-06-07",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-06-08",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-06-09",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-06-10",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-06-11",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-06-12",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-06-13",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-06-14",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-06-15",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-06-16",
        "count": 25,
        "level": 2
      },
      {
        "date": "2026-06-17",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-06-18",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-06-19",
        "count": 37,
        "level": 3
      },
      {
        "date": "2026-06-20",
        "count": 3,
        "level": 1
      },
      {
        "date": "2026-06-21",
        "count": 50,
        "level": 4
      },
      {
        "date": "2026-06-22",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-06-23",
        "count": 1,
        "level": 1
      },
      {
        "date": "2026-06-24",
        "count": 1,
        "level": 1
      },
      {
        "date": "2026-06-25",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-06-26",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-06-27",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-06-28",
        "count": 2,
        "level": 1
      },
      {
        "date": "2026-06-29",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-06-30",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-07-01",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-07-02",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-07-03",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-07-04",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-07-05",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-07-06",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-07-07",
        "count": 1,
        "level": 1
      },
      {
        "date": "2026-07-08",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-07-09",
        "count": 6,
        "level": 1
      },
      {
        "date": "2026-07-10",
        "count": 3,
        "level": 1
      },
      {
        "date": "2026-07-11",
        "count": 1,
        "level": 1
      },
      {
        "date": "2026-07-12",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-07-13",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-07-14",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-07-15",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-07-16",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-07-17",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-07-18",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-07-19",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-07-20",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-07-21",
        "count": 1,
        "level": 1
      },
      {
        "date": "2026-07-22",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-07-23",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-07-24",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-07-25",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-07-26",
        "count": 9,
        "level": 1
      },
      {
        "date": "2026-07-27",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-07-28",
        "count": 2,
        "level": 1
      },
      {
        "date": "2026-07-29",
        "count": 1,
        "level": 1
      },
      {
        "date": "2026-07-30",
        "count": 5,
        "level": 1
      },
      {
        "date": "2026-07-31",
        "count": 15,
        "level": 1
      },
      {
        "date": "2026-08-01",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-08-02",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-08-03",
        "count": 2,
        "level": 1
      },
      {
        "date": "2026-08-04",
        "count": 4,
        "level": 1
      },
      {
        "date": "2026-08-05",
        "count": 8,
        "level": 1
      },
      {
        "date": "2026-08-06",
        "count": 1,
        "level": 1
      },
      {
        "date": "2026-08-07",
        "count": 10,
        "level": 1
      },
      {
        "date": "2026-08-08",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-08-09",
        "count": 1,
        "level": 1
      },
      {
        "date": "2026-08-10",
        "count": 3,
        "level": 1
      },
      {
        "date": "2026-08-11",
        "count": 8,
        "level": 1
      },
      {
        "date": "2026-08-12",
        "count": 13,
        "level": 1
      },
      {
        "date": "2026-08-13",
        "count": 17,
        "level": 2
      },
      {
        "date": "2026-08-14",
        "count": 18,
        "level": 2
      },
      {
        "date": "2026-08-15",
        "count": 4,
        "level": 1
      },
      {
        "date": "2026-08-16",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-08-17",
        "count": 9,
        "level": 1
      },
      {
        "date": "2026-08-18",
        "count": 13,
        "level": 1
      },
      {
        "date": "2026-08-19",
        "count": 3,
        "level": 1
      },
      {
        "date": "2026-08-20",
        "count": 7,
        "level": 1
      },
      {
        "date": "2026-08-21",
        "count": 4,
        "level": 1
      },
      {
        "date": "2026-08-22",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-08-23",
        "count": 1,
        "level": 1
      },
      {
        "date": "2026-08-24",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-08-25",
        "count": 12,
        "level": 1
      },
      {
        "date": "2026-08-26",
        "count": 1,
        "level": 1
      },
      {
        "date": "2026-08-27",
        "count": 8,
        "level": 1
      },
      {
        "date": "2026-08-28",
        "count": 8,
        "level": 1
      },
      {
        "date": "2026-08-29",
        "count": 8,
        "level": 1
      },
      {
        "date": "2026-08-30",
        "count": 10,
        "level": 1
      },
      {
        "date": "2026-08-31",
        "count": 7,
        "level": 1
      },
      {
        "date": "2026-09-01",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-09-02",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-09-03",
        "count": 9,
        "level": 1
      },
      {
        "date": "2026-09-04",
        "count": 8,
        "level": 1
      },
      {
        "date": "2026-09-05",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-09-06",
        "count": 5,
        "level": 1
      },
      {
        "date": "2026-09-07",
        "count": 27,
        "level": 2
      },
      {
        "date": "2026-09-08",
        "count": 15,
        "level": 1
      },
      {
        "date": "2026-09-09",
        "count": 12,
        "level": 1
      },
      {
        "date": "2026-09-10",
        "count": 3,
        "level": 1
      },
      {
        "date": "2026-09-11",
        "count": 2,
        "level": 1
      },
      {
        "date": "2026-09-12",
        "count": 1,
        "level": 1
      },
      {
        "date": "2026-09-13",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-09-14",
        "count": 3,
        "level": 1
      },
      {
        "date": "2026-09-15",
        "count": 13,
        "level": 1
      },
      {
        "date": "2026-09-16",
        "count": 9,
        "level": 1
      },
      {
        "date": "2026-09-17",
        "count": 6,
        "level": 1
      },
      {
        "date": "2026-09-18",
        "count": 5,
        "level": 1
      },
      {
        "date": "2026-09-19",
        "count": 2,
        "level": 1
      },
      {
        "date": "2026-09-20",
        "count": 1,
        "level": 1
      },
      {
        "date": "2026-09-21",
        "count": 100,
        "level": 4
      },
      {
        "date": "2026-09-22",
        "count": 40,
        "level": 3
      },
      {
        "date": "2026-09-23",
        "count": 3,
        "level": 1
      },
      {
        "date": "2026-09-24",
        "count": 47,
        "level": 4
      },
      {
        "date": "2026-09-25",
        "count": 4,
        "level": 1
      },
      {
        "date": "2026-09-26",
        "count": 1,
        "level": 1
      },
      {
        "date": "2026-09-27",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-09-28",
        "count": 4,
        "level": 1
      },
      {
        "date": "2026-09-29",
        "count": 1,
        "level": 1
      },
      {
        "date": "2026-09-30",
        "count": 8,
        "level": 1
      },
      {
        "date": "2026-10-01",
        "count": 6,
        "level": 1
      },
      {
        "date": "2026-10-02",
        "count": 5,
        "level": 1
      },
      {
        "date": "2026-10-03",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-10-04",
        "count": 26,
        "level": 2
      },
      {
        "date": "2026-10-05",
        "count": 22,
        "level": 2
      },
      {
        "date": "2026-10-06",
        "count": 14,
        "level": 1
      },
      {
        "date": "2026-10-07",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-10-08",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-10-09",
        "count": 1,
        "level": 1
      },
      {
        "date": "2026-10-10",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-10-11",
        "count": 3,
        "level": 1
      },
      {
        "date": "2026-10-12",
        "count": 62,
        "level": 4
      },
      {
        "date": "2026-10-13",
        "count": 12,
        "level": 1
      },
      {
        "date": "2026-10-14",
        "count": 14,
        "level": 1
      },
      {
        "date": "2026-10-15",
        "count": 5,
        "level": 1
      },
      {
        "date": "2026-10-16",
        "count": 9,
        "level": 1
      },
      {
        "date": "2026-10-17",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-10-18",
        "count": 1,
        "level": 1
      },
      {
        "date": "2026-10-19",
        "count": 1,
        "level": 1
      },
      {
        "date": "2026-10-20",
        "count": 23,
        "level": 2
      },
      {
        "date": "2026-10-21",
        "count": 16,
        "level": 2
      },
      {
        "date": "2026-10-22",
        "count": 1,
        "level": 1
      },
      {
        "date": "2026-10-23",
        "count": 11,
        "level": 1
      },
      {
        "date": "2026-10-24",
        "count": 2,
        "level": 1
      },
      {
        "date": "2026-10-25",
        "count": 0,
        "level": 0
      },
      {
        "date": "2026-10-26",
        "count": 25,
        "level": 2
      },
      {
        "date": "2026-10-27",
        "count": 40,
        "level": 3
      },
      {
        "date": "2026-10-28",
        "count": 16,
        "level": 2
      },
      {
        "date": "2026-10-29",
        "count": 18,
        "level": 2
      },
      {
        "date": "2026-10-30",
        "count": 18,
        "level": 2
      },
      {
        "date": "2026-10-31",
        "count": 2,
        "level": 1
      },
      {
        "date": "2026-11-01",
        "count": 3,
        "level": 1
      },
      {
        "date": "2026-11-02",
        "count": 4,
        "level": 1
      },
      {
        "date": "2026-11-03",
        "count": 41,
        "level": 3
      },
      {
        "date": "2026-11-04",
        "count": 5,
        "level": 1
      }
    ]
  }
};
