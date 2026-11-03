"use client";

import React, {
  type CSSProperties,
  type ElementType,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { Check, Copy, Terminal } from "lucide-react";

/* ============================================================================
   1. dithercn.dev PRIMITIVES
   Ordered Bayer 4x4 and 8x8 Halftone Engine on Warm-Paper Found Theme
   ============================================================================ */

/**
 * Global SVG definitions for ordered Bayer halftone patterns and spotlights.
 * Mount once at the root of the cockpit / page.
 */
export function DitherDefs() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      aria-hidden="true"
    >
      <defs>
        {/* Subtle Bayer Halftone (8x8, 4 scattered 2x2 cells, ~12% density) */}
        <pattern
          id="dither-bayer-subtle"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <rect
            x="0"
            y="0"
            width="2"
            height="2"
            fill="currentColor"
            opacity="0.12"
            shapeRendering="crispEdges"
          />
          <rect
            x="4"
            y="4"
            width="2"
            height="2"
            fill="currentColor"
            opacity="0.12"
            shapeRendering="crispEdges"
          />
        </pattern>

        {/* Medium Bayer Halftone (8x8, 8 scattered 2x2 cells, ~25% density) */}
        <pattern
          id="dither-bayer-medium"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <rect
            x="0"
            y="0"
            width="2"
            height="2"
            fill="currentColor"
            opacity="0.22"
            shapeRendering="crispEdges"
          />
          <rect
            x="4"
            y="0"
            width="2"
            height="2"
            fill="currentColor"
            opacity="0.18"
            shapeRendering="crispEdges"
          />
          <rect
            x="2"
            y="4"
            width="2"
            height="2"
            fill="currentColor"
            opacity="0.22"
            shapeRendering="crispEdges"
          />
          <rect
            x="6"
            y="4"
            width="2"
            height="2"
            fill="currentColor"
            opacity="0.18"
            shapeRendering="crispEdges"
          />
        </pattern>

        {/* Dense Bayer Halftone (8x8, 16 cells, ~50% density) */}
        <pattern
          id="dither-bayer-dense"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <rect
            x="0"
            y="0"
            width="2"
            height="2"
            fill="currentColor"
            opacity="0.38"
            shapeRendering="crispEdges"
          />
          <rect
            x="4"
            y="0"
            width="2"
            height="2"
            fill="currentColor"
            opacity="0.38"
            shapeRendering="crispEdges"
          />
          <rect
            x="2"
            y="2"
            width="2"
            height="2"
            fill="currentColor"
            opacity="0.38"
            shapeRendering="crispEdges"
          />
          <rect
            x="6"
            y="2"
            width="2"
            height="2"
            fill="currentColor"
            opacity="0.38"
            shapeRendering="crispEdges"
          />
          <rect
            x="0"
            y="4"
            width="2"
            height="2"
            fill="currentColor"
            opacity="0.38"
            shapeRendering="crispEdges"
          />
          <rect
            x="4"
            y="4"
            width="2"
            height="2"
            fill="currentColor"
            opacity="0.38"
            shapeRendering="crispEdges"
          />
          <rect
            x="2"
            y="6"
            width="2"
            height="2"
            fill="currentColor"
            opacity="0.38"
            shapeRendering="crispEdges"
          />
          <rect
            x="6"
            y="6"
            width="2"
            height="2"
            fill="currentColor"
            opacity="0.38"
            shapeRendering="crispEdges"
          />
        </pattern>

        {/* Named Density Aliases for dithercn.dev spec */}
        <pattern
          id="dither-bayer-20"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <rect
            x="0"
            y="0"
            width="2"
            height="2"
            fill="currentColor"
            opacity="0.20"
            shapeRendering="crispEdges"
          />
          <rect
            x="4"
            y="4"
            width="2"
            height="2"
            fill="currentColor"
            opacity="0.20"
            shapeRendering="crispEdges"
          />
        </pattern>
        <pattern
          id="dither-bayer-40"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <rect
            x="0"
            y="0"
            width="2"
            height="2"
            fill="currentColor"
            opacity="0.40"
            shapeRendering="crispEdges"
          />
          <rect
            x="4"
            y="0"
            width="2"
            height="2"
            fill="currentColor"
            opacity="0.30"
            shapeRendering="crispEdges"
          />
          <rect
            x="2"
            y="4"
            width="2"
            height="2"
            fill="currentColor"
            opacity="0.40"
            shapeRendering="crispEdges"
          />
          <rect
            x="6"
            y="4"
            width="2"
            height="2"
            fill="currentColor"
            opacity="0.30"
            shapeRendering="crispEdges"
          />
        </pattern>
        <pattern
          id="dither-bayer-65"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <rect
            x="0"
            y="0"
            width="2"
            height="2"
            fill="currentColor"
            opacity="0.65"
            shapeRendering="crispEdges"
          />
          <rect
            x="2"
            y="2"
            width="2"
            height="2"
            fill="currentColor"
            opacity="0.65"
            shapeRendering="crispEdges"
          />
          <rect
            x="4"
            y="4"
            width="2"
            height="2"
            fill="currentColor"
            opacity="0.65"
            shapeRendering="crispEdges"
          />
          <rect
            x="6"
            y="6"
            width="2"
            height="2"
            fill="currentColor"
            opacity="0.65"
            shapeRendering="crispEdges"
          />
        </pattern>

        {/* Color Halftones (PayPal Blue, Emerald Green, Amber, Pink) */}
        <pattern
          id="dither-bayer-blue"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <rect
            x="0"
            y="0"
            width="2"
            height="2"
            fill="#0070BA"
            opacity="0.75"
            shapeRendering="crispEdges"
          />
          <rect
            x="4"
            y="4"
            width="2"
            height="2"
            fill="#0070BA"
            opacity="0.75"
            shapeRendering="crispEdges"
          />
          <rect
            x="2"
            y="2"
            width="2"
            height="2"
            fill="#0070BA"
            opacity="0.4"
            shapeRendering="crispEdges"
          />
        </pattern>

        <pattern
          id="dither-bayer-green"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <rect
            x="0"
            y="0"
            width="2"
            height="2"
            fill="#16A34A"
            opacity="0.75"
            shapeRendering="crispEdges"
          />
          <rect
            x="4"
            y="4"
            width="2"
            height="2"
            fill="#16A34A"
            opacity="0.75"
            shapeRendering="crispEdges"
          />
          <rect
            x="2"
            y="2"
            width="2"
            height="2"
            fill="#16A34A"
            opacity="0.4"
            shapeRendering="crispEdges"
          />
        </pattern>

        <pattern
          id="dither-bayer-amber"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <rect
            x="0"
            y="0"
            width="2"
            height="2"
            fill="#D97706"
            opacity="0.75"
            shapeRendering="crispEdges"
          />
          <rect
            x="4"
            y="4"
            width="2"
            height="2"
            fill="#D97706"
            opacity="0.75"
            shapeRendering="crispEdges"
          />
          <rect
            x="2"
            y="2"
            width="2"
            height="2"
            fill="#D97706"
            opacity="0.4"
            shapeRendering="crispEdges"
          />
        </pattern>

        <pattern
          id="dither-bayer-pink"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <rect
            x="0"
            y="0"
            width="2"
            height="2"
            fill="#D41C7A"
            opacity="0.75"
            shapeRendering="crispEdges"
          />
          <rect
            x="4"
            y="4"
            width="2"
            height="2"
            fill="#D41C7A"
            opacity="0.75"
            shapeRendering="crispEdges"
          />
          <rect
            x="2"
            y="2"
            width="2"
            height="2"
            fill="#D41C7A"
            opacity="0.4"
            shapeRendering="crispEdges"
          />
        </pattern>

        {/* Radial mask for soft corner spotlight */}
        <mask id="dither-corner-mask">
          <radialGradient
            id="dither-corner-grad"
            cx="100%"
            cy="0%"
            r="100%"
            fx="100%"
            fy="0%"
          >
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <rect width="100%" height="100%" fill="url(#dither-corner-grad)" />
        </mask>
      </defs>
    </svg>
  );
}

