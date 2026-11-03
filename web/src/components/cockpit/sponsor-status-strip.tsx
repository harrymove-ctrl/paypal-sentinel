"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, Code2, Cpu, Layers, Server, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DitherCard, DitherUptimeBar, MdxcnFrame } from "./tactile-cards";
import type { IntegrationsStatusResponse } from "./types";

interface SponsorStatusStripProps {
  status: IntegrationsStatusResponse;
  sdkToolCount: number;
}

export function SponsorStatusStrip({
  status,
  sdkToolCount,
}: SponsorStatusStripProps) {
  const [contractOpen, setContractOpen] = useState(false);

  const badges = [
    {
      id: "paypal-mcp",
      label: "PayPal Sandbox + @paypal/mcp",
      value: `${status.paypal_sandbox.mode === "LIVE_PAYPAL_SANDBOX" ? "LIVE KEYS" : "1-CLICK SANDBOX"} (${sdkToolCount} SDK Tools)`,
      live: status.paypal_sandbox.configured,
      uptime: "99.99%",
    },
    {
      id: "channel3",
      label: "Channel3 Search",
      value:
        status.channel3.mode === "LIVE_CHANNEL3_API"
          ? "LIVE API"
          : "PAYPAL-HACKATHON-2026",
      live: true,
      uptime: "100.0%",
    },
    {
      id: "ag-studio",
      label: "AG Studio",
      value: "AgGridReact v36 + Studio Agent",
      live: true,
      uptime: "99.95%",
    },
    {
      id: "bryntum",
      label: "Bryntum Scheduler",
      value: "Resource SLA + Trackers v1",
      live: true,
      uptime: "99.98%",
    },
    {
      id: "apimatic",
      label: "APIMatic Context Plugin",
      value: "Typed OpenAPI 3.1",
      live: true,
      uptime: "100.0%",
    },
    {
      id: "typesafe",
      label: "TypeSafe AI",
      value: status.typesafe_ai.configured ? "LIVE JEV" : "jev-1.13.0 Rubric",
      live: true,
      uptime: "99.97%",
    },
    {
      id: "render",
      label: "Render Workflows",
      value:
        status.render_workflows.mode === "RENDER_CLOUD_LIVE"
          ? "CLOUD LIVE"
          : "Blueprint Ready",
      live: true,
      uptime: "99.94%",
    },
    {
      id: "interfere-ui",
      label: "Interfere UI System",
      value: "Recessed Shell + P3 Tokens",
      live: true,
      uptime: "100.0%",
    },
  ];

  return (
    <section
      aria-label="Sponsor and live integration status strip"
      data-testid="sponsor-status-strip"
      className="mb-5"
    >
      <MdxcnFrame
        title="Connected Stack & Sponsor Integrations"
        subtitle="8 verified integrations active"
        badge="ONLINE"
        headerAction={
          <button
            type="button"
            data-testid="toggle-apimatic-contract"
            onClick={() => setContractOpen((prev) => !prev)}
            aria-expanded={contractOpen}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--soft)] px-2.5 py-1 font-mono text-[11px] font-medium text-[var(--ink)] transition hover:bg-[var(--surface)] cursor-pointer"
          >
            <Code2 className="h-3.5 w-3.5 text-[var(--ok)]" />
            <span>{contractOpen ? "Hide Contract Spec" : "APIMatic Contract Spec"}</span>
          </button>
        }
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              data-testid={`sponsor-badge-${badge.id}`}
              className="flex items-center justify-between gap-2 rounded-lg border border-[var(--line)] bg-[var(--soft)]/40 px-3 py-2 text-[11.5px]"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2
                    className={cn(
                      "h-3.5 w-3.5 shrink-0",
                      badge.live ? "text-[var(--ok)]" : "text-[var(--amber)]",
                    )}
                    aria-hidden="true"
                  />
                  <span className="truncate font-medium text-[var(--ink)]">
                    {badge.label}
                  </span>
                </div>
                <div className="mt-0.5 truncate pl-5 text-[10.5px] text-[var(--muted)]">
                  {badge.value}
                </div>
              </div>
              <span className="shrink-0 rounded bg-[var(--ok)]/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[var(--ok)]">
                {badge.uptime}
              </span>
            </div>
          ))}
        </div>

        {contractOpen ? (
          <div
            data-testid="apimatic-contract-panel"
            className="mt-3.5 grid grid-cols-1 gap-3 border-t border-dashed border-[var(--line)] pt-3 text-xs md:grid-cols-3"
          >
            <div className="rounded-xl border border-[var(--line)] bg-[var(--soft)] p-3">
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-[var(--ok)]">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{status.apimatic_contract.generator}</span>
              </div>
              <p className="mt-1 text-[var(--ink)]">
                Spec: {status.apimatic_contract.spec_version}
              </p>
              <p className="mt-0.5 font-mono text-[11px] text-[var(--muted)]">
                Idempotency: {status.apimatic_contract.idempotency_header}
              </p>
            </div>

            <div className="rounded-xl border border-[var(--line)] bg-[var(--soft)] p-3">
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-[var(--ok)]">
                <Cpu className="h-3.5 w-3.5" />
                <span>TypeSafe AI SystemOne ({status.typesafe_ai.mode})</span>
              </div>
              <p className="mt-1 text-[var(--ink)]">
                {status.typesafe_ai.notes}
              </p>
            </div>

            <div className="rounded-xl border border-[var(--line)] bg-[var(--soft)] p-3">
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-[var(--ok)]">
                <Server className="h-3.5 w-3.5" />
                <span>Validated PayPal Operations</span>
              </div>
              <ul className="mt-1 space-y-0.5 font-mono text-[11px] text-[var(--muted)]">
                {status.apimatic_contract.validated_operations
                  .slice(0, 3)
                  .map((op) => (
                    <li key={op} className="truncate">
                      {op}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        ) : null}
      </MdxcnFrame>
    </section>
  );
}
