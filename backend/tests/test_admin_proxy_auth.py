from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

client = TestClient(app)


def test_legacy_admin_header_cannot_activate_an_exposed_key(monkeypatch):
    monkeypatch.setattr(settings, "admin_api_key", "offline-legacy-key")
    assert client.get("/admin/sync-stats", headers={"X-Admin-Key": "offline-legacy-key"}).status_code == 401
    assert client.get("/admin/sync-stats", headers={"X-Admin-Key": settings.supabase_service_role_key}).status_code == 401


def test_missing_bearer_is_denied():
    assert client.get("/admin/sync-stats").status_code == 401
