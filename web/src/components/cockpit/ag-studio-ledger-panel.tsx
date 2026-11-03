"use client";

import { cn } from "@/lib/utils";
import {
  AllCommunityModule,
  type ColDef,
  type ICellRendererParams,
  ModuleRegistry,
  colorSchemeDark,
  colorSchemeLight,
  themeQuartz,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { BarChart3, Download, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import type { PayPalOrderRecord } from "./types";

ModuleRegistry.registerModules([AllCommunityModule]);

interface AgStudioLedgerPanelProps {
  orders: PayPalOrderRecord[];
  isDark: boolean;
  ledgerFilter: string;
  onLedgerFilterChange: (value: string) => void;
  onExportCsv: () => void;
}

type StudioViewMode =
  | "merchant_completed_vs_blocked"
  | "high_risk_and_disputed"
  | "mcp_tool_breakdown"
  | "direct_card_captures";

const STUDIO_PROMPTS: ReadonlyArray<{
  id: StudioViewMode;
  prompt: string;
  badge: string;
}> = [
  {
    id: "merchant_completed_vs_blocked",
    prompt: "Show completed vs blocked spend by merchant",
    badge: "Merchant Spend vs Blocked",
  },
  {
    id: "high_risk_and_disputed",
    prompt: "Highlight high-risk or disputed orders requiring review",
    badge: "Risk & Dispute Anomaly",
  },
  {
    id: "mcp_tool_breakdown",
    prompt: "Summarize settled volume by @paypal/mcp tool",
    badge: "MCP Tool Volume",
  },
  {
    id: "direct_card_captures",
    prompt: "Show headless ACDC card 1881 captures under $300",
    badge: "ACDC Card 1881 Captures",
  },
];

export function AgStudioLedgerPanel({
  orders,
  isDark,
  ledgerFilter,
  onLedgerFilterChange,
  onExportCsv,
}: AgStudioLedgerPanelProps) {
  const [studioPrompt, setStudioPrompt] = useState<string>(
    STUDIO_PROMPTS[0].prompt,
  );
  const [studioMode, setStudioMode] = useState<StudioViewMode>(
    "merchant_completed_vs_blocked",
  );

  const applyStudioPrompt = (rawPrompt: string) => {
    setStudioPrompt(rawPrompt);
    const q = rawPrompt.toLowerCase();
    if (q.includes("risk") || q.includes("disput")) {
      setStudioMode("high_risk_and_disputed");
    } else if (q.includes("mcp") || q.includes("tool")) {
      setStudioMode("mcp_tool_breakdown");
    } else if (q.includes("card") || q.includes("1881") || q.includes("300")) {
      setStudioMode("direct_card_captures");
    } else {
      setStudioMode("merchant_completed_vs_blocked");
    }
  };

  const studioSummary = useMemo(() => {
    const completedUsd = orders
      .filter((o) => o.status === "COMPLETED")
      .reduce((acc, o) => acc + o.amount_usd, 0);
    const blockedUsd = orders
      .filter((o) => o.status === "BLOCKED_BY_POLICY")
      .reduce((acc, o) => acc + o.amount_usd, 0);
    const disputedOrHighRisk = orders.filter(
      (o) => o.status === "DISPUTED" || o.risk_score > 35,
    );
    const acdcCaptures = orders.filter(
      (o) => o.card_last4 === "1881" && o.amount_usd <= 300,
    );

    const byMerchant = new Map<
      string,
      { completed: number; blocked: number; count: number }
    >();
    for (const o of orders) {
      const current = byMerchant.get(o.merchant_name) ?? {
        completed: 0,
        blocked: 0,
        count: 0,
      };
      if (o.status === "BLOCKED_BY_POLICY") {
        current.blocked += o.amount_usd;
      } else {
        current.completed += o.amount_usd;
      }
      current.count += 1;
      byMerchant.set(o.merchant_name, current);
    }

    const byTool = new Map<string, { volume: number; count: number }>();
    for (const o of orders) {
      const current = byTool.get(o.mcp_tool) ?? { volume: 0, count: 0 };
      current.volume += o.amount_usd;
      current.count += 1;
      byTool.set(o.mcp_tool, current);
    }

    const merchantRows = Array.from(byMerchant.entries()).map(
      ([merchant, stats]) => ({
        label: merchant,
        primaryUsd: stats.completed,
        secondaryUsd: stats.blocked,
        count: stats.count,
      }),
    );

    const toolRows = Array.from(byTool.entries()).map(([tool, stats]) => ({
      label: tool,
      primaryUsd: stats.volume,
      secondaryUsd: 0,
      count: stats.count,
    }));

    return {
      completedUsd,
      blockedUsd,
      disputedCount: disputedOrHighRisk.length,
      acdcCount: acdcCaptures.length,
      acdcUsd: acdcCaptures.reduce((a, b) => a + b.amount_usd, 0),
      merchantRows,
      toolRows,
    };
  }, [orders]);

  const displayedOrders = useMemo(() => {
    if (studioMode === "high_risk_and_disputed") {
      const subset = orders.filter(
        (o) => o.status === "DISPUTED" || o.risk_score > 35,
      );
      return subset.length > 0 ? subset : orders;
    }
    if (studioMode === "direct_card_captures") {
      const subset = orders.filter(
        (o) => o.card_last4 === "1881" && o.amount_usd <= 300,
      );
      return subset.length > 0 ? subset : orders;
    }
    return orders;
  }, [orders, studioMode]);

  const gridTheme = useMemo(
    () =>
      isDark
        ? themeQuartz.withPart(colorSchemeDark)
        : themeQuartz.withPart(colorSchemeLight),
    [isDark],
  );

  const columnDefs = useMemo<ColDef<PayPalOrderRecord>[]>(
    () => [
      {
        field: "id",
        headerName: "PayPal Order ID",
        minWidth: 195,
        sortable: true,
        filter: true,
        cellRenderer: (params: ICellRendererParams<PayPalOrderRecord>) => {
          const row = params.data;
          if (!row) return null;
          return (
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-700 tabular-nums dark:text-[#95f965]">
              <span>{row.id}</span>
              {row.card_last4 ? (
                <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px]">
                  *{row.card_last4}
                </span>
              ) : null}
            </div>
          );
        },
      },
      {
        field: "merchant_name",
        headerName: "Merchant",
        minWidth: 175,
        flex: 1,
        sortable: true,
        filter: true,
      },
      {
        field: "item_title",
        headerName: "Catalog Item",
        minWidth: 210,
        flex: 1.2,
        sortable: true,
        filter: true,
      },
      {
        field: "mcp_tool",
        headerName: "MCP / Agent Tool",
        minWidth: 185,
        sortable: true,
        filter: true,
        cellRenderer: (params: ICellRendererParams<PayPalOrderRecord>) => (
          <span className="font-mono text-[11px] text-slate-600 dark:text-zinc-300">
            {params.value}
          </span>
        ),
      },
      {
        field: "amount_usd",
        headerName: "Amount (USD)",
        minWidth: 130,
        sortable: true,
        filter: "agNumberColumnFilter",
        cellRenderer: (params: ICellRendererParams<PayPalOrderRecord>) => {
          const val = Number(params.value ?? 0);
          return (
            <span className="font-mono text-xs font-bold tabular-nums">
              ${val.toFixed(2)}
            </span>
          );
        },
      },
      {
        field: "risk_score",
        headerName: "Risk",
        minWidth: 100,
        sortable: true,
        filter: "agNumberColumnFilter",
        cellRenderer: (params: ICellRendererParams<PayPalOrderRecord>) => {
          const score = Number(params.value ?? 0);
          const high = score > 35;
          return (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums",
                high
                  ? "bg-rose-500/20 text-rose-600 dark:text-rose-300"
                  : "bg-slate-200/80 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300",
              )}
            >
              {score}/100
            </span>
          );
        },
      },
      {
        field: "status",
        headerName: "Status",
        minWidth: 165,
        sortable: true,
        filter: true,
        cellRenderer: (params: ICellRendererParams<PayPalOrderRecord>) => {
          const status = String(params.value ?? "");
          const isBlocked = status === "BLOCKED_BY_POLICY";
          const isDisputed = status === "DISPUTED";
          return (
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold",
                isBlocked
                  ? "bg-rose-500/20 text-rose-700 dark:text-rose-300"
                  : isDisputed
                    ? "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                    : "bg-emerald-500/15 text-emerald-800 dark:text-[#95f965]",
              )}
            >
              {status}
            </span>
          );
        },
      },
      {
        headerName: "TypeSafe Jev",
        minWidth: 155,
        sortable: false,
        cellRenderer: (params: ICellRendererParams<PayPalOrderRecord>) => {
          const de = params.data?.decision_engine;
          if (!de) {
            return <span className="font-mono text-[11px]">APPROVE (0.94)</span>;
          }
          return (
            <span className="font-mono text-[11px] tabular-nums">
              {de.verdict} ({de.approval_probability.toFixed(2)})
            </span>
          );
        },
      },
    ],
    [],
  );

  const activeWidgetRows =
    studioMode === "mcp_tool_breakdown"
      ? studioSummary.toolRows
      : studioSummary.merchantRows;

  return (
    <section
      aria-label="Enterprise PayPal transaction ledger grid"
      data-testid="ag-studio-ledger-section"
      className="mt-7 space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/90"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-950 dark:text-white">
              AG Studio Enterprise Financial Telemetry Grid
            </h1>
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 font-mono text-[11px] font-bold text-emerald-800 dark:text-[#95f965]">
              AgGridReact v36
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-600 dark:text-zinc-400">
            Interactive AG Grid with natural-language Studio Agent KPI cards, sorting, column filtering, and CSV export.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            data-testid="ag-quick-filter"
            placeholder="Quick filter order, merchant, status..."
            value={ledgerFilter}
            onChange={(e) => onLedgerFilterChange(e.target.value)}
            className="min-h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
          />
          <button
            type="button"
            data-testid="export-csv-btn"
            onClick={onExportCsv}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-[#95f965] px-3.5 py-2 text-xs font-bold text-black hover:bg-[#82ea52]"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* AG Studio Self-Serve Natural-Language Agent Prompt Bar */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-600 dark:text-[#95f965]" />
            <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
              AG STUDIO SELF-SERVE KPI AGENT
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-500 dark:text-zinc-400">
            Active Lens: {studioMode.replaceAll("_", " ")}
          </span>
        </div>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            data-testid="ag-studio-prompt-input"
            value={studioPrompt}
            onChange={(e) => setStudioPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                applyStudioPrompt(studioPrompt);
              }
            }}
            placeholder="Ask AG Studio Agent: Show completed vs blocked spend by merchant"
            className="min-h-10 flex-1 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
          <button
            type="button"
            data-testid="ag-studio-prompt-submit"
            onClick={() => applyStudioPrompt(studioPrompt)}
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-[#95f965] dark:text-black dark:hover:bg-[#82ea52]"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Synthesize Studio KPIs
          </button>
        </div>

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {STUDIO_PROMPTS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              data-testid={`studio-chip-${preset.id}`}
              onClick={() => applyStudioPrompt(preset.prompt)}
              className={cn(
                "rounded-lg border px-2.5 py-1 font-mono text-[11px] font-medium transition",
                studioMode === preset.id
                  ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-800 dark:text-[#95f965]"
                  : "border-slate-200 bg-white text-slate-600 hover:text-slate-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-white",
              )}
            >
              {preset.badge}
            </button>
          ))}
        </div>

        {/* Dynamic Studio Summary KPI Cards */}
        <div
          data-testid="ag-studio-kpi-cards"
          className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="font-mono text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
              Completed PayPal Spend
            </p>
            <p className="mt-1 font-mono text-lg font-extrabold text-emerald-700 tabular-nums dark:text-[#95f965]">
              ${studioSummary.completedUsd.toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="font-mono text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
              Blocked By Rust Guardrail
            </p>
            <p className="mt-1 font-mono text-lg font-extrabold text-rose-600 tabular-nums dark:text-rose-400">
              ${studioSummary.blockedUsd.toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="font-mono text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
              ACDC *1881 Direct Captures
            </p>
            <p className="mt-1 font-mono text-lg font-extrabold text-slate-900 tabular-nums dark:text-white">
              {studioSummary.acdcCount} (${studioSummary.acdcUsd.toFixed(2)})
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="font-mono text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
              High-Risk / Disputed Rows
            </p>
            <p className="mt-1 font-mono text-lg font-extrabold text-amber-600 tabular-nums dark:text-amber-400">
              {studioSummary.disputedCount} Flagged
            </p>
          </div>
        </div>

        {/* Dynamic Studio Merchant / MCP Breakdown Widget */}
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {activeWidgetRows.slice(0, 6).map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="truncate font-semibold text-slate-800 dark:text-zinc-200">
                {row.label}
              </span>
              <span className="shrink-0 font-mono text-[11px] tabular-nums">
                <span className="font-bold text-emerald-700 dark:text-[#95f965]">
                  +${row.primaryUsd.toFixed(0)}
                </span>
                {row.secondaryUsd > 0 ? (
                  <span className="ml-1.5 font-bold text-rose-500">
                    / -${row.secondaryUsd.toFixed(0)} blocked
                  </span>
                ) : null}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive AG Grid React Component */}
      <div
        data-testid="ag-grid-container"
        className="h-[420px] w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-zinc-800"
      >
        <AgGridReact<PayPalOrderRecord>
          theme={gridTheme}
          rowData={displayedOrders}
          columnDefs={columnDefs}
          quickFilterText={ledgerFilter}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
          animateRows={true}
          defaultColDef={{
            resizable: true,
          }}
        />
      </div>
    </section>
  );
}
