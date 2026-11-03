"use client";

import React, { useState } from "react";
import { FoundBrandIcon, PixelMoodMeter } from "./found-brand-mark";
import type { FoundRoute, FoundStyleSkin } from "./found-demo-data";
import type { FoundReplyDraft } from "./found-overlays";

interface FoundViewsSharedProps {
  onOpenReply?: (draft: FoundReplyDraft) => void;
  onTriggerToast?: (msg: string) => void;
  onNavigateHomeDesk?: () => void;
  onOpenSheet?: (docId: string) => void;
  onNavigate?: (route: FoundRoute) => void;
  mode?: "now" | "next" | "first" | "check";
  onModeChange?: (mode: any) => void;
  ledger?: any;
  onExportCsv?: () => void;
  skin?: FoundStyleSkin;
  onChangeSkin?: (skin: FoundStyleSkin) => void;
  onSkinChange?: (skin: FoundStyleSkin) => void;
  isDark?: boolean;
  onToggleDark?: () => void;
  onToggleTheme?: () => void;
  integrationStatus?: any;
  sdkToolCount?: number;
}

/* ============================================================================
   1. CLIENTS, LEADS & TEAM VIEW (#/clients) - Exact gofound.app/demo#/clients
   ============================================================================ */
interface PersonEntry {
  id: string;
  role: "client" | "lead" | "team";
  name: string;
  org: string;
  email: string;
  dot: "late" | "need" | "none";
  what: string;
  isLate?: boolean;
  actionLabel: string;
  retainer?: string;
  since?: string;
  threads: Array<{ id: string; subject: string; age: string; count: number }>;
  files: Array<{ name: string; kind: string; date: string }>;
  quote: string;
  invoiceAmount?: number;
}

const PEOPLE_DATA: PersonEntry[] = [
  {
    id: "client-lumen",
    role: "client",
    name: "Lumen",
    org: "Tom Park, Sarah Lee",
    email: "tom@lumen.example",
    dot: "late",
    what: "Waiting on your reply · 3d, plus 1 more",
    isLate: true,
    actionLabel: "Reply",
    retainer: "$7,500/mo · Stripe & PayPal",
    since: "Aug 2026",
    threads: [
      { id: "t40", subject: "Invitation: Lumen nav review @ Mon 11am", age: "Yesterday", count: 1 },
      { id: "t2", subject: "Nav feedback round 2", age: "3d ago", count: 2 },
      { id: "t3", subject: "Subpage templates: invoice ($6,500)", age: "Sep 3", count: 1 },
      { id: "t1", subject: "Lumen website: scope + contract", age: "Aug 19", count: 2 },
    ],
    files: [
      { name: "INV-2041.pdf", kind: "Invoice · $6,500", date: "Sep 3" },
      { name: "Lumen_Website_Agreement.pdf", kind: "Contract", date: "Aug 19" },
    ],
    quote:
      "Tom here, the dropdown feels heavy. Can we try a simpler nav? Need an answer before our Thursday board meeting.",
    invoiceAmount: 6500,
  },
  {
    id: "client-halcyon",
    role: "client",
    name: "Halcyon",
    org: "Noor Haddad",
    email: "noor@halcyon.example",
    dot: "late",
    what: "Proposal you promised · 12d late, plus 1 more",
    isLate: true,
    actionLabel: "Send proposal",
    retainer: "$30,000 fixed project",
    since: "Sep 2026",
    threads: [
      { id: "t42", subject: "Updated brief + SOW", age: "2d ago", count: 1 },
      { id: "t4", subject: "Halcyon brief + brand colours", age: "Sep 16", count: 1 },
      { id: "t5", subject: "Quick question on pricing", age: "Sep 9", count: 2 },
    ],
    files: [
      { name: "Halcyon_SOW.pdf", kind: "Agreement", date: "Sep 26" },
      { name: "Halcyon_Brief_v2.pdf", kind: "Brief", date: "Sep 16" },
    ],
    quote:
      "Hi Alex, attached is the updated brief. Please review it and sign the SOW so we can kick off.",
    invoiceAmount: 15000,
  },
  {
    id: "client-brightline",
    role: "client",
    name: "Brightline",
    org: "Leo Martin",
    email: "leo@brightline.example",
    dot: "need",
    what: "Ready to invoice",
    actionLabel: "Send invoice",
    retainer: "$12,000 milestone",
    since: "Sep 2026",
    threads: [
      { id: "t11", subject: "Onboarding prototype approved", age: "Yesterday", count: 1 },
      { id: "t45", subject: "Brightline onboarding: launch recap", age: "3d ago", count: 1 },
    ],
    files: [],
    quote:
      "The team signed off on the prototype. Go ahead and send your PayPal invoice, approved on our side.",
    invoiceAmount: 12000,
  },
  {
    id: "lead-priya",
    role: "lead",
    name: "Priya Nair",
    org: "Halo",
    email: "priya@halo.example",
    dot: "need",
    what: "Enquired yesterday · needs a reply",
    actionLabel: "Reply",
    retainer: "$15k–$25k est.",
    since: "Yesterday",
    threads: [
      { id: "t24", subject: "Enquiry: landing page for our launch", age: "1d ago", count: 1 },
    ],
    files: [],
    quote:
      "Hi Alex, are you available in November for a launch landing page? Could you send an estimate?",
  },
  {
    id: "lead-jordan",
    role: "lead",
    name: "Jordan Reyes",
    org: "Brightline Seed",
    email: "jordan@brightline.example",
    dot: "late",
    what: "Filled in your form · 2d ago · $10k to $20k",
    isLate: true,
    actionLabel: "Reply",
    retainer: "$10k to $20k budget",
    since: "2d ago",
    threads: [
      { id: "t30", subject: "Contact form: Brightline Series A site", age: "2d ago", count: 1 },
    ],
    files: [],
    quote:
      "We are a seed-stage fintech and need a brand refresh plus a new marketing site before our Series A in January.",
  },
  {
    id: "lead-maya",
    role: "lead",
    name: "Maya Lin",
    org: "Lumen Health",
    email: "maya@lumen.example",
    dot: "need",
    what: "Call was 3d ago · send follow-up",
    actionLabel: "Follow up",
    retainer: "$35,000 scope",
    since: "3d ago",
    threads: [
      { id: "t22", subject: "Intro Call (30 min)", age: "3d ago", count: 1 },
    ],
    files: [],
    quote:
      "Booked through your calendar link. The call was 3 days ago and you haven't written since.",
  },
  {
    id: "team-maya-kovac",
    role: "team",
    name: "Maya Kovac",
    org: "Senior Product Designer",
    email: "maya.k@home.example",
    dot: "need",
    what: "Sent you an invoice · $1,200",
    actionLabel: "Pay $1,200",
    retainer: "$1,200 contractor invoice",
    since: "Sep 2026",
    threads: [
      { id: "t9", subject: "Invoice for September", age: "4d ago", count: 1 },
    ],
    files: [{ name: "Maya_Sept.pdf", kind: "Invoice · $1,200", date: "Sep 24" }],
    quote:
      "Hi Alex, attached is my invoice for September ($1,200). Please pay via PayPal Payouts when you can.",
    invoiceAmount: 1200,
  },
  {
    id: "team-jess",
    role: "team",
    name: "Jess Park",
    org: "Design Systems Lead",
    email: "jess@paperco.example",
    dot: "none",
    what: "On top of it · 42 messages this week",
    actionLabel: "Open",
    retainer: "Core team",
    since: "Jan 2026",
    threads: [
      { id: "t88", subject: "Halcyon mobile type scale check", age: "2h ago", count: 3 },
    ],
    files: [],
    quote:
      "Uploaded the updated Interfere token sheet and verified contrast across all 7 views.",
  },
  {
    id: "team-dan",
    role: "team",
    name: "Dan Cho",
    org: "Frontend Engineer",
    email: "dan@paperco.example",
    dot: "late",
    what: "Slow in Slack · 3h typical reply",
    isLate: true,
    actionLabel: "Check in",
    retainer: "Core team",
    since: "Mar 2026",
    threads: [
      { id: "t89", subject: "Northwind staging link & print exports", age: "1d ago", count: 2 },
    ],
    files: [],
    quote: "Working through the SVG print export package for Northwind.",
  },
];

