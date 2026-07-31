from fastapi import APIRouter, HTTPException

from app.services.memory_service import MemoryService

router = APIRouter(prefix="/memory", tags=["memory"])
memory_service = MemoryService()


@router.post("")
def add_memory(payload: dict[str, str]) -> dict[str, object]:
    """Yeni bir hafıza notu ekler."""
    try:
        content = payload.get("content", "")
        category = payload.get("category", "general")
        return memory_service.add_memory(content, category)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:  # pragma: no cover - pratik hata yakalama
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("")
def list_memories() -> list[dict[str, object]]:
    """Tüm hafıza notlarını döndürür."""
    try:
        return memory_service.list_memories()
    except Exception as exc:  # pragma: no cover - pratik hata yakalama
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.put("/{memory_id}")
def update_memory(memory_id: str, payload: dict[str, str]) -> dict[str, object]:
    """Bir hafıza notunu günceller."""
    try:
        return memory_service.update_memory(memory_id, payload)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except Exception as exc:  # pragma: no cover - pratik hata yakalama
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.delete("/{memory_id}")
def delete_memory(memory_id: str) -> dict[str, str]:
    """Bir hafıza notunu siler."""
    try:
        memory_service.delete_memory(memory_id)
        return {"status": "deleted", "id": memory_id}
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except Exception as exc:  # pragma: no cover - pratik hata yakalama
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/search")
def search_memories(q: str) -> list[dict[str, object]]:
    """Hafızada arama yapar."""
    try:
        return memory_service.search_memories(q)
    except Exception as exc:  # pragma: no cover - pratik hata yakalama
        raise HTTPException(status_code=500, detail=str(exc)) from exc
