"use client";

import { cn } from "@/lib/utils";
import {
  Calendar,
  CheckCircle2,
  Lock,
  PackageCheck,
  Truck,
  ZoomIn,
} from "lucide-react";
import { useMemo, useState } from "react";
import type {
  Channel3Product,
  PayPalOrderRecord,
  PayoutMilestone,
} from "./types";

interface BryntumProcurementSchedulerProps {
  milestones: PayoutMilestone[];
  orders: PayPalOrderRecord[];
  catalog: Channel3Product[];
  maxRiskScore: number;
  busy: boolean;
  onAttachTracking: (
    orderId: string,
    status: "DELIVERED" | "IN_TRANSIT",
    carrier: string,
    milestoneId?: string,
  ) => Promise<void>;
  onSelectCatalogProduct: (item: Channel3Product) => void;
}

type SchedulerZoom = "7d" | "14d" | "30d";

const ZOOM_CONFIG: Record<
  SchedulerZoom,
  { label: string; totalDays: number; dayHeaders: string[] }
> = {
  "7d": {
    label: "7D Sprint Zoom",
    totalDays: 7,
    dayHeaders: [
      "Oct 31",
      "Nov 01",
      "Nov 02",
      "Nov 03",
      "Nov 04",
      "Nov 05",
      "Nov 06",
    ],
  },
  "14d": {
    label: "14D Hackathon Window",
    totalDays: 14,
    dayHeaders: [
      "Oct 31",
      "Nov 02",
      "Nov 04",
      "Nov 06",
      "Nov 08",
      "Nov 10",
      "Nov 12",
    ],
  },
  "30d": {
    label: "30D Procurement Horizon",
    totalDays: 30,
    dayHeaders: [
      "Wk 1 (Oct 31)",
      "Wk 2 (Nov 07)",
      "Wk 3 (Nov 14)",
      "Wk 4 (Nov 21)",
      "Wk 5 (Nov 28)",
    ],
  },
};

function parseOffsetDays(isoDate: string): number {
  const base = Date.parse("2026-10-31T00:00:00Z");
  const target = Date.parse(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(target)) return 0;
  return Math.max(0, Math.round((target - base) / 86_400_000));
}

