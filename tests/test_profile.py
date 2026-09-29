from pathlib import Path

from fastapi.testclient import TestClient

from app.main import app
from app.services.profile_service import profile_service

client = TestClient(app)


def test_profile_service_uses_project_data_file() -> None:
    expected_path = (Path(__file__).resolve().parent.parent / "app" / "data" / "profile.json").resolve()

    assert profile_service.storage_path.resolve() == expected_path


def test_get_profile_returns_default_profile() -> None:
    profile_path = Path("app/data/profile.json")
    profile_path.write_text("{}", encoding="utf-8")

    response = client.get("/api/profile")

    assert response.status_code == 200
    data = response.json()
    assert data["name"] is None
    assert data["interests"] == []
    assert data["technologies"] == []


def test_update_profile_persists_to_json_file() -> None:
    profile_path = Path("app/data/profile.json")
    profile_path.write_text("{}", encoding="utf-8")

    payload = {
        "name": "Esra",
        "city": "İstanbul",
        "interests": ["AI", "Python"],
        "technologies": ["FastAPI", "Ollama"],
    }

    response = client.put("/api/profile", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Esra"
    assert data["city"] == "İstanbul"
    assert data["interests"] == ["AI", "Python"]
    assert data["technologies"] == ["FastAPI", "Ollama"]

    saved = profile_path.read_text(encoding="utf-8")
    assert "Esra" in saved
    assert "İstanbul" in saved


def test_update_profile_ignores_placeholder_values() -> None:
    profile_path = Path("app/data/profile.json")
    profile_path.write_text("{}", encoding="utf-8")

    payload = {
        "name": "string",
        "city": "example",
        "interests": ["AI"],
        "technologies": ["FastAPI"],
    }

    response = client.put("/api/profile", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["name"] is None
    assert data["city"] is None
    assert data["interests"] == ["AI"]
    assert data["technologies"] == ["FastAPI"]
