from app.services.llm_service import LLMService


def test_generate_response_returns_error_message_when_api_key_missing(monkeypatch):
    class DummySettings:
        gemini_api_key = None
        gemini_api_url = "https://api.openai.com/v1/chat/completions"
        gemini_model = "gemini-1.5"

    monkeypatch.setattr("app.services.llm_service.settings", DummySettings)
    service = LLMService()

    result = service.generate_response("Test prompt")

    assert "Gemini API anahtarı bulunamadı" in result
