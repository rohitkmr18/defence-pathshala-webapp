"""
Google Sheets to Supabase Dataset Sync Service.

Responsibilities:
- Read Sheet ID from configuration/environment
- Download specified worksheet as CSV via Google Visualization / Export API
- Parse into Pandas DataFrame with meaningful error handling and timeouts
- Normalize data types (booleans, postgres text[] arrays, NaNs to None)
- Upsert into Supabase `questions` table on_conflict='question_id'
- Track inserted, updated, total counts and sync duration
"""

from __future__ import annotations

import io
import logging
import time
import urllib.parse
from datetime import date, datetime
from typing import Any

import httpx
import pandas as pd

from app.core.config import settings
from app.core.supabase import supabase
from app.services.validate_dataset import (
    EXPECTED_COLUMNS,
    DatasetValidationError,
    validate_dataset,
)

logger = logging.getLogger(__name__)


class DatasetSyncError(Exception):
    """Raised when dataset synchronization or downloading fails."""

    def __init__(self, message: str, details: Any = None):
        super().__init__(message)
        self.details = details


def get_google_sheet_id(override_id: str | None = None) -> str:
    """Resolves the Google Sheet ID from argument or application settings."""
    sheet_id = override_id or settings.google_sheet_id
    if not sheet_id:
        raise DatasetSyncError(
            "GOOGLE_SHEET_ID is not configured. Set GOOGLE_SHEET_ID in your environment or .env file."
        )
    return sheet_id.strip()


def download_worksheet_csv(
    sheet_id: str | None = None,
    worksheet_name: str = "questions",
    timeout: float = 30.0,
) -> pd.DataFrame:
    """
    Downloads a worksheet from Google Sheets by worksheet name as CSV and returns a Pandas DataFrame.

    Uses the Google Visualization API endpoint (`/gviz/tq?tqx=out:csv&sheet=...`), which supports
    referencing sheets by name rather than numeric gid.
    """
    sid = get_google_sheet_id(sheet_id)

    # Primary URL using Google Visualization API with worksheet name
    encoded_sheet = urllib.parse.quote(worksheet_name)
    primary_url = f"https://docs.google.com/spreadsheets/d/{sid}/gviz/tq?tqx=out:csv&sheet={encoded_sheet}"
    fallback_url = f"https://docs.google.com/spreadsheets/d/{sid}/export?format=csv&sheet={encoded_sheet}"

    headers = {
        "User-Agent": "DefencePathshala-DatasetSync/1.0",
        "Accept": "text/csv, application/csv, text/plain;q=0.9",
    }

    logger.info(
        "Downloading worksheet '%s' from Google Sheet ID '%s'...",
        worksheet_name,
        sid,
    )

    last_error: Exception | None = None

    for target_url in [primary_url, fallback_url]:
        try:
            with httpx.Client(timeout=timeout, follow_redirects=True) as client:
                response = client.get(target_url, headers=headers)

                if response.status_code == 200:
                    csv_content = response.content
                    if not csv_content or len(csv_content.strip()) == 0:
                        raise DatasetSyncError(
                            f"Worksheet '{worksheet_name}' returned empty content from Google Sheets."
                        )

                    # Check for Google HTML error pages disguised as 200
                    text_start = csv_content[:150].decode("utf-8", errors="ignore").lower()
                    if "<html" in text_start or "<!doctype html" in text_start:
                        if "signin" in text_start or "service login" in text_start:
                            raise DatasetSyncError(
                                "Google Sheet is private or requires authentication. Ensure link sharing is enabled ('Anyone with link can view')."
                            )
                        raise DatasetSyncError(
                            f"Google Sheets returned an HTML error page instead of CSV for worksheet '{worksheet_name}'."
                        )

                    # Parse into DataFrame
                    df = pd.read_csv(io.BytesIO(csv_content), encoding="utf-8")
                    df.columns = df.columns.astype(str).str.strip()

                    logger.info(
                        "Downloaded worksheet '%s' successfully (%d rows, %d columns).",
                        worksheet_name,
                        len(df),
                        len(df.columns),
                    )
                    return df

                logger.warning(
                    "URL %s returned status %d. Attempting fallback...",
                    target_url,
                    response.status_code,
                )

        except httpx.TimeoutException as exc:
            last_error = exc
            logger.warning("Timeout while fetching %s after %.1fs.", target_url, timeout)
        except Exception as exc:
            last_error = exc
            logger.warning("Error fetching %s: %s", target_url, exc)

    error_msg = f"Failed to download worksheet '{worksheet_name}' from Google Sheets."
    if last_error:
        error_msg += f" Error: {last_error}"
    raise DatasetSyncError(error_msg, details=str(last_error))


