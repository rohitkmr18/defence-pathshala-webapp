"""One-off correction for Polity Decoded, Edition 1 (12 Nov 2026).

The book counted 291 Polity PYQs. One of them, CAPF (AC) 2026 Paper I Q41 (UDHR, a UPSC-dropped
item), is withheld from learners in the DP bank, so the live count is 290 (CDS 206 + CAPF 84).
This script edits the PDF in place of a re-render, changing every figure that included it:
  p1 cover 291→290 · p2 291→290, CAPF 85→84 · p3 contents 291→290 · p14 Section 03 34→33 PYQs
  p4 291→290, (85)→(84), "Fundamental & human rights" 24→23 (bar shortened), 2024–26 110→109,
     one-line 41%→40%, statement 59%→60% (bar split moved), "65 of 110"→"65 of 109", "CAPF 19 of 31"→"19 of 30".
Figures verified against v_dp_question_intelligence_v2 (content_eligible) on 12 Nov 2026.

Usage: python3 polity_decoded_fix_pyq_count.py <in.pdf> <out.pdf> <ttf-dir>
<ttf-dir> holds the Fontsource Inter / Plus Jakarta Sans latin TTFs (the eBook's own fonts;
the PDF's embedded subsets lack some digits).
"""
import sys
import pymupdf

src, out, ttf = sys.argv[1:4]
FONTS = {
    "Inter-Regular": "inter-latin-400-normal.ttf",
    "Inter-SemiBold": "inter-latin-600-normal.ttf",
    "Inter-Bold": "inter-latin-700-normal.ttf",
    "PlusJakartaSans-SemiBold": "plus-jakarta-sans-latin-600-normal.ttf",
    "PlusJakartaSans-Bold": "plus-jakarta-sans-latin-700-normal.ttf",
    "PlusJakartaSans-ExtraBol": "plus-jakarta-sans-latin-800-normal.ttf",
}
doc = pymupdf.open(src)


def spans(page):
    for b in page.get_text("dict")["blocks"]:
        for l in b.get("lines", []):
            for s in l["spans"]:
                yield s


def find(page, text, near_y=None):
    hits = [s for s in spans(page) if s["text"] == text and (near_y is None or abs(s["bbox"][1] - near_y) < 2)]
    assert len(hits) == 1, f"p{page.number + 1}: expected one span {text!r}, got {len(hits)}"
    return hits[0]


def redact(page, **kw):
    """apply_redactions also deletes link annotations that overlap; put them back."""
    before = page.get_links()
    page.apply_redactions(**kw)
    keep = {(round(l["from"].x0, 1), round(l["from"].y0, 1)) for l in page.get_links()}
    for l in before:
        if (round(l["from"].x0, 1), round(l["from"].y0, 1)) not in keep:
            page.insert_link({k: v for k, v in l.items() if k not in ("xref", "id")})


def rgb(c):
    return ((c >> 16) & 255) / 255, ((c >> 8) & 255) / 255, (c & 255) / 255


def replace_runs(page, runs, align="left"):
    """runs: list of (span, new_text). Rewrites consecutive spans of one line from the first span's origin."""
    for s, _ in runs:
        x0, y0, x1, y1 = s["bbox"]
        page.add_redact_annot(pymupdf.Rect(x0 + 0.3, y0 + 2, x1 - 0.3, y1 - 2))
    redact(page, images=pymupdf.PDF_REDACT_IMAGE_NONE, graphics=pymupdf.PDF_REDACT_LINE_ART_NONE)
    first = runs[0][0]
    total = sum(pymupdf.Font(fontfile=f"{ttf}/{FONTS[s['font']]}").text_length(t, s["size"]) for s, t in runs)
    x = first["origin"][0] if align == "left" else runs[-1][0]["bbox"][2] - total
    y = first["origin"][1]
    for s, t in runs:
        name = "f" + FONTS[s["font"]].replace("-", "")[:20]
        page.insert_font(fontname=name, fontfile=f"{ttf}/{FONTS[s['font']]}")
        page.insert_text((x, y), t, fontname=name, fontsize=s["size"], color=rgb(s["color"]))
        x += pymupdf.Font(fontfile=f"{ttf}/{FONTS[s['font']]}").text_length(t, s["size"])


# p1 cover stat
p = doc[0]
replace_runs(p, [(find(p, "291"), "290")])

# p2 "How this book is built"
p = doc[1]
s = find(p, "All 291 Polity previous-year questions in the Defence Pathshala bank (CDS GK 206, CAPF (AC)")
replace_runs(p, [(s, s["text"].replace("291", "290"))])
s = find(p, "Paper I 85, 2020–2026) were mapped topic by topic; this book follows that weightage.")
replace_runs(p, [(s, s["text"].replace("Paper I 85,", "Paper I 84,"))])

