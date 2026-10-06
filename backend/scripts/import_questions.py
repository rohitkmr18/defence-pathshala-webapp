"""
Defence Pathshala - PYQ Intelligence Importer

Purpose:
- Validate the canonical 29-column dataset
- Generate validation reports
- Import into Supabase safely using upsert
- Prevent duplicate question_id records

Usage:

Validate only:
python import_questions.py "C:\\path\\PYQ_Intelligence.xlsx" --validate

Import:
python import_questions.py "C:\\path\\PYQ_Intelligence.xlsx"
"""

from __future__ import annotations

import os
import sys
from datetime import date, datetime, time
from pathlib import Path

import pandas as pd
from dotenv import load_dotenv
from supabase import create_client

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app.services.content_quality import require_content_integrity, require_reviewed_content_preserved

# ---------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")


REPORT_DIR = Path("backend/reports")
REPORT_DIR.mkdir(parents=True, exist_ok=True)

EXPECTED_COLUMNS = [
    "question_id",
    "exam",
    "year",
    "cycle",
    "paper",
    "q_num",
    "subject",
    "topic",
    "subtopic",
    "theme",
    "question",
    "opt_a",
    "opt_b",
    "opt_c",
    "opt_d",
    "q_type",
    "q_pattern",
    "llm_opt",
    "official_opt",
    "final_opt",
    "key_discrepancy",
    "explanation",
    "source",
    "is_negative",
    "tags",
    "verified_status",
    "static_current_link",
    "difficulty_score",
    "difficulty_category",
]

REQUIRED_FIELDS = [
    "question_id",
    "exam",
    "year",
    "q_num",
    "question",
    "opt_a",
    "opt_b",
    "opt_c",
    "opt_d",
    "final_opt",
]

BATCH_SIZE = 100


# ---------------------------------------------------------------------
# Utilities
# ---------------------------------------------------------------------


def timestamp() -> str:
    return datetime.now().strftime("%Y%m%d_%H%M%S")


def report_path(prefix: str) -> Path:
    return REPORT_DIR / f"{prefix}_{timestamp()}.xlsx"


# ---------------------------------------------------------------------
# Reading
# ---------------------------------------------------------------------


def load_file(file_path: str) -> pd.DataFrame:
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(path)

    if path.suffix.lower() == ".xlsx":
        from openpyxl import load_workbook
        workbook = load_workbook(path, data_only=False, read_only=True)
        try:
            sheet = workbook.active
            headers = [str(c.value).strip() for c in next(sheet.iter_rows())]
            content_indices = [i for i, h in enumerate(headers) if h in ("question", "opt_a", "opt_b", "opt_c", "opt_d")]
            for cells in sheet.iter_rows(min_row=2):
                for i in content_indices:
                    cell = cells[i]
                    if cell.data_type in ("f", "e") or isinstance(cell.value, (datetime, date, time)):
                        raise ValueError(f"{cell.coordinate}: content must be original plain text, not a formula/error/date cell")
                    if isinstance(cell.value, (int, float)) and cell.number_format not in ("General", "0"):
                        raise ValueError(f"{cell.coordinate}: formatted numeric content must be restored as plain text")
        finally:
            workbook.close()
        df = pd.read_excel(path, dtype=object, keep_default_na=False)
    elif path.suffix.lower() == ".csv":
        df = pd.read_csv(path, encoding="utf-8-sig", dtype=str, keep_default_na=False)
    else:
        raise ValueError("Only .xlsx and .csv files are supported.")

    # Remove hidden whitespace from headers
    df.columns = df.columns.astype(str).str.strip()

    return df


# ---------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------


def validate_schema(df: pd.DataFrame):
    missing = [c for c in EXPECTED_COLUMNS if c not in df.columns]
    extra = [c for c in df.columns if c not in EXPECTED_COLUMNS]

    if missing:
        raise RuntimeError(f"Missing columns: {missing}")

    if extra:
        print(f"Extra columns detected (ignored): {extra}")


