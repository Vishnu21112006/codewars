import os
import json
import logging
from typing import Dict, Any, List, Optional
from app.core.config import settings
from app.models.ai import (
    ProjectAnalyzeRequest,
    ProjectAnalysisResponse,
    ExtractedEquipmentItem,
    MatchedInventoryItem,
)
from app.services.equipment_service import equipment_service

logger = logging.getLogger(__name__)

class AiProjectAnalyzerService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
        self.model_name = settings.GEMINI_MODEL or "gemini-1.5-flash"
        self._client = None
        self._init_genai_client()

    def _init_genai_client(self):
        """Initializes Google GenAI client if API key is provided."""
        if self.api_key and not self.api_key.startswith("your-") and len(self.api_key) > 10:
            try:
                from google import genai
                self._client = genai.Client(api_key=self.api_key)
                logger.info("Google GenAI SDK client initialized successfully.")
            except Exception as e:
                logger.warning(f"Could not initialize Google GenAI SDK: {e}. Demo mode active.")
                self._client = None
        else:
            self._client = None

    def analyze_project(self, req: ProjectAnalyzeRequest) -> ProjectAnalysisResponse:
        """
        Main entry point for project analysis.
        Uses Google Gemini API if client is available; otherwise performs deterministic domain analysis.
        Then matches extracted equipment against ACTUAL LabLink inventory.
        """
        extracted_data = None
        engine_mode = "deterministic_demo_mode"

        if self._client:
            try:
                extracted_data = self._call_gemini_api(req)
                if extracted_data:
                    engine_mode = "google_gemini_live"
            except Exception as e:
                logger.warning(f"Gemini API call failed ({e}). Reverting to deterministic demo mode.")
                extracted_data = None

        if not extracted_data:
            extracted_data = self._deterministic_fallback_analysis(req)
            engine_mode = "deterministic_demo_mode"

        # Match extracted items against actual LabLink inventory
        matched_inventory, unmatched = self._match_against_inventory(
            extracted_data.get("essential_equipment", []) + extracted_data.get("optional_equipment", [])
        )

        return ProjectAnalysisResponse(
            project_title=req.title,
            project_category=extracted_data.get("project_category", "Multi-Disciplinary Engineering"),
            domain_summary=extracted_data.get("domain_summary", req.description[:120]),
            technical_specifications=extracted_data.get("technical_specifications", {}),
            estimated_usage_duration=extracted_data.get("estimated_usage_duration", req.project_duration or "3 Weeks"),
            essential_equipment=[
                ExtractedEquipmentItem(**item) for item in extracted_data.get("essential_equipment", [])
            ],
            optional_equipment=[
                ExtractedEquipmentItem(**item) for item in extracted_data.get("optional_equipment", [])
            ],
            matched_inventory=matched_inventory,
            unmatched_equipment=[ExtractedEquipmentItem(**item) for item in unmatched],
            engine_mode=engine_mode,
            fairness_and_safety_notes=extracted_data.get(
                "fairness_and_safety_notes",
                "Google OR-Tools solver validates allocation constraints. Wear appropriate PPE and observe lab safety protocols."
            ),
        )

    def _call_gemini_api(self, req: ProjectAnalyzeRequest) -> Optional[Dict[str, Any]]:
        """Invokes Gemini API with prompt enforcing JSON structure."""
        prompt = f"""
You are an expert Chief Laboratory Engineer and Research Architect for a college campus resource-sharing platform named LabLink.
A student has submitted the following engineering project for laboratory resource analysis:

Project Title: {req.title}
Project Description: {req.description}
Target Completion Date: {req.required_completion_date or 'End of Semester'}
Estimated Project Duration: {req.project_duration or '4 Weeks'}

Extract and categorize the requirements into a strictly valid JSON object with the following fields:
1. "project_category": string (e.g., "Embedded Systems & FPGA", "Edge AI & Deep Learning", "Robotics & Automation", "Structural Dynamics & IoT")
2. "domain_summary": concise 2-sentence summary of the engineering requirements and methodology.
3. "technical_specifications": dictionary of key engineering specifications (e.g. {{"bandwidth": ">= 1GHz", "tpu_tops": ">= 4 TOPS", "fpga_cells": ">= 500K", "precision": "25 Micron"}}).
4. "estimated_usage_duration": string (e.g., "4 Weeks (approx 28 lab hours)").
5. "essential_equipment": list of objects for equipment that is mandatory to complete the core milestone. Each object has:
   - "equipment_name": string (e.g. "FPGA Evaluation Board", "Digital Storage Oscilloscope", "Raspberry Pi Kit", "GPU Workstation", "3D Printer", "IoT Sensor")
   - "category": string (one of: "Raspberry Pi Kit", "Arduino Kit", "GPU Workstation", "IoT Sensor", "Robotics Kit", "3D Printer", "Oscilloscope", "Development Board")
   - "required_quantity": integer (usually 1 or 2)
   - "technical_specifications": dictionary of required spec attributes
   - "estimated_usage_duration": string (e.g. "12 Hours")
   - "is_essential": true
   - "justification": string explaining why this exact station is required
6. "optional_equipment": list of objects (same structure as above, but with "is_essential": false) for non-critical enhancement or secondary testing.
7. "fairness_and_safety_notes": string detailing laboratory handling protocols and potential slot scheduling bottlenecks.

Return ONLY the raw JSON object, without backticks or markdown fences.
"""
        response = self._client.models.generate_content(
            model=self.model_name,
            contents=prompt,
        )

        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()

        return json.loads(text)

    def _deterministic_fallback_analysis(self, req: ProjectAnalyzeRequest) -> Dict[str, Any]:
        """
        Deterministic, domain-aware analyzer used when Gemini API key is not configured.
        Analyzes keywords to return accurate, realistic structured engineering specs.
        """
        text = f"{req.title} {req.description}".lower()

        # [A1] Autonomous Robotics & Vision Systems (matches user demo scenario)
        if any(k in text for k in ["autonomous robotics", "robotics project", "robot", "turtlebot", "rover", "ugv"]):
            return {
                "project_category": "Autonomous Robotics & Edge Vision",
                "domain_summary": "Autonomous ground robotics navigation pipeline combining real-time OAK-D camera vision odometry, 2D LiDAR SLAM, and edge compute on Raspberry Pi.",
                "technical_specifications": {
                    "Vision Sensor": "Luxonis OAK-D Spatial AI RGB-D 4K Camera",
                    "Edge SBC": "ARM Cortex-A76 with Coral M.2 PCIe Edge TPU (>= 4 TOPS)",
                    "Platform": "ROS 2 Humble, differential drive mobile base with LiDAR",
                    "Training Workstation": "Enterprise NVIDIA DGX Station for visual SLAM model fine-tuning",
                },
                "estimated_usage_duration": f"{req.project_duration or '4 Weeks'} (~28 Laboratory Hours)",
                "essential_equipment": [
                    {
                        "equipment_name": "Raspberry Pi 5 8GB Edge AI Starter Kit",
                        "category": "Raspberry Pi Kit",
                        "required_quantity": 1,
                        "technical_specifications": {"CPU": "Quad-Core ARM Cortex-A76", "RAM": "8GB LPDDR4X", "AI Accelerator": "Google Coral 4 TOPS Edge TPU"},
                        "estimated_usage_duration": "14 Hours",
                        "is_essential": True,
                        "justification": "Primary onboard computer running ROS 2 navigation stack, motor kinematics, and edge perception.",
                    },
                    {
                        "equipment_name": "TurtleBot 4 ROS 2 Mobile Robot Platform with 2D LiDAR & OAK-D",
                        "category": "Robotics Kit",
                        "required_quantity": 1,
                        "technical_specifications": {"Camera": "Luxonis OAK-D Spatial AI RGB-D", "LiDAR": "RPLIDAR A1 360-degree"},
                        "estimated_usage_duration": "12 Hours",
                        "is_essential": True,
                        "justification": "Physical robotic chassis with integrated Luxonis OAK-D camera and 2D LiDAR for autonomous obstacle avoidance.",
                    },
                    {
                        "equipment_name": "Arduino Portenta H7 Vision Shield Prototyping Kit",
                        "category": "Arduino Kit",
                        "required_quantity": 1,
                        "technical_specifications": {"Vision Sensor": "Himax HM-0360 Camera", "Microcontroller": "STM32H747XI Dual Core"},
                        "estimated_usage_duration": "6 Hours",
                        "is_essential": True,
                        "justification": "Dedicated ultra-low-power vision shield and optical gesture camera verification.",
                    },
                ],
                "optional_equipment": [
                    {
                        "equipment_name": "NVIDIA DGX Station A100 (4x 80GB SXM4)",
                        "category": "GPU Workstation",
                        "required_quantity": 1,
                        "technical_specifications": {"Compute GPUs": "4x NVIDIA A100 80GB", "Total VRAM": "320GB HBM2e"},
                        "estimated_usage_duration": "8 Hours",
                        "is_essential": False,
                        "justification": "Optional high-throughput GPU workstation for offline synthetic dataset rendering and model retraining.",
                    }
                ],
                "fairness_and_safety_notes": "Floor test arena must be cleared before initiating autonomous navigation. High-demand GPU workstation requires faculty approval and slot scheduling.",
            }

        # [A2] Aerial Drones & High-Frequency RF
        elif any(k in text for k in ["drone", "quadcopter", "manipulator", "arm", "uav", "lidar", "ros"]):
            return {
                "project_category": "Robotics & Autonomous Aerial Systems",
                "domain_summary": "Autonomous aerial or mobile robotics navigation pipeline integrating real-time sensor fusion and high-speed motor actuator telemetry.",
                "technical_specifications": {
                    "Controller Bus": "CAN-FD, SPI & I2C @ 10MHz+",
                    "AI Processing": "Real-time edge neural inference for visual odometry",
                    "Fabrication": "Lightweight high-strength aerodynamic brackets (<200g)",
                },
                "estimated_usage_duration": f"{req.project_duration or '4 Weeks'} (~30 Laboratory Hours)",
                "essential_equipment": [
                    {
                        "equipment_name": "Xilinx Zynq UltraScale+ MPSoC ZCU102 Evaluation Board",
                        "category": "Development Board",
                        "required_quantity": 1,
                        "technical_specifications": {"FPGA Logic": "600K Logic Cells", "ARM": "Quad Cortex-A53"},
                        "estimated_usage_duration": "18 Hours",
                        "is_essential": True,
                        "justification": "Required for hardware-accelerated Kalman filtering and attitude sensor fusion.",
                    },
                    {
                        "equipment_name": "Keysight Infiniium 1GHz 4-Channel Mixed Signal Oscilloscope",
                        "category": "Oscilloscope",
                        "required_quantity": 1,
                        "technical_specifications": {"Bandwidth": "1.0 GHz", "Channels": "4 Analog + 16 Digital MSO"},
                        "estimated_usage_duration": "8 Hours",
                        "is_essential": True,
                        "justification": "Required to verify SPI/CAN bus rise times and probe power-rail voltage ripple.",
                    },
                ],
                "optional_equipment": [
                    {
                        "equipment_name": "Formlabs Form 3+ SLA Industrial 3D Printer",
                        "category": "3D Printer",
                        "required_quantity": 1,
                        "technical_specifications": {"XY Resolution": "25 Micron", "Resin": "Tough 2000"},
                        "estimated_usage_duration": "4 Hours",
                        "is_essential": False,
                        "justification": "Optional for rapid iterative prototyping of custom vibration-isolated camera mount.",
                    }
                ],
                "fairness_and_safety_notes": "Handle FPGA on static-dissipative ESD mats. Safety goggles mandatory during rotor spin-up bench testing.",
            }

        # [B] AI / Deep Learning / LLM
        elif any(k in text for k in ["ai", "llm", "deep learning", "transformer", "vision", "dataset", "gpu", "neural"]):
            return {
                "project_category": "Edge AI & Accelerated Deep Learning",
                "domain_summary": "Distributed model quantization and high-throughput vision-language benchmarking on enterprise GPU clusters.",
                "technical_specifications": {
                    "GPU VRAM": ">= 80GB per node for multi-head tensor attention",
                    "Edge Deployment": "NVIDIA JetPack or Google Coral Edge TPU",
                    "Throughput": ">= 100 TOPS INT8 sparse",
                },
                "estimated_usage_duration": f"{req.project_duration or '3 Weeks'} (~25 Compute Hours)",
                "essential_equipment": [
                    {
                        "equipment_name": "NVIDIA DGX Station A100 (4x 80GB SXM4)",
                        "category": "GPU Workstation",
                        "required_quantity": 1,
                        "technical_specifications": {"Compute GPUs": "4x NVIDIA A100 80GB", "VRAM": "320GB HBM2e"},
                        "estimated_usage_duration": "16 Hours",
                        "is_essential": True,
                        "justification": "Mandatory for batch distributed weight quantization and pre-training convergence checks.",
                    },
                    {
                        "equipment_name": "Raspberry Pi 5 8GB Edge AI Starter Kit",
                        "category": "Raspberry Pi Kit",
                        "required_quantity": 1,
                        "technical_specifications": {"RAM": "8GB LPDDR4X", "AI Accelerator": "Google Coral 4 TOPS Edge TPU"},
                        "estimated_usage_duration": "10 Hours",
                        "is_essential": True,
                        "justification": "Target deployment platform for edge model latency and energy profiling.",
                    },
                ],
                "optional_equipment": [
                    {
                        "equipment_name": "TurtleBot 4 ROS 2 Mobile Robot Platform with 2D LiDAR & OAK-D",
                        "category": "Robotics Kit",
                        "required_quantity": 1,
                        "technical_specifications": {"Camera": "Luxonis OAK-D Spatial AI", "LiDAR": "RPLIDAR A1"},
                        "estimated_usage_duration": "6 Hours",
                        "is_essential": False,
                        "justification": "Optional physical ground validation for zero-shot object localization.",
                    }
                ],
                "fairness_and_safety_notes": "Slurm job quotas strictly enforced. Allocate VRAM memory carefully to allow concurrent research jobs.",
            }

        # [C] Civil / Structural / Environmental IoT
        elif any(k in text for k in ["civil", "bridge", "structure", "seismic", "vibration", "sensor", "concrete", "smart city", "geomatics"]):
            return {
                "project_category": "Smart Civil Infrastructure & IoT Telemetry",
                "domain_summary": "Structural health monitoring and dynamic resonance vibration analysis of infrastructure models under seismic excitation.",
                "technical_specifications": {
                    "Acquisition Channels": "24-bit IEPE multi-channel dynamic telemetry",
                    "Frequency Range": "0.5 Hz to 5000 Hz",
                    "Surveying": "Sub-centimeter GNSS geomatics positioning",
                },
                "estimated_usage_duration": f"{req.project_duration or '5 Weeks'} (~35 Laboratory Hours)",
                "essential_equipment": [
                    {
                        "equipment_name": "Multi-Axis Piezoelectric Structural Vibration & Accelerometer Array",
                        "category": "IoT Sensor",
                        "required_quantity": 1,
                        "technical_specifications": {"Channels": "8 Simultaneous 24-bit IEPE", "Sensitivity": "100 mV/g"},
                        "estimated_usage_duration": "20 Hours",
                        "is_essential": True,
                        "justification": "Required for multi-point modal dampening measurements on experimental bridge piers.",
                    },
                    {
                        "equipment_name": "Libelium Waspmote Smart Cities & Air Quality Sensor Station",
                        "category": "IoT Sensor",
                        "required_quantity": 1,
                        "technical_specifications": {"Telemetry": "LoRaWAN 868MHz + NB-IoT", "Enclosure": "IP67 Weatherproof"},
                        "estimated_usage_duration": "12 Hours",
                        "is_essential": True,
                        "justification": "Environmental telemetry monitoring ambient vibration correlation with temperature gradients.",
                    },
                ],
                "optional_equipment": [
                    {
                        "equipment_name": "Topcon HiPer VR GNSS & Robotic Total Station Geomatics Kit",
                        "category": "Development Board",
                        "required_quantity": 1,
                        "technical_specifications": {"Accuracy": "1mm + 1ppm Distance Accuracy"},
                        "estimated_usage_duration": "5 Hours",
                        "is_essential": False,
                        "justification": "Optional for macro structural deflection surveying.",
                    }
                ],
                "fairness_and_safety_notes": "Wear hard hats in the heavy structures testing bay. Calibrate accelerometers with dynamic calibrator.",
            }

        # [D] General Embedded / IoT / Electronics default
        else:
            return {
                "project_category": "Embedded Systems & Electronics Prototyping",
                "domain_summary": "Hardware-software co-design incorporating embedded real-time microcontrollers, sensors, and signal verification.",
                "technical_specifications": {
                    "Microcontroller": "32-bit ARM Cortex architecture",
                    "Signal Analysis": "Multi-channel logic decoding for UART, SPI & I2C",
                },
                "estimated_usage_duration": f"{req.project_duration or '3 Weeks'} (~20 Laboratory Hours)",
                "essential_equipment": [
                    {
                        "equipment_name": "Arduino GIGA R1 WiFi Dual-Core Engineering Kit",
                        "category": "Arduino Kit",
                        "required_quantity": 1,
                        "technical_specifications": {"Microcontroller": "STM32H747XI Dual Core", "RAM": "1MB"},
                        "estimated_usage_duration": "14 Hours",
                        "is_essential": True,
                        "justification": "Primary embedded edge controller for multi-sensor acquisition and communication.",
                    },
                    {
                        "equipment_name": "Keysight Infiniium 1GHz 4-Channel Mixed Signal Oscilloscope",
                        "category": "Oscilloscope",
                        "required_quantity": 1,
                        "technical_specifications": {"Bandwidth": "1.0 GHz", "Channels": "4 Analog + 16 Digital MSO"},
                        "estimated_usage_duration": "6 Hours",
                        "is_essential": True,
                        "justification": "Required for verifying logic timings and power supply stability.",
                    },
                ],
                "optional_equipment": [
                    {
                        "equipment_name": "Raspberry Pi 5 8GB Edge AI Starter Kit",
                        "category": "Raspberry Pi Kit",
                        "required_quantity": 1,
                        "technical_specifications": {"RAM": "8GB LPDDR4X"},
                        "estimated_usage_duration": "4 Hours",
                        "is_essential": False,
                        "justification": "Optional edge web server gateway for remote telemetry logging.",
                    }
                ],
                "fairness_and_safety_notes": "Ensure proper grounding before probing high-frequency test points. Keep bench voltage supplies regulated.",
            }

    def _match_against_inventory(
        self, extracted_items: List[Dict[str, Any]]
    ) -> tuple[List[MatchedInventoryItem], List[Dict[str, Any]]]:
        """
        Matches extracted equipment names/categories against ACTUAL LabLink inventory.
        Never invents equipment.
        If an exact match is unavailable, recommends available alternatives!
        """
        actual_inventory = equipment_service.get_equipment_list()["items"]
        matched_items: List[MatchedInventoryItem] = []
        unmatched_items: List[Dict[str, Any]] = []

        for req_item in extracted_items:
            req_name = req_item.get("equipment_name", "").lower()
            req_cat = req_item.get("category", "").lower()

            # Search in actual inventory
            match = None
            for inv in actual_inventory:
                # Exact or substring match in name or model
                if (
                    inv["name"].lower() in req_name
                    or req_name in inv["name"].lower()
                    or inv["model"].lower() in req_name
                    or req_name in inv["model"].lower()
                ):
                    match = inv
                    break

            # If no name match, match by exact category
            if not match:
                for inv in actual_inventory:
                    if inv["category"].lower() == req_cat:
                        match = inv
                        break

            if match:
                available_units = match.get("available_units", 0)
                is_available = available_units > 0 and match.get("status") == "available"

                # Find alternatives if unavailable
                alternatives = []
                if not is_available:
                    alternatives = equipment_service.get_alternatives(match["id"])
                else:
                    # Also include 1 related unit as secondary option
                    alternatives = equipment_service.get_alternatives(match["id"])[:2]

                matched_items.append(
                    MatchedInventoryItem(
                        inventory_id=match["id"],
                        name=match["name"],
                        model=match["model"],
                        category=match["category"],
                        department=match["department"],
                        lab=match["lab"],
                        room=match["room"],
                        available_units=available_units,
                        total_units=match.get("total_units", 1),
                        status=match.get("status", "available"),
                        is_available=is_available,
                        is_exact_match=True,
                        match_confidence=0.98 if is_available else 0.85,
                        safety_guidelines=match.get("safety_guidelines"),
                        hourly_rate=match.get("hourly_rate", "Free"),
                        alternatives=alternatives,
                    )
                )
            else:
                unmatched_items.append(req_item)

        return matched_items, unmatched_items

ai_analyzer_service = AiProjectAnalyzerService()
