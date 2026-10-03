from pydantic import BaseModel, Field


class PracticeFiltersResponse(BaseModel):
    exams: list[str]
    years: dict[str, list[int]]
    cycles: dict[str, list[str]]
    subjects: dict[str, dict[str, list[str]]]
    subtopics: dict[str, dict[str, list[str]]] = Field(default_factory=dict)
    difficulties: list[str] = Field(default_factory=lambda: ["Easy", "Moderate", "Hard"])
