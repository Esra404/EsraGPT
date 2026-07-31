from fastapi import APIRouter, HTTPException

from app.services.conversation_service import ConversationService

router = APIRouter(prefix="/conversations", tags=["conversations"])
conversation_service = ConversationService()


@router.get("")
def list_conversations() -> list[dict[str, object]]:
    """Tüm konuşma geçmişini döndürür."""
    try:
        return [item.model_dump() for item in conversation_service.list_conversations()]
    except Exception as exc:  # pragma: no cover - pratik hata yakalama
        raise HTTPException(status_code=500, detail=str(exc)) from exc
