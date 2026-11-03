# PayPal Sentinel: Instrumental Music Score Design

## Musical Architecture and Pacing

The soundtrack is an unhurried, propulsive 120 BPM instrumental electronic and cyberpunk melodic score composed in 4/4 time. At 120 BPM, exactly 1 beat equals 0.50 seconds (15 frames at 30fps), and 1 bar equals 2.00 seconds (60 frames at 30fps).

The total master runtime is 82 bars, which equals 164.0 seconds (2 minutes and 44 seconds, exactly 4,920 frames at 30fps), leaving 16.0 seconds of headroom below the strict 3:00 Devpost hackathon limit.

The social launch cut is 22 bars, which equals 44.0 seconds (exactly 1,320 frames at 30fps).

## Section Map and Harmony (82 Bars Master)

| Bar Range | Seconds | Section Name | Harmonic Progression and Instrumentation | Energy and Narrative Arc |
| :--- | :--- | :--- | :--- | :--- |
| Bars 01 to 04 | 0:00 to 0:08 | Hook / Intro | Fmaj9 to G6 to Cmaj9 to Am9. Atmospheric Rhodes and subtle lowpass synth swell. | Mysterious and intriguing. 4 beats introducing the problem. |
| Bars 05 to 06 | 0:08 to 0:12 | Brand Stabs | Cmaj7 to Am7. Clean analog saw stabs with emerald filter sweep. | Strong brand presence as logo locks into place. |
| Bars 07 to 12 | 0:12 to 0:24 | Groove Build | Fmaj7 to G7 to Em7 to Am7. Introduction of four-on-the-floor kick and tight hi-hats. | Momentum begins as laptop dives into live app. |
| Bars 13 to 26 | 0:24 to 0:52 | Main Groove A | Cmaj9 to Am9 to Dm9 to G13. Warm Fender Rhodes chords, plucks, and sub-bass groove. | Steady, unhurried focus while touring 5 Devpost Tracks and 12 Patterns. |
| Bars 27 to 39 | 0:52 to 1:18 | Peak Drop 1 | Fmaj9 to G6 to Cmaj9 to Am9. Full drum pocket, energetic syncopated bass, and synth arp. | Climax of search and real PayPal Orders v2 direct card capture ($870). |
| Bars 40 to 52 | 1:18 to 1:44 | Tension Breakdown | Dm9 to Em7 to Fmaj7 to Gsus4. Half-time snare, stripped kick, high tension bell plucks. | Red-team adversarial testing: $850 overspend blocked, 409 replay, and HMAC pass. |
| Bars 53 to 62 | 1:44 to 2:04 | Tech Drive | Am7 to Dm9 to G13 to Cmaj7. Fast 16th note arp and crisp shaker percussion. | High-velocity inspection of 12-tool @paypal/mcp suite and dispute shield. |
| Bars 63 to 72 | 2:04 to 2:24 | Enterprise Pulse | Cmaj9 to Fmaj9 to Dm9 to G13. Warm melodic synth leads with solid four-on-the-floor groove. | Precision and clarity for AG Grid telemetry and NLP KPI agent filtering. |
| Bars 73 to 79 | 2:24 to 2:38 | Fulfillment Drop 2 | Fmaj9 to G6 to Cmaj9 to Am9. Triumphant full chorus with resonant filter open. | Bryntum timeline coordination and 1-click DELIVERED shipment proof. |
| Bars 80 to 82 | 2:38 to 2:44 | Outro Lockup | Cmaj7 hold into pure phosphor reverb tail. | Clean, confident conclusion resolving into ambient silence at 2:44. |

## Frequency Carving and Audio EQ Profile

1. Sub-Bass (30 Hz to 90 Hz): Tight sine sub foundation providing weight without muddiness.
2. Low Mids (120 Hz to 350 Hz): Warmth carved at 250 Hz to prevent low-end clutter.
3. Presence Notch (1.6 kHz to 2.4 kHz): Deliberate -2.5 dB dip to leave transparent acoustic space for live UI clicks, card swipes, and confirmation chimes.
4. Air (8 kHz to 18 kHz): Smooth high shelf delivering polished cinematic gloss.
5. Dynamic Range: Mastered to -14.0 LUFS integrated loudness with -1.5 dBFS true peak limit.
