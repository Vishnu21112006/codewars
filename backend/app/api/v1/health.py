from fastapi import APIRouter
from datetime import datetime, timezone
from app.core.config import settings

router = APIRouter()

@router.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint returning system status and services availability.
    """
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": "1.0.0",
        "features": {
            "genai_gemini": bool(settings.GEMINI_API_KEY),
            "supabase_auth": bool(settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY),
            "scheduler_ortools": True
        }
    }
