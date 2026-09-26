# Technical Architecture — *Larkspur Hollow: The Glass Orchid*

**Goal:** Mobile-local (offline-capable) prototype scaffolded **now** on Linux as a web app, portable to **PWA / Capacitor** later.

---

## 1. Stack recommendation

| Layer | Choice | Why |
|-------|--------|-----|
| Runtime | **HTML + CSS + vanilla JS (ES modules)** | Zero install, runs via `python -m http.server` or any static host; Capacitor wraps `www/` |
| Optional later | **Phaser 3** or **Godot 4 HTML5** | Only if we need heavier animation/physics; not required for node adventure |
| Persistence | `localStorage` (+ optional file export JSON) | Offline saves |
| Audio | HTMLAudioElement / Web Audio | Pre-bundled OGG |
| Packaging | Vite build → `dist/` → Capacitor Android/iOS | When ready for stores |
| Icons/UI | CSS + inline SVG | No binary art dependency for slice |

**Decision for this box:** Vanilla web prototype under `/workspace/larkspur-hollow/` — fastest path to a playable vertical slice today.

---

## 2. High-level architecture

```
┌─────────────────────────────────────────────┐
│                  index.html                  │
│  HUD: inventory | notebook | difficulty | ⚙  │
└────────────┬─────────────────────┬──────────┘
             │                     │
     ┌───────▼───────┐     ┌───────▼───────┐
     │  SceneManager │     │   UIManager   │
     │  rooms/nodes  │     │ panels/modals │
     └───────┬───────┘     └───────┬───────┘
             │                     │
     ┌───────▼─────────────────────▼───────┐
     │              GameState               │
     │ flags | inventory | puzzles | time   │
     │ dialogue topics | save slots         │
     └───────┬─────────────────────┬───────┘
             │                     │
     ┌───────▼───────┐     ┌───────▼───────┐
     │ PuzzleMachine │     │ DialogueSys   │
     └───────────────┘     └───────────────┘
             │
     ┌───────▼───────┐
     │  data/*.json  │  content, not code
     └───────────────┘
```

---

## 3. Scenes / rooms

Each room is a data object:

```json
{
  "id": "orchid_wing",
  "title": "Orchid Wing",
  "art": "assets/images/rooms/orchid_wing.svg",
  "hotspots": [
    { "id": "pedestal", "x": 42, "y": 55, "w": 16, "h": 22, "action": "examine" },
    { "id": "to_atrium", "x": 2, "y": 40, "w": 10, "h": 30, "action": "goto", "target": "atrium" }
  ],
  "npcs": ["iris"],
  "onEnter": ["check_uv_trail"]
}
```

**SceneManager** loads room, renders background + absolute-positioned hotspot buttons (large for touch), binds clicks.

---

## 4. Inventory

- Array of item ids in `GameState.inventory`
- Items defined in `data/items.json` (`id`, `name`, `icon`, `combinableWith`, `description`)
- **Combine:** select item A, tap item B → if recipe exists, replace with result
- **Use on hotspot:** select item, tap hotspot → puzzle handler

---

## 5. Dialogue system

`data/dialogue.json`:
```json
{
  "rowan": {
    "greeting": "dlg_rowan_hi",
    "topics": [
      {
        "id": "tools",
        "label": "Ask about specialized tools",
        "requires": ["examined_pedestal"],
        "lines": ["…"],
        "sets": ["knows_tungsten"]
      }
    ]
  }
}
```

- Branching menus; topics filtered by `requires` flags  
- Lines support `{monologue:true}` for Mira aside  
- Closing topic can `sets` flags that unlock puzzles  

---

## 6. Puzzle state machine

Each puzzle:
```
locked → available → in_progress → solved | failed_soft
```

- `available` when `requires` flags all true  
- Junior/Senior parameters live under `puzzles[id].tiers`  
- Solver UI components: `CodePad`, `Combine`, `ObserveCompare`, `EvidenceBoard`  
- On solve: set flag, notebook update, optional VO  

---

## 7. Save system

```js
{
  version: 1,
  difficulty: "junior"|"senior",
  room: "atrium",
  timeOfDay: "day"|"night",
  inventory: [],
  flags: {},
  puzzles: {},
  notebook: [],
  timestamp: "ISO-8601"
}
```

- Autosave on room change + puzzle solve  
- Slot 0 quicksave in `localStorage['lh_save_0']`  
- Second Chance: restore `lh_checkpoint` snapshot taken at last safe room enter  

---

## 8. Asset folders

```
larkspur-hollow/
  index.html
  css/game.css
  js/
    main.js
    state.js
    scenes.js
    inventory.js
    dialogue.js
    puzzles.js
    notebook.js
    ui.js
    audio.js
  data/
    rooms.json
    items.json
    dialogue.json
    puzzles.json
    examines.json
    notebook.json
  assets/
    images/rooms/ …
    images/ui/ …
    images/portraits/ …
    audio/sfx/ …
    voices/ …
  docs/
  README.md
```

---

## 9. Mobile / Capacitor path

1. Keep game logic framework-agnostic (already).  
2. Add Vite: `npm create vite@latest` wrapping this folder as `public/` or migrate to `src/`.  
3. `npm i @capacitor/core @capacitor/cli && npx cap init`  
4. `npx cap add android|ios` pointing `webDir` at build output.  
5. PWA: add `manifest.webmanifest` + service worker caching `data/` + `assets/`.  

Touch rules: min hotspot ~48×48 CSS px; no hover-only affordances; bottom HUD thumb zone.

---

## 10. Vertical slice implementation map

| Feature | Module |
|---------|--------|
| Clickable rooms | `scenes.js` + `rooms.json` |
| Inventory + combine | `inventory.js` |
| 3 chained puzzles | climate PIN, UV combine, pedestal observe |
| 2–3 NPCs | Celeste, Iris, Rowan |
| Notebook | `notebook.js` |
| Difficulty toggle | `state.js` + puzzle tiers |
| Examine monologues | `examines.json` + `ui.js` toast/caption |

No build step required for the slice: static files + local HTTP server (ES modules need a server, not `file://` in some browsers).
