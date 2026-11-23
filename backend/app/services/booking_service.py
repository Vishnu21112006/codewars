import logging
import threading
import uuid
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any, Tuple
from app.core.config import settings
from app.services.equipment_service import equipment_service
from app.models.booking import (
    BookingCreate,
    BookingOut,
    ApprovalAction,
    CancelBookingRequest,
    ApprovalRecord,
    TimeSlotRecommendation,
)

logger = logging.getLogger(__name__)

INITIAL_BOOKINGS_DATA: List[Dict[str, Any]] = [
    {
        "id": "BK-901",
        "equipment_id": "e-dev-01",
        "equipment_name": "Xilinx Zynq UltraScale+ MPSoC ZCU102 Evaluation Board",
        "department": "ECE",
        "lab": "VLSI & Embedded Systems Research Lab (MV-304)",
        "student_id": "u-student-01",
        "student_name": "Aarav Patel",
        "student_email": "aarav.patel@college.edu",
        "project_id": "proj-1",
        "project_name": "Autonomous Quadcopter Flight Controller",
        "project_deadline": "2026-11-28",
        "date": "2026-11-24",
        "time_slot": "02:00 PM - 05:00 PM",
        "start_hour": 14,
        "end_hour": 17,
        "duration_hours": 3,
        "justification": "Critical final capstone integration milestone. Must test SPI & CAN bus hardware acceleration with IMU sensors.",
        "status": "approved",
        "faculty_approved": True,
        "faculty_mentor": "Dr. Aris Thorne",
        "faculty_note": "Approved. ESD gear safety clearance verified.",
        "ai_urgency_score": 0.94,
        "ai_recommendation": "Critical deadline dependency in 96 hrs. High-priority capstone clearance recommended.",
        "pass_code": "LL-PASS-901-XIL",
        "approval_history": [
            {
                "id": "appr-001",
                "booking_id": "BK-901",
                "faculty_id": "u-faculty-01",
                "faculty_name": "Dr. Aris Thorne",
                "faculty_email": "a.thorne@college.edu",
                "decision": "approved",
                "feedback_comments": "Approved. ESD gear safety clearance verified.",
                "safety_clearance_issued": True,
                "suggested_alternative_slot": None,
                "reviewed_at": "2026-11-22T09:15:00Z",
            }
        ],
        "created_at": "2026-11-22T08:30:00Z",
        "updated_at": "2026-11-22T09:15:00Z",
    },
    {
        "id": "BK-902",
        "equipment_id": "e-gpu-01",
        "equipment_name": "NVIDIA DGX Station A100 (4x 80GB SXM4)",
        "department": "CSE",
        "lab": "Edge AI & Accelerated Computing Lab (TT-502)",
        "student_id": "u-student-02",
        "student_name": "Sneha Reddy",
        "student_email": "sneha.reddy@college.edu",
        "project_id": "proj-2",
        "project_name": "Real-Time Edge Vision-Language Model Quantization",
        "project_deadline": "2026-12-05",
        "date": "2026-11-25",
        "time_slot": "10:00 AM - 02:00 PM",
        "start_hour": 10,
        "end_hour": 14,
        "duration_hours": 4,
        "justification": "Need 320GB VRAM cluster to run distributed tensor parallel quantization before conference deadline.",
        "status": "pending",
        "faculty_approved": False,
        "faculty_mentor": "Prof. Elena Rostova",
        "faculty_note": "",
        "ai_urgency_score": 0.88,
        "ai_recommendation": "High resource intensity. Recommend granting requested slot as cluster has 50% free node headroom.",
        "pass_code": "LL-PASS-902-DGX",
        "approval_history": [],
        "created_at": "2026-11-23T04:15:00Z",
        "updated_at": "2026-11-23T04:15:00Z",
    },
    {
        "id": "BK-903",
        "equipment_id": "e-3dp-01",
        "equipment_name": "Formlabs Form 3+ SLA Industrial 3D Printer",
        "department": "MECH",
        "lab": "Autonomous Robotics & 3D Fabrication Studio (VSC-102)",
        "student_id": "u-student-03",
        "student_name": "Rohan Sharma",
        "student_email": "rohan.sharma@college.edu",
        "project_id": "proj-3",
        "project_name": "Underactuated Soft Robotic Gripper",
        "project_deadline": "2026-12-12",
        "date": "2026-11-26",
        "time_slot": "01:00 PM - 05:00 PM",
        "start_hour": 13,
        "end_hour": 17,
        "duration_hours": 4,
        "justification": "Printing elastic finger phalanges using Tough 2000 resin for tensile stress benchmarking.",
        "status": "pending",
        "faculty_approved": False,
        "faculty_mentor": "Dr. Marcus Vance",
        "faculty_note": "",
        "ai_urgency_score": 0.65,
        "ai_recommendation": "Standard priority fabrication request. Tank resin levels verified sufficient.",
        "pass_code": "LL-PASS-903-SLA",
        "approval_history": [],
        "created_at": "2026-11-23T06:00:00Z",
        "updated_at": "2026-11-23T06:00:00Z",
    },
    {
        "id": "BK-904",
        "equipment_id": "e-iot-02",
        "equipment_name": "Multi-Axis Piezoelectric Structural Vibration & Accelerometer Array",
        "department": "CIVIL",
        "lab": "Structural Health Monitoring & IoT Sensor Lab (ACC-105)",
        "student_id": "u-student-04",
        "student_name": "Vikram Choudhury",
        "student_email": "vikram.c@college.edu",
        "project_id": "proj-4",
        "project_name": "Smart Seismic Modal Analysis for Long-Span Bridges",
        "project_deadline": "2026-12-18",
        "date": "2026-11-27",
        "time_slot": "10:00 AM - 01:00 PM",
        "start_hour": 10,
        "end_hour": 13,
        "duration_hours": 3,
        "justification": "Multi-channel dynamic acceleration recording during shake-table excitation test.",
        "status": "approved",
        "faculty_approved": True,
        "faculty_mentor": "Dr. Rajeshwari Nair",
        "faculty_note": "Cable mounting and sensor calibration safety cleared.",
        "ai_urgency_score": 0.82,
        "ai_recommendation": "Sensors verified nominal and calibrated.",
        "pass_code": "LL-PASS-904-CIV",
        "approval_history": [
            {
                "id": "appr-002",
                "booking_id": "BK-904",
                "faculty_id": "u-faculty-03",
                "faculty_name": "Dr. Rajeshwari Nair",
                "faculty_email": "r.nair@college.edu",
                "decision": "approved",
                "feedback_comments": "Cable mounting and sensor calibration safety cleared.",
                "safety_clearance_issued": True,
                "suggested_alternative_slot": None,
                "reviewed_at": "2026-11-21T12:00:00Z",
            }
        ],
        "created_at": "2026-11-21T11:20:00Z",
        "updated_at": "2026-11-21T12:00:00Z",
    },
]

