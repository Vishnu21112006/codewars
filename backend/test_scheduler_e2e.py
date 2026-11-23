from fastapi.testclient import TestClient
from app.main import app

def test_scheduler_e2e():
    client = TestClient(app)

    # 1. Health check
    res = client.get('/health')
    print('Health Check Status:', res.status_code, res.json())
    assert res.status_code == 200

    # 2. Scheduler demo conflicts
    res = client.get('/api/scheduler/demo-conflicts')
    print('Demo conflicts Status:', res.status_code)
    assert res.status_code == 200
    data = res.json()
    print('Requests count:', len(data['requests']))
    print('Capacities count:', len(data['equipment_capacities']))
    print('Confirmed count:', len(data['confirmed_bookings']))

    # 3. Solve demo scenario with OR-Tools CP-SAT
    solve_res = client.post('/api/scheduler/solve', json=data)
    print('Solve Status:', solve_res.status_code)
    assert solve_res.status_code == 200
    solve_data = solve_res.json()
    print('CP-SAT Solver Status:', solve_data['status'])
    print('Accommodated count:', solve_data['accommodated_count'])
    print('Rejected count:', solve_data['rejected_count'])
    print('Fairness Index:', solve_data['fairness_index'])
    print('Solving Time:', solve_data['solver_time_ms'], 'ms')

    print('\n--- ALLOCATIONS ---')
    for acc in solve_data['accommodations']:
        print(f"  [ACCEPTED] {acc['student_name']} -> {acc['formatted_time_slot']} (Score: {acc['composite_priority_score']}) | Window: {acc['assigned_start_hour']}:00-{acc['assigned_end_hour']}:00")

    print('\n--- REJECTIONS ---')
    for rej in solve_data['rejections']:
        print(f"  [DEFERRED] {rej['student_name']} -> Reason: {rej['rejection_reason']}")
        for alt in rej.get('suggested_alternative_slots', []):
            print(f"      Alternative Slot: {alt['date']} @ {alt['formatted_time_slot']} (Reason: {alt['reason']})")

    # 4. Test Overcapacity Contention (3 x 4-hour bookings on 1 unit in a 9-hour lab day)
    overcapacity_payload = {
        "requests": [
            {
                "id": "REQ-1",
                "student_id": "u-1",
                "student_name": "Student A (Urgent)",
                "project_title": "Critical Capstone Testing",
                "equipment_id": "e-test-single",
                "equipment_name": "Single Unit Rig",
                "date": "2026-11-25",
                "preferred_start_hour": 9,
                "duration_hours": 4,
                "deadline_hours_remaining": 24,
                "is_essential": True,
                "previous_access_count": 0,
                "priority_tier": "capstone_critical"
            },
            {
                "id": "REQ-2",
                "student_id": "u-2",
                "student_name": "Student B (High)",
                "project_title": "Robotics Final Benchmark",
                "equipment_id": "e-test-single",
                "equipment_name": "Single Unit Rig",
                "date": "2026-11-25",
                "preferred_start_hour": 13,
                "duration_hours": 4,
                "deadline_hours_remaining": 48,
                "is_essential": True,
                "previous_access_count": 1,
                "priority_tier": "high"
            },
            {
                "id": "REQ-3",
                "student_id": "u-3",
                "student_name": "Student C (Low Urgency)",
                "project_title": "Optional Trial Session",
                "equipment_id": "e-test-single",
                "equipment_name": "Single Unit Rig",
                "date": "2026-11-25",
                "preferred_start_hour": 10,
                "duration_hours": 4,
                "deadline_hours_remaining": 168,
                "is_essential": False,
                "previous_access_count": 5,
                "priority_tier": "low"
            }
        ],
        "confirmed_bookings": [],
        "equipment_capacities": [
            {
                "equipment_id": "e-test-single",
                "equipment_name": "Single Unit Rig",
                "available_units": 1,
                "lab_open_hour": 9,
                "lab_close_hour": 18
            }
        ]
    }

    print('\n--- TESTING OVERCAPACITY REJECTION & ALTERNATIVE SLOTS ---')
    overcap_res = client.post('/api/scheduler/solve', json=overcapacity_payload)
    assert overcap_res.status_code == 200
    overcap_data = overcap_res.json()
    print(f"Overcapacity status: {overcap_data['status']}")
    print(f"Accommodated: {overcap_data['accommodated_count']}, Rejected: {overcap_data['rejected_count']}")
    assert overcap_data['accommodated_count'] == 2
    assert overcap_data['rejected_count'] == 1
    rejected = overcap_data['rejections'][0]
    print(f"Rejected: {rejected['student_name']} -> Reason: {rejected['rejection_reason']}")
    print(f"Suggested Alternatives: {len(rejected['suggested_alternative_slots'])}")
    assert len(rejected['suggested_alternative_slots']) > 0

    print('\n✓ ALL END-TO-END SCHEDULER & REJECTION TESTS PASSED!')

if __name__ == '__main__':
    test_scheduler_e2e()
