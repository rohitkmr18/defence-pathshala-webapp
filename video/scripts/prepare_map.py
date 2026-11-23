"""Split the DP J&K base map (src_assets/2.png) into animation layers.

Outputs to public/maps/:
  lines.png        transparent PNG: boundaries, rivers, dashed disputed lines
  mask_<id>.png    white-on-transparent masks: india, pok, aksai, shaksgam
  loc.png          transparent PNG: the red LoC only (revealed with a wipe)
Baked-in text labels, legend, logo and city dots are removed; the video re-adds them
as animated overlays. Re-run after replacing src_assets/2.png (e.g. with the final
Survey of India based artwork); adjust RECTS if the layout changes.
"""
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src_assets" / "2.png"
OUT = ROOT / "public" / "maps"
OUT.mkdir(parents=True, exist_ok=True)

BEIGE = np.array([252, 240, 230])
PINK = np.array([250, 210, 246])
BLUE = np.array([201, 209, 254])
GREEN = np.array([224, 250, 189])

# (x0, y0, x1, y1) text/logo/legend boxes to erase
RECTS = [
    (700, 20, 925, 160),    # logo
    (20, 370, 270, 430),    # PAKISTAN
    (670, 450, 860, 505),   # CHINA
    (400, 1170, 600, 1230), # INDIA
    (195, 555, 330, 612),   # PoK pill
    (150, 630, 385, 668),   # Gilgit-Baltistan
    (335, 715, 445, 770),   # LoC callout box
    (328, 765, 360, 812),   # LoC leader line
    (495, 575, 540, 608),   # K2 label
    (462, 598, 495, 628),   # K2 triangle
    (215, 845, 380, 885),   # Kashmir
    (270, 892, 425, 932),   # Srinagar
    (215, 1020, 355, 1060), # Jammu (region)
    (230, 1068, 368, 1102), # Jammu (city)
    (378, 975, 517, 1037),  # J&K pill
    (558, 975, 702, 1017),  # Ladakh
    (608, 865, 695, 905),   # Leh
    (493, 818, 565, 870),   # Indus label
    (725, 705, 850, 790),   # Aksai Chin
    (520, 1300, 905, 1600), # legend
]
LEGEND = (520, 1300, 905, 1600)

img = np.array(Image.open(SRC).convert("RGB"))
H, W, _ = img.shape
a = img.astype(int)

# 1) LoC = strong red outside the legend
red = (a[..., 0] > 190) & (a[..., 1] < 90) & (a[..., 2] < 90)
x0, y0, x1, y1 = LEGEND
red[y0:y1, x0:x1] = False
loc_alpha = cv2.GaussianBlur(cv2.dilate(red.astype(np.uint8) * 255, np.ones((3, 3), np.uint8)), (0, 0), 0.8)
loc = np.zeros((H, W, 4), np.uint8)
loc[..., 0], loc[..., 1], loc[..., 2] = 232, 28, 44
loc[..., 3] = loc_alpha
Image.fromarray(loc).save(OUT / "loc.png")

def dist(c):
    return np.sqrt(((a - c) ** 2).sum(-1))

flat = np.stack([dist(c) for c in (BEIGE, PINK, BLUE, GREEN)], -1)
other = flat.min(-1) > 28

# 2) erase text: 'other' pixels inside the rects (+ the LoC) are inpainted
erase = np.zeros((H, W), bool)
for (x0, y0, x1, y1) in RECTS:
    erase[y0:y1, x0:x1] = other[y0:y1, x0:x1]
erase |= red
x0, y0, x1, y1 = LEGEND
erase[y0:y1, x0:x1] = True
logo = RECTS[0]
erase[logo[1]:logo[3], logo[0]:logo[2]] = True
erase_m = cv2.dilate(erase.astype(np.uint8) * 255, np.ones((5, 5), np.uint8))
clean = cv2.inpaint(img, erase_m, 4, cv2.INPAINT_TELEA)
# label boxes sit on flat fills: snap everything inside them to the nearest flat colour
# (kills inpaint smudges). K2 boxes touch line work, so they are left as inpainted.
FLATS = np.stack([BEIGE, PINK, BLUE, GREEN])
for (x0, y0, x1, y1) in RECTS:
    if (x0, y0, x1, y1) in {(495, 575, 540, 608), (462, 598, 495, 628), (493, 818, 565, 870)}:
        continue
    pool = FLATS[2:3] if (x0, y0, x1, y1) == (335, 715, 445, 770) else FLATS if (x0, y0, x1, y1) in {RECTS[0], RECTS[1], RECTS[2], RECTS[3], LEGEND} else FLATS[1:]
    blk = clean[y0:y1, x0:x1].astype(int)
    d = ((blk[:, :, None, :] - pool[None, None]) ** 2).sum(-1)
    clean[y0:y1, x0:x1] = pool[d.argmin(-1)]
# legend + logo + big country names sit on plain beige: flatten them
for r in (RECTS[0], RECTS[1], RECTS[2], RECTS[3], LEGEND):
    clean[r[1]:r[3], r[0]:r[2]] = BEIGE
a = clean.astype(int)

# 3) classify the cleaned image
flat = np.stack([dist(c) for c in (BEIGE, PINK, BLUE, GREEN)], -1)
cls = flat.argmin(-1)           # 0 beige 1 pink 2 blue 3 green
near = flat.min(-1) <= 28
other = ~near

# 4) lines layer
lines = np.zeros((H, W, 4), np.uint8)
lines[..., :3] = clean
lines[..., 3] = np.where(other, 255, 0)
Image.fromarray(lines).save(OUT / "lines.png")

# 5) region masks (dilated so fills tuck under the line work)
def mask_of(m):
    m = cv2.dilate(m.astype(np.uint8) * 255, np.ones((5, 5), np.uint8))
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    return m

def save_mask(name, m):
    out = np.zeros((H, W, 4), np.uint8)
    out[..., :3] = 255
    out[..., 3] = m
    Image.fromarray(out).save(OUT / f"mask_{name}.png")

def keep_large(m, min_area):
    n, lab, stats, cent = cv2.connectedComponentsWithStats(m.astype(np.uint8), 8)
    keep = np.zeros_like(m, bool)
    comps = []
    for i in range(1, n):
        if stats[i, cv2.CC_STAT_AREA] >= min_area:
            keep |= lab == i
            comps.append((i, stats[i, cv2.CC_STAT_AREA], cent[i]))
    return keep, lab, comps

pink, _, _ = keep_large((cls == 1) & near, 3000)
blue, _, _ = keep_large((cls == 2) & near, 3000)
green, lab, comps = keep_large((cls == 3) & near, 150)
aksai = np.zeros_like(green)
shaks = np.zeros_like(green)
for i, area, (cx, cy) in comps:
    # north strip near K2 = Shaksgam; everything else green = Aksai Chin block
    (shaks if (cy < 720 and cx < 640) else aksai).__ior__(lab == i)
print("green comps:", [(i, int(ar), (int(c[0]), int(c[1]))) for i, ar, c in comps])

save_mask("india", mask_of(pink))
save_mask("pok", mask_of(blue))
save_mask("aksai", mask_of(aksai))
save_mask("shaksgam", mask_of(shaks))
print("done", W, H)
