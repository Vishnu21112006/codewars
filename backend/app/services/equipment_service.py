import logging
from typing import List, Optional, Dict, Any
from app.core.config import settings

logger = logging.getLogger(__name__)

# Complete realistic sample inventory for CSE, ECE, Mechanical, Civil departments
SAMPLE_EQUIPMENT_DATA: List[Dict[str, Any]] = [
    # [1] Raspberry Pi Kits
    {
        "id": "e-rpi-01",
        "name": "Raspberry Pi 5 8GB Edge AI Starter Kit",
        "category": "Raspberry Pi Kit",
        "department": "CSE",
        "lab": "Edge AI & Accelerated Computing Lab",
        "room": "TT-502",
        "model": "RPI5-8G-AI",
        "description": "Broadcom BCM2712 quad-core Cortex-A76 with Coral M.2 PCIe Edge TPU accelerator for localized real-time inference.",
        "specifications": {
            "CPU": "Quad-Core ARM Cortex-A76 @ 2.4GHz",
            "RAM": "8GB LPDDR4X",
            "AI Accelerator": "Google Coral 4 TOPS Edge TPU",
            "Interfaces": "PCIe 2.0, Dual 4Kp60 HDMI, Gigabit Ethernet",
        },
        "total_units": 10,
        "available_units": 7,
        "status": "available",
        "requires_approval": False,
        "safety_guidelines": "Use regulated 27W USB-PD power supply. Ensure active cooling heatsink is connected during intensive ML runs.",
        "hourly_rate": "Free",
        "in_charge": "Prof. Elena Rostova (e.rostova@college.edu)",
        "image": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    },
    {
        "id": "e-rpi-02",
        "name": "Raspberry Pi 4 Model B Embedded Gateway Kit",
        "category": "Raspberry Pi Kit",
        "department": "ECE",
        "lab": "VLSI & Embedded Systems Research Lab",
        "room": "MV-304",
        "model": "RPI4B-4G",
        "description": "Versatile embedded controller kit with 40-pin GPIO breakout, CAN-bus transceiver HAT, and camera module for IoT experiments.",
        "specifications": {
            "CPU": "Quad-Core Cortex-A72 @ 1.5GHz",
            "RAM": "4GB LPDDR4",
            "GPIO": "40-pin header with SPI/I2C/UART",
            "Storage": "32GB High Endurance MicroSD",
        },
        "total_units": 12,
        "available_units": 0,  # Demonstrates unavailable status and triggers alternatives
        "status": "in_use",
        "requires_approval": False,
        "safety_guidelines": "Always power off board before inserting or removing ribbon cables on CSI/DSI headers.",
        "hourly_rate": "Free",
        "in_charge": "Dr. Aris Thorne (a.thorne@college.edu)",
        "image": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    },

    # [2] Arduino Kits
    {
        "id": "e-ard-01",
        "name": "Arduino GIGA R1 WiFi Dual-Core Engineering Kit",
        "category": "Arduino Kit",
        "department": "ECE",
        "lab": "VLSI & Embedded Systems Research Lab",
        "room": "MV-304",
        "model": "ARD-GIGA-R1",
        "description": "Dual-core STM32H747XI (Cortex-M7 @ 480MHz + Cortex-M4 @ 240MHz) with integrated Wi-Fi, Bluetooth BLE, and hardware crypto.",
        "specifications": {
            "Microcontroller": "STM32H747XI Dual Core",
            "Memory": "2MB Flash, 1MB RAM",
            "GPIO Pins": "76 Digital, 12 Analog, 12 PWM",
            "Wireless": "Murata 1DX Dual Band WiFi + BT",
        },
        "total_units": 8,
        "available_units": 6,
        "status": "available",
        "requires_approval": False,
        "safety_guidelines": "Operate at 3.3V logic level. 5V input on digital pins will permanently damage the microcontroller.",
        "hourly_rate": "Free",
        "in_charge": "Dr. Aris Thorne (a.thorne@college.edu)",
        "image": "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=600&q=80",
    },
    {
        "id": "e-ard-02",
        "name": "Arduino Portenta H7 Vision Shield Prototyping Kit",
        "category": "Arduino Kit",
        "department": "MECH",
        "lab": "Dynamics & Mechatronics Automation Center",
        "room": "VSC-204",
        "model": "ARD-PORTENTA-H7",
        "description": "Industrial-grade system-on-module featuring Himax ultra-low power vision camera and dual directional digital microphones for gesture triggers.",
        "specifications": {
            "Vision Sensor": "Himax HM-0360 640x480 Monochrome",
            "Microphones": "2x MP34DT05 Omnidirectional",
            "Connectivity": "Ethernet PHY + High-density connectors",
        },
        "total_units": 6,
        "available_units": 4,
        "status": "available",
        "requires_approval": False,
        "safety_guidelines": "Keep optical lens free of dust. Use anti-static ESD foam for bench mounting.",
        "hourly_rate": "Free",
        "in_charge": "Dr. Marcus Vance (m.vance@college.edu)",
        "image": "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=600&q=80",
    },

    # [3] GPU Workstations
    {
        "id": "e-gpu-01",
        "name": "NVIDIA DGX Station A100 (4x 80GB SXM4)",
        "category": "GPU Workstation",
        "department": "CSE",
        "lab": "Edge AI & Accelerated Computing Lab",
        "room": "TT-502",
        "model": "DGX-A100-320G",
        "description": "Enterprise AI supercomputing system with 4x NVIDIA A100 GPUs interconnected via 200 GB/s NVLink. Built for multi-node LLMs and physics simulation.",
        "specifications": {
            "Compute GPUs": "4x NVIDIA A100 80GB SXM4",
            "Total VRAM": "320GB HBM2e (1.6 TB/s)",
            "Host CPU": "AMD EPYC 7742 64-Core",
            "System RAM": "512GB DDR4 ECC",
        },
        "total_units": 2,
        "available_units": 1,
        "status": "available",
        "requires_approval": True,
        "safety_guidelines": "Jobs must be submitted via Slurm queue. Allocate VRAM quotas accurately; orphan processes will be terminated.",
        "hourly_rate": "Free (Grant Sponsored)",
        "in_charge": "Prof. Elena Rostova (e.rostova@college.edu)",
        "image": "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80",
    },
    {
        "id": "e-gpu-02",
        "name": "Dual NVIDIA RTX 6000 Ada Generation Deep Learning Workstation",
        "category": "GPU Workstation",
        "department": "CSE",
        "lab": "Edge AI & Accelerated Computing Lab",
        "room": "TT-502",
        "model": "RTX-6000-ADA",
        "description": "High-end vision and generative AI station with 96GB combined ECC GDDR6 VRAM and 4th Generation Tensor Cores.",
        "specifications": {
            "GPUs": "2x NVIDIA RTX 6000 Ada 48GB",
            "CUDA Cores": "36,352 Cores",
            "VRAM": "96GB GDDR6 with ECC",
            "Host CPU": "Intel Xeon w9-3475X 36-Core",
        },
        "total_units": 3,
        "available_units": 0,  # Demonstrates unavailable state and triggers DGX alternative
        "status": "in_use",
        "requires_approval": True,
        "safety_guidelines": "Workstation reserved for Master/PhD theses runs. Log GPU temperatures via nvidia-smi telemetry.",
        "hourly_rate": "Free",
        "in_charge": "Prof. Elena Rostova (e.rostova@college.edu)",
        "image": "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80",
    },

    # [4] IoT Sensors & Environmental Telemetry
    {
        "id": "e-iot-01",
        "name": "Libelium Waspmote Smart Cities & Air Quality Sensor Station",
        "category": "IoT Sensor",
        "department": "CIVIL",
        "lab": "Structural Health Monitoring & IoT Sensor Lab",
        "room": "ACC-105",
        "model": "WASP-SC-AIR",
        "description": "Multiparameter smart infrastructure node measuring PM1.0, PM2.5, PM10, CO2, NO2, temperature, and ambient acoustic dB sound levels.",
        "specifications": {
            "Gas Sensors": "CO, NO2, O3, SO2 Electrochemical",
            "Particle Sensor": "Optical PM1/PM2.5/PM10 Laser",
            "Telemetry": "LoRaWAN 868MHz + NB-IoT",
            "Enclosure": "IP67 Weatherproof Solar Powered",
        },
        "total_units": 6,
        "available_units": 5,
        "status": "available",
        "requires_approval": False,
        "safety_guidelines": "Do not touch electrochemical sensing membranes. Calibrate baseline with reference nitrogen gas when required.",
        "hourly_rate": "Free",
        "in_charge": "Dr. Rajeshwari Nair (r.nair@college.edu)",
        "image": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    },
    {
        "id": "e-iot-02",
        "name": "Multi-Axis Piezoelectric Structural Vibration & Accelerometer Array",
        "category": "IoT Sensor",
        "department": "CIVIL",
        "lab": "Structural Health Monitoring & IoT Sensor Lab",
        "room": "ACC-105",
        "model": "PCB-PIEZO-356",
        "description": "Triaxial high-sensitivity shear accelerometers with 24-bit dynamic signal acquisition module for bridge and building resonance modal analysis.",
        "specifications": {
            "Sensitivity": "100 mV/g",
            "Frequency Range": "0.5 Hz to 5000 Hz",
            "Channels": "8 Simultaneous 24-bit IEPE",
            "Sampling Rate": "102.4 kS/s per channel",
        },
        "total_units": 5,
        "available_units": 3,
        "status": "available",
        "requires_approval": True,
        "safety_guidelines": "Secure accelerometer studs with approved cyanoacrylate or petro-wax. Never yank coaxial microdot cables.",
        "hourly_rate": "Free",
        "in_charge": "Dr. Rajeshwari Nair (r.nair@college.edu)",
        "image": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    },

    # [5] Robotics Kits
    {
        "id": "e-rob-01",
        "name": "Universal Robots UR5e 6-Axis Collaborative Robot Arm",
        "category": "Robotics Kit",
        "department": "MECH",
        "lab": "Autonomous Robotics & 3D Fabrication Studio",
        "room": "VSC-102",
        "model": "UR5e-CB3",
        "description": "Precision 6-degree-of-freedom robotic manipulator with built-in force/torque sensor, 5kg payload, 850mm reach, and full ROS 2 Humble integration.",
        "specifications": {
            "Payload": "5.0 kg",
            "Reach": "850 mm",
            "Repeatability": "±0.03 mm",
            "F/T Sensor": "Integrated 6-axis F/T @ Tool Flange",
            "Bus": "ROS2 / Modbus TCP / Ethernet/IP",
        },
        "total_units": 2,
        "available_units": 2,
        "status": "available",
        "requires_approval": True,
        "safety_guidelines": "Emergency stop pendant must be held by the designated safety observer whenever robot is executing automated trajectories.",
        "hourly_rate": "Free",
        "in_charge": "Dr. Marcus Vance (m.vance@college.edu)",
        "image": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80",
    },
    {
        "id": "e-rob-02",
        "name": "TurtleBot 4 ROS 2 Mobile Robot Platform with 2D LiDAR & OAK-D",
        "category": "Robotics Kit",
        "department": "CSE",
        "lab": "Robotics & Vision Studio",
        "room": "TT-405",
        "model": "TB4-STANDARD",
        "description": "Next-generation mobile robot built on iRobot Create 3 base with Raspberry Pi 4 compute, RPLIDAR A1 2D laser scanner, and OAK-D Spatial AI depth camera.",
        "specifications": {
            "Base": "iRobot Create 3 Base",
            "LiDAR": "RPLIDAR A1 360-degree 12m range",
            "Spatial AI": "Luxonis OAK-D RGB-D 4K",
            "Sensors": "Cliff, Bump, Optical Flow, IMU",
        },
        "total_units": 4,
        "available_units": 3,
        "status": "available",
        "requires_approval": False,
        "safety_guidelines": "Ensure floor test arena is cleared of wires and liquid spills before initiating autonomous navigation or SLAM mapping.",
        "hourly_rate": "Free",
        "in_charge": "Prof. Elena Rostova (e.rostova@college.edu)",
        "image": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80",
    },

    # [6] 3D Printers
    {
        "id": "e-3dp-01",
        "name": "Formlabs Form 3+ SLA Industrial 3D Printer",
        "category": "3D Printer",
        "department": "MECH",
        "lab": "Autonomous Robotics & 3D Fabrication Studio",
        "room": "VSC-102",
        "model": "FORM3P-SLA",
        "description": "Low Force Stereolithography (LFS) 3D printer for millimeter-precise engineering housings, microfluidic channels, and high-modulus brackets.",
        "specifications": {
            "Technology": "Low Force Stereolithography",
            "XY Resolution": "25 Micron",
            "Build Volume": "14.5 x 14.5 x 18.5 cm",
            "Laser Power": "250mW 405nm Precision Laser",
        },
        "total_units": 3,
        "available_units": 2,
        "status": "available",
        "requires_approval": True,
        "safety_guidelines": "Chemical-resistant nitrile gloves and UV eye shielding mandatory during resin handling and isopropyl alcohol wash stages.",
        "hourly_rate": "Resin Cost (~$0.15/mL)",
        "in_charge": "Dr. Marcus Vance (m.vance@college.edu)",
        "image": "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80",
    },
    {
        "id": "e-3dp-02",
        "name": "Bambu Lab X1-Carbon Dual Extruder High-Speed 3D Printer",
        "category": "3D Printer",
        "department": "MECH",
        "lab": "Autonomous Robotics & 3D Fabrication Studio",
        "room": "VSC-102",
        "model": "BAMBU-X1C",
        "description": "Enclosed high-speed core-XY additive printer capable of carbon-fiber reinforced filaments (PA-CF, PET-CF) with dual automated LiDAR first-layer inspection.",
        "specifications": {
            "Build Volume": "256 x 256 x 256 mm",
            "Max Speed": "500 mm/s",
            "Hotend Temp": "Up to 300°C All-Metal",
            "Inspection": "Micro-LiDAR dual automated bed levelling",
        },
        "total_units": 4,
        "available_units": 4,
        "status": "available",
        "requires_approval": False,
        "safety_guidelines": "Ensure chamber door remains closed while heating bed. Do not touch active nozzle heated to 300°C.",
        "hourly_rate": "Filament Cost",
        "in_charge": "Dr. Marcus Vance (m.vance@college.edu)",
        "image": "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80",
    },

    # [7] Oscilloscopes
    {
        "id": "e-osc-01",
        "name": "Keysight Infiniium 1GHz 4-Channel Mixed Signal Oscilloscope",
        "category": "Oscilloscope",
        "department": "ECE",
        "lab": "Electronics Instrumentation Facility",
        "room": "MV-201",
        "model": "DSOX4024A",
        "description": "MegaZoom IV mixed signal storage oscilloscope with 5 GSa/s real-time sampling rate, 1 GHz bandwidth, and protocol decoding for CAN, I2C, SPI, UART, LIN.",
        "specifications": {
            "Bandwidth": "1.0 GHz Analog",
            "Sample Rate": "5.0 GSa/s Interleaved",
            "Channels": "4 Analog + 16 Digital MSO",
            "Memory Depth": "4 Mpts standard",
        },
        "total_units": 6,
        "available_units": 4,
        "status": "available",
        "requires_approval": False,
        "safety_guidelines": "Ensure proper probe ground lead connection. Check 10X attenuation switch on probes before measuring high-voltage rails.",
        "hourly_rate": "Free",
        "in_charge": "Dr. Aris Thorne (a.thorne@college.edu)",
        "image": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    },
    {
        "id": "e-osc-02",
        "name": "Tektronix 4 Series B MSO 1.5GHz 6-Channel Oscilloscope",
        "category": "Oscilloscope",
        "department": "ECE",
        "lab": "Electronics Instrumentation Facility",
        "room": "MV-201",
        "model": "MSO46B-1500",
        "description": "High-definition 12-bit ADC oscilloscope with 6 FlexChannel inputs, spectrum analysis mode, and jitter measurement package for gigabit transceivers.",
        "specifications": {
            "Bandwidth": "1.5 GHz",
            "ADC Resolution": "12-bit (up to 16-bit High Res)",
            "Channels": "6 FlexChannel Inputs",
            "Record Length": "62.5 Mpoints",
        },
        "total_units": 3,
        "available_units": 1,
        "status": "available",
        "requires_approval": True,
        "safety_guidelines": "Use ESD grounding wrist strap. Calibrate probe offset using internal compensation signal before critical bus testing.",
        "hourly_rate": "Free",
        "in_charge": "Dr. Aris Thorne (a.thorne@college.edu)",
        "image": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    },

    # [8] Development Boards
    {
        "id": "e-dev-01",
        "name": "Xilinx Zynq UltraScale+ MPSoC ZCU102 Evaluation Board",
        "category": "Development Board",
        "department": "ECE",
        "lab": "VLSI & Embedded Systems Research Lab",
        "room": "MV-304",
        "model": "ZCU102-ED",
        "description": "Premier FPGA development platform featuring Quad-core ARM Cortex-A53, Dual-core Cortex-R5F, and 600K UltraScale+ logic cells with FMC expansion slots.",
        "specifications": {
            "FPGA Logic": "600K Logic Cells (552K LUTs)",
            "CPU Cores": "Quad ARM Cortex-A53 + Dual Cortex-R5",
            "Memory": "4GB DDR4 64-bit + 512MB ECC",
            "Transceivers": "16x 16.3Gbps GTH",
        },
        "total_units": 4,
        "available_units": 3,
        "status": "available",
        "requires_approval": True,
        "safety_guidelines": "Handle solely inside ESD-safe matting. Power down 12V ATX supply before mounting high-speed FMC daughter cards.",
        "hourly_rate": "Free",
        "in_charge": "Dr. Aris Thorne (a.thorne@college.edu)",
        "image": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    },
    {
        "id": "e-dev-02",
        "name": "STM32H7 Nucleo-144 ARM Cortex-M7 Real-Time DSP Evaluation Board",
        "category": "Development Board",
        "department": "ECE",
        "lab": "VLSI & Embedded Systems Research Lab",
        "room": "MV-304",
        "model": "NUCLEO-H743ZI2",
        "description": "High-performance 32-bit MCU evaluation board operating at 480MHz with double-precision FPU, DSP instructions, Ethernet, and USB OTG for embedded control.",
        "specifications": {
            "Core": "ARM Cortex-M7 @ 480 MHz",
            "Flash": "2MB Dual Bank Flash",
            "SRAM": "1MB RAM",
            "Connectivity": "Ethernet RJ45, USB OTG, Arduino ST-Zio",
        },
        "total_units": 10,
        "available_units": 8,
        "status": "available",
        "requires_approval": False,
        "safety_guidelines": "Board is bus-powered via Micro-USB. Jumper ST-LINK power select accurately before supplying external 5V.",
        "hourly_rate": "Free",
        "in_charge": "Dr. Aris Thorne (a.thorne@college.edu)",
        "image": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    },

    # [9] Civil Engineering Specialized Equipment
    {
        "id": "e-civ-01",
        "name": "Topcon HiPer VR GNSS & Robotic Total Station Geomatics Kit",
        "category": "Development Board",
        "department": "CIVIL",
        "lab": "Geomatics & Laser Surveying Facility",
        "room": "ACC-202",
        "model": "TOPCON-HIPER-VR",
        "description": "Millimeter-accurate robotic laser geomatics surveying system with universal tracking satellite channels and digital terrain modeling.",
        "specifications": {
            "Accuracy": "1mm + 1ppm Distance Accuracy",
            "Channels": "226 Universal Satellite Tracking",
            "Operating Range": "Up to 5000m Prism / 1000m Non-Prism",
            "Interfaces": "LongLink Bluetooth + Cellular",
        },
        "total_units": 3,
        "available_units": 2,
        "status": "available",
        "requires_approval": True,
        "safety_guidelines": "Level tribrach precisely on heavy-duty aluminum tripod. Transport only inside shockproof hard flight cases.",
        "hourly_rate": "Free",
        "in_charge": "Dr. Rajeshwari Nair (r.nair@college.edu)",
        "image": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    },
]

