import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { SentinelMark } from "../components/SentinelMark";
import { PALETTE } from "../palette";
import { THEME } from "../theme";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export function EndLockup() {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 30], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PALETTE.bgDeep,
        alignItems: "center",
        justifyContent: "center",
        opacity: enter,
        transform: `scale(${interpolate(enter, [0, 1], [0.95, 1.0])})`,
      }}
    >
      <div style={{ transform: "translateY(-40px)", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SentinelMark size={110} />

        <div
          style={{
            marginTop: 24,
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: PALETTE.ink,
            fontFamily: THEME.fontSans,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span>PAYPAL</span>
          <span style={{ color: PALETTE.emerald }}>SENTINEL</span>
        </div>

        <div
          style={{
            marginTop: 8,
            fontSize: 22,
            fontFamily: THEME.fontMono,
            color: PALETTE.muted,
            letterSpacing: "0.06em",
          }}
        >
          Rust Policy Guardrails · PayPal Sandbox Orders v2 · @paypal/mcp
        </div>

        <div style={{ marginTop: 32, display: "flex", gap: 16 }}>
          <div
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: `1px solid ${PALETTE.emerald}`,
              background: "rgba(149, 249, 101, 0.08)",
              color: PALETTE.emerald,
              fontFamily: THEME.fontMono,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Live Cockpit: http://127.0.0.1:4100
          </div>
          <div
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: `1px solid ${PALETTE.paypalBlueBright}`,
              background: "rgba(37, 99, 235, 0.08)",
              color: PALETTE.paypalBlueBright,
              fontFamily: THEME.fontMono,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Rust Engine :4180
          </div>
          <div
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: "1px solid rgba(255, 255, 255, 0.15)",
              background: "rgba(255, 255, 255, 0.04)",
              color: PALETTE.ink,
              fontFamily: THEME.fontMono,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            MIT Open Source
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
