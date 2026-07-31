import json
from pathlib import Path
from typing import Any

from app.core.config import settings
from app.core.logging import get_logger
from app.models.profile import UserProfile

logger = get_logger(__name__)


class ProfileService:
    """JSON dosyası üzerinden kullanıcı profilini yönetir."""

    _PLACEHOLDER_VALUES = {"", "string", "example", "sample", "default", "placeholder", "null", "none"}

    def __init__(self, storage_path: Path | None = None) -> None:
        self.storage_path = self._resolve_storage_path(storage_path)
        self.storage_path.parent.mkdir(parents=True, exist_ok=True)
        self._ensure_file()

    def _resolve_storage_path(self, storage_path: Path | None) -> Path:
        if storage_path is not None:
            resolved = Path(storage_path)
            if not resolved.is_absolute():
                resolved = (Path(__file__).resolve().parents[2] / resolved).resolve()
            return resolved

        repo_root = Path(__file__).resolve().parents[2]
        return (repo_root / settings.data_dir / "profile.json").resolve()

    def _ensure_file(self) -> None:
        if not self.storage_path.exists():
            self.storage_path.write_text("{}", encoding="utf-8")
            logger.info("Created new profile file at %s", self.storage_path)

    def _load_profile_data(self) -> dict[str, Any]:
        raw_content = self.storage_path.read_text(encoding="utf-8").strip()
        if not raw_content:
            self.storage_path.write_text("{}", encoding="utf-8")
            return {}

        try:
            data = json.loads(raw_content)
        except json.JSONDecodeError as exc:
            logger.warning("Profile file is invalid JSON, resetting it: %s", exc)
            self.storage_path.write_text("{}", encoding="utf-8")
            return {}

        if not isinstance(data, dict):
            logger.warning("Profile file content is not an object, resetting it")
            self.storage_path.write_text("{}", encoding="utf-8")
            return {}

        return data

    def get_profile(self) -> UserProfile:
        data = self._load_profile_data()
        return UserProfile(**data)

    def _sanitize_profile_payload(self, profile_data: dict[str, Any]) -> dict[str, Any]:
        sanitized: dict[str, Any] = {}

        for key, value in profile_data.items():
            if value is None:
                continue

            if isinstance(value, str):
                normalized = value.strip()
                if not normalized:
                    continue
                lowered = normalized.lower()
                if lowered in self._PLACEHOLDER_VALUES:
                    continue
                if lowered.startswith("example") or lowered.startswith("sample"):
                    continue
                sanitized[key] = normalized
                continue

            if isinstance(value, int):
                if value <= 0:
                    continue
                sanitized[key] = value
                continue

            if isinstance(value, list):
                cleaned = [item for item in value if item is not None]
                if cleaned:
                    sanitized[key] = cleaned
                continue

            if isinstance(value, dict):
                if value:
                    sanitized[key] = value
                continue

            sanitized[key] = value

        return sanitized

    def update_profile(self, profile_data: dict[str, Any]) -> UserProfile:
        current = self.get_profile()
        merged = current.model_dump(exclude_none=True)
        sanitized_payload = self._sanitize_profile_payload(profile_data)

        if not sanitized_payload:
            logger.info("No real profile data was supplied; keeping the existing profile intact")
            return current

        for key, value in sanitized_payload.items():
            merged[key] = value

        self.storage_path.write_text(json.dumps(merged, ensure_ascii=False, indent=2), encoding="utf-8")
        logger.info("Profile updated successfully")
        return UserProfile(**merged)


profile_service = ProfileService()
