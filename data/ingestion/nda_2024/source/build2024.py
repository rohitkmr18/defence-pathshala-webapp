"""Build prod-load JSON for NDA 2024 (cycles I and II), Mathematics and GAT."""
import json, uuid, importlib, sys, hashlib, re
import qfmt


def norm(s): return re.sub(r'\s+', ' ', s).strip().lower()
def chash(q, o): return hashlib.sha256(json.dumps([norm(q), sorted(map(norm, o))]).encode()).hexdigest()
def cat(d): return "Easy" if d <= 20 else "Moderate" if d <= 50 else "Hard"


def run(mods):
    qfmt.QS.clear(); qfmt.PASSAGES.clear(); qfmt.FLAGS.clear(); qfmt.WITHHELD.clear()
    for m in mods:
        if m in sys.modules: importlib.reload(sys.modules[m])
        else: importlib.import_module(m)
    return list(qfmt.QS), dict(qfmt.PASSAGES), dict(qfmt.FLAGS), dict(qfmt.WITHHELD)


PAT = {"Single MCQ": "PATTERN.DIRECT", "2-Statement Combination": "PATTERN.STATEMENT.2", "3-Statement Combination": "PATTERN.STATEMENT.3",
       "4-Statement Combination": "PATTERN.STATEMENT.4", "Statement Count": "PATTERN.COUNT", "Ordering/Sequence": "PATTERN.ORDERING",
       "Match the Following": "PATTERN.MATCHING", "Chronology": "PATTERN.CHRONOLOGY", "Linked Item Set": "PATTERN.LINKED_SET",
       "Assertion-Reason": "PATTERN.ASSERTION_REASON"}
MCOMP = {"Algebra": "ALGEBRA", "Matrices and Determinants": "ALGEBRA", "Differential Calculus": "ALGEBRA", "Integral Calculus and Differential Equations": "ALGEBRA",
         "Analytical Geometry": "GEOMETRY", "Vector Algebra": "GEOMETRY", "Probability": "STATISTICS", "Statistics": "STATISTICS", "Trigonometry": "TRIGONOMETRY"}


def eng_comp(q):
    return {"Vocabulary": "COMP.ENGLISH.VOCABULARY", "Sentence Organisation": "COMP.ENGLISH.SENTENCE_ORGANISATION",
            "Reading Comprehension": "COMP.ENGLISH.COMPREHENSION"}.get(q["subject"], "COMP.ENGLISH.GRAMMAR")


def gk_comp(q):
    s, t, st = q["subject"], q["topic"], q["subtopic"]
    if q["pattern"] == "Chronology" and s == "History": return "COMP.HISTORY.CHRONOLOGY"
    if s == "Science & Technology":
        return {"Physics": "COMP.SNT.PHYSICS", "Chemistry": "COMP.SNT.CHEMISTRY", "Biology/Life Sciences": "COMP.SNT.BIOLOGY",
                "Space Technology & Astronomy": "COMP.SNT.SPACE"}[t]
    if s == "Geography":
        if t == "Physical Geography": return "COMP.GEOGRAPHY.PHYSICAL"
        if t == "Indian Geography": return "COMP.GEOGRAPHY.RESOURCES" if st == "Resources & Minerals" else "COMP.GEOGRAPHY.INDIA"
        if t == "Economic Geography": return "COMP.GEOGRAPHY.RESOURCES"
        return "COMP.GEOGRAPHY.HUMAN"
    if s == "History":
        if t == "Modern History":
            return "COMP.HISTORY.ECONOMIC" if st == "Colonial Economy" else \
                   "COMP.HISTORY.INSTITUTIONS" if st == "British Administration & Constitutional Development" else "COMP.HISTORY.MOVEMENTS"
        if t == "World History":
            return "COMP.HISTORY.ECONOMIC" if st in ("Industrial Revolution", "Economic & Monetary History") else "COMP.HISTORY.MOVEMENTS"
        if st in ("Mahajanapadas & Magadha", "Regional Kingdoms & States", "South Indian Kingdoms"): return "COMP.HISTORY.INSTITUTIONS"
        if st == "Society, Economy & Technology": return "COMP.HISTORY.ECONOMIC"
        return "COMP.HISTORY.CULTURE"
    if s == "Polity":
        return {"Elections": "COMP.POLITY.ELECTORAL", "Constitutional Framework": "COMP.POLITY.CONSTITUTION", "Rights & Liberties": "COMP.POLITY.CONSTITUTION",
                "Legislature": "COMP.POLITY.INSTITUTIONS", "Civic Institutions": "COMP.POLITY.INSTITUTIONS", "Judiciary": "COMP.POLITY.JUDICIARY",
                "Federalism": "COMP.POLITY.FEDERALISM"}.get(t, "COMP.POLITY.GOVERNANCE")
    if s == "Economy": return "COMP.ECONOMY.AGRICULTURE" if t == "Agriculture & Rural Economy" else "COMP.ECONOMY.DEVELOPMENT"
    if s == "Environment":
        return {"Environmental Pollution": "COMP.ENVIRONMENT.POLLUTION", "Climate Change": "COMP.ENVIRONMENT.CLIMATE",
                "Ecology": "COMP.ENVIRONMENT.ECOLOGY"}.get(t, "COMP.ENVIRONMENT.BIODIVERSITY")
    if s == "International Relations": return "COMP.IR.INSTITUTIONS" if t in ("International Organisations", "Regional Organisations") else "COMP.IR.GLOBAL"
    if s == "Current Affairs":
        return {"Culture & Heritage": "COMP.CA.CULTURE", "Awards, Appointments & Personalities": "COMP.CA.EVENTS", "Sports": "COMP.CA.EVENTS",
                "International Relations": "COMP.CA.INSTITUTIONS", "Economy & Finance": "COMP.CA.POLICY", "Polity & Governance": "COMP.CA.POLICY",
                "Science & Technology": "COMP.CA.SCIENCE", "Social Sector & Human Development": "COMP.CA.POLICY", "Defence & Security": "COMP.SECURITY.OPERATIONS",
                "Environment & Ecology": "COMP.ENVIRONMENT.BIODIVERSITY"}[t]
    raise ValueError(q["q_num"], s)


