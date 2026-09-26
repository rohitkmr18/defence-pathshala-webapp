"""
Dataset Validation Service for Defence Pathshala PYQ Intelligence.

Validates the Google Sheets dataset before syncing to Supabase:
- Required columns presence
- Duplicate question_id
- Blank question_id
- difficulty_score bounds (0 to 100)
- final_opt validity (A, B, C, D, X, DROP)
- verified_status validity
"""

from __future__ import annotations

import logging
from typing import Any

import pandas as pd

logger = logging.getLogger(__name__)

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

REQUIRED_COLUMNS = [
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

VALID_FINAL_OPTS = {"A", "B", "C", "D", "X", "DROP"}
VALID_VERIFIED_STATUSES = {"VERIFIED", "NEEDS REVIEW", "DRAFT", "PENDING", "APPROVED"}


class DatasetValidationError(Exception):
    """Raised when the dataset fails validation rules."""

    def __init__(self, errors: list[str], total_rows: int = 0):
        self.errors = errors
        self.total_rows = total_rows
        super().__init__(f"Dataset validation failed with {len(errors)} error(s).")


def validate_dataset(df: pd.DataFrame) -> dict[str, Any]:
    """
    Validates a questions DataFrame against required business rules.

    Returns:
        dict with keys:
            - valid: bool
            - total_rows: int
            - errors: list[str]
            - warnings: list[str]
    """
    errors: list[str] = []
    warnings: list[str] = []

    if df.empty:
        errors.append("Dataset is empty; 0 rows found.")
        return {
            "valid": False,
            "total_rows": 0,
            "errors": errors,
            "warnings": warnings,
        }

    total_rows = len(df)

    # 1. Check required columns existence
    cleaned_cols = [str(c).strip() for c in df.columns]
    missing_required = [c for c in REQUIRED_COLUMNS if c not in cleaned_cols]
    if missing_required:
        errors.append(f"Missing required column(s): {', '.join(missing_required)}")

    missing_expected = [c for c in EXPECTED_COLUMNS if c not in cleaned_cols]
    if missing_expected:
        warnings.append(f"Missing optional column(s): {', '.join(missing_expected)}")

    # If critical columns are missing, return early to avoid KeyError
    if "question_id" not in df.columns:
        return {
            "valid": False,
            "total_rows": total_rows,
            "errors": errors,
            "warnings": warnings,
        }

    # 2. Check blank question_id
    raw_qid = df["question_id"].astype(str).str.strip()
    blank_mask = df["question_id"].isna() | (raw_qid == "") | (raw_qid.str.lower() == "nan")
    blank_count = int(blank_mask.sum())
    if blank_count > 0:
        bad_indices = df[blank_mask].index.tolist()[:5]
        errors.append(
            f"Found {blank_count} row(s) with blank or null question_id (e.g. row indices: {bad_indices})"
        )

    # 3. Check duplicate question_id
    # Only evaluate non-blank question_ids for duplicates
    valid_qids = df.loc[~blank_mask, "question_id"].astype(str).str.strip()
    duplicate_mask = valid_qids.duplicated(keep=False)
    duplicate_count = int(duplicate_mask.sum())
    if duplicate_count > 0:
        dup_samples = valid_qids[duplicate_mask].unique()[:5].tolist()
        errors.append(
            f"Found {duplicate_count} duplicate question_id occurrence(s) (samples: {dup_samples})"
        )

    # 4. Check difficulty_score between 0 and 100
    if "difficulty_score" in df.columns:
        non_null_scores = df["difficulty_score"].dropna()
        if not non_null_scores.empty:
            numeric_scores = pd.to_numeric(non_null_scores, errors="coerce")
            invalid_numeric = non_null_scores[numeric_scores.isna()]
            if not invalid_numeric.empty:
                errors.append(
                    f"{len(invalid_numeric)} row(s) have non-numeric difficulty_score (samples: {invalid_numeric.head(3).tolist()})"
                )

            out_of_bounds = numeric_scores[(numeric_scores < 0) | (numeric_scores > 100)]
            if not out_of_bounds.empty:
                errors.append(
                    f"{len(out_of_bounds)} row(s) have difficulty_score outside 0-100 (samples: {out_of_bounds.head(3).tolist()})"
                )

    # 5. Check final_opt valid (A, B, C, D, X, DROP)
    if "final_opt" in df.columns:
        final_opts = df["final_opt"].astype(str).str.strip().str.upper()
        # Null or missing final_opt
        null_final = df["final_opt"].isna() | (final_opts == "") | (final_opts == "NAN")
        if null_final.any():
            errors.append(f"{int(null_final.sum())} row(s) have missing final_opt")

        invalid_opt_mask = ~null_final & ~final_opts.isin(VALID_FINAL_OPTS)
        if invalid_opt_mask.any():
            bad_opts = final_opts[invalid_opt_mask].unique()[:5].tolist()
            errors.append(
                f"{int(invalid_opt_mask.sum())} row(s) have invalid final_opt (allowed: {sorted(VALID_FINAL_OPTS)}, found: {bad_opts})"
            )

    # 6. Check verified_status valid
    if "verified_status" in df.columns:
        status_series = df["verified_status"].dropna().astype(str).str.strip().str.upper()
        if not status_series.empty:
            invalid_status_mask = ~status_series.isin(VALID_VERIFIED_STATUSES)
            if invalid_status_mask.any():
                bad_statuses = status_series[invalid_status_mask].unique()[:5].tolist()
                errors.append(
                    f"{int(invalid_status_mask.sum())} row(s) have invalid verified_status (allowed: {sorted(VALID_VERIFIED_STATUSES)}, found: {bad_statuses})"
                )

    is_valid = len(errors) == 0

    if not is_valid:
        logger.warning(
            "Dataset validation failed: %d errors found across %d rows.",
            len(errors),
            total_rows,
        )
    else:
        logger.info(
            "Dataset validation passed successfully for %d rows.",
            total_rows,
        )

    return {
        "valid": is_valid,
        "total_rows": total_rows,
        "errors": errors,
        "warnings": warnings,
    }
