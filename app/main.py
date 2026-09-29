from contextlib import asynccontextmanager

from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.chat import router as chat_router
from app.api.routes.profile import router as profile_router
from app.api.routes.memory import router as memory_router
from app.api.routes.conversations import router as conversations_router
from app.core.config import settings
from app.core.logging import get_logger
from app.models.profile import UserProfile
from app.services.profile_service import profile_service

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Uygulama açılışında profil dosyasını yükler ve kapanışta temizliği sağlar."""
    profile_service.get_profile()
    logger.info("Profile data loaded from %s", profile_service.storage_path)
    yield


app = FastAPI(title=settings.app_name, version=settings.app_version, lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
         "https://esra-76jizozln-esra404s-projects.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(chat_router, prefix="/api")
app.include_router(profile_router, prefix="/api")
app.include_router(memory_router, prefix="/api")
app.include_router(conversations_router, prefix="/api")


@app.get("/health")
def health_check() -> dict[str, str]:
    """Servisin çalıştığını doğrulamak için basit bir endpoint."""
    logger.info("Health check requested")
    return {"status": "ok", "service": settings.app_name}


@app.get("/profile", response_model=UserProfile)
def get_profile_root() -> UserProfile:
    """Profil bilgilerini doğrudan /profile yolundan döndürür."""
    return profile_service.get_profile()


@app.put("/profile", response_model=UserProfile)
def update_profile_root(profile_data: UserProfile) -> UserProfile:
    """Profil bilgilerini doğrudan /profile yolundan günceller."""
    return profile_service.update_profile(profile_data.model_dump(exclude_none=True))
