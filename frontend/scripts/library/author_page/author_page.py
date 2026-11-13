#!/usr/bin/env python3
"""Canonical page 2 ("About the author") for every Defence Pathshala eBook.

One layout for all books: two founder-approved portraits, name + rank, three credential
cards, then the book-specific "How this book is built" box. The credentials and photos are
fixed; only BOOKS[slug] (method bullets, accent dot colour, footer text) changes per book.

    python3 scripts/library/author_page/author_page.py polity-decoded   # re-render one reader page
    python3 scripts/library/author_page/author_page.py --all            # every book in BOOKS
    python3 scripts/library/author_page/author_page.py --png out.png --slug demo   # A4 PNG only

The PDF builders (dp-ebook / dp-subject-ebook) import `author_body_html(cfg)` and `AUTHOR_CSS`
so the printed PDF and the library reader use the same markup. Needs: playwright + Pillow.
Page chrome (header/footer/watermark) is drawn here in the same style the books use; a book
builder that already draws its own chrome should take only the body + CSS.
"""
from __future__ import annotations

import argparse
import base64
import pathlib
import sys

HERE = pathlib.Path(__file__).resolve().parent
ASSETS = HERE / "assets"
PUBLIC_LIBRARY = HERE.parents[2] / "public" / "library"  # frontend/public/library

# ---- brand mark (same path as components DPLogo) ---------------------------------------------
MARK = (
    '<svg class="{c}" viewBox="67 70 606 544" aria-hidden="true"><path fill="{f}" fill-rule="evenodd" '
    'd="M67 70H401A272 272 0 0 1 401 614H274V498H406.5A160.5 160.5 0 0 0 406.5 177H182V498L67 612Z"/>'
    '<path fill="{f}" d="M274 261H398A76 76 0 0 1 398 413H274Z"/></svg>'
)


def mark(cls: str, fill: str = "#0061FC") -> str:
    return MARK.format(c=cls, f=fill)


# ---- fixed founder-approved copy -------------------------------------------------------------
NAME = "Rohit Kumar"
RANK = "ASSISTANT COMMANDANT · BSF"
CARDS = [
    ("gold", "AIR 163", "UPSC CAPF (Assistant Commandant)"),
    ("blue", "4×", "Qualified CDS four times"),
    ("", "IIT Kanpur", "Mechanical Engineer"),
]

# ---- per-book config: ONLY the method bullets / accent / footer differ -----------------------
# Bullet text may contain <b>…</b>. Keep wording identical to the book's PDF.
BOOKS: dict[str, dict] = {
    "polity-decoded": dict(
        dot="#3B82F6",
        footer_right="For CDS · CAPF (AC) · AFCAT · NDA",
        study_copy_strip=True,
        bullets=[
            "All 290 Polity previous-year questions in the Defence Pathshala bank (CDS GK 206, CAPF (AC) Paper I 84, 2020–2026) were mapped topic by topic; this book follows that weightage.",
            "Core facts are drawn from the Constitution of India and standard references, cross-checked against two coaching note sets; a final page flags high-potential topics for 2026–27.",
            "Every question carries a label: <b>PYQ</b> (exam, year, number) or <b>DP Original</b>. Traps are flagged in orange.",
        ],
    ),
    "biology-decoded": dict(
        dot="#0891B2",
        footer_right="For CDS · CAPF (AC) · AFCAT · NDA",
        study_copy_strip=False,
        bullets=[
            "All 201 Biology previous-year questions in the Defence Pathshala bank (CDS 2020–26, CAPF 2020–26) were mapped topic by topic; this book follows that weightage.",
            "Concepts are filtered to NCERT Classes VI–XII level — the level UPSC defence papers test — and checked for factual accuracy.",
            "Every question carries a label: <b>PYQ</b> (with exam, year and number) or <b>DP Original</b>. Traps are flagged in orange.",
        ],
    ),
    "economy-decoded": dict(
        dot="#22B573",
        footer_right="For CDS · CAPF (AC) · AFCAT · NDA",
        study_copy_strip=True,
        bullets=[
            "All 280 Economy previous-year questions in the Defence Pathshala bank (CDS 182, CAPF (AC) 98, 2020–2026) were read one by one; this book teaches the fact each one turns on.",
            "Facts are checked against official sources (Budget, RBI, Economic Survey, Finance Commission) and marked “as of” where they change; a coverage audit and an independent review back the claim.",
            "Every question carries a label: <b>PYQ</b> (exam, year, number) or <b>DP Original</b>. Traps are flagged in orange.",
        ],
    ),
    "chemistry-decoded": dict(
        dot="#06B6D4",
        footer_right="For CDS · CAPF (AC) · AFCAT · NDA",
        study_copy_strip=True,
        bullets=[
            "All 197 Chemistry previous-year questions in the Defence Pathshala bank (CDS GK 134, CAPF (AC) Paper I 63, 2020–2026) were read one by one; this book teaches the fact each one turns on.",
            "Facts are checked against NCERT and official sources, not copied from coaching notes; a coverage audit and an independent review back the claim.",
            "Every question carries a label: <b>PYQ</b> (exam, year, number) or <b>DP Original</b>. Traps are flagged in orange.",
        ],
    ),
}

