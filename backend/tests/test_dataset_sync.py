"""
Tests for Google Sheets -> Supabase Dataset Sync System.
"""

from __future__ import annotations

import pandas as pd
import pytest
from fastapi.testclient import TestClient

from app.core.config import settings
from app.main import app
from app.services.sync_dataset import (
    DatasetSyncError,
    download_worksheet_csv,
    normalize_questions_dataframe,
)
from app.services.validate_dataset import validate_dataset

client = TestClient(app)


def create_sample_row(**overrides) -> dict:
    row = {
        "question_id": "TEST_2025_P1_001",
        "exam": "CDS",
        "year": 2025,
        "cycle": "I",
        "paper": "Paper 1",
        "q_num": 1,
        "subject": "Polity",
        "topic": "Fundamental Rights",
        "subtopic": "Article 21",
        "theme": "Constitutional Law",
        "question": "Which article guarantees protection of life and personal liberty?",
        "opt_a": "Article 19",
        "opt_b": "Article 21",
        "opt_c": "Article 22",
        "opt_d": "Article 23",
        "q_type": "Factual",
        "q_pattern": "Single MCQ",
        "llm_opt": "B",
        "official_opt": "B",
        "final_opt": "B",
        "key_discrepancy": False,
        "explanation": "Article 21 guarantees protection of life and personal liberty.",
        "source": "Official UPSC",
        "is_negative": True,
        "tags": "polity, constitution",
        "verified_status": "Verified",
        "static_current_link": "Static",
        "difficulty_score": 45.0,
        "difficulty_category": "Moderate",
    }
    row.update(overrides)
    return row


# -----------------------------------------------------------------------------
# 1. Validation Service Tests
# -----------------------------------------------------------------------------


def test_validate_dataset_valid() -> None:
    df = pd.DataFrame([create_sample_row()])
    result = validate_dataset(df)
    assert result["valid"] is True
    assert len(result["errors"]) == 0
    assert result["total_rows"] == 1


def test_validate_dataset_empty() -> None:
    df = pd.DataFrame()
    result = validate_dataset(df)
    assert result["valid"] is False
    assert any("empty" in e.lower() for e in result["errors"])


def test_validate_dataset_missing_columns() -> None:
    row = create_sample_row()
    del row["final_opt"]
    df = pd.DataFrame([row])
    result = validate_dataset(df)
    assert result["valid"] is False
    assert any("missing required column" in e.lower() for e in result["errors"])


def test_validate_dataset_blank_question_id() -> None:
    rows = [create_sample_row(question_id=""), create_sample_row(question_id=None)]
    df = pd.DataFrame(rows)
    result = validate_dataset(df)
    assert result["valid"] is False
    assert any("blank or null question_id" in e.lower() for e in result["errors"])


def test_validate_dataset_duplicate_question_id() -> None:
    rows = [
        create_sample_row(question_id="DUP_001", q_num=1),
        create_sample_row(question_id="DUP_001", q_num=2),
    ]
    df = pd.DataFrame(rows)
    result = validate_dataset(df)
    assert result["valid"] is False
    assert any("duplicate question_id" in e.lower() for e in result["errors"])


def test_validate_dataset_difficulty_score_out_of_bounds() -> None:
    rows = [
        create_sample_row(question_id="Q1", difficulty_score=-5),
        create_sample_row(question_id="Q2", difficulty_score=105),
    ]
    df = pd.DataFrame(rows)
    result = validate_dataset(df)
    assert result["valid"] is False
    assert any("outside 0-100" in e.lower() for e in result["errors"])


def test_validate_dataset_invalid_final_opt() -> None:
    df = pd.DataFrame([create_sample_row(final_opt="E")])
    result = validate_dataset(df)
    assert result["valid"] is False
    assert any("invalid final_opt" in e.lower() for e in result["errors"])


def test_validate_dataset_valid_drop_final_opt() -> None:
    df = pd.DataFrame([create_sample_row(final_opt="DROP")])
    result = validate_dataset(df)
    assert result["valid"] is True


def test_validate_dataset_invalid_verified_status() -> None:
    df = pd.DataFrame([create_sample_row(verified_status="FakeStatus")])
    result = validate_dataset(df)
    assert result["valid"] is False
    assert any("invalid verified_status" in e.lower() for e in result["errors"])


# -----------------------------------------------------------------------------
# 2. Data Normalization Tests
# -----------------------------------------------------------------------------


def test_normalize_questions_dataframe() -> None:
    row = create_sample_row(
        tags="polity, article 21, constitution",
        key_discrepancy="yes",
        is_negative="true",
        difficulty_score="55.5",
        extra_garbage_column="should_be_stripped",
    )
    df = pd.DataFrame([row])
    normalized = normalize_questions_dataframe(df)

    record = normalized.to_dict(orient="records")[0]
    assert record["tags"] == ["polity", "article 21", "constitution"]
    assert record["key_discrepancy"] is True
    assert record["is_negative"] is True
    assert record["difficulty_score"] == 55.5
    assert "extra_garbage_column" not in record


# -----------------------------------------------------------------------------
# 3. Endpoint Security Tests
# -----------------------------------------------------------------------------


def test_sync_dataset_unauthenticated() -> None:
    response = client.post("/admin/sync-dataset")
    assert response.status_code == 401


def test_sync_dataset_invalid_key() -> None:
    response = client.post(
        "/admin/sync-dataset",
        headers={"X-Admin-Key": "invalid_super_secret"},
    )
    assert response.status_code == 401


def test_sync_dataset_with_admin_key_dry_run() -> None:
    admin_key = settings.supabase_service_role_key
    response = client.post(
        "/admin/sync-dataset?dry_run=true",
        headers={"X-Admin-Key": admin_key},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["dry_run"] is True
    assert data["total"] >= 730
    assert "inserted" in data
    assert "updated" in data
    assert "duration_seconds" in data
