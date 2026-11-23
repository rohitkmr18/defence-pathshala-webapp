# DP reels (Remotion)

Free, code-driven reel production. The Kashmir reel is driven by `src/timeline.ts`.

```bash
cd video && npm i
REMOTION_BROWSER=/opt/pw-browsers/chromium npm run studio   # live preview (omit the env var on your own machine)
npm run still -- --frame=150                                # check one frame
npm run render                                              # out/kashmir-reel.mp4
```

## Map layers
`src_assets/2.png` is the DP base map. `scripts/prepare_map.py` splits it into animation
layers in `public/maps/` (clean line work, one mask per region, LoC) and strips the baked-in
labels/legend/logo; the video re-adds those as animated overlays.

```bash
pip install opencv-python-headless numpy pillow scipy
python3 scripts/prepare_map.py
```
To use different artwork (e.g. the Survey of India based version), replace
`src_assets/2.png` and adjust `RECTS`/colours at the top of the script, then re-run.
`src_assets/3.png` is the 8-scene storyboard the timeline follows.

## Workflow
script → record VO → drop `public/vo/vo.wav`, set `HAS_VO = true`, retime scene `dur`
values to the recording → add photos in `public/photos/` and set `photo.file` → render → QA.
Script, shot list and fact-check sheet: `docs/reels/kashmir-three-countries/script.md`.

## Before publishing
- Map boundaries/labels must be signed off against the official Survey of India depiction.
- Archival photos need a source and licence noted in the script doc.
- Fact-check every date (table in the script doc).
