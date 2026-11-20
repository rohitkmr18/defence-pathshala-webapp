"""Synthetic workbook coverage for the staging import. The live paper stays private."""
import io
import unittest
from unittest.mock import patch

from openpyxl import Workbook

from import_cds_gk_m01 import (
    BLUEPRINT, GATES, HEADER, URL, NoRedirects, audit, check_approval, publisher_approval, sql, stage,
)


def fixture(edit=lambda workbook: None):
    workbook = Workbook()
    paper = workbook.active
    paper.title = "Final Paper"
    paper.append(HEADER)
    key = workbook.create_sheet("Answer key")
    key.append(("Q#", "Answer", "Subject", "Difficulty", "Pattern", "Batch ID"))
    blind = workbook.create_sheet("Blind-solve sheet")
    blind.append(("Q#", "Question", "Option A", "Option B", "Option C", "Option D",
                  "Solver answer (A-D)", "Confidence (1-5)", "Comment"))
    checklist = workbook.create_sheet("Validation checklist")
    checklist.append(("Gate", "Rule", "Status"))
    for gate in range(1, 10):
        checklist.append((gate, "Synthetic gate", "Passed"))

    # Round-robin fixtures deliberately interleave subjects.
    subjects = [subject for index in range(max(BLUEPRINT.values()))
                for subject, count in BLUEPRINT.items() if index < count]
    options = ("A's value", "2", "3", "4")
    for i, subject in enumerate(subjects, start=1):
        stem = f"Question {i}\n1. First line\n2. Second line: $import$"
        paper.append((i, subject, "Topic", None, "Two-statement", "Easy", stem, *options,
                      "B", " ".join(["word"] * 30), 30, "ORIGINAL", None, "Synthetic",
                      None, None, "SYNTHETIC", None, None, 121 - i))
        key.append((i, "B", subject, "Easy", "Two-statement", "SYNTHETIC"))
        blind.append((i, stem, *options, "B", 4, None))
    edit(workbook)
    output = io.BytesIO()
    workbook.save(output)
    return output.getvalue()


class ImportTests(unittest.TestCase):
    def test_preserves_mixed_order_and_exact_text(self):
        questions, summary = audit(fixture())
        self.assertEqual([q["validation"]["position"] for q in questions], list(range(1, 121)))
        self.assertEqual([q["subject"] for q in questions[:9]], list(BLUEPRINT))
        self.assertEqual(questions[0]["stem"]["text"], "Question 1\n1. First line\n2. Second line: $import$")
        self.assertEqual(questions[0]["options"], ["A's value", "2", "3", "4"])
        self.assertEqual(questions[0]["correct_option"], "B")
        self.assertNotIn("Question 1", sql(questions, True))
        self.assertNotIn("A's value", sql(questions, False))
        self.assertEqual(summary["question_count"], 120)

    def test_structural_errors_fail_closed(self):
        cases = [
            ("Final Paper", "A2", 2, "Unexpected paper order"),
            ("Final Paper", "H2", " 2 ", "Duplicate options"),
            ("Final Paper", "H2", "=1+1", "Formula or Excel error"),
            ("Final Paper", "G3", "Question 1\n1. First line\n2. Second line: $import$", "Duplicate question stem"),
            ("Answer key", "B2", "A", "Answer key tab mismatch"),
            ("Blind-solve sheet", "B2", "Other", "Blind-solve tab mismatch"),
            ("Final Paper", "O2", "FUSION", "Invalid parent IDs"),
            ("Final Paper", "N2", 39, "Invalid explanation word count"),
        ]
        for sheet, cell, value, error in cases:
            with self.subTest(sheet=sheet, cell=cell, value=value), self.assertRaisesRegex(ValueError, error):
                audit(fixture(lambda w: setattr(w[sheet][cell], "value", value)))

    def test_review_gates_are_bound_to_source_bytes(self):
        questions, summary = audit(fixture())
        approval = {"workbook_sha256": summary["workbook_sha256"], "reviewer": "Test Reviewer",
                    "gate_evidence": {gate: "Synthetic review record" for gate in GATES}}
        check_approval(summary, approval, questions)
        with self.assertRaisesRegex(ValueError, "exact workbook digest"):
            check_approval(summary, dict(approval, workbook_sha256="other"), questions)
        with self.assertRaisesRegex(ValueError, "every remaining release gate"):
            check_approval(summary, dict(approval, gate_evidence={}), questions)
        _, pending = audit(fixture(lambda w: setattr(w["Validation checklist"]["C10"], "value", "Not approved")))
        with self.assertRaisesRegex(ValueError, "checklist is open"):
            check_approval(pending, approval, questions)
        _, pending = audit(fixture(lambda w: setattr(w["Blind-solve sheet"]["G2"], "value", "A")))
        with self.assertRaisesRegex(ValueError, "blind-solve evidence"):
            check_approval(pending, approval, questions)

    def test_publisher_decision_only_substitutes_the_founder_gate_for_the_bound_digest(self):
        questions, summary = audit(fixture())
        source_digest = "e83478e7f1a689ad0e9d1cd45bd33b74dbccea3b75853fed27e582f953c76ec4"
        approved_source = dict(summary, workbook_sha256=source_digest, pending_checklist_gates=list("1234569"))
        decision = publisher_approval(approved_source)
        self.assertEqual(set(decision["accepted_exceptions"]), {"Q37", "Q42", "Q116"})
        self.assertIsNone(publisher_approval(summary))
        self.assertIsNone(publisher_approval(dict(approved_source, question_count=119)))
        evidence = {"workbook_sha256": source_digest, "reviewer": "Test Reviewer",
                    "gate_evidence": {gate: "Synthetic review record" for gate in GATES - {"founder_approval"}}}
        with self.assertRaisesRegex(ValueError, "Independent blind-solve evidence"):
            check_approval(approved_source, evidence, questions)
        answers = [{"position": i, "answer": q["correct_option"], "confidence": 5}
                   for i, q in enumerate(questions, 1)]
        complete = dict(evidence, resolved_blind_solve=answers)
        check_approval(approved_source, complete, questions)
        with self.assertRaisesRegex(ValueError, "Independent blind-solve evidence"):
            check_approval(approved_source, dict(complete, resolved_blind_solve=answers[::-1]), questions)
        for gate in GATES - {"founder_approval"}:
            partial = dict(complete, gate_evidence={k: v for k, v in complete["gate_evidence"].items() if k != gate})
            with self.subTest(gate=gate), self.assertRaisesRegex(ValueError, "every remaining release gate"):
                check_approval(approved_source, partial, questions)

    def test_staging_endpoint_ignores_app_environment_and_disallows_redirects(self):
        with patch.dict("os.environ", {"SUPABASE_ACCESS_TOKEN": "synthetic",
                                      "NEXT_PUBLIC_SUPABASE_URL": "https://production.example",
                                      "VERCEL_ENV": "production"}), patch("import_cds_gk_m01.build_opener") as opener:
            response = opener.return_value.open.return_value.__enter__.return_value
            response.read.return_value = b"[]"
            stage("select 1")
            request = opener.return_value.open.call_args.args[0]
            self.assertEqual(request.full_url, URL)
            self.assertEqual(URL, "https://api.supabase.com/v1/projects/pxfstrzceyxnweeaydvz/database/query")
            handler = opener.call_args.args[0]
            self.assertIsInstance(handler, NoRedirects)
            self.assertIsNone(handler.redirect_request(request, None, 307, "", {}, "https://elsewhere.example"))


if __name__ == "__main__":
    unittest.main()
