import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

const QA_DIR = path.resolve(__dirname, "../../docs/qa");

test.beforeAll(() => {
  fs.mkdirSync(QA_DIR, { recursive: true });
});

test("PayPal Sentinel clean progressive-disclosure redesign and full E2E verification", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/?debug=1");

  // 1. Live Rust Axum API connection and compact ?debug=1 QA bar
  await expect(page.getByTestId("rust-api-badge")).toContainText(
    "RUST AXUM :4180 LIVE",
  );
  await expect(page.getByTestId("qa-debug-bar")).toBeVisible();
  await expect(page.getByTestId("qa-debug-bar")).toContainText("OVERFLOW: 0px");

  // Reseed clean Judge Sandbox state before deterministic flow
  await page.getByTestId("seed-sandbox-btn").click();
  await expect(page.getByTestId("daily-spent-value")).toContainText("$425.00");

  // Anti-clutter invariant on Home default Brief tab:
  // Pattern Studio, Catalog Shop, and MCP JSON Inspector must NOT be stacked onto Brief!
  await expect(page.getByTestId("home-workspace-tabs")).toBeVisible();
  await expect(page.getByTestId("home-tab-brief")).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.getByTestId("paypal-inspiration-studio")).toBeHidden();
  await expect(page.getByTestId("found-console-section")).toBeHidden();
  await expect(page.getByTestId("mcp-tool-inspector")).toBeHidden();

  // Capture clean Home Brief screenshots (1440x900 & 1280x800) without QA bar clutter
  await page.getByTestId("toggle-debug").click();
  await expect(page.getByTestId("qa-debug-bar")).toBeHidden();

  await page.screenshot({
    path: path.join(QA_DIR, "variant-a-command-dark-1440.png"),
    fullPage: false,
  });

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.screenshot({
    path: path.join(QA_DIR, "after-desktop.png"),
    fullPage: false,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: path.join(QA_DIR, "after-mobile.png"),
    fullPage: false,
  });
  await page.setViewportSize({ width: 1440, height: 900 });

  // Verify Found Dock Navigation (Clients & clean single-column editorial Money)
  const dock = page.getByRole("navigation", { name: "Main navigation" });
  await dock.getByRole("button", { name: "Clients" }).click();
  await expect(
    page.getByRole("heading", { name: /Clients, leads & team/i }),
  ).toBeVisible();
  await page.screenshot({
    path: path.join(QA_DIR, "found-clients-view-1440.png"),
    fullPage: false,
  });

  await dock.getByRole("button", { name: "Money" }).click();
  await expect(
    page.getByRole("heading", {
      name: "You've kept $31,320 so far in November.",
    }),
  ).toBeVisible();
  await expect(page.getByTestId("money-guardrail-strip")).toBeVisible();
  await expect(page.getByTestId("money-guardrail-strip")).toContainText(
    "$425.00",
  );

  // Verify progressive disclosure on Money: recurring list collapsed to 3 items by default
  await expect(page.getByTestId("money-toggle-recurring-btn")).toContainText(
    "Show all 12",
  );

  // Interactive Money actions: Cancel duplicate Figma charge & Chase Acme via PayPal link
  await page.getByTestId("money-cancel-duplicate-btn").click();
  await expect(page.getByTestId("found-money-view")).toContainText(
    "Duplicate seat canceled",
  );
  await expect(page.getByTestId("found-undo-toast")).toBeVisible();

  // Opening a modal suppresses floating toast overlap
  await page.getByTestId("money-chase-acme-btn").click();
  await expect(page.getByTestId("found-reply-sheet")).toBeVisible();
  await expect(page.getByTestId("found-undo-toast")).toBeHidden();
  await page.getByTestId("reply-sheet-send-btn").click();
  await expect(page.getByTestId("found-money-view")).toContainText(
    "Link sent",
  );
  await page
    .getByTestId("found-undo-toast")
    .getByRole("button", { name: "Dismiss notification" })
    .click();
  await expect(page.getByTestId("found-undo-toast")).toBeHidden();

  // Verify 12 Patterns tab inside Money
  await page.getByTestId("money-tab-patterns").click();
  await expect(page.getByTestId("money-patterns-lab-container")).toBeVisible();
  await page.getByTestId("money-tab-now").click();

  await page.screenshot({
    path: path.join(QA_DIR, "found-money-view-1440.png"),
    fullPage: false,
  });

  // Return to Home and verify dedicated 12 Patterns tab
  await dock.getByRole("button", { name: "Home" }).click();
  await page.getByTestId("home-tab-patterns").click();
  await expect(page.getByTestId("paypal-inspiration-studio")).toBeVisible();

  await page.getByTestId("inspiration-pattern-http402_crawler_paywall").click();
  await expect(page.getByTestId("paypal-inspiration-studio")).toContainText(
    "HTTP 402 / L402 AI Crawler Paywall",
  );
  await page.getByTestId("inspiration-track-money_movement").click();
  await page.getByTestId("inspiration-pattern-oss_pr_bounty_payout").click();
  await expect(page.getByTestId("paypal-inspiration-studio")).toContainText(
    "Open-Source PR Bond & Instant Contributor",
  );
  await page.getByTestId("inspiration-track-business_solutions").click();
  await page.getByTestId("inspiration-pattern-dispute_evidence_shield").click();
  await expect(page.getByTestId("paypal-inspiration-studio")).toContainText(
    "Chargeback & SNAD Dispute Evidence Shield",
  );
  await page.getByTestId("inspiration-track-consumer_experiences").click();
  await page.getByTestId("inspiration-track-social_impact").click();
  await page.getByTestId("inspiration-track-ai_agents").click();

  // Execute pattern and verify clean PayPalReceiptDossier strip
  await page.getByTestId("execute-pattern-btn").click();
  await expect(page.getByTestId("pattern-receipt-card")).toBeVisible();
  await expect(page.getByTestId("pattern-receipt-card")).toContainText("RCPT-PP-");
  await expect(page.getByTestId("pattern-receipt-card")).toContainText("Net Received:");

  // 2. Switch to dedicated Agent Shop tab -> Channel3 search -> 1-click Visa *1881 capture
  await page.getByTestId("home-tab-shop").click();
  await expect(page.getByTestId("found-console-section")).toBeVisible();

  const searchInput = page.getByTestId("channel3-search-input");
  await searchInput.fill("monitor");
  await page.getByTestId("channel3-search-btn").click();
  await expect(page.getByTestId("channel3-item-CH3-MON-415")).toBeVisible();
  await page.screenshot({
    path: path.join(QA_DIR, "after-channel3-search-monitor.png"),
    fullPage: false,
  });
  await page.getByTestId("channel3-item-CH3-MON-415").click();

  await page.getByTestId("direct-card-capture-btn").click();
  await expect(page.getByTestId("daily-spent-value")).toContainText("$1180.00");

  // 3. Adversarial Red-Team checks: Overspend ($850), INSTRUMENT_DECLINED, Duplicate Key 409, HMAC Webhook
  await page.getByTestId("toggle-debug").click();
  await page.getByTestId("simulate-overspend-btn").click();
  await expect(page.getByTestId("guardrail-alert")).toContainText(
    "SINGLE_ORDER_CAP_EXCEEDED",
  );

  await page.getByTestId("simulate-decline-btn").click();
  await expect(page.getByTestId("guardrail-alert")).toContainText(
    "INSTRUMENT_DECLINED",
  );

  await page.getByTestId("qa-replay-duplicate").click();
  await expect(page.getByTestId("guardrail-alert")).toContainText(
    "DUPLICATE_IDEMPOTENCY_KEY",
  );

  await page.getByTestId("qa-verify-webhook").click();
  await expect(page.getByTestId("qa-debug-bar")).toContainText(
    "HMAC-SHA256 Verified (Constant-Time Rust Check PASS)",
  );

  // Open Receipt Drawer on the first settled order and verify clean 3-tab Receipt | Shield | JSON layout
  await page.getByTestId("toggle-debug").click();
  await page
    .locator('[data-testid^="order-card-"]', { hasText: "Settled" })
    .first()
    .getByRole("button", { name: "Receipt", exact: true })
    .click();
  await expect(page.getByTestId("found-non-blocking-sheet")).toBeVisible();
  await expect(page.getByTestId("sheet-tab-receipt")).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.getByTestId("sheet-raw-paypal-json")).toBeHidden();
  await expect(page.getByTestId("dispute-shield-panel")).toBeHidden();

  // Switch to Dispute Shield tab inside Receipt Modal
  await page.getByTestId("sheet-tab-shield").click();
  await expect(page.getByTestId("dispute-shield-panel")).toBeVisible();
  await page.getByTestId("submit-dispute-shield-btn").click();
  await expect(page.getByTestId("dispute-shield-result")).toContainText(
    "EVIDENCE_SUBMITTED_SELLER_PROTECTED",
  );
  await page.screenshot({
    path: path.join(QA_DIR, "receipt-drawer-dispute-shield.png"),
    fullPage: false,
  });

  // Switch to Raw JSON tab inside Receipt Modal
  await page.getByTestId("sheet-tab-json").click();
  await expect(page.getByTestId("sheet-raw-paypal-json")).toBeVisible();

  await page
    .getByTestId("found-non-blocking-sheet")
    .getByRole("button", { name: "Close", exact: true })
    .click();

  // 4. Switch to dedicated MCP & Proof tab -> @paypal/mcp Tool Inspector + Streak Grid
  await page.getByTestId("home-tab-mcp").click();
  await expect(page.getByTestId("mcp-tool-inspector")).toBeVisible();
  await page
    .getByTestId("mcp-tool-select")
    .selectOption("channel3_product_search");
  await page.getByTestId("mcp-invoke-btn").click();
  await expect(page.getByTestId("mcp-output-pre")).toContainText(
    "PAYPAL-HACKATHON-2026",
  );
  await expect(page.getByTestId("mcp-output-pre")).toContainText('"agentic"');

  await page
    .getByTestId("mcp-tool-select")
    .selectOption("sentinel_dispute_evidence_shield");
  await page.getByTestId("mcp-invoke-btn").click();
  await expect(page.getByTestId("mcp-output-pre")).toContainText(
    "EVIDENCE_SUBMITTED_SELLER_PROTECTED",
  );

  const streakHeading = page.getByRole("heading", {
    name: "Project Impact & How I Build",
  });
  await expect(streakHeading).toBeVisible();
  await streakHeading.scrollIntoViewIfNeeded();
  await page.screenshot({
    path: path.join(QA_DIR, "streak-impact-cards-1440.png"),
    fullPage: false,
  });

  // 5. Longest Realistic Value Stress Test + Variant B + Variant C
  await page.getByTestId("toggle-debug").click();
  await page.getByTestId("qa-stress-long").click();
  const desktopOverflow = await page.evaluate(() =>
    Math.max(
      0,
      document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    ),
  );
  expect(desktopOverflow).toBe(0);

  await page.screenshot({
    path: path.join(QA_DIR, "variant-a-command-light-stress-1440.png"),
    fullPage: false,
  });
  await page.getByTestId("qa-stress-long").click();

  // 6. Variant B: AG Studio Enterprise Grid
  await page.getByTestId("variant-ledger").click();
  await expect(page.getByTestId("ag-studio-ledger-section")).toBeVisible();
  await page.getByTestId("studio-chip-high_risk_and_disputed").click();
  await page.getByTestId("studio-chip-direct_card_captures").click();
  await page.screenshot({
    path: path.join(QA_DIR, "variant-b-ag-studio-grid-1440.png"),
    fullPage: false,
  });

  // 7. Variant C: Bryntum Procurement Scheduler + 1-Click PayPal Shipment Tracking DELIVERED
  await page.getByTestId("variant-timeline").click();
  await expect(page.getByTestId("bryntum-scheduler-section")).toBeVisible();
  await page.getByTestId("scheduler-zoom-7d").click();
  await page.getByTestId("scheduler-zoom-30d").click();
  await page.getByTestId("scheduler-zoom-14d").click();
  await page.getByTestId("track-delivered-ms-02").click();
  await expect(page.getByTestId("scheduler-row-ms-02")).toContainText(
    "DELIVERED",
  );
  await page.screenshot({
    path: path.join(QA_DIR, "variant-c-bryntum-scheduler-1440.png"),
    fullPage: false,
  });

  // 8. Mobile Viewport (390x844 & 375x812) Geometry & Zero Horizontal Overflow Audit
  await page.getByTestId("variant-command").click();
  await page.getByTestId("home-tab-brief").click();
  await page.getByTestId("toggle-debug").click();

  await page.setViewportSize({ width: 375, height: 812 });
  const mobileOverflow = await page.evaluate(() =>
    Math.max(
      0,
      document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    ),
  );
  expect(mobileOverflow).toBe(0);
  await page.screenshot({
    path: path.join(QA_DIR, "mobile-command-dark-375.png"),
    fullPage: false,
  });
});

test("PayPal Sentinel 12-pattern live execution sweep and receipt matrix", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/?debug=1");
  await page.getByTestId("seed-sandbox-btn").click();
  await page.getByTestId("toggle-debug").click();

  // Switch to Money view -> 12 Patterns tab
  const dock = page.getByRole("navigation", { name: "Main navigation" });
  await dock.getByRole("button", { name: "Money" }).click();
  await page.getByTestId("money-tab-patterns").click();
  await expect(page.getByTestId("money-patterns-lab-container")).toBeVisible();

  // Click Run All 12 Patterns auto-runner
  await page.getByTestId("run-all-12-patterns-btn").click();
  await expect(page.getByTestId("all-12-patterns-results-table")).toBeVisible({
    timeout: 20000,
  });
  await expect(page.getByTestId("all-12-patterns-results-table")).toContainText(
    "12 Verified",
  );

  // Capture screenshot of live 12-pattern results while table is expanded
  await page.screenshot({
    path: path.join(QA_DIR, "all-12-patterns-verified-1440.png"),
    fullPage: false,
  });

  // Switch back to Overview tab and verify reactive session delta
  await page.getByTestId("money-tab-now").click();
  await expect(page.getByTestId("money-live-session-delta")).toBeVisible();
});
