"""
Exam canonical mapping utilities.
Ensures generic mapping between database values (e.g. 'CAPF-AC') and UI labels (e.g. 'CAPF').
"""

from typing import Iterable

EXAM_DB_TO_LABEL: dict[str, str] = {
    "CAPF-AC": "CAPF",
    "CAPF AC": "CAPF",
    "CAPF": "CAPF",
    "CDS": "CDS",
    "NDA": "NDA",
    "AFCAT": "AFCAT",
}

EXAM_LABEL_TO_DB: dict[str, str] = {
    "CAPF": "CAPF-AC",
    "CAPF AC": "CAPF-AC",
    "CAPF-AC": "CAPF-AC",
    "CDS": "CDS",
    "NDA": "NDA",
    "AFCAT": "AFCAT",
}


def get_exam_label(exam_db: str | None) -> str:
    """Returns the clean display label for an exam DB value (e.g. 'CAPF-AC' -> 'CAPF')."""
    if not exam_db:
        return ""
    cleaned = str(exam_db).strip()
    upper = cleaned.upper()
    if upper in EXAM_DB_TO_LABEL:
        return EXAM_DB_TO_LABEL[upper]
    # Generic fallback: strip -AC suffix if present
    if upper.endswith("-AC"):
        return cleaned[:-3].strip()
    if upper.endswith(" AC"):
        return cleaned[:-3].strip()
    return cleaned


def get_exam_db_value(exam_ui: str | None) -> str:
    """Returns canonical database value for an exam (e.g. 'CAPF' -> 'CAPF-AC')."""
    if not exam_ui:
        return ""
    cleaned = str(exam_ui).strip()
    upper = cleaned.upper()
    if upper in EXAM_LABEL_TO_DB:
        return EXAM_LABEL_TO_DB[upper]
    return cleaned


def expand_exam_query(exam_param: str | Iterable[str] | None) -> list[str]:
    """
    Expands an exam filter parameter (string or iterable) into all recognized
    canonical and alias variations (e.g. 'CAPF' -> ['CAPF-AC', 'CAPF', 'CAPF AC']).
    """
    if not exam_param:
        return []

    if isinstance(exam_param, str):
        raw_items = [item.strip() for item in exam_param.split(",") if item.strip()]
    else:
        raw_items = [str(item).strip() for item in exam_param if str(item).strip()]

    expanded: set[str] = set()
    for item in raw_items:
        expanded.add(item)
        db_val = get_exam_db_value(item)
        if db_val:
            expanded.add(db_val)
        label_val = get_exam_label(item)
        if label_val:
            expanded.add(label_val)
        if " " in item:
            expanded.add(item.replace(" ", "-"))
        if "-" in item:
            expanded.add(item.replace("-", " "))

    return sorted(expanded)