# p3 contents
p = doc[2]
s = find(p, "291 PYQs mapped · the shift to statement questions")
replace_runs(p, [(s, s["text"].replace("291", "290"))])

# p4 exam map
p = doc[3]
a = find(p, "291 Polity PYQs")
b = find(p, " — CDS GK (206) and CAPF (AC) Paper I (85), 2020–")
replace_runs(p, [(a, "290 Polity PYQs"), (b, b["text"].replace("(85)", "(84)"))])
replace_runs(p, [(find(p, "24", near_y=263.6), "23")])
replace_runs(p, [(find(p, "110 PYQs"), "109 PYQs")], align="right")
replace_runs(p, [(find(p, "One-line 41%"), "One-line 40%")])
replace_runs(p, [(find(p, "Statement / match / order 59%"), "Statement / match / order 60%")], align="right")
s = find(p, "Since 2024, 65 of 110 Polity PYQs were 2/3/4-statement, statement-count, match-the-following or ordering questions")
replace_runs(p, [(s, s["text"].replace("65 of 110", "65 of 109"))])
s = find(p, "(CDS 46 of 79; CAPF 19 of 31).")
replace_runs(p, [(s, "(CDS 46 of 79; CAPF 19 of 30).")])

# p4 bars. "Fundamental & human rights" bar: 24 → 23 units (scale from the 24-unit bar width).
bar = [d for d in p.get_drawings() if d["type"] == "f" and abs(d["rect"].y0 - 263.2) < 0.5 and abs(d["rect"].x0 - 210.8) < 0.5]
assert len(bar) == 1, len(bar)
bar = bar[0]
r = bar["rect"]
shift = -(r.width / 24)
p.add_redact_annot(pymupdf.Rect(r.x0 - 0.3, r.y0 - 0.3, r.x1 + 0.3, r.y1 + 0.3))
redact(p, images=pymupdf.PDF_REDACT_IMAGE_NONE, graphics=pymupdf.PDF_REDACT_LINE_ART_REMOVE_IF_COVERED, text=pymupdf.PDF_REDACT_TEXT_NONE)
mid = (r.x0 + r.x1) / 2
mv = lambda pt: pymupdf.Point(pt.x + shift, pt.y) if pt.x > mid else pt
sh = p.new_shape()
for it in bar["items"]:
    if it[0] == "l":
        sh.draw_line(mv(it[1]), mv(it[2]))
    elif it[0] == "c":
        sh.draw_bezier(mv(it[1]), mv(it[2]), mv(it[3]), mv(it[4]))
    elif it[0] == "re":
        rr = it[1]; sh.draw_rect(pymupdf.Rect(rr.x0, rr.y0, rr.x1 + shift, rr.y1))
    else:
        raise SystemExit(f"unexpected path item {it[0]}")
sh.finish(fill=bar["fill"], color=None, closePath=True, fill_opacity=bar.get("fill_opacity") or 1, even_odd=bar.get("even_odd", False))
sh.commit(overlay=True)

# Format-share bar: move the one-line/statement split from 41% to 40% by extending the orange segment left.
orange = [d for d in p.get_drawings() if d["type"] == "f" and abs(d["rect"].y0 - 531.0) < 0.5 and abs(d["rect"].x0 - 254.2) < 0.5]
grey = [d for d in p.get_drawings() if d["type"] == "f" and abs(d["rect"].y0 - 531.0) < 0.5 and abs(d["rect"].x0 - 54.8) < 0.5]
assert len(orange) == 1 and len(grey) == 1
o, g = orange[0]["rect"], grey[0]["rect"]
split = g.x0 + (o.x1 - g.x0) * 0.40
sh = p.new_shape()
sh.draw_rect(pymupdf.Rect(split, o.y0, o.x0 + 0.2, o.y1))
sh.finish(fill=orange[0]["fill"], color=None)
sh.commit(overlay=True)  # labels are clear of this strip

# p14 Section 03 header "S E C T I O N 0 3 · 3 4 P Y Q S": swap the letter-spaced "4" for "3".
p = doc[13]
s = find(p, "4 P")
x0, y0 = s["bbox"][0], s["bbox"][1]
glyph_w = pymupdf.Font(fontfile=f"{ttf}/{FONTS[s['font']]}").text_length("4", s["size"])
p.add_redact_annot(pymupdf.Rect(x0 + 0.2, y0 + 2, x0 + glyph_w - 0.2, s["bbox"][3] - 2))
redact(p, images=pymupdf.PDF_REDACT_IMAGE_NONE, graphics=pymupdf.PDF_REDACT_LINE_ART_NONE)
p.insert_font(fontname="fJakarta800", fontfile=f"{ttf}/{FONTS[s['font']]}")
p.insert_text(s["origin"], "3", fontname="fJakarta800", fontsize=s["size"], color=rgb(s["color"]))

doc.save(out, garbage=3, deflate=True)
print("saved", out)
