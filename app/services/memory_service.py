import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import uuid4

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class MemoryService:
    """Uzun vadeli hafızayı JSON tabanlı olarak yönetir."""

    def __init__(self, storage_path: Path | None = None) -> None:
        self.storage_path = storage_path or settings.data_dir / "memories.json"
        self.storage_path.parent.mkdir(parents=True, exist_ok=True)
        self._ensure_file()

    def _now_iso(self) -> str:
        return datetime.now(timezone.utc).isoformat()

    def _ensure_file(self) -> None:
        if not self.storage_path.exists():
            self.storage_path.write_text("[]", encoding="utf-8")
            logger.info("Created memory store at %s", self.storage_path)

    def _load_memories(self) -> list[dict[str, Any]]:
        raw_content = self.storage_path.read_text(encoding="utf-8").strip()
        if not raw_content:
            return []

        try:
            data = json.loads(raw_content)
        except json.JSONDecodeError as exc:
            logger.warning("Memory store is invalid JSON, resetting it: %s", exc)
            self.storage_path.write_text("[]", encoding="utf-8")
            return []

        if not isinstance(data, list):
            logger.warning("Memory store content is not a list, resetting it")
            self.storage_path.write_text("[]", encoding="utf-8")
            return []

        return data

    def _save_memories(self, memories: list[dict[str, Any]]) -> None:
        self.storage_path.write_text(json.dumps(memories, ensure_ascii=False, indent=2), encoding="utf-8")

    def _normalize_content(self, content: str) -> str:
        return content.strip()

    def _memory_exists(self, normalized_content: str, memories: list[dict[str, Any]]) -> bool:
        return any(memory.get("content", "").lower() == normalized_content.lower() for memory in memories)

    def _generate_id(self) -> str:
        return str(uuid4())

    def add_memory(self, content: str, category: str = "general") -> dict[str, Any]:
        normalized_content = self._normalize_content(content)
        if not normalized_content:
            raise ValueError("Memory content cannot be empty")

        memories = self._load_memories()
        if self._memory_exists(normalized_content, memories):
            raise ValueError("This memory already exists")

        entry = {
            "id": self._generate_id(),
            "content": normalized_content,
            "category": category.strip() or "general",
            "created_at": self._now_iso(),
            "updated_at": self._now_iso(),
        }
        memories.append(entry)
        self._save_memories(memories)
        logger.info("Memory added: %s", normalized_content)
        return entry

    def list_memories(self) -> list[dict[str, Any]]:
        return self._load_memories()

    def update_memory(self, memory_id: str, updates: dict[str, Any]) -> dict[str, Any]:
        memories = self._load_memories()
        for memory in memories:
            if memory.get("id") == memory_id:
                if "content" in updates:
                    normalized_content = self._normalize_content(str(updates["content"]))
                    if not normalized_content:
                        raise ValueError("Memory content cannot be empty")
                    if normalized_content != memory.get("content", "") and self._memory_exists(normalized_content, memories):
                        raise ValueError("This memory already exists")
                    memory["content"] = normalized_content
                if "category" in updates:
                    memory["category"] = str(updates["category"]).strip() or "general"
                memory["updated_at"] = self._now_iso()
                self._save_memories(memories)
                logger.info("Memory updated: %s", memory_id)
                return memory
        raise ValueError(f"Memory with id {memory_id} was not found")

    def delete_memory(self, memory_id: str) -> None:
        memories = self._load_memories()
        updated_memories = [memory for memory in memories if memory.get("id") != memory_id]
        if len(updated_memories) == len(memories):
            raise ValueError(f"Memory with id {memory_id} was not found")
        self._save_memories(updated_memories)
        logger.info("Memory deleted: %s", memory_id)

    def search_memories(self, query: str) -> list[dict[str, Any]]:
        if not query or not query.strip():
            return []

        memories = self._load_memories()
        query_lower = query.lower()
        return [
            memory
            for memory in memories
            if query_lower in memory.get("content", "").lower()
            or query_lower in memory.get("category", "").lower()
        ]
