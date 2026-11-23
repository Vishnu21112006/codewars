from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.health import router as health_router
from app.api.v1.equipment import router as equipment_router
from app.api.v1.ai import router as ai_router
from app.api.v1.scheduler import router as scheduler_router
from app.api.v1.bookings import router as bookings_router
from app.api.v1.analytics import router as analytics_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="LabLink - GenAI-powered College Laboratory Resource-Sharing Platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include API Routers under standard prefix /api/v1
app.include_router(health_router, prefix=settings.API_V1_STR)
app.include_router(health_router)
app.include_router(equipment_router, prefix=settings.API_V1_STR)
app.include_router(ai_router, prefix=settings.API_V1_STR)
app.include_router(scheduler_router, prefix=settings.API_V1_STR)
app.include_router(bookings_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)

# Explicit aliases for direct routes
app.include_router(ai_router, prefix="/api")
app.include_router(scheduler_router, prefix="/api")
app.include_router(bookings_router, prefix="/api")
app.include_router(analytics_router, prefix="/api")

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to LabLink Platform API",
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health",
        "equipment": f"{settings.API_V1_STR}/equipment",
        "ai_analyze": "/api/ai/analyze-project",
        "scheduler_solve": "/api/scheduler/solve",
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
