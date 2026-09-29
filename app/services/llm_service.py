from __future__ import annotations

import logging
from typing import Any

import httpx

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class LLMService:
    """Gemini API üzerinden model çağrısı gerçekleştiren servis."""

    def __init__(self) -> None:
        if not settings.gemini_api_key:
            logger.warning("Gemini API anahtarı .env dosyasından okunamadı.")

    def generate_response(self, prompt: str) -> str:
        """Gemini API'ye sistem promptu gönderir ve yanıtı döndürür."""
        if not settings.gemini_api_key:
            logger.error("Gemini API anahtarı eksik: .env dosyasına GEMINI_API_KEY ekleyin.")
            return "[EsraGPT] Gemini API anahtarı bulunamadı. Lütfen .env dosyasını kontrol edin."

        payload = {
            "model": settings.gemini_model,
            "messages": [
                {"role": "system", "content": prompt},
            ],
            "temperature": 0.7,
            "max_tokens": 1024,
        }

        headers = {
            "Authorization": f"Bearer {settings.gemini_api_key}",
            "Content-Type": "application/json",
        }

        url = settings.gemini_api_url
        logger.info("Sending request to Gemini API %s with model %s", url, settings.gemini_model)

        try:
            with httpx.Client(timeout=httpx.Timeout(20.0, connect=10.0)) as client:
                response = client.post(url, json=payload, headers=headers)
                response.raise_for_status()
                data = response.json()

            logger.debug("Gemini response payload: %s", data)
            return self._extract_text(data)

        except httpx.ConnectError as exc:
            logger.exception("Gemini API bağlantısı kurulamadı: %s", exc)
            return "[EsraGPT] Gemini API sunucusuna bağlanılamadı. Lütfen bağlantınızı kontrol edin."
        except httpx.ReadTimeout as exc:
            logger.exception("Gemini API yanıtı zaman aşımına uğradı: %s", exc)
            return "[EsraGPT] Gemini API yanıtı zaman aşımına uğradı. Lütfen tekrar deneyin."
        except httpx.HTTPStatusError as exc:
            status_code = exc.response.status_code if exc.response is not None else "unknown"
            body = exc.response.text if exc.response is not None else ""
            logger.exception("Gemini API HTTP hatası %s: %s", status_code, body)
            return f"[EsraGPT] Gemini API hata döndü: {status_code}."
        except ValueError as exc:
            logger.exception("Gemini API yanıtı JSON olarak çözülemedi: %s", exc)
            return "[EsraGPT] Gemini API yanıtı okunamadı."
        except Exception as exc:
            logger.exception("Gemini API çağrısında beklenmeyen hata: %s", exc)
            return "[EsraGPT] Gemini API ile iletişim sırasında beklenmeyen bir hata oluştu."

    def _extract_text(self, data: Any) -> str:
        if not isinstance(data, dict):
            return "[EsraGPT] Gemini API beklenmeyen bir yanıt döndü."

        if "choices" in data and isinstance(data["choices"], list) and data["choices"]:
            first = data["choices"][0]
            if isinstance(first, dict):
                if "message" in first and isinstance(first["message"], dict):
                    content = first["message"].get("content")
                    if isinstance(content, str):
                        return content
                if "content" in first and isinstance(first["content"], str):
                    return first["content"]

        if "output" in data and isinstance(data["output"], str):
            return data["output"]

        if "response" in data and isinstance(data["response"], str):
            return data["response"]

        logger.warning("Gemini API yanıtından metin çıkarılamadı: %s", data)
        return "[EsraGPT] Gemini API yanıtı anlaşılmadı."
