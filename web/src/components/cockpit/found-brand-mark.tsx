"use client";

import React, { useEffect, useState } from "react";

export type FoundMoodState =
  | "default"
  | "calm"
  | "curious"
  | "reading"
  | "surprised"
  | "happy"
  | "alert"
  | "thinking"
  | "sleep";

interface FoundBrandMarkProps {
  mood?: FoundMoodState | string;
  size?: "sm" | "md" | "lg";
  large?: boolean;
  bootDraw?: boolean;
  label?: string;
  sublabel?: string;
  interactive?: boolean;
  onClick?: () => void;
}

export function useFoundEyeTracking() {
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = ((e.clientX / Math.max(1, window.innerWidth)) - 0.5) * 4;
      const y = ((e.clientY / Math.max(1, window.innerHeight)) - 0.5) * 2.5;
      document.documentElement.style.setProperty("--found-eye-x", `${x.toFixed(2)}px`);
      document.documentElement.style.setProperty("--found-eye-y", `${y.toFixed(2)}px`);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
}

export function snapAwayElement(el: HTMLElement | null, cb: () => void) {
  if (!el) {
    cb();
    return;
  }
  el.style.transition = "transform 0.18s ease, opacity 0.18s ease";
  el.style.transform = "translateY(-8px) scale(0.97)";
  el.style.opacity = "0";
  setTimeout(() => {
    el.style.transition = "";
    el.style.transform = "";
    el.style.opacity = "";
    cb();
  }, 160);
}

export function FoundTiltCard({
  cardRef,
  children,
  className = "found-scard",
}: {
  cardRef?: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div ref={cardRef} className={className}>
      {children}
    </div>
  );
}

export function FoundBrandMark({
  size = "md",
  large = false,
  label,
  sublabel,
}: FoundBrandMarkProps) {
  const px = large || size === "lg" ? 36 : size === "sm" ? 26 : 30;

  return (
    <>
      <svg
        className="found-mk"
        width={px}
        height={px}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        data-testid="found-brand-mark"
      >
        <defs>
          <linearGradient id="sentinel-bg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0A192F" />
            <stop offset="100%" stopColor="#003087" />
          </linearGradient>
          <linearGradient id="sentinel-shield" x1="8" y1="6" x2="24" y2="26" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0070E0" />
          </linearGradient>
        </defs>
        {/* Rounded Square App Tile */}
        <rect
          x="0.5"
          y="0.5"
          width="31"
          height="31"
          rx="8"
          fill="url(#sentinel-bg)"
          stroke="rgba(255,255,255,0.16)"
        />
        {/* Outer Sentinel Shield Frame */}
        <path
          d="M16 5.5L24.5 9V15.8C24.5 21.1 20.9 25.4 16 26.8C11.1 25.4 7.5 21.1 7.5 15.8V9L16 5.5Z"
          fill="rgba(0, 112, 224, 0.22)"
          stroke="url(#sentinel-shield)"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        {/* PayPal Dual-P Geometric Monogram + Guardrail Check Inside Shield */}
        <path
          d="M13.2 11.2H17.4C19.1 11.2 20.2 12.1 19.9 13.8C19.6 15.3 18.4 16.2 16.7 16.2H14.6L13.9 20.2H11.8L13.2 11.2Z"
          fill="#FFFFFF"
        />
        <path
          d="M15.4 13.6H18.2C19.3 13.6 20.1 14.3 19.9 15.5C19.7 16.6 18.8 17.3 17.6 17.3H16.1L15.6 20.2H13.9L14.6 16.2H16.7C18.1 16.2 19.1 15.4 19.4 14.1"
          fill="#38BDF8"
          fillOpacity="0.9"
        />
      </svg>
      {label ? <span>{label}</span> : null}
      {sublabel ? (
        <span className="found-muted" style={{ fontSize: 12, fontWeight: 400 }}>
          {sublabel}
        </span>
      ) : null}
    </>
  );
}

/**
 * Exact Pixel Mood Meter from https://gofound.app/demo (pxMeter)
 */
interface PixelMoodMeterProps {
  score?: number;
  level?: number;
  cols?: number;
  rows?: number;
  big?: boolean;
  label?: string;
}

