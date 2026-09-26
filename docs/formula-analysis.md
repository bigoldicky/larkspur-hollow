# Formula Analysis: Girl-Detective Point-and-Click Mysteries (1998–2010)

**Purpose:** Distill the publicly documented Her Interactive *adventure* formula into reusable design patterns for an *original* game.  
**Legal stance:** Genre conventions, difficulty tiers, UI patterns, and pacing ideas are fair game. Named IP (character names, book/game titles as plots, trademarked logos, copyrighted dialogue/assets) is **out of scope** and never reused here.

Sources consulted (public interviews, Wikipedia, reviews, walkthroughs, publisher new-player guides): Adventure Classic Gaming interview with Megan Gaiser / Carolyn Bickford / Sheri Hargus (2000); Gamezebo / Capsule Computers interviews with Jessica Chiang; HeR Interactive “new users” guide; Wikipedia entries on early titles; Just Adventure / Mystery Manor reviews and walkthroughs; Tomb of the Lost Queen difficulty interview (Roiter sisters).

---

## 1. Core loop

1. **Arrive** in a self-contained locale with a clear case brief (letter, phone call, or host).
2. **Explore** first-person nodes / rooms; click hotspots; collect inventory and notes.
3. **Interrogate** 3–5 suspects via branching dialogue menus; return later as new topics unlock.
4. **Solve** story-tied puzzles (codes, machinery, observation, inventory combines).
5. **Pace** via day↔night or day-advances that open new areas / move NPCs.
6. **Accuse** when evidence meets a dependency threshold; soft-fail with retry (“Second Chance” pattern).

Average playtime cited by developers for era titles: **~10–20 hours**.

---

## 2. Perspective & presentation

| Pattern | Era practice | Design takeaway |
|--------|--------------|-----------------|
| Camera | First-person; player *is* the detective | Monologue in second-person-ish wit (“You notice…”) or first-person quips |
| Navigation | Node-based rooms; turn left/right; map between buildings | Keep graph small & memorable for mobile |
| Characters | Animated NPCs in locations; some phone-only allies | 2–3 on-screen talkables + optional phone ally |
| Tone | Light suspense + humor; no combat; “cool without cruelty” | Threats are social / sabotage / stolen art, not gore |
| Educational flavor | Locale lore (history, science, art, languages, codes) | Embed real-feeling glassmaking / botany facts |

---

## 3. Systems that define the formula

### 3.1 Inventory & environmental puzzles
- Pick up keyed items; combine two inventory items; use item on hotspot.
- Codes from scattered observations (torn pages, timestamps, flora names).
- Machinery / panel puzzles with feedback lights.
- Observation puzzles: compare photos, spot differences, hidden compartments.

### 3.2 Dialogue gating
- Topics unlock after finding a clue or hearing a rumor.
- Wrong tone can temporarily lock a topic (soft social fail) — rare; more often new info simply appears.
- Allies on phone / in café provide hints without spoiling accusation.

### 3.3 Notebook / journal / to-do
- Auto-notes of important observations.
- **Junior** mode: explicit task list (“Talk to X”, “Find Y”).
- **Senior/Master**: thinner or no task list; player self-directs.

### 3.4 Difficulty tiers (publicly described)
- Early titles: **Junior / Senior / Master**.
- Later Adventure series often: **Junior / Senior** only.
- What changes: puzzle step counts, timer leniency, hint richness, task list presence — **not the plot**.
- Master historically tightened timers / reduced scaffolding (reviews note this unevenly).

### 3.5 Soft failure & Second Chance
- Capture, wrong accusation, poison / darkroom spill analogues → menu **Second Chance** restores a safe checkpoint.
- Encourages bold play; never hard-locks progress without recovery.

### 3.6 Day / night pacing
- Explicit day↔night toggle in bedroom / lounge in some titles.
- Automatic day advance on map travel in others.
- Night unlocks stealthy access, closed offices, different NPC schedules.

### 3.7 Phone / Hint Hotline
- Call friends for leveled hints.
- Later: Hint Hotline on phone with progressive nudges.

---

## 4. Cast structure (typical)

- **Detective** (player avatar): witty, curious, competent teen/young-adult investigator.
- **Host / ally** who invited them (often family friend / relative).
- **3–5 suspects** with overlapping motives and alibis.
- **Phone friends** (optional) for humor + hints.
- Red herrings planted early; true culprit revealed via evidence synthesis, not sudden Deus ex.

---

## 5. Locale design

Self-contained “snow-globe” settings dominate the era: mansion, TV studio, theater, museum, carousel fairground, university lab, etc. Each has:
- Public daytime spaces
- Restricted / after-hours spaces
- One “wow” centerpiece location (glasshouse, stage, gallery)

Educational hooks are woven into the setting’s craft (botany, glass art, theater tech) rather than bolted-on quizzes.

---

## 6. Writing voice

- Detective **examine monologues**: short, wry, observational (“Whoever polished this left fingerprints. Sloppy… or intentional?”).
- Suspects have distinct speech rhythms and tells.
- Humor undercuts dread; never mean-spirited bullying comedy.
- Closed captions / readable text always available (accessibility + silent play).

---

## 7. What we deliberately keep vs. discard

**Keep (genre patterns):** FP point-and-click; inventory; dialogue menus; notebook; Junior/Senior/(Master) scaffolding; day/night; soft retry; educational locale flavor; witty POV; no combat.

**Discard / avoid:** Any Nancy Drew character names, book titles as plots, Her Interactive trademarks, copyrighted dialogue, logos, or asset recreations.

**Modernize for mobile:** Larger hotspots, tap-friendly UI, offline PWA/Capacitor, optional TTS, shorter vertical-slice sessions (~20–40 min per act).

---

## 8. Checklist for original titles using this formula

- [ ] Original detective + cast names
- [ ] Self-contained locale with craft/education theme
- [ ] 3–5 suspects + ally; clear motive matrix
- [ ] Clue dependency graph (no orphan clues)
- [ ] Mix of inventory / code / observation / dialogue / environmental puzzles
- [ ] Difficulty variants that change *scaffolding*, not story
- [ ] Notebook tasks (Junior+) and witty examine lines
- [ ] Soft-fail recovery path
- [ ] Zero licensed IP references in content or marketing copy beyond “inspired by the genre”
