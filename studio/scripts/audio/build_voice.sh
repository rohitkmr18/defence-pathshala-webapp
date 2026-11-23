#!/usr/bin/env bash
# Assemble + master the narration from the user's original recordings.
# Edit decision list (source seconds -> timeline seconds) is mirrored in
# src/projects/contrails/timeline.ts (VO_EDL). Only silences / non-lexical
# breaths are removed; no word is cut, re-ordered or time-stretched.
set -euo pipefail
A=assets/audio/source/vo_A_231505.m4a
B=assets/audio/source/vo_B_231511.m4a
OUT=${1:-public/audio/contrails_vo_master.wav}
ffmpeg -v error -y -i "$A" -i "$B" -filter_complex "
 [0:a]aresample=48000,atrim=4.05:52.62,asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st=48.52:d=0.05,adelay=350[a1];
 [0:a]aresample=48000,atrim=54.22:55.92,asetpts=PTS-STARTPTS,afade=t=in:d=0.03,afade=t=out:st=1.62:d=0.08,adelay=49550[a2];
 [1:a]aresample=48000,atrim=1.92:6.45,asetpts=PTS-STARTPTS,afade=t=in:d=0.03,afade=t=out:st=4.43:d=0.1,adelay=51550[b];
 [a1][a2][b]amix=inputs=3:normalize=0:duration=longest,apad=whole_dur=59.0,
 highpass=f=75:poles=2,
 afftdn=nr=8:nf=-50:tn=1,
 equalizer=f=220:t=q:w=1.0:g=-2.0,
 equalizer=f=3200:t=q:w=1.2:g=2.0,
 highshelf=f=9000:g=1.0,
 deesser=i=0.35:m=0.5:f=0.5,
 acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=2,
 loudnorm=I=-16:TP=-2:LRA=9
 [v]" -map "[v]" -ar 48000 -ac 1 -c:a pcm_s16le "$OUT"
