# Larkspur Hollow: The Glass Orchid

**Play in browser:** [https://bigoldicky.github.io/larkspur-hollow/](https://bigoldicky.github.io/larkspur-hollow/)
**Source:** [github.com/bigoldicky/larkspur-hollow](https://github.com/bigoldicky/larkspur-hollow)

An **original** girl-detective point-and-click mystery adventure (web prototype → PWA/Capacitor-ready).  
Inspired by the *genre patterns* of late-90s/2000s Her Interactive–style PC mysteries — **not** a Nancy Drew product. No licensed names, plots, characters, or assets.

| | |
|--|--|
| **Title** | Larkspur Hollow: The Glass Orchid |
| **Path** | `/workspace/larkspur-hollow/` |
| **Scope** | Full playable mystery (Acts I–III) |
| **Stack** | HTML / CSS / vanilla ES modules · offline-friendly · `localStorage` saves |

---

## How to play (local)

ES modules need HTTP (not raw `file://` in most browsers).

```bash
cd /workspace/larkspur-hollow
./serve.sh          # default port 8877
# or: python3 -m http.server 8877 --bind 127.0.0.1
```

Open **http://127.0.0.1:8877/** in a browser.

1. Choose **Junior**, **Senior**, or **Master** Detective.  
2. Explore hotspots (dashed boxes). Solid-border buttons navigate.  
3. Talk to NPCs via bottom-left talk buttons.  
4. Open **Notebook** for tasks + observations.  
5. Select inventory items, then tap a hotspot to use them — or tap a second item to **combine**.  
6. Toggle **Day / Night** at the cottage when the story needs it.  
7. Save anytime; **Continue Save** on the title screen.

### Full critical path (spoiler-light)

1. Cottage → Conservatory (Atrium) → talk **Celeste** (case brief).  
2. **Orchid Wing**: examine pedestal; grab UV chalk (+ tweezers optional).  
3. Atrium guestbook → **Herbarium**: talk Iris (after-hours); humidity sheet; optional Liora recipe notes.  
4. Climate panel PIN → **Glass Studio**: Rowan / tool rack; UV chalk on kiln.  
5. Act I complete → Celeste (badge fragment) → bent wire in studio.  
6. **Grounds**: open shed with wire → **Theo** (pawn slip).  
7. **Gala Marquee**: bid ledger → **Juliette**.  
8. Cottage → Night → Grounds service door (crowbar).  
9. Atrium badge log sort; oven keypad (recipe) → keycard.  
10. Hollow kiln brick (keycard + crowbar) → orchid.  
11. Cottage **Evidence Board** → accuse **Rowan** in the studio → ending card.

### Café & side content

**Moss & Bean Café** (from cottage): Finn’s rumors/hints, optional crossword, seating cipher in the marquee, Latin labels, glass formula quiz, bequest reassembly.

---

## Spoiler solutions (optional)

<details>
<summary>Click to expand answers</summary>

| Puzzle | Answer / method |
|--------|-----------------|
| Climate PIN | `62583` (day 62 + night 58 + bench 3) |
| Scratch match | Tungsten crescent pick |
| UV kiln | Select UV chalk (or UV kit) → tap kiln |
| Combine | Tweezers + UV chalk → UV sample kit → optional on pedestal |
| Shed lock | Bent Studio Wire on padlock |
| Oven keypad | `480520560` |
| Badge sort | Iris 23:40 → Studio 00:17 → Theo 06:05 → Celeste 07:10 |
| Seating cipher | `102018` |
| Service door | Cottage → Night → Grounds |
| Hollow brick | Studio keycard selected + crowbar in inventory |
| Evidence board | Tungsten hook · 00:17 badge/climate · hollow kiln orchid |
| Accusation | Talk Rowan after board locks |

</details>

---

## Implemented vs designed

| | Designed | In this build |
|--|----------|---------------|
| Rooms | 8 | **9** (8 + shed interior) |
| NPCs talkable | 6 + Mira POV | **6** (Celeste, Rowan, Iris, Theo, Juliette, Finn) + Mira monologues |
| Puzzles | 20 | **~18** playable (see list below); P02 guestbook & P07–P09 as examine/dialogue gates |
| Difficulty | Junior / Senior / Master | All three (Master = stretch gates) |
| Ending | Accuse + recover orchid | Full ending card |

**Puzzle IDs wired:** scratch_match (P01), guestbook examine (P02), climate_pin (P03), UV combine + pedestal (P04), uv_kiln (P05), oven_keypad (P06), Iris dialogue (P07), Theo pawn (P08), Juliette bid (P09), bequest_page (P10), shed_lock (P11), badge_sort (P12), glass_formula (P13), latin_labels (P14), seating_cipher (P15), service_door (P16), finn_crossword (P17), hollow_brick (P18), phone threat examine (P19 light), evidence_board (P20).

---

## Docs

| Doc | Contents |
|-----|----------|
| [docs/formula-analysis.md](docs/formula-analysis.md) | Genre formula notes |
| [docs/game-blueprint.md](docs/game-blueprint.md) | Full design: cast, plot, 20 puzzles, clue graph |
| [docs/ai-voice-workflow.md](docs/ai-voice-workflow.md) | Voice briefs / TTS pipeline placeholders |
| [docs/tech-architecture.md](docs/tech-architecture.md) | Scenes, inventory, dialogue, save, Capacitor path |

---

## Project layout

```
larkspur-hollow/
  index.html
  serve.sh
  css/game.css
  js/          # state, scenes, inventory, dialogue, puzzles, notebook, ui, audio, main
  data/        # rooms, items, dialogue, puzzles, examines, notebook (JSON)
  assets/      # voices/images placeholders
  docs/
  README.md
```

---

## Legal

Original IP. Genre conventions only. Do not ship with Nancy Drew names, plots, trademarked branding, or copyrighted dialogue/assets.
