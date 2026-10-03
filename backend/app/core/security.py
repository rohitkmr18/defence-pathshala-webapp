from functools import lru_cache
from hmac import compare_digest

import jwt
from fastapi import Depends, Header, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWKClient

from app.core.config import settings


security = HTTPBearer()
security_optional = HTTPBearer(auto_error=False)

JWKS_URL = f"{settings.supabase_url}/auth/v1/.well-known/jwks.json"
ISSUER = f"{settings.supabase_url}/auth/v1"


@lru_cache
def get_jwks_client() -> PyJWKClient:
    return PyJWKClient(JWKS_URL)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    token = credentials.credentials

    # Allow service role key directly as bearer token
    if settings.supabase_service_role_key and token == settings.supabase_service_role_key:
        return {"sub": "service_role", "role": "service_role", "email": "service_role@supabase"}

    try:
        signing_key = get_jwks_client().get_signing_key_from_jwt(token)

        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256", "HS256"],
            audience="authenticated",
            issuer=ISSUER,
        )

        return payload

    except jwt.PyJWTError:
        # Fallback to HS256 with supabase_jwt_secret if asymmetric fails
        try:
            payload = jwt.decode(
                token,
                settings.supabase_jwt_secret,
                algorithms=["HS256"],
                audience="authenticated",
                issuer=ISSUER,
            )
            return payload
        except jwt.PyJWTError as exc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            ) from exc


def require_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(security_optional),
    x_admin_key: str | None = Header(default=None, alias="X-Admin-Key"),
) -> dict:
    """
    Requires the caller to be an authenticated administrator.
    Accepts:
    1. Bearer token matching SUPABASE_SERVICE_ROLE_KEY (server-to-server).
    2. Valid Supabase JWT with role == 'admin' in public.profiles.
    """
    # The Next.js proxy uses this server-only header, never browser credentials.
    if x_admin_key:
        expected = settings.admin_api_key or settings.supabase_service_role_key
        if expected and compare_digest(x_admin_key, expected):
            return {"sub": "admin_proxy", "role": "admin"}
        raise HTTPException(status_code=401, detail="Invalid admin credentials")

    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Provide a Bearer token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Decode and verify user
    user = get_current_user(credentials)

    # Allow service role key
    if user.get("role") == "service_role":
        return user

    # Check profiles table for application-level admin role
    user_id = user.get("sub")
    if user_id:
        try:
            from app.core.supabase import supabase
            res = supabase.table("profiles").select("role").eq("id", user_id).execute()
            if res.data and res.data[0].get("role") == "admin":
                return user
        except Exception:
            pass

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Admin privileges required to access this resource.",
    )

