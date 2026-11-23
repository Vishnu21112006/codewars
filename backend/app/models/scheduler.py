from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class ConfirmedBooking(BaseModel):
    id: str
    equipment_id: str
    date: str
    start_hour: int = Field(..., ge=8, le=20, description="Start hour in 24h format (e.g. 9 for 09:00)")
    end_hour: int = Field(..., ge=9, le=21, description="End hour in 24h format (e.g. 12 for 12:00)")
    student_name: str
    project_title: Optional[str] = None

class CompetingBookingRequest(BaseModel):
    id: str
    student_id: str
    student_name: str
    project_title: str
    equipment_id: str
    equipment_name: Optional[str] = None
    date: str
    preferred_start_hour: int = Field(..., ge=8, le=18)
    duration_hours: int = Field(..., ge=1, le=8)
    deadline_hours_remaining: int = Field(..., ge=1, description="Hours remaining until academic milestone deadline")
    is_essential: bool = Field(True, description="25% necessity factor: True = critical path, False = optional")
    previous_access_count: int = Field(0, ge=0, description="Historical equipment bookings for student fairness scoring")
    priority_tier: Optional[str] = "high"  # 'capstone_critical' | 'high' | 'medium' | 'low'

class EquipmentCapacity(BaseModel):
    equipment_id: str
    equipment_name: str
    available_units: int = Field(1, ge=1)
    lab_open_hour: int = Field(9, ge=6, le=12, description="Lab opening time (e.g., 9 for 09:00 AM)")
    lab_close_hour: int = Field(18, ge=16, le=22, description="Lab closing time (e.g., 18 for 06:00 PM)")

class ScheduleOptimizationRequest(BaseModel):
    requests: List[CompetingBookingRequest]
    confirmed_bookings: List[ConfirmedBooking] = Field(default_factory=list)
    equipment_capacities: Optional[List[EquipmentCapacity]] = None

class AlternativeSlot(BaseModel):
    date: str
    start_hour: int
    end_hour: int
    formatted_time_slot: str
    reason: str

class AllocationRecommendation(BaseModel):
    request_id: str
    student_name: str
    project_title: str
    equipment_id: str
    equipment_name: str
    assigned_date: str
    assigned_start_hour: int
    assigned_end_hour: int
    formatted_time_slot: str
    composite_priority_score: float
    urgency_component: float       # 40%
    necessity_component: float     # 25%
    fairness_component: float      # 20%
    feasibility_component: float   # 15%
    allocation_reason: str

class RejectedRequest(BaseModel):
    request_id: str
    student_name: str
    project_title: str
    equipment_id: str
    equipment_name: str
    rejection_reason: str
    suggested_alternative_slots: List[AlternativeSlot] = Field(default_factory=list)
    suggested_alternative_equipment: Optional[str] = None

class ScheduleOptimizationResponse(BaseModel):
    status: str  # 'OPTIMAL', 'FEASIBLE', 'INFEASIBLE'
    solver_time_ms: float
    total_requests: int
    accommodated_count: int
    rejected_count: int
    fairness_index: float  # Percentage score 0 - 100%
    accommodations: List[AllocationRecommendation]
    rejections: List[RejectedRequest]
    summary_notes: str
