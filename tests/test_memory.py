from pathlib import Path

from fastapi.testclient import TestClient

from app.core.config import settings
from app.main import app

client = TestClient(app)


def test_memory_flow() -> None:
    storage_path = settings.data_dir / "memories.json"
    storage_path.parent.mkdir(parents=True, exist_ok=True)
    storage_path.write_text("[]", encoding="utf-8")

    add_response = client.post(
        "/api/memory",
        json={"content": "Kullanıcı Python öğreniyor", "category": "learning"},
    )
    assert add_response.status_code == 200
    created = add_response.json()
    assert created["content"] == "Kullanıcı Python öğreniyor"

    list_response = client.get("/api/memory")
    assert list_response.status_code == 200
    assert len(list_response.json()) == 1

    search_response = client.get("/api/memory/search", params={"q": "Python"})
    assert search_response.status_code == 200
    assert len(search_response.json()) == 1

    update_response = client.put(
        f"/api/memory/{created['id']}",
        json={"content": "Kullanıcı Python ve FastAPI öğreniyor"},
    )
    assert update_response.status_code == 200
    updated = update_response.json()
    assert updated["content"] == "Kullanıcı Python ve FastAPI öğreniyor"
    assert updated["updated_at"] != created["updated_at"]

    delete_response = client.delete(f"/api/memory/{created['id']}")
    assert delete_response.status_code == 200

    assert client.get("/api/memory").json() == []
