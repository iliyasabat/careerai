from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+asyncpg://careeros:careeros@localhost:5432/careeros"
    redis_url: str = "redis://localhost:6379/0"
    secret_key: str = "changeme-in-production"
    frontend_url: str = "http://localhost:5173"

    anthropic_api_key: str | None = None
    adzuna_app_id: str | None = None
    adzuna_app_key: str | None = None
    rapidapi_key: str | None = None
    tavily_api_key: str | None = None
    gmail_client_id: str | None = None
    gmail_client_secret: str | None = None


settings = Settings()
