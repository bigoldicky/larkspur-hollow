import { requiresMet, setFlags, addNotebook, hasFlag, addItem } from './state.js';
import { showMonologue, escapeHtml } from './ui.js';
import { playSolve, playTick } from './audio.js';

export function isPuzzleSolved(state, id) {
  return !!state.puzzles[id]?.solved;
}

function applySolve(puzzle, state, onSolved) {
  state.puzzles[puzzle.id] = { solved: true };
  setFlags(state, puzzle.onSolve?.sets || []);
  if (puzzle.onSolve?.giveItem) addItem(state, puzzle.onSolve.giveItem);
  addNotebook(state, puzzle.onSolve?.notebook);
  playSolve();
  if (puzzle.onSolve?.monologue) showMonologue(puzzle.onSolve.monologue);
  onSolved?.(puzzle.id);
}

export function openCodePuzzle(puzzle, state, panelEls, onSolved) {
  const tier = puzzle.tiers[state.difficulty] || puzzle.tiers.junior || puzzle.tiers.senior;
  const { overlay, body } = panelEls;

  let buf = '';
  const max = tier.digits || tier.answer.length;

  function paint() {
    body.innerHTML = `
      <p>${escapeHtml(puzzle.intro || puzzle.name)}</p>
      <div class="code-pad">
        <div class="code-display">${buf.padEnd(max, '•')}</div>
        <div class="keypad">
          ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'OK']
            .map((k) => `<button type="button" data-k="${k}">${k}</button>`)
            .join('')}
        </div>
        <p class="puzzle-hint">${escapeHtml(tier.hint || '')}</p>
      </div>
    `;
    body.querySelectorAll('[data-k]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const k = btn.dataset.k;
        playTick();
        if (k === 'C') buf = '';
        else if (k === 'OK') trySubmit();
        else if (buf.length < max) buf += k;
        paint();
      });
    });
  }

  function trySubmit() {
    if (buf === tier.answer) {
      overlay.classList.add('hidden');
      applySolve(puzzle, state, onSolved);
    } else {
      showMonologue("That code just laughed at me. Softly. Professionally.");
      buf = '';
      paint();
    }
  }

  overlay.classList.remove('hidden');
  const title = overlay.querySelector('h2');
  if (title) title.textContent = puzzle.name;
  paint();
}

export function openChoicePuzzle(puzzle, state, panelEls, onSolved) {
  const tier = puzzle.tiers[state.difficulty] || puzzle.tiers.junior || puzzle.tiers.senior;
  const { overlay, body } = panelEls;

  body.innerHTML = `
    <p>${escapeHtml(puzzle.intro || puzzle.name)}</p>
    <p class="puzzle-hint">${escapeHtml(tier.hint || '')}</p>
    <div class="choice-list">
      ${(tier.options || [])
        .map(
          (o) =>
            `<button type="button" data-opt="${o.id}">${escapeHtml(o.label)}</button>`
        )
        .join('')}
    </div>
  `;

  body.querySelectorAll('[data-opt]').forEach((btn) => {
    btn.addEventListener('click', () => {
      playTick();
      const opt = (tier.options || []).find((o) => o.id === btn.dataset.opt);
      if (opt?.correct) {
        overlay.classList.add('hidden');
        applySolve(puzzle, state, onSolved);
      } else {
        showMonologue('Not that silhouette. Try again — the scratch has standards.');
      }
    });
  });

  overlay.classList.remove('hidden');
  const title = overlay.querySelector('h2');
  if (title) title.textContent = puzzle.name;
}

