from pathlib import Path
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_PATH = Path(__file__).resolve().parent.parent.parent / ".env"


class Settings(BaseSettings):
    # Existing auth settings
    supabase_url: str = Field(alias="SUPABASE_URL")
    supabase_jwt_secret: str = Field(alias="SUPABASE_JWT_SECRET")

    # Backend-only key
    supabase_service_role_key: str = Field(alias="SUPABASE_SERVICE_ROLE_KEY")

    # Google Sheets Dataset Sync
    google_sheet_id: str | None = Field(default=None, alias="GOOGLE_SHEET_ID")
    admin_api_key: str | None = Field(default=None, alias="ADMIN_API_KEY")

    model_config = SettingsConfigDict(
        env_file=(".env", str(ENV_PATH)),
        case_sensitive=False,
        extra="ignore",  # Ignore unrelated env variables
    )


settings = Settings()

