from app.core.logging import get_logger
from app.models.conversation import ChatMessage
from app.models.profile import UserProfile

logger = get_logger(__name__)


class PromptService:
    """Profil, hafıza, kişilik ve konuşma geçmişine göre profesyonel sistem promptu üretir."""

    def build_prompt(
        self,
        user_message: str,
        profile: UserProfile | None = None,
        memory_context: list[str] | None = None,
        history: list[ChatMessage] | None = None,
    ) -> str:
        """OpenAI / Gemini formatına uygun, net ve bölümlenmiş sistem promptu oluşturur."""
        profile_data = profile or UserProfile()
        memory_items = memory_context or []
        history_items = history or []

        profile_section = self._profile_to_text(profile_data)
        personality_section = self._personality_to_text(profile_data)
        memory_section = self._memory_to_text(memory_items)
        history_section = self._history_to_text(history_items)

        prompt = f"""Sistem:
Sen EsraGPT kişisel yapay zeka asistanısın. Kullanıcının ihtiyaçlarına uygun, nazik, net ve uygulanabilir Türkçe cevaplar üret.

### 1. Kullanıcı Profili
{profile_section}

### 2. Kişilik ve Tercihler
{personality_section}

### 3. Hafıza ve Önemli Notlar
{memory_section}

### 4. Konuşma Geçmişi
{history_section}

### 5. Güncel Kullanıcı Mesajı
{user_message}

#### Yanıt Kuralları
- Sadece kullanıcıya yönelik, doğrudan ve uygulanabilir bir cevap ver.
- Türkiye Türkçesi kullanarak akıcı ve profesyonel ol.
- Gerçek olmayan bilgileri asla uydurma.
- Sorunun bağlamını düşün, gerekiyorsa adım adım rehberlik sun.
- Uzun paragraflardan kaçın; gerektiğinde maddelerle yanıtla.
- İçsel düşünceler, model meta verisi veya "düşünüyorum" ifadeleri yazma.
"""
        logger.info("System prompt built")
        return prompt

    def build_system_prompt(
        self,
        profile: UserProfile,
        memory_context: list[str],
        history: list[ChatMessage],
        latest_message: str,
    ) -> str:
        """Mevcut API uyumu için alias metot."""
        return self.build_prompt(
            user_message=latest_message,
            profile=profile,
            memory_context=memory_context,
            history=history,
        )

    def _profile_to_text(self, profile: UserProfile) -> str:
        parts = []
        if profile.name:
            parts.append(f"- Ad: {profile.name}")
        if profile.age is not None:
            parts.append(f"- Yaş: {profile.age}")
        if profile.city:
            parts.append(f"- Şehir: {profile.city}")
        if profile.university:
            parts.append(f"- Üniversite: {profile.university}")
        if profile.department:
            parts.append(f"- Bölüm: {profile.department}")
        if profile.goals:
            parts.append(f"- Hedefler: {', '.join(profile.goals)}")
        if profile.projects:
            parts.append(f"- Projeler: {', '.join(profile.projects)}")
        if profile.experiences:
            parts.append(f"- Deneyimler: {', '.join(profile.experiences)}")
        if profile.metadata:
            entries = "; ".join(f"{key}: {value}" for key, value in profile.metadata.items())
            parts.append(f"- Ek bilgiler: {entries}")
        return "\n".join(parts) if parts else "Profil bilgisi yok."

    def _personality_to_text(self, profile: UserProfile) -> str:
        parts = []
        if profile.personality_traits:
            parts.append(f"- Kişilik özellikleri: {', '.join(profile.personality_traits)}")
        if profile.communication_style:
            parts.append(f"- Konuşma tarzı: {profile.communication_style}")
        if profile.learning_style:
            parts.append(f"- Öğrenme tarzı: {profile.learning_style}")
        if profile.interests:
            parts.append(f"- İlgi alanları: {', '.join(profile.interests)}")
        if profile.hobbies:
            parts.append(f"- Hobiler: {', '.join(profile.hobbies)}")
        if profile.likes:
            parts.append(f"- Sevdiği şeyler: {', '.join(profile.likes)}")
        if profile.dislikes:
            parts.append(f"- Sevmediği şeyler: {', '.join(profile.dislikes)}")
        if profile.technical_skills:
            parts.append(f"- Teknik yetkinlikler: {', '.join(profile.technical_skills)}")
        if profile.technologies:
            parts.append(f"- Teknolojiler: {', '.join(profile.technologies)}")
        if profile.strengths:
            parts.append(f"- Güçlü yönler: {', '.join(profile.strengths)}")
        if profile.areas_to_improve:
            parts.append(f"- Geliştirilmek istenen alanlar: {', '.join(profile.areas_to_improve)}")
        return "\n".join(parts) if parts else "Kişilik ve tercih bilgisi yok."

    def _memory_to_text(self, memory_context: list[str]) -> str:
        if not memory_context:
            return "Henüz önemli hafıza notu yok."
        return "\n".join(f"- {item}" for item in memory_context)

    def _history_to_text(self, history: list[ChatMessage]) -> str:
        if not history:
            return "Henüz geçmiş konuşma yok."
        lines = []
        for item in history[-6:]:
            role = "Kullanıcı" if item.role == "user" else "Asistan" if item.role == "assistant" else item.role
            lines.append(f"- {role}: {item.content}")
        return "\n".join(lines)
