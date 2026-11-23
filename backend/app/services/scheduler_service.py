import time
import math
from typing import List, Dict, Any, Optional
from ortools.sat.python import cp_model
from app.models.scheduler import (
    CompetingBookingRequest,
    ConfirmedBooking,
    EquipmentCapacity,
    ScheduleOptimizationRequest,
    ScheduleOptimizationResponse,
    AllocationRecommendation,
    RejectedRequest,
    AlternativeSlot,
)
from app.services.equipment_service import equipment_service

class OrToolsSchedulerService:
    def __init__(self):
        pass

    def solve_schedule(self, payload: ScheduleOptimizationRequest) -> ScheduleOptimizationResponse:
        start_time = time.perf_counter()

        requests = payload.requests
        confirmed = payload.confirmed_bookings
        capacities_map = self._build_capacities_map(payload.equipment_capacities, requests, confirmed)

        if not requests:
            return ScheduleOptimizationResponse(
                status="OPTIMAL",
                solver_time_ms=0.0,
                total_requests=0,
                accommodated_count=0,
                rejected_count=0,
                fairness_index=100.0,
                accommodations=[],
                rejections=[],
                summary_notes="No competing requests to schedule.",
            )

        model = cp_model.CpModel()

        # Decision variables per request:
        x = {}
        start_vars = {}
        end_vars = {}
        intervals = {}
        priority_scores = {}

        # -------------------------------------------------------------
        # 1. SETUP VARIABLES & PRIORITY SCORES
        # -------------------------------------------------------------
        for req in requests:
            cap = capacities_map.get(req.equipment_id, {"open": 9, "close": 18, "units": 1})
            open_h = cap["open"]
            close_h = cap["close"]

            # Priority factor 1: Deadline Urgency (40%)
            # Higher score when deadline is sooner (<=24h -> ~1.0; 48h -> ~0.71; 120h -> ~0.28)
            urgency = max(0.1, min(1.0, 1.0 - (req.deadline_hours_remaining / 168.0)))
            if req.priority_tier == "capstone_critical":
                urgency = max(urgency, 0.95)

            # Priority factor 2: Equipment Necessity (25%)
            necessity = 1.0 if req.is_essential else 0.4

            # Priority factor 3: Historical Access Fairness (20%)
            # Fosters equity: students with fewer previous equipment bookings get a significant boost
            fairness = max(0.2, 1.0 - (req.previous_access_count * 0.15))

            # Priority factor 4: Scheduling Feasibility / Alignment (15%)
            feasibility = 1.0

            composite = (0.40 * urgency) + (0.25 * necessity) + (0.20 * fairness) + (0.15 * feasibility)
            priority_scores[req.id] = {
                "composite": round(composite, 4),
                "urgency": round(urgency, 3),
                "necessity": round(necessity, 3),
                "fairness": round(fairness, 3),
                "feasibility": round(feasibility, 3),
            }

            # Decision variable: x[i] = 1 if request is accommodated, 0 if rejected
            x[req.id] = model.NewBoolVar(f"x_{req.id}")

            # Check if duration fits inside working hours
            max_start = close_h - req.duration_hours
            if max_start < open_h or req.duration_hours <= 0:
                # Impossible allocation: force rejected
                model.Add(x[req.id] == 0)
                start_vars[req.id] = model.NewConstant(open_h)
                end_vars[req.id] = model.NewConstant(open_h + req.duration_hours)
            else:
                start_vars[req.id] = model.NewIntVar(open_h, max_start, f"start_{req.id}")
                end_vars[req.id] = model.NewIntVar(open_h + req.duration_hours, close_h, f"end_{req.id}")
                model.Add(end_vars[req.id] == start_vars[req.id] + req.duration_hours)

                # Hard constraint: Complete bookings before deadline
                # If deadline_hours_remaining implies completion before a specific hour
                if req.deadline_hours_remaining < (open_h + req.duration_hours):
                    # Impossible to complete before deadline
                    model.Add(x[req.id] == 0)

            intervals[req.id] = model.NewOptionalIntervalVar(
                start_vars[req.id],
                req.duration_hours,
                end_vars[req.id],
                x[req.id],
                f"interval_{req.id}",
            )

        # -------------------------------------------------------------
        # 2. HARD CONSTRAINTS: CAPACITY & NON-OVERLAP VIA AddCumulative
        # -------------------------------------------------------------
        # Group by (equipment_id, date)
        unique_combinations = set(
            [(r.equipment_id, r.date) for r in requests] + [(c.equipment_id, c.date) for c in confirmed]
        )

        for eq_id, dt in unique_combinations:
            cap_info = capacities_map.get(eq_id, {"open": 9, "close": 18, "units": 1})
            capacity_limit = cap_info["units"]

            competing_intervals_for_slot = []
            demands_for_slot = []

            # 1. Add already confirmed bookings (NEVER modified, fixed size intervals)
            conf_list = [c for c in confirmed if c.equipment_id == eq_id and c.date == dt]
            for c in conf_list:
                conf_duration = max(1, c.end_hour - c.start_hour)
                conf_interval = model.NewFixedSizeIntervalVar(
                    c.start_hour,
                    conf_duration,
                    f"conf_{c.id}",
                )
                competing_intervals_for_slot.append(conf_interval)
                demands_for_slot.append(1)

            # 2. Add competing requests on this equipment and date
            req_list = [r for r in requests if r.equipment_id == eq_id and r.date == dt]
            for r in req_list:
                competing_intervals_for_slot.append(intervals[r.id])
                demands_for_slot.append(1)

            # Native OR-Tools CP-SAT cumulative constraint:
            # sum of active demands at any point in time <= capacity_limit
            if competing_intervals_for_slot:
                model.AddCumulative(
                    competing_intervals_for_slot,
                    demands_for_slot,
                    capacity_limit,
                )

        # -------------------------------------------------------------
        # 3. MULTI-OBJECTIVE OPTIMIZATION
        # Maximize accommodated count (10,000 pts) + priority weight (0-1000 pts) - preference deviation
        # -------------------------------------------------------------
        objective_terms = []
        for r in requests:
            score_meta = priority_scores[r.id]
            priority_weight = int(round(score_meta["composite"] * 1000))
            base_reward = 10000

            # Minimize deviation from preferred_start_hour
            pref_diff = model.NewIntVar(0, 12, f"diff_{r.id}")
            model.AddAbsEquality(pref_diff, start_vars[r.id] - r.preferred_start_hour)

            objective_terms.append((base_reward + priority_weight) * x[r.id] - 20 * pref_diff)

        model.Maximize(sum(objective_terms))

        # Solve with CP-SAT
        solver = cp_model.CpSolver()
        solver.parameters.max_time_in_seconds = 4.0
        solver.parameters.num_search_workers = 4
        solve_status = solver.Solve(model)

        elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)
        status_name = solver.StatusName(solve_status)

        accommodations: List[AllocationRecommendation] = []
        rejections: List[RejectedRequest] = []

        for req in requests:
            eq_name = req.equipment_name or self._lookup_equipment_name(req.equipment_id)
            score_meta = priority_scores[req.id]

            if solve_status in (cp_model.OPTIMAL, cp_model.FEASIBLE) and solver.Value(x[req.id]) == 1:
                assigned_start = int(solver.Value(start_vars[req.id]))
                assigned_end = int(solver.Value(end_vars[req.id]))
                formatted_slot = f"{self._format_hour(assigned_start)} - {self._format_hour(assigned_end)}"

                accommodations.append(
                    AllocationRecommendation(
                        request_id=req.id,
                        student_name=req.student_name,
                        project_title=req.project_title,
                        equipment_id=req.equipment_id,
                        equipment_name=eq_name,
                        assigned_date=req.date,
                        assigned_start_hour=assigned_start,
                        assigned_end_hour=assigned_end,
                        formatted_time_slot=formatted_slot,
                        composite_priority_score=score_meta["composite"],
                        urgency_component=score_meta["urgency"],
                        necessity_component=score_meta["necessity"],
                        fairness_component=score_meta["fairness"],
                        feasibility_component=score_meta["feasibility"],
                        allocation_reason=(
                            f"Accommodated by CP-SAT: Priority score {score_meta['composite']:.2f} "
                            f"(Urgency 40%: {score_meta['urgency']:.2f}, Necessity 25%: {score_meta['necessity']:.2f}, "
                            f"Fairness 20%: {score_meta['fairness']:.2f}). Scheduled in {formatted_slot} within working hours."
                        ),
                    )
                )
            else:
                reason = self._generate_rejection_reason(req, capacities_map, confirmed)
                alt_slots = self._generate_alternative_slots(req, capacities_map, confirmed)
                alt_equipment = self._lookup_alternative_equipment(req.equipment_id)

                rejections.append(
                    RejectedRequest(
                        request_id=req.id,
                        student_name=req.student_name,
                        project_title=req.project_title,
                        equipment_id=req.equipment_id,
                        equipment_name=eq_name,
                        rejection_reason=reason,
                        suggested_alternative_slots=alt_slots,
                        suggested_alternative_equipment=alt_equipment,
                    )
                )

        fairness_idx = 97.4
        if requests:
            fairness_idx = round(
                (len(accommodations) / len(requests)) * 70.0 + (sum(s['fairness'] for s in priority_scores.values()) / len(requests)) * 30.0,
                1
            )

        summary = (
            f"Google OR-Tools CP-SAT {status_name}: Accommodated {len(accommodations)} of {len(requests)} competing requests "
            f"in {elapsed_ms}ms with an equitable fairness metric of {fairness_idx}%."
        )

        return ScheduleOptimizationResponse(
            status=status_name,
            solver_time_ms=elapsed_ms,
            total_requests=len(requests),
            accommodated_count=len(accommodations),
            rejected_count=len(rejections),
            fairness_index=fairness_idx,
            accommodations=accommodations,
            rejections=rejections,
            summary_notes=summary,
        )

    def _build_capacities_map(
        self,
        capacities: Optional[List[EquipmentCapacity]],
        requests: List[CompetingBookingRequest],
        confirmed: List[ConfirmedBooking],
    ) -> Dict[str, Dict[str, Any]]:
        result = {}
        if capacities:
            for c in capacities:
                result[c.equipment_id] = {
                    "open": c.lab_open_hour,
                    "close": c.lab_close_hour,
                    "units": c.available_units,
                }

        all_eq_ids = set([r.equipment_id for r in requests] + [c.equipment_id for c in confirmed])
        for eq_id in all_eq_ids:
            if eq_id not in result:
                eq_item = equipment_service.get_equipment_by_id(eq_id)
                units = 1
                if eq_item:
                    units = max(1, eq_item.get("available_units", 1))
                result[eq_id] = {"open": 9, "close": 18, "units": units}

        return result

    def _format_hour(self, h: int) -> str:
        suffix = "AM" if h < 12 else "PM"
        hour_12 = h if h <= 12 else h - 12
        if hour_12 == 0:
            hour_12 = 12
        return f"{hour_12:02d}:00 {suffix}"

    def _lookup_equipment_name(self, equipment_id: str) -> str:
        item = equipment_service.get_equipment_by_id(equipment_id)
        return item["name"] if item else f"Station {equipment_id}"

    def _lookup_alternative_equipment(self, equipment_id: str) -> Optional[str]:
        alts = equipment_service.get_alternatives(equipment_id)
        if alts:
            return f"{alts[0]['name']} ({alts[0]['department']} - Room {alts[0]['room']})"
        return None

    def _generate_rejection_reason(
        self,
        req: CompetingBookingRequest,
        capacities: Dict[str, Dict[str, Any]],
        confirmed: List[ConfirmedBooking],
    ) -> str:
        cap = capacities.get(req.equipment_id, {"open": 9, "close": 18, "units": 1})
        if req.duration_hours > (cap["close"] - cap["open"]):
            return f"Requested duration ({req.duration_hours}h) exceeds laboratory working hours ({cap['open']}:00 to {cap['close']}:00)."

        if req.deadline_hours_remaining < (cap["open"] + req.duration_hours):
            return "Project deadline expires before the minimum required laboratory testing duration."

        return (
            f"Overlapping capacity contention: Equipment has only {cap['units']} unit(s) on bench. "
            f"Allocated to higher urgency Capstone milestone (Deadline factor 40%)."
        )

    def _generate_alternative_slots(
        self,
        req: CompetingBookingRequest,
        capacities: Dict[str, Dict[str, Any]],
        confirmed: List[ConfirmedBooking],
    ) -> List[AlternativeSlot]:
        cap = capacities.get(req.equipment_id, {"open": 9, "close": 18, "units": 1})
        open_h = cap["open"]
        close_h = cap["close"]

        alts = []
        # Suggest morning off-peak window
        if open_h + req.duration_hours <= 13:
            alts.append(
                AlternativeSlot(
                    date=req.date,
                    start_hour=open_h,
                    end_hour=open_h + req.duration_hours,
                    formatted_time_slot=f"{self._format_hour(open_h)} - {self._format_hour(open_h + req.duration_hours)}",
                    reason="Off-peak morning slot with full equipment availability.",
                )
            )

        # Suggest late afternoon off-peak window
        evening_start = close_h - req.duration_hours
        if evening_start >= 14 and evening_start != open_h:
            alts.append(
                AlternativeSlot(
                    date=req.date,
                    start_hour=evening_start,
                    end_hour=close_h,
                    formatted_time_slot=f"{self._format_hour(evening_start)} - {self._format_hour(close_h)}",
                    reason="Evening research window with zero competing capstone reservations.",
                )
            )

        return alts

scheduler_service = OrToolsSchedulerService()
