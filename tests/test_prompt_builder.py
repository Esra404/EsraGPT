from app.models.conversation import ChatMessage
from app.models.profile import UserProfile
from app.services.prompt_service import PromptService


def test_prompt_builder_includes_profile_memory_and_history() -> None:
    prompt_service = PromptService()
    profile = UserProfile(
        name="Esra",
        city="İstanbul",
        interests=["AI"],
        goals=["Learn FastAPI"],
        communication_style="Nazik ve net",
        personality_traits=["Yaratıcı", "Sabırlı"],
    )
    history = [
        ChatMessage(role="user", content="Merhaba"),
        ChatMessage(role="assistant", content="Merhaba!"),
    ]

    prompt = prompt_service.build_system_prompt(
        profile=profile,
        memory_context=["Kullanıcı Python öğreniyor"],
        history=history,
        latest_message="Bugün ne yapmalıyım?",
    )

    assert "### 1. Kullanıcı Profili" in prompt
    assert "### 2. Kişilik ve Tercihler" in prompt
    assert "### 3. Hafıza ve Önemli Notlar" in prompt
    assert "### 4. Konuşma Geçmişi" in prompt
    assert "Bugün ne yapmalıyım?" in prompt
    assert "Esra" in prompt
    assert "İstanbul" in prompt
    assert "Python öğreniyor" in prompt
