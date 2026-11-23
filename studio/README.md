# Defence Pathshala Reel Studio

Isolated, narration-first production pipeline for Defence Pathshala science reels
(Remotion + Three.js + React Postprocessing + Blender). **Not part of the webapp build or
Vercel deployment.** Nothing in `frontend/`, `backend/`, Supabase, auth, SEO or CI is touched.

## Quick start

```bash
cd studio
npm install
node scripts/prepare-assets.mjs        # fonts + official logo → public/
npx remotion studio src/index.ts       # interactive preview (composition: DPContrails)
./scripts/render-contrails.sh          # full reproducible build → renders/contrails/
```

Requirements: Node ≥ 22 (runs `.ts` via type stripping), FFmpeg, Python 3 with numpy,
Blender as a Python module (`pip install bpy==5.3.0`, Python 3.13) for the 3D asset steps,
and a Chromium for headless rendering (`remotion.config.ts`; uses SwiftShader WebGL via
`--gl=swangle`, so no GPU is needed).

## How a reel is built (contrails as the reference project)

1. **Narration first.** Put the recorded takes in `assets/audio/source/` (git-ignored).
   `scripts/audio/segment_transcribe.py` finds pause-delimited phrases and transcribes them;
   `scripts/audio/keyword_onsets.py` measures when key words are spoken (progressive-prefix
   Whisper decoding). Results go into `src/projects/<reel>/timeline.ts` — the single source of
   truth for captions, scene cuts, reveals, SFX cues and the SRT.
2. **Voice master** — `scripts/audio/build_voice.sh` (edit list + HPF/NR/EQ/de-ess/comp/loudness).
3. **3D assets** — `scripts/blender/*.py` (bpy): generic airliner GLB, Cycles engine shot that
   also exports its camera so Three.js effects composite in the same 3D space.
4. **Scenes** — `src/scenes/*` composed in `src/compositions/ContrailsReel.tsx` with reusable
   components in `src/components/` (LogoBug, Captions, KineticTitle, SciLabel, Chip, SceneSlot)
   and `src/three/` (SkyDome, Contrail particle physics, SkyScene, Airliner, CameraRig, SettleFrame).
5. **Sound** — `scripts/audio/score_and_sfx.py` (original synthesised score + SFX from the cue
   sheet) and `scripts/audio/mix.sh` (sidechain ducking, −14 LUFS / −1.5 dBTP).
6. **Render + QA** — `scripts/render-contrails.sh` → final MP4, preview, contact sheet, SRT,
   technical measurements (`scripts/qa/`).

`src/poc/` holds the WebGL smoke test, the 5-second proof of concept and a per-scene test harness
(`SceneTest`, prop `scene`).

## Guardrails

- Use the user's own recorded voice and the **official, unaltered** DP logo.
- Only verified-license assets; this project uses none from third parties (see `projects/contrails/sources.md`).
- Rendered media, voice files, logo copies and generated assets are git-ignored.
- Remotion has its own license — check team size against remotion.dev/license before commercial use.
