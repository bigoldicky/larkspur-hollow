# Game Blueprint — *Larkspur Hollow: The Glass Orchid*

**Working title:** Larkspur Hollow: The Glass Orchid  
**Slug:** `larkspur-hollow`  
**Genre:** First-person point-and-click mystery adventure (mobile-first, offline-capable)  
**Tone:** Witty detective POV, light suspense, botanical/glass-art education, no combat  
**Target session:** Full game ~8–12 hours designed; this blueprint covers the full design. Vertical slice implements Act I chain.

---

## Elevator pitch

When a one-of-a-kind glass orchid vanishes from the mountain conservatory of Larkspur Hollow on the eve of the Spring Gala, visiting sleuth **Mira Quill** has forty-eight hours to prove it was stolen—not shattered—before the town’s reputation (and her aunt’s career) cracks with it.

---

## Setting

**Larkspur Hollow** — a misty Pacific Northwest arts-and-botany village built around the **Quill Conservatory**, a Victorian glasshouse complex famous for rare orchids and the annual **Glass & Bloom Gala**.

Key locations (self-contained snow-globe):
1. **Atrium Lobby** — tickets, guestbook, public sculptures
2. **Orchid Wing** — display benches, climate panels, empty pedestal of *The Glass Orchid*
3. **Glass Studio Annex** — kilns, annealing ovens, tools (Rowan’s domain)
4. **Herbarium Archive** — pressed specimens, research desks (Iris’s domain)
5. **Grounds & Potting Shed** — tools, compost, service door (Theo’s domain)
6. **Gala Marquee / Patron Lounge** — donor lists, champagne prep (Juliette’s orbit)
7. **Aunt Celeste’s Cottage** — Mira’s bedroom, day/night toggle, phone
8. **Moss & Bean Café** — ally Finn, gossip, night hours

Educational flavor: glass annealing temperatures, orchid microclimates, Latin binomials, Victorian greenhouse engineering.

---

## Plot synopsis

### Setup
Mira arrives to help Aunt Celeste host the gala. Overnight, the centerpiece—*The Glass Orchid*, a translucent sculpture by late master artisan **Liora Finch**—disappears from its locked pedestal. Security claims the case was intact until dawn. Rumors say it was *smashed* and quietly swept; Celeste insists the shards don’t match Liora’s signature glass formula.

### Investigation spine
Mira discovers: (1) the pedestal lock was picked with a non-standard tool; (2) a soldered “petal fragment” in the studio is a red herring planted glass; (3) climate logs were altered; (4) a patron bid war went ugly; (5) a secret buyer offered cash via anonymous note.

### Red herrings
- **Rowan Vale** argued with Celeste about “modernizing” Liora’s legacy; found with glass dust on boots → dust is from legitimate kiln work.
- **Dr. Iris Pembroke** accessed the Orchid Wing after hours “for humidity checks”; her notes mention “extracting tissue” → she was sampling *living* orchids, not the sculpture.
- **Theo Marsh** has gambling debts and a pawn slip → he pawned his *own* grandfather’s watch, not the orchid.
- **Juliette Crane** privately offered $80k for the piece and lied about her alibi at first → she was meeting a divorce lawyer, not fencing art.

### True culprit: **Rowan Vale** — with a twist
Rowan *did* remove the orchid—but as temporary “insurance” after discovering Juliette planned to pressure Celeste into a forced private sale that would break Liora’s bequest (sculpture must remain public). Rowan hid it in a hollow kiln brick, intending to “recover” it heroically. When Mira closes in, Rowan panics and frames Theo with the planted fragment. Evidence of kiln-brick residue + Rowan’s unique tungsten pick + altered studio badge log proves intent to deceive. Resolution: orchid recovered; Rowan faces restitution / community service, not cartoon villainy; Juliette’s sale scheme exposed; Celeste reforms gala contracts.

*(Tone: clever, human motives; justice without bloodshed.)*

---

## Characters (6)