AUTHOR_CSS = """
.aphotos{display:grid;grid-template-columns:1fr 1fr;gap:5mm;margin:3mm 0 6mm}
.ap{position:relative;margin:0;height:104mm;border-radius:4mm;overflow:hidden;border:1px solid rgba(251,191,36,.55);box-shadow:0 3mm 8mm rgba(0,0,0,.45),0 0 0 1mm rgba(255,255,255,.04)}
.ap img{width:100%;height:100%;object-fit:cover;display:block}
.ap::after{content:"";position:absolute;left:0;right:0;bottom:0;height:34%;background:linear-gradient(180deg,rgba(6,13,36,0),rgba(6,13,36,.82))}
.ap:first-child img{object-position:50% 12%}.ap:last-child img{object-position:50% 18%}
.aname2{display:flex;align-items:center;justify-content:space-between;margin:0 0 5mm}
.aname2 h2{font-family:Jakarta;font-weight:800;font-size:30pt;color:#fff;letter-spacing:-.04em;line-height:1}
.rank{display:inline-block;border:1px solid #FBBF24;color:#FBBF24;font-family:Jakarta;font-weight:800;font-size:8pt;letter-spacing:.2em;padding:1mm 4mm;border-radius:6mm;margin-top:2mm}
.abadge{width:17mm;height:17mm;border-radius:4mm;background:linear-gradient(135deg,#1E3A8A,#0E254F);display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.15)}.abadge .am{height:9mm;width:auto}
.agrid3{display:grid;grid-template-columns:1.05fr .8fr 1.15fr;gap:4mm}
.acard{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:3mm;padding:4mm 5mm}
.acard b{display:block;font-family:Jakarta;font-weight:800;font-size:20pt;color:#fff;letter-spacing:-.04em}.acard span{display:block;margin-top:1mm;color:#CBD5E1;font-size:8.5pt}
.acard .gold{color:#FBBF24}.acard .blue{color:#60A5FA}
.abuilt{position:absolute;left:0;right:0;bottom:6mm;background:rgba(14,37,79,.6);border:1px solid rgba(96,165,250,.25);border-radius:3mm;padding:5mm 6mm}
.tk2{font-family:Jakarta;font-weight:800;font-size:7.5pt;letter-spacing:.3em;color:#7DD3FC;margin-bottom:2.5mm}
.abuilt ul{list-style:none}.abuilt li{position:relative;margin:0 0 2mm 5mm;color:#CBD5E1;font-size:9.4pt}.abuilt li b{color:#fff}
.abuilt li::before{content:"";position:absolute;left:-5mm;top:1.4mm;width:2mm;height:2mm;border-radius:.6mm;background:var(--dot,#3B82F6)}
"""

PAGE_CSS = """
@font-face{font-family:Jakarta;font-weight:600;src:url(assets/fonts/plus-jakarta-sans-latin-600-normal.woff2)}
@font-face{font-family:Jakarta;font-weight:700;src:url(assets/fonts/plus-jakarta-sans-latin-700-normal.woff2)}
@font-face{font-family:Jakarta;font-weight:800;src:url(assets/fonts/plus-jakarta-sans-latin-800-normal.woff2)}
@font-face{font-family:Inter;font-weight:400;src:url(assets/fonts/inter-latin-400-normal.woff2)}
@font-face{font-family:Inter;font-weight:500;src:url(assets/fonts/inter-latin-500-normal.woff2)}
@font-face{font-family:Inter;font-weight:600;src:url(assets/fonts/inter-latin-600-normal.woff2)}
@font-face{font-family:Inter;font-weight:700;src:url(assets/fonts/inter-latin-700-normal.woff2)}
@font-face{font-family:Mono;font-weight:600;src:url(assets/fonts/jetbrains-mono-latin-600-normal.woff2)}
@page{size:A4;margin:0}
:root{--n0:#050B1E;--n1:#08122A;--n2:#0E254F}
*{box-sizing:border-box;margin:0;padding:0}
body{background:#888;font-family:Inter,sans-serif;font-size:9.6pt;line-height:1.45}
.page{width:210mm;height:297mm;position:relative;overflow:hidden;background:radial-gradient(120% 90% at 85% 10%,var(--n2),var(--n1) 45%,var(--n0));color:#E2E8F0}
.wm{position:absolute;left:30mm;top:70mm;width:150mm;opacity:.06;z-index:0}.wmm{width:150mm;height:auto}
.rh{position:absolute;top:0;left:0;right:0;height:13mm;background:radial-gradient(140% 300% at 90% 0,var(--n2),var(--n1) 50%,var(--n0));display:flex;align-items:center;padding:0 14mm;z-index:2}
.rhm{height:6.6mm;width:auto;margin-right:3mm}
.rht{font-family:Jakarta;font-weight:800;font-size:8pt;letter-spacing:.3em;color:#fff;flex:1}
.rhi{font-family:Mono;font-size:7.5pt;color:#94A3B8;letter-spacing:.15em}
.rf{position:absolute;bottom:0;left:14mm;right:14mm;height:10mm;display:flex;justify-content:space-between;align-items:center;font-size:7.5pt;color:#64748B;border-top:1px solid rgba(255,255,255,.08);z-index:2}
.strip{position:absolute;left:14mm;right:14mm;bottom:11mm;text-align:center;font-family:Jakarta;font-weight:800;font-size:6pt;letter-spacing:.5em;color:rgba(255,255,255,.07);z-index:1}
.body{position:absolute;top:13mm;left:14mm;right:14mm;bottom:10mm;padding-top:7mm;z-index:1}
.kick{font-family:Jakarta;font-weight:800;font-size:8pt;letter-spacing:.3em;color:#7DD3FC;text-transform:uppercase;margin-bottom:2mm}
"""


