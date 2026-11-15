import csv
import json
import tempfile
import unittest
from pathlib import Path
from prepare import FILES, prepare

FIELDS = ["record_id", "year", "section", "original_label", "prompt", "marks_per_response",
          "selection_rule", "word_limit", "primary_domain", "demand_type", "secondary_tags",
          "source_url", "source_page_reported", "source_status", "publication_status",
          "wording_verification", "reviewer", "reviewed_at", "pdf_sha256"]

class PackageTests(unittest.TestCase):
    def setUp(self):
        private = Path(__file__).resolve().parents[2] / ".capf-private"
        private.mkdir(exist_ok=True)
        self.temp = tempfile.TemporaryDirectory(dir=private)
        self.folder = Path(self.temp.name)
        for name in FILES:
            (self.folder / name).write_text("Synthetic fixture", encoding="utf-8")
        self.report = self.folder / "research.md"
        self.report.write_text("Synthetic research fixture", encoding="utf-8")
        self.rows = []
        for year in range(2020, 2027):
            for i in range(8):
                essay = i < 6
                row = dict.fromkeys(FIELDS, "")
                row.update(record_id=f"SYNTHETIC-{year}-{i}", year=str(year),
                           section="Q1_ESSAY" if essay else "Q2_ARGUMENT", original_label=str(i),
                           prompt=f'Synthetic, quoted "prompt" {year}-{i}', marks_per_response="20",
                           selection_rule="Synthetic selection",
                           word_limit="about 300 words each" if essay else "Not specified in reviewed papers",
                           primary_domain="society", demand_type="analysis" if essay else "for_against",
                           source_url=f"https://www.upsc.gov.in/synthetic-{year}.pdf", source_page_reported="2",
                           publication_status="HOLD_NEEDS_HUMAN_VERIFICATION",
                           wording_verification="NOT_DIRECTLY_VERIFIED_IN_PACKAGE_A_V0_2")
                self.rows.append(row)
        self.write_csv()
        self.write("DATA_CONTRACTS_V0_2.json", {"corpus_fields": FIELDS})
        self.write("question_demand_cards_draft.json", [
            {"record_id": r["record_id"], "question_text_research_draft": r["prompt"],
             "source_confirmation_required": True} for r in self.rows])
        self.write("source_register.json", {"papers": [
            {"year": y, "official_pdf_url": f"https://www.upsc.gov.in/synthetic-{y}.pdf"} for y in range(2020, 2027)]})
        self.write("taxonomy_ontology_v0_2.json", {"domains": {"society": "Synthetic"},
            "demand_tags": ["analyse", "dialectical_for_against"]})
        self.write("rubric_v0_1.json", {key: {"criteria": [{"max_points": p} for p in [4,4,3,3,2,2,1,1]]}
            for key in ["q1", "q2"]})
        self.write("rubric_anchor_handbook_v0_2.json", {"synthetic": True})

    def tearDown(self):
        self.temp.cleanup()

    def write(self, name, data):
        (self.folder / name).write_text(json.dumps(data), encoding="utf-8")

    def write_csv(self):
        with (self.folder / "capf_q1_q2_corpus_2020_2026.csv").open("w", encoding="utf-8", newline="") as file:
            writer = csv.DictWriter(file, fieldnames=FIELDS)
            writer.writeheader()
            writer.writerows(self.rows)

    def test_exact_text_null_q2_and_determinism(self):
        first = prepare(self.folder, self.report)
        self.assertEqual(first, prepare(self.folder, self.report))
        self.assertEqual(first["records"][0]["prompt"], self.rows[0]["prompt"])
        self.assertIsNone(first["records"][6]["word_limit"])
        self.assertIsNone(first["records"][0]["pdf_page_index"])
        self.assertEqual(first["records"][0]["demand_tags"], ["analyse"])
        self.assertEqual(len(first["files"]), 14)

    def test_duplicate_ids_rejected(self):
        self.rows[1]["record_id"] = self.rows[0]["record_id"]
        self.write_csv()
        with self.assertRaisesRegex(ValueError, "UNIQUE"):
            prepare(self.folder, self.report)

    def test_unknown_demand_rejected(self):
        self.rows[0]["demand_type"] = "invented"
        self.write_csv()
        with self.assertRaisesRegex(ValueError, "UNMAPPED_DEMAND"):
            prepare(self.folder, self.report)

    def test_unexpected_publication_rejected(self):
        self.rows[0]["publication_status"] = "PUBLISH_APPROVED"
        self.write_csv()
        with self.assertRaisesRegex(ValueError, "PUBLICATION"):
            prepare(self.folder, self.report)

    def test_card_mismatch_rejected(self):
        self.rows[0]["prompt"] = "Changed prompt"
        self.write_csv()
        with self.assertRaisesRegex(ValueError, "PROMPT_CARD"):
            prepare(self.folder, self.report)

    def test_missing_file_and_unequal_rubric_rejected(self):
        self.write("rubric_v0_1.json", {"q1": {"criteria": [{"max_points": 20}]}})
        with self.assertRaisesRegex(ValueError, "RUBRIC_WEIGHTS"):
            prepare(self.folder, self.report)
        (self.folder / FILES[0]).unlink()
        with self.assertRaises(FileNotFoundError):
            prepare(self.folder, self.report)

if __name__ == "__main__":
    unittest.main()