def normalize_questions_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """
    Normalizes a questions DataFrame for PostgreSQL / Supabase insertion.
    - Strips whitespace from column names and string fields
    - Converts booleans (key_discrepancy, is_negative)
    - Parses tags comma-separated string into Python list[str] for Postgres text[]
    - Converts NaN/NaT to Python None for SQL NULL
    - Keeps only valid table schema columns
    """
    clean_df = df.copy()

    # Clean headers
    clean_df.columns = clean_df.columns.astype(str).str.strip()

    # Clean string question_id
    if "question_id" in clean_df.columns:
        clean_df["question_id"] = clean_df["question_id"].astype(str).str.strip()

    # Boolean normalization
    if "key_discrepancy" in clean_df.columns:
        clean_df["key_discrepancy"] = (
            clean_df["key_discrepancy"]
            .fillna(False)
            .astype(str)
            .str.strip()
            .str.lower()
            .isin(["true", "1", "yes", "t"])
        )

    if "is_negative" in clean_df.columns:
        clean_df["is_negative"] = (
            clean_df["is_negative"]
            .fillna(True)
            .astype(str)
            .str.strip()
            .str.lower()
            .isin(["true", "1", "yes", "t"])
        )

    # Tags normalization -> PostgreSQL text[]
    if "tags" in clean_df.columns:
        def parse_tags(val: Any) -> list[str]:
            if isinstance(val, list):
                return [str(t).strip() for t in val if str(t).strip()]
            if pd.isna(val) or val is None:
                return []
            return [t.strip() for t in str(val).split(",") if t.strip()]

        clean_df["tags"] = clean_df["tags"].apply(parse_tags)

    # Numeric normalization
    for int_col in ["year", "q_num"]:
        if int_col in clean_df.columns:
            clean_df[int_col] = pd.to_numeric(clean_df[int_col], errors="coerce").astype("Int64")

    if "difficulty_score" in clean_df.columns:
        clean_df["difficulty_score"] = pd.to_numeric(clean_df["difficulty_score"], errors="coerce")

    # String columns with NOT NULL constraints in PostgreSQL
    not_null_str_cols = [
        "question_id",
        "exam",
        "subject",
        "topic",
        "subtopic",
        "question",
        "opt_a",
        "opt_b",
        "opt_c",
        "opt_d",
        "final_opt",
    ]
    for col in not_null_str_cols:
        if col in clean_df.columns:
            clean_df[col] = clean_df[col].fillna("").astype(str).str.strip()

    # Filter to only the expected canonical table columns
    available_cols = [c for c in EXPECTED_COLUMNS if c in clean_df.columns]
    filtered_df = clean_df[available_cols]

    # Convert to records and clean values safely without ambiguous array evaluation
    records = filtered_df.to_dict(orient="records")
    cleaned_records: list[dict[str, Any]] = []

    for row in records:
        cleaned_row: dict[str, Any] = {}
        for k, v in row.items():
            if isinstance(v, list):
                cleaned_row[k] = v
            elif isinstance(v, (datetime, date)):
                cleaned_row[k] = v.isoformat()
            elif v is None or pd.isna(v):
                cleaned_row[k] = "" if k in not_null_str_cols else None
            else:
                cleaned_row[k] = v
        cleaned_records.append(cleaned_row)

    return pd.DataFrame(cleaned_records)


def prepare_records_for_upsert(df: pd.DataFrame) -> list[dict[str, Any]]:
    """
    Normalizes DataFrame and guarantees all records are 100% JSON-compliant
    with zero NaN / Inf floats that would break PostgREST requests.
    Ensures NOT NULL string columns are never None.
    """
    import math

    not_null_str_fields = {
        "question_id",
        "exam",
        "subject",
        "topic",
        "subtopic",
        "question",
        "opt_a",
        "opt_b",
        "opt_c",
        "opt_d",
        "final_opt",
    }

    normalized_df = normalize_questions_dataframe(df)
    raw_records = normalized_df.to_dict(orient="records")
    clean_records: list[dict[str, Any]] = []

    for row in raw_records:
        cleaned: dict[str, Any] = {}
        for k, v in row.items():
            if v is None:
                cleaned[k] = "" if k in not_null_str_fields else None
            elif isinstance(v, list):
                cleaned[k] = v
            elif isinstance(v, float) and (math.isnan(v) or math.isinf(v)):
                cleaned[k] = "" if k in not_null_str_fields else None
            elif pd.isna(v):
                cleaned[k] = "" if k in not_null_str_fields else None
            else:
                cleaned[k] = v
        clean_records.append(cleaned)

    return clean_records


