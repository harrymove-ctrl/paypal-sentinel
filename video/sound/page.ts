// Offline 48 kHz stereo audio renderer for PayPal Sentinel
// 1. appCue(): WebAudio UI tactile sounds (tap, deal stamp, payday chime)
// 2. designed(): Tone.js transitions (orb glass, block fan, bezel dive, callout open, riser, sub impact, orbit whip)
// 3. score(): 120 BPM Obsidian Emerald Electro-Pulse Synth Score (Master 164.0s / Launch 44.0s)
import * as Tone from "tone";

const SR = 48000;
type Stereo = [Float32Array, Float32Array];

function toInt16Base64([l, r]: Stereo): string {
  const n = l.length;
  const out = new Int16Array(n * 2);
  for (let i = 0; i < n; i++) {
    out[2 * i] = Math.round(Math.max(-1, Math.min(1, l[i])) * 32767);
    out[2 * i + 1] = Math.round(Math.max(-1, Math.min(1, r[i])) * 32767);
  }
  const bytes = new Uint8Array(out.buffer);
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(s);
}

const stereoOf = (b: AudioBuffer): Stereo => [
  b.getChannelData(0),
  b.getChannelData(b.numberOfChannels > 1 ? 1 : 0),
];

const midiHz = (midi: number): number => 440 * 2 ** ((midi - 69) / 12);

// Layer 1: Tactile UI Cues
async function appCue(spec: { id: string }): Promise<string> {
  const dur = 1.2;
  const ctx = new OfflineAudioContext(2, Math.round(SR * dur), SR);
  const master = ctx.createGain();
  master.gain.value = 0.85;
  master.connect(ctx.destination);

  const playNote = (
    midi: number,
    offset: number,
    duration: number,
    vol: number,
    type: OscillatorType = "sine",
  ) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(midiHz(midi), offset);
    g.gain.setValueAtTime(0.0001, offset);
    g.gain.linearRampToValueAtTime(vol, offset + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, offset + duration);
    osc.connect(g).connect(master);
    osc.start(offset);
    osc.stop(offset + duration + 0.02);
  };

  switch (spec.id) {
    case "app-tap": {
      playNote(76, 0, 0.05, 0.35, "triangle");
      break;
    }
    case "app-deal-stamp": {
      const pop = ctx.createOscillator();
      const pg = ctx.createGain();
      pop.type = "sine";
      pop.frequency.setValueAtTime(380, 0);
      pop.frequency.exponentialRampToValueAtTime(55, 0.06);
      pg.gain.setValueAtTime(0.65, 0);
      pg.gain.exponentialRampToValueAtTime(0.001, 0.07);
      pop.connect(pg).connect(master);
      pop.start(0);
      pop.stop(0.08);
      playNote(65, 0.01, 0.12, 0.3, "triangle");
      break;
    }
    case "app-payday-chime": {
      // Emerald confirmation crystal chord
      playNote(72, 0.00, 0.45, 0.28, "triangle"); // C5
      playNote(76, 0.04, 0.50, 0.30, "triangle"); // E5
      playNote(79, 0.08, 0.55, 0.32, "triangle"); // G5
      playNote(84, 0.14, 0.70, 0.35, "triangle"); // C6
      break;
    }
  }

  return toInt16Base64(stereoOf(await ctx.startRendering()));
}

