// 2-Line Explainer Callout Component for PayPal Sentinel
// Spec: WHAT it is + WHY it helps you
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { PALETTE } from "../palette";
import { THEME } from "../theme";

export interface CalloutSpec {
  what: string;
  why: string;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  from: number;
  durationInFrames: number;
}

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export function Callout({ spec }: { spec: CalloutSpec }) {
  const frame = useCurrentFrame();
  const relFrame = frame - spec.from;

  if (relFrame < 0 || relFrame > spec.durationInFrames) {
    return null;
  }

  const opacity = interpolate(
    relFrame,
    [0, 10, spec.durationInFrames - 10, spec.durationInFrames],
    [0, 1, 1, 0],
    CLAMP
  );

  const translateY = interpolate(
    relFrame,
    [0, 12],
    [12, 0],
    { ...CLAMP, easing: Easing.out(Easing.cubic) }
  );

  const style: React.CSSProperties = {
    position: "absolute",
    top: spec.top,
    bottom: spec.bottom,
    left: spec.left,
    right: spec.right,
    width: 520,
    padding: "16px 20px",
    backgroundColor: "rgba(10, 14, 12, 0.92)",
    backdropFilter: "blur(16px)",
    borderRadius: 12,
    border: `1px solid ${PALETTE.emerald}`,
    boxShadow: `0 8px 32px rgba(0, 0, 0, 0.6), 0 0 16px ${PALETTE.emeraldGlow}`,
    color: PALETTE.ink,
    fontFamily: THEME.fontSans,
    opacity,
    transform: `translateY(${translateY}px)`,
    zIndex: 100,
    pointerEvents: "none",
  };

  return (
    <div style={style}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: PALETTE.emerald,
            boxShadow: `0 0 8px ${PALETTE.emerald}`,
          }}
        />
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: PALETTE.emerald,
            fontFamily: THEME.fontMono,
          }}
        >
          EXPLAINER CALLOUT
        </span>
      </div>

      <div style={{ fontSize: 15, fontWeight: 700, color: PALETTE.ink, marginBottom: 4, lineHeight: 1.3 }}>
        <span style={{ color: PALETTE.emerald, marginRight: 6 }}>WHAT:</span>
        {spec.what}
      </div>

      <div style={{ fontSize: 13, color: PALETTE.muted, lineHeight: 1.4 }}>
        <span style={{ color: PALETTE.paypalBlueBright, fontWeight: 600, marginRight: 6 }}>WHY:</span>
        {spec.why}
      </div>
    </div>
  );
}
