# Test Infrastructure: `project_1` (PayPal Sentinel)

## Programmatic Verification Gates (`paypal-sandbox-dev-harness` + `rust-testing` + `ui-ux-qa`)

1. **Rust Spend-Policy Guardrail Engine (`backend-rust/`)**:
   - Run `cargo clippy --all-targets -- -D warnings` and `cargo test` to verify per-order caps, daily spend limits, merchant allowlists, idempotent `PayPal-Request-Id` locks, and webhook verification.
2. **Headless PayPal Orders v2 & Channel3 E2E (`node scripts/verify-paypal-sandbox.mjs`)**:
   - `POST /v1/oauth2/token` -> Channel3 live product query -> `POST /v2/checkout/orders` with `payment_source.card` (`4012888888881881`) -> `COMPLETED` capture -> `POST /v1/shipping/trackers-batch`.
3. **Deterministic Negative & Adversarial Testing**:
   - Test `PayPal-Mock-Response: {"mock_application_codes": "INSTRUMENT_DECLINED"}`, ACDC `card.name: "CCREJECT-IF"` (Insufficient Funds) and `"CCREJECT-SF"` (Suspected Fraud), plus prompt-injection overspend attempts blocked by Rust.
4. **1-Click Judge Sandbox Mode & Open-Source License Gate**:
   - Root `LICENSE` (`MIT`) committed for GitHub About visibility, and hosted URL operable with zero visitor API key setup.
5. **UI/UX 13-Point QA Gate (`ui-ux-qa`)**:
   - 3 UI variants, explicit `stateDiagram-v2` statechart, `?debug=1` hit-target overlay, WCAG 4.5:1 contrast, Playwright `.webm` recording, and deterministic Before/After screenshots.