export interface DitherCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  tone?: "subtle" | "blue" | "green" | "amber" | "pink";
  spotlight?: boolean;
  accentStrip?: boolean;
  as?: ElementType;
}

/**
 * Tactile Card Shell featuring Bayer halftone corner spotlight and 1px crisp hairlines.
 */
export function DitherCard({
  children,
  className,
  tone = "subtle",
  spotlight = true,
  accentStrip = false,
  as: Component = "div",
  ...props
}: DitherCardProps) {
  const patternId =
    tone === "blue"
      ? "url(#dither-bayer-blue)"
      : tone === "green"
        ? "url(#dither-bayer-green)"
        : tone === "amber"
          ? "url(#dither-bayer-amber)"
          : tone === "pink"
            ? "url(#dither-bayer-pink)"
            : "url(#dither-bayer-subtle)";

  return (
    <Component
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[var(--line,#E4E4E0)] bg-[var(--surface,#FFFFFF)] text-[var(--ink,#18181B)] shadow-[0_1px_2px_rgba(24,24,27,0.04)] transition-colors",
        className,
      )}
      {...props}
    >
      {spotlight ? (
        <svg
          className="pointer-events-none absolute top-0 right-0 h-28 w-28 select-none"
          aria-hidden="true"
        >
          <rect
            width="100%"
            height="100%"
            fill={patternId}
            mask="url(#dither-corner-mask)"
          />
        </svg>
      ) : null}

      <div className="relative z-10 h-full">{children}</div>

      {accentStrip ? (
        <div
          className="absolute inset-x-0 bottom-0 h-1 bg-[var(--line,#E8E6E1)] opacity-70"
          style={{
            backgroundImage: patternId,
            backgroundRepeat: "repeat",
          }}
          aria-hidden="true"
        />
      ) : null}
    </Component>
  );
}

export interface DitherProgressBarProps {
  value: number;
  max?: number;
  tone?: "ok" | "warn" | "accent" | "blue" | "green" | "amber" | "pink";
  className?: string;
  showLabel?: boolean;
  label?: string;
}

/**
 * Horizontal Progress Bar with Bayer Halftone Texture Overlay.
 */
