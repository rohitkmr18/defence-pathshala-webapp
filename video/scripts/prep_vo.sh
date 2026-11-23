#!/usr/bin/env bash
# public/vo/vo-raw.mp3 (the recorded take) -> public/vo/vo.mp3:
# long pauses trimmed to 0.24 s, then 1.15x tempo (pitch preserved). 104.7 s -> 89.8 s.
set -euo pipefail
cd "$(dirname "$0")/../public/vo"
ffmpeg -y -i vo-raw.mp3 -af "silenceremove=stop_periods=-1:stop_duration=0.32:stop_threshold=-35dB:stop_silence=0.24,atempo=1.15" -ar 44100 -ac 1 -codec:a libmp3lame -b:a 160k vo.mp3
