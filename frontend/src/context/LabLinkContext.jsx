import React, { createContext, useContext, useState, useEffect } from 'react';
import { bookingApi } from '../api/client';

const LabLinkContext = createContext();

export const DEMO_USERS = {
  student: {
    id: 'u-student-01',
    name: 'Aarav Patel',
    email: 'aarav.patel@college.edu',
    role: 'student',
    department: 'ECE',
    rollNumber: 'ECE-2023-042',
    academicYear: '4th Year (Capstone Lead)',
    avatar: 'AP',
    activeProject: 'Autonomous Quadcopter Flight Controller',
  },
  faculty: {
    id: 'u-faculty-01',
    name: 'Dr. Aris Thorne',
    email: 'a.thorne@college.edu',
    role: 'faculty',
    department: 'ECE',
    title: 'Professor & Lab In-Charge (VLSI)',
    avatar: 'AT',
  },
  admin: {
    id: 'u-admin-01',
    name: 'Prof. Elena Rostova',
    email: 'e.rostova@college.edu',
    role: 'admin',
    department: 'CSE',
    title: 'Director of Central Research Facilities',
    avatar: 'ER',
  },
};

export const INITIAL_EQUIPMENT = [
  // [1] Raspberry Pi Kits
  {
    id: 'e-rpi-01',
    name: 'Raspberry Pi 5 8GB Edge AI Starter Kit',
    category: 'Raspberry Pi Kit',
    department: 'CSE',
    lab: 'Edge AI & Accelerated Computing Lab',
    room: 'TT-502',
    model: 'RPI5-8G-AI',
    description: 'Broadcom BCM2712 quad-core Cortex-A76 with Coral M.2 PCIe Edge TPU accelerator for localized real-time inference.',
    specifications: {
      'CPU': 'Quad-Core ARM Cortex-A76 @ 2.4GHz',
      'RAM': '8GB LPDDR4X',
      'AI Accelerator': 'Google Coral 4 TOPS Edge TPU',
      'Interfaces': 'PCIe 2.0, Dual 4Kp60 HDMI, Gigabit Ethernet',
    },
    totalUnits: 10,
    availableUnits: 7,
    status: 'available',
    requiresApproval: false,
    safetyGuidelines: 'Use regulated 27W USB-PD power supply. Ensure active cooling heatsink is connected during intensive ML runs.',
    hourlyRate: 'Free',
    inCharge: 'Prof. Elena Rostova (e.rostova@college.edu)',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'e-rpi-02',
    name: 'Raspberry Pi 4 Model B Embedded Gateway Kit',
    category: 'Raspberry Pi Kit',
    department: 'ECE',
    lab: 'VLSI & Embedded Systems Research Lab',
    room: 'MV-304',
    model: 'RPI4B-4G',
    description: 'Versatile embedded controller kit with 40-pin GPIO breakout, CAN-bus transceiver HAT, and camera module for IoT experiments.',
    specifications: {
      'CPU': 'Quad-Core Cortex-A72 @ 1.5GHz',
      'RAM': '4GB LPDDR4',
      'GPIO': '40-pin header with SPI/I2C/UART',
      'Storage': '32GB High Endurance MicroSD',
    },
    totalUnits: 12,
    availableUnits: 0, // Demonstrates alternative suggestion feature
    status: 'in_use',
    requiresApproval: false,
    safetyGuidelines: 'Always power off board before inserting or removing ribbon cables on CSI/DSI headers.',
    hourlyRate: 'Free',
    inCharge: 'Dr. Aris Thorne (a.thorne@college.edu)',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
  },

  // [2] Arduino Kits
  {
    id: 'e-ard-01',
    name: 'Arduino GIGA R1 WiFi Dual-Core Engineering Kit',
    category: 'Arduino Kit',
    department: 'ECE',
    lab: 'VLSI & Embedded Systems Research Lab',
    room: 'MV-304',
    model: 'ARD-GIGA-R1',
    description: 'Dual-core STM32H747XI (Cortex-M7 @ 480MHz + Cortex-M4 @ 240MHz) with integrated Wi-Fi, Bluetooth BLE, and hardware crypto.',
    specifications: {
      'Microcontroller': 'STM32H747XI Dual Core',
      'Memory': '2MB Flash, 1MB RAM',
      'GPIO Pins': '76 Digital, 12 Analog, 12 PWM',
      'Wireless': 'Murata 1DX Dual Band WiFi + BT',
    },
    totalUnits: 8,
    availableUnits: 6,
    status: 'available',
    requiresApproval: false,
    safetyGuidelines: 'Operate at 3.3V logic level. 5V input on digital pins will permanently damage the microcontroller.',
    hourlyRate: 'Free',
    inCharge: 'Dr. Aris Thorne (a.thorne@college.edu)',
    image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'e-ard-02',
    name: 'Arduino Portenta H7 Vision Shield Prototyping Kit',
    category: 'Arduino Kit',
    department: 'MECH',
    lab: 'Dynamics & Mechatronics Automation Center',
    room: 'VSC-204',
    model: 'ARD-PORTENTA-H7',
    description: 'Industrial-grade system-on-module featuring Himax ultra-low power vision camera and dual directional digital microphones for gesture triggers.',
    specifications: {
      'Vision Sensor': 'Himax HM-0360 640x480 Monochrome',
      'Microphones': '2x MP34DT05 Omnidirectional',
      'Connectivity': 'Ethernet PHY + High-density connectors',
    },
    totalUnits: 6,
    availableUnits: 4,
    status: 'available',
    requiresApproval: false,
    safetyGuidelines: 'Keep optical lens free of dust. Use anti-static ESD foam for bench mounting.',
    hourlyRate: 'Free',
    inCharge: 'Dr. Marcus Vance (m.vance@college.edu)',
    image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=600&q=80',
  },

  // [3] GPU Workstations
  {
    id: 'e-gpu-01',
    name: 'NVIDIA DGX Station A100 (4x 80GB SXM4)',
    category: 'GPU Workstation',
    department: 'CSE',
    lab: 'Edge AI & Accelerated Computing Lab',
    room: 'TT-502',
    model: 'DGX-A100-320G',
    description: 'Enterprise AI supercomputing system with 4x NVIDIA A100 GPUs interconnected via 200 GB/s NVLink. Built for multi-node LLMs and physics simulation.',
    specifications: {
      'Compute GPUs': '4x NVIDIA A100 80GB SXM4',
      'Total VRAM': '320GB HBM2e (1.6 TB/s)',
      'Host CPU': 'AMD EPYC 7742 64-Core',
      'System RAM': '512GB DDR4 ECC',
    },
    totalUnits: 2,
    availableUnits: 1,
    status: 'available',
    requiresApproval: true,
    safetyGuidelines: 'Jobs must be submitted via Slurm queue. Allocate VRAM quotas accurately; orphan processes will be terminated.',
    hourlyRate: 'Free (Grant Sponsored)',
    inCharge: 'Prof. Elena Rostova (e.rostova@college.edu)',
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'e-gpu-02',
    name: 'Dual NVIDIA RTX 6000 Ada Generation Deep Learning Workstation',
    category: 'GPU Workstation',
    department: 'CSE',
    lab: 'Edge AI & Accelerated Computing Lab',
    room: 'TT-502',
    model: 'RTX-6000-ADA',
    description: 'High-end vision and generative AI station with 96GB combined ECC GDDR6 VRAM and 4th Generation Tensor Cores.',
    specifications: {
      'GPUs': '2x NVIDIA RTX 6000 Ada 48GB',
      'CUDA Cores': '36,352 Cores',
      'VRAM': '96GB GDDR6 with ECC',
      'Host CPU': 'Intel Xeon w9-3475X 36-Core',
    },
    totalUnits: 3,
    availableUnits: 0, // Demonstrates unavailable state and triggers DGX alternative
    status: 'in_use',
    requiresApproval: true,
    safetyGuidelines: 'Workstation reserved for Master/PhD theses runs. Log GPU temperatures via nvidia-smi telemetry.',
    hourlyRate: 'Free',
    inCharge: 'Prof. Elena Rostova (e.rostova@college.edu)',
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80',
  },

  // [4] IoT Sensors & Environmental Telemetry
  {
    id: 'e-iot-01',
    name: 'Libelium Waspmote Smart Cities & Air Quality Sensor Station',
    category: 'IoT Sensor',
    department: 'CIVIL',
    lab: 'Structural Health Monitoring & IoT Sensor Lab',
    room: 'ACC-105',
    model: 'WASP-SC-AIR',
    description: 'Multiparameter smart infrastructure node measuring PM1.0, PM2.5, PM10, CO2, NO2, temperature, and ambient acoustic dB sound levels.',
    specifications: {
      'Gas Sensors': 'CO, NO2, O3, SO2 Electrochemical',
      'Particle Sensor': 'Optical PM1/PM2.5/PM10 Laser',
      'Telemetry': 'LoRaWAN 868MHz + NB-IoT',
      'Enclosure': 'IP67 Weatherproof Solar Powered',
    },
    totalUnits: 6,
    availableUnits: 5,
    status: 'available',
    requiresApproval: false,
    safetyGuidelines: 'Do not touch electrochemical sensing membranes. Calibrate baseline with reference nitrogen gas when required.',
    hourlyRate: 'Free',
    inCharge: 'Dr. Rajeshwari Nair (r.nair@college.edu)',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'e-iot-02',
    name: 'Multi-Axis Piezoelectric Structural Vibration & Accelerometer Array',
    category: 'IoT Sensor',
    department: 'CIVIL',
    lab: 'Structural Health Monitoring & IoT Sensor Lab',
    room: 'ACC-105',
    model: 'PCB-PIEZO-356',
    description: 'Triaxial high-sensitivity shear accelerometers with 24-bit dynamic signal acquisition module for bridge and building resonance modal analysis.',
    specifications: {
      'Sensitivity': '100 mV/g',
      'Frequency Range': '0.5 Hz to 5000 Hz',
      'Channels': '8 Simultaneous 24-bit IEPE',
      'Sampling Rate': '102.4 kS/s per channel',
    },
    totalUnits: 5,
    availableUnits: 3,
    status: 'available',
    requiresApproval: true,
    safetyGuidelines: 'Secure accelerometer studs with approved cyanoacrylate or petro-wax. Never yank coaxial microdot cables.',
    hourlyRate: 'Free',
    inCharge: 'Dr. Rajeshwari Nair (r.nair@college.edu)',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
  },

  // [5] Robotics Kits
  {
    id: 'e-rob-01',
    name: 'Universal Robots UR5e 6-Axis Collaborative Robot Arm',
    category: 'Robotics Kit',
    department: 'MECH',
    lab: 'Autonomous Robotics & 3D Fabrication Studio',
    room: 'VSC-102',
    model: 'UR5e-CB3',
    description: 'Precision 6-degree-of-freedom robotic manipulator with built-in force/torque sensor, 5kg payload, 850mm reach, and full ROS 2 Humble integration.',
    specifications: {
      'Payload': '5.0 kg',
      'Reach': '850 mm',
      'Repeatability': '±0.03 mm',
      'F/T Sensor': 'Integrated 6-axis F/T @ Tool Flange',
      'Bus': 'ROS2 / Modbus TCP / Ethernet/IP',
    },
    totalUnits: 2,
    availableUnits: 2,
    status: 'available',
    requiresApproval: true,
    safetyGuidelines: 'Emergency stop pendant must be held by the designated safety observer whenever robot is executing automated trajectories.',
    hourlyRate: 'Free',
    inCharge: 'Dr. Marcus Vance (m.vance@college.edu)',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'e-rob-02',
    name: 'TurtleBot 4 ROS 2 Mobile Robot Platform with 2D LiDAR & OAK-D',
    category: 'Robotics Kit',
    department: 'CSE',
    lab: 'Robotics & Vision Studio',
    room: 'TT-405',
    model: 'TB4-STANDARD',
    description: 'Next-generation mobile robot built on iRobot Create 3 base with Raspberry Pi 4 compute, RPLIDAR A1 2D laser scanner, and OAK-D Spatial AI depth camera.',
    specifications: {
      'Base': 'iRobot Create 3 Base',
      'LiDAR': 'RPLIDAR A1 360-degree 12m range',
      'Spatial AI': 'Luxonis OAK-D RGB-D 4K',
      'Sensors': 'Cliff, Bump, Optical Flow, IMU',
    },
    totalUnits: 4,
    availableUnits: 3,
    status: 'available',
    requiresApproval: false,
    safetyGuidelines: 'Ensure floor test arena is cleared of wires and liquid spills before initiating autonomous navigation or SLAM mapping.',
    hourlyRate: 'Free',
    inCharge: 'Prof. Elena Rostova (e.rostova@college.edu)',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80',
  },

  // [6] 3D Printers
  {
    id: 'e-3dp-01',
    name: 'Formlabs Form 3+ SLA Industrial 3D Printer',
    category: '3D Printer',
    department: 'MECH',
    lab: 'Autonomous Robotics & 3D Fabrication Studio',
    room: 'VSC-102',
    model: 'FORM3P-SLA',
    description: 'Low Force Stereolithography (LFS) 3D printer for millimeter-precise engineering housings, microfluidic channels, and high-modulus brackets.',
    specifications: {
      'Technology': 'Low Force Stereolithography',
      'XY Resolution': '25 Micron',
      'Build Volume': '14.5 x 14.5 x 18.5 cm',
      'Laser Power': '250mW 405nm Precision Laser',
    },
    totalUnits: 3,
    availableUnits: 2,
    status: 'available',
    requiresApproval: true,
    safetyGuidelines: 'Chemical-resistant nitrile gloves and UV eye shielding mandatory during resin handling and isopropyl alcohol wash stages.',
    hourlyRate: 'Resin Cost (~$0.15/mL)',
    inCharge: 'Dr. Marcus Vance (m.vance@college.edu)',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'e-3dp-02',
    name: 'Bambu Lab X1-Carbon Dual Extruder High-Speed 3D Printer',
    category: '3D Printer',
    department: 'MECH',
    lab: 'Autonomous Robotics & 3D Fabrication Studio',
    room: 'VSC-102',
    model: 'BAMBU-X1C',
    description: 'Enclosed high-speed core-XY additive printer capable of carbon-fiber reinforced filaments (PA-CF, PET-CF) with dual automated LiDAR first-layer inspection.',
    specifications: {
      'Build Volume': '256 x 256 x 256 mm',
      'Max Speed': '500 mm/s',
      'Hotend Temp': 'Up to 300°C All-Metal',
      'Inspection': 'Micro-LiDAR dual automated bed levelling',
    },
    totalUnits: 4,
    availableUnits: 4,
    status: 'available',
    requiresApproval: false,
    safetyGuidelines: 'Ensure chamber door remains closed while heating bed. Do not touch active nozzle heated to 300°C.',
    hourlyRate: 'Filament Cost',
    inCharge: 'Dr. Marcus Vance (m.vance@college.edu)',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
  },

  // [7] Oscilloscopes
  {
    id: 'e-osc-01',
    name: 'Keysight Infiniium 1GHz 4-Channel Mixed Signal Oscilloscope',
    category: 'Oscilloscope',
    department: 'ECE',
    lab: 'Electronics Instrumentation Facility',
    room: 'MV-201',
    model: 'DSOX4024A',
    description: 'MegaZoom IV mixed signal storage oscilloscope with 5 GSa/s real-time sampling rate, 1 GHz bandwidth, and protocol decoding for CAN, I2C, SPI, UART, LIN.',
    specifications: {
      'Bandwidth': '1.0 GHz Analog',
      'Sample Rate': '5.0 GSa/s Interleaved',
      'Channels': '4 Analog + 16 Digital MSO',
      'Memory Depth': '4 Mpts standard',
    },
    totalUnits: 6,
    availableUnits: 4,
    status: 'available',
    requiresApproval: false,
    safetyGuidelines: 'Ensure proper probe ground lead connection. Check 10X attenuation switch on probes before measuring high-voltage rails.',
    hourlyRate: 'Free',
    inCharge: 'Dr. Aris Thorne (a.thorne@college.edu)',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'e-osc-02',
    name: 'Tektronix 4 Series B MSO 1.5GHz 6-Channel Oscilloscope',
    category: 'Oscilloscope',
    department: 'ECE',
    lab: 'Electronics Instrumentation Facility',
    room: 'MV-201',
    model: 'MSO46B-1500',
    description: 'High-definition 12-bit ADC oscilloscope with 6 FlexChannel inputs, spectrum analysis mode, and jitter measurement package for gigabit transceivers.',
    specifications: {
      'Bandwidth': '1.5 GHz',
      'ADC Resolution': '12-bit (up to 16-bit High Res)',
      'Channels': '6 FlexChannel Inputs',
      'Record Length': '62.5 Mpoints',
    },
    totalUnits: 3,
    availableUnits: 1,
    status: 'available',
    requiresApproval: true,
    safetyGuidelines: 'Use ESD grounding wrist strap. Calibrate probe offset using internal compensation signal before critical bus testing.',
    hourlyRate: 'Free',
    inCharge: 'Dr. Aris Thorne (a.thorne@college.edu)',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
  },

  // [8] Development Boards
  {
    id: 'e-dev-01',
    name: 'Xilinx Zynq UltraScale+ MPSoC ZCU102 Evaluation Board',
    category: 'Development Board',
    department: 'ECE',
    lab: 'VLSI & Embedded Systems Research Lab',
    room: 'MV-304',
    model: 'ZCU102-ED',
    description: 'Premier FPGA development platform featuring Quad-core ARM Cortex-A53, Dual-core Cortex-R5F, and 600K UltraScale+ logic cells with FMC expansion slots.',
    specifications: {
      'FPGA Logic': '600K Logic Cells (552K LUTs)',
      'CPU Cores': 'Quad ARM Cortex-A53 + Dual Cortex-R5',
      'Memory': '4GB DDR4 64-bit + 512MB ECC',
      'Transceivers': '16x 16.3Gbps GTH',
    },
    totalUnits: 4,
    availableUnits: 3,
    status: 'available',
    requiresApproval: true,
    safetyGuidelines: 'Handle solely inside ESD-safe matting. Power down 12V ATX supply before mounting high-speed FMC daughter cards.',
    hourlyRate: 'Free',
    inCharge: 'Dr. Aris Thorne (a.thorne@college.edu)',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'e-dev-02',
    name: 'STM32H7 Nucleo-144 ARM Cortex-M7 Real-Time DSP Evaluation Board',
    category: 'Development Board',
    department: 'ECE',
    lab: 'VLSI & Embedded Systems Research Lab',
    room: 'MV-304',
    model: 'NUCLEO-H743ZI2',
    description: 'High-performance 32-bit MCU evaluation board operating at 480MHz with double-precision FPU, DSP instructions, Ethernet, and USB OTG for embedded control.',
    specifications: {
      'Core': 'ARM Cortex-M7 @ 480 MHz',
      'Flash': '2MB Dual Bank Flash',
      'SRAM': '1MB RAM',
      'Connectivity': 'Ethernet RJ45, USB OTG, Arduino ST-Zio',
    },
    totalUnits: 10,
    availableUnits: 8,
    status: 'available',
    requiresApproval: false,
    safetyGuidelines: 'Board is bus-powered via Micro-USB. Jumper ST-LINK power select accurately before supplying external 5V.',
    hourlyRate: 'Free',
    inCharge: 'Dr. Aris Thorne (a.thorne@college.edu)',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
  },

  // [9] Civil Engineering Specialized Equipment
  {
    id: 'e-civ-01',
    name: 'Topcon HiPer VR GNSS & Robotic Total Station Geomatics Kit',
    category: 'Development Board',
    department: 'CIVIL',
    lab: 'Geomatics & Laser Surveying Facility',
    room: 'ACC-202',
    model: 'TOPCON-HIPER-VR',
    description: 'Millimeter-accurate robotic laser geomatics surveying system with universal tracking satellite channels and digital terrain modeling.',
    specifications: {
      'Accuracy': '1mm + 1ppm Distance Accuracy',
      'Channels': '226 Universal Satellite Tracking',
      'Operating Range': 'Up to 5000m Prism / 1000m Non-Prism',
      'Interfaces': 'LongLink Bluetooth + Cellular',
    },
    totalUnits: 3,
    availableUnits: 2,
    status: 'available',
    requiresApproval: true,
    safetyGuidelines: 'Level tribrach precisely on heavy-duty aluminum tripod. Transport only inside shockproof hard flight cases.',
    hourlyRate: 'Free',
    inCharge: 'Dr. Rajeshwari Nair (r.nair@college.edu)',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
  },
];

