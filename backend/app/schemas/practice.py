from pydantic import BaseModel, Field


class PracticeFiltersResponse(BaseModel):
    exams: list[str]
    years: dict[str, list[int]]
    cycles: dict[str, list[str]]
    subjects: dict[str, dict[str, list[str]]]
    subtopics: dict[str, dict[str, list[str]]] = Field(default_factory=dict)
    subject_weights: dict[str, dict[str, int]] = Field(default_factory=dict)
    topic_weights: dict[str, dict[str, dict[str, int]]] = Field(default_factory=dict)
    subtopic_weights: dict[str, dict[str, dict[str, int]]] = Field(default_factory=dict)
    difficulties: list[str] = Field(default_factory=lambda: ["Easy", "Moderate", "Hard"])
