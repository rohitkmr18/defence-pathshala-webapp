#!/usr/bin/env bash
# End-to-end, reproducible build of the contrails reel.
#   1 brand assets → 2 narration master → 3 cues/SRT → 4 score+SFX+mix
#   5 (optional) Blender engine shot → 6 Remotion render → 7 delivery encodes + QA
# Requires: node ≥22, ffmpeg, python3 (numpy), Blender as python module (bpy) for step 5.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=renders/contrails; mkdir -p "$OUT" work
BPY=${BPY:-/home/user/bpyenv/bin/python}
node scripts/prepare-assets.mjs
./scripts/audio/build_voice.sh public/audio/contrails_vo_master.wav
node scripts/export-timeline.mjs "$OUT/contrails_captions.srt"
python3 scripts/audio/score_and_sfx.py work/cues.json work/music.wav work/sfx.wav
./scripts/audio/mix.sh public/audio/contrails_mix.wav
[ -f public/models/airliner.glb ] || "$BPY" scripts/blender/build_airliner.py public/models/airliner.glb
if [ ! -f public/renders/engine/engine_0179.png ]; then
  PREVIEW_SCALE=${ENGINE_SCALE:-0.75} "$BPY" scripts/blender/engine_shot.py public/renders/engine 0 179 ${ENGINE_SAMPLES:-14}
  cp public/renders/engine/engine_camera.json src/projects/contrails/engine_camera.json
fi
npx remotion render src/index.ts DPContrails "$OUT/contrails_master.mp4" \
  --codec=h264 --crf=16 --pixel-format=yuv420p --audio-codec=aac --audio-bitrate=320k \
  --concurrency=${CONCURRENCY:-2} --log=error
# delivery: H.264 High, yuv420p, 30 fps CFR, AAC 48 kHz, fast-start
ffmpeg -v error -y -i "$OUT/contrails_master.mp4" -c:v libx264 -preset slow -crf 17 -profile:v high -level 4.2 \
  -pix_fmt yuv420p -r 30 -c:a aac -b:a 256k -ar 48000 -movflags +faststart "$OUT/contrails_final_1080x1920.mp4"
ffmpeg -v error -y -i "$OUT/contrails_final_1080x1920.mp4" -vf scale=540:960 -c:v libx264 -preset medium -crf 27 \
  -c:a aac -b:a 128k -movflags +faststart "$OUT/contrails_preview.mp4"
python3 scripts/qa/contact_sheet.py "$OUT/contrails_final_1080x1920.mp4" "$OUT/contrails_contact_sheet.png"
python3 scripts/qa/check_video.py "$OUT/contrails_final_1080x1920.mp4" > "$OUT/contrails_qa_measurements.json"
echo "done → $OUT"
