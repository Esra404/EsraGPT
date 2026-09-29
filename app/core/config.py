from pathlib import Path
from pydantic import ConfigDict
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Uygulama ayarlarını merkezi olarak yönetir."""

    model_config = ConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "EsraGPT"
    app_version: str = "0.1.0"
    debug: bool = True
    data_dir: Path = Path("app/data")
    uploads_dir: Path = Path("app/uploads")
    vector_db_dir: Path = Path("app/vector_db")
    log_dir: Path = Path("app/logs")

    nvidia_api_key: str | None = None
    nvidia_model: str = "meta/llama-3.1-8b-instruct"


settings = Settings()
