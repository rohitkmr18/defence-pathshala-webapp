"""Technical QA of a rendered reel: stream specs, black/frozen frames,
luma range, audio loudness/peaks, silence gaps. Prints JSON."""
import sys, json, subprocess, numpy as np, re
vid = sys.argv[1]
probe = json.loads(subprocess.run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", vid], capture_output=True, text=True).stdout)
v = next(s for s in probe["streams"] if s["codec_type"] == "video"); a = next((s for s in probe["streams"] if s["codec_type"] == "audio"), None)
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", vid, "-vf", "scale=90:160,format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, 160, 90).astype(np.float32)
luma = fr.mean(axis=(1, 2)); diff = np.abs(np.diff(fr, axis=0)).mean(axis=(1, 2))
frozen_runs, run = [], 0
for i, dd in enumerate(diff):
    if dd < 0.05: run += 1
    else:
        if run >= 15: frozen_runs.append([round((i - run) / 30, 2), round(i / 30, 2)])
        run = 0
if run >= 15: frozen_runs.append([round((len(diff) - run) / 30, 2), round(len(diff) / 30, 2)])
eb = subprocess.run(["ffmpeg", "-i", vid, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
summ = eb[eb.rfind("Summary:"):]
num = lambda k: float(re.search(k + r":\s+(-?[\d.]+)", summ).group(1))
sil = subprocess.run(["ffmpeg", "-i", vid, "-af", "silencedetect=noise=-50dB:d=0.6", "-f", "null", "-"], capture_output=True, text=True).stderr
gaps = re.findall(r"silence_start: ([\d.]+)", sil)
out = {
  "file": vid, "duration_s": float(probe["format"]["duration"]), "size_mb": round(int(probe["format"]["size"]) / 1e6, 2),
  "video": {"codec": v["codec_name"], "profile": v.get("profile"), "width": v["width"], "height": v["height"], "pix_fmt": v["pix_fmt"], "fps": v["r_frame_rate"], "frames": int(v.get("nb_frames", len(fr))), "bitrate_kbps": round(int(v.get("bit_rate", 0)) / 1000)},
  "audio": None if not a else {"codec": a["codec_name"], "sample_rate": a["sample_rate"], "channels": a["channels"], "bitrate_kbps": round(int(a.get("bit_rate", 0)) / 1000),
                                "integrated_lufs": num("I"), "lra_lu": num("LRA"), "true_peak_dbtp": num("Peak")},
  "frames_decoded": int(len(fr)), "black_frames": int((luma < 6).sum()), "luma_min": round(float(luma.min()), 1), "luma_max": round(float(luma.max()), 1),
  "max_frame_diff": round(float(diff.max()), 2), "max_diff_at_s": round(float(diff.argmax() + 1) / 30, 2), "frozen_runs_over_0.5s": frozen_runs,
  "silence_over_0.6s_starts": [float(g) for g in gaps],
}
print(json.dumps(out, indent=1))
