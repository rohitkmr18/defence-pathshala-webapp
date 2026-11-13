"""Pause-based phrase segmentation + Whisper (sherpa-onnx) transcription.
Produces real phrase-level timestamps from the recorded narration.
usage: python3 segment_transcribe.py <wav16k> <model_dir> <out.json> [lang ...]"""
import sys, json, wave, numpy as np, sherpa_onnx

wav, mdir, out = sys.argv[1], sys.argv[2], sys.argv[3]
langs = sys.argv[4:] or ["hi"]
with wave.open(wav) as w:
    sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
hop = int(sr * 0.01)
rms = np.array([np.sqrt(np.mean(x[i:i+hop*2]**2) + 1e-12) for i in range(0, len(x) - hop*2, hop)])
db = 20 * np.log10(rms)
thr = max(np.percentile(db, 20) + 8, -45)
voiced = db > thr
# find pauses >= 120ms
segs, i, n = [], 0, len(voiced)
in_sp, st = False, 0
runs = []
for k in range(n):
    if voiced[k] and not in_sp: in_sp, st = True, k
    if not voiced[k] and in_sp:
        in_sp = False; runs.append([st, k])
if in_sp: runs.append([st, n])
# merge runs separated by < 12 frames (120ms)
merged = []
for r in runs:
    if merged and r[0] - merged[-1][1] < 12: merged[-1][1] = r[1]
    else: merged.append(r)
merged = [r for r in merged if r[1] - r[0] >= 8]
print("threshold dB", round(thr, 1), "phrases", len(merged), file=sys.stderr)
recs = {}
for lang in langs:
    recs[lang] = sherpa_onnx.OfflineRecognizer.from_whisper(
        encoder=f"{mdir}/turbo-encoder.int8.onnx", decoder=f"{mdir}/turbo-decoder.int8.onnx",
        tokens=f"{mdir}/turbo-tokens.txt", language=lang, task="transcribe", num_threads=4, tail_paddings=3000)
res = []
for a, b in merged:
    s, e = a * 0.01, b * 0.01
    chunk = np.concatenate([x[max(0, int((s - 0.08) * sr)):int((e + 0.08) * sr)], np.zeros(sr, np.float32)])
    row = {"start": round(s, 2), "end": round(e, 2)}
    for lang, r in recs.items():
        st = r.create_stream(); st.accept_waveform(sr, chunk); r.decode_stream(st)
        row[lang] = st.result.text.strip()
    print(json.dumps(row, ensure_ascii=False), flush=True)
    res.append(row)
json.dump(res, open(out, "w"), ensure_ascii=False, indent=1)