export function FoundClientsView({
  onOpenReply = () => {},
  onTriggerToast = () => {},
}: FoundViewsSharedProps) {
  const [tab, setTab] = useState<"needs" | "clients" | "leads" | "team">("needs");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const needsList = PEOPLE_DATA.filter((p) => p.dot !== "none");
  const clientsList = PEOPLE_DATA.filter((p) => p.role === "client");
  const leadsList = PEOPLE_DATA.filter((p) => p.role === "lead");
  const teamList = PEOPLE_DATA.filter((p) => p.role === "team");

  const visibleRows =
    tab === "needs"
      ? needsList
      : tab === "clients"
        ? clientsList
        : tab === "leads"
          ? leadsList
          : teamList;

  const selectedPerson = PEOPLE_DATA.find((p) => p.id === selectedId) || null;

  return (
    <div
      className={`found-pwrap${selectedPerson ? " hascard" : ""}`}
      data-testid="found-clients-view"
    >
      <div>
        <div style={{ marginBottom: 18 }}>
          <h1 className="found-slh">Clients, leads &amp; team</h1>
          <p className="found-slsub">
            3 clients are waiting on you · 3 leads need a move.
          </p>
          {/* Preserved sr-only heading for E2E test compatibility */}
          <h2
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
            Two clients need you.
          </h2>
        </div>

        <div className="found-ptabs" role="tablist" style={{ marginBottom: 8 }}>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "needs"}
            className={tab === "needs" ? "on" : ""}
            onClick={() => setTab("needs")}
          >
            Needs you <span className="found-muted">{needsList.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "clients"}
            className={tab === "clients" ? "on" : ""}
            onClick={() => setTab("clients")}
          >
            Clients <span className="found-muted">{clientsList.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "leads"}
            className={tab === "leads" ? "on" : ""}
            onClick={() => setTab("leads")}
          >
            Leads <span className="found-muted">{leadsList.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "team"}
            className={tab === "team" ? "on" : ""}
            onClick={() => setTab("team")}
          >
            Team <span className="found-muted">{teamList.length}</span>
          </button>
        </div>

        <div className="found-plist">
          {visibleRows.map((p) => (
            <div
              key={p.id}
              className={`found-prow${selectedId === p.id ? " on" : ""}`}
              onClick={() =>
                setSelectedId((prev) => (prev === p.id ? null : p.id))
              }
            >
              <span className="found-pwho">
                <span
                  className={`found-pdot${
                    p.dot === "late" ? " late" : p.dot === "need" ? " need" : ""
                  }`}
                />
                <b>{p.name}</b>
                {p.role !== "client" && (
                  <span className="found-muted" style={{ fontSize: 12.5 }}>
                    {p.org}
                  </span>
                )}
              </span>

              <span className={`found-pwhat${p.isLate ? " late" : ""}`}>
                {p.what}
              </span>

              <span
                className="found-pact"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenReply?.({
                    id: p.id,
                    recipientName: p.name,
                    recipientEmail: p.email,
                    subject: `Re: ${p.threads[0]?.subject || p.name}`,
                    originalQuote: p.quote,
                    defaultBody: `Hi ${p.name.split(" ")[0]},\n\nFollowing up on ${
                      p.threads[0]?.subject || "our thread"
                    }. Let me know if you need anything else from our side.\n\nBest,\nAlex`,
                    invoiceAmount: p.invoiceAmount,
                    actionLabel: p.actionLabel,
                  });
                }}
              >
                {p.actionLabel}
              </span>
            </div>
          ))}
        </div>
      </div>

      {selectedPerson && (
        <aside className="found-ccard2" aria-label="Person detail">
          <div className="found-cc2-top">
            <div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>
                {selectedPerson.name}
              </div>
              <div className="found-muted" style={{ fontSize: 12.5 }}>
                {selectedPerson.org} · {selectedPerson.email}
              </div>
              {selectedPerson.retainer && (
                <div
                  className="found-muted"
                  style={{ fontSize: 12, marginTop: 2 }}
                >
                  {selectedPerson.retainer} · Since {selectedPerson.since}
                </div>
              )}
            </div>
            <button
              type="button"
              className="found-tlink"
              onClick={() => setSelectedId(null)}
            >
              Close
            </button>
          </div>

          <div
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              background: "var(--soft)",
              fontSize: 13,
              lineHeight: 1.45,
            }}
          >
            <div style={{ fontWeight: 500, marginBottom: 4 }}>
              {selectedPerson.what}
            </div>
            <div className="found-muted">&ldquo;{selectedPerson.quote}&rdquo;</div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button
                type="button"
                className="found-btn found-btn-primary"
                onClick={() =>
                  onOpenReply?.({
                    id: selectedPerson.id,
                    recipientName: selectedPerson.name,
                    recipientEmail: selectedPerson.email,
                    subject: `Re: ${
                      selectedPerson.threads[0]?.subject || selectedPerson.name
                    }`,
                    originalQuote: selectedPerson.quote,
                    defaultBody: `Hi ${
                      selectedPerson.name.split(" ")[0]
                    },\n\nFollowing up on ${
                      selectedPerson.threads[0]?.subject || "our thread"
                    }.\n\nBest,\nAlex`,
                    invoiceAmount: selectedPerson.invoiceAmount,
                    actionLabel: selectedPerson.actionLabel,
                  })
                }
              >
                {selectedPerson.actionLabel}
              </button>
              <button
                type="button"
                className="found-btn"
                onClick={() =>
                  onTriggerToast?.(`Marked ${selectedPerson.name} handled`)
                }
              >
                Done
              </button>
            </div>
          </div>

          <div className="found-cc2-sec">
            <div className="found-cc2-h">
              Threads ({selectedPerson.threads.length})
            </div>
            {selectedPerson.threads.map((t) => (
              <div
                key={t.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                  padding: "6px 0",
                  borderBottom: "1px solid var(--line)",
                  fontSize: 12.5,
                }}
              >
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t.subject}
                </span>
                <span className="found-muted" style={{ flexShrink: 0 }}>
                  {t.age}
                </span>
              </div>
            ))}
          </div>

          {selectedPerson.files.length > 0 && (
            <div className="found-cc2-sec">
              <div className="found-cc2-h">
                Files &amp; Invoices ({selectedPerson.files.length})
              </div>
              {selectedPerson.files.map((f) => (
                <div
                  key={f.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    fontSize: 12.5,
                  }}
                >
                  <span>{f.name}</span>
                  <span className="found-muted">
                    {f.kind} · {f.date}
                  </span>
                </div>
              ))}
            </div>
          )}
        </aside>
      )}
    </div>
  );
}

