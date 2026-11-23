# DP reels (Remotion)

Free, code-driven reel production. Kashmir reel lives in `src/timeline.ts`.

```bash
cd video && npm i
REMOTION_BROWSER=/opt/pw-browsers/chromium npm run studio   # live preview (omit env var on your own machine)
npm run still -- --frame=150                                # check one frame
npm run render                                              # out/kashmir-reel.mp4
```

Workflow: script → record VO → drop `public/vo/vo.wav`, set `HAS_VO = true`, retime scene
`dur` values to the recording → add photos in `public/photos/` and set `photo.file` →
swap official map paths (`public/maps/README.md`) → render → QA.
Script, shot list and fact-check sheet: `docs/reels/kashmir-three-countries/script.md`.
