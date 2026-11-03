// Shot definitions and camera trajectories for PayPal Sentinel film
import { staticFile } from "remotion";
import type { CalloutSpec } from "./components/Callout";

export interface CamKey {
  at: number;
  scale: number;
  yaw?: number;
  pitch?: number;
  panX?: number;
  panY?: number;
}

export interface ShotSpec {
  id: string;
  src: string;
  startFromFrame?: number;
  playbackRate?: number;
  camKeys: CamKey[];
  callout?: CalloutSpec;
}

export const MASTER_SHOTS: Record<string, ShotSpec> = {
  // S05: 5 Devpost Tracks & Live Pattern Settle (Take 1)
  S05: {
    id: "S05-PatternStudio",
    src: staticFile("footage/take-01-sandbox-and-5-tracks.mp4"),
    camKeys: [
      { at: 0, scale: 1.05, yaw: 8, panX: 0, panY: 0 },
      { at: 180, scale: 1.0, yaw: 0, panX: 0, panY: 0 },
      { at: 540, scale: 1.04, yaw: -4, panX: 0, panY: 0 },
    ],
    callout: {
      what: "PayPal + AI Pattern Studio (5 Tracks & 12 Patterns)",
      why: "Covers A2A Negotiation, HTTP 402 Paywall, PR Bounty #107, Multi-Currency Invoicing, and Dispute Shield #109.",
      top: 60,
      right: 60,
      from: 60,
      durationInFrames: 560,
    },
  },

  // S07: Channel3 Search & Card *1881 Capture (Take 2)
  S07: {
    id: "S07-Channel3Capture",
    src: staticFile("footage/take-02-channel3-and-capture.mp4"),
    camKeys: [
      { at: 0, scale: 1.05, yaw: 6, panX: 0, panY: 0 },
      { at: 120, scale: 1.0, yaw: 0, panX: 0, panY: 0 },
      { at: 450, scale: 1.04, yaw: -3, panX: 0, panY: 0 },
    ],
    callout: {
      what: "Server-to-Server Orders v2 Capture (*1881)",
      why: "TypeSafe Jev + Rust verify risk ($445 <= $500 cap) before PayPal settles via Visa *1881 ($425 -> $870).",
      top: 60,
      left: 60,
      from: 60,
      durationInFrames: 520,
    },
  },

  // S09: Adversarial Red-Team Guardrails (Take 3)
  S09: {
    id: "S09-RedTeamGuardrails",
    src: staticFile("footage/take-03-redteam-and-mcp.mp4"),
    camKeys: [
      { at: 0, scale: 1.04, yaw: -6, panX: 0, panY: 0 },
      { at: 120, scale: 1.0, yaw: 0, panX: 0, panY: 0 },
      { at: 480, scale: 1.03, yaw: 4, panX: 0, panY: 0 },
    ],
    callout: {
      what: "Deterministic Overspend, Decline & Replay Locks",
      why: "$850 spike blocks at $0.00 charged; Duplicate keys reject with 409; HMAC-SHA256 constant-time check PASS.",
      bottom: 60,
      right: 60,
      from: 60,
      durationInFrames: 520,
    },
  },

  // S11: @paypal/mcp Inspector & Dispute Shield (Take 3 second half)
  S11: {
    id: "S11-McpDisputeShield",
    src: staticFile("footage/take-03-redteam-and-mcp.mp4"),
    startFromFrame: 380,
    camKeys: [
      { at: 0, scale: 1.03, yaw: 5, panX: 0, panY: 0 },
      { at: 90, scale: 1.0, yaw: 0, panX: 0, panY: 0 },
      { at: 360, scale: 1.02, yaw: -3, panX: 0, panY: 0 },
    ],
    callout: {
      what: "@paypal/agent-toolkit & Dispute Evidence Shield",
      why: "12-tool MCP server bridges batch payouts and submits carrier evidence (EVIDENCE_SUBMITTED_SELLER_PROTECTED).",
      top: 60,
      right: 60,
      from: 40,
      durationInFrames: 380,
    },
  },

  // S13: AG Studio Enterprise Grid (Take 4)
  S13: {
    id: "S13-AgStudioGrid",
    src: staticFile("footage/take-04-ag-grid-and-bryntum.mp4"),
    camKeys: [
      { at: 0, scale: 1.04, yaw: -5, panX: 0, panY: 0 },
      { at: 90, scale: 1.0, yaw: 0, panX: 0, panY: 0 },
      { at: 360, scale: 1.03, yaw: 3, panX: 0, panY: 0 },
    ],
    callout: {
      what: "AG Grid v36 & Self-Serve Studio KPI Agent",
      why: "One-click NLP chips filter completed vs blocked spend and export clean audit CSVs.",
      bottom: 60,
      left: 60,
      from: 40,
      durationInFrames: 380,
    },
  },

  // S15: Bryntum Resource Timeline (Take 4 second half)
  S15: {
    id: "S15-BryntumTimeline",
    src: staticFile("footage/take-04-ag-grid-and-bryntum.mp4"),
    startFromFrame: 260,
    camKeys: [
      { at: 0, scale: 1.03, yaw: 5, panX: 0, panY: 0 },
      { at: 90, scale: 1.0, yaw: 0, panX: 0, panY: 0 },
      { at: 280, scale: 1.0, yaw: 0, panX: 0, panY: 0 },
    ],
    callout: {
      what: "Bryntum Resource Timeline & Trackers v1",
      why: "Multi-vendor 7D/14D/30D zoom; 1-click DELIVERED proof updates carrier SLAs to 100%.",
      top: 60,
      right: 60,
      from: 30,
      durationInFrames: 280,
    },
  },
};

