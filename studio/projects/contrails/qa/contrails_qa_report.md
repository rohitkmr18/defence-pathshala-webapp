# Contrails reel — QA report

**Deliverable:** `contrails_final_1080x1920.mp4`. Rendered and inspected on 2026-11-12. Pipeline: `studio/scripts/render-contrails.sh`.

## 1. Technical specification (measured on the final file)

| Item | Result |
|---|---|
| Duration | 59.008 s (1770 frames) |
| Resolution / aspect | 1080×1920 (9:16) |
| Frame rate | 30/1 CFR |
| Video | H.264 High, yuv420p, ≈4361 kbps, fast-start |
| Audio | AAC 48000 Hz, 2 ch, ≈243 kbps |
| Loudness | -14.0 LUFS integrated, true peak -1.9 dBTP, LRA 3.7 LU (target −14 LUFS / ≤ −1 dBTP) |
| Black frames | 0 |
| Silent gaps > 0.6 s | 0 |
| Frozen runs > 0.5 s | 11: all are deliberate holds on titles, the quiz and the end card. Background lines still drift slowly. |
| File size | 34.03 MB (preview: 2.64 MB, 540×960) |

## 2. Render status

- Phase A, environment: Node 22.23, FFmpeg, Chromium headless shell 1243. WebGL works only with `--gl=swangle` (SwiftShader); `angle` fails. Remotion 4.0.543, three 0.187, R3F 9.8.2, @react-three/postprocessing 3.2.2 (postprocessing 6.39.6): Bloom, Vignette, Noise and DepthOfField all render. Blender 5.3 runs as the `bpy` Python module (Cycles on CPU). Blender MCP: see §7.
- Phase B, proof of concept: a 5 s aircraft-and-contrail shot (`renders/poc/contrail_poc_5s.mp4`). 150/150 frames, no black frames, smooth frame-to-frame deltas. Fixes made afterwards: framing and drift, a "beaded" trail, and two R3F/Remotion capture bugs. The async GLB was missing from frames, and postprocessing gave blank stills. Both were fixed by preloading in the Remotion tree and adding `SettleFrame`.
- Phases C to F: full draft, then visual QA, then fixes, then the final render. Defects found and fixed before the final:
  - The engine plume read as brown "smoke". It is now an invisible hot shimmer, and white only appears after mixing with cold air.
  - The cold-air particles looked like dust on the wing.
  - The Blender engine camera was re-shot so the exhaust runs through open sky.
  - The ground sky had a violet cast from a colour-space issue.
  - Tags were not attached to their aircraft. They are now projected from 3D.
  - Chip subtitles were too small. The minimum size is now 26 px.
  - The "DRY AIR" label was mistimed.
  - The quiz header overlapped the question, and the end-card dissolve left ghosting.
  - The ice freezing step finished after "ice crystals" was spoken.
- Render time for the final pass is about 28 min on 4 CPU cores with no GPU.

## 3. Narration and captions

- Both supplied recordings were used, in the order A (58.9 s, main) then B (8.4 s, CTA). The order comes from the content and the file timestamps.
- Edits: lead-in silence removed (0–4.05 s). Two low-frequency non-lexical hums removed (at 3.6 s and 53.4–53.9 s in take A). The 0.9 s think-pause before "Answer…" was shortened to about 0.7 s. No words were cut, re-ordered or time-stretched.
- Processing: high-pass 75 Hz, light FFT denoise (8 dB), −2 dB at 220 Hz, +2 dB at 3.2 kHz, de-esser, 3:1 compression, then loudness normalisation. In the final mix the music is sidechain-ducked under the voice.
- Timing: phrase boundaries come from pause detection on the recording. 33 keyword anchors were measured by progressive-prefix Whisper decoding. One anchor ("affect") could not be detected and uses an estimate. All 27 caption units start on speech (energy check), and no speech is left uncaptioned.
- Captions are phrase-level, not word-level. No forced-alignment model could be downloaded here.

## 4. Scientific verification

- **The recorded CTA differs from the written script.** The recording asks "Kya aeroplane ki white contrails Earth ke climate ko affect kar sakti hain?", not the engine-off question. Following the brief, the recording takes precedence. The engine-off quiz was not used, so nothing implies that a dead engine makes exhaust contrails.
- The narration does not say the options aloud ("A, B ya C comment karo"). The on-screen options were written to fit the question:
  - A: HAAN, CLIMATE PAR ASAR PADTA HAI (correct, not revealed)
  - B: NAHI, YE SIRF PAANI HAI
  - C: SIRF BAARISH WALE DIN

  Basis for A: contrail cirrus has a net warming effective radiative forcing (Lee et al. 2021; IPCC AR6), with large uncertainty. **Please confirm these options before publishing.**
