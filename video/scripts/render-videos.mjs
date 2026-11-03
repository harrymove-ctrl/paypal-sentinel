#!/usr/bin/env node
// Production Remotion H.264 1080p @ 30fps renderer for PayPal Sentinel:
//   - PayPalSentinelMaster (4,920 frames = 82 bars = 164.0s)
//   - PayPalSentinelLaunch (1,320 frames = 22 bars = 44.0s)
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { webpackOverride } from "../webpack-override.ts";

const VIDEO = path.resolve(import.meta.dirname, "..");
const OUT = path.join(VIDEO, "out");
const EXPORTS = path.resolve(VIDEO, "../docs/video/exports");
mkdirSync(OUT, { recursive: true });
mkdirSync(EXPORTS, { recursive: true });

const CHROME_MAC = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browserExecutable = existsSync(CHROME_MAC) ? CHROME_MAC : null;
const browserOpts = {
  browserExecutable,
  chromeMode: "chrome-for-testing",
  chromiumOptions: { gl: "angle" },
};

console.log("1. Bundling Remotion project with Webpack & Tailwind v4...");
const serveUrl = await bundle({
  entryPoint: path.join(VIDEO, "src/index.ts"),
  webpackOverride,
});

const targets = [
  {
    id: "PayPalSentinelLaunch",
    raw: path.join(OUT, "launch-raw.mp4"),
    final: path.join(EXPORTS, "paypal-sentinel-x-launch.mp4"),
    exactDur: "44.00",
    silStart: "39.50",
    silEnd: "40.00",
  },
  {
    id: "PayPalSentinelMaster",
    raw: path.join(OUT, "master-raw.mp4"),
    final: path.join(EXPORTS, "paypal-sentinel-hackathon-master.mp4"),
    exactDur: "164.00",
    silStart: "158.00",
    silEnd: "158.50",
  },
];

for (const tgt of targets) {
  const t0 = Date.now();
  const composition = await selectComposition({
    serveUrl,
    id: tgt.id,
    inputProps: { calloutMode: "normal" },
    ...browserOpts,
  });

  console.log(
    `\nRendering ${tgt.id} (${composition.durationInFrames} frames @ ${composition.fps}fps, ${composition.width}x${composition.height})...`
  );

  let lastPct = -1;
  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    crf: 17,
    pixelFormat: "yuv420p",
    audioCodec: "aac",
    outputLocation: tgt.raw,
    inputProps: { calloutMode: "normal" },
    concurrency: 8,
    ...browserOpts,
    onProgress: ({ progress }) => {
      const pct = Math.floor(progress * 10) * 10;
      if (pct !== lastPct) {
        lastPct = pct;
        console.log(`  [${tgt.id}] ${pct}%`);
      }
    },
  });

  const renderSec = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`Rendered raw ${tgt.id} -> ${path.relative(VIDEO, tgt.raw)} in ${renderSec}s`);

  // Two-Pass EBU R128 mastering with True-Peak brickwall limiter
  console.log(`Mastering ${tgt.id} audio (-14.0 LUFS, -1.5 dBTP) -> ${path.basename(tgt.final)}...`);
  const statsJson = execFileSync("ffmpeg", [
    "-hide_banner",
    "-nostats",
    "-i", tgt.raw,
    "-af", "loudnorm=I=-14.0:TP=-1.5:LRA=9:print_format=json",
    "-f", "null",
    "-",
  ], { encoding: "utf8" });

  const jsonMatch = statsJson.match(/\{[\s\S]*\}/);
  const loudStats = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

  const loudFilter = loudStats
    ? `loudnorm=I=-14.0:TP=-1.5:LRA=9:measured_I=${loudStats.input_i}:measured_TP=${loudStats.input_tp}:measured_LRA=${loudStats.input_lra}:measured_thresh=${loudStats.input_thresh}:offset=${loudStats.target_offset},aresample=48000,alimiter=limit=0.82:attack=2:release=30:level=false`
    : `loudnorm=I=-14.0:TP=-1.5:LRA=9,aresample=48000`;

  execFileSync("ffmpeg", [
    "-hide_banner",
    "-v", "error",
    "-y",
    "-i", tgt.raw,
    "-t", tgt.exactDur,
    "-c:v", "libx264",
    "-crf", "18",
    "-preset", "medium",
    "-pix_fmt", "yuv420p",
    "-af", loudFilter,
    "-c:a", "aac",
    "-b:a", "320k",
    "-ar", "48000",
    "-movflags", "+faststart",
    tgt.final,
  ], { stdio: "inherit" });

  console.log(`Exported final: ${tgt.final}`);
}

console.log("\n=== ALL VIDEO TARGETS RENDERED AND MASTERED SUCCESSFULLY! ===");
