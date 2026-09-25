from collections import Counter
from typing import Optional

from fastapi import APIRouter, HTTPException
from app.core.supabase import supabase

EXAM_ALIASES = {
    "CAPF": "CAPF-AC",
    "CAPF-AC": "CAPF-AC",
    "CDS": "CDS",
    "NDA": "NDA",
    "AFCAT": "AFCAT",
}

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


@router.get("/overview")
def overview():
    try:
        # One fetch from Supabase
        response = (
            supabase.table("questions")
            .select("exam,year,subject,difficulty_category", count="exact")
            .execute()
        )

        rows = response.data or []

        difficulty = {
            "Easy": 0,
            "Moderate": 0,
            "Hard": 0,
        }

        for row in rows:
            category = row.get("difficulty_category")
            if category in difficulty:
                difficulty[category] += 1

        return {
            "question_bank": response.count or 0,
            "subjects": len({r["subject"] for r in rows if r["subject"]}),
            "exams": len({r["exam"] for r in rows if r["exam"]}),
            "years": len({r["year"] for r in rows if r["year"]}),
            "difficulty": difficulty,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/dashboard")
def dashboard():
    try:
        response = (
            supabase.table("questions")
            .select("exam,year,subject", count="exact")
            .execute()
        )

        rows = response.data or []
        total_questions = response.count or len(rows)
        total_subjects = len({r["subject"] for r in rows if r.get("subject")})
        total_exams = len({r["exam"] for r in rows if r.get("exam")})
        total_years = len({r["year"] for r in rows if r.get("year") is not None})

        return {
            "question_bank": total_questions,
            "subjects": total_subjects,
            "exams": total_exams,
            "years": total_years,
            "questions_attempted": 0,
            "accuracy": 0,
            "current_streak": 0,
            "avoidable_marks": 0,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/question-bank")
def question_bank(
    exam: Optional[str] = None,
    year: Optional[str] = None,
    cycle: Optional[str] = None,
):
    try:
        query = supabase.table("questions").select(
            "exam,year,cycle,subject,topic,q_type,q_pattern,difficulty_category"
        )

        if exam:
            exams = [
                EXAM_ALIASES.get(value.strip().upper(), value.strip())
                for value in exam.split(",")
                if value.strip()
            ]
            if exams:
                query = query.in_("exam", exams)

        if year:
            years = [
                int(value.strip())
                for value in year.split(",")
                if value.strip()
            ]
            if years:
                query = query.in_("year", years)

        if cycle:
            cycles = [value.strip() for value in cycle.split(",") if value.strip()]
            if cycles:
                query = query.in_("cycle", cycles)

        response = query.execute()
        rows = response.data or []

        total = len(rows)

        subject_counter = Counter()
        difficulty_counter = Counter()
        question_type_counter = Counter()
        question_pattern_counter = Counter()
        topic_counter = Counter()

        for row in rows:
            if row.get("subject"):
                subject_counter[row["subject"]] += 1

            if row.get("difficulty_category"):
                difficulty_counter[row["difficulty_category"]] += 1

            if row.get("q_type"):
                question_type_counter[row["q_type"]] += 1

            if row.get("q_pattern"):
                question_pattern_counter[row["q_pattern"]] += 1

            if row.get("topic"):
                topic_counter[row["topic"]] += 1

        return {
            "summary": {
                "questions": total,
                "subjects": len(subject_counter),
                "exam": exam,
                "year": year,
                "cycle": cycle,
            },
            "subjects": [
                {"name": key, "value": value}
                for key, value in subject_counter.most_common()
            ],
            "difficulty": [
                {"name": key, "value": value}
                for key, value in difficulty_counter.items()
            ],
            "questionTypes": [
                {"name": key, "value": value}
                for key, value in question_type_counter.most_common()
            ],
            "questionPatterns": [
                {"name": key, "value": value}
                for key, value in question_pattern_counter.most_common()
            ],
            "topics": [
                {"name": key, "value": value}
                for key, value in topic_counter.most_common(20)
            ],
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/question-bank/meta")
def question_bank_meta():
    try:
        response = (
            supabase.table("questions")
            .select("exam,year,cycle")
            .execute()
        )

        exams = {}

        for row in response.data or []:
            exam = row.get("exam")
            year = row.get("year")
            cycle = row.get("cycle")

            if not exam:
                continue

            if exam not in exams:
                exams[exam] = {
                    "value": exam,
                    "label": exam.replace("-AC", " AC"),
                    "years": set(),
                    "cycles": set(),
                }

            if year is not None:
                exams[exam]["years"].add(int(year))

            if cycle:
                exams[exam]["cycles"].add(cycle)

        result = []

        for exam in sorted(exams.keys()):
            result.append({
                "value": exams[exam]["value"],
                "label": exams[exam]["label"],
                "years": sorted(exams[exam]["years"]),
                "cycles": sorted(exams[exam]["cycles"]),
            })

        return {"exams": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/subjects")
def subjects():
    try:
        response = (
            supabase.table("questions")
            .select("subject")
            .execute()
        )

        counts = {}

        for row in response.data or []:
            subject = row.get("subject")
            if subject:
                counts[subject] = counts.get(subject, 0) + 1

        return [
            {"subject": subject, "questions": count}
            for subject, count in sorted(
                counts.items(),
                key=lambda x: x[1],
                reverse=True,
            )
        ]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/debug/questions")
def debug_questions():
    response = (
        supabase.table("questions")
        .select("exam,year,cycle")
        .limit(20)
        .execute()
    )

    return response.data

@router.get("/debug/exams")
def debug_exams():
    response = (
        supabase.table("questions")
        .select("exam,year")
        .execute()
    )

    exams = sorted({str(r["exam"]) for r in response.data if r.get("exam")})
    years = sorted({str(r["year"]) for r in response.data if r.get("year")})

    return {
        "exams": exams,
        "years": years,
    }    
