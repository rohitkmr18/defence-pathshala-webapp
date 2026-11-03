#!/usr/bin/env python3
"""Build AFCAT Full Mock 01 (draft v2) and its original figure assets.

Sources
- Bank: "AFCAT Practice Bank - 300 Original Questions" (Claude Doc, rev 3, 3 Nov 2026).
  It actually contains 225 questions (GA 75, English 90, Numerical 60) and no
  Reasoning section.
- R-codes: reasoning items written for this mock (v1).
- V2-codes: v2 replacements (harder items, cloze passage, 2026 current affairs,
  figure-based reasoning).

Everything here is DRAFT and needs independent review before import or publication.
Run: python3 scripts/build-afcat-mock01.py
"""
import collections, hashlib, json, math, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "content/afcat/prelaunch/full_mock_01_v1.json"
ASSET_DIR = ROOT / "content/afcat/prelaunch/assets/fm01"
BANK = "DP AFCAT Practice Bank v0 (Claude Doc 'AFCAT Practice Bank - 300 Original Questions', rev 3, 2026-11-03)"


def q(section, topic, sub, diff, ref, text, opts, ans, expl, passage=None, figures=None, evidence=None):
    return dict(section=section, topic=topic, subtopic=sub, difficulty=diff, ref=ref, text=text,
                options=opts, correct_option=ans, explanation=expl, passage=passage,
                figures=figures or [], evidence=evidence)


GA, EN, NA, RM = "GENERAL_AWARENESS", "ENGLISH", "NUMERICAL_ABILITY", "REASONING_MILITARY_APTITUDE"

# ---------------------------------------------------------------- figures
# Original SVGs, drawn from geometry so every transform is exact.
INK = 'stroke="#111" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"'
FONT = 'font-family="Arial, Helvetica, sans-serif" fill="#111"'


def svg(w, h, body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">'
            f'<rect width="{w}" height="{h}" fill="#fff"/>{body}</svg>\n')


def box(x, y, s=120):
    return f'<rect x="{x}" y="{y}" width="{s}" height="{s}" rx="4" stroke="#111" stroke-width="2" fill="none"/>'


def label(x, y, t, size=20, bold=True):
    return f'<text x="{x}" y="{y}" {FONT} font-size="{size}" text-anchor="middle"{" font-weight=\"bold\"" if bold else ""}>{t}</text>'


def arrow(cx, cy, length, deg):
    """Arrow centred at (cx, cy); deg measured clockwise from 'up'."""
    t = math.radians(deg)
    dx, dy = math.sin(t), -math.cos(t)
    tip = (cx + dx * length / 2, cy + dy * length / 2)
    tail = (cx - dx * length / 2, cy - dy * length / 2)
    heads = []
    for side in (150, -150):
        a = math.radians(deg + side)
        heads.append((tip[0] + math.sin(a) * 14, tip[1] - math.cos(a) * 14))
    f = lambda p: f"{p[0]:.1f},{p[1]:.1f}"
    return (f'<path d="M{f(tail)} L{f(tip)} M{f(heads[0])} L{f(tip)} L{f(heads[1])}" {INK}/>')


def dot(x, y, r=7):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="#111"/>'


CORNER = {"TL": (16, 16), "TR": (104, 16), "BR": (104, 104), "BL": (16, 104)}


def series_cell(x, y, deg, corner):
    cx, cy = CORNER[corner]
    return box(x, y) + arrow(x + 60, y + 60, 64, deg) + dot(x + cx, y + cy)


def fig_series():
    problem = svg(560, 170, "".join(
        series_cell(10 + i * 140, 10, d, c) + label(70 + i * 140, 160, f"({i + 1})", 16, False)
        for i, (d, c) in enumerate([(0, "TL"), (45, "TR"), (90, "BR")])
    ) + box(430, 10) + label(490, 82, "?", 40))
    answers = svg(560, 170, "".join(
        series_cell(10 + i * 140, 10, d, c) + label(70 + i * 140, 160, f"({k})", 18)
        for i, (k, d, c) in enumerate([("A", 135, "BR"), ("B", 180, "BL"), ("C", 135, "BL"), ("D", 135, "TL")])))
    return problem, answers


# Asymmetric base shapes in a 100x100 frame, as (kind, data) primitives.
FLAG = [("line", [(30, 88), (30, 14)]), ("poly", [(30, 14), (76, 28), (30, 42)]),
        ("line", [(30, 62), (56, 62)]), ("circ", (64, 78, 7))]
STEP = [("line", [(14, 84), (14, 54), (46, 54), (46, 26), (80, 26)]),
        ("line", [(70, 18), (80, 26), (70, 34)]), ("rect", (60, 66, 16)), ("circ", (30, 32, 6))]


def tf(pt, mode):
    x, y = pt
    return {"id": (x, y), "mirror": (100 - x, y), "water": (x, 100 - y),
            "rot180": (100 - x, 100 - y), "rot90": (100 - y, x)}[mode]


def draw_shape(shape, mode, ox, oy, scale=1.2):
    out = []
    P = lambda p: (ox + tf(p, mode)[0] * scale, oy + tf(p, mode)[1] * scale)
    for kind, data in shape:
        if kind in ("line", "poly"):
            pts = " ".join(f"{P(p)[0]:.1f},{P(p)[1]:.1f}" for p in data)
            tag = "polyline" if kind == "line" else "polygon"
            out.append(f'<{tag} points="{pts}" {INK}/>')
        elif kind == "circ":
            x, y, r = data
            cx, cy = P((x, y))
            out.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r * scale:.1f}" {INK}/>')
        elif kind == "rect":
            x, y, s = data
            corners = [P((x, y)), P((x + s, y)), P((x + s, y + s)), P((x, y + s))]
            pts = " ".join(f"{a:.1f},{b:.1f}" for a, b in corners)
            out.append(f'<polygon points="{pts}" fill="#111" stroke="#111" stroke-width="2"/>')
    return "".join(out)


def fig_reflection(shape, kind, order):
    if kind == "mirror":
        guide = ('<line x1="200" y1="10" x2="200" y2="160" stroke="#111" stroke-width="2" stroke-dasharray="8 6"/>'
                 + label(232, 90, "M", 18) + box(40, 25, 130) + draw_shape(shape, "id", 45, 30))
        problem = svg(280, 180, guide)
    else:
        guide = ('<line x1="20" y1="175" x2="200" y2="175" stroke="#111" stroke-width="2" stroke-dasharray="8 6"/>'
                 + label(110, 205, "Water line", 16, False) + box(45, 25, 130) + draw_shape(shape, "id", 50, 30))
        problem = svg(220, 220, guide)
    answers = svg(600, 180, "".join(
        box(10 + i * 150, 10, 130) + draw_shape(shape, mode, 15 + i * 150, 15) + label(75 + i * 150, 172, f"({k})", 18)
        for i, (k, mode) in enumerate(zip("ABCD", order))))
    return problem, answers