class EquipmentService:
    def __init__(self):
        self._equipment: List[Dict[str, Any]] = list(SAMPLE_EQUIPMENT_DATA)
        self._equipment_map: Dict[str, Dict[str, Any]] = {eq["id"]: eq for eq in self._equipment}
        self._supabase_client = None
        self._init_supabase()

    def _init_supabase(self):
        """Attempts to initialize Supabase client if valid credentials are present."""
        if (
            settings.SUPABASE_URL
            and not settings.SUPABASE_URL.startswith("https://placeholder")
            and settings.SUPABASE_ANON_KEY
            and not settings.SUPABASE_ANON_KEY.startswith("placeholder")
        ):
            try:
                from supabase import create_client
                self._supabase_client = create_client(
                    settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY
                )
                logger.info("Supabase live client initialized successfully.")
            except Exception as e:
                logger.warning(f"Failed to initialize Supabase client: {e}. Falling back to demo data.")
                self._supabase_client = None

    def get_equipment_list(
        self,
        search: Optional[str] = None,
        department: Optional[str] = None,
        category: Optional[str] = None,
        status: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Retrieves equipment with filtering, utilizing Supabase if available or the clean local demo mesh.
        """
        # Try Supabase first if available
        if self._supabase_client:
            try:
                query = self._supabase_client.table("equipment").select("*, laboratories(*, departments(*))")
                if department and department.upper() != "ALL":
                    query = query.eq("laboratories.departments.code", department.upper())
                if category and category.upper() != "ALL":
                    query = query.eq("category", category)
                if status:
                    query = query.eq("status", status)
                res = query.execute()
                if res.data:
                    return {
                        "total": len(res.data),
                        "data_source": "supabase_live",
                        "items": res.data,
                    }
            except Exception as e:
                logger.warning(f"Supabase query failed ({e}). Defaulting to clean local demo store.")

        # Local fallback store
        items = self._equipment

        if department and department.upper() != "ALL":
            dept_key = department.upper()
            items = [item for item in items if item["department"].upper() == dept_key]

        if category and category.upper() != "ALL":
            items = [item for item in items if item["category"].lower() == category.lower()]

        if status:
            items = [item for item in items if item["status"].lower() == status.lower()]

        if search:
            query = search.strip().lower()
            items = [
                item
                for item in items
                if query in item["name"].lower()
                or query in item["model"].lower()
                or query in item["category"].lower()
                or query in item["department"].lower()
                or query in item["lab"].lower()
                or query in item["description"].lower()
            ]

        return {
            "total": len(items),
            "data_source": "local_demo_mesh",
            "items": items,
        }

    def get_equipment_by_id(self, equipment_id: str) -> Optional[Dict[str, Any]]:
        """Finds equipment by ID with O(1) indexed lookup and computes smart alternative recommendations."""
        item = self._equipment_map.get(equipment_id)
        if not item:
            item = next((eq for eq in self._equipment if eq["id"] == equipment_id), None)
        if not item:
            return None

        # Deep copy item to append alternatives
        res = dict(item)

        # Compute alternatives if item is unavailable or has 0 units
        alternatives = self.get_alternatives(equipment_id)
        res["alternatives"] = alternatives

        if item.get("available_units", 0) == 0 or item.get("status") != "available":
            res["alternative_reason"] = (
                f"Item '{item['name']}' is currently in-use or under calibration. "
                f"We found {len(alternatives)} comparable alternative workstation(s) ready for reservation."
            )
        else:
            res["alternative_reason"] = "Showing related workstations in this discipline."

        return res

    def get_alternatives(self, equipment_id: str) -> List[Dict[str, Any]]:
        """
        Smart alternative equipment recommender:
        1. Checks for equipment in the SAME category with available_units > 0.
        2. Checks for equipment in the SAME department with available_units > 0.
        """
        target = next((eq for eq in self._equipment if eq["id"] == equipment_id), None)
        if not target:
            return []

        # 1. Same category alternatives that are available
        same_cat = [
            eq
            for eq in self._equipment
            if eq["id"] != equipment_id
            and eq["category"].lower() == target["category"].lower()
            and eq.get("available_units", 0) > 0
            and eq.get("status") == "available"
        ]

        # 2. Same department alternatives that are available
        same_dept = [
            eq
            for eq in self._equipment
            if eq["id"] != equipment_id
            and eq["department"].upper() == target["department"].upper()
            and eq not in same_cat
            and eq.get("available_units", 0) > 0
            and eq.get("status") == "available"
        ]

        alternatives = (same_cat + same_dept)[:4]
        return alternatives

    def get_departments(self) -> List[Dict[str, str]]:
        return [
            {"code": "ALL", "name": "All Departments"},
            {"code": "CSE", "name": "Computer Science & Engineering"},
            {"code": "ECE", "name": "Electronics & Communication Engineering"},
            {"code": "MECH", "name": "Mechanical Engineering & Robotics"},
            {"code": "CIVIL", "name": "Civil & Infrastructure Engineering"},
        ]

    def get_categories(self) -> List[str]:
        return [
            "ALL",
            "Raspberry Pi Kit",
            "Arduino Kit",
            "GPU Workstation",
            "IoT Sensor",
            "Robotics Kit",
            "3D Printer",
            "Oscilloscope",
            "Development Board",
        ]

    def add_equipment(self, new_eq: Dict[str, Any]) -> Dict[str, Any]:
        item = dict(new_eq)
        if "id" not in item:
            item["id"] = f"eq-{len(self._equipment) + 1:03d}"
        self._equipment.insert(0, item)
        return item

equipment_service = EquipmentService()