const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    title: 'Autonomous Quadcopter Flight Controller with Hardware-Accelerated Sensor Fusion',
    domain: 'Robotics & Embedded Systems',
    department: 'ECE',
    studentLead: 'Aarav Patel',
    mentor: 'Dr. Aris Thorne',
    deadline: '2026-11-28',
    priority: 'capstone_critical',
    status: 'in_progress',
    progress: 78,
    description: 'Developing high-speed EKF attitude estimation on FPGA logic fabric to minimize drone stabilization latency under turbulent conditions.',
    requiredEquipment: ['Xilinx ZCU102 FPGA', 'Keysight 1GHz Oscilloscope'],
  },
  {
    id: 'proj-2',
    title: 'Real-Time Edge Vision-Language Model Quantization on Robotic Platforms',
    domain: 'Artificial Intelligence',
    department: 'CSE',
    studentLead: 'Sneha Reddy',
    mentor: 'Prof. Elena Rostova',
    deadline: '2026-12-05',
    priority: 'high',
    status: 'in_progress',
    progress: 60,
    description: 'Benchmarking 4-bit and 3-bit activation-aware weight quantization (AWQ) on mobile edge Jetson platforms for zero-shot robotic spatial grounding.',
    requiredEquipment: ['NVIDIA DGX A100 Workstation', 'Raspberry Pi 5 8GB Edge AI Starter Kit'],
  },
  {
    id: 'proj-3',
    title: 'Underactuated Soft Robotic Gripper for Fragile Agricultural Produce',
    domain: 'Mechanical & Automation',
    department: 'MECH',
    studentLead: 'Rohan Sharma',
    mentor: 'Dr. Marcus Vance',
    deadline: '2026-12-12',
    priority: 'medium',
    status: 'planning',
    progress: 35,
    description: 'Designing compliant multi-chamber elastomeric gripper fingers fabricated via stereolithography 3D printing and calibrated with 6-axis load cells.',
    requiredEquipment: ['Formlabs Form 3+ SLA 3D Printer', 'Universal Robots UR5e'],
  },
  {
    id: 'proj-4',
    title: 'Smart Seismic Modal Analysis for Long-Span Cable Stayed Bridge Models',
    domain: 'Civil & Infrastructure Engineering',
    department: 'CIVIL',
    studentLead: 'Vikram Choudhury',
    mentor: 'Dr. Rajeshwari Nair',
    deadline: '2026-12-18',
    priority: 'high',
    status: 'in_progress',
    progress: 50,
    description: 'Deploying high-sensitivity multi-axis piezoelectric vibration sensors on structural bridge models to identify modal dampening ratios under artificial ground acceleration.',
    requiredEquipment: ['Multi-Axis Piezoelectric Structural Vibration Array', 'Libelium Waspmote Station'],
  },
];

