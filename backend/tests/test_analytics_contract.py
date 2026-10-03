"""Analytics must consume the same release as practice, not import/master rows."""
from fastapi.testclient import TestClient
from app.main import app
from app.api import analytics
from conftest import Query

client = TestClient(app)


def test_all_public_analytics_read_canonical_release(monkeypatch):
    tables = []

    class Boundary:
        @staticmethod
        def table(name):
            tables.append(name)
            return Query()

    monkeypatch.setattr(analytics, "supabase", Boundary())
    for path in ("overview", "dashboard", "question-bank", "question-bank/meta", "subjects", "debug/questions", "debug/exams"):
        response = client.get(f"/analytics/{path}")
        assert response.status_code == 200, (path, response.text)
    assert tables
    assert set(tables) == {"v_dp_question_intelligence_v2"}
