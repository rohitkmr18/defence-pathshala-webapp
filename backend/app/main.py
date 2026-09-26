import os
import traceback

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.api.analytics import router as analytics_router
from app.api.routes.practice import router as practice_router
from app.core.security import get_current_user
from app.core.supabase import supabase
from app.schemas.profile import ProfileUpdate

app = FastAPI(
    title="Defence Pathshala PYQ Intelligence API",
    version="0.1.0",
)

@app.get("/")
def root():
    return {
        "service": "Defence Pathshala PYQ Intelligence API",
        "status": "online",
        "version": "0.1.0",
        "docs": "/docs",
        "health": "/health",
    }
# -----------------------------
# Middleware
# -----------------------------

allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Routers
# -----------------------------

app.include_router(analytics_router)
app.include_router(practice_router)

# -----------------------------
# Health
# -----------------------------

@app.get("/health")
def health_check() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "pyq-intelligence-api",
        "version": "0.1.0",
    }

# -----------------------------
# Authentication
# -----------------------------

@app.get("/me")
def get_me(current_user: dict = Depends(get_current_user)) -> dict:
    return {
        "user_id": current_user.get("sub"),
        "email": current_user.get("email"),
        "role": current_user.get("role"),
    }

# -----------------------------
# Profile
# -----------------------------

@app.get("/profile")
def get_profile(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("sub")

    try:
        # Fetch profile
        profile = (
            supabase.table("profiles")
            .select("id, full_name, target_year, onboarding_completed")
            .eq("id", user_id)
            .execute()
        )

        # Auto-create profile if missing
        if not profile.data:
            supabase.table("profiles").insert(
                {
                    "id": user_id,
                    "role": "student",
                    "full_name": None,
                    "target_year": None,
                    "onboarding_completed": False,
                }
            ).execute()

            profile = (
                supabase.table("profiles")
                .select("id, full_name, target_year, onboarding_completed")
                .eq("id", user_id)
                .execute()
            )

        # Fetch exam preferences
        exams = (
            supabase.table("user_exam_preferences")
            .select("exam")
            .eq("user_id", user_id)
            .execute()
        )

        return {
            "id": profile.data[0]["id"],
            "full_name": profile.data[0]["full_name"],
            "target_year": profile.data[0]["target_year"],
            "onboarding_completed": profile.data[0]["onboarding_completed"],
            "target_exams": [item["exam"] for item in exams.data],
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.patch("/profile")
def update_profile(
    payload: ProfileUpdate,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user.get("sub")

    try:
        # Update profile
        supabase.table("profiles").update(
            {
                "full_name": payload.full_name,
                "target_year": payload.target_year,
                "onboarding_completed": True,
            }
        ).eq("id", user_id).execute()

        # Replace exam preferences
        supabase.table("user_exam_preferences").delete().eq(
            "user_id",
            user_id,
        ).execute()

        if payload.target_exams:
            rows = [
                {"user_id": user_id, "exam": exam}
                for exam in payload.target_exams
            ]

            supabase.table("user_exam_preferences").insert(rows).execute()

        return {"success": True}

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
