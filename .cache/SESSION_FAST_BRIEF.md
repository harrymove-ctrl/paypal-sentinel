# Session Fast Cache Brief

Deterministic codebase index generated in 430ms. Use this brief to eliminate exploratory file reads and prevent Playwright timeout errors.

## 1. Quick Stats & System Endpoints

| Metric | Value | Notes |
| :--- | :--- | :--- |
| Files Scanned | 24 files | web/src and backend-rust/src |
| Exported Symbols | 173 symbols | Indexed with exact line numbers |
| Test ID Locators | 75 test IDs | 63 always mounted, 12 conditional |
| Next.js Frontend Port | http://127.0.0.1:4100 | Verified in web/package.json |
| Rust Axum Backend Port | http://127.0.0.1:4180 | Verified in backend-rust/src/main.rs |

## 2. API Routes Index

| Method | Route | Runtime | Source File |
| :--- | :--- | :--- | :--- |
| `POST / GET` | `/api/mcp/sdk-bridge` | Next.js App Router | `web/src/app/api/mcp/sdk-bridge/route.ts` |
| `GET` | `/api/health` | Rust Axum API | `backend-rust/src/lib.rs` |
| `GET` | `/api/ledger` | Rust Axum API | `backend-rust/src/lib.rs` |
| `GET` | `/api/integrations/status` | Rust Axum API | `backend-rust/src/lib.rs` |
| `GET` | `/api/channel3/search` | Rust Axum API | `backend-rust/src/lib.rs` |
| `GET` | `/api/mcp/tools` | Rust Axum API | `backend-rust/src/lib.rs` |
| `POST` | `/api/mcp/invoke` | Rust Axum API | `backend-rust/src/lib.rs` |
| `POST` | `/api/sandbox/seed` | Rust Axum API | `backend-rust/src/lib.rs` |
| `POST` | `/api/agent/execute` | Rust Axum API | `backend-rust/src/lib.rs` |
| `POST` | `/api/orders/:id/capture` | Rust Axum API | `backend-rust/src/lib.rs` |
| `POST` | `/api/orders/:id/dispute` | Rust Axum API | `backend-rust/src/lib.rs` |
| `POST` | `/api/orders/:id/tracking` | Rust Axum API | `backend-rust/src/lib.rs` |
| `POST` | `/api/policy/update` | Rust Axum API | `backend-rust/src/lib.rs` |
| `POST` | `/api/webhooks/verify` | Rust Axum API | `backend-rust/src/lib.rs` |
| `POST` | `/api/webhooks/sample-signature` | Rust Axum API | `backend-rust/src/lib.rs` |
| `GET` | `/api/patterns/catalog` | Rust Axum API | `backend-rust/src/lib.rs` |
| `POST` | `/api/patterns/execute` | Rust Axum API | `backend-rust/src/lib.rs` |
| `POST` | `/v1/search` | Rust Axum API | `backend-rust/src/lib.rs` |

## 3. High-Priority data-testid Locators

Always target always mounted selectors for initial load verification. Never wait 30 seconds for conditional error or modal selectors.

