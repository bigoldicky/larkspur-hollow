/** Central game state + save/load */

const SAVE_KEY = 'lh_save_v1';
const CHECKPOINT_KEY = 'lh_checkpoint';

export function createState() {
  return {
    version: 2,
    difficulty: 'junior',
    room: 'cottage',
    timeOfDay: 'day',
    inventory: [],
    flags: {},
    puzzles: {},
    notebookEntries: [],
    topicsDone: {},
    selectedItem: null,
  };
}

export function hasFlag(state, id) {
  return !!state.flags[id];
}

export function setFlag(state, id, val = true) {
  state.flags[id] = val;
  syncInventoryFlags(state);
}

export function setFlags(state, ids = []) {
  for (const id of ids) setFlag(state, id, true);
}

function syncInventoryFlags(state) {
  for (const id of state.inventory) {
    state.flags[`has_${id}`] = true;
  }
  // Convenience aliases used by Act I data
  if (state.inventory.includes('uv_chalk') || state.inventory.includes('uv_kit')) {
    state.flags.has_uv_chalk = true;
  }
  if (state.inventory.includes('humidity_notes')) state.flags.has_humidity_notes = true;
  if (state.inventory.includes('anneal_recipe')) state.flags.has_anneal_recipe = true;
  if (state.inventory.includes('studio_keycard')) state.flags.has_studio_keycard = true;
  if (state.inventory.includes('bent_wire')) state.flags.has_bent_wire = true;
  if (state.inventory.includes('crowbar')) state.flags.has_crowbar = true;
  if (state.inventory.includes('badge_fragment')) state.flags.has_badge_fragment = true;
  if (state.inventory.includes('tweezers')) state.flags.has_tweezers = true;
  if (state.inventory.includes('uv_kit')) state.flags.has_uv_kit = true;
  if (state.inventory.includes('glass_orchid')) state.flags.has_glass_orchid = true;
  if (state.flags.knows_tungsten) state.flags.proof_tungsten = true;
  if (state.flags.orchid_recovered) state.flags.proof_kiln = true;
}

export function addItem(state, itemId) {
  if (!itemId) return false;
  if (!state.inventory.includes(itemId)) {
    state.inventory.push(itemId);
    setFlag(state, `has_${itemId}`, true);
    return true;
  }
  return false;
}

export function removeItem(state, itemId) {
  const i = state.inventory.indexOf(itemId);
  if (i >= 0) {
    state.inventory.splice(i, 1);
    state.flags[`has_${itemId}`] = false;
    syncInventoryFlags(state);
    return true;
  }
  return false;
}

export function addNotebook(state, text) {
  if (!text) return;
  if (state.notebookEntries.includes(text)) return;
  state.notebookEntries.push(text);
}

export function requiresMet(state, requires = []) {
  return (requires || []).every((r) => hasFlag(state, r));
}

export function save(state) {
  const payload = { ...state, timestamp: new Date().toISOString() };
  localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
}

export function checkpoint(state) {
  localStorage.setItem(CHECKPOINT_KEY, JSON.stringify({ ...state, timestamp: new Date().toISOString() }));
}

export function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    syncInventoryFlags(s);
    return s;
  } catch {
    return null;
  }
}

export function loadCheckpoint() {
  try {
    const raw = localStorage.getItem(CHECKPOINT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearSaves() {
  localStorage.removeItem(SAVE_KEY);
  localStorage.removeItem(CHECKPOINT_KEY);
}

/** Combine two inventory items if recipe exists */
export function tryCombine(state, itemsData, a, b) {
  if (!a || !b || a === b) return null;
  const itemA = itemsData[a];
  const itemB = itemsData[b];
  if (!itemA || !itemB) return null;
  const can =
    (itemA.combinableWith || []).includes(b) ||
    (itemB.combinableWith || []).includes(a);
  if (!can) return null;

  // Known recipes
  const pair = new Set([a, b]);
  if (pair.has('tweezers') && pair.has('uv_chalk')) {
    removeItem(state, 'tweezers');
    removeItem(state, 'uv_chalk');
    addItem(state, 'uv_kit');
    return {
      result: 'uv_kit',
      monologue: 'Tweezers + UV chalk = sample kit. Pedestal base, you\'re next.',
      notebook: 'Combined tweezers and UV chalk into a UV sample kit.',
    };
  }
  return null;
}