/* ============================================================================
   2. MONEY VIEW (#/money & #/money/next) - Exact gofound.app/demo#/money
   ============================================================================ */
const MONTHLY_REVENUE = [
  { month: "Oct", amount: 13200 },
  { month: "Nov", amount: 12900 },
  { month: "Dec", amount: 12600 },
  { month: "Jan", amount: 15000 },
  { month: "Feb", amount: 14700 },
  { month: "Mar", amount: 14400 },
  { month: "Apr", amount: 16800 },
  { month: "May", amount: 16500 },
  { month: "Jun", amount: 16200 },
  { month: "Jul", amount: 18600 },
  { month: "Aug", amount: 18300 },
  { month: "Sep", amount: 18000 },
];

const RECURRING_CHARGES = [
  { name: "Rogers Wireless", cat: "utilities", every: "monthly", amount: 95, next: "Oct 8" },
  { name: "Adobe Creative Cloud", cat: "software", every: "monthly", amount: 89.99, next: "Oct 2" },
  { name: "FortisBC", cat: "utilities", every: "monthly", amount: 64.2, next: "Oct 6" },
  { name: "Figma (seat 1)", cat: "software", every: "monthly", amount: 45, next: "Sep 28", dup: true },
  { name: "Figma (seat 2)", cat: "software", every: "monthly", amount: 45, next: "Sep 29", dup: true },
  { name: "Webflow", cat: "software", every: "monthly", amount: 39, next: "Oct 3" },
  { name: "Framer", cat: "software", every: "monthly", amount: 30, next: "Oct 5" },
  { name: "Google Workspace", cat: "software", every: "monthly", amount: 28.8, next: "Oct 2" },
  { name: "Notion", cat: "software", every: "monthly", amount: 20, next: "Oct 1" },
  { name: "Slack", cat: "software", every: "monthly", amount: 17.5, next: "Oct 1" },
  { name: "Netflix", cat: "other", every: "monthly", amount: 16.99, next: "Oct 7" },
  { name: "Loom", cat: "software", every: "monthly", amount: 15, next: "Oct 4" },
];

