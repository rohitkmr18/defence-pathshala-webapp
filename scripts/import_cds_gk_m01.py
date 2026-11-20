"""Audit CDS GK Mock 01 and rehearse or import an approved draft on staging."""
import argparse
from collections import Counter
import hashlib
import io
import json
import os
from pathlib import Path
import re
import unicodedata
from urllib.request import HTTPRedirectHandler, Request, build_opener
from urllib.error import URLError
from zipfile import ZipFile

from openpyxl import load_workbook

PROJECT = "pxfstrzceyxnweeaydvz"
URL = f"https://api.supabase.com/v1/projects/{PROJECT}/database/query"
CODE = "CDS-GK-M01-V1"
HEADER = (
    "Q#", "Subject", "Topic", "Sub-topic", "Pattern", "Difficulty (author est.)",
    "Question", "Option A", "Option B", "Option C", "Option D", "Answer",
    "Explanation (30-40 words)", "Words", "Derivation", "Parent PYQ id(s)",
    "Source / basis", "Fact-check status", "Confidence (author)", "Batch ID",
    "Blind-solve result", "Reviewer notes", "Prev Q# (pre-shuffle)",
)
BLUEPRINT = {
    "Science & Tech": 35, "History": 22, "Geography": 18, "Polity": 15,
    "Economy": 13, "Current Affairs": 9, "Environment": 4,
    "International Relations": 2, "Security": 2,
}
PATTERNS = {
    "Single MCQ", "Two-statement", "Three-statement", "Four-statement",
    "Match", "Ordering", "Statement count",
}
GATES = {
    "blind_solve", "fact_check", "parent_provenance", "current_affairs",
    "duplicates", "blueprint", "founder_approval",
}
DIFFICULTIES = {"Easy", "Moderate", "Hard"}
PARENT = re.compile(r"CDS_(?:I|II)_\d{4}_GK_\d{3}")


def require(condition, message):
    if not condition:
        raise ValueError(message)


def nonempty(value):
    return isinstance(value, str) and bool(value.strip()) and "\0" not in value


def normalized(value):
    return " ".join(unicodedata.normalize("NFKC", value).casefold().split())


def digest(value):
    return hashlib.sha256(value).hexdigest()


def json_bytes(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True).encode("utf-8")


def table(workbook, name, header, count):
    require(name in workbook.sheetnames, f"Missing worksheet {name}")
    sheet = workbook[name]
    require(sheet.sheet_state == "visible", f"Hidden worksheet {name}")
    require(sheet.max_row == count + 1 and sheet.max_column == len(header),
            f"Unexpected dimensions for {name}")
    rows = list(sheet.values)
    require(rows[0] == header, f"Unexpected headers in {name}")
    return rows[1:]


