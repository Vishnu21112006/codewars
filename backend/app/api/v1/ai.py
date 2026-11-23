from fastapi import APIRouter, HTTPException, status
from app.models.ai import ProjectAnalyzeRequest, ProjectAnalysisResponse
from app.services.ai_service import ai_analyzer_service

router = APIRouter(prefix="/ai", tags=["AI Project Analyzer (Google Gemini)"])

@router.post("/analyze-project", response_model=ProjectAnalysisResponse)
async def analyze_project_endpoint(payload: ProjectAnalyzeRequest):
    """
    Analyzes an engineering student project using Google Gemini API or deterministic demo analyzer.
    Extracts project category, required equipment, quantity, technical specifications, usage duration,
    and classifies essential vs optional equipment.
    Matches extracted equipment against actual LabLink inventory and recommends available alternatives.
    """
    try:
        result = ai_analyzer_service.analyze_project(payload)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error executing AI Project Analysis: {str(e)}",
        )
