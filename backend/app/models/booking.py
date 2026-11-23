from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class TimeSlotRecommendation(BaseModel):
    slot_window: str = Field(..., description="e.g. '09:00 AM - 12:00 PM'")
    date: str = Field(..., description="YYYY-MM-DD")
    start_hour: int = Field(..., ge=0, le=23)
    end_hour: int = Field(..., ge=0, le=24)
    congestion_level: str = Field("low", description="'low', 'moderate', 'high', 'full'")
    available_units: int = Field(..., ge=0)
    total_units: int = Field(..., ge=1)
    is_recommended: bool = Field(False)
    reasoning: str = Field(...)

class BookingCreate(BaseModel):
    equipment_id: str
    equipment_name: Optional[str] = None
    project_id: Optional[str] = None
    project_name: Optional[str] = None
    date: str
    time_slot: str
    start_hour: Optional[int] = 14
    duration_hours: Optional[int] = 3
    justification: str
    student_id: Optional[str] = None
    student_name: Optional[str] = None
    student_email: Optional[str] = None
    department: Optional[str] = None
    user_role: str = Field("student", description="'student', 'faculty', 'admin'")

class ApprovalAction(BaseModel):
    decision: str = Field(..., description="'approved' or 'rejected'")
    faculty_id: Optional[str] = None
    faculty_name: Optional[str] = None
    faculty_email: Optional[str] = None
    comments: str = Field(..., min_length=3, description="Mandatory faculty review remarks")
    safety_clearance_issued: bool = True
    suggested_alternative_slot: Optional[str] = None
    user_role: str = Field("faculty", description="Role executing the approval")

class CancelBookingRequest(BaseModel):
    user_id: Optional[str] = None
    user_role: str = Field("student", description="Role executing cancellation")
    reason: Optional[str] = "Student requested booking release"

class ApprovalRecord(BaseModel):
    id: str
    booking_id: str
    faculty_id: Optional[str] = None
    faculty_name: Optional[str] = None
    faculty_email: Optional[str] = None
    decision: str
    feedback_comments: str
    safety_clearance_issued: bool = False
    suggested_alternative_slot: Optional[str] = None
    reviewed_at: str

class BookingOut(BaseModel):
    id: str
    equipment_id: str
    equipment_name: str
    department: str
    lab: str
    student_id: str
    student_name: str
    student_email: str
    project_id: Optional[str] = None
    project_name: Optional[str] = None
    project_deadline: Optional[str] = None
    date: str
    time_slot: str
    start_hour: int
    end_hour: int
    duration_hours: int
    justification: str
    status: str = Field(..., description="'pending', 'approved', 'rejected', 'completed', 'cancelled'")
    faculty_approved: bool = False
    faculty_mentor: Optional[str] = None
    faculty_note: Optional[str] = None
    ai_urgency_score: float = 0.5
    ai_recommendation: Optional[str] = None
    pass_code: Optional[str] = None
    approval_history: List[ApprovalRecord] = Field(default_factory=list)
    created_at: str
    updated_at: str

class BookingListResponse(BaseModel):
    total: int
    items: List[BookingOut]
    pending_count: int
    approved_count: int
    rejected_count: int
    completed_count: int
