from fastapi import APIRouter, HTTPException, status
from app.models.scheduler import (
    ScheduleOptimizationRequest,
    ScheduleOptimizationResponse,
    CompetingBookingRequest,
    ConfirmedBooking,
    EquipmentCapacity,
)
from app.services.scheduler_service import scheduler_service

router = APIRouter(prefix="/scheduler", tags=["Intelligent Equipment Scheduling (OR-Tools CP-SAT)"])

@router.post("/solve", response_model=ScheduleOptimizationResponse)
async def solve_equipment_schedule(payload: ScheduleOptimizationRequest):
    """
    Intelligently allocates limited laboratory workstations among competing student project requests
    using Google OR-Tools CP-SAT constraint satisfaction programming.
    Enforces capacity bounds, working hours, deadlines, confirmed unmodifiable slots, and fairness weights.
    """
    try:
        response = scheduler_service.solve_schedule(payload)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Scheduling engine constraint optimization failed: {str(e)}",
        )

@router.get("/demo-conflicts", response_model=ScheduleOptimizationRequest)
async def get_demo_conflicts():
    """
    Returns a pre-configured multi-department conflict scenario featuring overlapping
    capstone vs mini-project demands on Xilinx FPGA, NVIDIA DGX A100, and Formlabs 3D printers.
    """
    return ScheduleOptimizationRequest(
        requests=[
            CompetingBookingRequest(
                id="REQ-AARAV-01",
                student_id="u-student-01",
                student_name="Aarav Patel",
                project_title="Autonomous Quadcopter Flight Controller (ECE Capstone)",
                equipment_id="e-dev-01",
                equipment_name="Xilinx Zynq UltraScale+ MPSoC ZCU102 Evaluation Board",
                date="2026-11-25",
                preferred_start_hour=14,  # 2:00 PM
                duration_hours=3,
                deadline_hours_remaining=48,  # Critical milestone in 48 hours
                is_essential=True,
                previous_access_count=1,
                priority_tier="capstone_critical",
            ),
            CompetingBookingRequest(
                id="REQ-KAVYA-02",
                student_id="u-student-05",
                student_name="Kavya Sen",
                project_title="DSP Audio Filter Prototyping (ECE Mini-Project)",
                equipment_id="e-dev-01",
                equipment_name="Xilinx Zynq UltraScale+ MPSoC ZCU102 Evaluation Board",
                date="2026-11-25",
                preferred_start_hour=14,  # Contending 2:00 PM slot!
                duration_hours=3,
                deadline_hours_remaining=120, # Deadline 5 days away
                is_essential=True,
                previous_access_count=0, # Higher fairness boost
                priority_tier="medium",
            ),
            CompetingBookingRequest(
                id="REQ-SNEHA-03",
                student_id="u-student-02",
                student_name="Sneha Reddy",
                project_title="Autonomous Robotics Navigation & Vision (Capstone)",
                equipment_id="e-gpu-01",
                equipment_name="NVIDIA DGX Station A100 (4x 80GB SXM4)",
                date="2026-11-25",
                preferred_start_hour=10,  # 10:00 AM Contested GPU Slot
                duration_hours=4,
                deadline_hours_remaining=36, # Critical Capstone deadline in 36h
                is_essential=True,
                previous_access_count=0, # High fairness equity boost
                priority_tier="capstone_critical",
            ),
            CompetingBookingRequest(
                id="REQ-VIKRAM-04",
                student_id="u-student-06",
                student_name="Vikram Mehta",
                project_title="Diffusion Model Fine-Tuning (Mini-Project)",
                equipment_id="e-gpu-01",
                equipment_name="NVIDIA DGX Station A100 (4x 80GB SXM4)",
                date="2026-11-25",
                preferred_start_hour=10,  # Competing for the exact same 10:00 AM GPU Slot!
                duration_hours=4,
                deadline_hours_remaining=144, # Deadline 6 days away
                is_essential=True,
                previous_access_count=3, # Already used lab 3 times this month
                priority_tier="medium",
            ),
            CompetingBookingRequest(
                id="REQ-ROHAN-05",
                student_id="u-student-03",
                student_name="Rohan Sharma",
                project_title="Underactuated Soft Robotic Gripper (MECH Capstone)",
                equipment_id="e-3dp-01",
                equipment_name="Formlabs Form 3+ SLA Industrial 3D Printer",
                date="2026-11-25",
                preferred_start_hour=13,  # 1:00 PM
                duration_hours=4,
                deadline_hours_remaining=96,
                is_essential=True,
                previous_access_count=1,
                priority_tier="high",
            ),
        ],
        confirmed_bookings=[
            ConfirmedBooking(
                id="CONFIRMED-88",
                equipment_id="e-dev-01",
                date="2026-11-25",
                start_hour=9,
                end_hour=12,
                student_name="Tanvi Verma",
                project_title="Silicon Physical Synthesis Calibration",
            ),
            ConfirmedBooking(
                id="CONFIRMED-GPU-99",
                equipment_id="e-gpu-01",
                date="2026-11-25",
                start_hour=14,
                end_hour=18,
                student_name="PhD Lab Benchmark Run",
                project_title="Distributed LLM Training Validation",
            ),
        ],
        equipment_capacities=[
            EquipmentCapacity(
                equipment_id="e-dev-01",
                equipment_name="Xilinx Zynq UltraScale+ MPSoC ZCU102 Evaluation Board",
                available_units=1,  # Only 1 free hardware unit on bench!
                lab_open_hour=9,
                lab_close_hour=18,
            ),
            EquipmentCapacity(
                equipment_id="e-gpu-01",
                equipment_name="NVIDIA DGX Station A100 (4x 80GB SXM4)",
                available_units=1,
                lab_open_hour=9,
                lab_close_hour=18,
            ),
            EquipmentCapacity(
                equipment_id="e-3dp-01",
                equipment_name="Formlabs Form 3+ SLA Industrial 3D Printer",
                available_units=2,
                lab_open_hour=9,
                lab_close_hour=18,
            ),
        ],
    )
