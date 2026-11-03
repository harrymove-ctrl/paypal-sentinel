# PayPal Sentinel: Builder & Agent Engineering Rules (`obra/superpowers` Mindset Layer)

This repository (`projects/project_1` / `https://github.com/harrymove-ctrl/paypal-sentinel`) implements **PayPal Sentinel**, the unified all-concept AI agentic settlement engine for **PayPal AI Hackathon: Build What's Next with PayPal and AI** (Prize Pool: \$69,750, Live Production Build: `https://paypal-sentinel-production.up.railway.app`).

## 1. Default Engineering Mindset Layer (`obra/superpowers`)

All 15 field-tested skills from [obra/superpowers](https://github.com/obra/superpowers) are wired into `.agents/skills/` and operate as the mandatory engineering mindset layer across this codebase:

1. **Skill Activation (`using-superpowers`, `writing-skills`, `diagnosing-superpowers`)**: Check and invoke applicable skills in `.agents/skills/` before writing code, plans, or responses.
2. **Design & Planning (`brainstorming`, `writing-plans`, `executing-plans`)**: Validate design trade-offs and break multi-step changes into bite-sized, verifiable tasks before touching implementation files.
3. **Test-Driven Development (`test-driven-development`)**: Follow the strict `RED -> Verify RED -> GREEN -> Verify GREEN -> REFACTOR` loop on all Rust and TypeScript behavior changes:
   1. **RED**: Write a minimal test in `backend-rust/src/lib.rs` (`mod tests`) or `web/e2e/sentinel.spec.ts` demonstrating the target behavior.
   2. **Verify RED**: Run `cargo test` or `npx playwright test` and confirm the new test fails for the expected reason.
   3. **GREEN**: Write the minimal production code to pass the test without speculative abstractions.
   4. **Verify GREEN & REFACTOR**: Run the full suite plus `cargo clippy --all-targets -- -D warnings` to confirm zero warnings and zero regressions.
4. **Systematic Debugging (`systematic-debugging`)**: Perform root-cause investigation, boundary instrumentation, and single-hypothesis verification before proposing any bug fix.
5. **Parallel & Subagent Execution (`subagent-driven-development`, `dispatching-parallel-agents`, `using-git-worktrees`)**: Dispatch isolated subagents for independent tasks with two-stage review (spec compliance followed by code quality).
6. **Code Review & Verification Gate (`requesting-code-review`, `receiving-code-review`, `verification-before-completion`, `finishing-a-development-branch`)**: Never claim completion without fresh command output proving every test and lint gate passes.

## 2. Reproducible Verification Gates (`verification-before-completion`)

1. **Rust Backend Unit & Integration Suite (12/12 Tests + Zero Clippy Warnings)**:
   ```bash
   cd backend-rust && cargo test && cargo clippy --all-targets -- -D warnings
   ```
2. **Next.js 16 Production Build & TypeScript Gate**:
   ```bash
   cd web && npm run build
   ```
3. **Playwright Headless E2E Browser Suite (`1/1` Full User Journey)**:
   ```bash
   cd web && npx playwright test
   ```
4. **Prose & Zero-Dashes Audit**:
   Never use em-dashes, en-dashes, spaced hyphens, Markdown horizontal rules, or unordered dash bullets in documentation, commit messages, or UI copy.