def holes_square(x, y, holes, s=120):
    return box(x, y, s) + "".join(
        f'<circle cx="{x + hx * s / 100:.1f}" cy="{y + hy * s / 100:.1f}" r="7" fill="#111"/>' for hx, hy in holes)


def fig_folding():
    s = 120
    step1 = (box(10, 20, s) + f'<line x1="70" y1="20" x2="70" y2="{20 + s}" stroke="#111" stroke-width="2" stroke-dasharray="7 5"/>'
             + '<path d="M38 78 Q70 48 102 78" stroke="#111" stroke-width="2" fill="none"/>'
             + '<polyline points="94,70 102,78 92,82" stroke="#111" stroke-width="2" fill="none"/>' + label(70, 170, "(1)", 16, False))
    step2 = (f'<rect x="200" y="20" width="60" height="{s}" rx="4" stroke="#111" stroke-width="2" fill="none"/>'
             + '<line x1="200" y1="80" x2="260" y2="80" stroke="#111" stroke-width="2" stroke-dasharray="7 5"/>'
             + '<path d="M245 42 Q275 80 245 118" stroke="#111" stroke-width="2" fill="none"/>'
             + '<polyline points="241,108 245,118 254,112" stroke="#111" stroke-width="2" fill="none"/>' + label(230, 170, "(2)", 16, False))
    # Folded quarter covers original x 50-100, y 50-100; punch at (65, 85).
    step3 = ('<rect x="340" y="80" width="60" height="60" rx="4" stroke="#111" stroke-width="2" fill="none"/>'
             + f'<circle cx="{340 + 15 * 1.2:.1f}" cy="{80 + 35 * 1.2:.1f}" r="7" fill="#111"/>' + label(370, 170, "(3)", 16, False))
    problem = svg(430, 185, step1 + step2 + step3)
    options = {
        "A": [(35, 85), (65, 85)],
        "B": [(15, 35), (85, 35), (15, 65), (85, 65)],
        "C": [(35, 15), (65, 85)],
        "D": [(35, 15), (65, 15), (35, 85), (65, 85)],  # correct
    }
    answers = svg(600, 180, "".join(
        holes_square(10 + i * 150, 10, options[k], 130) + label(75 + i * 150, 172, f"({k})", 18)
        for i, k in enumerate("ABCD")))
    return problem, answers


def fig_triangles():
    body = ('<polygon points="150,15 30,215 270,215" stroke="#111" stroke-width="3" fill="none" stroke-linejoin="round"/>'
            '<line x1="150" y1="15" x2="150" y2="215" stroke="#111" stroke-width="3"/>'
            '<line x1="90" y1="115" x2="210" y2="115" stroke="#111" stroke-width="3"/>')
    return svg(300, 230, body)


def polygon(cx, cy, r, n):
    start = -45 if n == 4 else -90  # squares sit flat, other polygons point up
    pts = [(cx + r * math.cos(math.radians(start + 360 * i / n)), cy + r * math.sin(math.radians(start + 360 * i / n)))
           for i in range(n)]
    return '<polygon points="' + " ".join(f"{x:.1f},{y:.1f}" for x, y in pts) + f'" {INK}/>'


def fig_odd():
    cells = [("A", 4, 3), ("B", 3, 2), ("C", 5, 4), ("D", 6, 4)]  # sides, dots; D breaks dots = sides - 1
    body = ""
    for i, (k, n, d) in enumerate(cells):
        cx, cy = 75 + i * 150, 78
        body += box(10 + i * 150, 10, 130) + polygon(cx, cy + (8 if n == 3 else 0), 52, n)
        gap = 16
        start = cx - gap * (d - 1) / 2
        body += "".join(dot(start + j * gap, cy + 6, 5) for j in range(d))
        body += label(cx, 172, f"({k})", 18)
    return svg(600, 185, body)


FIGS = {}


def register(name, svg_text, alt):
    FIGS[name] = dict(svg=svg_text, alt=alt)
    return name


s_prob, s_ans = fig_series()
m_prob, m_ans = fig_reflection(FLAG, "mirror", ["id", "water", "rot180", "mirror"])
w_prob, w_ans = fig_reflection(STEP, "water", ["water", "mirror", "rot180", "rot90"])
f_prob, f_ans = fig_folding()
FIG = {
    "series": [register("fm01-series-problem", s_prob, "Three figures in a series. Each square holds an arrow and a dot. Figure 1: arrow up, dot top-left. Figure 2: arrow up-right, dot top-right. Figure 3: arrow right, dot bottom-right. Figure 4 is a question mark."),
               register("fm01-series-answers", s_ans, "Answer figures. A: arrow down-right, dot bottom-right. B: arrow down, dot bottom-left. C: arrow down-right, dot bottom-left. D: arrow down-right, dot top-left.")],
    "mirror": [register("fm01-mirror-problem", m_prob, "A flag on a pole, with the triangular flag at the top pointing right, a short bar to the right of the pole and a small circle at lower right. A vertical mirror line M is on the right."),
               register("fm01-mirror-answers", m_ans, "Four answer figures. A: flag at the top pointing right, pole on the left, circle at lower right. B: flag at the bottom pointing right, pole on the left, circle at upper right. C: flag at the bottom pointing left, pole on the right, circle at upper left. D: flag at the top pointing left, pole on the right, circle at lower left.")],
    "water": [register("fm01-water-problem", w_prob, "A staircase line rising from bottom-left to top-right ending in an arrowhead pointing right, a small circle at upper left and a filled square at lower right. A horizontal water line is below the figure."),
              register("fm01-water-answers", w_ans, "Four answer figures. A: staircase descends from top-left to an arrowhead at lower right; circle at lower left; square at upper right. B: staircase rises from bottom-right to an arrowhead at upper left; circle at upper right; square at lower left. C: staircase descends from top-right to an arrowhead at lower left; circle at lower right; square at upper left. D: the figure turned a quarter-turn clockwise, staircase running top to bottom with the arrowhead pointing down at lower right.")],
    "fold": [register("fm01-fold-problem", f_prob, "Step 1: a square sheet is folded along its vertical centre line, left half onto right. Step 2: the folded sheet is folded along its horizontal centre line, top half onto bottom. Step 3: one hole is punched in the folded quarter, near its lower-left area."),
             register("fm01-fold-answers", f_ans, "Four unfolded squares. A: two holes in the lower half, side by side. B: four holes in the middle band near the left and right edges. C: two holes on a diagonal. D: four holes, one in each quarter, placed symmetrically about both centre lines.")],
    "triangles": [register("fm01-count-triangles", fig_triangles(), "A large triangle with a vertical line from the top vertex to the middle of the base, and a horizontal line across the triangle at half its height.")],
    "odd": [register("fm01-odd-figure", fig_odd(), "Four figures. A: square with 3 dots. B: triangle with 2 dots. C: pentagon with 4 dots. D: hexagon with 4 dots.")],
}
FIGURE_OPTS = ["Figure (A)", "Figure (B)", "Figure (C)", "Figure (D)"]

