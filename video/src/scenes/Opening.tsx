import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BlockWordmark } from "@/components/snap-cn/block-wordmark";
import { LaptopFrame } from "@/components/snap-cn/laptop-frame";
import { OrbSwarm } from "@/components/snap-cn/orb-swarm";
import { SentinelMark } from "../components/SentinelMark";
import { Callout } from "../components/Callout";
import { PALETTE } from "../palette";
import { THEME } from "../theme";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export function OpeningSwarm({ fast = false }: { fast?: boolean }) {
  const script = fast
    ? "AI buys for you. | Raw cards leak. | Rust limits risk. | PayPal settles safe."
    : "You want AI to buy for your team. | You cannot hand an LLM a raw card. | Rust enforces every single dollar. | PayPal settles with buyer protection.";

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.bgDeep }}>
      <OrbSwarm
        script={script}
        background={PALETTE.bgDeep}
        ink={PALETTE.ink}
        orbColor={PALETTE.emerald}
        fontFamily={THEME.fontSans}
        softness={0}
        speed={fast ? 1.4 : 0.8}
        mode="dark"
      />
    </AbsoluteFill>
  );
}

export function BrandBlockReveal({ fast = false }: { fast?: boolean }) {
  const frame = useCurrentFrame();
  const speed = fast ? 1.8 : 1.0;
  const f = frame * speed;
  const markIn = interpolate(f, [40, 60], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.bgDeep }}>
      <BlockWordmark
        text="PAYPAL SENTINEL"
        fontFamily={THEME.fontSans}
        fontSize={96}
        color={PALETTE.emerald}
        colors={[
          PALETTE.emerald,
          PALETTE.paypalBlueBright,
          "#34d399",
          "#60a5fa",
          PALETTE.emerald,
          PALETTE.paypalBlueBright,
        ]}
        background="transparent"
        blockSizing="glyph"
        speed={speed}
        mode="dark"
      />

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          opacity: markIn,
          transform: `translateY(${(1 - markIn) * -16}px)`,
        }}
      >
        <div style={{ transform: "translateY(-140px)" }}>
          <SentinelMark size={96} />
        </div>
        <div
          style={{
            position: "absolute",
            top: "50%",
            marginTop: 90,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 24px",
            borderRadius: 999,
            background: "rgba(10, 14, 12, 0.9)",
            border: `1px solid ${PALETTE.emerald}`,
            boxShadow: `0 0 20px ${PALETTE.emeraldGlow}`,
          }}
        >
          <span
            style={{
              fontFamily: THEME.fontMono,
              fontSize: 14,
              letterSpacing: "0.08em",
              color: PALETTE.ink,
              fontWeight: 600,
            }}
          >
            Safe Agentic Commerce · Rust + PayPal AI
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

export function LaptopBezelDive() {
  const frame = useCurrentFrame();
  const yaw = interpolate(frame, [0, 120, 300], [12, 4, 0], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const pitch = interpolate(frame, [0, 120, 300], [8, 2, 0], CLAMP);
  const scale = interpolate(frame, [0, 120, 360], [0.82, 0.92, 1.05], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.bgDeep, overflow: "hidden" }}>
      <div
        style={{
          width: 1920,
          height: 1080,
          transform: `perspective(1200px) rotateY(${yaw}deg) rotateX(${pitch}deg) scale(${scale})`,
          transformOrigin: "center center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LaptopFrame
          screenSrc={staticFile("footage/take-01-sandbox-and-5-tracks.mp4")}
          mode="dark"
        />
      </div>

      <Callout
        spec={{
          what: "1-Click Judge Sandbox & 6 Sponsor Stack",
          why: "You test live PayPal Sandbox, APIMatic typed contracts, and Rust policy with zero setup.",
          bottom: 60,
          right: 60,
          from: 60,
          durationInFrames: 240,
        }}
      />
    </AbsoluteFill>
  );
}