const INITIAL_BOOKINGS = [
  {
    id: 'BK-901',
    equipmentId: 'e-dev-01',
    equipmentName: 'Xilinx Zynq UltraScale+ MPSoC ZCU102 Evaluation Board',
    department: 'ECE',
    lab: 'VLSI & Embedded Systems Research Lab (MV-304)',
    studentId: 'u-student-01',
    studentName: 'Aarav Patel',
    studentEmail: 'aarav.patel@college.edu',
    projectId: 'proj-1',
    projectName: 'Autonomous Quadcopter Flight Controller',
    date: '2026-11-24',
    timeSlot: '02:00 PM - 05:00 PM',
    justification: 'Critical final capstone integration milestone. Must test SPI & CAN bus hardware acceleration with IMU sensors.',
    status: 'approved',
    facultyApproved: true,
    facultyMentor: 'Dr. Aris Thorne',
    facultyNote: 'Approved. ESD gear safety clearance verified.',
    aiUrgencyScore: 0.94,
    aiRecommendation: 'Critical deadline dependency in 96 hrs. High-priority capstone clearance recommended.',
    passCode: 'LL-PASS-901-XIL',
    createdAt: '2026-11-22T08:30:00Z',
  },
  {
    id: 'BK-902',
    equipmentId: 'e-gpu-01',
    equipmentName: 'NVIDIA DGX Station A100 (4x 80GB SXM4)',
    department: 'CSE',
    lab: 'Edge AI & Accelerated Computing Lab (TT-502)',
    studentId: 'u-student-02',
    studentName: 'Sneha Reddy',
    studentEmail: 'sneha.reddy@college.edu',
    projectId: 'proj-2',
    projectName: 'Real-Time Edge Vision-Language Model Quantization',
    date: '2026-11-25',
    timeSlot: '10:00 AM - 02:00 PM',
    justification: 'Need 320GB VRAM cluster to run distributed tensor parallel quantization before conference deadline.',
    status: 'pending',
    facultyApproved: false,
    facultyMentor: 'Prof. Elena Rostova',
    facultyNote: '',
    aiUrgencyScore: 0.88,
    aiRecommendation: 'High resource intensity. Recommend granting requested slot as cluster has 50% free node headroom.',
    passCode: 'LL-PASS-902-DGX',
    createdAt: '2026-11-23T04:15:00Z',
  },
  {
    id: 'BK-903',
    equipmentId: 'e-3dp-01',
    equipmentName: 'Formlabs Form 3+ SLA Industrial 3D Printer',
    department: 'MECH',
    lab: 'Autonomous Robotics & 3D Fabrication Studio (VSC-102)',
    studentId: 'u-student-03',
    studentName: 'Rohan Sharma',
    studentEmail: 'rohan.sharma@college.edu',
    projectId: 'proj-3',
    projectName: 'Underactuated Soft Robotic Gripper',
    date: '2026-11-26',
    timeSlot: '01:00 PM - 05:00 PM',
    justification: 'Printing elastic finger phalanges using Tough 2000 resin for tensile stress benchmarking.',
    status: 'pending',
    facultyApproved: false,
    facultyMentor: 'Dr. Marcus Vance',
    facultyNote: '',
    aiUrgencyScore: 0.65,
    aiRecommendation: 'Standard priority fabrication request. Tank resin levels verified sufficient.',
    passCode: 'LL-PASS-903-SLA',
    createdAt: '2026-11-23T06:00:00Z',
  },
  {
    id: 'BK-904',
    equipmentId: 'e-iot-02',
    equipmentName: 'Multi-Axis Piezoelectric Structural Vibration & Accelerometer Array',
    department: 'CIVIL',
    lab: 'Structural Health Monitoring & IoT Sensor Lab (ACC-105)',
    studentId: 'u-student-04',
    studentName: 'Vikram Choudhury',
    studentEmail: 'vikram.c@college.edu',
    projectId: 'proj-4',
    projectName: 'Smart Seismic Modal Analysis for Long-Span Bridges',
    date: '2026-11-27',
    timeSlot: '10:00 AM - 01:00 PM',
    justification: 'Multi-channel dynamic acceleration recording during shake-table excitation test.',
    status: 'approved',
    facultyApproved: true,
    facultyMentor: 'Dr. Rajeshwari Nair',
    facultyNote: 'Cable mounting and sensor calibration safety cleared.',
    aiUrgencyScore: 0.82,
    aiRecommendation: 'Sensors verified nominal and calibrated.',
    passCode: 'LL-PASS-904-CIV',
    createdAt: '2026-11-21T11:20:00Z',
  },
];

