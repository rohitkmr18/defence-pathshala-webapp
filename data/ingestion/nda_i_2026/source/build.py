import json, uuid, importlib, sys, hashlib, re

def norm(s): return re.sub(r'\s+', ' ', s).strip().lower()

def chash(q, o): return hashlib.sha256(json.dumps([norm(q), sorted(map(norm, o))]).encode()).hexdigest()

import qfmt

def run(mods):
    qfmt.QS.clear(); qfmt.PASSAGES.clear(); qfmt.FLAGS.clear()
    for m in mods:
        if m in sys.modules: importlib.reload(sys.modules[m])
        else: importlib.import_module(m)
    return list(qfmt.QS), dict(qfmt.PASSAGES), dict(qfmt.FLAGS)

PAT = {"Single MCQ": "PATTERN.DIRECT", "2-Statement Combination": "PATTERN.STATEMENT.2", "3-Statement Combination": "PATTERN.STATEMENT.3",
       "4-Statement Combination": "PATTERN.STATEMENT.4", "Statement Count": "PATTERN.COUNT", "Ordering/Sequence": "PATTERN.ORDERING",
       "Match the Following": "PATTERN.MATCHING", "Chronology": "PATTERN.CHRONOLOGY", "Linked Item Set": "PATTERN.LINKED_SET"}
MCOMP = {"Algebra": "ALGEBRA", "Matrices and Determinants": "ALGEBRA", "Differential Calculus": "ALGEBRA", "Integral Calculus and Differential Equations": "ALGEBRA",
         "Analytical Geometry": "GEOMETRY", "Vector Algebra": "GEOMETRY", "Probability": "STATISTICS", "Statistics": "STATISTICS", "Trigonometry": "TRIGONOMETRY"}
GKCOMP = {121: "HISTORY.CULTURE", 122: "HISTORY.CHRONOLOGY", 123: "HISTORY.ECONOMIC", 124: "HISTORY.MOVEMENTS", 125: "HISTORY.ECONOMIC", 126: "HISTORY.MOVEMENTS",
          127: "HISTORY.ECONOMIC", 128: "HISTORY.CULTURE", 129: "HISTORY.CULTURE", 130: "HISTORY.CULTURE", 131: "ECONOMY.DEVELOPMENT", 132: "POLITY.INSTITUTIONS",
          133: "POLITY.INSTITUTIONS", 134: "POLITY.CONSTITUTION", 135: "ECONOMY.DEVELOPMENT", 136: "POLITY.INSTITUTIONS", 137: "POLITY.INSTITUTIONS",
          138: "IR.INSTITUTIONS", 139: "POLITY.JUDICIARY", 140: "POLITY.ELECTORAL", 141: "IR.BILATERAL", 142: "POLITY.GOVERNANCE", 143: "ECONOMY.DEVELOPMENT",
          144: "CA.CULTURE", 145: "ECONOMY.DEVELOPMENT", 146: "CA.INSTITUTIONS", 147: "CA.EVENTS", 148: "GEOGRAPHY.HUMAN", 149: "ENVIRONMENT.CLIMATE",
          150: "SECURITY.OPERATIONS", 101: "ECONOMY.AGRICULTURE", 102: "GEOGRAPHY.RESOURCES", 115: "GEOGRAPHY.RESOURCES", 119: "SNT.SPACE"}
CURRENT = {118, 141, 144, 146, 147, 148, 149, 150}

def gk_comp(q):
    n, s, t = q["q_num"], q["subject"], q["topic"]
    if n in GKCOMP: return "COMP." + GKCOMP[n]
    if s == "Science & Technology": return {"Physics": "COMP.SNT.PHYSICS", "Chemistry": "COMP.SNT.CHEMISTRY", "Biology/Life Sciences": "COMP.SNT.BIOLOGY"}[t]
    if s == "Geography": return {"Physical Geography": "COMP.GEOGRAPHY.PHYSICAL", "Indian Geography": "COMP.GEOGRAPHY.INDIA"}.get(t, "COMP.GEOGRAPHY.HUMAN")
    raise ValueError(n)

def gk_src(q):
    s = q["subject"]
    if q["q_num"] in CURRENT: return "SRC.PIB"
    return {"Science & Technology": "SRC.NCERT.SCIENCE", "Geography": "SRC.NCERT.GEOGRAPHY", "History": "SRC.NCERT.HISTORY", "Polity": "SRC.LAXMIKANTH",
            "Economy": "SRC.NCERT.ECONOMICS"}.get(s, "SRC.OTHER_REFERENCE")

def cat(d): return "Easy" if d <= 20 else "Moderate" if d <= 50 else "Hard"

