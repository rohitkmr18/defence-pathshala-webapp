from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_practice_filters_structure() -> None:
    response = client.get("/practice/filters")
    assert response.status_code == 200

    data = response.json()
    assert "exams" in data
    assert "years" in data
    assert "cycles" in data
    assert "subjects" in data
    assert "subtopics" in data
    assert "difficulties" in data
    assert isinstance(data["exams"], list)
    assert isinstance(data["subtopics"], dict)
    assert set(data["difficulties"]) == {"Easy", "Moderate", "Hard"}


def test_practice_count_endpoint() -> None:
    response = client.get("/practice/count?exam=CDS")
    assert response.status_code == 200

    data = response.json()
    assert "count" in data
    assert isinstance(data["count"], int)
    assert data["count"] >= 0


def test_practice_questions_endpoint() -> None:
    response = client.get("/practice/questions?exam=CDS&limit=5")
    assert response.status_code == 200

    data = response.json()
    assert "questions" in data
    assert "total" in data
    assert isinstance(data["questions"], list)
    assert data["total"] == len(data["questions"])


def test_practice_questions_intelligence_only() -> None:
    response = client.get("/practice/questions?exam=CDS&intelligence_only=true&limit=5")
    assert response.status_code == 200

    data = response.json()
    assert "questions" in data
    assert isinstance(data["questions"], list)