export function openSortPuzzle(puzzle, state, panelEls, onSolved) {
  const tier = puzzle.tiers[state.difficulty] || puzzle.tiers.junior || puzzle.tiers.senior;
  const { overlay, body } = panelEls;
  const pool = [...(tier.events || [])];
  // Shuffle display order
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  let selected = [];

  function paint() {
    body.innerHTML = `
      <p>${escapeHtml(puzzle.intro || puzzle.name)}</p>
      <p class="puzzle-hint">${escapeHtml(tier.hint || '')}</p>
      <div class="sort-selected">
        <div class="note-section">Your order</div>
        ${
          selected.length
            ? selected
                .map(
                  (id, idx) => {
                    const ev = (tier.events || []).find((e) => e.id === id);
                    return `<button type="button" data-rm="${idx}">${idx + 1}. ${escapeHtml(ev?.label || id)}</button>`;
                  }
                )
                .join('')
            : '<p class="puzzle-hint">Tap events below in chronological order (skip distractors).</p>'
        }
      </div>
      <div class="sort-pool">
        <div class="note-section">Available</div>
        ${pool
          .filter((e) => !selected.includes(e.id))
          .map((e) => `<button type="button" data-add="${e.id}">${escapeHtml(e.label)}</button>`)
          .join('')}
      </div>
      <div class="btn-row" style="margin-top:0.75rem">
        <button type="button" id="sort-clear" class="secondary">Clear</button>
        <button type="button" id="sort-ok">Check Order</button>
      </div>
    `;
    body.querySelectorAll('[data-add]').forEach((btn) => {
      btn.addEventListener('click', () => {
        playTick();
        selected.push(btn.dataset.add);
        paint();
      });
    });
    body.querySelectorAll('[data-rm]').forEach((btn) => {
      btn.addEventListener('click', () => {
        playTick();
        selected.splice(Number(btn.dataset.rm), 1);
        paint();
      });
    });
    body.querySelector('#sort-clear')?.addEventListener('click', () => {
      selected = [];
      paint();
    });
    body.querySelector('#sort-ok')?.addEventListener('click', () => {
      playTick();
      const want = tier.order || [];
      const ok =
        selected.length === want.length && selected.every((id, i) => id === want[i]);
      if (ok) {
        overlay.classList.add('hidden');
        applySolve(puzzle, state, onSolved);
      } else {
        showMonologue('Timeline objected. Re-order the real events — leave fluff out.');
      }
    });
  }

  overlay.classList.remove('hidden');
  const title = overlay.querySelector('h2');
  if (title) title.textContent = puzzle.name;
  paint();
}

export function openEvidenceBoard(puzzle, state, panelEls, onSolved) {
  const tier = puzzle.tiers[state.difficulty] || puzzle.tiers.junior || puzzle.tiers.senior;
  const { overlay, body } = panelEls;

  if (tier.needClears) {
    const clears = tier.clears || [];
    if (!clears.every((f) => hasFlag(state, f))) {
      showMonologue(tier.clearsMsg || 'Clear more suspects before accusing.');
      return;
    }
  }

  const picks = {};

  function paint() {
    const slotsHtml = (puzzle.slots || [])
      .map((slot) => {
        const opts = (slot.options || [])
          .map((o) => {
            const glow =
              tier.glow && o.id === slot.correct ? ' style="border-color:var(--ok)"' : '';
            const sel = picks[slot.id] === o.id ? ' selected' : '';
            return `<button type="button" class="ev-opt${sel}" data-slot="${slot.id}" data-opt="${o.id}"${glow}>${escapeHtml(o.label)}</button>`;
          })
          .join('');
        return `<div class="ev-slot"><div class="note-section">${escapeHtml(slot.label)}</div>${opts}</div>`;
      })
      .join('');

    body.innerHTML = `
      <p>${escapeHtml(puzzle.intro || puzzle.name)}</p>
      ${tier.warning && !tier.needClears ? `<p class="puzzle-hint">${escapeHtml(tier.warning)}</p>` : ''}
      <div class="evidence-board">${slotsHtml}</div>
      <div class="btn-row" style="margin-top:0.75rem">
        <button type="button" id="ev-accuse">Lock Accusation</button>
      </div>
    `;

    body.querySelectorAll('.ev-opt').forEach((btn) => {
      btn.addEventListener('click', () => {
        playTick();
        picks[btn.dataset.slot] = btn.dataset.opt;
        paint();
      });
    });

    body.querySelector('#ev-accuse')?.addEventListener('click', () => {
      playTick();
      const slots = puzzle.slots || [];
      const allPicked = slots.every((s) => picks[s.id]);
      if (!allPicked) {
        showMonologue('Pin all three proofs first.');
        return;
      }
      const correct = slots.every((s) => picks[s.id] === s.correct);
      if (correct) {
        overlay.classList.add('hidden');
        applySolve(puzzle, state, onSolved);
      } else {
        showMonologue(
          state.difficulty === 'master'
            ? 'Credibility wobbles. Wrong pin — rethink the board.'
            : 'Soft fail: one or more pins are wrong. Adjust and try again.'
        );
      }
    });
  }

  overlay.classList.remove('hidden');
  const title = overlay.querySelector('h2');
  if (title) title.textContent = puzzle.name;
  paint();
}

