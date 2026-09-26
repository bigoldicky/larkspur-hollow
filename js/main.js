import {
  createState, save, load, checkpoint, clearSaves,
  addItem, addNotebook, setFlags, hasFlag, setFlag, tryCombine,
} from './state.js';
import { renderRoom } from './scenes.js';
import { renderInventory, describeItem } from './inventory.js';
import { renderNotebook } from './notebook.js';
import { openDialogue } from './dialogue.js';
import {
  openPuzzle, tryUseItemOnPuzzle, checkAutoPuzzles, isPuzzleSolved,
} from './puzzles.js';
import { showMonologue, $, openPanel, closePanel } from './ui.js';
import { playTick } from './audio.js';

const DATA = {};
let state = createState();
let finaleShown = false;
let endingShown = false;

async function loadData() {
  const files = ['rooms', 'items', 'dialogue', 'puzzles', 'examines', 'notebook'];
  await Promise.all(
    files.map(async (f) => {
      const res = await fetch(`data/${f}.json`);
      DATA[f] = await res.json();
    })
  );
}

function puzzlePanel() {
  return { overlay: $('#puzzle-overlay'), body: $('#puzzle-body') };
}

function refresh() {
  for (const id of state.inventory) setFlag(state, `has_${id}`, true);

  const room = DATA.rooms[state.room];
  if (!room) {
    console.error('Missing room', state.room);
    return;
  }
  $('#room-title').textContent = room.title;
  $('#diff-badge').textContent = state.difficulty;
  const todEl = $('#tod-badge');
  if (todEl) {
    todEl.textContent = state.timeOfDay === 'night' ? 'night' : 'day';
    todEl.dataset.tod = state.timeOfDay;
  }

  renderRoom(room, state, DATA.puzzles, $('#stage'), $('#room-blurb'), $('#npc-dock'), {
    onHotspot: handleHotspot,
    onNpc: (id) =>
      openDialogue(id, DATA.dialogue, state, dlgEls(), () => {}, () => {
        afterStateChange();
      }),
  });

  renderInventory(state, DATA.items, $('#inv-bar'), (itemId) => {
    // Combine if another item already selected
    if (state.selectedItem && state.selectedItem !== itemId) {
      const result = tryCombine(state, DATA.items, state.selectedItem, itemId);
      if (result) {
        state.selectedItem = null;
        showMonologue(result.monologue);
        addNotebook(state, result.notebook);
        afterStateChange();
        return;
      }
    }
    if (state.selectedItem === itemId) {
      showMonologue(describeItem(DATA.items, itemId));
      state.selectedItem = null;
    } else {
      state.selectedItem = itemId;
      playTick();
      showMonologue(`Selected: ${DATA.items[itemId].name}. Tap a hotspot to use it, or another item to combine.`);
    }
    refresh();
  });

  checkProgressGates();
  save(state);
}

function checkProgressGates() {
  checkAutoPuzzles(DATA.puzzles, state, (id) => {
    if (id === 'act1_gate' && !finaleShown) {
      finaleShown = true;
      showActCard('act1');
    }
    if (id === 'act3_ending' && !endingShown) {
      endingShown = true;
      showActCard('ending');
    }
  });
}

function afterStateChange() {
  checkProgressGates();
  refresh();
}

function dlgEls() {
  return {
    overlay: $('#dlg-overlay'),
    portrait: $('#dlg-portrait'),
    nameEl: $('#dlg-name'),
    textEl: $('#dlg-text'),
    choicesEl: $('#dlg-choices'),
  };
}

function handleHotspot(hs) {
  playTick();
  if (hs.action === 'goto') {
    checkpoint(state);
    state.room = hs.target;
    state.selectedItem = null;
    const next = DATA.rooms[state.room];
    showMonologue(`— ${next.title} —`);
    refresh();
    return;
  }
  if (hs.action === 'toggle_time') {
    state.timeOfDay = state.timeOfDay === 'day' ? 'night' : 'day';
    showMonologue(
      state.timeOfDay === 'night'
        ? 'Night settles on the Hollow. Service doors and secrets stir.'
        : 'Morning mist. The conservatory yawns open again.'
    );
    afterStateChange();
    return;
  }
  if (hs.action === 'examine') {
    // UV kit on pedestal
    if (
      hs.examineId === 'pedestal' &&
      state.selectedItem === 'uv_kit' &&
      !isPuzzleSolved(state, 'uv_pedestal')
    ) {
      tryUseItemOnPuzzle(DATA.puzzles.uv_pedestal, state, () => afterStateChange());
      return;
    }
    // Phone examine after act1 via desk
    if (hs.examineId === 'cottage_desk' && hasFlag(state, 'act1_complete') && !hasFlag(state, 'heard_phone_threat')) {
      doExamine('cottage_phone');
      return;
    }
    doExamine(hs.examineId);
    return;
  }
  if (hs.action === 'take') {
    if (addItem(state, hs.itemId)) {
      setFlag(state, `has_${hs.itemId}`, true);
      showMonologue(`Pocketed: ${DATA.items[hs.itemId].name}. Handy.`);
      addNotebook(state, `Found ${DATA.items[hs.itemId].name}.`);
    }
    afterStateChange();
    return;
  }
  if (hs.action === 'puzzle') {
    const puzzle = DATA.puzzles[hs.puzzleId];
    if (!puzzle) return;
    openPuzzle(puzzle, state, puzzlePanel(), (id) => {
      if (id === 'evidence_board') {
        showMonologue('Accusation locked. Find Rowan in the Glass Studio.');
      }
      afterStateChange();
    });
  }
}

