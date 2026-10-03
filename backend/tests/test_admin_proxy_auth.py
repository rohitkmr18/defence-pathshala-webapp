from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

client = TestClient(app)


def test_admin_proxy_header_contract(monkeypatch):
    monkeypatch.setattr(settings, "admin_api_key", "offline-dedicated-admin-key")
    monkeypatch.setattr("app.api.routes.admin.download_worksheet_csv", lambda **kwargs: (_ for _ in ()).throw(RuntimeError("offline-only")))
    assert client.get("/admin/sync-stats", headers={"X-Admin-Key": "wrong"}).status_code == 401
    assert client.get("/admin/sync-stats", headers={"X-Admin-Key": "offline-dedicated-admin-key"}).status_code != 401
    assert client.get("/admin/sync-stats").status_code == 401


def test_old_service_key_header_rejected_when_dedicated_key_is_set(monkeypatch):
    monkeypatch.setattr(settings, "admin_api_key", "offline-dedicated-admin-key")
    assert client.get("/admin/sync-stats", headers={"X-Admin-Key": settings.supabase_service_role_key}).status_code == 401
