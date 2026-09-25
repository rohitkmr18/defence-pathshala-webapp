from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Existing auth settings
    supabase_url: str = Field(alias="https://afhwegrxnvgsqbqadvwr.supabase.co/rest/v1/")
    supabase_jwt_secret: str = Field(alias="SUPABASE_JWT_SECRET")

    # New backend-only key
    supabase_service_role_key: str = Field(alias="SUPABASE_SERVICE_ROLE_KEY")

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore",  # Ignore unrelated env variables
    )


settings = Settings()