| ID | Name | Role | Voice / tell |
|----|------|------|--------------|
| mira | **Mira Quill** | Player detective, 19, visiting niece | Dry humor, notices small physical tells |
| celeste | **Celeste Quill** | Ally; Conservatory director | Warm, precise, protective of Liora’s legacy |
| rowan | **Rowan Vale** | Suspect → culprit; resident glass artist | Fast talk, deflects with jargon, boot glass-dust |
| iris | **Dr. Iris Pembroke** | Suspect; botanist | Soft-spoken, Latin as comfort blanket |
| theo | **Theo Marsh** | Suspect; groundskeeper | Gruff kindness, hates pity about debts |
| juliette | **Juliette Crane** | Suspect; gala patron / collector | Polished, strategic pauses, perfume tell |
| finn | **Finn Hale** | Ally; café owner (phone/café gossip) | Wry local historian energy |

---

## Clue dependency graph

```
[Case Brief from Celeste]
        │
        ├─► Examine empty pedestal ──► note: non-standard scratch pattern
        │         │
        │         └─► Talk Rowan about tools ──► topic: tungsten picks
        │
        ├─► Guestbook timestamps ──► Iris after-hours entry
        │         └─► Confront Iris ──► living-tissue sampling confession (clears smash rumor)
        │
        ├─► Potting shed pawn slip ──► Talk Theo ──► watch story (clears pawn)
        │
        ├─► Patron lounge bid ledger ──► Juliette $80k offer
        │         └─► Dialogue gate: ask Juliette about bid ──► lawyer alibi (partial clear)
        │
        ├─► Climate panel code (from herbarium humidity sheet) ──► reveal altered log
        │         └─► Altered log implicates studio badge after midnight
        │
        ├─► Inventory: tweezers + UV chalk ──► reveal kiln-brick residue on pedestal base
        │         └─► Search kiln ──► hollow brick (orchid) ──► requires studio keycard
        │
        └─► Combine: badge log + tungsten scratch + hollow kiln
                  └─► Accusation unlock vs Rowan
```

**Hard gates:** climate code before altered log; UV reveal before kiln search; three clears (Iris tissue, Theo watch, Juliette lawyer) before Final Accusation option appears (Senior); Junior shows accusation earlier with warning.

---

## Puzzle list (20 designed)

| # | ID | Name | Type | Location | Notes |
|---|----|------|------|----------|-------|
| 1 | P01 | Pedestal scratch match | Observation | Orchid Wing | Compare scratch photo to tool silhouettes |
| 2 | P02 | Guestbook cipher hours | Code | Atrium | Convert check-in glyphs → 24h times |
| 3 | P03 | Humidity sheet → climate PIN | Code / env | Herbarium → Orchid Wing | Junior: digits highlighted |
| 4 | P04 | Combine tweezers + UV chalk | Inventory combine | Inventory | Reveals residue trail |
| 5 | P05 | Follow UV trail to kiln | Environmental | Studio | Hotspot reveal after P04 |
| 6 | P06 | Annealing oven keypad | Code | Studio | Temp recipe from Liora notebook |
| 7 | P07 | Dialogue: Iris tissue topic | Dialogue gating | Herbarium | Unlocks after P02 |
| 8 | P08 | Dialogue: Theo pawn | Dialogue gating | Shed | After finding slip |
| 9 | P09 | Dialogue: Juliette bid | Dialogue gating | Lounge | After ledger |
| 10 | P10 | Reassemble torn bequest page | Inventory / observation | Cottage | Order strips by watermark |
| 11 | P11 | Potting-shed lock picks | Environmental | Shed | Use bent wire from studio |
| 12 | P12 | Badge log timeline sort | Observation | Atrium office | Drag events into order |
| 13 | P13 | Glass formula quiz-panel | Educational / code | Studio | Match oxide ratios (flavor) |
| 14 | P14 | Orchid Latin labels | Observation / edu | Orchid Wing | Match tags to benches |
| 15 | P15 | Gala seating chart cipher | Code | Marquee | Initials → locker digits |
| 16 | P16 | Night-only service door | Environmental + time | Grounds | Requires night mode |
| 17 | P17 | Finn rumor crossword | Dialogue mini | Café | Optional hint unlock |
| 18 | P18 | Hollow kiln brick | Inventory use | Studio | Use keycard + crowbar |
| 19 | P19 | Voice-disguised phone threat | Observation | Cottage | Match background ambience |
| 20 | P20 | Final evidence board | Synthesis | Cottage | Pin 3 proofs to accuse |

