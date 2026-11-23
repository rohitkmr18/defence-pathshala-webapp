"""Contact sheet: representative frames from every scene, labelled with time.
usage: python3 contact_sheet.py <video> <out.png>"""
import sys, subprocess
from PIL import Image, ImageDraw, ImageFont
vid, out = sys.argv[1], sys.argv[2]
# (time s, label) — two per scene, at moments that show its key reveal
shots = [(1.2, "1 Mystery"), (6.0, "1 SMOKE?"), (10.5, "2 Two jets"), (16.0, "2 Seconds|Hours"), (18.8, "3 CONTRAIL"), (20.5, "3 Condensation"),
         (23.6, "3 Hot exhaust"), (26.3, "3 Cold air"), (27.9, "4 Ice crystals"), (31.6, "4 White line"), (34.8, "5 Kitni der"),
         (38.6, "5 Humidity"), (42.4, "5 Dry vs ISS"), (43.9, "6 Tricky"), (50.5, "6 Options"), (56.5, "6 Follow")]
W, H, cols = 270, 480, 8
rows = (len(shots) + cols - 1) // cols
sheet = Image.new("RGB", (cols * W, rows * (H + 34)), (2, 6, 23))
d = ImageDraw.Draw(sheet)
try: font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 18)
except Exception: font = ImageFont.load_default()
for i, (t, lab) in enumerate(shots):
    png = subprocess.run(["ffmpeg", "-v", "error", "-ss", str(t), "-i", vid, "-frames:v", "1", "-vf", f"scale={W}:{H}", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True).stdout
    from io import BytesIO
    im = Image.open(BytesIO(png)).convert("RGB")
    x, y = (i % cols) * W, (i // cols) * (H + 34)
    sheet.paste(im, (x, y)); d.text((x + 8, y + H + 7), f"{t:05.1f}s  {lab}", fill=(203, 213, 225), font=font)
sheet.save(out); print("sheet", out, sheet.size)
