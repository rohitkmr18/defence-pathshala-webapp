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


@router.get("/count")
def get_practice_count(
    exam: str | None = None,
    year: str | None = None,
    cycle: str | None = None,
    subject: str | None = None,
    topic: str | None = None,
) -> dict[str, int]:
    try:
        query = supabase.table("questions").select("id", count="exact")

        if exam:
            exam_vals = [value.strip() for value in exam.split(",") if value.strip()]
            expanded = []
            for e in exam_vals:
                expanded.append(e)
                if " " in e:
                    expanded.append(e.replace(" ", "-"))
                if "-" in e:
                    expanded.append(e.replace("-", " "))
            query = query.in_("exam", list(set(expanded)))

        if year:
            query = query.in_(
                "year",
                [int(value.strip()) for value in year.split(",") if value.strip() and value.strip().isdigit()],
            )

        if cycle:
            query = query.in_(
                "cycle",
                [value.strip() for value in cycle.split(",") if value.strip()],
            )

        if subject:
            query = query.in_(
                "subject",
                [value.strip() for value in subject.split(",") if value.strip()],
            )

        if topic:
            query = query.in_(
                "topic",
                [value.strip() for value in topic.split(",") if value.strip()],
            )

        response = query.execute()
        return {"count": response.count or 0}

    except Exception as exc:  # pragma: no cover - defensive: surfaced via FastAPI
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/questions")
def get_practice_questions(
    exam: str | None = None,
    year: str | None = None,
    cycle: str | None = None,
    subject: str | None = None,
    topic: str | None = None,
    limit: int = 150,
) -> dict[str, Any]:
    try:
        query = supabase.table("questions").select("*")

        if exam:
            exam_vals = [value.strip() for value in exam.split(",") if value.strip()]
            expanded = []
            for e in exam_vals:
                expanded.append(e)
                if " " in e:
                    expanded.append(e.replace(" ", "-"))
                if "-" in e:
                    expanded.append(e.replace("-", " "))
            query = query.in_("exam", list(set(expanded)))

        if year:
            query = query.in_(
                "year",
                [int(value.strip()) for value in year.split(",") if value.strip() and value.strip().isdigit()],
            )

        if cycle:
            query = query.in_(
                "cycle",
                [value.strip() for value in cycle.split(",") if value.strip()],
            )

        if subject:
            query = query.in_(
                "subject",
                [value.strip() for value in subject.split(",") if value.strip()],
            )

        if topic:
            query = query.in_(
                "topic",
                [value.strip() for value in topic.split(",") if value.strip()],
            )

        query = query.order("q_num").limit(limit)
        response = query.execute()
        rows = response.data or []
        return {"questions": rows, "total": len(rows)}

    except Exception as exc:  # pragma: no cover - defensive: surfaced via FastAPI
        raise HTTPException(status_code=500, detail=str(exc)) from exc

