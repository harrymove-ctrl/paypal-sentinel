import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { CheckCycle } from "@/components/snap-cn/check-cycle";
import { PunchLines } from "@/components/snap-cn/punch-lines";
import { TextHighlight } from "@/components/snap-cn/text-highlight";
import { WordGather } from "@/components/snap-cn/word-gather";
import { PALETTE } from "../palette";
import { THEME } from "../theme";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export function ChapterTracksCard() {
  const frame = useCurrentFrame();
  const subIn = interpolate(frame, [35, 50], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.bgDeep, alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill style={{ transform: "translateY(-80px) scale(0.9)" }}>
        <WordGather
          text="All 5 Official Devpost Tracks."
          maxWidth={680}
          accent={PALETTE.emerald}
          fontFamily={THEME.fontSans}
          fontWeight={700}
          speed={1.0}
          theme={{ background: "transparent", foreground: PALETTE.ink }}
          mode="dark"
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 200,
          opacity: subIn,
          transform: `translateY(${(1 - subIn) * 12}px)`,
        }}
      >
        <TextHighlight
          before=""
          highlight="12 Live Patterns · A2A Settlement · HTTP 402"
          after=""
          preset="marker"
          baseColor={PALETTE.ink}
          accentColor={PALETTE.emerald}
          highlightedTextColor={PALETTE.ink}
          fontFamily={THEME.fontMono}
          fontSize={38}
          fontWeight={600}
          startAt={40}
          drawDuration={24}
          mode="dark"
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

export function ChapterChannel3Punch() {
  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.bgDeep }}>
      <PunchLines
        script="Channel3 Product Index. | $500 Rust Policy Cap. | Orders v2 Card *1881 Settled."
        styles="slide,slide,punch"
        sizes="0.9,0.9,1.15"
        holds="35,35,40"
        accentBeat={3}
        accentColor={PALETTE.emerald}
        lead={3}
        fontFamily={THEME.fontSans}
        fontSize={68}
        fontWeight={700}
        theme={{ background: "transparent", foreground: PALETTE.ink }}
        mode="dark"
      />
    </AbsoluteFill>
  );
}

export function ChapterRedteamCard() {
  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.bgDeep, alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 24, fontFamily: THEME.fontMono, color: PALETTE.danger, marginBottom: 16, letterSpacing: "0.1em" }}>
          ADVERSARIAL RED-TEAM TEST
        </div>
        <TextHighlight
          before="Spike to $850? "
          highlight="$0.00 Charged."
          after=" Replays return 409."
          preset="marker"
          baseColor={PALETTE.ink}
          accentColor={PALETTE.danger}
          highlightedTextColor="#ffffff"
          fontFamily={THEME.fontSans}
          fontSize={52}
          fontWeight={700}
          startAt={20}
          drawDuration={30}
          mode="dark"
        />
      </div>
    </AbsoluteFill>
  );
}

export function ChapterMcpCard() {
  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.bgDeep, alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 20, fontFamily: THEME.fontMono, color: PALETTE.paypalBlueBright, marginBottom: 12, letterSpacing: "0.08em" }}>
          @PAYPAL/AGENT-TOOLKIT + MCP
        </div>
        <div style={{ fontSize: 56, fontWeight: 800, color: PALETTE.ink, marginBottom: 12 }}>
          12-Tool Inspector & Chargeback Shield
        </div>
        <div style={{ fontSize: 20, fontFamily: THEME.fontMono, color: PALETTE.emerald }}>
          channel3_product_search · sentinel_dispute_evidence_shield · sentinel_batch_payout
        </div>
      </div>
    </AbsoluteFill>
  );
}

export function ChapterAgGridPunch() {
  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.bgDeep }}>
      <PunchLines
        script="AgGridReact v36 Telemetry. | Natural Language KPI Chips. | Export Live CSV Audit."
        styles="slide,slide,punch"
        sizes="0.9,0.9,1.15"
        holds="35,35,40"
        accentBeat={3}
        accentColor={PALETTE.emerald}
        lead={3}
        fontFamily={THEME.fontSans}
        fontSize={68}
        fontWeight={700}
        theme={{ background: "transparent", foreground: PALETTE.ink }}
        mode="dark"
      />
    </AbsoluteFill>
  );
}

export function ChapterBryntumCheck() {
  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.bgDeep, alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 900 }}>
        <CheckCycle
          headline="Bryntum Logistics &"
          words="7D / 14D / 30D Zoom, UPS & FedEx Carrier Sync, 1-Click DELIVERED Proof, 100% SLA Verified"
          fontFamily={THEME.fontSans}
          mode="dark"
        />
      </div>
    </AbsoluteFill>
  );
}
