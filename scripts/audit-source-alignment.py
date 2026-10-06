#!/usr/bin/env python3
"""Read-only OCR triage. Never publishes OCR or infers answer keys.

Usage: python scripts/audit-source-alignment.py --snapshot snapshot.json
       --ocr-dir evidence/ --output candidates.json
The snapshot is an array of canonical question rows. OCR files are named
BOOK-PAGE-COLUMN.txt. Output ranks candidate source locations and exposes
unmatched/ambiguous items; visual comparison remains required for repairs.
"""
import argparse
import difflib
import json
import re
from pathlib import Path

BOOKS = {
    "CAPF_2022": "CAPF_2022_P1_", "CAPF_2024": "CAPF_2024_P1_",
    "CAPF_2025": "CAPF_2025_P1_", "CAPF_2026": "CAPF_2026_P1_",
    "CDS_II_2022": "CDS_II_2022_GK_", "CDS_I_2024": "CDS_I_2024_GK_",
    "CDS_I_2026": "CDS_I_2026_GK_", "CDS_II_2025_setC": "CDS_II_2025_GK_",
}

def normalise(text):
    # Comparison only: never use this string as a proposed correction.
    text = str(text).replace("\\n", " ").replace("\\r", " ")
    return re.sub(r"[^a-z0-9]+", " ", text.lower()).strip()

def source_candidates(directory, book):
    chunks = []
    for path in sorted(directory.glob(book + "-*.txt")):
        text = path.read_text()
        # Include numbered heading candidates, even if OCR missed punctuation.
        starts = list(re.finditer(r"(?m)^\s*(\d{1,3})[.,]?\s+([A-Z][^\n]*)", text))
        for i, match in enumerate(starts):
            n = int(match.group(1))
            if not 1 <= n <= 125:
                continue
            end = starts[i+1].start() if i+1 < len(starts) else len(text)
            # Statements can resemble question headings. Keep a window too;
            # ranking is triage, and cannot approve a source mapping.
            window = text[match.end(1): min(len(text), match.start()+1800)]
            segment = text[match.end(1):end]
            chunks.append({"file": path.name, "source_number_candidate": n,
                           "text": segment, "window": window})
    return chunks

def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--snapshot", type=Path, required=True)
    ap.add_argument("--ocr-dir", type=Path, required=True)
    ap.add_argument("--output", type=Path, required=True)
    args = ap.parse_args()
    rows = json.loads(args.snapshot.read_text())
    output = []
    for book, prefix in BOOKS.items():
        sources = source_candidates(args.ocr_dir, book)
        for row in rows:
            if not row["question_id"].startswith(prefix):
                continue
            stem = normalise(row["question"])
            tokens = set(stem.split())
            ranked = []
            for source in sources:
                window = normalise(source["window"])
                overlap = len(tokens & set(window.split())) / max(1, len(tokens))
                if overlap < .35:
                    continue
                target = window[:len(stem)+80]
                ratio = difflib.SequenceMatcher(None, stem, target, autojunk=False).ratio()
                ranked.append((.55*overlap+.45*ratio, source))
            ranked.sort(key=lambda pair: pair[0], reverse=True)
            candidates = [{"score": round(score, 4), "file": src["file"],
                           "source_number_candidate": src["source_number_candidate"],
                           "ocr_excerpt": src["window"][:1800]}
                          for score, src in ranked[:3]]
            output.append({"question_id": row["question_id"], "book": book,
                           "state": "VISUAL_REVIEW_REQUIRED" if candidates else "OCR_UNMATCHED",
                           "candidates": candidates})
    args.output.write_text(json.dumps({"mode": "READ_ONLY_TRIAGE",
        "warning": "OCR scores do not establish source fidelity, booklet mapping, or answer correctness.",
        "items": output}, indent=2, ensure_ascii=False))
    print(json.dumps({"rows_compared": len(output),
        "with_candidates": sum(bool(x["candidates"]) for x in output),
        "output": str(args.output)}))

if __name__ == "__main__":
    main()
