from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from app.core.config import settings
from app.api.v1.health import router as health_router
from app.api.v1.equipment import router as equipment_router
from app.api.v1.ai import router as ai_router
from app.api.v1.scheduler import router as scheduler_router
from app.api.v1.bookings import router as bookings_router
from app.api.v1.analytics import router as analytics_router

app = FastAPI(
    title="LabLink — Making College Laboratories More Accessible",
    description="GenAI-powered campus laboratory resource-sharing platform that helps students discover and access specialised equipment, development kits, and laboratory workstations across departments. Features equipment discovery, intelligent slot booking, project-based access requests, and faculty approvals while optimising resource utilisation through Google OR-Tools CP-SAT conflict resolution.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# High-Efficiency Compression Middleware (compresses responses > 1KB)
app.add_middleware(GZipMiddleware, minimum_size=1000)

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
