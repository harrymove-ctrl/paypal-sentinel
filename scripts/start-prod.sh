#!/usr/bin/env bash
set -euo pipefail

echo "[paypal-sentinel] Starting Rust Axum Guardrail & PayPal Sandbox Engine on 127.0.0.1:4180..."
PORT=4180 \
PAYPAL_ENVIRONMENT="${PAYPAL_ENVIRONMENT:-SANDBOX}" \
PAYPAL_BASE_URL="${PAYPAL_BASE_URL:-https://api-m.sandbox.paypal.com}" \
/usr/local/bin/paypal-sentinel-api &

RUST_PID=$!

# Wait briefly for Rust Axum health endpoint
for i in {1..20}; do
  if curl -sf http://127.0.0.1:4180/api/health >/dev/null 2>&1; then
    echo "[paypal-sentinel] Rust Axum Engine (:4180) is ONLINE."
    break
  fi
  sleep 0.25
done

echo "[paypal-sentinel] Starting Settlement Reconciliation Worker..."
WORKFLOW_INTERVAL_MS="${WORKFLOW_INTERVAL_MS:-60000}" \
RUST_API_URL="http://127.0.0.1:4180" \
node /app/scripts/settlement-workflow-worker.mjs &

WEB_PORT="${PORT:-4100}"
echo "[paypal-sentinel] Starting Next.js 16 Cockpit on 0.0.0.0:${WEB_PORT} (proxying /api/* -> http://127.0.0.1:4180)..."
cd /app/web
exec ./node_modules/.bin/next start --hostname 0.0.0.0 --port "${WEB_PORT}"
