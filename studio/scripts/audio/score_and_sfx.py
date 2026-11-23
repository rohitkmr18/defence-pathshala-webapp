"""Original, procedurally synthesised underscore + sound effects for the
contrails reel. Everything is generated from code (no samples, no third-party
audio) → no licensing exposure. Deterministic (fixed seeds).
usage: python3 score_and_sfx.py <cues.json> <out_music.wav> <out_sfx.wav>"""
import sys, json, numpy as np, wave
SR = 48000
cues = json.load(open(sys.argv[1]))
DUR = cues["duration"]; N = int(DUR * SR)
rng = np.random.default_rng(7)
t_all = np.arange(N) / SR

def write(path, x):
    x = np.clip(x, -1, 1); y = (x * 32767).astype(np.int16)
    with wave.open(path, "w") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(y.reshape(-1).tobytes())

def onepole_lp(x, fc):
    a = np.exp(-2 * np.pi * np.asarray(fc) / SR) * np.ones_like(x)
    y = np.empty_like(x); s = 0.0
    for i in range(len(x)):
        s = (1 - a[i]) * x[i] + a[i] * s; y[i] = s
    return y
def lp(x, fc, order=2):
    for _ in range(order): x = onepole_lp(x, fc)
    return x
def env_adsr(n, a, r):
    e = np.ones(n); ai = int(a * SR); ri = int(r * SR)
    if ai: e[:ai] = np.linspace(0, 1, ai) ** 2
    if ri: e[-ri:] *= np.linspace(1, 0, ri) ** 1.5
    return e
def place(buf, x, start, gain=1.0, pan=0.0):
    i = int(start * SR)
    if i >= N: return
    x = x[: N - i]
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    buf[i:i + len(x), 0] += x * gain * l * 1.414; buf[i:i + len(x), 1] += x * gain * r * 1.414
def midi(m): return 440.0 * 2 ** ((m - 69) / 12)

# ───────────────────────── MUSIC ─────────────────────────
music = np.zeros((N, 2))
def saw(f, n, det=0.0):
    t = np.arange(n) / SR; ph = (f * (1 + det)) * t
    return 2 * (ph - np.floor(ph + 0.5))
def pad(notes, start, dur, gain, bright=900, a=1.2, r=1.6):
    n = int((dur + r) * SR); x = np.zeros(n)
    for m in notes:
        for d in (-0.004, 0.0, 0.0045):
            x += saw(midi(m), n, d) / 3
    x /= max(len(notes), 1)
    x = lp(x, bright, 2) * env_adsr(n, a, r)
    place(music, x, start, gain, pan=-0.25); place(music, np.roll(x, 900), start, gain, pan=0.25)
def sub(m, start, dur, gain):
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * midi(m) * t) * env_adsr(n, 0.6, 1.0); place(music, x, start, gain)
def bell(m, start, gain, decay=1.6, pan=0.0):
    n = int(decay * 2.5 * SR); t = np.arange(n) / SR; f = midi(m)
    x = (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 3) + 0.2 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 6)) * np.exp(-t / decay * 2.2)
    x *= np.minimum(1, t / 0.004); place(music, x, start, gain, pan)
def pluck(m, start, gain, pan=0.0):
    n = int(0.9 * SR); t = np.arange(n) / SR; f = midi(m)
    x = sum(np.sin(2 * np.pi * f * k * t) / k ** 1.3 for k in range(1, 6)) * np.exp(-t * 7)
    x *= np.minimum(1, t / 0.003); place(music, lp(x, 3500, 1), start, gain, pan)