function doExamine(examineId) {
  let ex = DATA.examines[examineId];
  if (examineId === 'tool_rack' && !hasFlag(state, 'examined_pedestal')) {
    ex = DATA.examines.tool_rack_locked;
  }
  if (!ex) {
    showMonologue("Nothing useful. Or I'm not clever enough yet.");
    return;
  }
  if (ex.requires && !ex.requires.every((r) => hasFlag(state, r))) {
    showMonologue('Not yet — more context needed.');
    return;
  }
  showMonologue(ex.text);
  setFlags(state, ex.sets || []);
  addNotebook(state, ex.notebook);
  if (ex.giveItem) addItem(state, ex.giveItem);
  afterStateChange();
}

function showActCard(kind) {
  const el = $('#finale');
  if (!el) return;
  if (kind === 'act1') {
    el.querySelector('h2').textContent = 'Act I Complete';
    el.querySelector('.finale-body').innerHTML = `
      <p>Pedestal scratch, tungsten confession, midnight badge ping, and a UV trail into the kiln.
      Rowan Vale’s story is cracking like poorly annealed glass.</p>
      <ul>
        <li>Clear Theo (pawn slip) and Juliette (bid ledger)</li>
        <li>Night service door → crowbar; oven keypad → keycard</li>
        <li>Recover the orchid from the hollow kiln brick</li>
        <li>Pin three proofs on the cottage Evidence Board, then accuse Rowan</li>
      </ul>`;
  } else {
    el.querySelector('h2').textContent = 'Case Closed — Orchid Recovered';
    el.querySelector('.finale-body').innerHTML = `
      <p>Rowan Vale removed <em>The Glass Orchid</em> as “insurance” against Juliette’s forced private sale,
      then panicked and framed Theo. You recovered the sculpture from a hollow kiln brick.</p>
      <ul>
        <li>Orchid returned to the Conservatory collection (public, per Liora’s bequest)</li>
        <li>Rowan: restitution & community service — not cartoon villainy</li>
        <li>Juliette’s sale scheme exposed; Celeste reforms gala contracts</li>
        <li>Iris & Theo cleared; Finn’s Fog Latte still overpriced</li>
      </ul>
      <p class="finale-sign">— Mira Quill, visiting sleuth · Larkspur Hollow</p>`;
  }
  el.classList.remove('hidden');
}

function bindChrome() {
  $('#btn-notebook').addEventListener('click', () => {
    renderNotebook(state, DATA.notebook, $('#notebook-body'));
    openPanel('notebook-overlay');
  });
  $('#notebook-overlay .close').addEventListener('click', () => closePanel('notebook-overlay'));
  $('#puzzle-overlay .close').addEventListener('click', () => closePanel('puzzle-overlay'));
  $('#dlg-overlay .close')?.addEventListener('click', () => closePanel('dlg-overlay'));

  $('#btn-save').addEventListener('click', () => {
    save(state);
    showMonologue('Game saved locally. Your future self says thanks.');
  });

  document.querySelectorAll('[data-start-diff]').forEach((btn) => {
    btn.addEventListener('click', () => startNew(btn.dataset.startDiff));
  });

  $('#btn-continue')?.addEventListener('click', () => {
    const s = load();
    if (!s) {
      showMonologue('No save found. Start a new case.');
      return;
    }
    state = s;
    finaleShown = !!hasFlag(state, 'act1_complete');
    endingShown = !!hasFlag(state, 'ending_reached');
    $('#title-screen').classList.add('hidden');
    const d = state.difficulty;
    showMonologue(
      d === 'junior'
        ? 'Welcome back, Junior Detective. The orchids missed you.'
        : d === 'master'
          ? 'Welcome back, Master Detective. Soft glow? Never heard of her.'
          : 'Welcome back, Senior Detective. No training wheels today.'
    );
    refresh();
  });

  $('#btn-finale-close').addEventListener('click', () => {
    $('#finale').classList.add('hidden');
  });
}

function startNew(difficulty) {
  clearSaves();
  finaleShown = false;
  endingShown = false;
  state = createState();
  state.difficulty = difficulty;
  state.room = 'cottage';
  const msg =
    difficulty === 'junior'
      ? 'Difficulty: Junior — full tasks, softer hints, kiln sparkles when ready.'
      : difficulty === 'master'
        ? 'Difficulty: Master — lean tasks, stricter accusation gates.'
        : 'Difficulty: Senior — lean tasks, fewer sparkles. Trust your eyes.';
  addNotebook(state, msg);
  $('#title-screen').classList.add('hidden');
  showMonologue(
    "Rain on the glass, case on the desk. Aunt Celeste didn't invite me for the tea. Time to look around."
  );
  refresh();
}

async function boot() {
  bindChrome();
  try {
    await loadData();
  } catch (e) {
    console.error(e);
    $('#title-screen .subtitle').textContent =
      'Failed to load data/ — serve this folder over HTTP (see README).';
    return;
  }
  const existing = load();
  if (existing) {
    $('#btn-continue').disabled = false;
  }
}

boot();
