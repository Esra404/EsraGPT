import json
from datetime import datetime, timezone
from pathlib import Path

from app.core.config import settings
from app.core.logging import get_logger
from app.models.conversation import ConversationEntry

logger = get_logger(__name__)


class ConversationService:
    """Konuşma geçmişini JSON dosyasında saklar."""

    def __init__(self, storage_path: Path | None = None) -> None:
        self.storage_path = storage_path or settings.data_dir / "conversations.json"
        self.storage_path.parent.mkdir(parents=True, exist_ok=True)
        self._ensure_file()

    def _ensure_file(self) -> None:
        if not self.storage_path.exists():
            self.storage_path.write_text("[]", encoding="utf-8")

    def save_conversation(self, user_message: str, assistant_message: str) -> ConversationEntry:
        entry = ConversationEntry(
            user_message=user_message,
            assistant_message=assistant_message,
            timestamp=datetime.now(timezone.utc).isoformat(),
        )
        conversations = self._load_conversations()
        conversations.append(entry.model_dump())
        self.storage_path.write_text(json.dumps(conversations, ensure_ascii=False, indent=2), encoding="utf-8")
        logger.info("Conversation saved")
        return entry

    def list_conversations(self) -> list[ConversationEntry]:
        return [ConversationEntry(**item) for item in self._load_conversations()]

    def _load_conversations(self) -> list[dict]:
        return json.loads(self.storage_path.read_text(encoding="utf-8"))
