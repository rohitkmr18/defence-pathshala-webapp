from typing import Any

from fastapi import APIRouter, HTTPException

from app.core.supabase import supabase
from app.schemas.practice import PracticeFiltersResponse

router = APIRouter(prefix="/practice", tags=["Practice"])


def _clean_text(value: Any) -> str | None:
    if value is None:
        return None

    cleaned = str(value).strip()
    return cleaned or None


@router.get("/filters", response_model=PracticeFiltersResponse)
def get_practice_filters() -> PracticeFiltersResponse:
    try:
        response = (
            supabase.table("questions")
            .select("exam,year,cycle,subject,topic")
            .execute()
        )

        rows = response.data or []

        exams: set[str] = set()
        years_by_exam: dict[str, set[int]] = {}
        cycles_by_exam: dict[str, set[str]] = {}
        subjects_by_exam: dict[str, dict[str, set[str]]] = {}

        for row in rows:
            exam = _clean_text(row.get("exam"))
            if not exam:
                continue

            exams.add(exam)

            year_value = row.get("year")
            if year_value is not None:
                try:
                    year = int(year_value)
                except (TypeError, ValueError):
                    year = None

                if year is not None:
                    years_by_exam.setdefault(exam, set()).add(year)

            cycle = _clean_text(row.get("cycle"))
            if cycle:
                cycles_by_exam.setdefault(exam, set()).add(cycle)

            subject = _clean_text(row.get("subject"))
            topic = _clean_text(row.get("topic"))

            if not subject or not topic:
                continue

            subjects_by_exam.setdefault(exam, {}).setdefault(subject, set()).add(topic)

        return PracticeFiltersResponse(
            exams=sorted(exams),
            years={
                exam: sorted(years, reverse=True)
                for exam, years in sorted(years_by_exam.items())
            },
            cycles={
                exam: sorted(cycles)
                for exam, cycles in sorted(cycles_by_exam.items())
            },
            subjects={
                exam: {
                    subject: sorted(topics)
                    for subject, topics in sorted(subjects.items())
                    if topics
                }
                for exam, subjects in sorted(subjects_by_exam.items())
            },
        )

    except Exception as exc:  # pragma: no cover - defensive: surfaced via FastAPI
        raise HTTPException(status_code=500, detail=str(exc)) from exc
