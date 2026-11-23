"""
LabLink - End-to-End Demo Scenario Verification Script
Tests the exact sequence:
1. Student submits Autonomous Robotics project with deadline to AI analyzer.
2. AI analyzer identifies Raspberry Pi, camera/vision, and robotics kit requirements.
3. LabLink discovers equipment across CSE, MECH, and ECE departments.
4. Multiple students compete for limited NVIDIA DGX Station A100 GPU workstation.
5. Google OR-Tools CP-SAT scheduler recommends fair allocation based on deadline urgency and historical access.
6. Student submits reservation for recommended slot.
7. Faculty reviews project justification and approves with comments & safety clearance.
8. Student receives confirmed reservation with Digital Lab Pass credential.
9. Campus analytics updates in real-time.
"""

import sys
import json
from starlette.testclient import TestClient
from app.main import app

def run_e2e_demo_scenario():
    client = TestClient(app)
    print("=" * 70)
    print(" LABLINK END-TO-END DEMO SCENARIO VERIFICATION")
    print("=" * 70)

    # ---------------------------------------------------------
    # STEP 1: HEALTH CHECK
    # ---------------------------------------------------------
    print("\n[STEP 1] Checking API Health & Engine Status...")
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    health_data = res.json()
    print(f"✓ Health Check 200 OK: Service '{health_data['service']}' online.")
    print(f"  Features: {health_data['features']}")

    # ---------------------------------------------------------
    # STEP 2: STUDENT SUBMITS AUTONOMOUS ROBOTICS PROJECT TO AI ANALYZER
    # ---------------------------------------------------------
    print("\n[STEP 2] Student submits Autonomous Robotics project with deadline...")
    project_payload = {
        "title": "Autonomous Robotics Navigation & Vision Tracking",
        "description": "Developing an autonomous robotics platform with real-time OAK-D camera perception, 2D LiDAR SLAM, and edge motor control on Raspberry Pi. Requires high-throughput GPU workstation for visual SLAM deep learning training.",
        "required_completion_date": "2026-12-15",
        "project_duration": "4 Weeks",
    }
    res = client.post("/api/v1/ai/analyze-project", json=project_payload)
    assert res.status_code == 200, f"AI analyze failed: {res.text}"
    ai_result = res.json()

    print(f"✓ AI Analyzer Engine: {ai_result['engine_mode']}")
    print(f"✓ Category Identified: {ai_result['project_category']}")
    print(f"✓ Domain Summary: {ai_result['domain_summary']}")

    # ---------------------------------------------------------
    # STEP 3: VERIFY GEMINI IDENTIFIES RASPBERRY PI, CAMERA, ROBOTICS KIT
    # ---------------------------------------------------------
    print("\n[STEP 3] Verifying Extracted Requirements (Raspberry Pi, Camera, Robotics Kit)...")
    essential_names = [e["equipment_name"] for e in ai_result["essential_equipment"]]
    categories = [e["category"] for e in ai_result["essential_equipment"]]
    
    print(f"  Essential Equipment: {essential_names}")
    print(f"  Categories: {categories}")

    has_rpi = any("Raspberry Pi" in name or cat == "Raspberry Pi Kit" for name, cat in zip(essential_names, categories))
    has_robotics = any("Robotics" in cat or "Robot" in name or "TurtleBot" in name for name, cat in zip(essential_names, categories))
    has_camera = any("Camera" in str(e.get("technical_specifications", {})) or "Vision" in name for e, name in zip(ai_result["essential_equipment"], essential_names))

    assert has_rpi, "Missing Raspberry Pi requirement in AI extraction!"
    assert has_robotics, "Missing Robotics Kit requirement in AI extraction!"
    assert has_camera, "Missing Camera/Vision requirement in AI extraction!"
    print("✓ AI successfully extracted: Raspberry Pi, Camera/Vision Shield, and Robotics Platform.")

    # ---------------------------------------------------------
    # STEP 4: LABLINK DISCOVERS EQUIPMENT ACROSS DEPARTMENTS
    # ---------------------------------------------------------
    print("\n[STEP 4] LabLink discovers matched inventory across college departments...")
    matched = ai_result["matched_inventory"]
    departments_found = set(m["department"] for m in matched)
    print(f"✓ Matched {len(matched)} inventory items across {len(departments_found)} departments: {departments_found}")
    for item in matched:
        print(f"  - [{item['department']}] {item['name']} ({item['category']}) in {item['lab']} - {item['status']}")

    assert "CSE" in departments_found, "Expected CSE department equipment!"
    assert "MECH" in departments_found, "Expected MECH department equipment!"
    print("✓ Cross-department discovery verified (CSE + MECH).")

    # ---------------------------------------------------------
    # STEP 5: MULTIPLE STUDENTS COMPETE FOR LIMITED GPU WORKSTATION
    # ---------------------------------------------------------
    print("\n[STEP 5] Multiple students compete for limited GPU Workstation (e-gpu-01)...")
    demo_schedule_res = client.get("/api/v1/scheduler/demo-conflicts")
    assert demo_schedule_res.status_code == 200
    conflict_payload = demo_schedule_res.json()

    gpu_requests = [r for r in conflict_payload["requests"] if r["equipment_id"] == "e-gpu-01"]
    print(f"✓ Contending requests on NVIDIA DGX Station A100 (e-gpu-01): {len(gpu_requests)}")
    for r in gpu_requests:
        print(f"  * {r['student_name']}: '{r['project_title']}' | Start: {r['preferred_start_hour']}:00 | Deadline: {r['deadline_hours_remaining']}h | Prev Access: {r['previous_access_count']} | Tier: {r['priority_tier']}")

    assert len(gpu_requests) >= 2, "Expected at least 2 competing students on GPU workstation!"

    # ---------------------------------------------------------
    # STEP 6: OR-TOOLS CP-SAT RECOMMENDS FAIR ALLOCATIONS
    # ---------------------------------------------------------
    print("\n[STEP 6] Running Google OR-Tools CP-SAT Solver...")
    solve_res = client.post("/api/v1/scheduler/solve", json=conflict_payload)
    assert solve_res.status_code == 200
    solution = solve_res.json()

    print(f"✓ Solver Status: {solution['status']} (Solved in {solution['solver_time_ms']} ms)")
    print(f"✓ Accommodated: {solution['accommodated_count']}, Rejections/Deferred: {solution['rejected_count']}")
    print(f"✓ Campus Fairness Index: {solution['fairness_index']}%")

    # Verify Sneha (Autonomous Robotics Capstone) was accommodated for GPU
    gpu_accommodated = [a for a in solution["accommodations"] if a["equipment_id"] == "e-gpu-01"]
    assert len(gpu_accommodated) == 1, "Expected exactly 1 student accommodated on contested 1-unit GPU!"
    winner = gpu_accommodated[0]
    print(f"✓ Winner on contested GPU station: {winner['student_name']} -> Slot: {winner['formatted_time_slot']} (Score: {winner['composite_priority_score']})")
    assert "Sneha" in winner["student_name"], f"Expected Sneha Reddy to win allocation, got {winner['student_name']}"

    # Verify Vikram was deferred and given fair alternatives
    gpu_rejected = [rej for rej in solution["rejections"] if rej["equipment_id"] == "e-gpu-01"]
    assert len(gpu_rejected) >= 1, "Expected competing student to be deferred with alternative slot"
    deferred = gpu_rejected[0]
    print(f"✓ Contending student deferred: {deferred['student_name']}")
    print(f"  Reason: {deferred['rejection_reason']}")
    print(f"  Recommended Alternative Slots: {len(deferred['suggested_alternative_slots'])}")
    for alt in deferred["suggested_alternative_slots"]:
        print(f"    - {alt['formatted_time_slot']} ({alt['reason']})")

    # ---------------------------------------------------------
    # STEP 7: STUDENT SUBMITS RESERVATION FOR RECOMMENDED SLOT
    # ---------------------------------------------------------
    print("\n[STEP 7] Student submits reservation for recommended GPU workstation slot...")
    booking_req = {
        "equipment_id": "e-gpu-01",
        "student_id": "u-student-02",
        "student_name": "Sneha Reddy",
        "student_email": "sneha.reddy@college.edu",
        "department": "CSE",
        "project_id": "p-01",
        "project_name": "Autonomous Robotics Navigation & Vision (Capstone)",
        "date": "2026-11-25",
        "time_slot": "10:00 AM - 02:00 PM",
        "start_hour": 10,
        "duration_hours": 4,
        "justification": "Autonomous Robotics visual SLAM perception training on NVIDIA DGX Station A100",
        "user_role": "student",
    }
    create_res = client.post("/api/v1/bookings", json=booking_req)
    if create_res.status_code != 201:
        print(f"Error submitting booking: {create_res.status_code} -> {create_res.text}")
    assert create_res.status_code == 201, f"Failed: {create_res.text}"
    booking_data = create_res.json()
    booking_id = booking_data["id"]
    print(f"✓ Reservation Submitted: ID '{booking_id}', Status: '{booking_data['status']}', Pass: '{booking_data['pass_code']}'")

    # ---------------------------------------------------------
    # STEP 8: FACULTY APPROVES THE BOOKING
    # ---------------------------------------------------------
    print(f"\n[STEP 8] Faculty (Prof. Elena Rostova) reviews and approves booking '{booking_id}'...")
    approval_payload = {
        "decision": "approved",
        "faculty_id": "u-faculty-01",
        "faculty_name": "Prof. Elena Rostova",
        "faculty_email": "elena.rostova@college.edu",
        "user_role": "faculty",
        "comments": "Autonomous Robotics Capstone verified. High urgency milestone approved. Safety & Slurm quota cleared.",
        "safety_clearance_issued": True,
    }
    approve_res = client.post(f"/api/v1/bookings/{booking_id}/approve", json=approval_payload)
    assert approve_res.status_code == 200, f"Approval failed: {approve_res.text}"
    approved_data = approve_res.json()
    print(f"✓ Faculty Approval Granted: Status is now '{approved_data['status']}'")
    print(f"  Faculty Note: '{approved_data['faculty_note']}'")

    # ---------------------------------------------------------
    # STEP 9: STUDENT SEES CONFIRMATION & DIGITAL LAB PASS
    # ---------------------------------------------------------
    print(f"\n[STEP 9] Student inspects reservation details...")
    get_res = client.get(f"/api/v1/bookings/{booking_id}")
    assert get_res.status_code == 200
    student_view = get_res.json()
    assert student_view["status"] == "approved"
    assert student_view["pass_code"].startswith("LL-PASS-")
    print(f"✓ Confirmed Booking: {student_view['equipment_name']}")
    print(f"  Date & Time: {student_view['date']} @ {student_view['time_slot']}")
    print(f"  Digital Lab Clearance Pass: {student_view['pass_code']}")
    print(f"  Faculty Safety Approval: {student_view['faculty_approved']}")

    # ---------------------------------------------------------
    # STEP 10: VERIFY ANALYTICS OVERVIEW
    # ---------------------------------------------------------
    print("\n[STEP 10] Verifying Campus Real-Time Analytics Overview...")
    analytics_res = client.get("/api/v1/analytics/overview")
    assert analytics_res.status_code == 200
    analytics_data = analytics_res.json()
    print(f"✓ Analytics Overview 200 OK:")
    print(f"  Total Equipment Stations: {analytics_data['faculty_admin']['total_equipment_count']} stations ({analytics_data['faculty_admin']['total_units']} physical units)")
    print(f"  Campus Utilization: {analytics_data['faculty_admin']['equipment_utilization_rate']}%")
    print(f"  Departments tracked: {[d['department'] for d in analytics_data['faculty_admin']['department_usage']]}")
    print(f"  OR-Tools CP-SAT Solved Conflicts: {analytics_data['faculty_admin']['scheduling_conflicts']['resolved_via_cpsat']} (Fairness Index: {analytics_data['faculty_admin']['scheduling_conflicts']['fairness_index']}%)")

    print("\n" + "=" * 70)
    print(" ✓ END-TO-END DEMO SCENARIO VERIFIED SUCCESSFULLY WITH 100% PASS RATE!")
    print("=" * 70)

if __name__ == "__main__":
    run_e2e_demo_scenario()
