from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class DepartmentUsageStat(BaseModel):
    department: str
    active_units: int
    total_units: int
    utilization: float
    bookings_count: int
    color: str

class MostRequestedEquipmentStat(BaseModel):
    name: str
    count: int
    department: str
    category: str

class SchedulingConflictStat(BaseModel):
    detected_conflicts: int
    resolved_via_cpsat: int
    fairness_index: float
    peak_contention_window: str

class StudentAnalytics(BaseModel):
    active_projects_count: int
    pending_bookings_count: int
    approved_bookings_count: int
    recommended_equipment: List[Dict[str, Any]]
    project_milestones: List[Dict[str, Any]]
    booking_status_distribution: List[Dict[str, Any]]

class FacultyAdminAnalytics(BaseModel):
    total_equipment_count: int
    total_units: int
    available_units: int
    in_use_units: int
    equipment_utilization_rate: float
    pending_requests_count: int
    department_usage: List[DepartmentUsageStat]
    most_requested_equipment: List[MostRequestedEquipmentStat]
    scheduling_conflicts: SchedulingConflictStat
    hourly_load_trend: List[Dict[str, Any]]

class AnalyticsOverviewResponse(BaseModel):
    student: StudentAnalytics
    faculty_admin: FacultyAdminAnalytics
    data_source: str = "backend_live_mesh"
    timestamp: str