### Difficulty variants (~5 key puzzles)

| Puzzle | Junior | Senior | Master |
|--------|--------|--------|--------|
| P03 Climate PIN | 3-digit; sheet circles digits | 4-digit; must cross-ref two pages | 5-digit; pages partially smudged |
| P06 Oven keypad | Sequence shown once in notebook | Sequence from recipe math | Timed entry; wrong resets |
| P12 Badge sort | 4 events, one distractor | 6 events, two distractors | 8 events; must infer missing stamp |
| P18 Kiln brick | Hotspot sparkles | No sparkle; need UV still active | UV fades; reapply chalk |
| P20 Evidence board | Correct slots glow faintly | No glow; any 3 wrong = soft fail | Wrong pin burns a “credibility” token |

---

## Notebook task list (Junior shown; Senior abbreviated)

**Act I — Vertical slice focus**
1. Talk to Aunt Celeste about the missing orchid
2. Examine the empty pedestal in the Orchid Wing
3. Search the Atrium guestbook for odd hours
4. Visit the Herbarium and ask Dr. Pembroke about after-hours access
5. Find something to reveal invisible marks (UV chalk)
6. Check the Glass Studio for matching tool scratches
7. Open climate controls with the humidity code
8. Update notes when a suspect’s story changes

**Later acts (designed, not all in slice)**
9. Speak to Theo about the pawn slip  
10. Confront Juliette with the bid ledger  
11. Switch to night and check the service door  
12. Recover the orchid and build the accusation  

---

## Dialogue beat outline

### Celeste (ally)
- Beat A: Case brief — “It wasn’t smashed. Liora’s glass sings differently when it breaks.”
- Beat B: After pedestal exam — unlocks studio permission
- Beat C: After climate log — shares badge admin password fragment
- Beat D: Ending — gratitude + soft rebuke of town gossip

### Rowan (suspect → culprit)
- Beat A: Friendly shop talk; offers tungsten pick lore (self-incriminating later)
- Beat B: Defensive about glass dust
- Beat C: After UV trail — nervous; suggests Theo’s debts
- Beat D: Accusation — confession of “protective theft” + framing panic

### Iris
- Beat A: Botanical small talk
- Beat B (gated): After-hours → tissue sampling for blight study
- Beat C: Helps translate Latin labels (P14 assist)

### Theo
- Beat A: Gruff “stay out of the mulch”
- Beat B (gated): Pawn slip → grandfather’s watch
- Beat C: Night tip about service door squeak

### Juliette
- Beat A: Charm offensive
- Beat B (gated): $80k bid → admits lawyer meeting
- Beat C: Optional: offers Mira a “consulting gift” (refuse for integrity note)

### Finn (café / phone)
- Hints leveled: rumor → nudge → sharper nudge
- Humor beats about gala canapés and Victorian plumbing

---

## Vertical slice scope (what the prototype ships)

Playable path:
1. Title → difficulty select (Junior / Senior)  
2. Cottage intro monologue → Conservatory Atrium  
3. Talk Celeste (case brief)  
4. Orchid Wing: examine pedestal (monologue + notebook)  
5. Pick up **UV chalk**; guestbook observation  
6. Herbarium: talk Iris (branch); find humidity sheet  
7. Climate PIN puzzle (difficulty-scaled)  
8. Studio: talk Rowan; combine/use UV chalk; find tungsten clue  
9. Inventory chain completes → slice finale card (“Act I complete — orchid trail leads to the kiln…”)

**Implemented puzzles in slice:** ≥3 chained (pedestal observation, climate code, UV/inventory reveal) + dialogue gates.

---

## Content originality statement

All names, plot, dialogue, and puzzles are original. The work borrows only public-domain *genre patterns* of girl-detective point-and-click mysteries popularized in late-90s/2000s PC adventures—not any protected expression from Her Interactive or the Nancy Drew franchise.
