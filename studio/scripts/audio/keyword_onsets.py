"""Measure when a keyword is first spoken: decode growing prefixes of a phrase
(step 0.12 s) and report the earliest prefix end at which the keyword appears.
The onset estimate is that end time minus a short word-length allowance."""
import sys, json, wave, numpy as np
sys.path.insert(0, "scripts/audio")
from whisper_onnx import Whisper
w = Whisper("/home/user/models/sherpa-onnx-whisper-turbo")
def load(p):
    with wave.open(p) as f: return np.frombuffer(f.readframes(f.getnframes()), np.int16).astype(np.float32)/32768
JOBS = json.load(open(sys.argv[1])); out = {}
cache = {}
for j in JOBS:
    x = cache.setdefault(j["file"], load(j["file"]))
    a, b = j["start"], j["end"]; found = None
    t = a + 0.3
    while t <= b + 0.05:
        c = np.concatenate([x[int(a*16000):int(t*16000)], np.zeros(8000, np.float32)])
        txt = w.transcribe(c, "hi", max_tokens=60)
        if any(k.lower() in txt.lower() for k in j["keys"]):
            found = round(t, 2); break
        t += 0.12
    out[j["id"]] = found
    print(j["id"], found, flush=True)
json.dump(out, open(sys.argv[2], "w"), indent=1)
