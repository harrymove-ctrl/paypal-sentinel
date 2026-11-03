// Animated PayPal Sentinel Brand Emblem
import { interpolate, useCurrentFrame } from "remotion";
import { PALETTE } from "../palette";

export function SentinelMark({ size = 80 }: { size?: number }) {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame * 0.1) * 0.15 + 0.85;

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        {/* Shield Outer Outline */}
        <path
          d="M50 10 L82 24 V52 C82 72 50 90 50 90 C50 90 18 72 18 52 V24 L50 10Z"
          stroke={PALETTE.emerald}
          strokeWidth="3.5"
          fill="rgba(149, 249, 101, 0.08)"
          filter="drop-shadow(0 0 8px rgba(149, 249, 101, 0.4))"
        />

        {/* Inner PayPal 'P' Accent */}
        <path
          d="M40 32 H54 C60 32 64 36 64 42 C64 48 60 52 54 52 H44 V68 H38 V32 H40Z"
          fill={PALETTE.paypalBlueBright}
        />
        <path
          d="M46 40 H54 C57 40 59 42 59 45 C59 48 57 50 54 50 H46 V40Z"
          fill="#ffffff"
        />

        {/* Circuit Nodes */}
        <circle cx="50" cy="10" r="3.5" fill={PALETTE.emerald} />
        <circle cx="82" cy="24" r="3" fill={PALETTE.emerald} />
        <circle cx="18" cy="24" r="3" fill={PALETTE.emerald} />
        <circle cx="50" cy="90" r="3.5" fill={PALETTE.emerald} style={{ opacity: pulse }} />
      </svg>
    </div>
  );
}