# chord plan (MIDI): D minor world → lifts to F / Bb, resolves on D
sec = cues["scenes"]
plan = [
    (0.0, sec["contradiction"], [50, 57, 62, 64, 69], 38),          # Dm(add9)
    (sec["contradiction"], 12.35, [46, 53, 57, 62, 65], 34),        # Bbmaj7
    (12.35, sec["contrailTitle"], [45, 53, 57, 60, 65], 33),        # F/A
    (sec["contrailTitle"], sec["engine"], [43, 50, 55, 58, 62], 31),# Gm9
    (sec["engine"], sec["ice"], [38, 50, 57, 62], 38),              # D5 drone
    (sec["ice"], sec["humidity"], [41, 53, 57, 60, 64], 41),        # Fmaj7
    (sec["humidity"], 39.3, [38, 50, 53, 57, 62], 38),              # Dm
    (39.3, sec["challenge"], [46, 50, 53, 58, 62], 34),             # Bb
    (sec["challenge"], 48.9, [38, 50, 53, 57, 60], 38),             # Dm7
    (48.9, 53.6, [41, 48, 53, 57, 60], 41),                        # F
    (53.6, DUR, [38, 50, 54, 57, 62, 66], 38),                      # D major — resolve
]
for a, b, notes, root in plan:
    pad(notes, a, b - a + 0.6, 0.16, bright=700 if a < 20 else 1100)
    sub(root - 12, a, b - a + 0.4, 0.18)
# curiosity ticks in the hook
for i, tt in enumerate(np.arange(0.4, sec["contradiction"] - 0.2, 0.5)):
    bell([74, 77, 81, 76][i % 4], tt, 0.035, decay=0.5, pan=[-0.5, 0.5][i % 2])
# crystal arpeggio during ice formation
for i, tt in enumerate(np.arange(sec["ice"] + 0.1, sec["humidity"] - 0.4, 0.125)):
    bell([77, 81, 84, 88, 86, 84, 81, 79][i % 8], tt, 0.05 * (0.6 + 0.4 * np.sin(i / 5)), decay=0.9, pan=np.sin(i * 0.7) * 0.6)
# tension ostinato under the twist / comparison
for i, tt in enumerate(np.arange(sec["humidity"] + 0.2, sec["challenge"] - 0.15, 0.3)):
    pluck([50, 57, 62, 57][i % 4] if tt < 39.3 else [46, 53, 58, 53][i % 4], tt, 0.06, pan=[-0.3, 0.3][i % 2])
# quiz groove: soft plucks
for i, tt in enumerate(np.arange(sec["challenge"] + 1.7, 53.5, 0.375)):
    pluck([62, 65, 69, 65, 62, 60][i % 6] if tt < 48.9 else [65, 69, 72, 69][i % 4], tt, 0.05, pan=[-0.4, 0.4][i % 2])
# final shimmer
for i, m in enumerate([62, 66, 69, 74, 78, 81]):
    bell(m, 53.75 + i * 0.09, 0.06, decay=2.5, pan=-0.6 + i * 0.24)
fade = np.clip((DUR - t_all) / 2.2, 0, 1) ** 1.2
music *= fade[:, None]
music *= np.minimum(1, t_all / 0.25)[:, None]

# ───────────────────────── SFX ─────────────────────────
sfx = np.zeros((N, 2))
def noise(n): return rng.standard_normal(n)
def whoosh(start, dur=0.9, gain=0.5, f0=300, f1=4000, pan=0.0):
    n = int(dur * SR); t = np.linspace(0, 1, n)
    fc = f0 * (f1 / f0) ** np.sin(np.pi * t) ; e = np.sin(np.pi * t) ** 2
    x = lp(noise(n), fc, 2) * e; x /= np.abs(x).max() + 1e-9; place(sfx, x, start, gain, pan)
def impact(start, gain=0.7, f0=70, f1=32, dur=1.4):
    n = int(dur * SR); t = np.arange(n) / SR
    ph = 2 * np.pi * np.cumsum(f1 + (f0 - f1) * np.exp(-t * 6)) / SR
    x = np.sin(ph) * np.exp(-t * 2.8) + 0.25 * lp(noise(n), 900, 2) * np.exp(-t * 14) * 4
    place(sfx, x / np.abs(x).max(), start, gain)
def riser(end, dur=1.2, gain=0.35):
    n = int(dur * SR); t = np.linspace(0, 1, n)
    x = lp(noise(n), 200 + 5000 * t ** 2, 2) * t ** 2.2; x /= np.abs(x).max()
    place(sfx, x, end - dur, gain)
def tick(start, gain=0.25, f=2400, pan=0.0):
    n = int(0.08 * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) * np.exp(-t * 90) + 0.4 * noise(n) * np.exp(-t * 300); place(sfx, x, start, gain, pan)