# ---------------------------------------------------------------- Section 1: General Awareness (25)
CA_ASOF = "2026-11-04"
ga = [
 q(GA,"History","Modern India - British administration","EASY","A-Q11","The Doctrine of Lapse was introduced by:",["Lord Wellesley","Lord Cornwallis","Lord Dalhousie","Lord Bentinck"],"C","Lord Dalhousie (Governor-General 1848-56) used the Doctrine of Lapse to annex states such as Satara, Jhansi and Nagpur."),
 q(GA,"History","Modern India - reform movements","EASY","A-Q4","The Mohammedan Anglo-Oriental College, Aligarh, was founded by:",["Annie Besant","Syed Ahmad Khan","Dadabhai Naoroji","M. G. Ranade"],"B","Sir Syed Ahmad Khan founded the MAO College in 1875; it later became Aligarh Muslim University."),
 q(GA,"History","Ancient India - Harappan sites","MODERATE","A-Q8","The Harappan site Lothal is in:",["Rajasthan","Haryana","Punjab","Gujarat"],"D","Lothal, known for its dockyard, is in Ahmedabad district, Gujarat."),
 q(GA,"Geography","Indian physical geography","MODERATE","A-Q15","The Tropic of Cancer passes through how many Indian states?",["6","7","9","8"],"D","Eight: Gujarat, Rajasthan, Madhya Pradesh, Chhattisgarh, Jharkhand, West Bengal, Tripura and Mizoram."),
 q(GA,"Geography","Himalayan peaks","MODERATE","A-Q16","The highest peak lying entirely within India is:",["Kanchenjunga","Nanda Devi","Kamet","Saltoro Kangri"],"B","Kanchenjunga is higher but lies on the India-Nepal border; Nanda Devi (7,816 m) is the highest wholly within India."),
 q(GA,"Geography","Oceanography","EASY","A-Q24","Long, narrow and very deep depressions on the ocean floor are called:",["Abyssal plains","Mid-ocean ridges","Continental shelves","Oceanic trenches"],"D","Oceanic trenches form at subduction zones; the Mariana Trench is the deepest."),
 q(GA,"Polity","Constitutional amendments","EASY","A-Q27","Fundamental Duties were added to the Constitution by the:",["24th Amendment","42nd Amendment","44th Amendment","52nd Amendment"],"B","The 42nd Amendment (1976) inserted Part IV-A (Article 51A) on Fundamental Duties."),
 q(GA,"Polity","Elections and parties","HARD","A-Q32","Recognition of national parties is governed by the:",["Representation of the People Act, 1950 only","Article 368","Election Symbols (Reservation and Allotment) Order, 1968","Tenth Schedule"],"C","The Election Commission recognises national and state parties under paragraph 6 of the Election Symbols Order, 1968."),
 q(GA,"Polity","Emergency provisions","MODERATE","V2-H03","Which Article of the Constitution empowers the President to proclaim a Financial Emergency?",["Article 352","Article 356","Article 360","Article 365"],"C","Article 360 covers Financial Emergency. Article 352 is National Emergency and Article 356 is President's Rule in a state."),
 q(GA,"Science and Technology","Physics - scalars and vectors","MODERATE","V2-H01","Which of the following is NOT a vector quantity?",["Displacement","Momentum","Impulse","Work"],"D","Work is the dot product of force and displacement, so it has magnitude only. The other three have direction."),
 q(GA,"Science and Technology","Biology - vitamins","MODERATE","V2-H02","Which of the following vitamins is fat-soluble?",["Vitamin C","Vitamin B12","Vitamin K","Vitamin B1"],"C","Vitamins A, D, E and K are fat-soluble; vitamin C and the B group are water-soluble."),
 q(GA,"Science and Technology","Physics - optics","EASY","A-Q52","Myopia (short-sightedness) is corrected using a:",["Convex lens","Cylindrical lens","Bifocal lens","Concave lens"],"D","In myopia the image forms in front of the retina; a diverging (concave) lens moves it back onto the retina."),
 q(GA,"Environment","Atmosphere","EASY","A-Q23","The ozone layer lies in the:",["Troposphere","Mesosphere","Stratosphere","Exosphere"],"C","Most atmospheric ozone is in the stratosphere, roughly 15-35 km above the surface."),
 q(GA,"Economy","Monetary policy","MODERATE","A-Q38","The repo rate is the rate at which:",["Banks keep deposits with RBI","RBI borrows from banks","Banks lend to the public","Commercial banks borrow short-term from the RBI"],"D","Repo is the rate at which the RBI lends short-term funds to commercial banks against government securities."),
 q(GA,"Economy","Financial institutions","HARD","A-Q36","IDBI (Industrial Development Bank of India) was established in:",["1949","1955","1964","1969"],"C","IDBI was set up in 1964 as a subsidiary of the RBI to finance industrial development."),
 q(GA,"Sports, Awards and Culture","Festivals","MODERATE","V2-H04","The Hornbill Festival is celebrated in:",["Nagaland","Arunachal Pradesh","Mizoram","Meghalaya"],"A","Nagaland's Hornbill Festival, held each December near Kohima, showcases the state's Naga tribes."),
 q(GA,"Sports, Awards and Culture","Dance and theatre","MODERATE","A-Q70","Yakshagana is a traditional dance-drama of:",["Kerala","Andhra Pradesh","Karnataka","Tamil Nadu"],"C","Yakshagana is associated with coastal Karnataka."),
 q(GA,"Sports, Awards and Culture","Sports rules","MODERATE","A-Q71","Under standard rules, how many players of the chasing team are on the field at a time in Kho Kho?",["9","11","7","12"],"A","Nine chasers take the field: eight sit in the squares and one is the active chaser."),
 q(GA,"Defence and Aviation","Operations","MODERATE","A-Q53","Operation Safed Sagar (1999) was the code name for the:",["Army's ground offensive in Kargil","Navy's blockade of Karachi","IAF's air operations in the Kargil conflict","Evacuation of Indians from Ukraine"],"C","Safed Sagar was the IAF's air campaign in Kargil; the Army's operation was Operation Vijay and the Navy's Operation Talwar."),
 q(GA,"Defence and Aviation","Gallantry awards","MODERATE","A-Q57","The only IAF officer to receive the Param Vir Chakra is:",["Flying Officer Nirmal Jit Singh Sekhon","Sqn Ldr Ajjamada Devayya","Wg Cdr Rakesh Sharma","Gp Capt Varun Singh"],"A","Fg Offr N. J. S. Sekhon was awarded the PVC posthumously for defending Srinagar airfield in December 1971."),
 q(GA,"Defence and Aviation","Indigenous weapons","MODERATE","A-Q58","The Rudram series of air-to-surface anti-radiation missiles was developed by:",["HAL","DRDO","BEL","ISRO"],"B","Rudram was developed by DRDO for IAF fighters to destroy enemy radar emitters."),
 q(GA,"Current Affairs","IAF exercises 2026","MODERATE","V2-CA1","Exercise Vayu Shakti-2026, witnessed by President Droupadi Murmu in February 2026, was conducted by the IAF at:",["Mahajan Field Firing Range, Bikaner","Babina Field Firing Range, Jhansi","Tilpat Range, Faridabad","Pokhran Firing Range, Jaisalmer"],"D","Vayu Shakti-2026 was held on 27 February 2026 at the Pokhran range in Jaisalmer, Rajasthan, with Rafale, Su-30MKI, Tejas and Mirage 2000 fighters taking part.",
   evidence=[{"title":"President of India witnesses the Vayu Shakti-2026 exercise at the Pokhran firing range","issuer":"President's Secretariat","url":"https://presidentofindia.nic.in/press_releases/president-india-witnesses-vayu-shakti-2026-exercise-pokhran-firing-range","accessed":CA_ASOF}]),
 q(GA,"Current Affairs","IAF exercises 2026","MODERATE","V2-CA2","The second edition of the IAF-hosted multinational air exercise Tarang Shakti (September–October 2026) was held at:",["Air Force Station Sulur","Air Force Station Jodhpur","Air Force Station Jamnagar","Air Force Station Hindan"],"B","Tarang Shakti 2026 ran from 26 September to 12 October 2026 at Air Force Station Jodhpur and nearby bases, with eight countries flying and 32 observing.",
   evidence=[{"title":"Tarang Shakti-2026 multinational air exercise to begin on 26th September in Jodhpur","issuer":"News On AIR (Prasar Bharati)","url":"https://newsonair.gov.in/tarang-shakti-2026-multinational-air-exercise-to-begin-on-26th-september-in-jodhpur/","accessed":CA_ASOF}]),
 q(GA,"Current Affairs","IAF exercises 2026","MODERATE","V2-CA3","Veer Guardian 2026, held at Air Force Station Jodhpur in September 2026, was a bilateral air exercise between the IAF and the air force of:",["France","Egypt","Australia","Japan"],"D","Veer Guardian is an India-Japan exercise. In 2026 the Japan Air Self-Defence Force flew F-2A fighters alongside IAF Tejas, Su-30MKI and Rafale aircraft.",
   evidence=[{"title":"India, Japan conduct air exercise Veer Guardian 2026 at Air Force Station Jodhpur","issuer":"News On AIR (Prasar Bharati)","url":"https://newsonair.gov.in/india-japan-conduct-air-exercise-veer-guardian-2026-at-air-force-station-jodhpur/","accessed":CA_ASOF}]),
 q(GA,"Current Affairs","IAF exercises 2026","MODERATE","V2-CA4","Exercise Pitch Black 2026, in which IAF Rafale fighters took part in July–August 2026, is hosted by the:",["Royal Australian Air Force","United States Air Force","Royal Air Force (UK)","Royal Malaysian Air Force"],"A","Pitch Black is hosted by the Royal Australian Air Force from RAAF Base Darwin; the 2026 edition ran from 20 July to 7 August.",
   evidence=[{"title":"Indian Air Force: Ex Pitch Black 2026 at Darwin, Australia (summary of PIB release)","issuer":"SuperKalam current affairs, citing PIB; replace with the PIB release before approval","url":"https://superkalam.com/current-affairs/20-07-2026/indian-air-force-ex-pitch-black-2026-at-darwin-australia-1b1b9689-5a40-4a6b-b021-4418d2564fed","accessed":CA_ASOF}]),
]

