import { playTick } from './audio.js';

const monoEl = () => document.getElementById('mono');

let monoTimer;

export function showMonologue(text, tag = 'MIRA') {
  const el = monoEl();
  if (!el) return;
  el.innerHTML = `<div class="tag">${tag}</div><div>${escapeHtml(text)}</div>`;
  el.classList.remove('hidden');
  playTick();
  clearTimeout(monoTimer);
  monoTimer = setTimeout(() => el.classList.add('hidden'), Math.min(9000, 2800 + text.length * 35));
}

export function hideMonologue() {
  monoEl()?.classList.add('hidden');
}

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function $(sel) {
  return document.querySelector(sel);
}

export function show(el) {
  el?.classList.remove('hidden');
}

export function hide(el) {
  el?.classList.add('hidden');
}

export function openPanel(id) {
  show(document.getElementById(id));
}

export function closePanel(id) {
  hide(document.getElementById(id));
}
