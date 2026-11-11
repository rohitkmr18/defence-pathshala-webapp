"""Validate Package A v0.2 without network access; write only ignored local data."""
import argparse
import csv
import hashlib
import io
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PRIVATE = ROOT / ".capf-private"
MAPPING_VERSION = "package-a-0.2-to-b1-v1"
FILES = [
    "PACKAGE_A_README.md", "CODEX_HANDOFF_PACKAGE_B.md",
    "capf_q1_q2_corpus_2020_2026.csv", "question_demand_cards_draft.json",
    "taxonomy_ontology_v0_2.json", "DATA_CONTRACTS_V0_2.json", "QA_MANIFEST.json",
    "rubric_anchor_handbook_v0_2.json", "ACADEMIC_REVIEW_GUIDE.md",
    "source_register.json", "VERIFICATION_LOG.md", "review_queue.md", "rubric_v0_1.json",
]
DEMAND_MAP = {"analysis": "analyse", "for_against": "dialectical_for_against",
              "opportunities_challenges": "opportunity_challenge", "solution": "solution_design"}

def digest(value):
    return hashlib.sha256(value).hexdigest()

def encode(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))

def prepare(folder, research):
    files = {}
    for name in FILES:
        data = (folder / name).read_bytes()
        files[name] = {"sha256": digest(data), "raw": data.decode("utf-8-sig")}
    report = research.read_bytes()
    files["deep-research-report.md"] = {"sha256": digest(report), "raw": report.decode("utf-8-sig")}
    read = lambda name: json.loads(files[name]["raw"])
    contract = read("DATA_CONTRACTS_V0_2.json")
    reader = csv.DictReader(io.StringIO(files["capf_q1_q2_corpus_2020_2026.csv"]["raw"]))
    if reader.fieldnames != contract["corpus_fields"]:
        raise ValueError("CORPUS_FIELDS_MISMATCH")
    rows = list(reader)
    cards = read("question_demand_cards_draft.json")
    taxonomy = read("taxonomy_ontology_v0_2.json")
    sources = read("source_register.json")["papers"]
    rubric = read("rubric_v0_1.json")
    ids = [r["record_id"] for r in rows]
    if len(rows) != 56 or len(set(ids)) != 56 or len(cards) != 56:
        raise ValueError("EXPECTED_56_UNIQUE_RECORDS_AND_CARDS")
    if len({c["record_id"] for c in cards}) != 56 or set(ids) != {c["record_id"] for c in cards}:
        raise ValueError("CARD_IDENTITIES_MISMATCH")
    if sorted(s["year"] for s in sources) != list(range(2020, 2027)):
        raise ValueError("SOURCE_YEARS_MISMATCH")
    for key in ("q1", "q2"):
        if len(rubric[key]["criteria"]) != 8 or sum(c["max_points"] for c in rubric[key]["criteria"]) != 20:
            raise ValueError("RUBRIC_WEIGHTS_MISMATCH")
    card_by_id = {c["record_id"]: c for c in cards}
    source_by_year = {s["year"]: s for s in sources}
    normalized = []
    for row in rows:
        year = int(row["year"])
        essay = row["section"] == "Q1_ESSAY"
        if year not in source_by_year or row["section"] not in ("Q1_ESSAY", "Q2_ARGUMENT"):
            raise ValueError("YEAR_OR_SECTION_INVALID")
        card = card_by_id[row["record_id"]]
        if card["question_text_research_draft"] != row["prompt"] or not row["prompt"].strip():
            raise ValueError("PROMPT_CARD_MISMATCH")
        if row["publication_status"] != "HOLD_NEEDS_HUMAN_VERIFICATION" or row["pdf_sha256"]:
            raise ValueError("UNEXPECTED_PUBLICATION_OR_VERIFICATION")
        if row["wording_verification"] != "NOT_DIRECTLY_VERIFIED_IN_PACKAGE_A_V0_2":
            raise ValueError("UNEXPECTED_WORDING_STATUS")
        if card["source_confirmation_required"] is not True:
            raise ValueError("CARD_CONFIRMATION_REQUIRED")
        if row["source_url"] != source_by_year[year]["official_pdf_url"]:
            raise ValueError("SOURCE_LINK_MISMATCH")
        if int(row["marks_per_response"]) != 20 or row["primary_domain"] not in taxonomy["domains"]:
            raise ValueError("MARKS_OR_DOMAIN_INVALID")
        demand = DEMAND_MAP.get(row["demand_type"], row["demand_type"])
        if demand not in taxonomy["demand_tags"]:
            raise ValueError("UNMAPPED_DEMAND")
        expected_limit = "about 300 words each" if essay else "Not specified in reviewed papers"
        if row["word_limit"] != expected_limit:
            raise ValueError("WORD_LIMIT_MISMATCH")
        # Missing official directions, language and page coordinates stay null.
        # A reported page is not a verified printed page or zero-based PDF index.
        canonical = {
            "record_id": row["record_id"], "year": year, "section": row["section"],
            "original_label": row["original_label"], "prompt": row["prompt"],
            "marks": 20, "selection_rule": row["selection_rule"],
            "word_limit": 300 if essay else None,
            "word_limit_status": "REPORTED_APPROXIMATE" if essay else "NOT_SPECIFIED_IN_RESEARCH",
            "primary_domain": row["primary_domain"],
            "secondary_tags": [t.strip() for t in row["secondary_tags"].split(";") if t.strip()],
            "demand_tags": [demand], "demand_card": card,
            "source_url": row["source_url"], "source_page_reported": row["source_page_reported"],
            "printed_page": None, "pdf_page_index": None, "pdf_sha256": None,
            "printed_directions": None, "language_rule": None,
        }
        normalized.append({**canonical, "content_hash": digest(encode(canonical).encode()),
                           "raw_record": row})
    for year in range(2020, 2027):
        group = [r for r in rows if int(r["year"]) == year]
        if len(group) != 8 or sum(r["section"] == "Q1_ESSAY" for r in group) != 6:
            raise ValueError("YEAR_SECTION_COUNTS_MISMATCH")
    manifest = {name: f["sha256"] for name, f in files.items()}
    return {
        "mapping_version": MAPPING_VERSION, "manifest_hash": digest(encode(manifest).encode()),
        "files": files, "sources": sources, "taxonomy": taxonomy, "rubric": rubric,
        "anchors": read("rubric_anchor_handbook_v0_2.json"), "records": normalized,
        "validation": {"records": 56, "q1": 42, "q2": 14, "published": 0,
                       "state": "DRAFT", "scoring_enabled": False, "demand_mapping": DEMAND_MAP},
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--package", type=Path, required=True)
    parser.add_argument("--research", type=Path, required=True)
    args = parser.parse_args()
    result = prepare(args.package, args.research)
    PRIVATE.mkdir(exist_ok=True)
    (PRIVATE / "canonical.json").write_text(encode(result), encoding="utf-8")
    print(json.dumps({"manifest_hash": result["manifest_hash"], **result["validation"]}))
