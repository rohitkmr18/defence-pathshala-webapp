"""
Admin Endpoints for Dataset Management and Synchronization.
"""

from __future__ import annotations

import logging
import time
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel

from app.core.security import require_admin
from app.services.sync_dataset import (
    DatasetSyncError,
    download_worksheet_csv,
    sync_dataset_to_supabase,
)
from app.services.validate_dataset import (
    DatasetValidationError,
    validate_dataset,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/admin", tags=["admin"])


class SyncDatasetResponse(BaseModel):
    success: bool
    inserted: int
    updated: int
    total: int
    dry_run: bool = False
    duration_seconds: float
    worksheet: str


class DatasetStatsResponse(BaseModel):
    current_db_count: int
    incoming_sheet_count: int
    new_questions: int
    updated_questions: int
    sheet_id: str
    worksheet_name: str


@router.get(
    "/sync-stats",
    response_model=DatasetStatsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current database question count and preview incoming sheet stats",
)
def get_dataset_stats_endpoint(
    worksheet_name: str = Query(default="questions"),
    sheet_id: str | None = Query(default=None),
    admin_user: dict = Depends(require_admin),
) -> dict[str, Any]:
    """
    Returns live statistics comparing current Supabase database questions
    with the source Google Sheet.
    """
    from app.core.config import settings
    from app.core.supabase import supabase
    from app.services.sync_dataset import get_existing_question_ids

    # 1. Supabase database total count
    res = supabase.table("questions").select("id", count="exact").execute()
    current_db_count = res.count if res.count is not None else 0

    # 2. Existing IDs in Supabase
    existing_ids = get_existing_question_ids()

    # 3. Sheet data
    active_sheet_id = sheet_id or settings.google_sheet_id or ""
    incoming_count = 0
    new_count = 0
    updated_count = 0

    if active_sheet_id:
        try:
            df = download_worksheet_csv(
                sheet_id=active_sheet_id,
                worksheet_name=worksheet_name,
                timeout=20.0,
            )
            if "question_id" in df.columns:
                incoming_qids = set(
                    df["question_id"].dropna().astype(str).str.strip().tolist()
                )
                incoming_count = len(df)
                new_count = len(incoming_qids - existing_ids)
                updated_count = len(incoming_qids.intersection(existing_ids))
            else:
                incoming_count = len(df)
        except Exception as exc:
            logger.warning("Could not pre-fetch sheet stats: %s", exc)

    return {
        "current_db_count": current_db_count,
        "incoming_sheet_count": incoming_count,
        "new_questions": new_count,
        "updated_questions": updated_count,
        "sheet_id": active_sheet_id,
        "worksheet_name": worksheet_name,
    }


@router.post(
    "/sync-dataset",
    response_model=SyncDatasetResponse,
    status_code=status.HTTP_200_OK,
    summary="Synchronize Google Sheets dataset with Supabase questions table",
)
def sync_dataset_endpoint(
    worksheet_name: str = Query(
        default="questions",
        description="Name of the Google Sheets worksheet/tab to sync",
    ),
    sheet_id: str | None = Query(
        default=None,
        description="Optional Google Sheet ID override. Defaults to GOOGLE_SHEET_ID env var.",
    ),
    dry_run: bool = Query(
        default=False,
        description="If True, validates and calculates sync plan without writing to database.",
    ),
    admin_user: dict = Depends(require_admin),
) -> dict[str, Any]:
    """
    Production dataset sync flow:
    1. Reads GOOGLE_SHEET_ID from environment.
    2. Downloads worksheet as CSV using the worksheet name.
    3. Runs schema & data integrity validation.
    4. Upserts records into Supabase on_conflict='question_id'.
    5. Returns counts of inserted, updated, and total records.
    """
    caller_id = admin_user.get("sub") or admin_user.get("user_id") or "admin"
    start_time = time.perf_counter()

    logger.info(
        "Sync started by admin user '%s' for worksheet '%s' (dry_run=%s)",
        caller_id,
        worksheet_name,
        dry_run,
    )

    # Step 1: Download worksheet from Google Sheets
    try:
        df = download_worksheet_csv(
            sheet_id=sheet_id,
            worksheet_name=worksheet_name,
            timeout=30.0,
        )
    except DatasetSyncError as exc:
        logger.error("Sync failed during sheet download: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Failed to fetch Google Sheet: {exc}",
        ) from exc
    except Exception as exc:
        logger.error("Unexpected error downloading sheet: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error downloading dataset: {exc}",
        ) from exc

    # Step 2: Validate dataset
    validation = validate_dataset(df)
    if not validation["valid"]:
        logger.error(
            "Sync aborted: dataset validation failed with %d error(s): %s",
            len(validation["errors"]),
            validation["errors"],
        )
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "message": "Dataset validation failed",
                "errors": validation["errors"],
                "warnings": validation["warnings"],
                "total_rows": validation["total_rows"],
            },
        )

    # Step 3: Upsert into Supabase
    try:
        sync_result = sync_dataset_to_supabase(
            df=df,
            dry_run=dry_run,
        )
    except DatasetSyncError as exc:
        logger.error("Sync failed during database upsert: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database synchronization failed: {exc}",
        ) from exc
    except Exception as exc:
        logger.error("Unexpected error during database upsert: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected database error: {exc}",
        ) from exc

    total_duration = round(time.perf_counter() - start_time, 2)
    logger.info(
        "Sync completed successfully in %.2fs: %d inserted, %d updated, %d total",
        total_duration,
        sync_result["inserted"],
        sync_result["updated"],
        sync_result["total"],
    )

    return {
        "success": True,
        "inserted": sync_result["inserted"],
        "updated": sync_result["updated"],
        "total": sync_result["total"],
        "dry_run": sync_result["dry_run"],
        "duration_seconds": total_duration,
        "worksheet": worksheet_name,
    }
