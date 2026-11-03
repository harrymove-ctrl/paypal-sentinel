#!/usr/bin/env node
// Renders all SFX cues and both 120 BPM music stems (164.0s master + 44.0s launch) offline at 48 kHz stereo.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { build } from "esbuild";
import { chromium } from "playwright-core";

const root = path.resolve(import.meta.dirname, "..");
const SFX_DIR = path.join(root, "public/audio/sfx");
const AUDIO_DIR = path.join(root, "public/audio");

mkdirSync(SFX_DIR, { recursive: true });
mkdirSync(AUDIO_DIR, { recursive: true });

const app = (id) => ({ type: "appCue", spec: { id } });
const des = (kind, seconds, extra = {}) => ({ type: "designed", spec: { kind, seconds, ...extra } });

const SOUNDS = {
  "app-tap": app("app-tap"),
  "app-deal-stamp": app("app-deal-stamp"),
  "app-payday-chime": app("app-payday-chime"),
  "tx-orb-glass": des("orb-glass", 0.9),
  "tx-block-fan": des("block-fan", 0.35),
  "tx-bezel-dive": des("bezel-dive", 0.75),
  "tx-callout-open": des("callout-open", 0.16),
  "tx-riser-1bar": des("riser", 2.0),
  "tx-sub-impact": des("sub-impact", 0.65),
  "tx-orbit-whip": des("orbit-whip", 0.45),
};

const MAP = JSON.parse(readFileSync(path.join(root, "sound/music-map.json"), "utf8"));
const sections = (m) => m.map(([name, from, to]) => ({ name, from, to }));

function writeWav(file, base64, sr, normalise, keepFullLength = false) {
  const pcm = Buffer.from(base64, "base64");
  const samples = new Int16Array(pcm.buffer, pcm.byteOffset, pcm.length / 2);
  if (normalise) {
    let peak = 1;
    for (const v of samples) peak = Math.max(peak, Math.abs(v));
    const g = (32767 * 10 ** (-1 / 20)) / peak;
    for (let i = 0; i < samples.length; i++) {
      samples[i] = Math.max(-32768, Math.min(32767, Math.round(samples[i] * g)));
    }
  }
  let end = samples.length;
  if (!keepFullLength) {
    while (end > 2 && Math.abs(samples[end - 1]) < 8 && Math.abs(samples[end - 2]) < 8) end -= 2;
  }
  const body = Buffer.from(samples.buffer, samples.byteOffset, end * 2);
  const h = Buffer.alloc(44);
  h.write("RIFF", 0);
  h.writeUInt32LE(36 + body.length, 4);
  h.write("WAVEfmt ", 8);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20);
  h.writeUInt16LE(2, 22);
  h.writeUInt32LE(sr, 24);
  h.writeUInt32LE(sr * 4, 28);
  h.writeUInt16LE(4, 32);
  h.writeUInt16LE(16, 34);
  h.write("data", 36);
  h.writeUInt32LE(body.length, 40);
  writeFileSync(file, Buffer.concat([h, body]));
}

function findChrome() {
  const candidates = [
    process.env.BROWSER_EXECUTABLE,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Users/harryphan/Library/Caches/ms-playwright/chromium-1243/chrome-mac/Chromium.app/Contents/MacOS/Chromium",
  ].filter(Boolean);
  for (const c of candidates) {
    if (existsSync(c)) return c;
  }
  return undefined;
}

console.log("Bundling sound generator...");
const bundle = await build({
  entryPoints: [path.join(root, "sound/page.ts")],
  bundle: true,
  format: "iife",
  platform: "browser",
  write: false,
  logLevel: "warning",
});

const browser = await chromium.launch({
  executablePath: findChrome(),
  headless: true,
});
const page = await browser.newPage();
await page.setContent("<!doctype html><title>paypal-sentinel-sound</title>");
await page.addScriptTag({ content: bundle.outputFiles[0].text });

// 1. Render SFX
console.log("\nRendering SFX cues...");
for (const [name, def] of Object.entries(SOUNDS)) {
  const file = path.join(SFX_DIR, `${name}.wav`);
  process.stdout.write(`  - ${name}.wav `);
  const t0 = Date.now();
  const b64 = await page.evaluate(
    ({ type, spec }) => (window[type] ? window[type](spec) : null),
    def
  );
  if (!b64) throw new Error(`Render failed for ${name}`);
  writeWav(file, b64, 48000, true);
  console.log(`[OK, ${(Date.now() - t0)}ms]`);
}

// 2. Render Music Stems
console.log("\nRendering 120 BPM Instrumental Score Stems...");
{
  const file = path.join(AUDIO_DIR, "score-master.wav");
  process.stdout.write(`  - score-master.wav (${MAP.full.seconds}s = 82 bars @ 120 BPM) `);
  const t0 = Date.now();
  const b64 = await page.evaluate(
    ({ sec, dur }) => window.score(sec, dur),
    { sec: sections(MAP.full.sections), dur: MAP.full.seconds }
  );
  writeWav(file, b64, 48000, true, true);
  console.log(`[OK, ${(Date.now() - t0)}ms]`);
}

{
  const file = path.join(AUDIO_DIR, "score-x.wav");
  process.stdout.write(`  - score-x.wav (${MAP.x.seconds}s = 22 bars @ 120 BPM) `);
  const t0 = Date.now();
  const b64 = await page.evaluate(
    ({ sec, dur }) => window.score(sec, dur),
    { sec: sections(MAP.x.sections), dur: MAP.x.seconds }
  );
  writeWav(file, b64, 48000, true, true);
  console.log(`[OK, ${(Date.now() - t0)}ms]`);
}

await browser.close();
console.log("\n=== ALL SOUND ASSETS SYNTHESIZED SUCCESSFULLY! ===");
