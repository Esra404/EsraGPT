from app.core.logging import get_logger
from app.models.conversation import ChatMessage, ChatRequest
from app.models.profile import UserProfile
from app.services.conversation_service import ConversationService
from app.services.nvidia_service import NvidiaService
from app.services.memory_service import MemoryService
from app.services.profile_service import ProfileService
from app.services.prompt_service import PromptService

logger = get_logger(__name__)


class ChatService:
    """Chat akışını yönetir, profil ve hafıza bağlamında yanıt üretimini sağlar."""

    def __init__(self) -> None:
        self.profile_service = ProfileService()
        self.memory_service = MemoryService()
        self.conversation_service = ConversationService()
        self.prompt_service = PromptService()
        self.nvidia_service = NvidiaService()

    def handle_message(self, request: ChatRequest) -> dict[str, object]:
        """Kullanıcı mesajını işler, profil ve hafıza bağlamında Gemini'den yanıt alır."""
        # Profil ve hafıza bağlamını oku
        profile: UserProfile = self.profile_service.get_profile()
        memory_context = [memory["content"] for memory in self.memory_service.search_memories(request.message)]

        # Sistem promptu oluştur
        system_prompt = self.prompt_service.build_system_prompt(
            profile=profile,
            memory_context=memory_context,
            history=request.history,
            latest_message=request.message,
        )
       
        # Gemini API'den yanıt al
        assistant_message = self.nvidia_service.generate_response(system_prompt)

        # Konuşmayı kaydet
        self.conversation_service.save_conversation(request.message, assistant_message)

        return {
            "response": assistant_message,
            "profile": profile.model_dump(exclude_none=True),
            "memory_context": memory_context,
        }

