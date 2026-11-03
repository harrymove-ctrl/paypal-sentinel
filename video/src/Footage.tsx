// 3D Perspective Footage Rig with Explainer Callouts
import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Callout } from "./components/Callout";
import { PALETTE } from "./palette";
import type { CamKey, ShotSpec } from "./shots";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

interface CameraPose {
  scale: number;
  tx: number;
  ty: number;
  yaw: number;
}

function sampleCamera(keys: CamKey[], frame: number, w: number, h: number): CameraPose {
  if (keys.length === 1 || frame <= keys[0].at) {
    const k = keys[0];
    return { scale: k.scale, tx: k.panX ?? 0, ty: k.panY ?? 0, yaw: k.yaw ?? 0 };
  }
  const last = keys[keys.length - 1];
  if (frame >= last.at) {
    return { scale: last.scale, tx: last.panX ?? 0, ty: last.panY ?? 0, yaw: last.yaw ?? 0 };
  }
  let i = 0;
  while (i < keys.length - 2 && frame >= keys[i + 1].at) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const t = interpolate(frame, [a.at, b.at], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  return {
    scale: a.scale + (b.scale - a.scale) * t,
    tx: (a.panX ?? 0) + ((b.panX ?? 0) - (a.panX ?? 0)) * t,
    ty: (a.panY ?? 0) + ((b.panY ?? 0) - (a.panY ?? 0)) * t,
    yaw: (a.yaw ?? 0) + ((b.yaw ?? 0) - (a.yaw ?? 0)) * t,
  };
}

export function Footage({ shot }: { shot: ShotSpec }) {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const cam = sampleCamera(shot.camKeys, frame, width, height);

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.bgDeep, overflow: "hidden" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `perspective(1200px) rotateY(${cam.yaw}deg) scale(${cam.scale}) translate(${cam.tx}px, ${cam.ty}px)`,
          transformOrigin: "center center",
          transition: "transform 0.1s linear",
        }}
      >
        <OffthreadVideo
          src={shot.src}
          startFrom={shot.startFromFrame ?? 0}
          playbackRate={shot.playbackRate ?? 1.0}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {shot.callout && <Callout spec={shot.callout} />}
    </AbsoluteFill>
  );
}