# ---------------------------------------------------------------- Section 2: Verbal Ability in English (30)
P1 = ("Air power has transformed modern warfare. Unlike armies, which must cross terrain, an air force can strike at depth "
      "within hours and shift its effort from one theatre to another with little delay. Yet air power alone rarely wins a war. "
      "Its true strength lies in partnership with land and naval forces, where it provides surveillance, transport and precision fire. "
      "Moreover, technology has made pilots dependent on a vast network of engineers, technicians and controllers on the ground. "
      "A single sortie is therefore the visible tip of an enormous, disciplined effort.")
CLOZE = ("Every pilot learns early that the sky is (1) ______ to carelessness. A small error that would pass (2) ______ on the "
         "ground can, at altitude, turn into an emergency within seconds. That is why flight training places such (3) ______ on "
         "checklists, which leave nothing to memory alone. Over time these routines become second nature, so that when the "
         "unexpected happens, the pilot can respond (4) ______ rather than react in panic.")
CT = "In the passage, choose the word that best fills blank ({n})."
EP = "Identify the part of the sentence that contains an error. Choose (D) if there is no error. "
en = [
 q(EN,"Reading Comprehension","Main idea","MODERATE","B-Q81","The main idea of the passage is that:",["Air power alone wins wars","Air power is powerful but depends on joint effort and a large support network","Armies are obsolete","Pilots are not important"],"B","The passage praises air power's reach but stresses partnership with other forces and a ground support network.",P1),
 q(EN,"Reading Comprehension","Inference","EASY","B-Q82","According to the passage, an air force can 'strike at depth' because it can:",["depend on armies","need no support","reach distant targets within hours","operate only at night"],"C","The passage contrasts armies crossing terrain with air forces striking at depth within hours.",P1),
 q(EN,"Reading Comprehension","Figurative meaning","MODERATE","B-Q83","'The visible tip of an enormous effort' suggests that:",["a sortie is the seen part of a large unseen effort","sorties are easy","engineers are unnecessary","pilots work alone"],"A","Like the tip of an iceberg, the sortie is what is seen; the ground effort behind it is not.",P1),
 q(EN,"Reading Comprehension","Author's view","MODERATE","B-Q84","The author's view of air power acting alone is that it:",["is always decisive","is rarely decisive","is useless","is cheaper than armies"],"B","'Yet air power alone rarely wins a war.'",P1),
 q(EN,"Reading Comprehension","Vocabulary in context","EASY","B-Q85","The word most nearly OPPOSITE in meaning to 'enormous', as used in the passage, is:",["Tiny","Vast","Huge","Massive"],"A","Enormous means very large; tiny is its opposite. The other three are synonyms.",P1),
 q(EN,"Cloze Test","Collocation","MODERATE","V2-C1",CT.format(n=1),["indifferent","accustomed","hostile","friendly"],"C","'Hostile to carelessness' fits the warning tone: the sky punishes careless flying. The other words reverse or blur the meaning.",CLOZE),
 q(EN,"Cloze Test","Vocabulary","MODERATE","V2-C2",CT.format(n=2),["unhurt","unpaid","unarmed","unnoticed"],"D","The contrast is with altitude, where the same error becomes an emergency; on the ground it would 'pass unnoticed'.",CLOZE),
 q(EN,"Cloze Test","Collocation","MODERATE","V2-C3",CT.format(n=3),["emphasis","burden","doubt","suspicion"],"A","'Places such emphasis on' means treats as very important, which explains why checklists matter.",CLOZE),
 q(EN,"Cloze Test","Vocabulary","MODERATE","V2-C4",CT.format(n=4),["carelessly","reluctantly","deliberately","rarely"],"C","'Respond deliberately rather than react in panic' sets up the intended contrast between considered action and panic.",CLOZE),
 q(EN,"Error Detection","Subject-verb agreement","MODERATE","B-Q50",EP+"(A) Neither of the two answers / (B) are correct / (C) according to the key. / (D) No error",["Neither of the two answers","are correct","according to the key.","No error"],"B","'Neither of' takes a singular verb: 'Neither of the two answers is correct.'"),
 q(EN,"Error Detection","Stative verbs","MODERATE","B-Q53",EP+"(A) I have been working here / (B) for five years but / (C) I am knowing the manager well. / (D) No error",["I have been working here","for five years but","I am knowing the manager well.","No error"],"C","'Know' is a stative verb and is not used in the continuous form: 'I know the manager well.'"),
 q(EN,"Error Detection","Conditionals","MODERATE","B-Q56",EP+"(A) If I would have known / (B) the truth, I would have / (C) acted differently. / (D) No error",["If I would have known","the truth, I would have","acted differently.","No error"],"A","A third conditional uses the past perfect in the if-clause: 'If I had known…'"),
 q(EN,"Error Detection","Subject-verb agreement","MODERATE","B-Q57",EP+"(A) The pilot along with / (B) his crew were rescued / (C) by the villagers. / (D) No error",["The pilot along with","his crew were rescued","by the villagers.","No error"],"B","The verb agrees with the first subject ('The pilot'); 'along with his crew' does not make it plural: 'was rescued'."),
 q(EN,"Error Detection","Relative clauses","HARD","B-Q58",EP+"(A) She is one of the best teachers / (B) who has ever taught / (C) in this school. / (D) No error",["She is one of the best teachers","who has ever taught","in this school.","No error"],"B","'Who' refers to 'teachers' (plural), so the verb is plural: 'who have ever taught'."),
 q(EN,"Sentence Completion","Prepositions","MODERATE","V2-H05","Despite repeated warnings, the cadet persisted ____ his careless habits.",["in","on","with","at"],"A","'Persist' takes 'in' (persist in a habit) or 'with' (persist with an effort). With 'habits', 'persisted in' is the standard choice."),
 q(EN,"Sentence Completion","Conditionals","MODERATE","B-Q65","Had I known, I ____ helped you.",["will have","would have","would","had"],"B","Inverted third conditional: 'Had I known, I would have helped you.'"),
 q(EN,"Sentence Completion","Subject-verb agreement","MODERATE","B-Q68","Neither Ravi nor his friends ____ present.",["was","is","were","has been"],"C","With 'neither…nor', the verb agrees with the nearer subject ('friends'), so 'were'."),
 q(EN,"Sentence Improvement","Double negatives","MODERATE","B-Q72","Choose the best replacement for the part in quotes: She 'doesn't hardly visit' us now.",["not hardly visits","did hardly visit","hardly visits","No improvement"],"C","'Hardly' is already negative; 'doesn't hardly' is a double negative."),
 q(EN,"Sentence Improvement","Tenses","MODERATE","B-Q74","Choose the best replacement for the part in quotes: I 'am waiting' for him since morning.",["was waiting","had waited","will wait","have been waiting"],"D","An action that began in the past and continues now, with 'since', takes the present perfect continuous."),
 q(EN,"Synonyms","Vocabulary","EASY","B-Q1","Choose the word closest in meaning to PRECARIOUS:",["Secure","Steady","Uncertain","Strong"],"C","Precarious means dangerously uncertain or unstable."),
 q(EN,"Synonyms","Vocabulary","MODERATE","B-Q3","Choose the word closest in meaning to BELLIGERENT:",["Hostile","Peaceful","Gentle","Timid"],"A","Belligerent means aggressive or eager to fight."),
 q(EN,"Synonyms","Vocabulary","HARD","B-Q12","Choose the word closest in meaning to MOUNTEBANK:",["Mountaineer","Charlatan","Banker","Magistrate"],"B","A mountebank is a person who deceives others, a charlatan or quack."),
 q(EN,"Antonyms","Vocabulary","HARD","V2-H07","Choose the word most nearly OPPOSITE in meaning to OBDURATE:",["Stubborn","Yielding","Callous","Unrelenting"],"B","Obdurate means stubbornly refusing to change; yielding is its opposite. The other three are close to its meaning."),
 q(EN,"Idioms and Phrases","Meaning","MODERATE","B-Q37","Choose the meaning of the idiom: To break a butterfly on the wheel",["To use excessive force on a trivial matter","To harm a delicate creature accidentally","To fail at an easy task","To waste time"],"A","It means to spend disproportionate force or effort on something unimportant."),
 q(EN,"Idioms and Phrases","Meaning","HARD","V2-H06","Choose the meaning of the idiom: To be on tenterhooks",["To be in great danger","To be deeply in debt","To be in a state of anxious suspense","To be under strict discipline"],"C","Tenterhooks held cloth stretched on a frame; to be 'on tenterhooks' is to be tense while waiting for news."),
 q(EN,"Idioms and Phrases","Meaning","MODERATE","B-Q43","Choose the meaning of the idiom: To cut the Gordian knot",["To solve a hard problem by a bold stroke","To tie a knot","To end a friendship","To cut a rope"],"A","From Alexander's legendary cutting of the Gordian knot: a bold, direct solution to an intricate problem."),
 q(EN,"One-Word Substitution","Vocabulary","MODERATE","B-Q27","Choose the one word for: A harsh, discordant mixture of sounds",["Euphony","Harmony","Cacophony","Symphony"],"C","Cacophony is a harsh mixture of sounds; euphony is its opposite."),
 q(EN,"One-Word Substitution","Vocabulary","HARD","B-Q29","Choose the one word for: The belief that only one's own mind is certain to exist",["Solipsism","Altruism","Stoicism","Nihilism"],"A","Solipsism holds that only one's own mind is sure to exist."),
 q(EN,"Sentence Rearrangement","Logical sequence","MODERATE","B-Q77","Arrange P, Q, R, S in a logical order. P: The pilot signalled the tower. Q: A warning light flashed on the console. R: The aircraft landed safely. S: He was asked to divert to the nearest airfield.",["PQSR","QPSR","QSPR","SQPR"],"B","Warning light (Q), pilot signals tower (P), told to divert (S), lands safely (R)."),
 q(EN,"Sentence Rearrangement","Logical sequence","HARD","B-Q78","Arrange P, Q, R, S in a logical order. P: Hence they prefer routine drills. Q: Discipline is the backbone of any force. R: Without it, chaos would follow. S: Commanders understand this well.",["SQRP","QSRP","RQSP","QRSP"],"D","Claim (Q), consequence of its absence (R), commanders know it (S), hence drills (P)."),
]

