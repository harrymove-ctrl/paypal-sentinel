# Session Fast Cache Brief

Deterministic codebase index generated in 0ms. Use this brief to eliminate exploratory file reads and prevent Playwright timeout errors.

## 1. Quick Stats & System Endpoints

| Metric | Value | Notes |
| :--- | :--- | :--- |
| Files Scanned | 0 files | web/src and backend-rust/src |
| Exported Symbols | 0 symbols | Indexed with exact line numbers |
| Test ID Locators | 0 test IDs | 0 always mounted, 0 conditional |
| Next.js Frontend Port | http://127.0.0.1:4100 | Verified in web/package.json |
| Rust Axum Backend Port | http://127.0.0.1:4180 | Verified in backend-rust/src/main.rs |

## 2. API Routes Index

| Method | Route | Runtime | Source File |
| :--- | :--- | :--- | :--- |

## 3. High-Priority data-testid Locators

Always target always mounted selectors for initial load verification. Never wait 30 seconds for conditional error or modal selectors.

| Locator Selector | Mount Status | Source File | Line |
| :--- | :--- | :--- | :--- |

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
