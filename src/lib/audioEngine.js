/**
 * Original, fully-synthesized cinematic audio cues using the Web Audio API.
 * No external audio files, no copyrighted material of any kind — every
 * sound here is generated from oscillators and noise at runtime.
 *
 * A single shared AudioContext + master gain node is created lazily, only
 * once a real user gesture has happened (per browser autoplay policy).
 * Mute is implemented by pulling the master gain to 0, not by stopping
 * playback, so toggling mute mid-cue is instant and glitch-free.
 */

let ctx = null;
let masterGain = null;
let targetVolume = 0.16; // overall ceiling — deliberately quiet, reading is the focus
let muted = false;

function ensureContext() {
  if (ctx) {
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    return ctx;
  }
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    ctx = new AudioContextClass();
    masterGain = ctx.createGain();
    masterGain.gain.value = muted ? 0 : targetVolume;
    masterGain.connect(ctx.destination);
  } catch (e) {
    ctx = null;
  }
  return ctx;
}

/** Call this from directly inside a real user-gesture handler (PIN submit,
 * Replay button click) — creates/resumes the AudioContext. Never throws. */
export function unlockAudio() {
  try {
    ensureContext();
  } catch (e) {
    // Audio is enhancement-only — never let a failure here affect login/cinematic.
  }
}

export function setMuted(nextMuted) {
  muted = nextMuted;
  if (masterGain && ctx) {
    const now = ctx.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setTargetAtTime(muted ? 0 : targetVolume, now, 0.05);
  }
}

export function isMuted() {
  return muted;
}

function safePlay(fn) {
  try {
    const c = ensureContext();
    if (!c || !masterGain) return;
    fn(c, masterGain);
  } catch (e) {
    // Never let a synthesis error interrupt the cinematic or login flow.
  }
}

/** Very low, quiet rumble as the starfield appears. */
export function playStarfieldRumble() {
  safePlay((c, out) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.value = 46;
    gain.gain.value = 0;
    osc.connect(gain).connect(out);
    const now = c.currentTime;
    gain.gain.linearRampToValueAtTime(0.9, now + 1.2);
    gain.gain.linearRampToValueAtTime(0, now + 4.5);
    osc.start(now);
    osc.stop(now + 4.6);
  });
}

/** Gentle rising pad as the crawl begins, sustained quietly underneath it. */
export function playCrawlSwell() {
  safePlay((c, out) => {
    const now = c.currentTime;
    [110, 165].forEach((freq, i) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.value = 0;
      osc.connect(gain).connect(out);
      gain.gain.linearRampToValueAtTime(0.35 - i * 0.1, now + 2.5);
      gain.gain.linearRampToValueAtTime(0.12 - i * 0.04, now + 6);
      gain.gain.linearRampToValueAtTime(0, now + 9);
      osc.start(now);
      osc.stop(now + 9.2);
    });
  });
}

/** Brief bright shimmer when the gold CTA appears. */
export function playCtaBloom() {
  safePlay((c, out) => {
    const now = c.currentTime;
    [880, 1320].forEach((freq, i) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.value = 0;
      osc.connect(gain).connect(out);
      gain.gain.linearRampToValueAtTime(0.22 - i * 0.08, now + 0.15 + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4 + i * 0.1);
      osc.start(now + i * 0.05);
      osc.stop(now + 1.6);
    });
  });
}

/** Restrained "digital intelligence" cue for Intel Acquired — a quick
 * upward frequency sweep plus a short click, nothing melodic or musical. */
export function playIntelCue() {
  safePlay((c, out) => {
    const now = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "square";
    gain.gain.value = 0;
    osc.connect(gain).connect(out);
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.18);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.start(now);
    osc.stop(now + 0.24);

    // short click via a filtered noise burst
    const bufferSize = c.sampleRate * 0.03;
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    const noise = c.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = c.createGain();
    noiseGain.gain.value = 0.12;
    noise.connect(noiseGain).connect(out);
    noise.start(now + 0.2);
  });
}

/** Short, satisfying two-note resolving chime for Mission Accepted. */
export function playMissionAcceptedCue() {
  safePlay((c, out) => {
    const now = c.currentTime;
    [440, 660].forEach((freq, i) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.value = 0;
      osc.connect(gain).connect(out);
      const start = now + i * 0.16;
      gain.gain.linearRampToValueAtTime(0.24, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 1.1);
      osc.start(start);
      osc.stop(start + 1.2);
    });
  });
}
