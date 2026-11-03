// Timeline assemblies for PayPal Sentinel:
//   - PayPalSentinelMaster (4,920 frames = 82 bars = 164.0s @ 30fps)
//   - PayPalSentinelLaunch (1,320 frames = 22 bars = 44.0s @ 30fps)
import { AbsoluteFill, Sequence } from "remotion";
import { MasterAudio, XClipAudio } from "./audio";
import { Footage } from "./Footage";
import { layout } from "./grid";
import { PALETTE } from "./palette";
import {
  ChapterAgGridPunch,
  ChapterBryntumCheck,
  ChapterChannel3Punch,
  ChapterMcpCard,
  ChapterRedteamCard,
  ChapterTracksCard,
} from "./scenes/ChapterCards";
import { EndLockup } from "./scenes/EndLockup";
import { BrandBlockReveal, LaptopBezelDive, OpeningSwarm } from "./scenes/Opening";
import { MASTER_SHOTS, X_SHOTS } from "./shots";

export const MASTER_LAYOUT = layout([
  ["S01", 4],   // Opening Swarm (Hook)
  ["S02", 2],   // Brand Lockup
  ["S03", 6],   // Laptop Dive-In
  ["S04", 2],   // Chapter Tracks Card
  ["S05", 12],  // Footage: 5 Devpost Tracks & Pattern Settle
  ["S06", 2],   // Chapter Channel3 Punch
  ["S07", 11],  // Footage: Channel3 Search & Card *1881 Capture
  ["S08", 2],   // Chapter Redteam Card
  ["S09", 11],  // Footage: $850 Overspend Block & 409 Lock
  ["S10", 2],   // Chapter MCP Card
  ["S11", 8],   // Footage: 12-Tool MCP Inspector & Dispute Shield
  ["S12", 2],   // Chapter AG Grid Punch
  ["S13", 8],   // Footage: AG Studio Grid Telemetry
  ["S14", 1],   // Chapter Bryntum Check
  ["S15", 6],   // Footage: Bryntum Timeline & 1-Click DELIVERED
  ["S16", 3],   // End Lockup & Open-Source CTA
] as const);

export const X_LAYOUT = layout([
  ["X01", 4],   // Opening Swarm
  ["X02", 5],   // Channel3 + Card Capture
  ["X03", 4],   // Red-Team $850 Block & 409
  ["X04", 4],   // 5 Devpost Tracks
  ["X05", 3],   // AG Grid & Bryntum DELIVERED
  ["X06", 2],   // End Lockup
] as const);

export function PayPalSentinelMaster() {
  const S = MASTER_LAYOUT.scenes;

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.bgDeep }}>
      <MasterAudio />

      {/* Scene 1: Hook */}
      <Sequence from={S.S01.from} durationInFrames={S.S01.frames} name="S01-OpeningSwarm">
        <OpeningSwarm />
      </Sequence>

      {/* Scene 2: Brand Lockup */}
      <Sequence from={S.S02.from} durationInFrames={S.S02.frames} name="S02-BrandBlockReveal">
        <BrandBlockReveal />
      </Sequence>

      {/* Scene 3: Device Dive-In */}
      <Sequence from={S.S03.from} durationInFrames={S.S03.frames} name="S03-LaptopBezelDive">
        <LaptopBezelDive />
      </Sequence>

      {/* Scene 4: 5 Devpost Tracks & 12 Patterns */}
      <Sequence from={S.S04.from} durationInFrames={S.S04.frames} name="S04-ChapterTracksCard">
        <ChapterTracksCard />
      </Sequence>
      <Sequence from={S.S05.from} durationInFrames={S.S05.frames} name="S05-PatternStudioFootage">
        <Footage shot={MASTER_SHOTS.S05} />
      </Sequence>

      {/* Scene 5: Channel3 Search & Card *1881 Capture */}
      <Sequence from={S.S06.from} durationInFrames={S.S06.frames} name="S06-ChapterChannel3Punch">
        <ChapterChannel3Punch />
      </Sequence>
      <Sequence from={S.S07.from} durationInFrames={S.S07.frames} name="S07-Channel3CaptureFootage">
        <Footage shot={MASTER_SHOTS.S07} />
      </Sequence>

      {/* Scene 6: Adversarial Red-Team Guardrails */}
      <Sequence from={S.S08.from} durationInFrames={S.S08.frames} name="S08-ChapterRedteamCard">
        <ChapterRedteamCard />
      </Sequence>
      <Sequence from={S.S09.from} durationInFrames={S.S09.frames} name="S09-RedTeamGuardrailsFootage">
        <Footage shot={MASTER_SHOTS.S09} />
      </Sequence>

      {/* Scene 7: MCP Inspector & Dispute Shield */}
      <Sequence from={S.S10.from} durationInFrames={S.S10.frames} name="S10-ChapterMcpCard">
        <ChapterMcpCard />
      </Sequence>
      <Sequence from={S.S11.from} durationInFrames={S.S11.frames} name="S11-McpDisputeFootage">
        <Footage shot={MASTER_SHOTS.S11} />
      </Sequence>

      {/* Scene 8: AG Studio Grid Telemetry */}
      <Sequence from={S.S12.from} durationInFrames={S.S12.frames} name="S12-ChapterAgGridPunch">
        <ChapterAgGridPunch />
      </Sequence>
      <Sequence from={S.S13.from} durationInFrames={S.S13.frames} name="S13-AgStudioFootage">
        <Footage shot={MASTER_SHOTS.S13} />
      </Sequence>

      {/* Scene 9: Bryntum Timeline & 1-Click DELIVERED */}
      <Sequence from={S.S14.from} durationInFrames={S.S14.frames} name="S14-ChapterBryntumCheck">
        <ChapterBryntumCheck />
      </Sequence>
      <Sequence from={S.S15.from} durationInFrames={S.S15.frames} name="S15-BryntumTimelineFootage">
        <Footage shot={MASTER_SHOTS.S15} />
      </Sequence>

      {/* Scene 10: End Lockup */}
      <Sequence from={S.S16.from} durationInFrames={S.S16.frames} name="S16-EndLockup">
        <EndLockup />
      </Sequence>
    </AbsoluteFill>
  );
}

export function PayPalSentinelLaunch() {
  const S = X_LAYOUT.scenes;

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.bgDeep }}>
      <XClipAudio />

      <Sequence from={S.X01.from} durationInFrames={S.X01.frames} name="X01-Opening">
        <OpeningSwarm fast={true} />
      </Sequence>

      <Sequence from={S.X02.from} durationInFrames={S.X02.frames} name="X02-Channel3Capture">
        <Footage shot={X_SHOTS.X02} />
      </Sequence>

      <Sequence from={S.X03.from} durationInFrames={S.X03.frames} name="X03-Redteam">
        <Footage shot={X_SHOTS.X03} />
      </Sequence>

      <Sequence from={S.X04.from} durationInFrames={S.X04.frames} name="X04-Tracks">
        <Footage shot={X_SHOTS.X04} />
      </Sequence>

      <Sequence from={S.X05.from} durationInFrames={S.X05.frames} name="X05-AgBryntum">
        <Footage shot={X_SHOTS.X05} />
      </Sequence>

      <Sequence from={S.X06.from} durationInFrames={S.X06.frames} name="X06-EndLockup">
        <EndLockup />
      </Sequence>
    </AbsoluteFill>
  );
}
