// Audio engine for PayPal Sentinel:
// 1. MusicBed: 120 BPM Instrumental Score (Master 164.0s / Launch 44.0s)
// 2. SfxTrack: Frame-accurate tactile and designed transition SFX cues
import { Audio, Sequence, interpolate, staticFile } from "remotion";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type SfxCueId =
  | "app-tap"
  | "app-deal-stamp"
  | "app-payday-chime"
  | "tx-orb-glass"
  | "tx-block-fan"
  | "tx-bezel-dive"
  | "tx-callout-open"
  | "tx-riser-1bar"
  | "tx-sub-impact"
  | "tx-orbit-whip";

interface CueEvent {
  at: number;
  cue: SfxCueId;
  gain?: number;
}

const DEFAULT_GAIN: Record<SfxCueId, number> = {
  "app-tap": 0.42,
  "app-deal-stamp": 0.70,
  "app-payday-chime": 0.65,
  "tx-orb-glass": 0.45,
  "tx-block-fan": 0.50,
  "tx-bezel-dive": 0.55,
  "tx-callout-open": 0.35,
  "tx-riser-1bar": 0.50,
  "tx-sub-impact": 0.75,
  "tx-orbit-whip": 0.55,
};

export const MASTER_SFX: CueEvent[] = [
  // Scene 1: Hook (0:00 to 0:08)
  { at: 0, cue: "tx-sub-impact" },
  { at: 60, cue: "tx-orb-glass" },
  { at: 120, cue: "tx-orb-glass" },
  { at: 180, cue: "app-payday-chime" },

  // Scene 2: Brand Lockup (0:08 to 0:12)
  { at: 240, cue: "tx-block-fan" },

  // Scene 3: Device Dive-In (0:12 to 0:24)
  { at: 360, cue: "tx-bezel-dive" },
  { at: 420, cue: "app-tap" },
  { at: 465, cue: "tx-callout-open" },

  // Scene 4: 5 Devpost Tracks & Live Pattern (0:24 to 0:52)
  { at: 720, cue: "tx-riser-1bar" },
  { at: 780, cue: "app-tap" },
  { at: 900, cue: "tx-callout-open" },
  { at: 1140, cue: "app-payday-chime" },

  // Scene 5: Channel3 & Card *1881 Capture (0:52 to 1:18)
  { at: 1560, cue: "tx-riser-1bar" },
  { at: 1680, cue: "app-tap" },
  { at: 1800, cue: "tx-callout-open" },
  { at: 1920, cue: "app-deal-stamp" },
  { at: 2010, cue: "app-payday-chime" },

  // Scene 6: Adversarial Red-Team Guardrails (1:18 to 1:44)
  { at: 2340, cue: "tx-sub-impact" },
  { at: 2430, cue: "app-deal-stamp" },
  { at: 2550, cue: "app-tap" },
  { at: 2640, cue: "tx-callout-open" },
  { at: 2790, cue: "app-payday-chime" },

  // Scene 7: MCP Inspector & Dispute Shield (1:44 to 2:04)
  { at: 3120, cue: "tx-orbit-whip" },
  { at: 3240, cue: "app-tap" },
  { at: 3360, cue: "tx-callout-open" },
  { at: 3540, cue: "app-deal-stamp" },

  // Scene 8: AG Studio Grid (2:04 to 2:24)
  { at: 3720, cue: "tx-riser-1bar" },
  { at: 3840, cue: "app-tap" },
  { at: 3960, cue: "tx-callout-open" },

  // Scene 9: Bryntum Scheduler & Trackers (2:24 to 2:38)
  { at: 4320, cue: "tx-riser-1bar" },
  { at: 4440, cue: "app-tap" },
  { at: 4560, cue: "app-payday-chime" },

  // Scene 10: End Lockup (2:38 to 2:44)
  { at: 4740, cue: "tx-sub-impact" },
  { at: 4800, cue: "app-payday-chime" },
];

export const X_SFX: CueEvent[] = [
  { at: 0, cue: "tx-sub-impact" },
  { at: 60, cue: "tx-orb-glass" },
  { at: 180, cue: "tx-block-fan" },
  { at: 240, cue: "tx-bezel-dive" },
  { at: 360, cue: "app-deal-stamp" },
  { at: 420, cue: "app-payday-chime" },
  { at: 600, cue: "tx-sub-impact" },
  { at: 720, cue: "app-tap" },
  { at: 840, cue: "tx-riser-1bar" },
  { at: 1080, cue: "app-payday-chime" },
  { at: 1200, cue: "tx-sub-impact" },
];

export function MasterAudio() {
  return (
    <>
      <Audio
        src={staticFile("audio/score-master.wav")}
        volume={(f) =>
          interpolate(f, [4860, 4920], [1, 0], CLAMP)
        }
      />
      {MASTER_SFX.map((evt, idx) => (
        <Sequence key={`master-sfx-${idx}`} from={evt.at} durationInFrames={90}>
          <Audio
            src={staticFile(`audio/sfx/${evt.cue}.wav`)}
            volume={evt.gain ?? DEFAULT_GAIN[evt.cue]}
          />
        </Sequence>
      ))}
    </>
  );
}

export function XClipAudio() {
  return (
    <>
      <Audio
        src={staticFile("audio/score-x.wav")}
        volume={(f) =>
          interpolate(f, [1260, 1320], [1, 0], CLAMP)
        }
      />
      {X_SFX.map((evt, idx) => (
        <Sequence key={`x-sfx-${idx}`} from={evt.at} durationInFrames={90}>
          <Audio
            src={staticFile(`audio/sfx/${evt.cue}.wav`)}
            volume={evt.gain ?? DEFAULT_GAIN[evt.cue]}
          />
        </Sequence>
      ))}
    </>
  );
}