def build(QS, PASS, code, paper, paper_id, section_of, qid_of, dataset_of, source_of, comp_of, src_of, cc_of, temporal_of):
    pas_ids, passages, questions, intel = {}, [], [], []
    for k, p in PASS.items():
        pid = str(uuid.uuid5(uuid.NAMESPACE_URL, f"{code}:{k}"))
        pas_ids[k] = pid
        passages.append(dict(id=pid, paper_id=paper_id, title=p["title"], body=p["body"], source=source_of(None)))
    for q in sorted(QS, key=lambda r: r["q_num"]):
        n = q["q_num"]; qid = qid_of(n); d = float(q["diff"])
        stem = q["question"]
        if q["passage"]:
            body = PASS[q["passage"]]["body"]
            stem = body + ("\n\n" if "\n" in stem or "|" in body else " ") + stem
        fmt = "linked_set" if q["passage"] else "single_mcq"
        questions.append(dict(question_id=qid, exam="NDA", year=2026, cycle="I", paper=paper, q_num=n, subject=q["subject"], topic=q["topic"],
            subtopic=q["subtopic"], theme=q["theme"] or None, question=stem, opt_a=q["opts"][0], opt_b=q["opts"][1], opt_c=q["opts"][2], opt_d=q["opts"][3],
            q_type="Analytical" if paper == "Mathematics" else ("Language" if n <= 50 else "Knowledge"), q_pattern=q["pattern"],
            llm_opt=q["key"], official_opt=None, final_opt=q["key"], explanation=q["explanation"], source=source_of(n), is_negative=False,
            tags=[f"format:{fmt}", "key:dp_solved"], verified_status="Draft", difficulty_score=d, difficulty_category=cat(d),
            dataset_version=dataset_of(n), source_version="scan-transcription-v1", content_status="SOURCE_MATCHED", paper_id=paper_id,
            section_id=section_of(n), passage_id=pas_ids.get(q["passage"]), media=None, question_format=fmt, content_hash=chash(stem, q["opts"])))
        intel.append(dict(question_id=qid, taxonomy_subject=q["subject"], taxonomy_topic=q["topic"], taxonomy_subtopic=q["subtopic"],
            taxonomy_concept=q["theme"] or q["subtopic"], competency_id=comp_of(q), pattern_id=PAT[q["pattern"]], source_id=src_of(q),
            temporal_context_id=temporal_of(q), expected_knowledge=80, source_accessibility=70 if temporal_of(q) != "TEMP.STATIC" else 90,
            preparation_accessibility=100, cognitive_complexity=cc_of(d), esac_score=100 - d, difficulty_score=d, difficulty_category=cat(d),
            relation_degree=0, same_concept_degree=0, cross_exam_variant_degree=0, conceptual_variant_degree=0, intelligence_readiness="READY",
            requires_content_review=False, release_eligible=True, production_eligible=True, intelligence_eligible=True, human_review_required=False,
            release_version=dataset_of(n), intelligence_confidence="MODEL_DERIVED", intelligence_verified=False))
    return dict(code=code, passages=passages, questions=questions, intelligence=intel)

mq, mp, mf = run(["m01", "m02", "m03"])
maths = build(mq, mp, "NDA_I_2026_MATHS", "Mathematics", "nda-maths", lambda n: "nda-maths:maths", lambda n: f"NDA_I_2026_MATHS_{n:03d}",
    lambda n: "DP_PYQ_NDA_2026_I_MATHS_v1", lambda n: "NDA I 2026 Mathematics set D (English side)",
    lambda q: "COMP.MATHS." + MCOMP[q["subject"]], lambda q: "SRC.NCERT.MATHEMATICS",
    lambda d: 45 if d <= 20 else 65 if d <= 50 else 85, lambda q: "TEMP.STATIC")
maths["flags"] = {f"NDA_I_2026_MATHS_{k:03d}": v for k, v in mf.items()}
gq, gp, gf = run(["e01", "g01"])
gat = build(gq, gp, "NDA_I_2026_GAT", "General Ability Test", "nda-gat", lambda n: "nda-gat:english" if n <= 50 else "nda-gat:gk",
    lambda n: f"NDA_I_2026_ENG_{n:03d}" if n <= 50 else f"NDA_I_2026_GK_{n:03d}",
    lambda n: "DP_PYQ_NDA_2026_I_GAT_ENG_v1" if n <= 50 else "DP_PYQ_NDA_2026_I_GAT_GK_v1",
    lambda n: "NDA I 2026 General Ability Test set A, " + ("Part A English" if (n or 0) <= 50 else "Part B General Knowledge") + " (NPSS-B-TGA/65A)",
    lambda q: ("COMP.ENGLISH.VOCABULARY" if q["subject"] == "Vocabulary" else "COMP.ENGLISH.GRAMMAR") if q["q_num"] <= 50 else gk_comp(q),
    lambda q: "SRC.OTHER_REFERENCE" if q["q_num"] <= 50 else gk_src(q),
    lambda d: 60, lambda q: "TEMP.CURRENT_DEVELOPMENT" if (q["q_num"] in CURRENT or q["subject"] == "Current Affairs") else "TEMP.STATIC")
for q, i in zip(gat["questions"], gat["intelligence"]):
    if q["q_num"] <= 50: i["cognitive_complexity"] = 65
gat["flags"] = {(f"NDA_I_2026_ENG_{k:03d}" if k <= 50 else f"NDA_I_2026_GK_{k:03d}"): v for k, v in gf.items()}
for name, d in [("maths", maths), ("gat", gat)]:
    json.dump(d, open(f"nda_i_2026_{name}.json", "w"), ensure_ascii=False, indent=1)
    print(name, len(d["questions"]), len(d["passages"]), len(d["intelligence"]), len(d["flags"]),
          {c: sum(q["difficulty_category"] == c for q in d["questions"]) for c in ("Easy", "Moderate", "Hard")})