# ---------------------------------------------------------------- Section 3: Numerical Ability (20)
na = [
 q(NA,"Percentages and Ratios","Successive change","MODERATE","C-Q8","A price rises by 25% and then falls by 20%. The net change is:",["5% increase","5% decrease","No change","10% increase"],"C","1.25 × 0.80 = 1.00, so there is no net change."),
 q(NA,"Percentages and Ratios","Successive discounts","MODERATE","C-Q11","Two successive discounts of 10% and 20% equal a single discount of:",["30%","28%","25%","32%"],"B","1 − 0.9 × 0.8 = 0.28, i.e. 28%."),
 q(NA,"Percentages and Ratios","Population growth","MODERATE","C-Q14","A town of 20,000 grows 10% a year. Its population after 2 years is:",["24,000","24,200","24,400","22,000"],"B","20,000 × 1.1² = 24,200."),
 q(NA,"Percentages and Ratios","Compound ratio","MODERATE","C-Q20","If a : b = 2 : 3 and b : c = 4 : 5, then a : c is:",["2 : 5","8 : 15","6 : 5","4 : 5"],"B","a : b : c = 8 : 12 : 15, so a : c = 8 : 15."),
 q(NA,"Time, Work and Distance","Pipes and cisterns","MODERATE","C-Q23","Pipe A fills a tank in 20 minutes and pipe B empties it in 30 minutes. With both open, the tank fills in:",["60 min","50 min","40 min","45 min"],"A","1/20 − 1/30 = 1/60, so 60 minutes."),
 q(NA,"Time, Work and Distance","Trains","MODERATE","C-Q27","A 150 m train running at 54 km/h crosses a pole in:",["8 s","12 s","9 s","10 s"],"D","54 km/h = 15 m/s; 150 ÷ 15 = 10 s."),
 q(NA,"Time, Work and Distance","Average speed","MODERATE","C-Q28","A man covers half a distance at 40 km/h and the rest at 60 km/h. His average speed is:",["50 km/h","48 km/h","52 km/h","45 km/h"],"B","For equal distances, average = 2 × 40 × 60 ÷ (40 + 60) = 48 km/h."),
 q(NA,"Time, Work and Distance","Boats and streams","EASY","C-Q29","A boat goes 12 km/h in still water and the river flows at 3 km/h. The distance covered downstream in 4 hours is:",["36 km","48 km","60 km","72 km"],"C","Downstream speed = 15 km/h; 15 × 4 = 60 km."),
 q(NA,"Profit, Loss and Interest","Loss","EASY","C-Q10","An item sold for ₹540 gives a 10% loss. Its cost price is:",["₹600","₹580","₹594","₹560"],"A","CP = 540 ÷ 0.9 = ₹600."),
 q(NA,"Profit, Loss and Interest","Compound interest","MODERATE","C-Q33","Compound interest on ₹10,000 at 10% per annum for 2 years is:",["₹2,000","₹2,100","₹2,200","₹2,050"],"B","10,000 × (1.21 − 1) = ₹2,100."),
 q(NA,"Profit, Loss and Interest","CI minus SI","HARD","V2-H10","The difference between compound interest and simple interest on a sum for 2 years at 10% per annum is ₹50. The sum is:",["₹4,000","₹5,000","₹5,500","₹6,000"],"B","For 2 years, CI − SI = P × (r/100)² = P × 0.01 = 50, so P = ₹5,000."),
 q(NA,"Number System and Series","Remainders","MODERATE","C-Q4","The remainder when 2^10 is divided by 7 is:",["1","2","4","3"],"B","2³ = 8 ≡ 1 (mod 7), so 2^10 = (2³)³ × 2 ≡ 2."),
 q(NA,"Number System and Series","Number series","EASY","C-Q59","The next term of the series 2, 6, 12, 20, 30, … is:",["40","42","44","48"],"B","Terms are n(n + 1): the next is 6 × 7 = 42."),
 q(NA,"Fractions and Averages","Averages","EASY","C-Q16","The average of five numbers is 18. If the number 10 is removed, the average of the rest is:",["20","19","22","16"],"A","Total 90; (90 − 10) ÷ 4 = 20."),
 q(NA,"Fractions and Averages","Averages","MODERATE","C-Q18","The average of the first 9 odd natural numbers is:",["8","9","10","11"],"B","The sum of the first n odd numbers is n² = 81; 81 ÷ 9 = 9."),
 q(NA,"Mensuration","Cylinder","EASY","C-Q42","The volume of a cylinder with radius 7 cm and height 10 cm is (take π = 22/7):",["1,540 cm³","770 cm³","3,080 cm³","154 cm³"],"A","(22/7) × 49 × 10 = 1,540 cm³."),
 q(NA,"Mensuration","Sphere - percentage change","MODERATE","V2-H08","The radius of a sphere is increased by 10%. By what percentage does its volume increase?",["30%","21%","10%","33.1%"],"D","Volume scales with r³: 1.1³ = 1.331, an increase of 33.1%."),
 q(NA,"Probability and Statistics","Cards","MODERATE","C-Q53","The probability of drawing a red king from a standard 52-card deck is:",["1/13","1/52","1/26","1/4"],"C","There are two red kings: 2/52 = 1/26."),
 q(NA,"Probability and Statistics","Dice","MODERATE","V2-H09","Two fair dice are thrown together. The probability that the sum is 8 is:",["5/36","1/6","1/9","7/36"],"A","Favourable outcomes (2,6), (3,5), (4,4), (5,3), (6,2): 5 of 36."),
 q(NA,"Mixture and Alligation","Mixtures","MODERATE","C-Q19","A 40-litre mixture has milk and water in the ratio 3 : 1. How much water must be added to make the ratio 3 : 2?",["5 L","10 L","15 L","20 L"],"B","Milk 30 L, water 10 L. For 3 : 2 water must be 20 L, so add 10 L."),
]

