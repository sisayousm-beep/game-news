from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "sqlite:///./data/logia.db"
    ingest_token: str = "logia-dev-token"
    frontend_origin: str = "http://localhost:3000"


settings = Settings()