def _b64(path: pathlib.Path) -> str:
    return base64.b64encode(path.read_bytes()).decode()


def author_body_html(cfg: dict) -> str:
    """The page-2 body (kicker → portraits → name → cards → method box)."""
    p1 = _b64(ASSETS / "rohit-field.jpg")
    p2 = _b64(ASSETS / "rohit-service.jpg")
    cards = "".join(
        f'<div class="acard"><b class="{c}">{big}</b><span>{small}</span></div>' for c, big, small in CARDS
    )
    bullets = "".join(f"<li>{b}</li>" for b in cfg["bullets"])
    return (
        '<div class="kick">WRITTEN &amp; REVIEWED BY</div>'
        '<div class="aphotos">'
        f'<figure class="ap"><img alt="Rohit Kumar, Assistant Commandant, BSF" src="data:image/jpeg;base64,{p1}"></figure>'
        f'<figure class="ap"><img alt="Rohit Kumar in BSF service dress" src="data:image/jpeg;base64,{p2}"></figure>'
        "</div>"
        f'<div class="aname2"><div class="anm"><h2>{NAME}</h2><div class="rank">{RANK}</div></div>'
        f'<div class="abadge">{mark("am", "#fff")}</div></div>'
        f'<div class="agrid3">{cards}</div>'
        f'<div class="abuilt" style="--dot:{cfg.get("dot", "#3B82F6")}"><div class="tk2">HOW THIS BOOK IS BUILT</div><ul>{bullets}</ul></div>'
    )


def page_html(cfg: dict) -> str:
    strip = (
        '<div class="strip">DEFENCE PATHSHALA · DEFENCEPATHSHALA.IN · PERSONAL STUDY COPY</div>'
        if cfg.get("study_copy_strip")
        else ""
    )
    return (
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><style>{PAGE_CSS}{AUTHOR_CSS}</style></head><body>'
        f'<section class="page"><div class="wm">{mark("wmm")}</div>'
        f'<div class="rh">{mark("rhm", "#fff")}<span class="rht">DEFENCE PATHSHALA / ABOUT THE AUTHOR</span><span class="rhi">02</span></div>'
        f'<div class="body">{author_body_html(cfg)}</div>{strip}'
        f'<div class="rf"><span>defencepathshala.in</span><span>{cfg.get("footer_right", "")}</span></div></section></body></html>'
    )


def render_png(cfg: dict, out_png: pathlib.Path, width_px: int = 1215, height_px: int = 1720) -> None:
    from PIL import Image
    from playwright.sync_api import sync_playwright

    html_path = HERE / "_render.html"
    html_path.write_text(page_html(cfg), encoding="utf-8")
    try:
        with sync_playwright() as p:
            b = p.chromium.launch()
            pg = b.new_page(viewport={"width": 794, "height": 1123}, device_scale_factor=width_px / 793.7)
            pg.goto(html_path.as_uri(), wait_until="networkidle")
            pg.evaluate("document.fonts.ready")
            pg.wait_for_timeout(300)
            pg.locator(".page").screenshot(path=str(out_png))
            b.close()
    finally:
        html_path.unlink(missing_ok=True)
    im = Image.open(out_png).convert("RGB")
    if im.size != (width_px, height_px):
        im = im.resize((width_px, height_px), Image.LANCZOS)
    im.save(out_png)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("slug", nargs="?", help="book slug in BOOKS")
    ap.add_argument("--all", action="store_true", help="re-render every book in BOOKS")
    ap.add_argument("--png", help="write a PNG here instead of the library webp")
    args = ap.parse_args()
    slugs = list(BOOKS) if args.all else [args.slug] if args.slug else []
    if not slugs:
        ap.error("give a slug or --all")
    from PIL import Image

    for slug in slugs:
        cfg = BOOKS.get(slug)
        if cfg is None:
            sys.exit(f"unknown slug {slug!r}; add it to BOOKS first")
        if args.png:
            render_png(cfg, pathlib.Path(args.png))
            print("wrote", args.png)
            continue
        out = PUBLIC_LIBRARY / slug / "page-02.webp"
        tmp = HERE / f"_{slug}.png"
        render_png(cfg, tmp)
        Image.open(tmp).convert("RGB").save(out, "WEBP", quality=80, method=6)
        tmp.unlink()
        print("wrote", out.relative_to(PUBLIC_LIBRARY.parents[1]))


if __name__ == "__main__":
    main()