export const LabLinkProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('lablink_user');
    return saved ? JSON.parse(saved) : DEMO_USERS.student;
  });

  const [equipmentList, setEquipmentList] = useState(INITIAL_EQUIPMENT);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);

  // Sync user to localStorage
  useEffect(() => {
    localStorage.setItem('lablink_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Normalize booking object so camelCase and snake_case both work seamlessly
  const normalizeBooking = (b) => ({
    id: b.id,
    equipmentId: b.equipment_id || b.equipmentId,
    equipmentName: b.equipment_name || b.equipmentName,
    department: b.department || 'ECE',
    lab: b.lab || 'Specialized Laboratory',
    studentId: b.student_id || b.studentId,
    studentName: b.student_name || b.studentName,
    studentEmail: b.student_email || b.studentEmail,
    projectId: b.project_id || b.projectId,
    projectName: b.project_name || b.projectName,
    projectDeadline: b.project_deadline || b.projectDeadline || '2026-11-28',
    date: b.date,
    timeSlot: b.time_slot || b.timeSlot,
    startHour: b.start_hour ?? b.startHour ?? 14,
    endHour: b.end_hour ?? b.endHour ?? 17,
    durationHours: b.duration_hours ?? b.durationHours ?? 3,
    justification: b.justification,
    status: b.status,
    facultyApproved: b.faculty_approved ?? b.facultyApproved ?? (b.status === 'approved'),
    facultyMentor: b.faculty_mentor || b.facultyMentor || 'Faculty In-Charge',
    facultyNote: b.faculty_note || b.facultyNote || '',
    aiUrgencyScore: b.ai_urgency_score ?? b.aiUrgencyScore ?? 0.8,
    aiRecommendation: b.ai_recommendation || b.aiRecommendation || 'Queued for optimal multi-objective resource allocation.',
    passCode: b.pass_code || b.passCode || `LL-PASS-${b.id}`,
    approvalHistory: b.approval_history || b.approvalHistory || [],
    createdAt: b.created_at || b.createdAt || new Date().toISOString(),
  });

  // Fetch bookings from backend API on mount
  const fetchBookings = async () => {
    try {
      const res = await bookingApi.getAll();
      if (res.data && res.data.items && res.data.items.length > 0) {
        setBookings(res.data.items.map(normalizeBooking));
      }
    } catch (err) {
      console.warn('Backend booking API unavailable, using initialized demo state:', err.message);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Role Switcher / Login
  const switchRole = (roleKey) => {
    if (DEMO_USERS[roleKey]) {
      setCurrentUser(DEMO_USERS[roleKey]);
    }
  };

  const login = (email, password, role) => {
    const foundUser = DEMO_USERS[role] || {
      id: `u-${Date.now()}`,
      name: email.split('@')[0].toUpperCase(),
      email,
      role: role || 'student',
      department: 'ECE',
      avatar: 'U',
    };
    setCurrentUser(foundUser);
    return foundUser;
  };

  const logout = () => {
    setCurrentUser(DEMO_USERS.student);
  };

  // Smart Alternative Finder
  const getAlternatives = (equipmentId) => {
    const target = equipmentList.find((eq) => eq.id === equipmentId);
    if (!target) return [];

    const sameCat = equipmentList.filter(
      (eq) =>
        eq.id !== equipmentId &&
        eq.category.toLowerCase() === target.category.toLowerCase() &&
        eq.availableUnits > 0 &&
        eq.status === 'available'
    );

    const sameDept = equipmentList.filter(
      (eq) =>
        eq.id !== equipmentId &&
        eq.department.toUpperCase() === target.department.toUpperCase() &&
        !sameCat.some((c) => c.id === eq.id) &&
        eq.availableUnits > 0 &&
        eq.status === 'available'
    );

    return [...sameCat, ...sameDept].slice(0, 4);
  };

  // Equipment Actions
  const addEquipment = (newItem) => {
    const item = {
      ...newItem,
      id: `eq-${Date.now()}`,
      status: 'available',
      availableUnits: Number(newItem.totalUnits) || 1,
      totalUnits: Number(newItem.totalUnits) || 1,
    };
    setEquipmentList((prev) => [item, ...prev]);
    return item;
  };

  const updateEquipmentStatus = (id, newStatus) => {
    setEquipmentList((prev) =>
      prev.map((eq) => (eq.id === id ? { ...eq, status: newStatus } : eq))
    );
  };

  // Booking Actions
  const createBooking = async (bookingData) => {
    try {
      const payload = {
        equipment_id: bookingData.equipmentId,
        equipment_name: bookingData.equipmentName,
        project_id: bookingData.projectId,
        project_name: bookingData.projectName,
        date: bookingData.date,
        time_slot: bookingData.timeSlot,
        start_hour: bookingData.startHour || 14,
        duration_hours: bookingData.durationHours || 3,
        justification: bookingData.justification,
        student_id: currentUser.id,
        student_name: currentUser.name,
        student_email: currentUser.email,
        department: bookingData.department || currentUser.department || 'ECE',
        user_role: currentUser.role || 'student',
      };
      const res = await bookingApi.create(payload);
      if (res.data) {
        const normalized = normalizeBooking(res.data);
        setBookings((prev) => [normalized, ...prev.filter((b) => b.id !== normalized.id)]);
        setEquipmentList((prev) =>
          prev.map((eq) =>
            eq.id === bookingData.equipmentId && eq.availableUnits > 0
              ? { ...eq, availableUnits: eq.availableUnits - 1 }
              : eq
          )
        );
        return normalized;
      }
    } catch (err) {
      console.warn('Backend create booking failed, using local store:', err.message);
    }

    // Local fallback
    const newBooking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      status: bookingData.requiresApproval ? 'pending' : 'approved',
      facultyApproved: !bookingData.requiresApproval,
      passCode: `LL-PASS-${Math.floor(100 + Math.random() * 900)}-${bookingData.equipmentName ? bookingData.equipmentName.slice(0, 3).toUpperCase() : 'RES'}`,
      createdAt: new Date().toISOString(),
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      aiUrgencyScore: 0.85,
      aiRecommendation: 'High project alignment. Evaluated and queued for optimal resource utilization.',
      approvalHistory: [],
      ...bookingData,
    };

    setBookings((prev) => [newBooking, ...prev]);

    setEquipmentList((prev) =>
      prev.map((eq) =>
        eq.id === bookingData.equipmentId && eq.availableUnits > 0
          ? { ...eq, availableUnits: eq.availableUnits - 1 }
          : eq
      )
    );

    return newBooking;
  };

  const approveBooking = async (id, { comments = '', safetyClearance = true, suggestedSlot = null } = {}) => {
    try {
      const payload = {
        decision: 'approved',
        faculty_id: currentUser.id,
        faculty_name: currentUser.name,
        faculty_email: currentUser.email,
        comments: comments || 'Verified project milestone. ESD & laboratory handling clearance approved.',
        safety_clearance_issued: safetyClearance,
        suggested_alternative_slot: suggestedSlot,
        user_role: currentUser.role || 'faculty',
      };
      const res = await bookingApi.approve(id, payload);
      if (res.data) {
        const normalized = normalizeBooking(res.data);
        setBookings((prev) => prev.map((b) => (b.id === id ? normalized : b)));
        return { success: true, booking: normalized };
      }
    } catch (err) {
      console.warn('Backend approve booking failed:', err.message);
      if (err.status === 409 || err.details?.includes('Overbooking prevented')) {
        return { success: false, error: err.details || 'Overbooking prevented! All hardware units are already confirmed for this window.' };
      }
    }

    // Local fallback
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              status: 'approved',
              facultyApproved: true,
              facultyNote: comments || 'Approved. Lab handling clearance verified.',
              approvalHistory: [
                ...(b.approvalHistory || []),
                {
                  id: `appr-${Date.now()}`,
                  booking_id: id,
                  faculty_name: currentUser.name,
                  decision: 'approved',
                  feedback_comments: comments || 'Approved. Lab handling clearance verified.',
                  safety_clearance_issued: safetyClearance,
                  reviewed_at: new Date().toISOString(),
                },
              ],
            }
          : b
      )
    );
    return { success: true };
  };

  const rejectBooking = async (id, { comments = '', suggestedSlot = null } = {}) => {
    const feedback = comments || 'Prerequisite simulation testbenches must be submitted before physical hardware access.';
    try {
      const payload = {
        decision: 'rejected',
        faculty_id: currentUser.id,
        faculty_name: currentUser.name,
        faculty_email: currentUser.email,
        comments: feedback,
        safety_clearance_issued: false,
        suggested_alternative_slot: suggestedSlot,
        user_role: currentUser.role || 'faculty',
      };
      const res = await bookingApi.reject(id, payload);
      if (res.data) {
        const normalized = normalizeBooking(res.data);
        setBookings((prev) => prev.map((b) => (b.id === id ? normalized : b)));
        return { success: true, booking: normalized };
      }
    } catch (err) {
      console.warn('Backend reject booking failed:', err.message);
    }

    // Local fallback
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              status: 'rejected',
              facultyApproved: false,
              facultyNote: feedback,
              approvalHistory: [
                ...(b.approvalHistory || []),
                {
                  id: `appr-${Date.now()}`,
                  booking_id: id,
                  faculty_name: currentUser.name,
                  decision: 'rejected',
                  feedback_comments: feedback,
                  suggested_alternative_slot: suggestedSlot,
                  reviewed_at: new Date().toISOString(),
                },
              ],
            }
          : b
      )
    );
    return { success: true };
  };

  const cancelBooking = async (id, reason = 'Student requested booking cancellation') => {
    try {
      const res = await bookingApi.cancel(id, {
        user_id: currentUser.id,
        user_role: currentUser.role || 'student',
        reason,
      });
      if (res.data) {
        const normalized = normalizeBooking(res.data);
        setBookings((prev) => prev.map((b) => (b.id === id ? normalized : b)));
        const bookingToCancel = bookings.find((b) => b.id === id);
        if (bookingToCancel) {
          setEquipmentList((prev) =>
            prev.map((eq) =>
              eq.id === bookingToCancel.equipmentId
                ? { ...eq, availableUnits: Math.min(eq.totalUnits, eq.availableUnits + 1) }
                : eq
            )
          );
        }
        return { success: true, booking: normalized };
      }
    } catch (err) {
      console.warn('Backend cancel failed, using local cancellation:', err.message);
      if (err.status === 400) {
        return { success: false, error: err.details || err.message };
      }
    }

    const bookingToCancel = bookings.find((b) => b.id === id);
    if (bookingToCancel) {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b))
      );
      setEquipmentList((prev) =>
        prev.map((eq) =>
          eq.id === bookingToCancel.equipmentId
            ? { ...eq, availableUnits: Math.min(eq.totalUnits, eq.availableUnits + 1) }
            : eq
        )
      );
    }
    return { success: true };
  };

  const updateBookingStatus = (id, newStatus, facultyNote = '') => {
    if (newStatus === 'approved') {
      return approveBooking(id, { comments: facultyNote });
    } else if (newStatus === 'rejected') {
      return rejectBooking(id, { comments: facultyNote });
    } else if (newStatus === 'cancelled') {
      return cancelBooking(id, facultyNote);
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              status: newStatus,
              facultyApproved: newStatus === 'approved',
              facultyNote: facultyNote || b.facultyNote,
            }
          : b
      )
    );
  };

  // Project Actions
  const createProject = (projectData) => {
    const newProj = {
      id: `proj-${Date.now()}`,
      studentLead: currentUser.name,
      department: currentUser.department || 'ECE',
      status: 'planning',
      progress: 10,
      ...projectData,
    };
    setProjects((prev) => [newProj, ...prev]);
    return newProj;
  };

  return (
    <LabLinkContext.Provider
      value={{
        currentUser,
        switchRole,
        login,
        logout,
        equipmentList,
        addEquipment,
        updateEquipmentStatus,
        getAlternatives,
        projects,
        createProject,
        bookings,
        fetchBookings,
        createBooking,
        approveBooking,
        rejectBooking,
        updateBookingStatus,
        cancelBooking,
      }}
    >
      {children}
    </LabLinkContext.Provider>
  );
};

export const useLabLink = () => {
  const context = useContext(LabLinkContext);
  if (!context) {
    throw new Error('useLabLink must be used within a LabLinkProvider');
  }
  return context;
};

export default LabLinkContext;
