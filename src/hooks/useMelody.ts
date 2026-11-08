import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Generative romantic piece, synthesised live with the Web Audio API:
 * a warm pad, soft piano-like arpeggios, a sparse bell melody, a low bass,
 * and a calm "lub-dub" heartbeat on every bar — all through a gentle reverb.
 */

const BPM = 64;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
const LOOKAHEAD_MS = 25;
const SCHEDULE_AHEAD = 1.2;
const MASTER_VOLUME = 0.55;

const midiToFreq = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

/** Cmaj7 – Am7 – Fmaj7 – G6 */
const CHORDS = [
  { bass: 36, notes: [60, 64, 67, 71] },
  { bass: 45, notes: [57, 60, 64, 67] },
  { bass: 41, notes: [57, 60, 64, 65] },
  { bass: 43, notes: [55, 59, 62, 64] },
];

const ARP_PATTERN = [0, 2, 1, 3, 2, 1, 3, 2];

/** [midi, start beat, length in beats] over the 16-beat progression. */
const MELODY: [number, number, number][] = [
  [76, 0, 1.5], [74, 1.5, 0.5], [72, 2, 2],
  [72, 4, 1.5], [71, 5.5, 0.5], [69, 6, 2],
  [69, 8, 1], [72, 9, 1], [77, 10, 2],
  [76, 12, 1.5], [74, 13.5, 0.5], [71, 14, 2],
];

function createReverb(ctx: AudioContext) {
  const seconds = 3.2;
  const length = Math.floor(ctx.sampleRate * seconds);
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 2.5;
    }
  }
  const convolver = ctx.createConvolver();
  convolver.buffer = impulse;
  return convolver;
}

interface Engine {
  ctx: AudioContext;
  master: GainNode;
  dry: AudioNode;
  wet: AudioNode;
}

function createEngine(): Engine {
  const ctx = new AudioContext();
  const master = ctx.createGain();
  master.gain.value = 0.0001;

  const tone = ctx.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.value = 5200;

  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -18;
  compressor.ratio.value = 3;

  const reverb = createReverb(ctx);
  const wet = ctx.createGain();
  wet.gain.value = 0.45;

  master.connect(tone).connect(compressor).connect(ctx.destination);
  wet.connect(reverb).connect(master);

  const dry = ctx.createGain();
  dry.connect(master);
  dry.connect(wet);

  return { ctx, master, dry, wet };
}

function envelope(ctx: AudioContext, when: number, peak: number, attack: number, decay: number) {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(peak, when + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + attack + decay);
  return gain;
}

function osc(ctx: AudioContext, type: OscillatorType, freq: number, when: number, stop: number, out: AudioNode, detune = 0) {
  const node = ctx.createOscillator();
  node.type = type;
  node.frequency.value = freq;
  node.detune.value = detune;
  node.connect(out);
  node.start(when);
  node.stop(stop);
}

/** Soft felt-piano tone. */
function piano({ ctx, dry }: Engine, midi: number, when: number, peak: number) {
  const freq = midiToFreq(midi);
  const env = envelope(ctx, when, peak, 0.01, 1.8);
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(3200, when);
  filter.frequency.exponentialRampToValueAtTime(700, when + 1.2);
  env.connect(filter).connect(dry);
  osc(ctx, 'triangle', freq, when, when + 2, env);
  osc(ctx, 'sine', freq * 2, when, when + 2, env, 3);
}

/** Bell-like melody voice. */
function bell({ ctx, dry }: Engine, midi: number, when: number, length: number) {
  const freq = midiToFreq(midi);
  const env = envelope(ctx, when, 0.09, 0.02, length + 1.6);
  env.connect(dry);
  osc(ctx, 'sine', freq, when, when + length + 1.8, env);
  const overtone = envelope(ctx, when, 0.02, 0.01, 0.6);
  overtone.connect(dry);
  osc(ctx, 'sine', freq * 3, when, when + 0.8, overtone);
}

/** Warm sustained chord. */
function pad({ ctx, dry }: Engine, notes: number[], when: number, length: number) {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(0.035, when + 1.4);
  gain.gain.setValueAtTime(0.035, when + length - 0.4);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + length + 1.2);
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 900;
  gain.connect(filter).connect(dry);
  for (const note of notes) {
    const freq = midiToFreq(note);
    osc(ctx, 'sawtooth', freq, when, when + length + 1.3, gain, -7);
    osc(ctx, 'sawtooth', freq, when, when + length + 1.3, gain, 7);
  }
}

function bass({ ctx, dry }: Engine, midi: number, when: number) {
  const env = envelope(ctx, when, 0.14, 0.05, BAR);
  env.connect(dry);
  osc(ctx, 'sine', midiToFreq(midi), when, when + BAR + 0.2, env);
}

/** Calm double heartbeat thump. */
function heartbeat({ ctx, master }: Engine, when: number) {
  for (const [offset, peak] of [
    [0, 0.32],
    [0.26, 0.2],
  ] as const) {
    const t = when + offset;
    const node = ctx.createOscillator();
    node.type = 'sine';
    node.frequency.setValueAtTime(130, t);
    node.frequency.exponentialRampToValueAtTime(48, t + 0.16);
    const env = envelope(ctx, t, peak, 0.008, 0.22);
    node.connect(env).connect(master);
    node.start(t);
    node.stop(t + 0.3);
  }
}

function scheduleBar(engine: Engine, bar: number, when: number) {
  const chord = CHORDS[bar % CHORDS.length];
  pad(engine, chord.notes, when, BAR);
  bass(engine, chord.bass, when);
  heartbeat(engine, when);
  heartbeat(engine, when + BEAT * 2);

  ARP_PATTERN.forEach((index, step) => {
    const accent = step % 2 === 0 ? 0.07 : 0.045;
    piano(engine, chord.notes[index] + 12, when + step * (BEAT / 2), accent);
  });

  // Melody only enters from the second pass, so the piece opens softly.
  if (bar >= CHORDS.length) {
    const barStart = (bar % CHORDS.length) * 4;
    for (const [midi, start, length] of MELODY) {
      if (start >= barStart && start < barStart + 4) {
        bell(engine, midi, when + (start - barStart) * BEAT, length * BEAT);
      }
    }
  }
}

export function useMelody() {
  const [isPlaying, setIsPlaying] = useState(false);
  const engineRef = useRef<Engine | null>(null);
  const timerRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    timerRef.current = null;
    const engine = engineRef.current;
    engineRef.current = null;
    if (engine) {
      const now = engine.ctx.currentTime;
      engine.master.gain.cancelScheduledValues(now);
      engine.master.gain.setValueAtTime(engine.master.gain.value, now);
      engine.master.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      window.setTimeout(() => void engine.ctx.close(), 900);
    }
    setIsPlaying(false);
  }, []);

  const start = useCallback(() => {
    const engine = createEngine();
    engineRef.current = engine;
    const { ctx, master } = engine;
    void ctx.resume();

    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(MASTER_VOLUME, ctx.currentTime + 2.5);

    let bar = 0;
    let nextBarTime = ctx.currentTime + 0.1;
    const tick = () => {
      while (nextBarTime < ctx.currentTime + SCHEDULE_AHEAD) {
        scheduleBar(engine, bar, nextBarTime);
        bar += 1;
        nextBarTime += BAR;
      }
    };
    tick();
    timerRef.current = window.setInterval(tick, LOOKAHEAD_MS);
    setIsPlaying(true);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) stop();
    else start();
  }, [isPlaying, start, stop]);

  useEffect(() => stop, [stop]);

  return { isPlaying, toggle };
}
