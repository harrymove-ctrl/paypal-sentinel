import "./index.css";
import { Composition } from "remotion";
import { MASTER_LAYOUT, PayPalSentinelMaster, PayPalSentinelLaunch, X_LAYOUT } from "./compositions";
import { FPS } from "./grid";

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="PayPalSentinelMaster"
        component={PayPalSentinelMaster}
        durationInFrames={MASTER_LAYOUT.total}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="PayPalSentinelLaunch"
        component={PayPalSentinelLaunch}
        durationInFrames={X_LAYOUT.total}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
}
