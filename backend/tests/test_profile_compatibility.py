from types import SimpleNamespace
from fastapi.testclient import TestClient
from app.main import app
from app.core.security import get_current_user
import app.main as main


def test_legacy_profile_writer_is_retired_without_any_database_writes(monkeypatch):
    class NoDatabase:
        def table(self, name):
            raise AssertionError("Legacy writer must not touch the database")

    monkeypatch.setattr(main, "supabase", NoDatabase())
    app.dependency_overrides[get_current_user] = lambda: {"sub": "test-user"}
    try:
        response = TestClient(app).patch("/profile", json={"target_exams": ["CDS"]})
        assert response.status_code == 410
        assert "/api/onboarding" in response.json()["detail"]
    finally:
        app.dependency_overrides.pop(get_current_user, None)


def test_legacy_profile_reader_does_not_create_a_missing_row(monkeypatch):
    class ReadOnly:
        def table(self, name):
            assert name == "profiles"
            return self

        def select(self, fields):
            return self

        def eq(self, field, value):
            assert field == "id" and value == "test-user"
            return self

        def execute(self):
            return SimpleNamespace(data=[])

    monkeypatch.setattr(main, "supabase", ReadOnly())
    app.dependency_overrides[get_current_user] = lambda: {"sub": "test-user"}
    try:
        response = TestClient(app).get("/profile")
        assert response.status_code == 200
        assert response.json()["onboarding_completed"] is False
        assert response.json()["target_exams"] == []
    finally:
        app.dependency_overrides.pop(get_current_user, None)