// Layer 2: Designed Cinema Transitions
async function designed(d: { kind: string; seconds: number; [k: string]: number | string }): Promise<string> {
  const buf = await Tone.Offline(async () => {
    const out = new Tone.Gain(0.9).toDestination();
    const verb = new Tone.Reverb({ decay: 1.6, wet: 0.28 }).connect(out);
    await verb.ready;
    const t = d.seconds;

    switch (d.kind) {
      case "orb-glass": {
        const s = new Tone.PolySynth(Tone.FMSynth, {
          harmonicity: 2,
          modulationIndex: 4,
          envelope: { attack: 0.005, decay: 0.55, sustain: 0, release: 0.45 },
        }).connect(verb);
        s.volume.value = -8;
        ["C5", "E5", "G5", "B5"].forEach((note, idx) => s.triggerAttackRelease(note, 0.28, idx * 0.035));
        break;
      }
      case "block-fan": {
        const wood = new Tone.MembraneSynth({
          pitchDecay: 0.012,
          octaves: 2,
          envelope: { attack: 0.001, decay: 0.045, sustain: 0, release: 0.03 },
        }).connect(out);
        wood.volume.value = -6;
        const notes = ["G4", "A4", "C5", "D5", "E5", "G5"];
        notes.forEach((n, idx) => wood.triggerAttackRelease(n, 0.03, idx * 0.028));
        break;
      }
      case "bezel-dive": {
        const sub = new Tone.Oscillator(120, "sine");
        const sg = new Tone.Gain(0.0001).connect(out);
        sub.connect(sg);
        sub.frequency.exponentialRampToValueAtTime(45, t * 0.85);
        sg.gain.exponentialRampToValueAtTime(0.5, t * 0.35);
        sg.gain.exponentialRampToValueAtTime(0.0001, t);
        sub.start(0).stop(t);
        break;
      }
      case "callout-open": {
        const ping = new Tone.Synth({
          oscillator: { type: "sine" },
          envelope: { attack: 0.002, decay: 0.06, sustain: 0, release: 0.04 },
        }).connect(verb);
        ping.volume.value = -10;
        ping.triggerAttackRelease("A5", 0.05);
        break;
      }
      case "riser": {
        const osc = new Tone.Oscillator(90, "sawtooth");
        const f = new Tone.Filter(300, "lowpass");
        const g = new Tone.Gain(0.0001).connect(verb);
        osc.chain(f, g);
        f.frequency.exponentialRampToValueAtTime(4500, t);
        g.gain.exponentialRampToValueAtTime(0.45, t * 0.95);
        g.gain.exponentialRampToValueAtTime(0.0001, t);
        osc.start(0).stop(t);
        break;
      }
      case "sub-impact": {
        const sub = new Tone.Oscillator(90, "sine");
        const g = new Tone.Gain(0.7).connect(out);
        sub.connect(g);
        sub.frequency.exponentialRampToValueAtTime(35, t * 0.9);
        g.gain.exponentialRampToValueAtTime(0.0001, t);
        sub.start(0).stop(t);
        break;
      }
      case "orbit-whip": {
        const n = new Tone.Noise("pink");
        const f = new Tone.Filter({ type: "bandpass", frequency: 1200, Q: 2.0 });
        const g = new Tone.Gain(0.001);
        const pan = new Tone.Panner(-0.8).connect(verb);
        n.chain(f, g, pan);
        f.frequency.exponentialRampToValueAtTime(3200, t * 0.5);
        f.frequency.exponentialRampToValueAtTime(600, t);
        g.gain.exponentialRampToValueAtTime(0.35, t * 0.4);
        g.gain.exponentialRampToValueAtTime(0.0001, t);
        pan.pan.linearRampToValueAtTime(0.8, t);
        n.start(0).stop(t);
        break;
      }
    }
  }, d.seconds + 0.4, 2, SR);

  return toInt16Base64(stereoOf(buf.get() as AudioBuffer));
}

// Layer 3: 120 BPM Instrumental Score
type SectionName =
  | "intro"
  | "stabs"
  | "build"
  | "grooveA"
  | "drop1"
  | "breakdown"
  | "bridge"
  | "grooveB"
  | "drop2"
  | "silence"
  | "outro";

interface SectionSpec {
  name: SectionName;
  from: number;
  to: number;
}

const CHORDS_GROOVE = [
  { root: "C2", voicings: ["C4", "E4", "G4", "B4"], arp: ["C4", "G4", "B4", "E5", "G4", "B4", "E5", "D5"] },
  { root: "A1", voicings: ["A3", "C4", "E4", "G4"], arp: ["A3", "E4", "G4", "C5", "E4", "G4", "C5", "B4"] },
  { root: "D2", voicings: ["D4", "F4", "A4", "C5"], arp: ["D4", "A4", "C5", "F5", "A4", "C5", "E5", "C5"] },
  { root: "G1", voicings: ["G3", "B3", "D4", "F4"], arp: ["G3", "D4", "F4", "A4", "B4", "G4", "E4", "D4"] },
];

const CHORDS_DROP = [
  { root: "F1", voicings: ["F3", "A3", "C4", "E4"], arp: ["F4", "A4", "C5", "E5", "G5", "E5", "C5", "A4"] },
  { root: "G1", voicings: ["G3", "B3", "D4", "F4"], arp: ["G4", "B4", "D5", "G5", "A5", "G5", "D5", "B4"] },
  { root: "C2", voicings: ["C4", "E4", "G4", "B4"], arp: ["E4", "G4", "B4", "E5", "G5", "E5", "D5", "B4"] },
  { root: "A1", voicings: ["A3", "C4", "E4", "G4"], arp: ["A4", "C5", "E5", "G5", "A5", "G5", "E5", "C5"] },
];

