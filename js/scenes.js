import { hasFlag } from './state.js';
import { hotspotSparkle, isPuzzleSolved } from './puzzles.js';

const NPC_LABELS = {
  celeste: '🌿 Talk: Celeste',
  iris: '🌺 Talk: Iris',
  rowan: '🔥 Talk: Rowan',
  theo: '🪴 Talk: Theo',
  juliette: '💎 Talk: Juliette',
  finn: '☕ Talk: Finn',
};

export function renderRoom(room, state, puzzlesData, stageEl, blurbEl, npcDock, handlers) {
  const night = state.timeOfDay === 'night';
  let blurb = room.blurb || '';
  if (night && room.blurbNight) blurb = room.blurbNight;
  else if (!night && room.blurbDay) blurb = room.blurbDay;
  blurbEl.textContent = blurb;

  stageEl.style.background = night && room.bgNight ? room.bgNight : room.bg || '#1e3d36';
  stageEl.dataset.room = room.id;
  stageEl.dataset.decor = room.decor || room.id;
  stageEl.dataset.tod = state.timeOfDay;
  stageEl.innerHTML = `<div class="room-decor decor-${room.decor || room.id}" aria-hidden="true"></div>`;

  for (const hs of room.hotspots || []) {
    if (hs.requiresNot && hs.requiresNot.some((f) => hasFlag(state, f))) continue;
    if (hs.requires && !hs.requires.every((f) => hasFlag(state, f))) continue;
    if (hs.requiresTime && state.timeOfDay !== hs.requiresTime) continue;
    if (hs.action === 'take' && hasFlag(state, `has_${hs.itemId}`)) continue;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'hotspot' + (hs.nav ? ' nav' : '');
    btn.style.left = hs.x + '%';
    btn.style.top = hs.y + '%';
    btn.style.width = hs.w + '%';
    btn.style.height = hs.h + '%';
    btn.textContent = hs.label;
    btn.setAttribute('aria-label', hs.label);

    if (hs.action === 'puzzle' && puzzlesData[hs.puzzleId]) {
      if (hotspotSparkle(puzzlesData[hs.puzzleId], state)) btn.classList.add('sparkle');
      if (isPuzzleSolved(state, hs.puzzleId)) {
        btn.style.borderColor = 'rgba(143,209,143,0.7)';
      }
    }
    if (hs.action === 'toggle_time') {
      btn.textContent = night ? '☀ Switch to Day' : '☾ Switch to Night';
      btn.classList.add('tod-btn');
    }

    btn.addEventListener('click', () => handlers.onHotspot(hs));
    stageEl.appendChild(btn);
  }

  npcDock.innerHTML = '';
  for (const npcId of room.npcs || []) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'npc-btn';
    b.textContent = NPC_LABELS[npcId] || `Talk: ${npcId}`;
    b.addEventListener('click', () => handlers.onNpc(npcId));
    npcDock.appendChild(b);
  }
}