def validate_duplicates(df: pd.DataFrame):
    dup = df[df["question_id"].duplicated(keep=False)]

    if not dup.empty:
        path = report_path("duplicate_question_ids")
        dup.to_excel(path, index=False)
        raise RuntimeError(
            f"Duplicate question_id found ({len(dup)} rows).\n"
            f"Report: {path}"
        )


def validate_required_fields(df: pd.DataFrame):
    bad = df[df[REQUIRED_FIELDS].isna().any(axis=1)]

    if not bad.empty:
        path = report_path("missing_required_fields")
        bad.to_excel(path, index=False)

        summary = df[REQUIRED_FIELDS].isna().sum()
        summary = summary[summary > 0]

        print("\nMissing field summary:")
        print(summary)

        raise RuntimeError(
            f"{len(bad)} rows contain missing required values.\n"
            f"Report: {path}"
        )


def validate_difficulty(df: pd.DataFrame):
    try:
        df["difficulty_score"] = pd.to_numeric(
            df["difficulty_score"], errors="raise"
        )
    except Exception as exc:
        raise RuntimeError(
            "difficulty_score contains invalid numeric values."
        ) from exc


def normalize_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    require_content_integrity(df)
    df = df.copy()

    # Boolean fields
    df["key_discrepancy"] = df["key_discrepancy"].fillna(False).astype(bool)
    df["is_negative"] = df["is_negative"].fillna(True).astype(bool)

    # Tags -> PostgreSQL text[]
    df["tags"] = (
        df["tags"]
        .fillna("")
        .astype(str)
        .apply(lambda x: [t.strip() for t in x.split(",") if t.strip()])
    )

    # Convert Excel date/time objects into strings
    def serialize(value):
        if isinstance(value, (datetime, date, time)):
            return value.isoformat()
        return value

    df = df.map(serialize)

    # CRITICAL FIX: convert every remaining NaN into Python None
    df = df.astype(object).where(pd.notna(df), None)

    return df


def validate_source(df: pd.DataFrame):
    require_content_integrity(df)
    validate_schema(df)
    validate_duplicates(df)
    validate_required_fields(df)
    validate_difficulty(df)


# ---------------------------------------------------------------------
# Import
# ---------------------------------------------------------------------


def import_records(df: pd.DataFrame):
    require_content_integrity(df)
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required to import")
    client = create_client(SUPABASE_URL, SUPABASE_KEY)
    records = df[EXPECTED_COLUMNS].to_dict(orient="records")

    require_reviewed_content_preserved(client, records)
    total = len(records)

    print("\nStarting import...\n")

    for start in range(0, total, BATCH_SIZE):
        batch = records[start:start + BATCH_SIZE]

        try:
            client.table("questions").upsert(
                batch,
                on_conflict="question_id"
            ).execute()

            print(f"Imported {min(start+BATCH_SIZE,total)}/{total}")

        except Exception:
            print(
                f"\nBatch failed: rows {start+1}-"
                f"{min(start+BATCH_SIZE,total)}"
            )

            for i, row in enumerate(batch):
                for key, value in row.items():
                    if isinstance(value, float) and pd.isna(value):
                        print(f"Row {start+i+1}: {key}=NaN")

            raise


    print("\nImport completed successfully.")


# ---------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------


def main():
    if len(sys.argv) < 2:
        print(
            "Usage:\n"
            'python import_questions.py "dataset.xlsx" [--validate]'
        )
        sys.exit(1)

    file_path = sys.argv[1]
    validate_only = "--validate" in sys.argv

    df = load_file(file_path)

    print(f"\nLoaded {len(df)} rows.")

    validate_source(df)

    print("\nValidation Summary")
    print("------------------")
    print(f"Rows: {len(df)}")
    print(f"Required columns: {len(EXPECTED_COLUMNS)}/{len(EXPECTED_COLUMNS)}")
    print("Duplicate question_id: 0")
    print("Missing required values: 0")
    print("Difficulty scores: VALID")

    if validate_only:
        print("\nValidation successful. Import skipped (--validate).")
        return

    df = normalize_dataframe(df)

    import_records(df)


if __name__ == "__main__":
    main()