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
        query = supabase.table("questions").select("id,question_id,exam,year,cycle")

        if exam:
            expanded = expand_exam_query(exam)
            if expanded:
                query = query.in_("exam", expanded)

        if year:
            years = [
                int(value.strip())
                for value in year.split(",")
                if value.strip() and value.strip().isdigit()
            ]
            if years:
                query = query.in_("year", years)

        if subject:
            subjects = [value.strip() for value in subject.split(",") if value.strip()]
            if subjects:
                query = query.in_("subject", subjects)

        if topic:
            topics = [value.strip() for value in topic.split(",") if value.strip()]
            if topics:
                query = query.in_("topic", topics)

        # Paginate to fetch all matching rows (handling PostgREST 1000-row limit)
        page_size = 1000
        all_raw_rows: list[dict[str, Any]] = []
        start = 0
        while True:
            page_res = query.range(start, start + page_size - 1).execute()
            batch = page_res.data or []
            all_raw_rows.extend(batch)
            if len(batch) < page_size:
                break
            start += page_size

        # Deduplicate rows by question_id / id to prevent double counting
        seen_question_ids: set[str] = set()
        deduped_rows: list[dict[str, Any]] = []
        for r in all_raw_rows:
            qid = str(r.get("question_id") or r.get("id") or "")
            if qid:
                if qid in seen_question_ids:
                    continue
                seen_question_ids.add(qid)
            deduped_rows.append(r)

        # Precise cycle attribution
        filter_cycles = (
            [value.strip() for value in cycle.split(",") if value.strip()]
            if cycle
            else []
        )

        def get_effective_cycle(r: dict[str, Any]) -> str:
            raw_c = r.get("cycle")
            if raw_c:
                return str(raw_c).strip()
            # If cycle is null/empty for single-cycle exam like CAPF-AC, attribute to 'I'
            exam_name = str(r.get("exam") or "").upper()
            if "CAPF" in exam_name:
                return "I"
            return "I"

        if filter_cycles:
            rows = [r for r in deduped_rows if get_effective_cycle(r) in filter_cycles]
        else:
            rows = deduped_rows

        distribution: list[dict[str, Any]] = []

        if group_by == "cycle":
            target_cycles = filter_cycles or ["I", "II"]
            for c in target_cycles:
                count = sum(1 for r in deduped_rows if get_effective_cycle(r) == c)
                distribution.append({
                    "key": c,
                    "label": f"Cycle {c}",
                    "count": count,
                })
        elif group_by == "exam":
            target_exams = [e.strip() for e in (exam or "").split(",") if e.strip()]
            if not target_exams:
                target_exams = sorted({r.get("exam") for r in rows if r.get("exam")})
            for e in target_exams:
                expanded_e = expand_exam_query(e) or [e]
                count = sum(1 for r in rows if r.get("exam") in expanded_e or r.get("exam") == e)
                distribution.append({
                    "key": e,
                    "label": get_exam_label(e),
                    "count": count,
                })
        else:  # default "year"
            if year:
                target_years = sorted(
                    [int(y.strip()) for y in year.split(",") if y.strip() and y.strip().isdigit()],
                    reverse=True,
                )
            else:
                target_years = sorted(
                    {int(r.get("year")) for r in rows if r.get("year") is not None},
                    reverse=True,
                )
            for y in target_years:
                count = sum(1 for r in rows if r.get("year") == y)
                distribution.append({
                    "key": str(y),
                    "label": str(y),
                    "count": count,
                })

        return {"distribution": distribution, "group_by": group_by}
    except Exception as exc:  # pragma: no cover - defensive: surfaced via FastAPI
        raise HTTPException(status_code=500, detail=str(exc)) from exc