async function score(sections: SectionSpec[], seconds: number): Promise<string> {
  const BAR_SEC = 2.0;
  const BEAT_SEC = 0.5;

  const buf = await Tone.Offline(async ({ transport }) => {
    transport.bpm.value = 120;

    const masterGain = new Tone.Gain(1).toDestination();
    const limiter = new Tone.Limiter(-1.5).connect(masterGain);
    const comp = new Tone.Compressor({ threshold: -16, ratio: 2.5, attack: 0.015, release: 0.2 }).connect(limiter);
    const midDip = new Tone.Filter({ type: "peaking", frequency: 1800, Q: 1.2, gain: -2.5 }).connect(comp);
    const verb = new Tone.Reverb({ decay: 2.5, wet: 0.22 }).connect(midDip);
    await verb.ready;
    const delay = new Tone.PingPongDelay({ delayTime: 0.375, feedback: 0.2, wet: 0.15 }).connect(verb);

    // Rhodes Chords
    const rhodes = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 1,
      modulationIndex: 1.5,
      oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 1.0, sustain: 0.3, release: 1.0 },
    }).connect(verb);
    rhodes.volume.value = -12;

    // Emerald Analog Lead / Pluck
    const emeraldFilter = new Tone.Filter(2600, "lowpass").connect(delay);
    const emerald = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.005, decay: 0.35, sustain: 0.1, release: 0.4 },
    }).connect(emeraldFilter);
    emerald.volume.value = -13;

    // Sub Bass
    const bass = new Tone.MonoSynth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.01, decay: 0.3, sustain: 0.5, release: 0.2 },
    }).connect(midDip);
    bass.volume.value = -8;

    // Drums: Kick, Snare, Hihat
    const kick = new Tone.MembraneSynth({
      pitchDecay: 0.04,
      octaves: 4.5,
      envelope: { attack: 0.001, decay: 0.22, sustain: 0, release: 0.06 },
    }).connect(midDip);
    kick.volume.value = -7;

    const snare = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.002, decay: 0.14, sustain: 0, release: 0.05 },
    }).connect(verb);
    snare.volume.value = -14;

    const hat = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.001, decay: 0.03, sustain: 0, release: 0.01 },
    }).connect(midDip);
    hat.volume.value = -22;

    for (const sec of sections) {
      const start = sec.from * BAR_SEC;
      const end = sec.to * BAR_SEC;

      if (sec.name === "silence") {
        masterGain.gain.setValueAtTime(0, start);
        masterGain.gain.setValueAtTime(1, end);
        continue;
      }

      const chordSet = (sec.name === "drop1" || sec.name === "drop2") ? CHORDS_DROP : CHORDS_GROOVE;
      const numBars = sec.to - sec.from;

      for (let b = 0; b < numBars; b++) {
        const barTime = start + b * BAR_SEC;
        const chord = chordSet[b % chordSet.length];

        // Rhodes Chords on beat 1 and 3
        if (sec.name !== "outro") {
          rhodes.triggerAttackRelease(chord.voicings, 1.4, barTime);
        }

        // Bassline
        if (sec.name !== "intro" && sec.name !== "silence") {
          bass.triggerAttackRelease(chord.root, 0.4, barTime);
          bass.triggerAttackRelease(chord.root, 0.3, barTime + BEAT_SEC * 2);
          if (sec.name === "drop1" || sec.name === "drop2") {
            bass.triggerAttackRelease(chord.root, 0.2, barTime + BEAT_SEC * 3.5);
          }
        }

        // Emerald Pluck Arpeggio
        if (sec.name === "grooveA" || sec.name === "grooveB" || sec.name === "drop1" || sec.name === "drop2" || sec.name === "bridge") {
          for (let noteIdx = 0; noteIdx < chord.arp.length; noteIdx++) {
            const noteTime = barTime + (noteIdx * BAR_SEC) / chord.arp.length;
            emerald.triggerAttackRelease(chord.arp[noteIdx], 0.15, noteTime);
          }
        }

        // Drums (grooves and drops)
        if (sec.name === "build" || sec.name === "grooveA" || sec.name === "grooveB" || sec.name === "drop1" || sec.name === "drop2") {
          kick.triggerAttackRelease("C1", 0.1, barTime);
          kick.triggerAttackRelease("C1", 0.1, barTime + BEAT_SEC * 2);
          snare.triggerAttackRelease(0.08, barTime + BEAT_SEC);
          snare.triggerAttackRelease(0.08, barTime + BEAT_SEC * 3);

          for (let h = 0; h < 8; h++) {
            hat.triggerAttackRelease(0.02, barTime + (h * BAR_SEC) / 8);
          }
        }
      }
    }
  }, seconds + 1.0, 2, SR);

  return toInt16Base64(stereoOf(buf.get() as AudioBuffer));
}

// Expose globals for Node bridge
(window as unknown as { appCue: typeof appCue; designed: typeof designed; score: typeof score }).appCue = appCue;
(window as unknown as { appCue: typeof appCue; designed: typeof designed; score: typeof score }).designed = designed;
(window as unknown as { appCue: typeof appCue; designed: typeof designed; score: typeof score }).score = score;