def audit(raw):
    require(len(raw) <= 2_000_000, "Workbook file is too large")
    with ZipFile(io.BytesIO(raw)) as archive:
        require(sum(entry.file_size for entry in archive.infolist()) <= 8_000_000,
                "Expanded workbook is too large")
        require(not any("externallinks/" in name.lower() or "vbaproject" in name.lower()
                        for name in archive.namelist()), "External links or macros are unsupported")
    workbook = load_workbook(io.BytesIO(raw), data_only=False, keep_links=False)
    for sheet in workbook:
        require(sheet.max_row <= 1000 and sheet.max_column <= 100, "Worksheet is too large")
        require(not any(cell.data_type in {"f", "e"} for row in sheet for cell in row),
                f"Formula or Excel error in {sheet.title}")
    paper = table(workbook, "Final Paper", HEADER, 120)
    key = table(workbook, "Answer key", ("Q#", "Answer", "Subject", "Difficulty",
                "Pattern", "Batch ID"), 120)
    blind = table(workbook, "Blind-solve sheet", ("Q#", "Question", "Option A", "Option B",
                  "Option C", "Option D", "Solver answer (A-D)", "Confidence (1-5)", "Comment"), 120)
    checklist = table(workbook, "Validation checklist", ("Gate", "Rule", "Status"), 9)
    gate_ids = [str(row[0]) for row in checklist]
    require(gate_ids == list("123456789"), "Unexpected checklist gate numbering")

    questions = []
    stems = set()
    previous = set()
    review = {}
    for position, (row, answer_row, blind_row) in enumerate(zip(paper, key, blind), start=1):
        (number, subject, topic, subtopic, pattern, difficulty, stem, *tail) = row
        a, b, c, d, answer, explanation, words, derivation, parent, source, fact, confidence, batch, solve, notes, original = tail
        require(type(number) is int and number == position, f"Unexpected paper order at Q{position}")
        require(type(original) is int and 1 <= original <= 120 and original not in previous,
                f"Invalid pre-shuffle number at Q{number}")
        previous.add(original)
        require(all(map(nonempty, (topic, stem, a, b, c, d, explanation, source, batch))),
                f"Missing or invalid text at Q{number}")
        require(all(value is None or nonempty(value) for value in
                    (subtopic, parent, fact, confidence, solve, notes)), f"Invalid metadata at Q{number}")
        require(subject in BLUEPRINT and pattern in PATTERNS and difficulty in DIFFICULTIES,
                f"Unsupported classification at Q{number}")
        require(answer in ("A", "B", "C", "D"), f"Invalid answer at Q{number}")
        require(words == len(explanation.split()) and 30 <= words <= 40,
                f"Invalid explanation word count at Q{number}")
        options = [a, b, c, d]
        require(len(set(map(normalized, options))) == 4, f"Duplicate options at Q{number}")
        require(normalized(stem) not in stems, f"Duplicate question stem at Q{number}")
        stems.add(normalized(stem))
        require(answer_row == (number, answer, subject, difficulty, pattern, batch),
                f"Answer key tab mismatch at Q{number}")
        require(blind_row[:6] == (number, stem, *options), f"Blind-solve tab mismatch at Q{number}")
        if blind_row[6] != answer or type(blind_row[7]) is not int or not 1 <= blind_row[7] <= 5:
            review.setdefault("blind_solve_incomplete_or_mismatched", []).append(number)
        parents = [part.strip() for part in parent.split(";")] if parent else []
        minimum = {"ORIGINAL": 0, "VARIANT": 1, "FUSION": 2}.get(derivation)
        require(minimum is not None and len(set(parents)) == len(parents) >= minimum
                and all(PARENT.fullmatch(item) for item in parents), f"Invalid parent IDs at Q{number}")
        if derivation == "ORIGINAL" and parents:
            review.setdefault("original_with_parent", []).append(number)
        questions.append({
            "external_id": f"{CODE}-Q{number:03d}", "paper_id": "cds-gk",
            "subject": subject, "topic": topic, "subtopic": subtopic, "q_pattern": pattern,
            "stem": {"text": stem}, "options": options, "correct_option": answer,
            "explanation": {"text": explanation}, "difficulty": difficulty.upper(),
            "derivation_type": derivation, "parent_pyq_ids": parents, "source_reference": source,
            "validation": {"position": position, "previous_number": original, "batch": batch},
            "fingerprint_sha256": digest(json_bytes([normalized(stem), sorted(map(normalized, options))])),
            "content_version": 1, "editorial_status": "APPROVED",
        })
    require(Counter(q["subject"] for q in questions) == BLUEPRINT, "Subject blueprint mismatch")
    pending = [str(number) for number, _, status in checklist
               if str(number) in "1234569" and normalized(str(status)) != "passed"]
    summary = {
        "workbook_sha256": digest(raw), "question_count": len(questions),
        "answer_counts": dict(Counter(q["correct_option"] for q in questions)),
        "difficulty_counts": dict(Counter(q["difficulty"] for q in questions)),
        "pattern_counts": dict(Counter(q["q_pattern"] for q in questions)),
        "derivation_counts": dict(Counter(q["derivation_type"] for q in questions)),
        "pending_checklist_gates": pending, "review": review,
    }
    return questions, summary


