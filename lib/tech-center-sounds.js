'use client';

let ctx = null;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

function tone(freq, duration, volume = 0.15, type = 'sine') {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + duration);
  } catch {}
}

export function playClick() {
  tone(800, 0.06, 0.07);
}

export function playSale() {
  tone(523, 0.12, 0.18);
  setTimeout(() => tone(659, 0.18, 0.2), 100);
}

export function playPurchase() {
  tone(440, 0.1, 0.12, 'triangle');
}

export function playGameOver() {
  tone(440, 0.2, 0.2);
  setTimeout(() => tone(349, 0.2, 0.2), 200);
  setTimeout(() => tone(261, 0.4, 0.25), 400);
}

export function playDayStart() {
  tone(523, 0.1, 0.15);
  setTimeout(() => tone(659, 0.1, 0.15), 100);
  setTimeout(() => tone(784, 0.2, 0.2), 200);
}