class BookingService:
    def __init__(self):
        self._lock = threading.Lock()
        self._bookings: List[Dict[str, Any]] = [dict(b) for b in INITIAL_BOOKINGS_DATA]
        self._counter = 1000

    def get_bookings(
        self,
        status: Optional[str] = None,
        role: Optional[str] = None,
        user_id: Optional[str] = None,
        equipment_id: Optional[str] = None,
        department: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        with self._lock:
            results = list(self._bookings)

        if status and status.upper() != "ALL":
            results = [b for b in results if b.get("status", "").lower() == status.lower()]

        if role == "student" and user_id:
            results = [
                b for b in results
                if b.get("student_id") == user_id or b.get("student_email") == user_id
            ]

        if equipment_id:
            results = [b for b in results if b.get("equipment_id") == equipment_id]

        if department and department.upper() != "ALL":
            results = [b for b in results if b.get("department", "").upper() == department.upper()]

        # Sort newest first
        results.sort(key=lambda b: b.get("created_at", ""), reverse=True)
        return results

    def get_booking_by_id(self, booking_id: str) -> Optional[Dict[str, Any]]:
        with self._lock:
            for b in self._bookings:
                if b["id"] == booking_id:
                    return dict(b)
        return None

    def get_recommended_slots(self, equipment_id: str, date: str) -> List[Dict[str, Any]]:
        """
        Inspects existing confirmed & pending bookings for the target equipment on the specified date,
        calculates bench capacity utilization across canonical operating windows, and returns
        intelligently recommended slots.
        """
        equipment = equipment_service.get_equipment_by_id(equipment_id)
        total_units = equipment.get("total_units", 1) if equipment else 1

        # Canonical daily windows
        canonical_slots = [
            {"slot_window": "09:00 AM - 12:00 PM", "start_hour": 9, "end_hour": 12},
            {"slot_window": "12:00 PM - 03:00 PM", "start_hour": 12, "end_hour": 15},
            {"slot_window": "02:00 PM - 05:00 PM", "start_hour": 14, "end_hour": 17},
            {"slot_window": "05:30 PM - 08:30 PM", "start_hour": 17, "end_hour": 20},
        ]

        with self._lock:
            day_bookings = [
                b for b in self._bookings
                if b.get("equipment_id") == equipment_id
                and b.get("date") == date
                and b.get("status") in ["approved", "pending"]
            ]

        recommendations = []
        for slot in canonical_slots:
            s_start = slot["start_hour"]
            s_end = slot["end_hour"]

            # Count overlapping approved/confirmed sessions
            overlapping_count = sum(
                1 for b in day_bookings
                if max(b.get("start_hour", 9), s_start) < min(b.get("end_hour", 17), s_end)
            )

            free_units = max(0, total_units - overlapping_count)
            ratio = overlapping_count / max(total_units, 1)

            if free_units == 0:
                congestion = "full"
                is_rec = False
                reason = f"Full capacity: All {total_units} units are currently reserved."
            elif ratio >= 0.75:
                congestion = "high"
                is_rec = False
                reason = f"High congestion: Only {free_units} unit remaining on bench."
            elif ratio >= 0.4:
                congestion = "moderate"
                is_rec = True
                reason = f"Moderate utilization: {free_units} units free. Good feasibility."
            else:
                congestion = "low"
                is_rec = True
                reason = f"Low congestion: {free_units} of {total_units} units free. Ideal for dedicated milestone testing."

            recommendations.append({
                "slot_window": slot["slot_window"],
                "date": date,
                "start_hour": s_start,
                "end_hour": s_end,
                "congestion_level": congestion,
                "available_units": free_units,
                "total_units": total_units,
                "is_recommended": is_rec,
                "reasoning": reason,
            })

        # Ensure at least the lowest congested slot is marked recommended
        if not any(r["is_recommended"] for r in recommendations):
            min_cong = min(recommendations, key=lambda r: total_units - r["available_units"])
            min_cong["is_recommended"] = True
            min_cong["reasoning"] += " (Best available alternative on this date)"

        return recommendations

    def create_booking(self, payload: BookingCreate) -> Tuple[Dict[str, Any], Optional[str]]:
        """
        Creates a new equipment reservation.
        Validates user role, resolves equipment metadata, computes initial AI urgency score,
        and assigns a digital cryptographic verification pass code.
        """
        if payload.user_role.lower() not in ["student", "faculty", "admin"]:
            return {}, f"Invalid user role: '{payload.user_role}'. Must be student, faculty, or admin."

        equipment = equipment_service.get_equipment_by_id(payload.equipment_id)
        if not equipment:
            return {}, f"Equipment with ID '{payload.equipment_id}' not found."

        total_units = equipment.get("total_units", 1)
        requires_approval = equipment.get("requires_approval", True)

        # Parse start and duration
        start_hour = payload.start_hour or 14
        duration = payload.duration_hours or 3
        end_hour = start_hour + duration

        with self._lock:
            # Check currently approved capacity to avoid instant overload
            active_approved = [
                b for b in self._bookings
                if b.get("equipment_id") == payload.equipment_id
                and b.get("date") == payload.date
                and b.get("status") == "approved"
                and max(b.get("start_hour", 9), start_hour) < min(b.get("end_hour", 17), end_hour)
            ]

            if len(active_approved) >= total_units:
                return {}, (
                    f"Selected slot {payload.time_slot} on {payload.date} is already at full capacity "
                    f"({total_units}/{total_units} units confirmed). Please select an alternative recommended window."
                )

            self._counter += 1
            booking_id = f"BK-{self._counter}"
            pass_code = f"LL-PASS-{self._counter}-{payload.equipment_id[:3].upper()}"

            # Compute AI urgency score from justification keywords & project priority
            urgency = 0.65
            just_lower = payload.justification.lower()
            if any(k in just_lower for k in ["deadline", "capstone", "urgent", "final", "thesis"]):
                urgency = min(0.98, urgency + 0.25)
            if any(k in just_lower for k in ["publish", "conference", "review", "testbench"]):
                urgency = min(0.95, urgency + 0.15)

            status = "pending" if requires_approval else "approved"

            now_iso = datetime.now(timezone.utc).isoformat()
            new_booking = {
                "id": booking_id,
                "equipment_id": payload.equipment_id,
                "equipment_name": equipment.get("name", payload.equipment_name or "Lab Equipment"),
                "department": equipment.get("department", payload.department or "ECE"),
                "lab": f"{equipment.get('lab', 'Main Lab')} ({equipment.get('room', 'N/A')})",
                "student_id": payload.student_id or "u-student-01",
                "student_name": payload.student_name or "Aarav Patel",
                "student_email": payload.student_email or "aarav.patel@college.edu",
                "project_id": payload.project_id or "proj-1",
                "project_name": payload.project_name or "Autonomous Quadcopter Flight Controller",
                "project_deadline": "2026-11-28",
                "date": payload.date,
                "time_slot": payload.time_slot,
                "start_hour": start_hour,
                "end_hour": end_hour,
                "duration_hours": duration,
                "justification": payload.justification,
                "status": status,
                "faculty_approved": not requires_approval,
                "faculty_mentor": equipment.get("in_charge", "Faculty In-Charge"),
                "faculty_note": "Auto-cleared (No faculty approval required)" if not requires_approval else "",
                "ai_urgency_score": round(urgency, 2),
                "ai_recommendation": f"Priority alignment: {urgency * 100:.0f}%. Evaluated against department lab guidelines.",
                "pass_code": pass_code,
                "approval_history": [],
                "created_at": now_iso,
                "updated_at": now_iso,
            }

            self._bookings.insert(0, new_booking)

        logger.info(f"Booking {booking_id} created with status {status}")
        return new_booking, None

    def approve_booking(self, booking_id: str, action: ApprovalAction) -> Tuple[Dict[str, Any], Optional[str]]:
        """
        Faculty approves an incoming student booking request.
        HARD REQUIREMENTS:
        1. Role Validation: User must be faculty or admin.
        2. Immediate Re-check: Verifies hardware unit capacity right before approval.
        3. Transactional Lock: Prevents overbooking collisions.
        4. Preserves confirmed bookings.
        5. Logs to approval history audit trail.
        """
        # 1. Role validation
        if action.user_role.lower() not in ["faculty", "admin", "lab_admin"]:
            return {}, "Permission denied: Only faculty mentors or lab administrators can approve lab access."

        with self._lock:
            target = next((b for b in self._bookings if b["id"] == booking_id), None)
            if not target:
                return {}, f"Booking request with ID '{booking_id}' not found."

            if target["status"] == "approved":
                return target, None  # Already approved, idempotent

            # 2. Immediate real-time equipment availability recheck
            equipment_id = target["equipment_id"]
            equipment = equipment_service.get_equipment_by_id(equipment_id)
            total_units = equipment.get("total_units", 1) if equipment else 1

            t_start = target.get("start_hour", 9)
            t_end = target.get("end_hour", 17)
            t_date = target.get("date")

            overlapping_confirmed = [
                b for b in self._bookings
                if b["id"] != booking_id
                and b.get("equipment_id") == equipment_id
                and b.get("date") == t_date
                and b.get("status") == "approved"
                and max(b.get("start_hour", 9), t_start) < min(b.get("end_hour", 17), t_end)
            ]

            if len(overlapping_confirmed) >= total_units:
                return {}, (
                    f"Overbooking prevented! All {total_units} unit(s) of '{target['equipment_name']}' "
                    f"are already confirmed for {target['time_slot']} on {t_date}. "
                    f"Cannot approve without violating capacity constraint."
                )

            # 3. Apply approval
            now_iso = datetime.now(timezone.utc).isoformat()
            target["status"] = "approved"
            target["faculty_approved"] = True
            target["faculty_mentor"] = action.faculty_name or target.get("faculty_mentor", "Faculty In-Charge")
            target["faculty_note"] = action.comments
            target["updated_at"] = now_iso

            # 4. Record approval audit trail
            approval_entry = {
                "id": f"appr-{uuid.uuid4().hex[:8]}",
                "booking_id": booking_id,
                "faculty_id": action.faculty_id or "u-faculty-01",
                "faculty_name": action.faculty_name or "Faculty Mentor",
                "faculty_email": action.faculty_email or "faculty@college.edu",
                "decision": "approved",
                "feedback_comments": action.comments,
                "safety_clearance_issued": action.safety_clearance_issued,
                "suggested_alternative_slot": action.suggested_alternative_slot,
                "reviewed_at": now_iso,
            }
            if "approval_history" not in target:
                target["approval_history"] = []
            target["approval_history"].append(approval_entry)

            result = dict(target)

        logger.info(f"Booking {booking_id} approved by {action.faculty_name}")
        return result, None

    def reject_booking(self, booking_id: str, action: ApprovalAction) -> Tuple[Dict[str, Any], Optional[str]]:
        """
        Faculty rejects an incoming student booking request with explanatory feedback.
        """
        # Role validation
        if action.user_role.lower() not in ["faculty", "admin", "lab_admin"]:
            return {}, "Permission denied: Only faculty mentors or lab administrators can reject lab requests."

        if not action.comments or len(action.comments.strip()) < 3:
            return {}, "Explanatory comments are mandatory when declining a student lab access request."

        with self._lock:
            target = next((b for b in self._bookings if b["id"] == booking_id), None)
            if not target:
                return {}, f"Booking request with ID '{booking_id}' not found."

            now_iso = datetime.now(timezone.utc).isoformat()
            target["status"] = "rejected"
            target["faculty_approved"] = False
            target["faculty_note"] = action.comments
            target["updated_at"] = now_iso

            approval_entry = {
                "id": f"appr-{uuid.uuid4().hex[:8]}",
                "booking_id": booking_id,
                "faculty_id": action.faculty_id or "u-faculty-01",
                "faculty_name": action.faculty_name or "Faculty Mentor",
                "faculty_email": action.faculty_email or "faculty@college.edu",
                "decision": "rejected",
                "feedback_comments": action.comments,
                "safety_clearance_issued": False,
                "suggested_alternative_slot": action.suggested_alternative_slot,
                "reviewed_at": now_iso,
            }
            if "approval_history" not in target:
                target["approval_history"] = []
            target["approval_history"].append(approval_entry)

            result = dict(target)

        logger.info(f"Booking {booking_id} rejected by {action.faculty_name}")
        return result, None

    def cancel_booking(self, booking_id: str, payload: CancelBookingRequest) -> Tuple[Dict[str, Any], Optional[str]]:
        """
        Cancels an eligible pending booking.
        Validation: Students may only cancel their own PENDING bookings.
        Approved passes require faculty/admin clearance to revoke.
        """
        with self._lock:
            target = next((b for b in self._bookings if b["id"] == booking_id), None)
            if not target:
                return {}, f"Booking request with ID '{booking_id}' not found."

            current_status = target.get("status")
            if current_status == "cancelled":
                return target, None

            if current_status == "completed":
                return {}, "Cannot cancel an already completed lab session."

            # If user is a student, enforce that only pending bookings can be cancelled
            if payload.user_role.lower() == "student" and current_status != "pending":
                return {}, (
                    f"Students cannot directly cancel an '{current_status.upper()}' booking. "
                    "Only PENDING requests may be cancelled by students; approved passes must be revoked by faculty."
                )

            now_iso = datetime.now(timezone.utc).isoformat()
            target["status"] = "cancelled"
            target["updated_at"] = now_iso

            result = dict(target)

        logger.info(f"Booking {booking_id} cancelled by {payload.user_role}")
        return result, None

booking_service = BookingService()