export function PixelMoodMeter({
  score = 72,
  level,
  cols,
  rows,
  big = false,
  label,
}: PixelMoodMeterProps) {
  const c = cols ?? (big ? 64 : 26);
  const r = rows ?? (big ? 3 : 2);
  const lv =
    typeof level === "number"
      ? Math.max(1, Math.min(4, level))
      : Math.max(
          1,
          Math.min(4, 1 + (Math.max(0, Math.min(100, score)) / 100) * 3),
        );

  const pct = 6 + ((lv - 1) / 3) * 88;
  let seed = Math.round(lv * 97 + c);
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const cells: Array<{ key: string; cls: string; opacity: string }> = [];
  for (let row = 0; row < r; row++) {
    for (let x = 0; x < c; x++) {
      const at = (x / Math.max(1, c - 1)) * 100;
      const lit = at <= pct;
      const band = at < 25 ? 1 : at < 50 ? 2 : at < 75 ? 3 : 4;
      const op = lit
        ? (
            0.3 +
            rnd() * 0.55 * Math.max(0.4, at / Math.max(1, pct))
          ).toFixed(2)
        : rnd() < 0.15
          ? "0.10"
          : "0.04";
      cells.push({
        key: `${row}-${x}`,
        cls: lit ? `b${band}` : "",
        opacity: op,
      });
    }
  }

  const moodClass = `m${Math.max(1, Math.min(4, Math.round(lv)))}`;

  return (
    <span
      className={`found-pmeter${big ? " big" : ""}`}
      role="img"
      aria-label={label || `Mood level ${lv.toFixed(1)}`}
    >
      <span
        className="found-pmx"
        style={{
          gridTemplateColumns: `repeat(${c}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${r}, 1fr)`,
        }}
      >
        {cells.map((cell) => (
          <i
            key={cell.key}
            className={cell.cls}
            style={{ opacity: Number(cell.opacity) }}
          />
        ))}
      </span>
      <span
        className={`found-pmb ${moodClass}`}
        style={{ left: `${pct.toFixed(1)}%` }}
      />
    </span>
  );
}

/**
 * Exact Full-Color Brand Icons from gofound.app/demo (brandFB + setIcon)
 */
export type FoundBrandName =
  | "slack"
  | "gmail"
  | "stripe"
  | "wise"
  | "paypal"
  | "xero"
  | "shopify"
  | "channel3"
  | "calendar"
  | "claude"
  | "brief"
  | "prefs"
  | "people"
  | "control"
  | "check"
  | "knows"
  | "about";

