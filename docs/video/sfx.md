# PayPal Sentinel: Sound Effects (SFX) Cue Sheet

## Sound Design Principles

The sound effects architecture combines two distinct audio layers:
1. Real UI Tactile Sounds: Mechanical keyboard clicks, tactile button depressions, drawer slide zips, card capture authorization clicks, and emerald settlement chimes.
2. Designed Cinema Transitions: Low frequency sub-impacts, riser sweeps, glass pings, and orbit whooshes aligned to scene boundaries.

All sound effects are rendered at 48 kHz stereo 24-bit with exact frame-level synchronization to the 30 fps timeline.

## Frame Accurate SFX Cue Sheet

| Timecode | Frame | Cue Identifier | Sound Design Category | Sonic Character and Narrative Trigger |
| :--- | :--- | :--- | :--- | :--- |
| 0:00.00 | Frame 0000 | tx-sub-impact | Designed Cinema Transition | 45 Hz deep sub drop introducing the opening obsidian void. |
| 0:02.00 | Frame 0060 | tx-orb-glass | Designed Cinema Transition | Glass chime as Beat 1 orb gathers into focus. |
| 0:04.00 | Frame 0120 | tx-orb-glass | Designed Cinema Transition | Glass chime as Beat 2 orb tightens. |
| 0:06.00 | Frame 0180 | tx-orb-glass | Designed Cinema Transition | Glass chime as Beat 3 orb aligns. |
| 0:08.00 | Frame 0240 | tx-block-fan | Designed Cinema Transition | Mechanical card fan whoosh as Brand Lockup letters snap into place. |
| 0:12.00 | Frame 0360 | tx-bezel-dive | Designed Cinema Transition | Deep spatial whoosh as laptop frame dives into live 1080p web cockpit. |
| 0:14.00 | Frame 0420 | app-tap | Real UI Tactile | Crisp tactile click on 1-Click Re-Seed Judge Sandbox. |
| 0:15.50 | Frame 0465 | tx-callout-open | Designed Cinema Transition | Subtle emerald tone as Callout 1 appears. |
| 0:24.00 | Frame 0720 | tx-riser-1bar | Designed Cinema Transition | Rising filter sweep introducing Chapter 2 Pattern Studio. |
| 0:26.00 | Frame 0780 | app-tap | Real UI Tactile | Quick tab clicks cycling through 5 Devpost inspiration tracks. |
| 0:38.00 | Frame 1140 | app-payday-chime | Real UI Tactile | Emerald dual chime confirming A2A pattern sandbox settlement. |
| 0:52.00 | Frame 1560 | tx-riser-1bar | Designed Cinema Transition | Upward pitch riser transitioning to Channel3 product search. |
| 0:55.00 | Frame 1650 | app-keyboard-burst | Real UI Tactile | Rapid typing burst as monitor search query is entered. |
| 1:04.00 | Frame 1920 | app-deal-stamp | Real UI Tactile | Heavy tactile punch as 1-Click Card *1881 Capture button is clicked. |
| 1:07.00 | Frame 2010 | app-payday-chime | Real UI Tactile | High frequency crystal chime as daily spend flips $425 to $870. |
| 1:18.00 | Frame 2340 | tx-sub-impact | Designed Cinema Transition | Low sub thump signaling red-team guardrail tests. |
| 1:21.00 | Frame 2430 | app-warning-buzzer | Real UI Tactile | Warm acoustic double buzzer as $850 overspend is blocked. |
| 1:25.00 | Frame 2550 | app-decline-click | Real UI Tactile | Hollow wooden click for INSTRUMENT_DECLINED simulation. |
| 1:29.00 | Frame 2670 | app-replay-lock | Real UI Tactile | Dual tone lock sound confirming 409 idempotency key rejection. |
| 1:33.00 | Frame 2790 | app-hmac-pass | Real UI Tactile | Clean emerald sine beep confirming constant-time Rust HMAC pass. |
| 1:44.00 | Frame 3120 | tx-orbit-whip | Designed Cinema Transition | Dynamic stereo pan whoosh entering @paypal/mcp Inspector. |
| 1:52.00 | Frame 3360 | app-terminal-exec | Real UI Tactile | Fast JSON execution tap returning dispute shield payload. |
| 1:58.00 | Frame 3540 | app-shield-lock | Real UI Tactile | Solid tactile locking click as seller dispute evidence is submitted. |
| 2:04.00 | Frame 3720 | tx-riser-1bar | Designed Cinema Transition | Riser sweep switching into Variant B AG Studio Grid. |
| 2:12.00 | Frame 3960 | app-chip-filter | Real UI Tactile | Soft bubble pops as NLP KPI filter chips are toggled. |
| 2:24.00 | Frame 4320 | tx-riser-1bar | Designed Cinema Transition | Swell entering Variant C Bryntum Scheduler. |
| 2:32.00 | Frame 4560 | app-delivery-chime | Real UI Tactile | Triumphant upward bell chime as carrier badge flips to DELIVERED. |
| 2:38.00 | Frame 4740 | tx-sub-impact | Designed Cinema Transition | Resonant cinematic low end settling into final End Lockup. |
| 2:44.00 | Frame 4920 | tx-reverb-tail | Designed Cinema Transition | Natural acoustic room fade to pure digital silence. |
