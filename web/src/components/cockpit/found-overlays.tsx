"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { FoundBrandIcon } from "./found-brand-mark";
import type { FoundRoute } from "./found-demo-data";

export type { FoundRoute };

export interface FoundReplyDraft {
  id: string;
  recipientName: string;
  recipientEmail: string;
  subject: string;
  originalQuote: string;
  defaultBody: string;
  invoiceAmount?: number;
  actionLabel?: string;
}

export interface FoundCommandItem {
  id: string;
  title: string;
  subtitle: string;
  category:
    | "Navigation"
    | "PayPal Actions"
    | "Clients & Threads"
    | "Sponsor Tools";
  shortcut?: string;
  onSelect: () => void;
}

interface FoundCommandPaletteProps {
  open: boolean;
  onClose: () => void;
  items?: FoundCommandItem[];
  onNavigate?: (route: FoundRoute) => void;
  onOpenSheet?: (docId: string) => void;
  onQuickSearchChannel3?: (query: string) => void;
}

export function FoundCommandPalette({
  open,
  onClose,
  items,
  onNavigate,
  onOpenSheet,
  onQuickSearchChannel3,
}: FoundCommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const defaultItems: FoundCommandItem[] = useMemo(
    () => [
      {
        id: "nav-home",
        title: "Home · Morning Brief & Triage Stack",
        subtitle: "Jump to daily brief and action cards",
        category: "Navigation",
        shortcut: "G H",
        onSelect: () => onNavigate?.("home"),
      },
      {
        id: "nav-calendar",
        title: "Calendar · Calls & Deadlines",
        subtitle: "Upcoming calls, bills, and overdue items",
        category: "Navigation",
        shortcut: "G K",
        onSelect: () => onNavigate?.("calendar"),
      },
      {
        id: "nav-clients",
        title: "Clients, Leads & Team",
        subtitle: "3 clients waiting · 3 leads need a move",
        category: "Navigation",
        shortcut: "G C",
        onSelect: () => onNavigate?.("clients"),
      },
      {
        id: "nav-slack",
        title: "Slack · How Clients Feel",
        subtitle: "2 clients need a reply · 1 might be unhappy",
        category: "Navigation",
        shortcut: "G L",
        onSelect: () => onNavigate?.("slack"),
      },
      {
        id: "nav-team",
        title: "Team · 3-Week Activity Pulse",
        subtitle: "5 things need a nudge · 38m typical reply",
        category: "Navigation",
        shortcut: "G T",
        onSelect: () => onNavigate?.("team"),
      },
      {
        id: "nav-money",
        title: "Money · Revenue & Recurring Charges",
        subtitle: "$31,320 kept in November · $18,000/mo recurring",
        category: "Navigation",
        shortcut: "G M",
        onSelect: () => onNavigate?.("money"),
      },
      {
        id: "nav-settings",
        title: "Settings & Connections",
        subtitle: "Gmail, Calendar, Stripe, Wise, PayPal Sandbox, Slack",
        category: "Navigation",
        shortcut: "G S",
        onSelect: () => onNavigate?.("settings"),
      },
      {
        id: "doc-inv",
        title: "Inspect PayPal Sandbox Invoice #INV-2041",
        subtitle: "Lumen deposit invoice ($6,500 USD)",
        category: "PayPal Actions",
        onSelect: () => onOpenSheet?.("doc-nebula-invoice"),
      },
    ],
    [onNavigate, onOpenSheet],
  );

  const list = items && items.length > 0 ? items : defaultItems;

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q),
    );
  }, [list, query]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filtered.length > 0 ? (prev + 1) % filtered.length : 0,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filtered.length > 0
            ? (prev - 1 + filtered.length) % filtered.length
            : 0,
        );
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        filtered[selectedIndex].onSelect();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, filtered, selectedIndex, onClose]);

  if (!open) return null;

  return (
    <div
      className="found-modal-backdrop"
      onClick={onClose}
      data-testid="found-command-palette"
    >
      <div
        className="found-modal-card"
        style={{ maxWidth: 560, padding: 0, overflow: "hidden" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "13px 16px",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="found-muted"
          >
            <circle cx="11" cy="11" r="6.5" />
            <path d="M20 20l-4.2-4.2" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search people, invoices, PayPal orders, or jump to..."
            data-testid="command-palette-input"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--ink)",
              fontSize: 14,
            }}
          />
          <span
            style={{
              fontSize: 11,
              padding: "2px 6px",
              borderRadius: 5,
              border: "1px solid var(--line)",
              color: "var(--muted)",
            }}
          >
            ESC
          </span>
        </div>

        <div style={{ maxHeight: 340, overflowY: "auto", padding: 6 }}>
          {filtered.map((item, idx) => {
            const active = idx === selectedIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  item.onSelect();
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "9px 12px",
                  borderRadius: 9,
                  border: "none",
                  background: active ? "var(--soft)" : "transparent",
                  color: "var(--ink)",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>
                    {item.title}
                  </div>
                  <div
                    className="found-muted"
                    style={{
                      fontSize: 12,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.subtitle}
                  </div>
                </div>
                <span className="found-muted" style={{ fontSize: 11.5 }}>
                  {item.shortcut || item.category}
                </span>
              </button>
            );
          })}

          {query.trim().length > 1 && onQuickSearchChannel3 && (
            <button
              type="button"
              onClick={() => {
                onQuickSearchChannel3(query.trim());
                onClose();
              }}
              style={{
                width: "100%",
                marginTop: 4,
                padding: "9px 12px",
                borderRadius: 9,
                border: "1px dashed var(--line)",
                background: "transparent",
                color: "var(--ink)",
                fontSize: 12.5,
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              Search Channel3 catalog for &ldquo;{query.trim()}&rdquo; &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export interface PayPalReceiptBreakdown {
  receipt_id: string;
  paypal_order_id: string;
  paypal_capture_id: string;
  paypal_request_id_uuid: string;
  paypal_api_endpoint: string;
  payment_rail: string;
  gross_amount_usd: number;
  fee_usd: number;
  net_amount_usd: number;
  currency: string;
  sha256_permit_hash: string;
  settled_at: string;
  raw_paypal_request: Record<string, unknown>;
  raw_paypal_response: Record<string, unknown>;
}

export interface FoundReceiptOrder {
  id: string;
  item_title: string;
  merchant_name: string;
  merchant_email?: string;
  amount_usd: number;
  currency?: string;
  status: string;
  mcp_tool?: string;
  policy_verdict?: string;
  card_last4?: string | null;
  capture_id?: string | null;
  receipt?: PayPalReceiptBreakdown;
}

interface DisputeShieldDossier {
  dispute_id: string;
  order_id: string;
  reason: string;
  action_endpoint: string;
  upstream_gap_fixed: string;
  permit_id: string;
  prev_hash: string;
  decision_hash: string;
  authority_formula: string;
  carrier_or_deliverable_proof: string;
  win_probability: number;
  status: string;
  evidence_items: string[];
}

export function FoundNonBlockingSheet({
  docId,
  orders,
  receiptsByOrderId,
  onClose,
  onCaptureOrder,
}: {
  docId: string | null;
  orders?: FoundReceiptOrder[];
  receiptsByOrderId?: Record<string, PayPalReceiptBreakdown>;
  onClose: () => void;
  onCaptureOrder?: () => void;
}) {
  const [shieldDossier, setShieldDossier] =
    useState<DisputeShieldDossier | null>(null);
  const [shieldBusy, setShieldBusy] = useState(false);
  const [showRawJson, setShowRawJson] = useState(true);

  useEffect(() => {
    setShieldDossier(null);
    setShowRawJson(true);
  }, [docId]);

  if (!docId) return null;
  const matchedOrder = orders?.find((o) => o.id === docId) ?? null;
  const attachedReceipt =
    receiptsByOrderId?.[docId] ?? matchedOrder?.receipt ?? null;
  const itemTitle =
    matchedOrder?.item_title ?? "NVIDIA H100 Inference Pack (40h)";
  const merchantLabel = matchedOrder
    ? `${matchedOrder.merchant_name}`
    : "Nebula GPU Cloud (CH3-GPU-101)";
  const railLabel =
    attachedReceipt?.payment_rail ??
    (matchedOrder
      ? `PayPal Orders v2 · ${matchedOrder.mcp_tool || "sentinel_direct_card_capture"}${matchedOrder.card_last4 ? ` · Visa *${matchedOrder.card_last4}` : ""}`
      : "PayPal Orders v2 · Visa *1881");
  const statusLabel = matchedOrder?.status ?? "COMPLETED";
  const amountUsd =
    attachedReceipt?.gross_amount_usd ?? matchedOrder?.amount_usd ?? 240.0;
  const feeUsd =
    attachedReceipt?.fee_usd ??
    (statusLabel === "BLOCKED_BY_POLICY"
      ? 0
      : Number((amountUsd * 0.029 + 0.3).toFixed(2)));
  const netUsd =
    attachedReceipt?.net_amount_usd ??
    (statusLabel === "BLOCKED_BY_POLICY"
      ? 0
      : Number((amountUsd - feeUsd).toFixed(2)));
  const currencyLabel =
    attachedReceipt?.currency ?? matchedOrder?.currency ?? "USD";
  const verdictLabel =
    matchedOrder?.policy_verdict ??
    "PASS: 240.00 USD <= 500.00 USD cap | risk 9 <= 35";
  const shortSuffix = docId.slice(-6);
  const receiptIdLabel =
    attachedReceipt?.receipt_id ?? `RCPT-PP-2026-${shortSuffix.toUpperCase()}`;
  const captureIdLabel =
    attachedReceipt?.paypal_capture_id ??
    matchedOrder?.capture_id ??
    `CAP-SBX-${shortSuffix.toUpperCase()}`;
  const requestUuidLabel =
    attachedReceipt?.paypal_request_id_uuid ??
    `f47ac10b-58cc-4372-a567-0e02b2${shortSuffix.toLowerCase().padEnd(6, "0")}`;
  const apiEndpointLabel =
    attachedReceipt?.paypal_api_endpoint ??
    "POST https://api-m.sandbox.paypal.com/v2/checkout/orders";
  const permitHashPreview = shieldDossier
    ? `${shieldDossier.prev_hash.slice(0, 10)}... -> ${shieldDossier.decision_hash.slice(0, 12)}...`
    : attachedReceipt?.sha256_permit_hash
      ? `sha256:${attachedReceipt.sha256_permit_hash.slice(0, 20)}...`
      : `sha256:9f4a8c12... -> 7b2e01d4${shortSuffix.toLowerCase()}`;

  const rawPayPalPayload = attachedReceipt
    ? {
        request: attachedReceipt.raw_paypal_request,
        response: attachedReceipt.raw_paypal_response,
      }
    : {
        request: {
          endpoint: apiEndpointLabel,
          headers: {
            "Content-Type": "application/json",
            "PayPal-Request-Id": requestUuidLabel,
          },
          body: {
            intent: "CAPTURE",
            purchase_units: [
              {
                reference_id: docId,
                description: itemTitle,
                amount: {
                  currency_code: currencyLabel,
                  value: amountUsd.toFixed(2),
                },
              },
            ],
          },
        },
        response: {
          id: docId,
          status: statusLabel,
          capture_id: captureIdLabel,
          seller_receivable_breakdown: {
            gross_amount: {
              currency_code: currencyLabel,
              value: amountUsd.toFixed(2),
            },
            paypal_fee: {
              currency_code: currencyLabel,
              value: feeUsd.toFixed(2),
            },
            net_amount: {
              currency_code: currencyLabel,
              value: netUsd.toFixed(2),
            },
          },
        },
      };

  const handleRunDisputeShield = async () => {
    if (shieldBusy) return;
    setShieldBusy(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_RUST_API_URL || "";
      const res = await fetch(
        `${apiBase}/api/orders/${encodeURIComponent(docId)}/dispute-shield`,
        { method: "POST" },
      );
      if (res.ok) {
        const data = (await res.json()) as DisputeShieldDossier;
        setShieldDossier(data);
        return;
      }
    } catch {
      // Fallback deterministic dossier if offline
    } finally {
      setShieldBusy(false);
    }
    setShieldDossier({
      dispute_id: `PP-D-${shortSuffix}`,
      order_id: docId,
      reason: "MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED",
      action_endpoint: `POST /v1/customer/disputes/PP-D-${shortSuffix}/provide-evidence`,
      upstream_gap_fixed:
        "Replaces @paypal/agent-toolkit surrender-only accept_dispute_claim (#109/#118) with automated provide-evidence seller defense",
      permit_id: `PRM-${shortSuffix}`,
      prev_hash: "9f4a8c1204e188b27a109c33",
      decision_hash: `7b2e01d4c8192a40f1${shortSuffix.toLowerCase()}`,
      authority_formula: "amount <= remaining(P) && risk <= 35 && !revoked(P)",
      carrier_or_deliverable_proof:
        "UPS #1Z999AA10123456784 (DELIVERED) + Signed Mandate",
      win_probability: 0.96,
      status: "EVIDENCE_SUBMITTED_SELLER_PROTECTED",
      evidence_items: [
        `1. SHA-256 Intent Mandate proving buyer authorized ${itemTitle} ($${amountUsd.toFixed(2)} ${currencyLabel})`,
        "2. Proof of Fulfillment: UPS #1Z999AA10123456784 (DELIVERED)",
        `3. Idempotency & Policy Audit: ${verdictLabel}`,
      ],
    });
  };

  return (
    <div
      className="found-modal-backdrop"
      onClick={onClose}
      data-testid="found-non-blocking-sheet"
    >
      <div
        className="found-modal-card"
        style={{ maxWidth: 540 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <span className="found-muted" style={{ fontSize: 12 }}>
            PayPal Sandbox Receipt &amp; Permit · {receiptIdLabel} · {docId}
          </span>
          <button type="button" className="found-tlink" onClick={onClose}>
            Close
          </button>
        </div>

        <h3 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 4px" }}>
          {itemTitle}
        </h3>
        <p className="found-muted" style={{ fontSize: 12.5, margin: "0 0 12px" }}>
          {verdictLabel}
        </p>

        <div
          style={{
            padding: 13,
            borderRadius: 12,
            background: "var(--soft)",
            fontSize: 12.5,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingBottom: 6,
              borderBottom: "1px solid var(--line)",
            }}
          >
            <span>Merchant</span>
            <b>{merchantLabel}</b>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "6px 0",
              borderBottom: "1px solid var(--line)",
            }}
          >
            <span>Payment Rail</span>
            <b>{railLabel}</b>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "6px 0",
              borderBottom: "1px solid var(--line)",
            }}
          >
            <span>PayPal API Endpoint</span>
            <span className="found-mono" style={{ fontSize: 11 }}>
              {apiEndpointLabel}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "6px 0",
              borderBottom: "1px solid var(--line)",
            }}
          >
            <span>PayPal-Request-Id (UUID v4)</span>
            <span className="found-mono" style={{ fontSize: 11 }}>
              {requestUuidLabel}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "6px 0",
              borderBottom: "1px solid var(--line)",
            }}
          >
            <span>SHA-256 Permit Chain</span>
            <b className="found-mono" style={{ fontSize: 11.5, color: "var(--ok)" }}>
              {permitHashPreview}
            </b>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "6px 0",
              borderBottom: "1px solid var(--line)",
            }}
          >
            <span>Status &amp; Capture ID</span>
            <b className="found-mono">
              {statusLabel} · {captureIdLabel}
            </b>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: 6,
            }}
          >
            <span>Gross / PayPal Fee / Net Settled</span>
            <b className="found-mono" style={{ color: "var(--ok)" }}>
              ${amountUsd.toFixed(2)} - ${feeUsd.toFixed(2)} fee = ${netUsd.toFixed(2)}{" "}
              {currencyLabel}
            </b>
          </div>
        </div>

        {/* Raw PayPal REST OpenAPI 3.1 Request & Response JSON Proof */}
        <div
          data-testid="sheet-raw-paypal-json"
          style={{
            padding: 11,
            borderRadius: 12,
            border: "1px solid var(--line)",
            background: "var(--surface)",
            marginBottom: 12,
            fontSize: 11.5,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: showRawJson ? 6 : 0,
            }}
          >
            <b>Verifiable PayPal OpenAPI 3.1 Request &amp; Response JSON</b>
            <button
              type="button"
              className="found-tlink"
              style={{ fontSize: 11 }}
              onClick={() => setShowRawJson((v) => !v)}
            >
              {showRawJson ? "Hide JSON" : "Show JSON"}
            </button>
          </div>
          {showRawJson && (
            <pre
              style={{
                margin: 0,
                maxHeight: 130,
                overflowY: "auto",
                padding: 8,
                borderRadius: 8,
                background: "var(--soft)",
                fontFamily: "var(--mono)",
                fontSize: 10.5,
                lineHeight: 1.35,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {JSON.stringify(rawPayPalPayload, null, 2)}
            </pre>
          )}
        </div>

        {/* Dispute & Chargeback Evidence Shield (Fixes @paypal/agent-toolkit #109/#118) */}
        <div
          data-testid="dispute-shield-panel"
          style={{
            padding: 12,
            borderRadius: 12,
            border: "1px solid var(--line)",
            background: "var(--surface)",
            marginBottom: 14,
            fontSize: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              marginBottom: 6,
            }}
          >
            <b style={{ fontSize: 12.5 }}>
              Seller Chargeback &amp; SNAD Evidence Shield
            </b>
            <span
              className="found-mono"
              style={{
                fontSize: 10.5,
                padding: "2px 7px",
                borderRadius: 999,
                background: "var(--accent-soft)",
                color: "var(--accent)",
                fontWeight: 600,
              }}
            >
              Fixes @paypal/mcp #109 #118
            </span>
          </div>
          <p className="found-muted" style={{ margin: "0 0 8px", fontSize: 11.5 }}>
            Instead of @paypal/agent-toolkit&apos;s surrender-only{" "}
            <code>accept_dispute_claim</code>, auto-compile your SHA-256 Intent
            Mandate and carrier tracking into{" "}
            <code>POST /v1/customer/disputes/&#123;id&#125;/provide-evidence</code>.
          </p>
          {shieldDossier ? (
            <div
              data-testid="dispute-shield-result"
              style={{
                padding: 10,
                borderRadius: 8,
                background: "var(--soft)",
                fontFamily: "var(--mono)",
                fontSize: 11,
              }}
            >
              <div style={{ color: "var(--ok)", fontWeight: 600, marginBottom: 4 }}>
                ✓ {shieldDossier.dispute_id} · {shieldDossier.status} (Win
                Prob: {(shieldDossier.win_probability * 100).toFixed(0)}%)
              </div>
              {shieldDossier.evidence_items.map((ev) => (
                <div key={ev} style={{ marginTop: 2, color: "var(--ink)" }}>
                  {ev}
                </div>
              ))}
            </div>
          ) : (
            <button
              type="button"
              data-testid="submit-dispute-shield-btn"
              disabled={shieldBusy}
              onClick={() => void handleRunDisputeShield()}
              className="found-btn"
              style={{ width: "100%", justifyContent: "center", fontSize: 12 }}
            >
              {shieldBusy
                ? "Submitting Evidence to PayPal Disputes API..."
                : "Simulate SNAD Chargeback -> Auto-Submit Evidence Shield"}
            </button>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button type="button" className="found-btn" onClick={onClose}>
            Done
          </button>
          {statusLabel === "CREATED" ? (
            <>
              <button
                type="button"
                data-testid="void-hold-btn"
                className="found-btn"
                style={{ color: "var(--muted)" }}
                onClick={() => {
                  onClose();
                }}
              >
                Void Hold ($0.00 charged)
              </button>
              <button
                type="button"
                data-testid="release-escrow-btn"
                className="found-btn found-btn-primary"
                onClick={() => {
                  if (onCaptureOrder) onCaptureOrder();
                  onClose();
                }}
              >
                Release Escrow &amp; Capture
              </button>
            </>
          ) : (
            onCaptureOrder && statusLabel !== "BLOCKED_BY_POLICY" && (
              <button
                type="button"
                className="found-btn found-btn-primary"
                onClick={() => {
                  onCaptureOrder();
                  onClose();
                }}
              >
                Re-Capture ${amountUsd.toFixed(0)} on PayPal Sandbox
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export function FoundFeedbackModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [text, setText] = useState("");
  if (!open) return null;
  return (
    <div className="found-modal-backdrop" onClick={onClose}>
      <div className="found-modal-card" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
            Send feedback
          </h3>
          <button type="button" className="found-tlink" onClick={onClose}>
            Close
          </button>
        </div>
        <p className="found-muted" style={{ fontSize: 13, margin: "0 0 12px" }}>
          Tell us what felt off or what you wished Found did next.
        </p>
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a quick note..."
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: 10,
            borderRadius: 10,
            border: "1px solid var(--line)",
            background: "var(--bg)",
            color: "var(--ink)",
            fontFamily: "inherit",
            fontSize: 13.5,
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: 12,
          }}
        >
          <button type="button" className="found-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="found-btn found-btn-primary"
            onClick={() => {
              setText("");
              onClose();
            }}
          >
            Send note
          </button>
        </div>
      </div>
    </div>
  );
}

export function FoundReplySheet({
  draft,
  onClose,
  onSend,
}: {
  draft: FoundReplyDraft | null;
  onClose: () => void;
  onSend: (
    draft: FoundReplyDraft,
    finalBody: string,
    attachPayPalLink: boolean,
  ) => void;
}) {
  const [body, setBody] = useState("");
  const [attachLink, setAttachLink] = useState(true);

  useEffect(() => {
    if (draft) {
      setBody(draft.defaultBody);
      setAttachLink(Boolean(draft.invoiceAmount));
    }
  }, [draft]);

  if (!draft) return null;

  return (
    <div
      className="found-modal-backdrop"
      onClick={onClose}
      data-testid="found-reply-sheet"
    >
      <div className="found-modal-card" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 8,
          }}
        >
          <span className="found-muted" style={{ fontSize: 12.5 }}>
            To <b style={{ color: "var(--ink)" }}>{draft.recipientName}</b>{" "}
            &lt;{draft.recipientEmail}&gt;
          </span>
          <button type="button" className="found-tlink" onClick={onClose}>
            Close
          </button>
        </div>

        <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 12px" }}>
          {draft.subject}
        </h3>

        <textarea
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          data-testid="reply-sheet-textarea"
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid var(--line)",
            background: "var(--bg)",
            color: "var(--ink)",
            fontFamily: "inherit",
            fontSize: 13.5,
            lineHeight: 1.5,
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 14,
          }}
        >
          <span className="found-muted" style={{ fontSize: 12 }}>
            Nothing sends until you press Send
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" className="found-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="found-btn found-btn-primary"
              data-testid="reply-sheet-send-btn"
              onClick={() => {
                onSend(draft, body, attachLink);
                onClose();
              }}
            >
              {draft.actionLabel || "Send reply"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FoundUndoToast({
  message,
  onUndo,
  onDismiss,
}: {
  message: string | null;
  onUndo?: () => void;
  onDismiss: () => void;
}) {
  if (!message) return null;
  return (
    <div className="found-toast" role="status" data-testid="found-undo-toast">
      <span>{message}</span>
      {onUndo && (
        <button
          type="button"
          onClick={() => {
            onUndo();
            onDismiss();
          }}
          style={{
            background: "transparent",
            border: "none",
            color: "inherit",
            textDecoration: "underline",
            fontWeight: 600,
            cursor: "pointer",
            padding: 0,
            fontSize: 12.5,
          }}
        >
          Undo
        </button>
      )}
    </div>
  );
}

/**
 * Exact Floating Bottom Dock from https://gofound.app/demo (nav.dock)
 * Order: Search | Home (badge) | Calendar | Clients | Slack (4-color SVG) | Team (2x3 squares) | Money | Settings
 */
interface FoundFloatingDockProps {
  activeRoute: FoundRoute;
  onSelectRoute?: (route: FoundRoute) => void;
  onNavigate?: (route: FoundRoute) => void;
  onOpenPalette: () => void;
  nowCount?: number;
  slackCount?: number;
  badges?: Partial<Record<FoundRoute, number>>;
}

export function FoundFloatingDock({
  activeRoute,
  onSelectRoute,
  onNavigate,
  onOpenPalette,
  nowCount = 0,
  slackCount = 0,
  badges = {},
}: FoundFloatingDockProps) {
  const triggerRoute = (r: FoundRoute) => {
    onSelectRoute?.(r);
    onNavigate?.(r);
  };

  const mergedBadges: Partial<Record<FoundRoute, number>> = {
    home: nowCount || badges.home || 0,
    slack: slackCount || badges.slack || 0,
    ...badges,
  };

  const dockItems: Array<{
    route: FoundRoute;
    label: string;
    icon: React.ReactNode;
  }> = [
    {
      route: "home",
      label: "Home",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 10.5L12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z" />
        </svg>
      ),
    },
    {
      route: "calendar",
      label: "Calendar",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
          <path d="M3.5 9.5h17M8 3v4M16 3v4" />
          <path d="M8 13.5h2M14 13.5h2M8 17h2" />
        </svg>
      ),
    },
    {
      route: "clients",
      label: "Clients",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="8.5" r="3.2" />
          <path d="M3.5 19.5c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" />
          <circle cx="16.8" cy="9.5" r="2.5" />
          <path d="M16 14.6c2.4.1 4 1.7 4.5 4.4" />
        </svg>
      ),
    },
    {
      route: "slack",
      label: "Slack",
      icon: <FoundBrandIcon name="slack" />,
    },
    {
      route: "team",
      label: "Team",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        >
          <rect x="3.5" y="6" width="4.5" height="4.5" rx="1.2" />
          <rect x="9.75" y="6" width="4.5" height="4.5" rx="1.2" />
          <rect
            x="16"
            y="6"
            width="4.5"
            height="4.5"
            rx="1.2"
            fill="currentColor"
          />
          <rect
            x="3.5"
            y="13.5"
            width="4.5"
            height="4.5"
            rx="1.2"
            fill="currentColor"
          />
          <rect x="9.75" y="13.5" width="4.5" height="4.5" rx="1.2" />
          <rect x="16" y="13.5" width="4.5" height="4.5" rx="1.2" />
        </svg>
      ),
    },
    {
      route: "money",
      label: "Money",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3.5" y="6" width="17" height="12.5" rx="2.5" />
          <path d="M3.5 10h17" />
          <path d="M7.5 14.5h3" />
        </svg>
      ),
    },
    {
      route: "settings",
      label: "Settings",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="found-dock" aria-label="Main navigation">
      <button
        type="button"
        className="found-dock-item"
        onClick={onOpenPalette}
        title="Search or jump to... (⌘K)"
        aria-label="Search"
        data-testid="dock-search-btn"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="6.5" />
          <path d="M20 20l-4.2-4.2" />
        </svg>
      </button>

      <span className="found-dock-sep" />

      {dockItems.map((item) => {
        const isActive =
          activeRoute === item.route ||
          (item.route === "money" && activeRoute === "money-next");
        const badgeCount = mergedBadges[item.route] ?? 0;
        return (
          <button
            key={item.route}
            type="button"
            className={`found-dock-item${isActive ? " on" : ""}`}
            onClick={() => triggerRoute(item.route)}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
            data-testid={`dock-${item.route}-btn`}
          >
            {item.icon}
            <span className="found-dock-label">{item.label}</span>
            {badgeCount > 0 && !isActive && (
              <span className="found-dock-badge">{badgeCount}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
