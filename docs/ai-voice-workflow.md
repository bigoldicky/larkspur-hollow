# AI Voice Workflow — *Larkspur Hollow: The Glass Orchid*

Offline-first mobile game: ship with pre-rendered voice clips (generated in pipeline), not live cloud TTS at runtime. Runtime may optionally fall back to device TTS / Web Speech for accessibility.

---

## 1. Character voice briefs

| Character | Age feel | Timbre | Pace | Accent / color | Emotional baseline |
|-----------|----------|--------|------|----------------|--------------------|
| **Mira Quill** | 19 | Clear mezzo, slight rasp when amused | Medium-fast | Neutral PNW American | Curious, wry, never snide |
| **Celeste Quill** | mid-50s | Warm alto, precise diction | Measured | Soft Mid-Atlantic polish | Caring authority |
| **Rowan Vale** | late 20s | Bright tenor, talks with hands (energy in breath) | Fast, then clipped when lying | Urban creative | Charm → brittle |
| **Dr. Iris Pembroke** | early 40s | Soft, airy soprano-adjacent | Slow, thoughtful pauses | Light academic | Gentle, private |
| **Theo Marsh** | mid-40s | Gravel baritone | Slow | Rural PNW | Guarded kindness |
| **Juliette Crane** | mid-30s | Smooth, low conversational | Controlled | Coastal money-light | Strategic warmth |
| **Finn Hale** | early 30s | Friendly mid voice, smile audible | Easy | Local café chatter | Ally comic relief |

**Director notes for all:** Keep PG tone; no screaming; suspense = quieter, not louder.

---

## 2. Recommended TTS pipeline (concrete)

### Production (quality)
1. **ElevenLabs** (Multilingual v2 / Flash for iteration)
   - One voice ID per character; lock settings in `voices.json`
   - Export: 44.1 kHz WAV master → compress to Opus/M4A for mobile
2. Alternative cloud: **OpenAI TTS** (`gpt-4o-mini-tts` or `tts-1-hd`) with instructions field for style

### Local / budget / privacy
3. **Piper TTS** (onnx, runs on this Linux box)
   - Good for scratch VO and CI regeneration
   - Voices: map each character to a distinct Piper model
4. **Coqui XTTS** / **StyleTTS2** if cloning from consented scratch reads later

### Suggested hybrid
- Draft & iterate lines with **Piper** on-box  
- Final hero VO with **ElevenLabs** or **OpenAI TTS**  
- Keep identical filenames so swap is drop-in  

### Example local Piper batch
```bash
# pip install piper-tts  (or use piper binary)
piper --model en_US-amy-medium.onnx \
  --output_file assets/voices/mira/examine_pedestal.wav \
  < lines/mira/examine_pedestal.txt
```

### Example ElevenLabs (pseudo)
```bash
curl -X POST "https://api.elevenlabs.io/v1/text-to-speech/$VOICE_MIRA" \
  -H "xi-api-key: $ELEVEN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text":"'"$(cat lines/mira/examine_pedestal.txt)"'","model_id":"eleven_multilingual_v2"}' \
  --output assets/voices/mira/examine_pedestal.mp3
```

---

## 3. Prompt templates

### Mira examine monologue
```
You are Mira Quill, a witty 19-year-old amateur detective.
Speak in first person, 1–3 short sentences.
Tone: curious + dry humor; never mean. PG.
Topic/object: {{OBJECT}}
Known facts: {{FACTS}}
Constraint: do not spoil unfound clues; hint at detail the player can click next.
```

### Suspect dialogue line
```
Character: {{NAME}} ({{BRIEF}})
Beat: {{BEAT_ID}} — {{BEAT_GOAL}}
Player just chose: "{{PLAYER_CHOICE}}"
Write one spoken reply (15–40 words) + optional parenthetical stage direction for TTS (e.g. [hesitates]).
Stay in voice. No cursing. No breaking fourth wall.
```

### Hint Hotline (Finn)
```
Finn Hale gives a {{LEVEL}} hint (nudge|medium|sharp) about puzzle {{PUZZLE_ID}}.
One sentence. Encouraging. Do not give the exact answer on nudge/medium.
```

---

## 4. File naming & folder layout

```
assets/voices/
  mira/
    examine_pedestal.ogg
    examine_guestbook.ogg
    monologue_intro.ogg
  celeste/
    dlg_brief_01.ogg
    dlg_brief_02.ogg
  rowan/
    dlg_a_01.ogg
    dlg_c_nervous_01.ogg
  _meta/
    voices.json          # voice IDs, gain, silence trim
    manifest.csv         # path, character, line_id, text, duration_ms
```

**Convention:** `{character}/{line_id}.{ext}`  
`line_id` matches keys in `data/dialogue.json` / `data/examines.json`.

`manifest.csv` columns:
`line_id,character,text,file,duration_ms,loudness_lufs`

---

## 5. Lip-sync & mobile placeholders

### Vertical slice (now)
- **No facial mesh.** Use:
  - Static illustrated busts
  - **Talk bob**: scale/bounce sprite 2–3 px while `HTMLAudioElement` is playing
  - Optional waveform bar under nameplate
  - Caption text always on (matches VO or stands alone)

### Next step (Capacitor build)
- Rhubarb Lip Sync or limited viseme set (A/E/I/O/U/Rest) from WAV → JSON timings  
- Swap mouth sprites on bust  
- If budget zero: keep bob + captions (reads fine; era PC games often had limited lip sync)

### Silence / missing file strategy
```js
async function playLine(lineId) {
  const url = voiceUrl(lineId);
  try {
    await audio.play();
    setTalking(true);
  } catch {
    // placeholder: show caption only + subtle tick SFX
    showCaption(lineId);
    playSfx('ui_tick');
  }
}
```

Ship the slice with **caption-first**; drop in `.ogg` files later without code changes.

---

## 6. QA checklist

- [ ] Every spoken string has a manifest row  
- [ ] Loudness normalized (~-16 LUFS dialog)  
- [ ] No clipping on Rowan fast lines  
- [ ] Captions match audio ≤2% divergence  
- [ ] Offline pack ≤ size budget (compress Opus 24–32 kbps mono for dialog)  