- No scientific inaccuracies were found in the narration. Visual clarifications added on screen:
  - Hot exhaust is invisible.
  - The visible trail starts behind the engine, after mixing.
  - Vapour → droplet → ice, forming on soot/aerosol nuclei.
  - Crystals are micrometre-sized, not snowflakes.
  - "Humidity" means humidity relative to ice at cruise altitude (RHi < 100 % vs ice-supersaturated > 100 %), not surface humidity.
  - Cruise is about 10–12 km at about −40 to −60 °C.
  - The persistent trail panel is labelled TIME-LAPSE.
- Two-jet shot: the lower, warmer jet makes no trail and the higher one does. This is consistent with the Schmidt–Appleman criterion.
- Deliberate simplifications: the engine exhaust speed and the mixing distances are slowed and compressed for legibility, and the aircraft are scaled about 1.7–2.2× in the ground-view shots so they can be seen.

## 5. Branding verification

- The official logo is the exact supplied file (525×476 RGBA, already transparent), copied without changes. It sits top-right inside the safe area (top 168 px, right 44 px, 104 px) on a white plate so the blue mark stays legible on blue sky. It is present in every frame after a 0.15 s fade-in.
- Colour tokens: #020617, #0B1A3A, #2563EB, #EF4444, #FFFFFF and #CBD5E1. In captions, scientific terms use the lighter brand-family blue #60A5FA for contrast on the dark caption plate.
- Type: Geist Black/Bold (display) and Inter ExtraBold/Medium (captions), both OFL from npm.
- Safe areas: captions are centred at y = 1310. All key text sits between y ≈ 230 and 1370 and inside x 60–1020, clear of the Reels/Shorts UI (bottom 360 px and the right-hand action column).

## 6. Asset licence verification

- No third-party footage, photos, music or SFX are used. The network policy blocked those sources, so every visual and sound is procedural and original.
- Full ledger: `projects/contrails/sources.md`.
- Remotion uses its own licence. Check the team-size terms before commercial use.

## 7. Required integrations: actual status

- **Three.js:** used for all 3D: sky, contrail physics, aircraft, exhaust and crystals.
- **React Postprocessing:** used for Bloom, Vignette, film grain and DoF (ice macro), all restrained.
- **Blender:** the airliner GLB and the 180-frame Cycles turbofan shot were built with `bpy` 5.3 scripts. The camera is exported per frame so the Three.js particles share its 3D space.
- **Blender MCP (ahujasid/mcp-for-blender):** inspected but **not usable in this session**. It needs Blender's GUI add-on socket server plus an MCP client registered at session start. The session cannot register new MCP servers, and headless `bpy` has no event loop for the add-on's timer server. The same scene operations were scripted directly with `bpy`. To use MCP, run Blender desktop with the add-on and connect the `mcp-for-blender` server in a local Claude Code session.
- **Video Shotcraft:** used as a methodology and QA reference (`aesthetic-rules`, `final-review`, sound-design riser→impact patterns). Helpers adapted: `mulberry32` and `dampedSettle`. Its bundled BGM (house/hip-hop) was rejected as tonally wrong. Its Freesound SFX tooling could not be used because Freesound was blocked.

## 8. Known limitations

1. No photoreal stock footage. The aircraft and sky are stylised CG; the aircraft is a generic procedural model, not a detailed airliner.
2. Captions are phrase-synchronised, not word-by-word karaoke.
3. The music and SFX are synthesised, which is cleaner than library sound but simpler.
4. The quiz options are not spoken in the narration and need editorial sign-off.
5. Scientific citations are standard references. The source pages could not be fetched here, so please spot-check them.
6. The "affect" anchor in the quiz uses an estimated timing (±0.3 s).

## 9. Deliverables

- `contrails_final_1080x1920.mp4`: the final reel.
- `contrails_final_nomusic_1080x1920.mp4`: the same timeline with voice and SFX only, no music.
- `contrails_preview.mp4`: 540×960 review copy.
- `contrails_contact_sheet.png`: 16 frames covering every scene.
- `contrails_captions.srt`: 27 cues.
- `contrails_qa_measurements.json`: raw technical checks.
- `contrails_master.mp4`: the Remotion master before the delivery encode.
