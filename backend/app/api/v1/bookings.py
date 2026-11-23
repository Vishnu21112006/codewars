from typing import Optional, List
from fastapi import APIRouter, HTTPException, Query, status
from app.models.booking import (
    BookingCreate,
    BookingOut,
    BookingListResponse,
    ApprovalAction,
    CancelBookingRequest,
    ApprovalRecord,
    TimeSlotRecommendation,
)
from app.services.booking_service import booking_service

router = APIRouter(prefix="/bookings", tags=["Student Booking & Faculty Approval Workflow"])

@router.get("", response_model=BookingListResponse)
async def list_bookings(
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status: pending, approved, rejected, completed, cancelled"),
    role: Optional[str] = Query(None, description="Role context: student, faculty, admin"),
    user_id: Optional[str] = Query(None, description="Filter for student user ID or email"),
    equipment_id: Optional[str] = Query(None, description="Filter by equipment ID"),
    department: Optional[str] = Query(None, description="Filter by department"),
):
    """
    List all laboratory bookings and reservations with role filtering and status categorization.
    """
    items = booking_service.get_bookings(
        status=status_filter,
        role=role,
        user_id=user_id,
        equipment_id=equipment_id,
        department=department,
    )

    all_items = booking_service.get_bookings()
    pending = sum(1 for b in all_items if b.get("status") == "pending")
    approved = sum(1 for b in all_items if b.get("status") == "approved")
    rejected = sum(1 for b in all_items if b.get("status") == "rejected")
    completed = sum(1 for b in all_items if b.get("status") == "completed")

    return BookingListResponse(
        total=len(items),
        items=items,
        pending_count=pending,
        approved_count=approved,
        rejected_count=rejected,
        completed_count=completed,
    )

@router.get("/equipment/{equipment_id}/recommended-slots", response_model=List[TimeSlotRecommendation])
async def get_recommended_slots(
    equipment_id: str,
    date: str = Query(..., description="Target reservation date (YYYY-MM-DD)"),
):
    """
    Returns AI-recommended time slots and congestion analysis for a specific equipment station
    on a target calendar date.
    """
    recommendations = booking_service.get_recommended_slots(equipment_id=equipment_id, date=date)
    return recommendations

@router.get("/{booking_id}", response_model=BookingOut)
async def get_booking_details(booking_id: str):
    """
    Retrieve single booking request with full student, project, timeline, and approval audit history.
    """
    booking = booking_service.get_booking_by_id(booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Booking request '{booking_id}' not found.",
        )
    return booking

@router.post("", response_model=BookingOut, status_code=status.HTTP_201_CREATED)
async def submit_booking(payload: BookingCreate):
    """
    Student submits a laboratory equipment booking request for a project milestone.
    Validates user role, generates digital pass code, and enqueues for faculty review.
    """
    new_booking, error = booking_service.create_booking(payload)
    if error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error,
        )
    return new_booking

@router.post("/{booking_id}/approve", response_model=BookingOut)
async def approve_booking_request(booking_id: str, action: ApprovalAction):
    """
    Faculty approves a student laboratory booking request.
    Validates role, rechecks real-time equipment availability, applies transactional lock
    to prevent overbooking collisions, and records approval trail.
    """
    updated, error = booking_service.approve_booking(booking_id, action)
    if error:
        if "Overbooking prevented" in error:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=error)
        elif "Permission denied" in error:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=error)
        elif "not found" in error:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=error)
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error)
    return updated

@router.post("/{booking_id}/reject", response_model=BookingOut)
async def reject_booking_request(booking_id: str, action: ApprovalAction):
    """
    Faculty rejects a student laboratory booking request with mandatory explanatory remarks.
    """
    updated, error = booking_service.reject_booking(booking_id, action)
    if error:
        if "Permission denied" in error:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=error)
        elif "not found" in error:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=error)
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error)
    return updated

@router.post("/{booking_id}/cancel", response_model=BookingOut)
async def cancel_booking_request(booking_id: str, payload: CancelBookingRequest):
    """
    Cancels an eligible pending booking.
    Students can only cancel their own pending requests.
    """
    updated, error = booking_service.cancel_booking(booking_id, payload)
    if error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error)
    return updated

@router.get("/{booking_id}/history", response_model=List[ApprovalRecord])
async def get_booking_approval_history(booking_id: str):
    """
    Fetch complete audit trail of faculty mentor and lab administrator actions on a booking.
    """
    booking = booking_service.get_booking_by_id(booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Booking request '{booking_id}' not found.",
        )
    return booking.get("approval_history", [])
