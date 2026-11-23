from typing import Optional
from fastapi import APIRouter, Query
from app.models.analytics import AnalyticsOverviewResponse
from app.services.analytics_service import analytics_service

router = APIRouter(prefix="/analytics", tags=["Campus Laboratory Analytics & Visualizations"])

@router.get("/overview", response_model=AnalyticsOverviewResponse)
async def get_analytics_overview(
    student_id: Optional[str] = Query(None, description="Optional student ID for personalized student metrics"),
):
    """
    Returns comprehensive cross-department analytics for student, faculty, and admin dashboards:
    - Student: Active projects, pending/approved reservations, recommended equipment, milestone charts.
    - Faculty/Admin: Total equipment, utilization rate, pending requests, department usage, most requested gear, scheduling conflicts.
    """
    return analytics_service.get_analytics_overview(student_id=student_id)