def gk_src(q):
    if q["subject"] == "Current Affairs": return "SRC.PIB"
    return {"Science & Technology": "SRC.NCERT.SCIENCE", "Geography": "SRC.NCERT.GEOGRAPHY", "History": "SRC.NCERT.HISTORY", "Polity": "SRC.LAXMIKANTH",
            "Economy": "SRC.NCERT.ECONOMICS"}.get(q["subject"], "SRC.OTHER_REFERENCE")


def build(QS, PASS, WH, *, year, cycle, code, paper, paper_id, section_of, qid_of, dataset_of, source_of, comp_of, src_of, cc_of, temporal_of):
    pas_ids, passages, questions, intel = {}, [], [], []
    for k, p in PASS.items():
        pid = str(uuid.uuid5(uuid.NAMESPACE_URL, f"{code}:{k}"))
        pas_ids[k] = pid
        passages.append(dict(id=pid, paper_id=paper_id, title=p["title"], body=p["body"], source=source_of(None)))
    for q in sorted(QS, key=lambda r: r["q_num"]):
        n = q["q_num"]; qid = qid_of(n); d = float(q["diff"]); wh = n in WH
        stem = q["question"]
        if q["passage"]:
            body = PASS[q["passage"]]["body"]
            stem = body + ("\n\n" if "\n" in stem or "|" in body or "$$" in body else " ") + stem
        fmt = "linked_set" if q["passage"] else "single_mcq"
        fig = "![" in stem
        tags = [f"format:{fmt}", "key:dp_solved"] + (["review:source_defect_candidate"] if wh else [])
        questions.append(dict(question_id=qid, exam="NDA", year=year, cycle=cycle, paper=paper, q_num=n, subject=q["subject"], topic=q["topic"],
            subtopic=q["subtopic"], theme=q["theme"] or None, question=stem, opt_a=q["opts"][0], opt_b=q["opts"][1], opt_c=q["opts"][2], opt_d=q["opts"][3],
            q_type="Analytical" if paper == "Mathematics" else ("Language" if n <= 50 else "Knowledge"), q_pattern=q["pattern"],
            llm_opt=q["key"], official_opt=None, final_opt=q["key"], explanation=q["explanation"], source=source_of(n), is_negative=False,
            tags=tags, verified_status="Draft", difficulty_score=d, difficulty_category=cat(d), is_active=not wh and not fig,
            dataset_version=dataset_of(n), source_version="scan-transcription-v1", content_status="WITHHELD" if wh else "SOURCE_MATCHED",
            paper_id=paper_id, section_id=section_of(n), passage_id=pas_ids.get(q["passage"]), media=None, question_format=fmt,
            content_hash=chash(stem, q["opts"])))
        t = temporal_of(q)
        intel.append(dict(question_id=qid, taxonomy_subject=q["subject"], taxonomy_topic=q["topic"], taxonomy_subtopic=q["subtopic"],
            taxonomy_concept=q["theme"] or q["subtopic"], competency_id=comp_of(q), pattern_id=PAT[q["pattern"]], source_id=src_of(q),
            temporal_context_id=t, expected_knowledge=80, source_accessibility=70 if t != "TEMP.STATIC" else 90,
            preparation_accessibility=100, cognitive_complexity=cc_of(q, d), esac_score=100 - d, difficulty_score=d, difficulty_category=cat(d),
            intelligence_readiness="READY", requires_content_review=wh, release_eligible=not wh, production_eligible=not wh, intelligence_eligible=True,
            human_review_required=wh, release_version=dataset_of(n), intelligence_confidence="MODEL_DERIVED", intelligence_verified=False))
    figs = [r["question_id"] for r in questions if "![" in r["question"] and r["content_status"] != "WITHHELD"]
    return dict(code=code, passages=passages, questions=questions, intelligence=intel, figure_qids=figs)