export function tryUseItemOnPuzzle(puzzle, state, onSolved) {
  if (isPuzzleSolved(state, puzzle.id)) {
    showMonologue("Already handled. Detectives don't double-dip victories.");
    return false;
  }
  if (!requiresMet(state, puzzle.requires || [])) {
    showMonologue(puzzle.requiresMsg || "Something's missing.");
    return false;
  }
  const need = puzzle.needsItem;
  const accepts = [need, ...(puzzle.alsoAccepts || [])];
  if (!accepts.includes(state.selectedItem)) {
    const tier = puzzle.tiers[state.difficulty] || puzzle.tiers.junior;
    showMonologue(tier?.hint || 'Wrong tool — or no tool selected.');
    return false;
  }
  if (puzzle.alsoNeeds) {
    const missing = puzzle.alsoNeeds.filter(
      (id) => !state.inventory.includes(id) && !hasFlag(state, `has_${id}`)
    );
    if (missing.length) {
      showMonologue(puzzle.alsoNeedsMsg || `Still need: ${missing.join(', ')}`);
      return false;
    }
  }
  state.selectedItem = null;
  applySolve(puzzle, state, onSolved);
  return true;
}

export function tryExamineGate(puzzle, state, onSolved) {
  if (isPuzzleSolved(state, puzzle.id)) {
    showMonologue('Already looted that particular night secret.');
    return false;
  }
  if (puzzle.requiresTime && state.timeOfDay !== puzzle.requiresTime) {
    showMonologue(puzzle.requiresMsg || 'Wrong time of day.');
    return false;
  }
  if (!requiresMet(state, puzzle.requires || [])) {
    showMonologue(puzzle.requiresMsg || 'Not yet.');
    return false;
  }
  applySolve(puzzle, state, onSolved);
  return true;
}

export function checkAutoPuzzles(puzzlesData, state, onSolved) {
  for (const p of Object.values(puzzlesData)) {
    if (p.type !== 'auto') continue;
    if (isPuzzleSolved(state, p.id)) continue;
    if (!requiresMet(state, p.requires || [])) continue;
    applySolve(p, state, onSolved);
  }
}

export function hotspotSparkle(puzzle, state) {
  if (!puzzle || isPuzzleSolved(state, puzzle.id)) return false;
  const tier = puzzle.tiers?.[state.difficulty] || puzzle.tiers?.junior;
  if (!tier?.sparkle) return false;
  if (puzzle.requiresTime && state.timeOfDay !== puzzle.requiresTime) return false;
  return requiresMet(state, puzzle.requires || []);
}

export function openPuzzle(puzzle, state, panelEls, onSolved) {
  if (!puzzle) return;
  if (isPuzzleSolved(state, puzzle.id) && puzzle.type !== 'evidence') {
    showMonologue("Already handled. Detectives don't double-dip victories.");
    return;
  }
  if (puzzle.requiresTime && state.timeOfDay !== puzzle.requiresTime) {
    showMonologue(puzzle.requiresMsg || 'Come back at a different hour.');
    return;
  }
  if (!requiresMet(state, puzzle.requires || [])) {
    showMonologue(puzzle.requiresMsg || 'Not yet.');
    return;
  }
  switch (puzzle.type) {
    case 'code':
      openCodePuzzle(puzzle, state, panelEls, onSolved);
      break;
    case 'choice':
      openChoicePuzzle(puzzle, state, panelEls, onSolved);
      break;
    case 'sort':
      openSortPuzzle(puzzle, state, panelEls, onSolved);
      break;
    case 'evidence':
      openEvidenceBoard(puzzle, state, panelEls, onSolved);
      break;
    case 'use_item':
      tryUseItemOnPuzzle(puzzle, state, onSolved);
      break;
    case 'examine_gate':
      tryExamineGate(puzzle, state, onSolved);
      break;
    default:
      showMonologue('Puzzle type not wired yet.');
  }
}
