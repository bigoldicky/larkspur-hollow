/** Placeholder audio — captions work without files; tick SFX via Web Audio */

let ctx;

function ensureCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

export function playTick() {
  try {
    const c = ensureCtx();
    const o = c.createOscillator();
    const g = c.createGain();
    o.frequency.value = 660;
    g.gain.value = 0.04;
    o.connect(g); g.connect(c.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.08);
    o.stop(c.currentTime + 0.09);
  } catch { /* ignore */ }
}

export function playSolve() {
  try {
    const c = ensureCtx();
    [523, 659, 784].forEach((f, i) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.frequency.value = f;
      g.gain.value = 0.05;
      o.connect(g); g.connect(c.destination);
      const t = c.currentTime + i * 0.08;
      o.start(t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      o.stop(t + 0.22);
    });
  } catch { /* ignore */ }
}

/** Voice clip stub — returns false if missing so UI shows caption only */
export async function playVoice(/* lineId */) {
  return false;
}