export function DitherProgressBar({
  value,
  max = 100,
  tone = "ok",
  className,
  showLabel = false,
  label,
}: DitherProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  const tonePattern =
    tone === "blue" || tone === "accent"
      ? "url(#dither-bayer-blue)"
      : tone === "pink"
        ? "url(#dither-bayer-pink)"
        : tone === "warn" || tone === "amber"
          ? "url(#dither-bayer-amber)"
          : "url(#dither-bayer-green)";

  const toneBg =
    tone === "blue" || tone === "accent"
      ? "bg-sky-600"
      : tone === "pink"
        ? "bg-pink-600"
        : tone === "warn" || tone === "amber"
          ? "bg-amber-600"
          : "bg-[var(--ok,#2D6A4F)]";

  return (
    <div className={cn("space-y-1", className)}>
      {showLabel ? (
        <div className="flex items-center justify-between font-mono text-[11px] text-[var(--muted,#838380)]">
          <span>{label || "Utilization"}</span>
          <span className="tabular-nums font-semibold text-[var(--ink,#141413)]">
            {pct.toFixed(0)}%
          </span>
        </div>
      ) : null}
      <div className="relative h-2 w-full overflow-hidden rounded-full border border-[var(--line,#E8E6E1)] bg-[var(--soft,#F3F3F1)]">
        <div
          className={cn("relative h-full transition-all duration-300", toneBg)}
          style={{ width: `${pct}%` }}
        >
          {/* Halftone texture overlay */}
          <svg
            className="absolute inset-0 h-full w-full opacity-60"
            aria-hidden="true"
          >
            <rect width="100%" height="100%" fill={tonePattern} />
          </svg>
          {/* Crisp solid leading edge */}
          <div className="absolute top-0 right-0 bottom-0 w-[2px] bg-white shadow-xs" />
        </div>
      </div>
    </div>
  );
}

export interface DitherGaugeProps {
  percent: number;
  tone?: "ok" | "warn" | "accent";
  size?: number;
  label?: string;
  sublabel?: string;
}

/**
 * Semi-circular arc gauge with Bayer halftone pattern overlay.
 */
export function DitherGauge({
  percent,
  tone = "ok",
  size = 64,
  label,
  sublabel,
}: DitherGaugeProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  const radius = 24;
  const stroke = 5;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  const toneColor =
    tone === "accent"
      ? "#0070BA"
      : tone === "warn"
        ? "#D97706"
        : "var(--ok, #2D6A4F)";

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size / 2 + 6}
        viewBox="0 0 64 36"
        className="overflow-visible"
        aria-hidden="true"
      >
        {/* Background track arc */}
        <path
          d="M 8 32 A 24 24 0 0 1 56 32"
          fill="none"
          stroke="var(--line, #E8E6E1)"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {/* Filled arc */}
        <path
          d="M 8 32 A 24 24 0 0 1 56 32"
          fill="none"
          stroke={toneColor}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      {label ? (
        <span className="mt-1 font-mono text-[11px] font-semibold text-[var(--ink,#141413)] tabular-nums">
          {label}
        </span>
      ) : null}
      {sublabel ? (
        <span className="text-[10px] text-[var(--muted,#838380)]">
          {sublabel}
        </span>
      ) : null}
    </div>
  );
}

export interface DitherUptimeBarProps {
  ticks?: number;
  label?: string;
  uptimeText?: string;
  status?: "healthy" | "warning" | "degraded";
  failureIndices?: number[];
  className?: string;
}

/**
 * 32-tick status telemetry bar where each tick renders crisp Bayer halftone fills.
 */
export function DitherUptimeBar({
  ticks = 32,
  label,
  uptimeText = "99.98%",
  status = "healthy",
  failureIndices = [7, 18],
  className,
}: DitherUptimeBarProps) {
  const tickList = Array.from({ length: ticks }, (_, i) => {
    const isWarn = status === "warning" && failureIndices.includes(i);
    const isDegraded = status === "degraded" && (i === 12 || i === 13);
    return {
      index: i,
      tone: isDegraded ? "degraded" : isWarn ? "warn" : "ok",
    };
  });

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between font-mono text-[10.5px]">
        <span className="text-[var(--muted,#838380)]">{label || "Telemetry"}</span>
        <span className="font-semibold text-[var(--ok,#2D6A4F)]">
          {uptimeText}
        </span>
      </div>
      <div className="flex items-center gap-[2px]">
        {tickList.map((t) => (
          <div
            key={t.index}
            className={cn(
              "h-3.5 flex-1 rounded-[1.5px] transition-opacity",
              t.tone === "degraded"
                ? "bg-rose-500 opacity-90"
                : t.tone === "warn"
                  ? "bg-amber-500 opacity-90"
                  : "bg-[var(--ok,#2D6A4F)] opacity-85 hover:opacity-100",
            )}
            title={`Tick ${t.index + 1}: ${t.tone.toUpperCase()}`}
          />
        ))}
      </div>
    </div>
  );
}

export interface DitherButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "quiet" | "ok";
  children: ReactNode;
}

/**
 * Tactile Button with Bayer halftone top highlight and bottom shadow.
 */
export function DitherButton({
  variant = "primary",
  children,
  className,
  ...props
}: DitherButtonProps) {
  const baseClasses =
    "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg px-4 py-2 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const variantClasses =
    variant === "primary"
      ? "bg-[var(--ink,#141413)] text-[var(--bg,#FDFDFC)] hover:opacity-90 active:scale-[0.99]"
      : variant === "ok"
        ? "bg-[var(--ok,#2D6A4F)] text-white hover:opacity-95 active:scale-[0.99]"
        : variant === "secondary"
          ? "border border-[var(--line,#E8E6E1)] bg-[var(--surface,#FFFFFF)] text-[var(--ink,#141413)] hover:bg-[var(--soft,#F3F3F1)]"
          : "text-[var(--muted,#838380)] hover:text-[var(--ink,#141413)] hover:bg-[var(--soft,#F3F3F1)]";

  return (
    <button className={cn(baseClasses, variantClasses, className)} {...props}>
      {/* 2px Bayer highlight strip on top */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] opacity-30"
        style={{
          backgroundImage: "url(#dither-bayer-subtle)",
          backgroundRepeat: "repeat",
        }}
      />
      <span className="relative z-10 flex items-center gap-1.5">{children}</span>
      {/* 2px Bayer shade strip on bottom */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] opacity-40"
        style={{
          backgroundImage: "url(#dither-bayer-subtle)",
          backgroundRepeat: "repeat",
        }}
      />
    </button>
  );
}