# ---------------------------------------------------------------- Section 4: Reasoning and Military Aptitude (25)
NEW = "Written for DP Full Mock 01 (the bank has no reasoning section)"
rm = [
 q(RM,"Non-Verbal Reasoning","Figure series","MODERATE","V2-F01","Study the problem figures and choose the answer figure that comes next in the series.",FIGURE_OPTS,"C","The arrow turns 45° clockwise each step (up, up-right, right, so down-right next). The dot moves one corner clockwise (top-left, top-right, bottom-right, so bottom-left next). Only (C) has both.",figures=FIG["series"]),
 q(RM,"Verbal Reasoning","Number analogy","EASY","R02","4 : 64 :: 7 : ?",["343","49","21","147"],"A","64 = 4³, so the answer is 7³ = 343."),
 q(RM,"Non-Verbal Reasoning","Mirror image","MODERATE","V2-F02","Choose the correct mirror image of the given figure when the mirror is placed along the line M.",FIGURE_OPTS,"D","A vertical mirror swaps left and right but keeps top and bottom. The flag must point left with the pole on the right, and the circle stays at the bottom. (A) is the original, (B) is the water image and (C) is a half-turn.",figures=FIG["mirror"]),
 q(RM,"Verbal Reasoning","Classification","EASY","R04","Find the odd one out:",["Rafale","Tejas","Chinook","Su-30MKI"],"C","Chinook is a transport helicopter; the others are fighter aircraft."),
 q(RM,"Verbal Reasoning","Classification","MODERATE","R05","Find the odd one out:",["121","169","289","225"],"D","121, 169 and 289 are squares of primes (11, 13, 17); 225 is the square of 15, which is not prime."),
 q(RM,"Verbal Reasoning","Classification","MODERATE","R06","Find the odd one out:",["UWZ","BDF","KMO","PRT"],"A","BDF, KMO and PRT each skip one letter (+2, +2); in UWZ the second step is +3."),
 q(RM,"Verbal Reasoning","Coding-decoding","EASY","R07","If AIR is coded as BJS, how is FORCE coded?",["GPSEF","HQTEG","GQSDF","GPSDF"],"D","Each letter is shifted forward by one: F→G, O→P, R→S, C→D, E→F."),
 q(RM,"Non-Verbal Reasoning","Water image","MODERATE","V2-F03","Choose the correct water image of the given figure (the water line is below the figure).",FIGURE_OPTS,"A","A water image flips top and bottom but keeps left and right. The arrowhead stays on the right but the staircase now descends towards it. (B) is the mirror image, (C) a half-turn and (D) a quarter-turn.",figures=FIG["water"]),
 q(RM,"Verbal Reasoning","Coding-decoding","MODERATE","R09","If CAT = 24 because C = 3, A = 1 and T = 20, what is DOG?",["24","27","28","26"],"D","D (4) + O (15) + G (7) = 26."),
 q(RM,"Patterns and Sequences","Number series","EASY","R10","Find the next term: 3, 7, 15, 31, 63, ?",["127","125","126","128"],"A","Each term is double the previous plus 1: 63 × 2 + 1 = 127."),
 q(RM,"Non-Verbal Reasoning","Paper folding and punching","HARD","V2-F04","A square sheet is folded and punched as shown in figures (1) to (3). How will it look when unfolded?",FIGURE_OPTS,"D","Unfold the second fold first: the hole is reflected about the horizontal centre line, giving two holes. Unfolding the first fold reflects both about the vertical centre line, giving four holes placed symmetrically, one in each quarter.",figures=FIG["fold"]),
 q(RM,"Patterns and Sequences","Letter series","MODERATE","R12","Find the next letter: B, E, I, N, ?",["S","U","T","R"],"C","Gaps are +3, +4, +5, +6: N (14) + 6 = T (20)."),
 q(RM,"Verbal Reasoning","Directions","MODERATE","R13","A man walks 5 km north, turns right and walks 3 km, then turns right again and walks 9 km. How far and in which direction is he from his starting point?",["5 km North-East","7 km South","4 km South-West","5 km South-East"],"D","He ends 3 km east and 4 km south of the start: √(3² + 4²) = 5 km, to the south-east."),
 q(RM,"Verbal Reasoning","Directions","MODERATE","R14","A cadet facing North turns 90° clockwise, then 180° anticlockwise, then 45° clockwise. Which direction does he now face?",["North-West","North-East","South-West","South-East"],"A","North → East (90° clockwise) → West (180° anticlockwise) → North-West (45° clockwise)."),
 q(RM,"Verbal Reasoning","Blood relations","MODERATE","R15","Pointing to a boy, Ravi (a man) says, 'He is the son of my father's only daughter.' How is the boy related to Ravi?",["Son","Brother","Cousin","Nephew"],"D","Ravi's father's only daughter is Ravi's sister; her son is Ravi's nephew."),
 q(RM,"Verbal Reasoning","Blood relations","EASY","R16","A is B's sister. C is B's mother. D is C's father. How is A related to D?",["Daughter","Niece","Granddaughter","Grandmother"],"C","A is C's daughter, and C is D's daughter, so A is D's granddaughter."),
 q(RM,"Verbal Reasoning","Syllogism","MODERATE","R17","Statements: All pilots are officers. Some officers are engineers. Conclusions: I. Some pilots are engineers. II. Some engineers are officers.",["Only II follows","Only I follows","Both I and II follow","Neither follows"],"A","II is the converse of 'some officers are engineers'. I does not follow: the officers who are engineers need not be pilots."),
 q(RM,"Verbal Reasoning","Syllogism","HARD","R18","Statements: All aircraft are machines. No machine is alive. Conclusions: I. No aircraft is alive. II. Some machines are aircraft.",["Only I follows","Only II follows","Neither follows","Both I and II follow"],"D","I follows because aircraft fall inside machines, which exclude living things. II follows by converting 'All aircraft are machines'."),
 q(RM,"Non-Verbal Reasoning","Counting figures","MODERATE","V2-F05","How many triangles are there in the given figure?",["5","6","7","8"],"B","Every triangle uses the top vertex. Pairs of points joined by the cross-line give three (left small, right small, both halves together) and pairs on the base give three more (left half, right half, whole). Total 6.",figures=FIG["triangles"]),
 q(RM,"Verbal Reasoning","Calendar","MODERATE","R20","If 1 January 2025 was a Wednesday, what day of the week was 1 January 2026?",["Wednesday","Friday","Tuesday","Thursday"],"D","2025 is not a leap year, so 365 days = 52 weeks + 1 day: Wednesday + 1 = Thursday."),
 q(RM,"Verbal Reasoning","Seating arrangement","MODERATE","R21","Five cadets P, Q, R, S and T sit in a row facing north. R is in the middle. P is at the left end. Q is immediately to the right of P. T is not at either end. Who is at the right end?",["S","Q","T","R"],"A","Order from left: P, Q, R, then T (not at an end) and S. S is at the right end."),
 q(RM,"Spatial Reasoning","Clock mirror image","MODERATE","R22","A clock shows 3:40. What time will its mirror image show?",["9:20","7:20","8:20","8:40"],"C","Mirror time = 11:60 − 3:40 = 8:20."),
 q(RM,"Patterns and Sequences","Missing number","MODERATE","R23","Find the missing number. Row 1: 3, 4, 12. Row 2: 5, 6, 30. Row 3: 7, 2, ?",["9","12","16","14"],"D","The third number in each row is the product of the first two: 7 × 2 = 14."),
 q(RM,"Non-Verbal Reasoning","Odd figure out","MODERATE","V2-F06","Three of the four figures follow the same rule. Choose the figure that does not.",FIGURE_OPTS,"D","In (A), (B) and (C) the number of dots is one less than the number of sides (square 3, triangle 2, pentagon 4). The hexagon in (D) should have 5 dots but has 4.",figures=FIG["odd"]),
 q(RM,"Verbal Reasoning","Dictionary order","HARD","R25","Arrange in dictionary order: 1. Sortie 2. Sorting 3. Sorrow 4. Sort",["4, 3, 1, 2","4, 1, 2, 3","3, 4, 2, 1","3, 4, 1, 2"],"D","Sorrow (sorr- before sort-), Sort (a prefix of the others), Sortie (e before n), Sorting."),
]


