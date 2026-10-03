import jwt
import pytest
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from app.core import security
from app.core.config import settings


def token(issuer):
    # conftest installs an offline secret and service boundary before app import.
    return jwt.encode({"sub": "offline-learner", "aud": "authenticated", "iss": issuer},
                      settings.supabase_jwt_secret, algorithm="HS256")


def unavailable_jwks():
    raise jwt.InvalidTokenError("offline JWKS")


def test_fallback_rejects_another_project_issuer(monkeypatch):
    monkeypatch.setattr(security, "get_jwks_client", unavailable_jwks)
    with pytest.raises(HTTPException) as error:
        security.get_current_user(HTTPAuthorizationCredentials(scheme="Bearer", credentials=token("https://other.invalid/auth/v1")))
    assert error.value.status_code == 401


def test_fallback_accepts_the_configured_offline_issuer(monkeypatch):
    monkeypatch.setattr(security, "get_jwks_client", unavailable_jwks)
    user = security.get_current_user(HTTPAuthorizationCredentials(scheme="Bearer", credentials=token(security.ISSUER)))
    assert user["sub"] == "offline-learner"
