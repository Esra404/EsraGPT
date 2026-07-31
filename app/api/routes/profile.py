from fastapi import APIRouter, HTTPException

from app.models.profile import UserProfile
from app.services.profile_service import profile_service

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("", response_model=UserProfile)
def get_profile() -> UserProfile:
    """Kayıtlı kullanıcı profilini döndürür."""
    try:
        return profile_service.get_profile()
    except Exception as exc:  # pragma: no cover - pratik hata yakalama
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.put("", response_model=UserProfile)
def update_profile(profile_data: UserProfile) -> UserProfile:
    """Kullanıcı profilini günceller."""
    try:
        return profile_service.update_profile(profile_data.model_dump(exclude_none=True))
    except Exception as exc:  # pragma: no cover - pratik hata yakalama
        raise HTTPException(status_code=500, detail=str(exc)) from exc