def norm(s):
    return re.sub(r"\s+", " ", s.strip().lower())


def main():
    items = ga + en + na + rm
    assert [len(ga), len(en), len(na), len(rm)] == [25, 30, 20, 25], "section counts"
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    for old in ASSET_DIR.glob("*.svg"):
        old.unlink()
    assets = {}
    for name, fig in FIGS.items():
        data = fig["svg"].encode()
        (ASSET_DIR / f"{name}.svg").write_bytes(data)
        m = re.search(r'viewBox="0 0 (\d+) (\d+)"', fig["svg"])
        assets[name] = {"asset_id": name, "file": f"assets/fm01/{name}.svg", "mime_type": "image/svg+xml",
                        "sha256": hashlib.sha256(data).hexdigest(), "width": int(m[1]), "height": int(m[2]),
                        "alt": fig["alt"], "license": "DP original artwork", "review_status": "REVIEW_REQUIRED"}
    questions, seen = [], set()
    for i, it in enumerate(items, 1):
        opts = it["options"]
        assert len(opts) == 4 and len({norm(o) for o in opts}) == 4, f"options Q{i}"
        assert it["correct_option"] in "ABCD"
        if opts == FIGURE_OPTS:
            assert it["figures"], f"figure options without figures Q{i}"
        fig_hash = "|".join(assets[f]["sha256"] for f in it["figures"])
        fp_src = norm((it["passage"] or "") + "|" + it["text"] + "|" + "|".join(opts)) + "|" + fig_hash
        fp = hashlib.sha256(fp_src.encode()).hexdigest()
        assert fp not in seen, f"duplicate Q{i}"
        seen.add(fp)
        ref = it["ref"]
        stem = {"text": it["text"]}
        if it["passage"]:
            stem.update(passage_id="FM01-P1" if it["passage"] == P1 else "FM01-CLOZE1", passage=it["passage"])
        if it["figures"]:
            stem["assets"] = [{"asset_id": f, "placement": "STEM", "alt": assets[f]["alt"]} for f in it["figures"]]
        if ref.startswith(("A-", "B-", "C-")):
            source = f"{BANK}, Section {ref}"
        elif ref.startswith("R"):
            source = NEW
        else:
            source = f"Written for DP Full Mock 01 v2 ({ref})"
        row = {
            "external_id": f"AFCAT-FM01-CAND-V1-{i:03d}",
            "position": i,
            "pool_type": "FULL_MOCK",
            "section": it["section"],
            "topic": it["topic"],
            "subtopic": it["subtopic"],
            "stem": stem,
            "options": [{"key": k, "text": t} for k, t in zip("ABCD", opts)],
            "correct_option": it["correct_option"],
            "explanation": {"text": it["explanation"]},
            "difficulty": it["difficulty"],
            "source_kind": "ORIGINAL",
            "source_reference": source,
            "source_rights_status": "REVIEW_REQUIRED",
            "fingerprint_sha256": fp,
            "content_version": 1,
            "editorial_status": "DRAFT",
            "requires_independent_review": True,
        }
        if it["evidence"]:
            row["source_evidence"] = it["evidence"]
            row["as_of_date"] = CA_ASOF
            row["recheck_on"] = "2027-01-31"
        questions.append(row)

    sec = collections.Counter(x["section"] for x in questions)
    keys = collections.Counter(x["correct_option"] for x in questions)
    diff = collections.Counter(x["difficulty"] for x in questions)
    run = best = 1
    for a, b in zip(questions, questions[1:]):
        run = run + 1 if a["correct_option"] == b["correct_option"] else 1
        best = max(best, run)
    pkg = {
        "package": "AFCAT_FM01_V2_DRAFT",
        "status": "DRAFT_DO_NOT_PUBLISH",
        "built_by": "scripts/build-afcat-mock01.py",
        "source": BANK,
        "notes": [
            "v2 (2026-11-04): replaced the 10 easiest items with harder ones, added a 4-blank cloze passage, replaced dated current affairs with four verified 2026 items, and added six original figure-based reasoning items.",
            "All items are DP-original practice questions written to the AFCAT pattern. None is an official or memory-reconstructed AFCAT paper question.",
            "Section order follows the AFCAT paper: GA, English, Numerical, Reasoning. 25/30/20/25 is DP's split, not an official IAF allocation.",
            "Figures live in assets/fm01 as SVG with alt text and hashes; the learner API does not serve question images yet.",
            "Current-affairs items carry source_evidence and a recheck_on date.",
            "Difficulty labels are author estimates, not calibrated.",
        ],
        "exam_config": {"question_count": 100, "duration_seconds": 7200, "correct_marks": 3,
                        "incorrect_marks": -1, "unanswered_marks": 0, "max_marks": 300, "language": "en"},
        "summary": {"sections": dict(sec), "answer_keys": dict(sorted(keys.items())),
                    "difficulty": dict(sorted(diff.items())), "longest_same_key_run": best,
                    "figure_items": sum(1 for x in questions if x["stem"].get("assets"))},
        "assets": list(assets.values()),
        "questions": questions,
    }
    OUT.write_text(json.dumps(pkg, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(pkg["summary"]), file=sys.stderr)
    print(OUT)


if __name__ == "__main__":
    main()
