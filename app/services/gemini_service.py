from google import genai
from google.genai import types

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class GeminiService:
    """Gemini API ile iletişim kuran temiz ve okunabilir bir servis."""

    def __init__(self) -> None:
        self.api_key = settings.gemini_api_key
        self.model = settings.gemini_model
        self.client = None

        if not self.api_key:
            logger.warning("Gemini API key is not configured.")
            return

        try:
            self.client = genai.Client(api_key=self.api_key)
            logger.info("Gemini client initialized successfully for model %s", self.model)
        except Exception as exc:  # pragma: no cover - runtime safety
            logger.exception("Failed to initialize Gemini client: %s", exc)
            self.client = None

    def generate_response(self, prompt: str) -> str:
        """Verilen prompt için Gemini'den yanıt üretir. Hata durumunda kullanıcı dostu mesaj döndürür."""
        if not prompt or not prompt.strip():
            return "Boş bir prompt gönderildi. Lütfen tekrar deneyin."

        if not self.api_key:
            return "Gemini API anahtarı yapılandırılmadı. Lütfen .env dosyasını kontrol edin."

        if self.client is None:
            return "Gemini servisi başlatılamadı. Daha sonra tekrar deneyin."

        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.7,
                    max_output_tokens=800,
                    top_p=0.9,
                ),
            )

            if getattr(response, "text", None):
                return response.text

            if getattr(response, "candidates", None):
                for candidate in response.candidates:
                    if getattr(candidate, "content", None):
                        parts = getattr(candidate.content, "parts", None) or []
                        for part in parts:
                            text = getattr(part, "text", None)
                            if text:
                                return text

            return "Gemini'den boş yanıt alındı."

        except Exception as exc:  # pragma: no cover - runtime safety
            logger.exception("Gemini request failed: %s", exc)
            return "Gemini isteği sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin."