export function BryntumProcurementScheduler({
  milestones,
  orders,
  catalog,
  maxRiskScore,
  busy,
  onAttachTracking,
  onSelectCatalogProduct,
}: BryntumProcurementSchedulerProps) {
  const [zoom, setZoom] = useState<SchedulerZoom>("14d");

  const activeZoom = ZOOM_CONFIG[zoom];

  const schedulerLanes = useMemo(() => {
    return milestones.map((ms, index) => {
      const linkedOrder =
        orders.find((o) => o.merchant_email === ms.recipient_email) ??
        orders[index] ??
        orders[0];

      const startDay = parseOffsetDays(ms.start_date);
      const endDay = Math.max(startDay + 1, parseOffsetDays(ms.end_date));
      const leftPct = Math.min(
        82,
        Math.round((startDay / activeZoom.totalDays) * 100),
      );
      const widthPct = Math.max(
        16,
        Math.min(
          100 - leftPct,
          Math.round(((endDay - startDay + 1) / activeZoom.totalDays) * 100),
        ),
      );

      const trackingStatus =
        ms.shipment_status ??
        linkedOrder?.shipment_tracking?.status ??
        ms.state;
      const trackingNumber =
        ms.tracking_number ??
        linkedOrder?.shipment_tracking?.tracking_number ??
        null;
      const carrier =
        ms.carrier ?? linkedOrder?.shipment_tracking?.carrier ?? "UPS";

      return {
        ms,
        linkedOrderId: linkedOrder?.id ?? "PAYPAL-SBX-8F12A90C11",
        leftPct,
        widthPct,
        trackingStatus,
        trackingNumber,
        carrier,
      };
    });
  }, [milestones, orders, activeZoom.totalDays]);

  return (
    <section
      aria-label="Bryntum procurement and shipment tracking scheduler"
      data-testid="bryntum-scheduler-section"
      className="mt-7 space-y-6"
    >
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/90">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-600 dark:text-[#95f965]" />
              <h1 className="text-xl font-extrabold text-slate-950 dark:text-white">
                Bryntum Procurement &amp; PayPal Shipment Resource Scheduler
              </h1>
            </div>
            <p className="mt-1 text-xs text-slate-600 dark:text-zinc-400">
              Interactive resource timeline with date-range zoom, SLA progress bars, and 1-click PayPal Trackers v1 attachment.
            </p>
          </div>

          {/* Date Range Zoom Bar */}
          <div
            role="group"
            aria-label="Scheduler date range zoom"
            className="inline-flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-100 p-1 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <ZoomIn className="ml-2 h-3.5 w-3.5 text-slate-500 dark:text-zinc-400" />
            {(["7d", "14d", "30d"] as const).map((level) => (
              <button
                key={level}
                type="button"
                data-testid={`scheduler-zoom-${level}`}
                onClick={() => setZoom(level)}
                aria-pressed={zoom === level}
                className={cn(
                  "min-h-9 rounded-xl px-3 py-1 font-mono text-xs font-bold uppercase transition",
                  zoom === level
                    ? "bg-[#95f965] text-black"
                    : "text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white",
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Bryntum Resource Grid + Timeline Header */}
        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 dark:border-zinc-800">
          <div className="min-w-[780px]">
            <div className="grid grid-cols-12 border-b border-slate-200 bg-slate-100 font-mono text-[11px] font-bold text-slate-600 uppercase dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
              <div className="col-span-4 border-r border-slate-200 px-4 py-3 dark:border-zinc-800">
                Vendor Resource &amp; PayPal Batch
              </div>
              <div className="col-span-5 border-r border-slate-200 px-4 py-3 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  {activeZoom.dayHeaders.map((hdr) => (
                    <span key={hdr}>{hdr}</span>
                  ))}
                </div>
              </div>
              <div className="col-span-3 px-4 py-3">
                1-Click PayPal Shipment Tracking
              </div>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-zinc-800">
              {schedulerLanes.map((lane) => {
                const isDelivered = lane.trackingStatus === "DELIVERED";
                const isTransit = lane.trackingStatus === "IN_TRANSIT";
                return (
                  <div
                    key={lane.ms.id}
                    data-testid={`scheduler-row-${lane.ms.id}`}
                    className="grid grid-cols-12 items-center bg-white hover:bg-slate-50/70 dark:bg-zinc-900/60 dark:hover:bg-zinc-950/70"
                  >
                    {/* Resource Column */}
                    <div className="col-span-4 border-r border-slate-200 p-4 dark:border-zinc-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {lane.ms.milestone_name}
                      </p>
                      <p className="mt-0.5 truncate font-mono text-[11px] text-slate-500 dark:text-zinc-400">
                        {lane.ms.recipient_email} · ${lane.ms.amount_usd.toFixed(2)}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                        <span className="rounded bg-slate-200/80 px-1.5 py-0.5 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                          {lane.ms.paypal_batch_id}
                        </span>
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.5 font-bold",
                            isDelivered
                              ? "bg-emerald-500/20 text-emerald-800 dark:text-[#95f965]"
                              : isTransit
                                ? "bg-sky-500/20 text-sky-700 dark:text-sky-300"
                                : "bg-amber-500/20 text-amber-700 dark:text-amber-300",
                          )}
                        >
                          {lane.trackingStatus}
                        </span>
                        {lane.trackingNumber ? (
                          <span className="text-slate-500 dark:text-zinc-400">
                            {lane.carrier} #{lane.trackingNumber}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {/* Interactive Positioned Gantt / Scheduler Timeline Bar */}
                    <div className="col-span-5 border-r border-slate-200 px-4 py-4 dark:border-zinc-800">
                      <div className="relative h-10 w-full rounded-xl bg-slate-100 p-1.5 dark:bg-zinc-950">
                        <div
                          style={{
                            marginLeft: `${lane.leftPct}%`,
                            width: `${lane.widthPct}%`,
                          }}
                          className="relative flex h-7 items-center overflow-hidden rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-2"
                        >
                          <div
                            style={{ width: `${lane.ms.progress_pct}%` }}
                            className="absolute inset-y-0 left-0 bg-[#95f965]/40 transition-all duration-300"
                          />
                          <span className="relative z-10 truncate font-mono text-[10px] font-bold text-slate-900 dark:text-white">
                            SLA {lane.ms.progress_pct}% ({lane.ms.start_date} to{" "}
                            {lane.ms.end_date})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 1-Click PayPal Shipment Tracking Actions */}
                    <div className="col-span-3 flex flex-wrap items-center gap-1.5 p-3">
                      <button
                        type="button"
                        disabled={busy}
                        data-testid={`track-transit-${lane.ms.id}`}
                        onClick={() =>
                          void onAttachTracking(
                            lane.linkedOrderId,
                            "IN_TRANSIT",
                            lane.carrier,
                            lane.ms.id,
                          )
                        }
                        className="inline-flex min-h-9 flex-1 items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white px-2 py-1 font-mono text-[10px] font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-800"
                      >
                        <Truck className="h-3 w-3 text-sky-500" />
                        IN_TRANSIT
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        data-testid={`track-delivered-${lane.ms.id}`}
                        onClick={() =>
                          void onAttachTracking(
                            lane.linkedOrderId,
                            "DELIVERED",
                            lane.carrier,
                            lane.ms.id,
                          )
                        }
                        className="inline-flex min-h-9 flex-1 items-center justify-center gap-1 rounded-lg bg-[#95f965] px-2 py-1 font-mono text-[10px] font-bold text-black hover:bg-[#82ea52] disabled:opacity-50"
                      >
                        <PackageCheck className="h-3 w-3" />
                        DELIVERED
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Category Channel3 Retail & Procurement Catalog Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {catalog.map((item) => {
          const blocked = item.risk_score > maxRiskScore;
          return (
            <article
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/90"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-emerald-700 dark:text-[#95f965]">
                    {item.sku}
                  </span>
                  <span className={blocked ? "text-amber-500" : "text-zinc-400"}>
                    Risk {item.risk_score}
                  </span>
                </div>
                <h3 className="mt-1.5 text-sm font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-zinc-400">
                  {item.merchant_name} · {item.delivery_sla}
                </p>
              </div>

              <button
                type="button"
                disabled={busy}
                onClick={() => onSelectCatalogProduct(item)}
                className={cn(
                  "mt-4 inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition",
                  blocked
                    ? "border border-amber-500/40 bg-amber-500/10 text-amber-500"
                    : "bg-[#95f965] text-black hover:bg-[#82ea52]",
                )}
              >
                {blocked ? (
                  <>
                    <Lock className="h-3.5 w-3.5" />
                    Test Policy Block (${item.price_usd})
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Order via PayPal (${item.price_usd})
                  </>
                )}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
