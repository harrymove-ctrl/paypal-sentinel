#!/usr/bin/env node
// Automated 1920x1080 @ 30fps Live Browser Footage Capture for PayPal Sentinel
// Connects to http://127.0.0.1:4100/?debug=1 against live Next.js + Rust :4180
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync, unlinkSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const VIDEO_ROOT = path.resolve(import.meta.dirname, "..");
const FOOTAGE_DIR = path.join(VIDEO_ROOT, "public/footage");
const TEMP_RECORD_DIR = path.join(VIDEO_ROOT, "out/raw-takes");
const APP_URL = process.env.APP_URL || "http://127.0.0.1:4100/?debug=1";

mkdirSync(FOOTAGE_DIR, { recursive: true });
mkdirSync(TEMP_RECORD_DIR, { recursive: true });

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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function convertWebmToMp4(webmPath, mp4Path) {
  console.log(`Transcoding ${path.basename(webmPath)} -> ${path.basename(mp4Path)}...`);
  execFileSync("ffmpeg", [
    "-y",
    "-i", webmPath,
    "-c:v", "libx264",
    "-preset", "fast",
    "-crf", "18",
    "-pix_fmt", "yuv420p",
    "-r", "30",
    mp4Path,
  ], { stdio: "inherit" });
}

async function captureAllTakes() {
  const executablePath = findChrome();
  console.log(`Using Chrome: ${executablePath}`);

  const browser = await chromium.launch({
    executablePath,
    headless: true,
  });

  // =========================================================================
  // TAKE 1: 1-Click Judge Sandbox Seed + 5 Devpost Tracks & Live Pattern Settle
  // Target duration: ~28-30s
  // =========================================================================
  console.log("\n=== Starting Take 1: Sandbox Seed & 5 Devpost Tracks ===");
  {
    const takeDir = path.join(TEMP_RECORD_DIR, "take-01");
    mkdirSync(takeDir, { recursive: true });
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      recordVideo: { dir: takeDir, size: { width: 1920, height: 1080 } },
    });
    const page = await context.newPage();
    await page.goto(APP_URL, { waitUntil: "networkidle" });
    await sleep(1500);

    // 1. Seed Judge Sandbox clean state
    console.log("Seeding Judge Sandbox...");
    const seedBtn = page.getByTestId("seed-sandbox-btn");
    if (await seedBtn.isVisible()) {
      await seedBtn.click();
      await sleep(1200);
    }

    // 2. Open / Inspect PayPal + AI Pattern Studio
    console.log("Navigating 5 Devpost Tracks...");
    const studio = page.getByTestId("paypal-inspiration-studio");
    if (await studio.isVisible()) {
      await studio.scrollIntoViewIfNeeded();
      await sleep(800);

      // Track 1: AI Agents & A2A -> HTTP 402 Paywall
      await page.getByTestId("inspiration-track-ai_agents").click();
      await sleep(600);
      await page.getByTestId("inspiration-pattern-http402_crawler_paywall").click();
      await sleep(1500);

      // Track 2: Money Movement -> OSS PR Bounty
      await page.getByTestId("inspiration-track-money_movement").click();
      await sleep(600);
      await page.getByTestId("inspiration-pattern-oss_pr_bounty_payout").click();
      await sleep(1500);

      // Track 3: Business Solutions -> Dispute Evidence Shield & Multi Currency Invoice
      await page.getByTestId("inspiration-track-business_solutions").click();
      await sleep(600);
      await page.getByTestId("inspiration-pattern-dispute_evidence_shield").click();
      await sleep(1200);
      await page.getByTestId("inspiration-pattern-multi_currency_invoice").click();
      await sleep(1200);
      await page.getByTestId("inspiration-pattern-marketplace_split_checkout").click();
      await sleep(1200);

      // Track 4: Consumer Experiences -> Auto Budget & Chat Request
      await page.getByTestId("inspiration-track-consumer_experiences").click();
      await sleep(600);
      await page.getByTestId("inspiration-pattern-consumer_budget_categorizer").click();
      await sleep(1200);
      await page.getByTestId("inspiration-pattern-chat_request_money").click();
      await sleep(1200);

      // Track 5: Social Impact -> Multi-Cause Split
      await page.getByTestId("inspiration-track-social_impact").click();
      await sleep(600);
      await page.getByTestId("inspiration-pattern-social_impact_multi_cause").click();
      await sleep(1500);

      // Back to Track 1: AI Agents -> Settle live pattern via Sandbox!
      await page.getByTestId("inspiration-track-ai_agents").click();
      await sleep(600);
      await page.getByTestId("inspiration-pattern-a2a_negotiate_settle").click();
      await sleep(1000);

      console.log("Settling pattern live via PayPal Sandbox...");
      const executeBtn = page.getByTestId("execute-pattern-btn");
      if (await executeBtn.isVisible()) {
        await executeBtn.click();
        await sleep(3500);
      }
    }

    // Scroll back to top smoothly
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    await sleep(1500);

    const video = page.video();
    await page.close();
    await context.close();

    const videoPath = await video.path();
    const finalWebm = path.join(FOOTAGE_DIR, "take-01-sandbox-and-5-tracks.webm");
    const finalMp4 = path.join(FOOTAGE_DIR, "take-01-sandbox-and-5-tracks.mp4");
    renameSync(videoPath, finalWebm);
    await convertWebmToMp4(finalWebm, finalMp4);
  }

  // =========================================================================
  // TAKE 2: Channel3 Search + 1-Click Card *1881 Capture ($425 -> $870)
  // Target duration: ~26-28s
  // =========================================================================
  console.log("\n=== Starting Take 2: Channel3 Search & Direct Card Capture ===");
  {
    const takeDir = path.join(TEMP_RECORD_DIR, "take-02");
    mkdirSync(takeDir, { recursive: true });
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      recordVideo: { dir: takeDir, size: { width: 1920, height: 1080 } },
    });
    const page = await context.newPage();
    await page.goto(APP_URL, { waitUntil: "networkidle" });
    await sleep(1500);

    // Reset clean state
    await page.getByTestId("seed-sandbox-btn").click();
    await sleep(1200);

    // Type "monitor" into Channel3 search
    console.log("Searching Channel3 for monitor...");
    const searchInput = page.getByTestId("channel3-search-input");
    await searchInput.scrollIntoViewIfNeeded();
    await sleep(600);
    await searchInput.fill("monitor");
    await sleep(600);
    await page.getByTestId("channel3-search-btn").click();
    await sleep(1500);

    // Select the UltraSharp 4K Monitor
    console.log("Selecting UltraSharp 32 4K Monitor...");
    const monitorItem = page.getByTestId("channel3-item-CH3-MON-415");
    if (await monitorItem.isVisible()) {
      await monitorItem.click();
      await sleep(1500);
    }

    // Scroll up to 1-Click Card Capture
    console.log("Executing 1-Click Card *1881 Capture...");
    const captureBtn = page.getByTestId("direct-card-capture-btn");
    await captureBtn.scrollIntoViewIfNeeded();
    await sleep(800);
    await captureBtn.click();
    await sleep(4000);

    // Highlight the trace and the updated daily spend
    await sleep(2500);

    const video = page.video();
    await page.close();
    await context.close();

    const videoPath = await video.path();
    const finalWebm = path.join(FOOTAGE_DIR, "take-02-channel3-and-capture.webm");
    const finalMp4 = path.join(FOOTAGE_DIR, "take-02-channel3-and-capture.mp4");
    renameSync(videoPath, finalWebm);
    await convertWebmToMp4(finalWebm, finalMp4);
  }

  // =========================================================================
  // TAKE 3: Adversarial Guardrails & Interactive @paypal/mcp Inspector
  // Target duration: ~26-28s
  // =========================================================================
  console.log("\n=== Starting Take 3: Red-Team Guardrails & MCP Inspector ===");
  {
    const takeDir = path.join(TEMP_RECORD_DIR, "take-03");
    mkdirSync(takeDir, { recursive: true });
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      recordVideo: { dir: takeDir, size: { width: 1920, height: 1080 } },
    });
    const page = await context.newPage();
    await page.goto(APP_URL, { waitUntil: "networkidle" });
    await sleep(1500);

    // 1. Simulate $850 Overspend Guardrail Block
    console.log("Simulating $850 Overspend Block...");
    const overspendBtn = page.getByTestId("simulate-overspend-btn");
    await overspendBtn.scrollIntoViewIfNeeded();
    await sleep(800);
    await overspendBtn.click();
    await sleep(2200);

    // 2. Simulate INSTRUMENT_DECLINED
    console.log("Simulating INSTRUMENT_DECLINED...");
    const declineBtn = page.getByTestId("simulate-decline-btn");
    await declineBtn.click();
    await sleep(2200);

    // 3. Duplicate Key 409 & HMAC Webhook verification
    console.log("Triggering 409 Idempotency Replay Lock & HMAC Check...");
    await page.getByTestId("qa-replay-duplicate").click();
    await sleep(2000);
    await page.getByTestId("qa-verify-webhook").click();
    await sleep(2000);

    // 4. Interactive @paypal/mcp Tool Inspector
    console.log("Invoking @paypal/mcp Inspector tools...");
    const mcpSelect = page.getByTestId("mcp-tool-select");
    await mcpSelect.scrollIntoViewIfNeeded();
    await sleep(800);

    await mcpSelect.selectOption("channel3_product_search");
    await page.getByTestId("mcp-invoke-btn").click();
    await sleep(2000);

    await mcpSelect.selectOption("sentinel_dispute_evidence_shield");
    await page.getByTestId("mcp-invoke-btn").click();
    await sleep(2000);

    await mcpSelect.selectOption("sentinel_batch_payout");
    await page.getByTestId("mcp-invoke-btn").click();
    await sleep(2000);

    // 5. Open Receipt Drawer on first settled order and submit Dispute Shield
    console.log("Testing Receipt Drawer Dispute Shield...");
    const receiptBtn = page.getByRole("button", { name: "Receipt", exact: true }).first();
    if (await receiptBtn.isVisible()) {
      await receiptBtn.scrollIntoViewIfNeeded();
      await sleep(600);
      await receiptBtn.click();
      await sleep(1500);

      const disputeBtn = page.getByTestId("submit-dispute-shield-btn");
      if (await disputeBtn.isVisible()) {
        await disputeBtn.click();
        await sleep(2200);
      }
      const closeSheet = page.getByTestId("found-non-blocking-sheet").getByRole("button", { name: "Close", exact: true });
      if (await closeSheet.isVisible()) {
        await closeSheet.click();
        await sleep(1000);
      }
    }

    const video = page.video();
    await page.close();
    await context.close();

    const videoPath = await video.path();
    const finalWebm = path.join(FOOTAGE_DIR, "take-03-redteam-and-mcp.webm");
    const finalMp4 = path.join(FOOTAGE_DIR, "take-03-redteam-and-mcp.mp4");
    renameSync(videoPath, finalWebm);
    await convertWebmToMp4(finalWebm, finalMp4);
  }

  // =========================================================================
  // TAKE 4: AG Studio Grid + Bryntum Scheduler + Dock Views + BunUI Streak
  // Target duration: ~26-28s
  // =========================================================================
  console.log("\n=== Starting Take 4: AG Grid, Bryntum Scheduler & Streak Grid ===");
  {
    const takeDir = path.join(TEMP_RECORD_DIR, "take-04");
    mkdirSync(takeDir, { recursive: true });
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      recordVideo: { dir: takeDir, size: { width: 1920, height: 1080 } },
    });
    const page = await context.newPage();
    await page.goto(APP_URL, { waitUntil: "networkidle" });
    await sleep(1500);

    // 1. Variant B: AG Studio Enterprise Telemetry Grid
    console.log("Testing AG Studio Grid (AgGridReact v36)...");
    await page.getByTestId("variant-ledger").click();
    await sleep(1500);
    await page.getByTestId("studio-chip-high_risk_and_disputed").click();
    await sleep(1500);
    await page.getByTestId("studio-chip-direct_card_captures").click();
    await sleep(1500);
    const exportCsvBtn = page.getByRole("button", { name: "Export CSV" });
    if (await exportCsvBtn.isVisible()) {
      await exportCsvBtn.click();
      await sleep(1000);
    }

    // 2. Variant C: Bryntum Resource Timeline Scheduler
    console.log("Testing Bryntum Scheduler (7D/14D/30D & 1-Click DELIVERED)...");
    await page.getByTestId("variant-timeline").click();
    await sleep(1500);
    await page.getByTestId("scheduler-zoom-7d").click();
    await sleep(1000);
    await page.getByTestId("scheduler-zoom-30d").click();
    await sleep(1000);
    await page.getByTestId("scheduler-zoom-14d").click();
    await sleep(1000);
    const trackBtn = page.getByTestId("track-delivered-ms-02");
    if (await trackBtn.isVisible()) {
      await trackBtn.click();
      await sleep(2000);
    }

    // 3. Switch back to command and test Found Dock Views (Money, Clients)
    console.log("Testing Found Dock Views...");
    await page.getByTestId("variant-command").click();
    await sleep(1000);
    const dock = page.getByRole("navigation", { name: "Main navigation" });
    if (await dock.isVisible()) {
      await dock.getByRole("button", { name: "Money" }).click();
      await sleep(1800);
      await dock.getByRole("button", { name: "Clients" }).click();
      await sleep(1800);
      await dock.getByRole("button", { name: "Home" }).click();
      await sleep(1200);
    }

    // 4. Scroll down to BunUI Streak Grid
    console.log("Scrolling to BunUI Streak Grid...");
    const streakHeading = page.getByRole("heading", { name: "Project Impact & How I Build" });
    if (await streakHeading.isVisible()) {
      await streakHeading.scrollIntoViewIfNeeded();
      await sleep(2500);
    }

    const video = page.video();
    await page.close();
    await context.close();

    const videoPath = await video.path();
    const finalWebm = path.join(FOOTAGE_DIR, "take-04-ag-grid-and-bryntum.webm");
    const finalMp4 = path.join(FOOTAGE_DIR, "take-04-ag-grid-and-bryntum.mp4");
    renameSync(videoPath, finalWebm);
    await convertWebmToMp4(finalWebm, finalMp4);
  }

  await browser.close();
  console.log("\n=== ALL 4 TAKES CAPTURED AND TRANSCODED TO 1080P MP4! ===");
}

captureAllTakes().catch((err) => {
  console.error("Capture failed:", err);
  process.exit(1);
});
