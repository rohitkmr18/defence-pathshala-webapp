from typing import Any

from fastapi import APIRouter, HTTPException

from app.core.exams import expand_exam_query, get_exam_label
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
        rows: list[dict[str, Any]] = []
        page_size = 1000
        start = 0
        while True:
            response = (
                supabase.table("v_dp_question_intelligence_v2")
                .select("exam,year,cycle,subject,topic,subtopic")
                .range(start, start + page_size - 1)
                .execute()
            )
            page = response.data or []
            rows.extend(page)
            if len(page) < page_size:
                break
            start += page_size

        exams: set[str] = set()
        years_by_exam: dict[str, set[int]] = {}
        cycles_by_exam: dict[str, set[str]] = {}
        subjects_by_exam: dict[str, dict[str, set[str]]] = {}
        subtopics_by_subject: dict[str, dict[str, set[str]]] = {}
        subject_weights: dict[str, dict[str, int]] = {}
        topic_weights: dict[str, dict[str, dict[str, int]]] = {}
        subtopic_weights: dict[str, dict[str, dict[str, int]]] = {}

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
            subtopic = _clean_text(row.get("subtopic"))

            if not subject or not topic:
                continue

            subjects_by_exam.setdefault(exam, {}).setdefault(subject, set()).add(topic)
            subject_weights.setdefault(exam, {})[subject] = subject_weights.setdefault(exam, {}).get(subject, 0) + 1
            topic_weights.setdefault(exam, {}).setdefault(subject, {})[topic] = (
                topic_weights.setdefault(exam, {}).setdefault(subject, {}).get(topic, 0) + 1
            )
            if subtopic:
                subtopics_by_subject.setdefault(subject, {}).setdefault(topic, set()).add(subtopic)
                subtopic_weights.setdefault(subject, {}).setdefault(topic, {})[subtopic] = (
                    subtopic_weights.setdefault(subject, {}).setdefault(topic, {}).get(subtopic, 0) + 1
                )

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
            subtopics={
                subject: {
                    topic: sorted(subtopics)
                    for topic, subtopics in sorted(topic_map.items())
                    if subtopics
                }
                for subject, topic_map in sorted(subtopics_by_subject.items())
            },
            subject_weights=subject_weights,
            topic_weights=topic_weights,
            subtopic_weights=subtopic_weights,
            difficulties=["Easy", "Moderate", "Hard"],
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
    subtopic: str | None = None,
    difficulty: str | None = None,
    intelligence_only: bool = False,
) -> dict[str, int]:
    try:
        query = supabase.table("v_dp_question_intelligence_v2").select("id", count="exact")

        if exam:
            expanded = expand_exam_query(exam)
            if expanded:
                query = query.in_("exam", expanded)

        if year:
            query = query.in_(
                "year",
                [int(value.strip()) for value in year.split(",") if value.strip() and value.strip().isdigit()],
            )

        if cycle:
            cycles = [value.strip() for value in cycle.split(",") if value.strip()]
            if cycles:
                if "I" in cycles:
                    cycle_list = ",".join(cycles)
                    query = query.or_(f"cycle.in.({cycle_list}),cycle.is.null")
                else:
                    query = query.in_("cycle", cycles)

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

        if subtopic:
            query = query.in_(
                "subtopic",
                [value.strip() for value in subtopic.split(",") if value.strip()],
            )

        if difficulty:
            query = query.in_(
                "difficulty_category",
                [value.strip() for value in difficulty.split(",") if value.strip()],
            )

        if intelligence_only:
            query = query.eq("intelligence_eligible", True)

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
    subtopic: str | None = None,
    difficulty: str | None = None,
    intelligence_only: bool = False,
    limit: int = 150,
) -> dict[str, Any]:
    try:
        query = supabase.table("v_dp_question_intelligence_v2").select("*")

        if exam:
            expanded = expand_exam_query(exam)
            if expanded:
                query = query.in_("exam", expanded)

        if year:
            query = query.in_(
                "year",
                [int(value.strip()) for value in year.split(",") if value.strip() and value.strip().isdigit()],
            )

        if cycle:
            cycles = [value.strip() for value in cycle.split(",") if value.strip()]
            if cycles:
                if "I" in cycles:
                    cycle_list = ",".join(cycles)
                    query = query.or_(f"cycle.in.({cycle_list}),cycle.is.null")
                else:
                    query = query.in_("cycle", cycles)

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

        if subtopic:
            query = query.in_(
                "subtopic",
                [value.strip() for value in subtopic.split(",") if value.strip()],
            )

        if difficulty:
            query = query.in_(
                "difficulty_category",
                [value.strip() for value in difficulty.split(",") if value.strip()],
            )

        if intelligence_only:
            query = query.eq("intelligence_eligible", True)

        query = query.order("q_num").limit(limit)
        response = query.execute()
        rows = response.data or []
        return {"questions": rows, "total": len(rows)}

    except Exception as exc:  # pragma: no cover - defensive: surfaced via FastAPI
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/distribution")
def get_practice_distribution(
    group_by: str = "year",
    exam: str | None = None,
    year: str | None = None,
    cycle: str | None = None,
    subject: str | None = None,
    topic: str | None = None,
) -> dict[str, Any]:
    try:
        query = supabase.table("v_dp_question_intelligence_v2").select("id,question_id,exam,year,cycle")

        if exam:
            expanded = expand_exam_query(exam)
            if expanded:
                query = query.in_("exam", expanded)

        if year:
            query = query.in_(
                "year",
                [int(value.strip()) for value in year.split(",") if value.strip() and value.strip().isdigit()],
            )

        if cycle:
            cycles = [value.strip() for value in cycle.split(",") if value.strip()]
            if cycles:
                if "I" in cycles:
                    cycle_list = ",".join(cycles)
                    query = query.or_(f"cycle.in.({cycle_list}),cycle.is.null")
                else:
                    query = query.in_("cycle", cycles)

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
        rows = response.data or []

        counts: dict[str, int] = {}
        for row in rows:
            key_val = str(row.get(group_by) or "Unknown")
            counts[key_val] = counts.get(key_val, 0) + 1

        return {
            "groupBy": group_by,
            "data": [{"label": k, "count": v} for k, v in sorted(counts.items())],
            "total": len(rows),
        }

    except Exception as exc:  # pragma: no cover - defensive: surfaced via FastAPI
        raise HTTPException(status_code=500, detail=str(exc)) from exc

