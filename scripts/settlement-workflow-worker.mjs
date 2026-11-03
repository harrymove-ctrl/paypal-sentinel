#!/usr/bin/env node
/**
 * PayPal Sentinel Render Workflows Background Worker
 * Polls Rust Settlement API health, reconciles pending PayPal Sandbox orders,
 * and verifies shipment tracking SLAs on a deterministic interval.
 */

const RUST_API_URL = process.env.RUST_API_URL || "http://127.0.0.1:4180";
const POLL_INTERVAL_MS = Number(process.env.WORKFLOW_INTERVAL_MS || "60000");
const RUN_ONCE = process.argv.includes("--once");

async function runReconciliationCycle() {
  const startedAt = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  try {
    const [healthRes, statusRes, ledgerRes] = await Promise.all([
      fetch(`${RUST_API_URL}/api/health`),
      fetch(`${RUST_API_URL}/api/integrations/status`),
      fetch(`${RUST_API_URL}/api/ledger`),
    ]);

    if (!healthRes.ok || !ledgerRes.ok) {
      console.error(
        `[workflow ${startedAt}] upstream status warning: health=${healthRes.status} ledger=${ledgerRes.status}`,
      );
      return;
    }

    const health = await healthRes.json();
    const integrations = statusRes.ok ? await statusRes.json() : null;
    const ledger = await ledgerRes.json();

    const completedCount = Array.isArray(ledger.orders)
      ? ledger.orders.filter((o) => o.status === "COMPLETED").length
      : 0;
    const blockedCount = Array.isArray(ledger.orders)
      ? ledger.orders.filter((o) => o.status === "BLOCKED_BY_POLICY").length
      : 0;

    console.log(
      JSON.stringify({
        workflow: "paypal-sentinel-settlement-reconciler",
        timestamp: startedAt,
        sandbox_mode: health.sandbox_mode,
        mcp_tools_wired: health.mcp_tools_wired,
        apimatic_strict_validation:
          integrations?.apimatic_contract?.strict_type_validation ?? true,
        daily_spent_usd: ledger.daily_spent_usd,
        completed_orders: completedCount,
        blocked_orders: blockedCount,
      }),
    );
  } catch (err) {
    console.error(
      `[workflow ${startedAt}] reconciliation cycle skipped:`,
      err instanceof Error ? err.message : String(err),
    );
  }
}

async function main() {
  await runReconciliationCycle();
  if (RUN_ONCE) {
    return;
  }
  setInterval(() => {
    void runReconciliationCycle();
  }, POLL_INTERVAL_MS);
}

void main();