| Locator Selector | Mount Status | Source File | Line |
| :--- | :--- | :--- | :--- |
| `[data-testid="paypal-inspiration-studio"]` | **always mounted** | `web/src/components/cockpit/found-inspiration-studio.tsx` | Line 635 |
| `[data-testid="ag-studio-ledger-section"]` | **always mounted** | `web/src/components/cockpit/ag-studio-ledger-panel.tsx` | Line 324 |
| `[data-testid="bryntum-scheduler-section"]` | **always mounted** | `web/src/components/cockpit/bryntum-procurement-scheduler.tsx` | Line 146 |
| `[data-testid="sponsor-status-strip"]` | **always mounted** | `web/src/components/cockpit/sponsor-status-strip.tsx` | Line 88 |
| `[data-testid="bunui-streak-grid"]` | **always mounted** | `web/src/components/ui/streak-grid.tsx` | Line 457 |
| `[data-testid="found-command-palette"]` | **always mounted** | `web/src/components/cockpit/found-overlays.tsx` | Line 178 |
| `[data-testid="found-money-view"]` | **always mounted** | `web/src/components/cockpit/found-views.tsx` | Line 562 |
| `[data-testid="channel3-search-input"]` | **always mounted** | `web/src/components/cockpit/paypal-sentinel-cockpit.tsx` | Line 1891 |
| `[data-testid="seed-sandbox-btn"]` | **always mounted** | `web/src/components/cockpit/paypal-sentinel-cockpit.tsx` | Line 1165 |
| `[data-testid="execute-pattern-btn"]` | **always mounted** | `web/src/components/cockpit/found-inspiration-studio.tsx` | Line 743 |
| `[data-testid="pattern-error-banner"]` | **conditional** | `web/src/components/cockpit/found-inspiration-studio.tsx` | Line 755 |
| `[data-testid="ag-quick-filter"]` | always mounted | `web/src/components/cockpit/ag-studio-ledger-panel.tsx` | Line 345 |
| `[data-testid="export-csv-btn"]` | always mounted | `web/src/components/cockpit/ag-studio-ledger-panel.tsx` | Line 353 |
| `[data-testid="ag-studio-prompt-input"]` | always mounted | `web/src/components/cockpit/ag-studio-ledger-panel.tsx` | Line 380 |
| `[data-testid="ag-studio-prompt-submit"]` | always mounted | `web/src/components/cockpit/ag-studio-ledger-panel.tsx` | Line 393 |
| `[data-testid="studio-chip-${preset.id}"]` | always mounted | `web/src/components/cockpit/ag-studio-ledger-panel.tsx` | Line 407 |
| `[data-testid="ag-studio-kpi-cards"]` | always mounted | `web/src/components/cockpit/ag-studio-ledger-panel.tsx` | Line 423 |
| `[data-testid="ag-grid-container"]` | always mounted | `web/src/components/cockpit/ag-studio-ledger-panel.tsx` | Line 487 |
| `[data-testid="scheduler-zoom-${level}"]` | always mounted | `web/src/components/cockpit/bryntum-procurement-scheduler.tsx` | Line 174 |
| `[data-testid="scheduler-row-${lane.ms.id}"]` | always mounted | `web/src/components/cockpit/bryntum-procurement-scheduler.tsx` | Line 216 |
| `[data-testid="track-transit-${lane.ms.id}"]` | always mounted | `web/src/components/cockpit/bryntum-procurement-scheduler.tsx` | Line 278 |
| `[data-testid="track-delivered-${lane.ms.id}"]` | always mounted | `web/src/components/cockpit/bryntum-procurement-scheduler.tsx` | Line 295 |
| `[data-testid="found-brand-mark"]` | always mounted | `web/src/components/cockpit/found-brand-mark.tsx` | Line 104 |
| `[data-testid="inspiration-track-${t.id}"]` | conditional | `web/src/components/cockpit/found-inspiration-studio.tsx` | Line 654 |
| `[data-testid="inspiration-pattern-${pat.id}"]` | always mounted | `web/src/components/cockpit/found-inspiration-studio.tsx` | Line 672 |
| `[data-testid="pattern-amount-input"]` | always mounted | `web/src/components/cockpit/found-inspiration-studio.tsx` | Line 736 |

## 4. Reference UI Libraries & Locked Theme Tokens

| Reference Library | Source Domain | Application In Codebase |
| :--- | :--- | :--- |
| Found Warm Paper Theme | `gofound.app/demo` | Warm paper canvas #FDFDFC, tactile cards, ledger panel, and inspiration studio |
| Interfere Design System | `design.interfere.com` | Recessed shell frame, 13-step typography scale, and semantic CSS tokens |
| DitherCN Shader Blocks | `dithercn.dev` | Dither Canvas, scanline shader, and Bayer matrix effects |
| MDXCN Interactive Docs | `mdxcn.dev` | Interactive markdown documentation figures and code blocks |
| Bencho Slosh Blocks | `bencho.dev/blocks/slosh` | Fluid liquid badges, interactive progress strips, and streak components |

## 5. Session Execution Guardrails

1. **Never build unrequested meta-pages**: Never create standalone Design Spec or styleguide tabs when reference design URLs are shared. Integrate tokens directly into product screens.
2. **Single locked theme**: Keep the warm paper Found theme (#FDFDFC) locked. Do not inject theme selectors or light dark toggles unless requested.
3. **Zero unrelated telemetry**: Never import foreign ecosystem strings (such as Sui Mainnet gRPC or external partner objects) into PayPal projects.
4. **Targeted line reads**: Read at most 150 lines around known symbol anchors. Never read 2,400-line files from start to finish.
5. **Subagent delegation**: Delegate bulk multi-file UI implementations to a single Model: "flash" subagent pass with a clear specification.