def publisher_approval(summary):
    path = Path(__file__).with_name("cds_gk_m01_publisher_approval.json")
    record = json.loads(path.read_text(encoding="utf-8"))
    if (record["workbook_sha256"], record["mock_identifier"], record["question_count"]) == (
        summary["workbook_sha256"], CODE, summary["question_count"]
    ) and record["status"] == "publisher_approved_as_is":
        return record
    return None


def check_approval(summary, approval, questions):
    decision = publisher_approval(summary)
    if decision is None:
        require(not summary["pending_checklist_gates"], "Workbook release checklist is open")
        require("blind_solve_incomplete_or_mismatched" not in summary["review"],
                "Workbook blind-solve evidence is incomplete or mismatched")
    require(isinstance(approval, dict) and approval.get("workbook_sha256") == summary["workbook_sha256"],
            "Approval must match the exact workbook digest")
    evidence = approval.get("gate_evidence")
    required_gates = GATES - {"founder_approval"} if decision else GATES
    require(isinstance(evidence, dict) and evidence.keys() == required_gates
            and all(map(nonempty, evidence.values())) and nonempty(approval.get("reviewer")),
            "Approval requires a named reviewer and evidence for every remaining release gate")
    if decision:
        # Independent records can close gates without changing the approved XLSX bytes.
        # The publisher decision alone supplies no blind-solve or verification evidence.
        answers = approval.get("resolved_blind_solve")
        require(isinstance(answers, list) and len(answers) == len(questions)
                and all(isinstance(entry, dict) and type(entry.get("position")) is int
                        and entry["position"] == position
                        and entry.get("answer") == question["correct_option"]
                        and type(entry.get("confidence")) is int
                        and 1 <= entry["confidence"] <= 5
                        for position, (entry, question) in enumerate(zip(answers, questions), 1)),
                "Independent blind-solve evidence must reconcile all 120 numbered keys")


class NoRedirects(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def stage(query):
    token = os.environ.get("SUPABASE_ACCESS_TOKEN")
    require(nonempty(token), "SUPABASE_ACCESS_TOKEN is required for staging")
    request = Request(URL, data=json_bytes({"query": query}),
                      headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"})
    try:
        with build_opener(NoRedirects()).open(request, timeout=60) as response:
            result = json.load(response)
    except URLError as error:
        raise ValueError(f"Staging query failed ({getattr(error, 'code', 'connection error')})") from None
    require(isinstance(result, list), "Staging returned an unexpected query result")


def sql(questions, rehearsal):
    # Hex encodes every workbook byte before interpolation into a fixed SQL literal.
    payload = json_bytes(questions).hex()
    blueprint = json_bytes(BLUEPRINT).hex()
    body = Path(__file__).with_suffix(".sql").read_text(encoding="utf-8")
    return (body.replace("@QUESTIONS@", payload).replace("@BLUEPRINT@", blueprint)
            .replace("@REHEARSAL@", "true" if rehearsal else "false"))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("workbook", type=Path)
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--rehearse", action="store_true")
    mode.add_argument("--stage-draft", type=Path, metavar="APPROVAL_JSON")
    args = parser.parse_args()
    questions, summary = audit(args.workbook.read_bytes())
    decision = publisher_approval(summary)
    if decision:
        summary["publisher_approval"] = decision
    print(json.dumps(summary, indent=2), flush=True)
    if args.stage_draft:
        check_approval(summary, json.loads(args.stage_draft.read_text(encoding="utf-8")), questions)
        stage(sql(questions, rehearsal=False))
        print(f"{CODE} verified as a draft on staging.")
    elif args.rehearse:
        stage(sql(questions, rehearsal=True))
        print(f"{CODE} verified in a staging transaction and rolled back.")


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError) as error:
        raise SystemExit(str(error)) from None