export function FoundBrandIcon({
  name,
  className = "",
}: {
  name: FoundBrandName;
  className?: string;
}) {
  switch (name) {
    case "slack":
      return (
        <span className={`found-bmark ${className}`.trim()}>
          <svg viewBox="0 0 256 256" aria-hidden="true">
            <path
              fill="#e01e5a"
              d="M53.841 161.32c0 14.832-11.987 26.82-26.819 26.82S.203 176.152.203 161.32c0-14.831 11.987-26.818 26.82-26.818H53.84zm13.41 0c0-14.831 11.987-26.818 26.819-26.818s26.819 11.987 26.819 26.819v67.047c0 14.832-11.987 26.82-26.82 26.82c-14.83 0-26.818-11.988-26.818-26.82z"
            />
            <path
              fill="#36c5f0"
              d="M94.07 53.638c-14.832 0-26.82-11.987-26.82-26.819S79.239 0 94.07 0s26.819 11.987 26.819 26.819v26.82zm0 13.613c14.832 0 26.819 11.987 26.819 26.819s-11.987 26.819-26.82 26.819H26.82C11.987 120.889 0 108.902 0 94.069c0-14.83 11.987-26.818 26.819-26.818z"
            />
            <path
              fill="#2eb67d"
              d="M201.55 94.07c0-14.832 11.987-26.82 26.818-26.82s26.82 11.988 26.82 26.82s-11.988 26.819-26.82 26.819H201.55zm-13.41 0c0 14.832-11.988 26.819-26.82 26.819c-14.831 0-26.818-11.987-26.818-26.82V26.82C134.502 11.987 146.489 0 161.32 0s26.819 11.987 26.819 26.819z"
            />
            <path
              fill="#ecb22e"
              d="M161.32 201.55c14.832 0 26.82 11.987 26.82 26.818s-11.988 26.82-26.82 26.82c-14.831 0-26.818-11.988-26.818-26.82V201.55zm0-13.41c-14.831 0-26.818-11.988-26.818-26.82c0-14.831 11.987-26.818 26.819-26.818h67.25c14.832 0 26.82 11.987 26.82 26.819s-11.988 26.819-26.82 26.819z"
            />
          </svg>
        </span>
      );
    case "gmail":
      return (
        <span className={`found-bmark ${className}`.trim()}>
          <svg viewBox="0 0 256 204" aria-hidden="true">
            <path
              fill="#3186ff"
              d="M200.7 26.2h55.3v160c0 9.6-7.8 17.5-17.5 17.5h-29.1a8.7 8.7 0 0 1-8.7-8.7z"
            />
            <path
              fill="#fc413d"
              d="M55.273 26.182H0v160c0 9.638 7.816 17.454 17.455 17.454h29.09a8.727 8.727 0 0 0 8.728-8.728z"
            />
            <path
              fill="#feb10c"
              d="M45.4 6.5c-11.7-9.8-29.1-8.3-38.9 3.4-9.8 11.7-8.3 29.1 3.4 38.9l110.6 93c4.3 3.6 10.6 3.6 15 0l110.6-93c11.7-9.8 13.2-27.2 3.4-38.9-9.8-11.7-27.2-13.2-38.9-3.4L128 75.9z"
            />
          </svg>
        </span>
      );
    case "stripe":
      return (
        <span className={`found-bmark ${className}`.trim()}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              className="bf-stripe"
              d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"
            />
          </svg>
        </span>
      );
    case "wise":
      return (
        <span className={`found-bmark ${className}`.trim()}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              className="bf-wise"
              d="M6.488 7.469 0 15.05h11.585l1.301-3.576H7.922l3.033-3.507.01-.092L8.993 4.48h8.873l-6.878 18.925h4.706L24 .595H2.543l3.945 6.874Z"
            />
          </svg>
        </span>
      );
    case "paypal":
      return (
        <span className={`found-bmark ${className}`.trim()}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#003087"
              d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 2.22A.859.859 0 0 1 5.792 1.5h7.246c3.712 0 6.08 1.883 5.542 5.47-.488 3.255-2.884 5.21-6.392 5.21H9.392a.86.86 0 0 0-.848.726l-1.468 8.431Z"
            />
            <path
              fill="#0079C1"
              d="M19.83 7.56c-.45 3.24-2.85 5.41-6.58 5.41h-2.52a.86.86 0 0 0-.85.73l-1.15 6.95-.33 1.98a.45.45 0 0 0 .44.52h3.11c.37 0 .69-.27.75-.64l.03-.16.6-3.78.04-.21a.76.76 0 0 1 .75-.64h.47c3.05 0 5.44-1.24 6.14-4.82.29-1.5.14-2.75-.67-3.63a3.01 3.01 0 0 0-.23-.21Z"
            />
          </svg>
        </span>
      );
    case "channel3":
      return (
        <span className={`found-bmark ${className}`.trim()}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#007AFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </span>
      );
    case "calendar":
      return (
        <span className={`found-bmark ${className}`.trim()}>
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
          </svg>
        </span>
      );
    case "claude":
      return (
        <span className={`found-bmark ${className}`.trim()}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 6.5h16v10H10l-4 3.5v-3.5H4z" />
          </svg>
        </span>
      );
    case "prefs":
      return (
        <span className={`found-bmark ${className}`.trim()}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
            <circle cx="16" cy="7" r="2" />
            <circle cx="10" cy="17" r="2" />
          </svg>
        </span>
      );
    case "control":
      return (
        <span className={`found-bmark ${className}`.trim()}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
          </svg>
        </span>
      );
    case "check":
      return (
        <span className={`found-bmark ${className}`.trim()}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
      );
    case "knows":
      return (
        <span className={`found-bmark ${className}`.trim()}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 4.5h10a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3z" />
            <path d="M5 17a3 3 0 0 1 3-3h10" />
          </svg>
        </span>
      );
    case "about":
    default:
      return (
        <span className={`found-bmark ${className}`.trim()}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 11v5.5M12 7.6v.4" />
          </svg>
        </span>
      );
  }
}

export function FoundSourceBadge({
  brand,
  label,
}: {
  brand: FoundBrandName;
  label: string;
}) {
  return (
    <span className="found-src2">
      <FoundBrandIcon name={brand} />
      <span>{label}</span>
    </span>
  );
}