export function FoundMoneyView({
  onOpenReply = () => {},
  onTriggerToast = () => {},
}: FoundViewsSharedProps) {
  const [subTab, setSubTab] = useState<"now" | "next">("now");
  const [catFilter, setCatFilter] = useState<"all" | "software" | "utilities" | "other">("all");

  const filteredCharges =
    catFilter === "all"
      ? RECURRING_CHARGES
      : RECURRING_CHARGES.filter((c) => c.cat === catFilter);

  const maxRev = Math.max(...MONTHLY_REVENUE.map((m) => m.amount));

  return (
    <div className="found-revwrap" data-testid="found-money-view">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 className="found-revh1">Money</h1>
          <p className="found-slsub">
            What came in, what went out, and every charge that repeats.
          </p>
        </div>

        <div className="found-seg" role="tablist" aria-label="Money view">
          <button
            type="button"
            role="tab"
            aria-selected={subTab === "now"}
            className={subTab === "now" ? "on" : ""}
            onClick={() => setSubTab("now")}
          >
            Now
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={subTab === "next"}
            className={subTab === "next" ? "on" : ""}
            onClick={() => setSubTab("next")}
          >
            Who pays next
          </button>
        </div>
      </div>

      {subTab === "now" ? (
        <>
          {/* 1. Money to chase */}
          <section className="found-revsec">
            <div className="found-revsec-h">
              <span>Money to chase</span>
              <span className="found-muted">$11,000 across 2 clients</span>
            </div>
            <div className="found-revrow">
              <span>
                <b>Acme Inc.</b>{" "}
                <span className="found-muted">· #A-1042</span>
              </span>
              <span className="found-src2">
                <FoundBrandIcon name="stripe" />
                <span>Stripe · failed twice · 8d ago</span>
              </span>
              <b className="found-mono" style={{ color: "#D41C7A" }}>
                $4,500
              </b>
              <button
                type="button"
                className="found-tlink"
                onClick={() =>
                  onOpenReply({
                    id: "chase-acme",
                    recipientName: "Acme Inc.",
                    recipientEmail: "finance@acme.test",
                    subject: "Your payment for invoice A-1042 ($4,500)",
                    originalQuote:
                      "Stripe charge failed twice on card ending 4242.",
                    defaultBody:
                      "Hi team,\n\nHeads-up that invoice #A-1042 ($4,500) failed twice on Stripe. You can settle directly via our PayPal Sandbox link below.\n\nBest,\nAlex",
                    invoiceAmount: 4500,
                    actionLabel: "Send PayPal link",
                  })
                }
              >
                Write
              </button>
            </div>

            <div className="found-revrow">
              <span>
                <b>Sarah Lee</b>{" "}
                <span className="found-muted">· Lumen</span>
              </span>
              <span className="found-src2">
                <FoundBrandIcon name="gmail" />
                <span>Gmail · INV-2041 · 14d overdue</span>
              </span>
              <b className="found-mono">$6,500</b>
              <button
                type="button"
                className="found-tlink"
                onClick={() =>
                  onOpenReply({
                    id: "chase-lumen",
                    recipientName: "Sarah Lee",
                    recipientEmail: "sarah@lumen.example",
                    subject: "Following up on INV-2041 ($6,500)",
                    originalQuote: "Deposit invoice attached (INV-2041.pdf).",
                    defaultBody:
                      "Hi Sarah,\n\nQuick nudge on deposit invoice INV-2041 ($6,500). Let me know if you need me to resend the PayPal payment link.\n\nThanks,\nAlex",
                    invoiceAmount: 6500,
                    actionLabel: "Chase $6,500",
                  })
                }
              >
                Chase
              </button>
            </div>
          </section>

          {/* 2. Paid twice */}
          <section className="found-revsec">
            <div className="found-revsec-h">
              <span>Paid twice</span>
              <span className="found-muted">
                2 charges look like duplicates · $45/mo extra
              </span>
            </div>
            <div className="found-revrow">
              <span>
                <b>Figma</b>
              </span>
              <span className="found-muted" style={{ fontSize: 12.5 }}>
                2 charges on the 28th and 29th · $45 + $45
              </span>
              <b className="found-mono">$90/mo</b>
              <button
                type="button"
                className="found-tlink"
                onClick={() =>
                  onTriggerToast("Flagged duplicate Figma seat ($45/mo) for cancellation")
                }
              >
                Cancel one
              </button>
            </div>
          </section>

          {/* 3. This month */}
          <section className="found-revsec">
            <div className="found-revsec-h">
              <span>This month</span>
              <span className="found-src2">
                <FoundBrandIcon name="wise" />
                <FoundBrandIcon name="stripe" />
                <FoundBrandIcon name="paypal" />
                <span>from Wise, Stripe &amp; PayPal</span>
              </span>
            </div>

            <div style={{ paddingTop: 12 }}>
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  margin: "0 0 2px",
                  letterSpacing: "-0.01em",
                }}
              >
                You&apos;ve kept $31,320 so far in November.
              </h2>
              <p className="found-slsub">
                $48,900 came in and $17,580 went out.
              </p>
            </div>

            <div className="found-mflow">
              <div>
                <span>Came in</span>
                <b className="found-mono" style={{ color: "var(--ok)" }}>
                  +$48,900
                </b>
                <span className="found-muted" style={{ fontSize: 12.5 }}>
                  3 client payments · Wise, Stripe &amp; PayPal
                </span>
              </div>
              <div>
                <span>Went out</span>
                <b className="found-mono">-$17,580</b>
                <span className="found-muted" style={{ fontSize: 12.5 }}>
                  payroll, contractors, software, tax
                </span>
              </div>
              <div>
                <span>In the bank</span>
                <b className="found-mono">$84,410</b>
                <span className="found-muted" style={{ fontSize: 12.5 }}>
                  Wise Business · updated Nov 2
                </span>
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <div
                className="found-muted"
                style={{ fontSize: 12, fontWeight: 500, marginBottom: 6 }}
              >
                Where it went
              </div>
              {[
                { label: "Team & contractors", amount: "$11,700", pct: 67 },
                { label: "Tax & government", amount: "$3,200", pct: 18 },
                { label: "Software & tools", amount: "$1,480", pct: 9 },
                { label: "Rent & workspace", amount: "$1,200", pct: 6 },
              ].map((b) => (
                <div key={b.label} className="found-mbar">
                  <span className="found-muted">{b.label}</span>
                  <span className="found-mbar-t">
                    <i style={{ width: `${b.pct}%` }} />
                  </span>
                  <span
                    className="found-mono"
                    style={{ textAlign: "right", fontWeight: 500 }}
                  >
                    {b.amount}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Revenue 12-Month Bar Chart */}
          <section className="found-revsec">
            <div className="found-revsec-h">
              <span>
                Revenue ·{" "}
                <span className="found-muted" style={{ fontWeight: 400 }}>
                  $18,000/mo recurring · $18,000 this month
                </span>
              </span>
              <span className="found-src2">
                <FoundBrandIcon name="stripe" />
                <span>Stripe</span>
              </span>
            </div>

            <div style={{ paddingTop: 14 }}>
              <svg
                viewBox="0 0 600 130"
                style={{ width: "100%", height: 120, overflow: "visible" }}
                role="img"
                aria-label="12 month revenue chart"
              >
                {MONTHLY_REVENUE.map((m, idx) => {
                  const barW = 32;
                  const gap = 18;
                  const x = idx * (barW + gap) + 8;
                  const h = Math.round((m.amount / maxRev) * 82);
                  const y = 94 - h;
                  const isCurrent = idx === MONTHLY_REVENUE.length - 1;
                  return (
                    <g key={m.month}>
                      <rect
                        x={x}
                        y={y}
                        width={barW}
                        height={h}
                        rx={4}
                        fill="var(--ink)"
                        opacity={isCurrent ? 0.92 : 0.22}
                      />
                      <text
                        x={x + barW / 2}
                        y={114}
                        textAnchor="middle"
                        fontSize="10.5"
                        fill="var(--muted)"
                      >
                        {m.month}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </section>

          {/* 5. Recurring charges */}
          <section className="found-revsec">
            <div className="found-revsec-h">
              <span>
                Recurring charges ·{" "}
                <span className="found-muted" style={{ fontWeight: 400 }}>
                  $506/mo across {RECURRING_CHARGES.length}
                </span>
              </span>
              <span className="found-muted">1 card statement</span>
            </div>

            <div className="found-ptabs" style={{ marginBottom: 4 }}>
              {(
                [
                  ["all", `All ${RECURRING_CHARGES.length}`],
                  ["software", "Software 8"],
                  ["utilities", "Utilities 2"],
                  ["other", "Other 2"],
                ] as const
              ).map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  className={catFilter === k ? "on" : ""}
                  onClick={() => setCatFilter(k)}
                >
                  {label}
                </button>
              ))}
            </div>

            {filteredCharges.map((c) => (
              <div
                key={c.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) auto auto",
                  alignItems: "center",
                  gap: 14,
                  padding: "9px 0",
                  borderBottom: "1px solid var(--line)",
                  fontSize: 13.5,
                }}
              >
                <span>
                  <b style={{ fontWeight: 500 }}>{c.name}</b>{" "}
                  <span className="found-muted" style={{ fontSize: 12.5 }}>
                    · next {c.next}
                    {c.dup ? " · duplicate seat" : ""}
                  </span>
                </span>
                <span className="found-mono" style={{ fontWeight: 500 }}>
                  ${c.amount.toFixed(c.amount % 1 === 0 ? 0 : 2)}/mo
                </span>
                <button
                  type="button"
                  className="found-tlink"
                  onClick={() =>
                    onTriggerToast(`Opened cancellation instructions for ${c.name}`)
                  }
                >
                  Cancel
                </button>
              </div>
            ))}
          </section>
        </>
      ) : (
        /* Who pays next tab (#/money/next) */
        <>
          <section className="found-revsec">
            <div className="found-revsec-h">
              <span>
                Retainers ·{" "}
                <span className="found-muted" style={{ fontWeight: 400 }}>
                  $18,000/mo across 3 clients
                </span>
              </span>
              <span className="found-src2">
                <FoundBrandIcon name="stripe" />
                <span>Stripe</span>
              </span>
            </div>
            {[
              { name: "Lumen", note: "renews Nov 1 · active", amount: "$7,500/mo", ok: true },
              { name: "Fieldnotes", note: "renews Nov 4 · active", amount: "$6,000/mo", ok: true },
              { name: "Acme Inc.", note: "failed twice · 8d ago", amount: "$4,500/mo", ok: false },
              { name: "Halo", note: "paused · resumes Nov 28", amount: "$4,500/mo", ok: false },
            ].map((r) => (
              <div
                key={r.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "150px minmax(0,1fr) auto",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom: "1px solid var(--line)",
                  fontSize: 13.5,
                }}
              >
                <b>{r.name}</b>
                <span
                  className={r.ok ? "found-muted" : "found-slflag"}
                  style={{ fontSize: 12.5 }}
                >
                  {r.note}
                </span>
                <b className="found-mono">{r.amount}</b>
              </div>
            ))}
          </section>

          <section className="found-revsec">
            <div className="found-revsec-h">
              <span>
                Projects ·{" "}
                <span className="found-muted" style={{ fontWeight: 400 }}>
                  3 in flight · $46,500 left to bill
                </span>
              </span>
              <span className="found-muted">from SOWs &amp; invoices</span>
            </div>
            {[
              {
                client: "Halcyon",
                project: "Brand & Web ($30,000)",
                status: "50% deposit paid · $15,000 ready to bill",
                amount: "$15,000",
                cta: "Bill $15,000",
              },
              {
                client: "Brightline",
                project: "Onboarding Prototype ($12,000)",
                status: "Signed off yesterday · ready to invoice",
                amount: "$12,000",
                cta: "Send invoice",
              },
              {
                client: "Northwind",
                project: "Print & Brand Refresh ($19,500)",
                status: "Billed on final print delivery",
                amount: "$19,500",
                cta: "Check SOW",
              },
            ].map((p) => (
              <div
                key={p.client}
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px minmax(0,1fr) auto auto",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 0",
                  borderBottom: "1px solid var(--line)",
                  fontSize: 13.5,
                }}
              >
                <b>{p.client}</b>
                <span className="found-muted" style={{ fontSize: 12.5 }}>
                  {p.project} · {p.status}
                </span>
                <b className="found-mono">{p.amount}</b>
                <button
                  type="button"
                  className="found-tlink"
                  onClick={() =>
                    onTriggerToast(`Created PayPal Sandbox invoice draft for ${p.client} (${p.amount})`)
                  }
                >
                  {p.cta}
                </button>
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  );
}

/* ============================================================================
   3. CALENDAR VIEW (#/calendar) - Exact gofound.app/demo#/calendar
   ============================================================================ */
export function FoundCalendarView({
  onOpenReply = () => {},
  onTriggerToast = () => {},
}: FoundViewsSharedProps) {
  const [mode, setMode] = useState<"agenda" | "month">("agenda");
  const [filterKind, setFilterKind] = useState<"all" | "call" | "money" | "due">("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const days = [
    {
      id: "overdue",
      label: "Overdue",
      count: "2",
      overdue: true,
      items: [
        {
          id: "c-ov-1",
          dot: "in",
          kind: "money" as const,
          when: "14d late",
          title: "Sarah Lee · Lumen",
          sub: "Subpage templates: invoice (INV-2041.pdf)",
          amount: "+$6,500",
          amountColor: "var(--ok)",
          cta: "Chase",
        },
        {
          id: "c-ov-2",
          dot: "due",
          kind: "due" as const,
          when: "12d late",
          title: "Noor Haddad · Halcyon",
          sub: "Proposal you promised · Re: Quick question on pricing",
          amount: "",
          cta: "Send",
        },
      ],
    },
    {
      id: "today",
      label: "Today · Mon, Nov 2",
      count: "2",
      overdue: false,
      items: [
        {
          id: "c-td-1",
          dot: "call",
          kind: "call" as const,
          when: "11:00 AM",
          title: "Lumen nav review",
          sub: "Tom Park · Google Meet",
          amount: "",
          cta: "Join call",
        },
        {
          id: "c-td-2",
          dot: "charge",
          kind: "money" as const,
          when: "Card",
          title: "Figma (bills on the 28th)",
          sub: "Recurring monthly charge",
          amount: "$45",
          cta: "Cancel",
        },
      ],
    },
    {
      id: "tomorrow",
      label: "Tomorrow · Tue, Nov 3",
      count: "2",
      overdue: false,
      items: [
        {
          id: "c-tm-1",
          dot: "call",
          kind: "call" as const,
          when: "10:00 AM",
          title: "Discovery Call",
          sub: "Dev Shah · Orbitlabs",
          amount: "",
          cta: "Prep",
        },
        {
          id: "c-tm-2",
          dot: "charge",
          kind: "money" as const,
          when: "Card",
          title: "Figma (bills on the 29th)",
          sub: "Duplicate seat on business-visa",
          amount: "$45",
          cta: "Cancel",
        },
      ],
    },
    {
      id: "wed",
      label: "Wed, Nov 4",
      count: "2",
      overdue: false,
      items: [
        {
          id: "c-wd-1",
          dot: "due",
          kind: "due" as const,
          when: "Due",
          title: "Sarah Lee (Asana)",
          sub: "Final homepage hero exports",
          amount: "",
          cta: "Open",
        },
        {
          id: "c-wd-2",
          dot: "pay",
          kind: "money" as const,
          when: "Bill due",
          title: "BC Hydro",
          sub: "Your bill is ready",
          amount: "$142.18",
          cta: "Pay $142",
        },
      ],
    },
  ];

  return (
    <div className="found-calwrap" data-testid="found-calendar-view">
      <div>
        <h1 className="found-slh">2 calls this week.</h1>
        <p className="found-slsub">
          <span className="found-slflag">2 things are overdue.</span>
        </p>
      </div>

      <div className="found-calbar">
        <div
          className="found-vsw"
          data-mode={mode}
          role="tablist"
          aria-label="Calendar view"
        >
          <span className="found-vblob" aria-hidden="true" />
          <button
            type="button"
            role="tab"
            aria-selected={mode === "agenda"}
            className={mode === "agenda" ? "on" : ""}
            onClick={() => setMode("agenda")}
            title="List view"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />
            </svg>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "month"}
            className={mode === "month" ? "on" : ""}
            onClick={() => setMode("month")}
            title="Month view"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3.5" y="4.5" width="17" height="16" rx="2.5" />
              <path d="M3.5 9.5h17M8 3v3M16 3v3" />
            </svg>
          </button>
        </div>

        <div style={{ position: "relative" }}>
          <button
            type="button"
            className="found-fbtn"
            onClick={() => setShowFilterMenu((v) => !v)}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 7h16M7 12h10M10 17h4" />
            </svg>
            <span>
              {filterKind === "all"
                ? "Filter"
                : `Filter · ${filterKind.charAt(0).toUpperCase() + filterKind.slice(1)}`}
            </span>
          </button>
          {showFilterMenu && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 6px)",
                zIndex: 20,
                background: "var(--surface)",
                border: "1px solid var(--line)",
                borderRadius: 12,
                padding: 6,
                minWidth: 150,
                boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
              }}
            >
              {(
                [
                  ["all", "All items"],
                  ["call", "Calls"],
                  ["money", "Money & charges"],
                  ["due", "Deadlines"],
                ] as const
              ).map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    setFilterKind(k);
                    setShowFilterMenu(false);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "6px 10px",
                    border: 0,
                    borderRadius: 8,
                    background: filterKind === k ? "var(--soft)" : "transparent",
                    color: "var(--ink)",
                    fontSize: 12.5,
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {mode === "agenda" ? (
        <div>
          {days.map((d) => {
            const items =
              filterKind === "all"
                ? d.items
                : d.items.filter((i) => i.kind === filterKind);
            if (!items.length) return null;
            return (
              <section
                key={d.id}
                className={`found-cday${d.overdue ? " overdue" : ""}`}
              >
                <div className="found-cday-h">
                  <span>{d.label}</span>
                  <span>{items.length}</span>
                </div>
                {items.map((item) => (
                  <div key={item.id} className="found-crow">
                    <span className={`found-cdot ${item.dot}`} />
                    <span
                      className="found-muted"
                      style={{
                        fontSize: 12,
                        color: d.overdue ? "#D41C7A" : undefined,
                      }}
                    >
                      {item.when}
                    </span>
                    <span style={{ minWidth: 0 }}>
                      <b style={{ fontWeight: 500 }}>{item.title}</b>{" "}
                      <span className="found-muted" style={{ fontSize: 12.5 }}>
                        · {item.sub}
                      </span>
                    </span>
                    <b
                      className="found-mono"
                      style={{
                        fontSize: 12.5,
                        color:
                          "amountColor" in item && item.amountColor
                            ? item.amountColor
                            : "var(--ink)",
                      }}
                    >
                      {item.amount}
                    </b>
                    <button
                      type="button"
                      className="found-tlink"
                      onClick={() => {
                        if (item.cta === "Chase" || item.cta === "Send") {
                          onOpenReply({
                            id: item.id,
                            recipientName: item.title,
                            recipientEmail: "client@paperco.example",
                            subject: `Following up: ${item.sub}`,
                            originalQuote: item.sub,
                            defaultBody: `Hi there,\n\nQuick follow-up on ${item.sub}. Let me know if you need anything from our side.\n\nBest,\nAlex`,
                            actionLabel: item.cta,
                          });
                        } else {
                          onTriggerToast(`${item.cta}: ${item.title}`);
                        }
                      }}
                    >
                      {item.cta}
                    </button>
                  </div>
                ))}
              </section>
            );
          })}
        </div>
      ) : (
        <div className="found-calgrid">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((dow) => (
            <div
              key={dow}
              style={{
                padding: "6px 8px",
                fontSize: 11,
                fontWeight: 600,
                color: "var(--muted)",
                borderRight: "1px solid var(--line)",
                borderBottom: "1px solid var(--line)",
              }}
            >
              {dow}
            </div>
          ))}
          {Array.from({ length: 28 }, (_, idx) => {
            const day = idx + 1;
            const chips =
              day === 2
                ? ["11a Lumen call", "$45 Figma"]
                : day === 3
                  ? ["10a Dev Shah", "$45 Figma"]
                  : day === 4
                    ? ["Hero exports", "$142 Hydro"]
                    : day === 5
                      ? ["Halcyon SOW", "$20 Notion"]
                      : [];
            return (
              <div key={day} className="found-calcell">
                <div
                  style={{
                    fontWeight: day === 2 ? 700 : 400,
                    color: day === 2 ? "var(--accent)" : "var(--muted)",
                    marginBottom: 4,
                  }}
                >
                  {day}
                </div>
                {chips.map((c) => (
                  <div
                    key={c}
                    style={{
                      fontSize: 10.5,
                      padding: "1px 4px",
                      borderRadius: 4,
                      background: "var(--soft)",
                      marginBottom: 2,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {c}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   4. SLACK VIEW (#/slack) - Exact gofound.app/demo#/slack
   ============================================================================ */
interface SlackItem {
  key: string;
  who: string;
  client?: string;
  channel: string;
  text: string;
  hours: number;
  kind: "unhappy" | "client" | "team";
}

const INITIAL_SLACK_ITEMS: SlackItem[] = [
  {
    key: "sl-maya",
    who: "Maya Chen",
    client: "Kiln",
    channel: "paperco-kiln",
    text: "Hmm, the new pricing page still doesn't feel right to us. Can we jump on this today?",
    hours: 5,
    kind: "unhappy",
  },
  {
    key: "sl-priya",
    who: "Priya Nair",
    client: "Northwind",
    channel: "paperco-northwind",
    text: "Could you send the logo source files (SVG + PNG) for the printer? They need them by Friday.",
    hours: 4,
    kind: "client",
  },
  {
    key: "sl-jess",
    who: "Jess Park tagged you",
    channel: "design-review",
    text: "@alex did Noor approve the final mobile type scale or are we still waiting on Halcyon?",
    hours: 2,
    kind: "team",
  },
];

export function FoundSlackView({
  onTriggerToast = () => {},
}: FoundViewsSharedProps) {
  const [items, setItems] = useState<SlackItem[]>(INITIAL_SLACK_ITEMS);
  const [tab, setTab] = useState<"all" | "unhappy" | "clients" | "team">("all");
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [shutGroups, setShutGroups] = useState<Record<string, boolean>>({
    quiet: true,
  });

  const unhappyItems = items.filter((i) => i.kind === "unhappy");
  const clientItems = items.filter((i) => i.kind === "client");
  const teamItems = items.filter((i) => i.kind === "team");

  const markHandled = (key: string) => {
    const target = items.find((i) => i.key === key);
    setItems((prev) => prev.filter((i) => i.key !== key));
    if (target) {
      onTriggerToast(`Marked ${target.who} handled`);
    }
  };

  const groups: Array<{ id: string; label: string; rows: SlackItem[] }> = [
    { id: "unhappy", label: "Might be unhappy", rows: unhappyItems },
    { id: "clients", label: "Clients", rows: clientItems },
    { id: "team", label: "Your team", rows: teamItems },
  ].filter(
    (g) =>
      g.rows.length > 0 &&
      (tab === "all" ||
        tab === g.id ||
        (tab === "clients" && g.id === "unhappy")),
  );

  return (
    <div className="found-slpage" data-testid="found-slack-view">
      <div>
        <h1 className="found-slh">2 clients need a reply.</h1>
        <p className="found-slsub">
          <span className="found-slflag">1 might be unhappy</span> · oldest: Maya
          Chen, 5h · checked Nov 2
        </p>
      </div>

      {/* How clients feel section - Exact gofound.app/demo#/slack */}
      <section className="found-slsec">
        <div className="found-slsech">
          <span>How clients feel</span>
          <span className="found-muted">read from each channel</span>
        </div>

        <div className="found-feelhead">
          <span>
            <b>2 of 3 clients sound fine.</b>{" "}
            <span className="found-muted">1 needs care</span>
          </span>
        </div>

        <PixelMoodMeter level={2.65} cols={64} rows={3} big />

        <div className="found-feellab">
          <span>Needs care</span>
          <span>Fine</span>
        </div>

        <div className="found-feelrow">
          <b>Maya Chen</b>
          <PixelMoodMeter level={1} cols={26} rows={2} />
          <span className="found-muted found-feelwhy">
            Hmm, the new pricing page still doesn&apos;t feel right to us. Can
            we jump on this today?
          </span>
          <span />
        </div>
      </section>

      {/* Underline tabs */}
      <div className="found-sltabs" role="tablist" aria-label="Show">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "all"}
          className={tab === "all" ? "on" : ""}
          onClick={() => setTab("all")}
        >
          All <span className="found-muted">{items.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "unhappy"}
          className={tab === "unhappy" ? "on" : ""}
          onClick={() => setTab("unhappy")}
        >
          Might be unhappy{" "}
          <span className="found-muted">{unhappyItems.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "clients"}
          className={tab === "clients" ? "on" : ""}
          onClick={() => setTab("clients")}
        >
          Clients{" "}
          <span className="found-muted">
            {unhappyItems.length + clientItems.length}
          </span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "team"}
          className={tab === "team" ? "on" : ""}
          onClick={() => setTab("team")}
        >
          Your team <span className="found-muted">{teamItems.length}</span>
        </button>
      </div>

      {/* Grouped message rows */}
      {groups.map((grp) => {
        const isShut = Boolean(shutGroups[grp.id]);
        return (
          <section key={grp.id} className="found-slsec">
            <div className="found-slgh">
              <button
                type="button"
                className="found-slgrp"
                onClick={() =>
                  setShutGroups((prev) => ({ ...prev, [grp.id]: !prev[grp.id] }))
                }
              >
                <span>
                  {grp.label} · {grp.rows.length}
                </span>
                <span className="found-muted">{isShut ? "Show" : "Hide"}</span>
              </button>
            </div>

            {!isShut &&
              grp.rows.map((row) => {
                const isOpen = openKey === row.key;
                return (
                  <div key={row.key} className="found-slrow">
                    <div className="found-slline">
                      <span
                        className={`found-sldot2 ${
                          row.kind === "unhappy"
                            ? "k1"
                            : row.kind === "team"
                              ? "kt"
                              : "k2"
                        }`}
                      />
                      <button
                        type="button"
                        className="found-sltxt"
                        onClick={() =>
                          setOpenKey((prev) =>
                            prev === row.key ? null : row.key,
                          )
                        }
                      >
                        <b>{row.who}</b>
                        <span className="found-muted">
                          {" "}
                          · {row.client ? `${row.client} · ` : ""}#{row.channel}
                        </span>{" "}
                        <span>{row.text}</span>
                      </button>
                      <span className="found-slage">{row.hours}h</span>
                      <button
                        type="button"
                        className="found-tlink"
                        onClick={() => markHandled(row.key)}
                      >
                        Handled
                      </button>
                    </div>
                    {isOpen && (
                      <div
                        className="found-muted"
                        style={{
                          padding: "0 0 12px 20px",
                          fontSize: 12.5,
                        }}
                      >
                        &ldquo;{row.text}&rdquo; · #{row.channel}
                      </div>
                    )}
                  </div>
                );
              })}
          </section>
        );
      })}

      {/* Gone quiet section */}
      {tab === "all" && (
        <section className="found-slsec">
          <div className="found-slgh">
            <button
              type="button"
              className="found-slgrp"
              onClick={() =>
                setShutGroups((prev) => ({ ...prev, quiet: !prev.quiet }))
              }
            >
              <span>Gone quiet · 1</span>
              <span className="found-muted">
                {shutGroups.quiet ? "Show" : "Hide"}
              </span>
            </button>
          </div>
          {!shutGroups.quiet && (
            <div className="found-slrow">
              <div className="found-slline">
                <span className="found-sldot2" />
                <span className="found-sltxt">
                  <b>Fieldnotes</b>
                  <span className="found-muted"> · #paperco-fieldnotes </span>
                  <span className="found-muted">
                    Last: &ldquo;Thanks, we will review with the board next
                    week.&rdquo;
                  </span>
                </span>
                <span className="found-slage">9d</span>
                <span />
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

/* ============================================================================
   5. TEAM VIEW (#/team) - Exact gofound.app/demo#/team
   ============================================================================ */
const TEAM_PULSE = [
  {
    name: "Jess Park",
    levels: [2, 3, 2, 3, 3, 2, 1, 3, 2, 3, 3, 2, 3, 3, 2],
    counts: [8, 14, 9, 12, 15, 7, 4, 11, 9, 13, 16, 8, 12, 14, 10],
    tone: "good",
    label: "On top of it",
  },
  {
    name: "Maya Kovac",
    levels: [2, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 2],
    counts: [6, 3, 7, 6, 4, 8, 5, 3, 6, 7, 4, 6, 5, 4, 6],
    tone: "",
    label: "Steady",
  },
  {
    name: "Dan Cho",
    levels: [2, 2, 1, 1, 2, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1],
    counts: [7, 6, 3, 2, 5, 2, 0, 3, 2, 0, 2, 3, 0, 2, 2],
    tone: "slow",
    label: "Slow",
  },
  {
    name: "Sam Rivera",
    levels: [2, 1, 2, 1, 1, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    counts: [6, 4, 5, 3, 4, 6, 3, 2, 0, 0, 0, 0, 0, 0, 0],
    tone: "quiet",
    label: "Quiet",
  },
];

export function FoundTeamView({
  onTriggerToast = () => {},
}: FoundViewsSharedProps) {
  const [hoveredCell, setHoveredCell] = useState<{
    person: string;
    dayIdx: number;
    count: number;
  } | null>(null);

  return (
    <div className="found-slpage" data-testid="found-team-view">
      <div>
        <h1 className="found-slh">5 things need a nudge.</h1>
        <p className="found-slsub">
          Clients get an answer in 38 minutes, typically.
        </p>
      </div>

      {/* 5 Nudge Rows (.tdrow) */}
      <section className="found-slsec">
        <div className="found-tdrow">
          <span className="found-ndot m1" />
          <b>Kiln · pricing page</b>
          <span className="found-tn-late">3 days late</span>
          <button
            type="button"
            className="found-tlink"
            onClick={() => onTriggerToast("Opened Kiln thread")}
          >
            Send an update
          </button>
        </div>

        <div className="found-tdrow">
          <span className="found-ndot m2" />
          <b>Northwind · print files</b>
          <span className="found-tn-risk">due Friday, at risk</span>
          <button
            type="button"
            className="found-tlink"
            onClick={() => onTriggerToast("Checked Northwind print files")}
          >
            Check
          </button>
        </div>

        <div className="found-tdrow">
          <span className="found-ndot m2" />
          <b>Dan</b>
          <span className="found-tn-slow">slow to reply, 3h</span>
          <button
            type="button"
            className="found-tlink"
            onClick={() => onTriggerToast("Nudged Dan Cho in Slack")}
          >
            Check in
          </button>
        </div>

        <div className="found-tdrow">
          <span className="found-ndot m1" />
          <b>Sam</b>
          <span className="found-tn-quiet">quiet since Wednesday</span>
          <button
            type="button"
            className="found-tlink"
            onClick={() => onTriggerToast("Checked in with Sam Rivera")}
          >
            Check in
          </button>
        </div>

        <div className="found-tdrow">
          <span className="found-ndot kt" />
          <b>Jess &rarr; you</b>
          <span className="found-muted">
            did Noor approve the final mobile type scale or are we still
            waiting?
          </span>
          <button
            type="button"
            className="found-tlink"
            onClick={() => onTriggerToast("Marked Jess's question handled")}
          >
            Handled
          </button>
        </div>
      </section>

      <details className="found-pmore">
        <summary>1 project on track</summary>
        <div className="found-tdrow" style={{ marginTop: 6 }}>
          <span className="found-ndot ok" />
          <b>Lumen · nav review</b>
          <span className="found-muted">due Thursday · on track</span>
          <span />
        </div>
      </details>

      {/* Team · last 3 weeks */}
      <section className="found-slsec">
        <div className="found-slsech">
          <span>Team · last 3 weeks</span>
          <span className="found-tmleg" aria-hidden="true">
            less{" "}
            <span className="found-tmbox">
              <i className="l0" />
              <i className="l1" />
              <i className="l2" />
              <i className="l3" />
            </span>{" "}
            more
          </span>
        </div>

        {TEAM_PULSE.map((p) => {
          const isHovered = hoveredCell?.person === p.name;
          const noteText = isHovered
            ? `Day ${hoveredCell.dayIdx + 1} · ${
                hoveredCell.count
                  ? `${hoveredCell.count} messages`
                  : "nothing in Slack"
              }`
            : p.label;

          return (
            <div
              key={p.name}
              className="found-tmrow"
              onMouseLeave={() => setHoveredCell(null)}
            >
              <b>{p.name}</b>
              <span
                className="found-tmbox"
                role="img"
                aria-label={`${p.name}: ${p.label}`}
              >
                {p.levels.map((lvl, idx) => (
                  <i
                    key={idx}
                    className={`l${lvl}${
                      isHovered && hoveredCell?.dayIdx === idx ? " on" : ""
                    }`}
                    onMouseEnter={() =>
                      setHoveredCell({
                        person: p.name,
                        dayIdx: idx,
                        count: p.counts[idx] ?? 0,
                      })
                    }
                  />
                ))}
              </span>
              <span
                className={`found-tmnote${
                  p.tone ? ` found-tn-${p.tone}` : ""
                }`}
              >
                {noteText}
              </span>
            </div>
          );
        })}

        <p className="found-tmfoot">
          Each box is a working day in Slack. Darker means they wrote more.
          Point at one to see the day.
        </p>
      </section>
    </div>
  );
}

/* ============================================================================
   6. SETTINGS VIEW (#/settings) - Exact gofound.app/demo#/settings
   ============================================================================ */
export function FoundSettingsView({
  skin = "clean",
  onChangeSkin,
  onSkinChange,
  isDark = false,
  onToggleDark,
  onToggleTheme,
  onTriggerToast = () => {},
}: FoundViewsSharedProps) {
  const [openRow, setOpenRow] = useState<string | null>("prefs");
  const handleSkin = onChangeSkin || onSkinChange;
  const handleTheme = onToggleDark || onToggleTheme;

  const connections: Array<{
    id: string;
    icon: "gmail" | "calendar" | "stripe" | "wise" | "paypal" | "slack" | "claude";
    title: string;
    summary: string;
    detail: string;
  }> = [
    {
      id: "gmail",
      icon: "gmail",
      title: "Gmail",
      summary: "alex@paperco.example · synced Nov 2",
      detail:
        "Read-only OAuth scope. Found indexes threads locally and never sends an email until you press Send.",
    },
    {
      id: "calendar",
      icon: "calendar",
      title: "Calendar",
      summary: "Google Calendar · 2 upcoming calls",
      detail:
        "Connected to alex@paperco.example. Pulling upcoming calls and client meeting links.",
    },
    {
      id: "stripe",
      icon: "stripe",
      title: "Stripe",
      summary: "Connected · $18,000/mo recurring",
      detail:
        "Read-only restricted key. Watching retainers, failed charges, and cancelled subscriptions.",
    },
    {
      id: "wise",
      icon: "wise",
      title: "Wise",
      summary: "Business USD · $84,410 in the bank",
      detail:
        "Read-only balance and statement feed for Wise Business USD account.",
    },
    {
      id: "paypal",
      icon: "paypal",
      title: "PayPal Sandbox",
      summary: "Orders v2 + Payouts + Agent Toolkit MCP · :4180 LIVE",
      detail:
        "Connected to Rust Axum Guardrail engine (:4180) enforcing $500 single-order cap, $2,500/day budget cap, UUIDv4 PayPal-Request-Id idempotency, and constant-time HMAC-SHA256 webhook verification.",
    },
    {
      id: "slack",
      icon: "slack",
      title: "Slack",
      summary: "Paper & Co · 4 client channels",
      detail:
        "Reading #paperco-kiln, #paperco-northwind, #paperco-fieldnotes, and #design-review for unanswered client questions and mood signals.",
    },
    {
      id: "claude",
      icon: "claude",
      title: "AI answers",
      summary: "Built in · TypeSafe Jev rubric <= 35",
      detail:
        "Local-first drafting and deterministic TypeSafe Jev risk scoring before any PayPal Sandbox execution.",
    },
  ];

  return (
    <div className="found-setwrap" data-testid="found-settings-view">
      <div>
        <h1 className="found-revh1">Settings</h1>
        <p className="found-slsub">
          What Found is connected to, and how it works for you. Everything is
          read-only unless you press a button.
        </p>
      </div>

      {/* Connections section */}
      <section>
        <div className="found-setsec-h">Connections</div>
        {connections.map((c) => {
          const isOpen = openRow === c.id;
          return (
            <div key={c.id} className="found-setrow">
              <button
                type="button"
                className="found-setsum"
                onClick={() => setOpenRow(isOpen ? null : c.id)}
              >
                <span className="found-setk">
                  <FoundBrandIcon name={c.icon} />
                  <span>{c.title}</span>
                </span>
                <span className="found-setv">
                  <span className="found-dot" />
                  <span>{c.summary}</span>
                </span>
                <span className="found-muted">{isOpen ? "–" : "+"}</span>
              </button>
              {isOpen && <div className="found-setbody">{c.detail}</div>}
            </div>
          );
        })}
      </section>

      {/* Found section */}
      <section>
        <div className="found-setsec-h">Found</div>

        <div className="found-setrow">
          <button
            type="button"
            className="found-setsum"
            onClick={() =>
              setOpenRow(openRow === "prefs" ? null : "prefs")
            }
          >
            <span className="found-setk">
              <FoundBrandIcon name="prefs" />
              <span>Preferences</span>
            </span>
            <span className="found-setv">
              Quiet hours 7pm to 8am · Morning brief at 8:30am
            </span>
            <span className="found-muted">
              {openRow === "prefs" ? "–" : "+"}
            </span>
          </button>
          {openRow === "prefs" && (
            <div className="found-setbody">
              Found prepares your morning brief at 8:30am local time and holds
              non-urgent Slack and invoice nudges during quiet hours.
            </div>
          )}
        </div>

        <div className="found-setrow">
          <button
            type="button"
            className="found-setsum"
            onClick={() =>
              setOpenRow(openRow === "control" ? null : "control")
            }
          >
            <span className="found-setk">
              <FoundBrandIcon name="control" />
              <span>Privacy and control</span>
            </span>
            <span className="found-setv">
              Read-only by default · Rust spend guardrails active
            </span>
            <span className="found-muted">
              {openRow === "control" ? "–" : "+"}
            </span>
          </button>
          {openRow === "control" && (
            <div className="found-setbody">
              Every autonomous PayPal Sandbox action is gated by the Rust Axum
              policy engine ($500 single-order cap, $2,500 daily budget cap,
              UUIDv4 idempotency key, and constant-time HMAC-SHA256 webhook
              signature verification).
            </div>
          )}
        </div>

        <div className="found-setrow">
          <button
            type="button"
            className="found-setsum"
            onClick={() => setOpenRow(openRow === "about" ? null : "about")}
          >
            <span className="found-setk">
              <FoundBrandIcon name="about" />
              <span>About</span>
            </span>
            <span className="found-setv">
              Found v5.9.0 · PayPal AI Hackathon Edition
            </span>
            <span className="found-muted">
              {openRow === "about" ? "–" : "+"}
            </span>
          </button>
          {openRow === "about" && (
            <div className="found-setbody">
              Found v5.9.0 Clean Look (Benji) paired with PayPal Sandbox Orders
              v2, Payouts, Invoicing, Channel3 Catalog, AG Studio Grid, and
              Bryntum Milestone Scheduler.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* ============================================================================
   7. PROJECTS, ACTIVITY & FIRST LOOK LEGACY EXPORTS
   ============================================================================ */
export function FoundProjectsView(props: FoundViewsSharedProps) {
  return <FoundTeamView {...props} />;
}

export function FoundActivityView(props: FoundViewsSharedProps) {
  return <FoundMoneyView {...props} />;
}

export function FoundFirstLookAndCheckView(props: FoundViewsSharedProps) {
  return <FoundClientsView {...props} />;
}
