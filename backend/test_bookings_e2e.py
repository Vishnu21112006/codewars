from fastapi.testclient import TestClient
from app.main import app

def test_bookings_and_approvals_e2e():
    client = TestClient(app)

    print("=== TEST 1: Get Recommended Slots ===")
    res = client.get("/api/v1/bookings/equipment/e-dev-01/recommended-slots?date=2026-11-25")
    print("Recommended slots status:", res.status_code)
    assert res.status_code == 200
    slots = res.json()
    print("Slots returned:", len(slots))
    for s in slots:
        print(f"  Slot: {s['slot_window']} | Available: {s['available_units']}/{s['total_units']} | Congestion: {s['congestion_level']} | Rec: {s['is_recommended']}")
    assert len(slots) >= 3

    print("\n=== TEST 2: Student Submits Booking Request ===")
    create_payload = {
        "equipment_id": "e-dev-01",
        "equipment_name": "Xilinx Zynq UltraScale+ MPSoC ZCU102 Evaluation Board",
        "project_id": "proj-1",
        "project_name": "Autonomous Quadcopter Flight Controller",
        "date": "2026-11-29",
        "time_slot": "09:00 AM - 12:00 PM",
        "start_hour": 9,
        "duration_hours": 3,
        "justification": "Urgent final capstone milestone: Testing SPI IMU bus latency before evaluation.",
        "student_id": "u-student-01",
        "student_name": "Aarav Patel",
        "student_email": "aarav.patel@college.edu",
        "department": "ECE",
        "user_role": "student"
    }
    create_res = client.post("/api/v1/bookings", json=create_payload)
    print("Create booking status:", create_res.status_code)
    assert create_res.status_code == 201
    booking_data = create_res.json()
    b_id = booking_data["id"]
    print(f"Created Booking ID: {b_id}, Status: {booking_data['status']}, Pass: {booking_data['pass_code']}, Urgency: {booking_data['ai_urgency_score']}")
    assert booking_data["status"] == "pending"
    assert "LL-PASS-" in booking_data["pass_code"]

    print("\n=== TEST 3: Role Validation (Student cannot approve) ===")
    illegal_approve = {
        "decision": "approved",
        "faculty_id": "u-student-01",
        "faculty_name": "Aarav Patel",
        "faculty_email": "aarav.patel@college.edu",
        "comments": "Self approving my booking",
        "user_role": "student"
    }
    illegal_res = client.post(f"/api/v1/bookings/{b_id}/approve", json=illegal_approve)
    print("Illegal approve status (expected 403):", illegal_res.status_code)
    assert illegal_res.status_code == 403

    print("\n=== TEST 4: Student Cancels Eligible Pending Booking ===")
    # Create another booking to cancel
    temp_res = client.post("/api/v1/bookings", json={**create_payload, "date": "2026-11-30"})
    temp_id = temp_res.json()["id"]
    cancel_res = client.post(f"/api/v1/bookings/{temp_id}/cancel", json={
        "user_id": "u-student-01",
        "user_role": "student",
        "reason": "Rescheduled team hardware meeting"
    })
    print("Cancel status:", cancel_res.status_code)
    assert cancel_res.status_code == 200
    assert cancel_res.json()["status"] == "cancelled"

    print("\n=== TEST 5: Faculty Approves with Comments & Safety Clearance ===")
    faculty_approve_payload = {
        "decision": "approved",
        "faculty_id": "u-faculty-01",
        "faculty_name": "Dr. Aris Thorne",
        "faculty_email": "a.thorne@college.edu",
        "comments": "Milestone verified. Student has ESD wrist strap training. Lab clearance granted.",
        "safety_clearance_issued": True,
        "user_role": "faculty"
    }
    approve_res = client.post(f"/api/v1/bookings/{b_id}/approve", json=faculty_approve_payload)
    print("Faculty approve status:", approve_res.status_code)
    assert approve_res.status_code == 200
    approved_data = approve_res.json()
    assert approved_data["status"] == "approved"
    assert approved_data["faculty_approved"] is True
    assert "ESD wrist strap training" in approved_data["faculty_note"]

    print("\n=== TEST 6: Student Cannot Cancel Approved Booking Directly ===")
    student_cancel_approved = client.post(f"/api/v1/bookings/{b_id}/cancel", json={
        "user_id": "u-student-01",
        "user_role": "student"
    })
    print("Student cancel approved status (expected 400):", student_cancel_approved.status_code)
    assert student_cancel_approved.status_code == 400

    print("\n=== TEST 7: Overbooking Prevention (Immediate Recheck before Approval) ===")
    # Equipment e-dev-01 has 1 unit in our contention check or test setup
    # Create competing request for same date and time
    competing_res = client.post("/api/v1/bookings", json={
        **create_payload,
        "date": "2026-11-29",
        "time_slot": "09:00 AM - 12:00 PM",
        "student_id": "u-student-05",
        "student_name": "Kavya Sen",
        "student_email": "kavya.sen@college.edu",
        "justification": "DSP filtering"
    })
    competing_id = competing_res.json()["id"]

    # 1. Three students submit pending requests concurrently before approval
    gpu_b1 = client.post("/api/v1/bookings", json={
        "equipment_id": "e-gpu-01",
        "date": "2026-11-30",
        "time_slot": "10:00 AM - 02:00 PM",
        "start_hour": 10,
        "duration_hours": 4,
        "justification": "LLM fine-tuning session 1",
        "student_id": "u-student-02",
        "user_role": "student"
    }).json()["id"]

    gpu_b2 = client.post("/api/v1/bookings", json={
        "equipment_id": "e-gpu-01",
        "date": "2026-11-30",
        "time_slot": "10:00 AM - 02:00 PM",
        "start_hour": 10,
        "duration_hours": 4,
        "justification": "Vision Model session 2",
        "student_id": "u-student-06",
        "user_role": "student"
    }).json()["id"]

    gpu_b3 = client.post("/api/v1/bookings", json={
        "equipment_id": "e-gpu-01",
        "date": "2026-11-30",
        "time_slot": "10:00 AM - 02:00 PM",
        "start_hour": 10,
        "duration_hours": 4,
        "justification": "Distributed training session 3",
        "student_id": "u-student-07",
        "user_role": "student"
    }).json()["id"]

    # 2. Faculty approves first 2 requests (fills bench capacity of 2)
    gpu_approve1 = client.post(f"/api/v1/bookings/{gpu_b1}/approve", json=faculty_approve_payload)
    assert gpu_approve1.status_code == 200

    gpu_approve2 = client.post(f"/api/v1/bookings/{gpu_b2}/approve", json=faculty_approve_payload)
    assert gpu_approve2.status_code == 200

    # 3. Faculty tries to approve 3rd pending request -> Recheck detects overbooking & prevents it!
    overbook_res = client.post(f"/api/v1/bookings/{gpu_b3}/approve", json=faculty_approve_payload)
    print("Overbooking prevention status (expected 409 Conflict):", overbook_res.status_code)
    assert overbook_res.status_code == 409
    print("Overbooking prevention message:", overbook_res.json()["detail"])

    print("\n=== TEST 8: Faculty Rejection with Mandatory Explanation ===")
    reject_payload = {
        "decision": "rejected",
        "faculty_id": "u-faculty-01",
        "faculty_name": "Dr. Aris Thorne",
        "faculty_email": "a.thorne@college.edu",
        "comments": "Station is at capacity during peak hours. Please re-apply for off-peak evening slot (05:30 PM - 08:30 PM).",
        "suggested_alternative_slot": "05:30 PM - 08:30 PM",
        "user_role": "faculty"
    }
    reject_res = client.post(f"/api/v1/bookings/{gpu_b3}/reject", json=reject_payload)
    print("Reject status:", reject_res.status_code)
    assert reject_res.status_code == 200
    rejected_data = reject_res.json()
    assert rejected_data["status"] == "rejected"
    assert "off-peak evening slot" in rejected_data["faculty_note"]

    print("\n=== TEST 9: Approval History Audit Trail ===")
    history_res = client.get(f"/api/v1/bookings/{gpu_b3}/history")
    print("History status:", history_res.status_code)
    assert history_res.status_code == 200
    history_items = history_res.json()
    print("History items count:", len(history_items))
    assert len(history_items) == 1
    assert history_items[0]["decision"] == "rejected"
    assert history_items[0]["faculty_name"] == "Dr. Aris Thorne"

    print("\n=== TEST 10: List Bookings with Filters ===")
    all_res = client.get("/api/v1/bookings")
    assert all_res.status_code == 200
    list_data = all_res.json()
    print(f"Total: {list_data['total']}, Pending: {list_data['pending_count']}, Approved: {list_data['approved_count']}, Rejected: {list_data['rejected_count']}")
    assert list_data['total'] >= 5
    assert list_data['approved_count'] >= 1
    assert list_data['rejected_count'] >= 1

    print("\n✓ ALL 10 STUDENT BOOKING & FACULTY APPROVAL END-TO-END TESTS PASSED!")

if __name__ == "__main__":
    test_bookings_and_approvals_e2e()
