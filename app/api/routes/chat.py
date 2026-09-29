from fastapi import APIRouter, HTTPException

from app.models.conversation import ChatRequest
from app.services.chat_service import ChatService

router = APIRouter(prefix="/chat", tags=["chat"])
chat_service = ChatService()


@router.post("")
def chat(request: ChatRequest) -> dict[str, object]:
    """Kullanıcı mesajını işler ve bir yanıt üretir."""
    try:
        return chat_service.handle_message(request)
    except Exception as exc:  # pragma: no cover - pratik hata yakalama
        raise HTTPException(status_code=500, detail=str(exc)) from exc