export const X_SHOTS: Record<string, ShotSpec> = {
  X02: {
    id: "X02-Capture",
    src: staticFile("footage/take-02-channel3-and-capture.mp4"),
    playbackRate: 1.15,
    camKeys: [{ at: 0, scale: 1.0, yaw: 0 }],
    callout: {
      what: "Channel3 + Orders v2 Direct Card Capture (*1881)",
      why: "Rust SpendPolicy verifies risk before PayPal settles $870.",
      top: 50,
      left: 50,
      from: 30,
      durationInFrames: 240,
    },
  },
  X03: {
    id: "X03-Redteam",
    src: staticFile("footage/take-03-redteam-and-mcp.mp4"),
    playbackRate: 1.15,
    camKeys: [{ at: 0, scale: 1.0, yaw: 0 }],
    callout: {
      what: "$850 Overspend Block & Duplicate 409 Lock",
      why: "Hallucinated retries or spikes charge $0.00.",
      bottom: 50,
      right: 50,
      from: 20,
      durationInFrames: 200,
    },
  },
  X04: {
    id: "X04-Tracks",
    src: staticFile("footage/take-01-sandbox-and-5-tracks.mp4"),
    playbackRate: 1.2,
    camKeys: [{ at: 0, scale: 1.0, yaw: 0 }],
    callout: {
      what: "5 Devpost Inspiration Tracks & 12 Patterns",
      why: "A2A, HTTP 402, PR Bounty, Invoicing, Dispute Shield.",
      top: 50,
      right: 50,
      from: 20,
      durationInFrames: 200,
    },
  },
  X05: {
    id: "X05-AgBryntum",
    src: staticFile("footage/take-04-ag-grid-and-bryntum.mp4"),
    playbackRate: 1.25,
    camKeys: [{ at: 0, scale: 1.0, yaw: 0 }],
    callout: {
      what: "AG Studio Grid & Bryntum DELIVERED Trackers",
      why: "Enterprise telemetry and 1-click fulfillment verification.",
      bottom: 50,
      left: 50,
      from: 15,
      durationInFrames: 150,
    },
  },
};
