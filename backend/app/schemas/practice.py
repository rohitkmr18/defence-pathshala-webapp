from pydantic import BaseModel


class PracticeFiltersResponse(BaseModel):
    exams: list[str]
    years: dict[str, list[int]]
    cycles: dict[str, list[str]]
    subjects: dict[str, dict[str, list[str]]]
