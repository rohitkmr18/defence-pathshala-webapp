#!/usr/bin/env bash
# Final soundtrack: narration (master) + ducked underscore + SFX → −14 LUFS, −1 dBTP.
set -euo pipefail
VO=${VO:-public/audio/contrails_vo_master.wav}; MUS=${MUS:-work/music.wav}; FX=${FX:-work/sfx.wav}
OUT=${1:-public/audio/contrails_mix.wav}
MUSIC_DB=${MUSIC_DB:--15}; FX_DB=${FX_DB:--7}
G="[0:a]aformat=channel_layouts=stereo,asplit=2[vo][sc];
 [1:a]volume=${MUSIC_DB}dB[mu];
 [mu][sc]sidechaincompress=threshold=0.02:ratio=5:attack=25:release=420:makeup=1[mud];
 [2:a]volume=${FX_DB}dB[fx];
 [vo][mud][fx]amix=inputs=3:normalize=0:duration=first,alimiter=limit=0.95:attack=3:release=60[m]"
# pass 1: measure
J=$(ffmpeg -hide_banner -i "$VO" -i "$MUS" -i "$FX" -filter_complex "$G;[m]loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
mi=$(echo "$J" | python3 -c "import sys,json;d=json.load(sys.stdin);print(d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'],d['target_offset'])")
read I TP LRA TH OFF <<< "$mi"
ffmpeg -v error -y -i "$VO" -i "$MUS" -i "$FX" -filter_complex "$G;[m]loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$I:measured_TP=$TP:measured_LRA=$LRA:measured_thresh=$TH:offset=$OFF:linear=true[o]" -map "[o]" -ar 48000 -c:a pcm_s16le "$OUT"
echo "mixed -> $OUT"