export interface DitherStatCardProps {
  title: ReactNode;
  badge?: ReactNode;
  badgeTone?: "ok" | "warn" | "neutral" | "accent";
  value: ReactNode;
  valueTestId?: string;
  subtitle?: ReactNode;
  gaugePercent?: number;
  gaugeTone?: "ok" | "warn" | "accent";
  progressPercent?: number;
  sparklineData?: number[];
  sparklineTone?: "blue" | "green" | "amber" | "pink";
  className?: string;
  children?: ReactNode;
}

/**
 * KPI Stat Card combining title, badge, big value (with data-testid pass-through),
 * subtitle, and Bayer dither area sparkline or gauge.
 */
export function DitherStatCard({
  title,
  badge,
  badgeTone = "ok",
  value,
  valueTestId,
  subtitle,
  gaugePercent,
  gaugeTone = "ok",
  progressPercent,
  sparklineData = [12, 19, 14, 25, 22, 30, 28, 38],
  sparklineTone = "green",
  className,
  children,
}: DitherStatCardProps) {
  const badgeClasses =
    badgeTone === "ok"
      ? "text-[var(--ok,#2D6A4F)] bg-emerald-500/10 border-emerald-500/20"
      : badgeTone === "warn"
        ? "text-amber-700 bg-amber-500/10 border-amber-500/20"
        : badgeTone === "accent"
          ? "text-sky-700 bg-sky-500/10 border-sky-500/20"
          : "text-[var(--muted,#838380)] bg-[var(--soft,#F3F3F1)] border-[var(--line,#E8E6E1)]";

  const patternUrl =
    sparklineTone === "blue"
      ? "url(#dither-bayer-blue)"
      : sparklineTone === "amber"
        ? "url(#dither-bayer-amber)"
        : sparklineTone === "pink"
          ? "url(#dither-bayer-pink)"
          : "url(#dither-bayer-green)";

  // Normalize sparkline points to SVG viewBox 0 0 100 24
  const minVal = Math.min(...sparklineData);
  const maxVal = Math.max(...sparklineData) || 1;
  const range = maxVal - minVal || 1;
  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * 100;
      const y = 22 - ((val - minVal) / range) * 18;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const areaPoints = `0,24 ${points} 100,24`;

  const barPct =
    typeof progressPercent === "number"
      ? progressPercent
      : typeof gaugePercent === "number"
        ? gaugePercent
        : null;

  return (
    <DitherCard
      tone={sparklineTone}
      spotlight={false}
      className={cn(
        "flex h-full flex-col justify-between p-4",
        className,
      )}
    >
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2 text-[12px] text-[var(--muted,#71717A)]">
          <span className="truncate font-medium">{title}</span>
          {badge ? (
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                badgeClasses,
              )}
            >
              {badge}
            </span>
          ) : null}
        </div>

        <div
          data-testid={valueTestId}
          className="pt-0.5 text-[22px] font-semibold tracking-tight tabular-nums text-[var(--ink,#18181B)]"
        >
          {value}
        </div>

        {subtitle ? (
          <div className="text-[12px] leading-snug text-[var(--muted,#71717A)]">
            {subtitle}
          </div>
        ) : null}

        {children}
      </div>

      {barPct !== null ? (
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[var(--soft,#F2F2EE)]">
          <div
            className="h-full rounded-full bg-[var(--accent,#0066CC)] transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(6, barPct))}%` }}
          />
        </div>
      ) : null}
    </DitherCard>
  );
}

/* ============================================================================
   2. mdxcn.dev PRIMITIVES
   Dashed + Corner Monospace Figures with [ UI | ASCII ] Interactive Toggle
   ============================================================================ */

export interface MdxcnFrameProps {
  title: string;
  subtitle?: string;
  badge?: string;
  ascii?: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
  footer?: ReactNode;
}

/**
 * Universal mdxcn.dev Monospace Framed Container.
 * Features 1px dashed hairline borders, 4 corner "+" crosshairs,
 * uppercase monospace [ TITLE ] header bar, and [ UI | ASCII ] view toggle.
 */
export function MdxcnFrame({
  title,
  subtitle,
  badge,
  ascii,
  children,
  className,
  headerAction,
  footer,
}: MdxcnFrameProps) {
  const [mode, setMode] = useState<"ui" | "ascii">("ui");
  const [copied, setCopied] = useState(false);

  const handleCopyAscii = async () => {
    if (!ascii) return;
    try {
      await navigator.clipboard.writeText(ascii);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard write restrictions
    }
  };

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border border-[var(--line,#E4E4E0)] bg-[var(--surface,#FFFFFF)] p-5 text-[var(--ink,#18181B)] shadow-[0_1px_2px_rgba(24,24,27,0.04)] transition-colors",
        className,
      )}
    >
      {/* Clean Header Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line,#E4E4E0)] pb-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="text-[14px] font-semibold tracking-tight text-[var(--ink,#18181B)]">
            {title}
          </span>
          {subtitle ? (
            <span className="truncate text-[12px] text-[var(--muted,#71717A)]">
              · {subtitle}
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {headerAction}

          {/* Interactive [ UI | ASCII ] view mode toggle */}
          {ascii ? (
            <div
              role="group"
              aria-label="Figure presentation format"
              className="flex items-center rounded-lg border border-[var(--line,#E8E6E1)] bg-[var(--soft,#F3F3F1)] p-0.5 font-mono text-[10.5px]"
            >
              <button
                type="button"
                onClick={() => setMode("ui")}
                className={cn(
                  "rounded px-2 py-0.5 font-semibold transition cursor-pointer",
                  mode === "ui"
                    ? "bg-[var(--surface,#FFFFFF)] text-[var(--ink,#141413)] shadow-xs"
                    : "text-[var(--muted,#838380)] hover:text-[var(--ink,#141413)]",
                )}
              >
                UI
              </button>
              <button
                type="button"
                onClick={() => setMode("ascii")}
                className={cn(
                  "rounded px-2 py-0.5 font-semibold transition cursor-pointer",
                  mode === "ascii"
                    ? "bg-[var(--ink,#141413)] text-[var(--bg,#FDFDFC)] shadow-xs"
                    : "text-[var(--muted,#838380)] hover:text-[var(--ink,#141413)]",
                )}
              >
                ASCII
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Main Content: either interactive UI or copyable ASCII view */}
      {mode === "ui" ? (
        <div className="flex flex-1 flex-col justify-between">{children}</div>
      ) : (
        <div className="relative rounded-lg border border-[var(--line,#E8E6E1)] bg-[var(--soft,#F3F3F1)] p-3">
          <div className="absolute top-2.5 right-2.5">
            <button
              type="button"
              onClick={() => void handleCopyAscii()}
              className="inline-flex items-center gap-1 rounded border border-[var(--line,#E8E6E1)] bg-[var(--surface,#FFFFFF)] px-2 py-1 font-mono text-[10.5px] font-semibold text-[var(--ink,#141413)] hover:bg-[var(--soft,#F3F3F1)]"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-[var(--ok,#2D6A4F)]" />
                  COPIED
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 text-[var(--muted,#838380)]" />
                  COPY ASCII
                </>
              )}
            </button>
          </div>
          <pre className="overflow-x-auto font-mono text-[11px] leading-relaxed text-[var(--ink,#141413)] select-all">
            {ascii}
          </pre>
        </div>
      )}

      {footer ? (
        <div className="mt-3 border-t border-dashed border-[var(--line,#E8E6E1)] pt-2.5">
          {footer}
        </div>
      ) : null}
    </div>
  );
}

export interface MdxcnTimelineProps {
  steps: string[];
  className?: string;
  activeStep?: number;
}

/**
 * Vertical Monospace Execution Timeline (● / │ / ○).
 */
export function MdxcnTimeline({
  steps,
  className,
  activeStep,
}: MdxcnTimelineProps) {
  return (
    <ul className={cn("space-y-2 font-mono text-[11.5px]", className)}>
      {steps.map((step, idx) => {
        const isCurrent =
          typeof activeStep === "number" ? activeStep === idx : false;
        const isPast =
          typeof activeStep === "number" ? idx < activeStep : true;
        const marker = isPast ? "●" : isCurrent ? "◉" : "○";

        return (
          <li key={`${idx}-${step}`} className="flex items-start gap-2.5">
            <span
              className={cn(
                "mt-[1px] select-none font-bold",
                isPast
                  ? "text-[var(--ok,#2D6A4F)]"
                  : isCurrent
                    ? "text-sky-600"
                    : "text-[var(--muted,#838380)]",
              )}
              aria-hidden="true"
            >
              {marker}
            </span>
            <div className="min-w-0 flex-1 leading-snug">
              <span className="mr-2 font-bold text-[var(--muted,#838380)] opacity-70">
                0{idx + 1}
              </span>
              <span className="text-[var(--ink,#141413)]">{step}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export interface MdxcnWaterfallItem {
  label: string;
  party?: string;
  amount: number;
  total: number;
  tone?: "ok" | "accent" | "warn" | "muted";
}

export interface MdxcnWaterfallProps {
  items: MdxcnWaterfallItem[];
  currency?: string;
  className?: string;
}

/**
 * Horizontal character/bar waterfall chart (label + █ ▓ ░ bar + percent + dollar value).
 */
export function MdxcnWaterfall({
  items,
  className,
}: MdxcnWaterfallProps) {
  return (
    <div className={cn("space-y-2.5 text-[12px]", className)}>
      {items.map((item) => {
        const pct = Math.min(
          100,
          Math.max(0, item.total > 0 ? (item.amount / item.total) * 100 : 0),
        );

        const barBg =
          item.tone === "accent"
            ? "bg-sky-600"
            : item.tone === "warn"
              ? "bg-amber-600"
              : "bg-[var(--ok,#2D6A4F)]";

        return (
          <div
            key={item.label}
            className="flex items-center justify-between gap-3 border-b border-[var(--line,#E8E6E1)] pb-2 last:border-b-0 last:pb-0"
          >
            <div className="min-w-0 flex-1">
              <div className="font-medium text-[var(--ink,#141413)]">
                {item.label}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3 font-mono text-[11.5px]">
              <div className="hidden h-2 w-20 overflow-hidden rounded-full bg-[var(--soft,#F3F3F1)] sm:block">
                <div
                  className={cn("h-full rounded-full", barBg)}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-10 text-right tabular-nums text-[var(--muted,#838380)]">
                {pct.toFixed(0)}%
              </span>
              <span className="w-16 text-right font-semibold tabular-nums text-[var(--ink,#141413)]">
                ${item.amount.toFixed(2)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export interface MdxcnBulletProps {
  label: string;
  value: number;
  cap: number;
  unit?: string;
  threshold?: number;
  className?: string;
}

/**
 * Compact target/threshold bullet bar ([████████░░|░░]) with label and numerical readout.
 */
export function MdxcnBullet({
  label,
  value,
  cap,
  unit = "$",
  threshold = 80,
  className,
}: MdxcnBulletProps) {
  const pct = Math.min(100, Math.max(0, (value / cap) * 100));
  const isOver = pct > threshold;

  return (
    <div className={cn("space-y-1 font-mono text-[11px]", className)}>
      <div className="flex items-center justify-between">
        <span className="text-[var(--muted,#838380)]">{label}</span>
        <span className="font-semibold tabular-nums text-[var(--ink,#141413)]">
          {unit}
          {value.toFixed(0)} / {unit}
          {cap.toFixed(0)} ({pct.toFixed(0)}%)
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full border border-[var(--line,#E8E6E1)] bg-[var(--soft,#F3F3F1)]">
        <div
          className={cn(
            "h-full transition-all duration-300",
            isOver ? "bg-amber-600" : "bg-[var(--ok,#2D6A4F)]",
          )}
          style={{ width: `${pct}%` }}
        />
        {/* Threshold marker */}
        <div
          className="absolute top-0 bottom-0 w-[1.5px] bg-red-500"
          style={{ left: `${threshold}%` }}
          title={`Cap threshold: ${threshold}%`}
        />
      </div>
    </div>
  );
}

export interface MdxcnEndpointProps {
  method: "POST" | "GET" | "MCP" | "AXUM";
  path: string;
  status?: string | number;
  latencyMs?: number;
  className?: string;
}

/**
 * Framed REST/MCP endpoint badge with method pill, monospace path, and status code.
 */
export function MdxcnEndpoint({
  method,
  path,
  status = "200 OK",
  latencyMs,
  className,
}: MdxcnEndpointProps) {
  const methodBg =
    method === "POST"
      ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300"
      : method === "GET"
        ? "bg-sky-500/15 text-sky-800 dark:text-sky-300"
        : method === "MCP"
          ? "bg-purple-500/15 text-purple-800 dark:text-purple-300"
          : "bg-amber-500/15 text-amber-800 dark:text-amber-300";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-[var(--line,#E8E6E1)] bg-[var(--soft,#F3F3F1)] px-2.5 py-1 font-mono text-[11px]",
        className,
      )}
    >
      <span className={cn("rounded px-1.5 py-0.5 font-bold uppercase", methodBg)}>
        {method}
      </span>
      <span className="truncate font-medium text-[var(--ink,#141413)]">
        {path}
      </span>
      {status ? (
        <span className="ml-auto font-semibold text-[var(--ok,#2D6A4F)]">
          {status}
        </span>
      ) : null}
      {typeof latencyMs === "number" ? (
        <span className="text-[var(--muted,#838380)]">
          {latencyMs}ms
        </span>
      ) : null}
    </div>
  );
}

export interface MdxcnInvoiceRow {
  label: string;
  detail?: string;
  amountDisplay: string;
  badge?: string;
}

export interface MdxcnInvoiceProps {
  rows: MdxcnInvoiceRow[];
  totalLabel?: string;
  totalAmount?: string;
  className?: string;
}

/**
 * Framed monospace settlement/split invoice table with dotted leader lines.
 */
export function MdxcnInvoice({
  rows,
  totalLabel = "TOTAL SETTLED",
  totalAmount,
  className,
}: MdxcnInvoiceProps) {
  return (
    <div
      className={cn(
        "divide-y divide-dashed divide-[var(--line,#E8E6E1)] font-mono text-[11.5px]",
        className,
      )}
    >
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex flex-wrap items-center justify-between gap-2 py-2"
        >
          <div className="flex min-w-0 items-center gap-2">
            <span className="font-semibold text-[var(--ink,#141413)]">
              {row.label}
            </span>
            {row.detail ? (
              <span className="truncate text-[10.5px] text-[var(--muted,#838380)]">
                · {row.detail}
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            {row.badge ? (
              <span className="rounded bg-[var(--soft,#F3F3F1)] px-1.5 py-0.5 text-[10px] text-[var(--ok,#2D6A4F)]">
                {row.badge}
              </span>
            ) : null}
            <span className="font-bold tabular-nums text-[var(--ink,#141413)]">
              {row.amountDisplay}
            </span>
          </div>
        </div>
      ))}

      {totalAmount ? (
        <div className="flex items-center justify-between pt-2.5 font-bold text-[12px]">
          <span className="text-[var(--ink,#141413)]">{totalLabel}</span>
          <span className="text-[var(--ok,#2D6A4F)]">{totalAmount}</span>
        </div>
      ) : null}
    </div>
  );
}

/* ============================================================================
   3. bencho.dev/blocks/slosh PRIMITIVES
   Liquid Momentum Capsule Slider, Context Meter, Rolling Counter & 3D Tilt Card
   ============================================================================ */

export interface BenchoSloshSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (val: number) => void;
  label?: string;
  unit?: string;
  viscosity?: number;
  momentum?: number;
  corner?: number;
  tilt?: number;
  presets?: number[];
  testId?: string;
  className?: string;
}

/**
 * Interactive Liquid-Momentum Capsule Slider (bencho.dev/blocks/slosh).
 * Features a real requestAnimationFrame spring-damper physics loop tracking velocity,
 * an SVG wave meniscus that sloshes vertically and horizontally past the handle,
 * and a 3D perspective tilt proportional to momentum and velocity.
 */
export function BenchoSloshSlider({
  min = 25,
  max = 500,
  step = 5,
  value,
  onChange,
  label = "Live Settlement Amount",
  unit = "$",
  viscosity = 15,
  momentum = 55,
  corner = 20,
  tilt = 45,
  presets = [50, 100, 240, 265, 450],
  testId = "slosh-slider",
  className,
}: BenchoSloshSliderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Spring physics state (driven by refs so idle sliders consume 0 CPU)
  const [fluidPos, setFluidPos] = useState(value);
  const [velocity, setVelocity] = useState(0);
  const [tiltAngle, setTiltAngle] = useState(0);

  const fluidPosRef = useRef(value);
  const velocityRef = useRef(0);
  const targetRef = useRef(value);
  const animFrameRef = useRef<number | null>(null);

  const startSpringLoop = useCallback(() => {
    if (animFrameRef.current !== null) return;
    let lastTime = performance.now();

    const stepLoop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const springK = 36;
      const damping = Math.max(4, viscosity * 0.55);
      const displacement = fluidPosRef.current - targetRef.current;
      const accel = -springK * displacement - damping * velocityRef.current;

      velocityRef.current += accel * dt;
      fluidPosRef.current += velocityRef.current * dt;

      const nextTilt = Math.max(
        -4.5,
        Math.min(4.5, velocityRef.current * (tilt / 900)),
      );

      if (
        Math.abs(displacement) < 0.08 &&
        Math.abs(velocityRef.current) < 0.08
      ) {
        fluidPosRef.current = targetRef.current;
        velocityRef.current = 0;
        setFluidPos(targetRef.current);
        setVelocity(0);
        setTiltAngle(0);
        animFrameRef.current = null;
        return;
      }

      setFluidPos(fluidPosRef.current);
      setVelocity(velocityRef.current);
      setTiltAngle(nextTilt);
      animFrameRef.current = requestAnimationFrame(stepLoop);
    };

    animFrameRef.current = requestAnimationFrame(stepLoop);
  }, [viscosity, tilt]);

  // When value changes, inject impulse momentum and wake spring loop
  useEffect(() => {
    const diff = value - targetRef.current;
    targetRef.current = value;
    if (diff !== 0) {
      velocityRef.current += diff * (momentum / 28);
      startSpringLoop();
    }
  }, [value, momentum, startSpringLoop]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Compute percentage for wave and handle
  const targetPct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const fluidPct = Math.min(100, Math.max(0, ((fluidPos - min) / (max - min)) * 100));

  // Pointer drag handling
  const updateValueFromPointer = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const rawPct = Math.max(0, Math.min(1, clickX / rect.width));
      const rawVal = min + rawPct * (max - min);
      const stepped = Math.round(rawVal / step) * step;
      const clamped = Math.max(min, Math.min(max, stepped));
      onChange(clamped);
    },
    [min, max, step, onChange],
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateValueFromPointer(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateValueFromPointer(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore capture release error
    }
  };

  // Wave meniscus height driven by fluid velocity
  const waveAmplitude = Math.max(-10, Math.min(10, velocity * 0.15));

  return (
    <div className={cn("space-y-3", className)} data-testid={testId}>
      {/* Clean Tenor-Style Amount Field Header */}
      <div className="flex items-baseline justify-between gap-2">
        <label className="text-xs font-medium text-[var(--muted,#71717A)]">
          {label}
        </label>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-semibold tracking-tight tabular-nums text-[var(--ink,#18181B)]">
            {unit}
            {value.toFixed(2)}
          </span>
          <span className="text-xs font-medium text-[var(--muted,#71717A)]">
            USD
          </span>
        </div>
      </div>

      {/* Sleek Interactive Range Track (No Giant Green Blob) */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          transform: `perspective(600px) rotateZ(${tiltAngle * 0.25}deg)`,
          transition: isDragging ? "none" : "transform 0.15s ease-out",
        }}
        className="relative flex h-6 w-full touch-none items-center cursor-ew-resize select-none"
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            onChange(Math.min(max, value + step));
          } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            onChange(Math.max(min, value - step));
          }
        }}
      >
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-[var(--soft,#F2F2EE)] ring-1 ring-inset ring-[var(--line,#E4E4E0)]">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-[var(--accent,#0066CC)] transition-all duration-75"
            style={{ width: `${fluidPct}%`, opacity: 0.9 + Math.min(0.1, Math.abs(waveAmplitude) * 0.01) }}
          />
        </div>

        {/* Crisp Circular Thumb */}
        <div
          className="pointer-events-none absolute top-1/2 h-4.5 w-4.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--accent,#0066CC)] bg-white shadow-sm transition-[left] duration-75"
          style={{
            left: `${Math.min(97, Math.max(3, targetPct))}%`,
          }}
        />
      </div>

      {/* Preset Chips (Exact Tenor .chip style) */}
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <span className="text-[11.5px] text-[var(--muted,#71717A)]">
          Presets
        </span>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(preset)}
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-[11.5px] font-medium tabular-nums transition cursor-pointer",
                value === preset
                  ? "border-[var(--ink,#18181B)] bg-[var(--ink,#18181B)] text-[var(--bg,#FFFFFF)]"
                  : "border-[var(--line,#E4E4E0)] bg-[var(--surface,#FFFFFF)] text-[var(--muted,#71717A)] hover:bg-[var(--soft,#F2F2EE)] hover:text-[var(--ink,#18181B)]",
              )}
            >
              {unit}
              {preset}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export interface BenchoContextMeterSegment {
  label: string;
  value: number;
  color?: string;
  tone?: "ok" | "warn" | "danger" | "muted";
}

export interface BenchoContextMeterProps {
  segments: BenchoContextMeterSegment[];
  total: number;
  unit?: string;
  label?: string;
  className?: string;
}

/**
 * Segmented multi-band capacity meter showing used, reserved, and free capacity (bencho.dev).
 */
export function BenchoContextMeter({
  segments,
  total,
  unit = "$",
  label = "Daily Budget Utilization",
  className,
}: BenchoContextMeterProps) {
  const sumUsed = segments.reduce((acc, s) => acc + s.value, 0);
  const remaining = Math.max(0, total - sumUsed);

  return (
    <div className={cn("space-y-1.5 font-mono text-[11.5px]", className)}>
      <div className="flex items-center justify-between">
        <span className="text-[var(--muted,#838380)]">{label}</span>
        <span className="font-semibold tabular-nums text-[var(--ink,#141413)]">
          {unit}
          {sumUsed.toFixed(0)} / {unit}
          {total.toFixed(0)}
        </span>
      </div>

      <div className="flex h-3 w-full overflow-hidden rounded-md border border-[var(--line,#E8E6E1)] bg-[var(--soft,#F3F3F1)] p-[1.5px]">
        {segments.map((s, idx) => {
          const pct = (s.value / total) * 100;
          const bg =
            s.tone === "warn"
              ? "bg-amber-500"
              : s.tone === "danger"
                ? "bg-rose-500"
                : s.tone === "muted"
                  ? "bg-zinc-400"
                  : "bg-[var(--ok,#2D6A4F)]";

          return (
            <div
              key={`${idx}-${s.label}`}
              className={cn("h-full transition-all duration-300", bg)}
              style={{ width: `${pct}%` }}
              title={`${s.label}: ${unit}${s.value.toFixed(0)} (${pct.toFixed(1)}%)`}
            />
          );
        })}
        {remaining > 0 ? (
          <div
            className="h-full bg-transparent"
            style={{ width: `${(remaining / total) * 100}%` }}
            title={`Remaining: ${unit}${remaining.toFixed(0)}`}
          />
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-[10.5px] text-[var(--muted,#838380)]">
        <div className="flex flex-wrap items-center gap-3">
          {segments.map((s, idx) => (
            <span key={`${idx}-${s.label}`} className="flex items-center gap-1">
              <span
                className={cn(
                  "inline-block h-2 w-2 rounded-xs",
                  s.tone === "warn"
                    ? "bg-amber-500"
                    : s.tone === "danger"
                      ? "bg-rose-500"
                      : "bg-[var(--ok,#2D6A4F)]",
                )}
              />
              {s.label} ({unit}
              {s.value.toFixed(0)})
            </span>
          ))}
        </div>
        <span>
          Free: {unit}
          {remaining.toFixed(0)}
        </span>
      </div>
    </div>
  );
}

export interface BenchoRollingCounterProps {
  value: number | string;
  prefix?: string;
  suffix?: string;
  className?: string;
  testId?: string;
}

/**
 * Tabular odometer counter with smooth digit layout (bencho.dev).
 */
export function BenchoRollingCounter({
  value,
  prefix = "",
  suffix = "",
  className,
  testId,
}: BenchoRollingCounterProps) {
  const displayVal =
    typeof value === "number" ? value.toLocaleString("en-US") : value;

  return (
    <span
      data-testid={testId}
      className={cn(
        "inline-flex items-baseline font-mono font-bold tabular-nums text-[var(--ink,#141413)]",
        className,
      )}
    >
      {prefix ? <span className="opacity-80">{prefix}</span> : null}
      <span>{displayVal}</span>
      {suffix ? <span className="opacity-80">{suffix}</span> : null}
    </span>
  );
}

export interface BenchoTiltCardProps {
  children: ReactNode;
  maxTilt?: number;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

/**
 * Pointer-reactive 3D perspective card wrapper (bencho.dev/blocks/slosh).
 * Tilts subtly on mouse move with a specular radial glare.
 */
export function BenchoTiltCard({
  children,
  maxTilt = 4,
  className,
  style,
  onClick,
}: BenchoTiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState<string>("none");
  const [glare, setGlare] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x / rect.width - 0.5) * 2;
    const normY = (y / rect.height - 0.5) * 2;

    const rotX = -normY * maxTilt;
    const rotY = normX * maxTilt;

    setTransform(
      `perspective(800px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`,
    );
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.08,
    });
  };

  const handlePointerLeave = () => {
    setTransform("none");
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      style={{
        ...style,
        transform,
        transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className={cn("relative will-change-transform", className)}
    >
      {children}
      {/* Specular glare */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl select-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 60%)`,
        }}
        aria-hidden="true"
      />
    </div>
  );
}
