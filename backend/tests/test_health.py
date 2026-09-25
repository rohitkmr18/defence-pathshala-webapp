from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_check() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "pyq-intelligence-api",
        "version": "0.1.0",
    }


def test_analytics_dashboard() -> None:
    response = client.get("/analytics/dashboard")

    assert response.status_code == 200

    data = response.json()
    assert set(data.keys()) == {
        "question_bank",
        "subjects",
        "exams",
        "years",
        "questions_attempted",
        "accuracy",
        "current_streak",
        "avoidable_marks",
    }
    assert isinstance(data["question_bank"], int)
    assert isinstance(data["subjects"], int)
    assert isinstance(data["exams"], int)
    assert isinstance(data["years"], int)
    assert data["questions_attempted"] == 0
    assert data["accuracy"] == 0
    assert data["current_streak"] == 0
    assert data["avoidable_marks"] == 0