def ping(start, gain=0.22, m=88, decay=0.7, pan=0.0):
    n = int(decay * 2 * SR); t = np.arange(n) / SR; fq = midi(m)
    x = (np.sin(2 * np.pi * fq * t) + 0.3 * np.sin(2 * np.pi * fq * 2.76 * t)) * np.exp(-t / decay * 3); place(sfx, x, start, gain, pan)
def jet_bed(start, end, gain=0.3):
    n = int((end - start) * SR); t = np.arange(n) / SR
    x = lp(noise(n), 260, 3) * 6 + 0.04 * np.sin(2 * np.pi * 3150 * t + 0.3 * np.sin(2 * np.pi * 0.7 * t))
    e = np.minimum(1, t / 0.5) * np.minimum(1, (t[-1] - t) / 0.7); x = x * e; x /= np.abs(x).max()
    place(sfx, x, start, gain)
def wind(start, dur=1.6, gain=0.25, pan=0.0):
    n = int(dur * SR); t = np.linspace(0, 1, n)
    x = lp(noise(n), 500 + 1200 * np.sin(np.pi * t), 2) * np.sin(np.pi * t) ** 1.5; x /= np.abs(x).max(); place(sfx, x, start, gain, pan)

c = cues["cue"]
jet_bed(0.0, 3.2, 0.32); whoosh(0.0, 1.6, 0.42, 200, 2500, -0.4); impact(0.05, 0.45, 60, 30, 1.8)
whoosh(c["push"], 1.3, 0.32, 300, 3500, 0.3)
riser(c["smoke"], 0.7, 0.2); impact(c["smoke"], 0.62); impact(c["science"], 0.38, 90, 45, 0.9)
whoosh(sec["contradiction"] - 0.25, 0.6, 0.3, 500, 6000)
tick(c["trail"], 0.22); tick(c["noTrail"], 0.25, 1900)
whoosh(12.3, 0.55, 0.32, 600, 7000)
tick(c["gayab"], 0.24, 2100, -0.5); tick(c["ghanton"], 0.24, 2600, 0.5)
riser(c["contrail"], 1.1, 0.3); impact(c["contrail"], 0.66); ping(c["condensation"], 0.18, 93, 1.2)
jet_bed(sec["engine"] - 0.2, sec["ice"] + 0.3, 0.26)
tick(c["hot"], 0.2, 1800, -0.3); wind(c["cold"] - 0.3, 1.8, 0.3, 0.3)
for i in range(7): ping(c["freeze"] + i * 0.11, 0.1, [96, 100, 103, 98, 101, 105, 108][i], 0.5, -0.6 + i * 0.2)
ping(c["crystals"], 0.14, 91, 1.4)
whoosh(c["pull"], 1.4, 0.28, 300, 3000); whoosh(sec["humidity"] - 0.2, 0.5, 0.26, 600, 6500)
tick(c["twist"], 0.24, 1700)
for i in range(6): tick(c["clock"] + i * 0.25, 0.12, 3000 if i % 2 else 2400)
whoosh(35.45, 0.5, 0.22, 500, 5000)
ping(c["atmosphere"], 0.14, 86, 0.9); ping(c["humidity"], 0.16, 91, 1.0)
whoosh(39.2, 0.5, 0.3, 600, 7000); tick(c["dry"], 0.24, 2000, -0.5); tick(c["humid"], 0.24, 2600, 0.5)
impact(c["banner"], 0.4, 80, 40, 1.0)
riser(c["tricky"], 0.9, 0.28); impact(c["tricky"], 0.55, 75, 35, 1.1)
for k in ("optA", "optB", "optC"): tick(c[k], 0.26, 2200)
for i, tt in enumerate(np.arange(c["cdA"], c["cdB"], 0.5)): tick(tt, 0.07, 3200)
for k, m in (("pA", 88), ("pB", 91), ("pC", 95)): ping(c[k], 0.17, m, 0.6)
whoosh(c["end"] - 0.15, 0.7, 0.3, 400, 6000); impact(c["follow"], 0.42, 85, 42, 1.4)
write(sys.argv[2], music * 0.9); write(sys.argv[3], sfx * 0.9)
print("ok", DUR)