SETS = {"II": dict(m=["iim01", "iim02"], g=["iie01", "iig01"], mset="set A (SURN-B-MTH/81A)", gset="set A (SURN-A-GAT)"),
        "I": dict(m=["im01", "im02"], g=["ie01", "ig01"], mset="set A (RRAN-B-MTH)", gset="set A (RRAN-A-GAT)")}
OUT = {}
for cy, cfg in SETS.items():
    pre = f"NDA_{cy}_2024"
    mq, mp, mf, mw = run(cfg["m"])
    maths = build(mq, mp, mw, year=2024, cycle=cy, code=f"{pre}_MATHS", paper="Mathematics", paper_id="nda-maths", section_of=lambda n: "nda-maths:maths",
        qid_of=lambda n, pre=pre: f"{pre}_MATHS_{n:03d}", dataset_of=lambda n, cy=cy: f"DP_PYQ_NDA_2024_{cy}_MATHS_v1",
        source_of=lambda n, cy=cy, s=cfg["mset"]: f"NDA {cy} 2024 Mathematics {s} (English side)",
        comp_of=lambda q: "COMP.MATHS." + MCOMP[q["subject"]], src_of=lambda q: "SRC.NCERT.MATHEMATICS",
        cc_of=lambda q, d: 45 if d <= 20 else 65 if d <= 50 else 85, temporal_of=lambda q: "TEMP.STATIC")
    maths["flags"] = {f"{pre}_MATHS_{k:03d}": v for k, v in mf.items()}
    maths["withheld"] = {f"{pre}_MATHS_{k:03d}": v for k, v in mw.items()}
    gq, gp, gf, gw = run(cfg["g"])
    qidg = lambda n, pre=pre: f"{pre}_ENG_{n:03d}" if n <= 50 else f"{pre}_GK_{n:03d}"
    gat = build(gq, gp, gw, year=2024, cycle=cy, code=f"{pre}_GAT", paper="General Ability Test", paper_id="nda-gat",
        section_of=lambda n: "nda-gat:english" if n <= 50 else "nda-gat:gk", qid_of=qidg,
        dataset_of=lambda n, cy=cy: f"DP_PYQ_NDA_2024_{cy}_GAT_ENG_v1" if n <= 50 else f"DP_PYQ_NDA_2024_{cy}_GAT_GK_v1",
        source_of=lambda n, cy=cy, s=cfg["gset"]: f"NDA {cy} 2024 General Ability Test {s}, " + ("Part A English" if (n or 0) <= 50 else "Part B General Knowledge"),
        comp_of=lambda q: eng_comp(q) if q["q_num"] <= 50 else gk_comp(q),
        src_of=lambda q: "SRC.OTHER_REFERENCE" if q["q_num"] <= 50 else gk_src(q),
        cc_of=lambda q, d: 65 if q["q_num"] <= 50 else 60,
        temporal_of=lambda q: "TEMP.CURRENT_DEVELOPMENT" if q["subject"] == "Current Affairs" else "TEMP.STATIC")
    gat["flags"] = {qidg(k): v for k, v in gf.items()}
    gat["withheld"] = {qidg(k): v for k, v in gw.items()}
    for name, d in (("maths", maths), ("gat", gat)):
        fn = f"nda_{cy.lower()}_2024_{name}.json"
        json.dump(d, open(fn, "w"), ensure_ascii=False, indent=1)
        print(fn, len(d["questions"]), "passages", len(d["passages"]), "flags", len(d["flags"]), "withheld", list(d["withheld"]), "figs", d["figure_qids"],
              {c: sum(q["difficulty_category"] == c for q in d["questions"]) for c in ("Easy", "Moderate", "Hard")})
