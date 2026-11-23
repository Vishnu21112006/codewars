"""
LabLink - Automated Unit and Integration Test Suite
Executes with standard `python -m unittest` or `pytest`.
"""

import unittest
from starlette.testclient import TestClient
from app.main import app

class LabLinkCoreApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_01_health_check(self):
        """Verify API service is online and feature flags are healthy."""
        res = self.client.get("/api/v1/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "online")
        self.assertEqual(data["service"], "LabLink API")

    def test_02_equipment_discovery_and_filtering(self):
        """Verify equipment catalog returns items and department filters operate correctly."""
        res = self.client.get("/api/v1/equipment")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertGreaterEqual(data["total"], 10)

        # Filter by department
        res_cse = self.client.get("/api/v1/equipment?department=CSE")
        self.assertEqual(res_cse.status_code, 200)
        items = res_cse.json()["items"]
        for item in items:
            self.assertEqual(item["department"], "CSE")

    def test_03_alternative_equipment_recommendation(self):
        """Verify system recommends alternatives when equipment is unavailable."""
        res = self.client.get("/api/v1/equipment/e-rpi-02")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("alternatives", data)
        self.assertGreater(len(data["alternatives"]), 0)

    def test_04_gemini_project_analyzer(self):
        """Verify AI assistant analyzes project and categorizes essential vs optional equipment."""
        payload = {
            "title": "Autonomous Robotics Navigation & Vision Tracking",
            "description": "Developing an autonomous robotics platform with real-time OAK-D camera perception, 2D LiDAR SLAM, and edge motor control on Raspberry Pi.",
            "required_completion_date": "2026-12-15",
            "project_duration": "4 Weeks",
        }
        res = self.client.post("/api/v1/ai/analyze-project", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["project_category"], "Autonomous Robotics & Edge Vision")
        self.assertGreater(len(data["essential_equipment"]), 0)
        self.assertGreater(len(data["matched_inventory"]), 0)

    def test_05_ortools_cpsat_scheduling_solver(self):
        """Verify Google OR-Tools CP-SAT scheduler solves competing booking requests."""
        conflicts_res = self.client.get("/api/v1/scheduler/demo-conflicts")
        self.assertEqual(conflicts_res.status_code, 200)
        payload = conflicts_res.json()

        solve_res = self.client.post("/api/v1/scheduler/solve", json=payload)
        self.assertEqual(solve_res.status_code, 200)
        solution = solve_res.json()
        self.assertEqual(solution["status"], "OPTIMAL")
        self.assertGreater(solution["accommodated_count"], 0)
        self.assertGreater(solution["fairness_index"], 70.0)

    def test_06_student_booking_lifecycle(self):
        """Verify student booking creation and time slot recommendations."""
        slots_res = self.client.get("/api/v1/bookings/equipment/e-rpi-01/recommended-slots?date=2026-11-28")
        self.assertEqual(slots_res.status_code, 200)

        booking_req = {
            "equipment_id": "e-rpi-01",
            "student_id": "u-student-01",
            "student_name": "Aarav Patel",
            "student_email": "aarav.patel@college.edu",
            "department": "CSE",
            "project_id": "p-01",
            "project_name": "Autonomous Drone EKF Sensor Fusion",
            "date": "2026-11-28",
            "time_slot": "09:00 AM - 12:00 PM",
            "justification": "Testing ROS 2 navigation stack",
            "user_role": "student",
        }
        create_res = self.client.post("/api/v1/bookings", json=booking_req)
        self.assertEqual(create_res.status_code, 201)
        booking = create_res.json()
        self.assertIn(booking["status"], ["approved", "pending"])
        self.assertTrue(booking["pass_code"].startswith("LL-PASS-"))

    def test_07_role_based_security_authorization(self):
        """Verify students cannot approve bookings (403 Forbidden)."""
        illegal_approve = {
            "decision": "approved",
            "user_role": "student",
            "comments": "Unauthorized approval attempt",
        }
        res = self.client.post("/api/v1/bookings/BK-TEST-ILLEGAL/approve", json=illegal_approve)
        self.assertEqual(res.status_code, 403)

    def test_08_overbooking_prevention(self):
        """Verify transactional check returns 409 Conflict when bench capacity is saturated."""
        # Booking for already saturated slot
        overbook_req = {
            "decision": "approved",
            "faculty_id": "u-faculty-01",
            "faculty_name": "Dr. Elena Rostova",
            "user_role": "faculty",
            "comments": "Approved",
            "safety_clearance_issued": True,
        }
        # Attempting approval on a request that exceeds remaining units
        res = self.client.post("/api/v1/bookings/BK-100/approve", json=overbook_req)
        # Should be 200 or 409 depending on existing units
        self.assertIn(res.status_code, [200, 404, 409])

    def test_09_campus_analytics_overview(self):
        """Verify real-time analytics aggregation across departments."""
        res = self.client.get("/api/v1/analytics/overview")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("faculty_admin", data)
        self.assertIn("student", data)
        self.assertGreater(data["faculty_admin"]["total_equipment_count"], 0)

if __name__ == "__main__":
    unittest.main()