def get_existing_question_ids() -> set[str]:
    """Fetches all existing question_id records from Supabase."""
    existing_ids: set[str] = set()
    page_size = 1000
    start = 0

    while True:
        res = (
            supabase.table("questions")
            .select("question_id")
            .range(start, start + page_size - 1)
            .execute()
        )
        data = res.data or []
        for row in data:
            if row.get("question_id"):
                existing_ids.add(str(row["question_id"]).strip())

        if len(data) < page_size:
            break
        start += page_size

    return existing_ids


def sync_dataset_to_supabase(
    df: pd.DataFrame,
    batch_size: int = 100,
    dry_run: bool = False,
) -> dict[str, Any]:
    """
    Synchronizes the normalized questions DataFrame to Supabase using upsert.
    - Matches on `question_id` (UNIQUE constraint)
    - Updates existing questions
    - Inserts new questions
    - Calculates and returns inserted, updated, and total counts
    """
    start_time = time.perf_counter()

    # Step 1: Normalize records for JSON upsert
    records = prepare_records_for_upsert(df)
    total_records = len(records)

    incoming_ids = set(str(r["question_id"]).strip() for r in records if r.get("question_id"))

    # Step 2: Query existing IDs to partition inserted vs updated
    existing_ids = get_existing_question_ids()

    inserted_count = len(incoming_ids - existing_ids)
    updated_count = len(incoming_ids & existing_ids)

    logger.info(
        "Sync Plan: Total=%d | New Insertions=%d | Updates=%d (dry_run=%s)",
        total_records,
        inserted_count,
        updated_count,
        dry_run,
    )

    if not dry_run:
        # Step 3: Batch upsert into Supabase
        for start in range(0, total_records, batch_size):
            batch = records[start : start + batch_size]
            try:
                supabase.table("questions").upsert(
                    batch,
                    on_conflict="question_id",
                ).execute()
                logger.info(
                    "Upserted batch %d-%d of %d questions",
                    start + 1,
                    min(start + batch_size, total_records),
                    total_records,
                )
            except Exception as exc:
                logger.error(
                    "Supabase upsert failed at batch offset %d: %s",
                    start,
                    exc,
                )
                raise DatasetSyncError(
                    f"Failed upserting batch at row {start}: {exc}",
                    details=str(exc),
                ) from exc

    duration = time.perf_counter() - start_time
    logger.info(
        "Sync completed in %.2fs: %d inserted, %d updated, %d total.",
        duration,
        inserted_count,
        updated_count,
        total_records,
    )

    return {
        "success": True,
        "inserted": inserted_count,
        "updated": updated_count,
        "total": total_records,
        "dry_run": dry_run,
        "duration_seconds": round(duration, 2),
    }


def run_full_sync(
    sheet_id: str | None = None,
    worksheet_name: str = "questions",
    timeout: float = 30.0,
    dry_run: bool = False,
) -> dict[str, Any]:
    """
    Executes the full pipeline:
    1. Download worksheet from Google Sheets
    2. Validate dataset
    3. Upsert into Supabase
    """
    start_time = time.perf_counter()
    logger.info("Initiating Google Sheets -> Supabase dataset sync (sheet=%s)...", worksheet_name)

    # 1. Download
    df = download_worksheet_csv(
        sheet_id=sheet_id,
        worksheet_name=worksheet_name,
        timeout=timeout,
    )

    # 2. Validate
    validation = validate_dataset(df)
    if not validation["valid"]:
        logger.error("Dataset validation failed: %s", validation["errors"])
        raise DatasetValidationError(
            errors=validation["errors"],
            total_rows=validation["total_rows"],
        )

    # 3. Upsert
    result = sync_dataset_to_supabase(
        df=df,
        dry_run=dry_run,
    )

    result["worksheet_name"] = worksheet_name
    result["total_pipeline_duration_seconds"] = round(time.perf_counter() - start_time, 2)
    return result
