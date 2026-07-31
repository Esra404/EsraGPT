import logging
from pathlib import Path

from app.core.config import settings


def get_logger(name: str) -> logging.Logger:
    """Proje genelinde kullanılacak logger oluşturur."""
    settings.log_dir.mkdir(parents=True, exist_ok=True)
    logger = logging.getLogger(name)
    if not logger.handlers:
        handler = logging.FileHandler(settings.log_dir / "app.log", encoding="utf-8")
        handler.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s - %(name)s - %(message)s"))
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
    return logger
