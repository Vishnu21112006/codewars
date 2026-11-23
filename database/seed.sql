-- ====================================================================
-- LabLink: Realistic Seed Data for CSE, ECE, Mechanical & Civil
-- Including all requested equipment types:
-- - Raspberry Pi kits
-- - Arduino kits
-- - GPU workstations
-- - IoT sensors
-- - Robotics kits
-- - 3D printers
-- - Oscilloscopes
-- - Development boards
-- ====================================================================

-- 1. Departments: CSE, ECE, Mechanical, Civil
INSERT INTO public.departments (id, name, code, building, description) VALUES
('d1111111-1111-1111-1111-111111111111', 'Electronics & Communication Engineering', 'ECE', 'Sir MV Block - 3rd Floor', 'Micro-electronics, VLSI Silicon Design, Mixed-Signal Prototyping & RF Instrumentation'),
('d2222222-2222-2222-2222-222222222222', 'Computer Science & Engineering', 'CSE', 'Turing Innovation Tower - 5th Floor', 'Enterprise AI Supercomputing, Edge Machine Learning, Embedded Systems & Cloud Clusters'),
('d3333333-3333-3333-3333-333333333333', 'Mechanical Engineering & Robotics', 'MECH', 'Vikram Sarabhai Complex - 1st Floor', 'Autonomous Robotic Manipulators, SLA/FDM Additive Manufacturing & Mechatronics'),
('d4444444-4444-4444-4444-444444444444', 'Civil & Infrastructure Engineering', 'CIVIL', 'Sir Arthur Cotton Complex - Ground Floor', 'Structural Health Monitoring, Geomatics LiDAR Surveying & Smart City Environmental Sensor Mesh')
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, building = EXCLUDED.building, description = EXCLUDED.description;

-- 2. Laboratories across the 4 Departments
INSERT INTO public.laboratories (id, department_id, name, room_number, capacity, lab_incharge_name, lab_incharge_email) VALUES
-- ECE Labs
('l1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'VLSI & Embedded Systems Research Lab', 'MV-304', 35, 'Dr. Aris Thorne', 'a.thorne@college.edu'),
('l1111111-1111-1111-1111-222222222222', 'd1111111-1111-1111-1111-111111111111', 'Electronics Instrumentation Facility', 'MV-201', 30, 'Dr. Aris Thorne', 'a.thorne@college.edu'),
-- CSE Labs
('l2222222-2222-2222-2222-111111111111', 'd2222222-2222-2222-2222-222222222222', 'Edge AI & Accelerated Computing Lab', 'TT-502', 40, 'Prof. Elena Rostova', 'e.rostova@college.edu'),
('l2222222-2222-2222-2222-222222222222', 'd2222222-2222-2222-2222-222222222222', 'Robotics & Vision Studio', 'TT-405', 25, 'Prof. Elena Rostova', 'e.rostova@college.edu'),
-- MECH Labs
('l3333333-3333-3333-3333-111111111111', 'd3333333-3333-3333-3333-333333333333', 'Autonomous Robotics & 3D Fabrication Studio', 'VSC-102', 25, 'Dr. Marcus Vance', 'm.vance@college.edu'),
('l3333333-3333-3333-3333-222222222222', 'd3333333-3333-3333-3333-333333333333', 'Dynamics & Mechatronics Automation Center', 'VSC-204', 30, 'Dr. Marcus Vance', 'm.vance@college.edu'),
-- CIVIL Labs
('l4444444-4444-4444-4444-111111111111', 'd4444444-4444-4444-4444-444444444444', 'Structural Health Monitoring & IoT Sensor Lab', 'ACC-105', 25, 'Dr. Rajeshwari Nair', 'r.nair@college.edu'),
('l4444444-4444-4444-4444-222222222222', 'd4444444-4444-4444-4444-444444444444', 'Geomatics & Laser Surveying Facility', 'ACC-202', 20, 'Dr. Rajeshwari Nair', 'r.nair@college.edu')
ON CONFLICT DO NOTHING;

-- 3. Realistic Equipment Inventory (CSE, ECE, Mechanical, Civil)
INSERT INTO public.equipment (
    id, lab_id, name, category, model_number, description, specifications,
    total_units, available_units, status, requires_faculty_approval, safety_guidelines, hourly_rate, image_url
) VALUES

-- [1] Raspberry Pi Kits
('e-rpi-01', 'l2222222-2222-2222-2222-111111111111', 'Raspberry Pi 5 8GB Edge AI Starter Kit', 'Raspberry Pi Kit', 'RPI5-8G-AI',
 'Broadcom BCM2712 quad-core Cortex-A76 processor with Coral M.2 PCIe Edge TPU accelerator for localized real-time inference.',
 '{"cpu": "Quad-Core ARM Cortex-A76 @ 2.4GHz", "ram": "8GB LPDDR4X", "ai_tpu": "Google Coral 4 TOPS Edge TPU", "interfaces": "PCIe 2.0, Dual 4Kp60 HDMI, Gigabit Eth"}'::jsonb,
 10, 7, 'available', false, 'Use regulated 27W USB-PD power supply. Ensure active cooling heatsink is connected during intensive ML runs.', 'Free',
 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'),

('e-rpi-02', 'l1111111-1111-1111-1111-111111111111', 'Raspberry Pi 4 Model B Embedded Gateway Kit', 'Raspberry Pi Kit', 'RPI4B-4G',
 'Versatile embedded controller kit with 40-pin GPIO breakout, CAN-bus transceiver HAT, and camera module for IoT experiments.',
 '{"cpu": "Quad-Core Cortex-A72 @ 1.5GHz", "ram": "4GB LPDDR4", "gpio": "40-pin header with SPI/I2C/UART", "storage": "32GB High Endurance MicroSD"}'::jsonb,
 12, 0, 'in_use', false, 'Always power off board before inserting or removing ribbon cables on CSI/DSI headers.', 'Free',
 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'),

-- [2] Arduino Kits
('e-ard-01', 'l1111111-1111-1111-1111-111111111111', 'Arduino GIGA R1 WiFi Dual-Core Engineering Kit', 'Arduino Kit', 'ARD-GIGA-R1',
 'Dual-core STM32H747XI (Cortex-M7 @ 480MHz + Cortex-M4 @ 240MHz) with integrated Wi-Fi, Bluetooth BLE, and hardware crypto.',
 '{"microcontroller": "STM32H747XI Dual Core", "memory": "2MB Flash, 1MB RAM", "gpio_pins": "76 Digital, 12 Analog, 12 PWM", "wireless": "Murata 1DX Dual Band WiFi + BT"}'::jsonb,
 8, 6, 'available', false, 'Operate at 3.3V logic level. 5V input on digital pins will permanently damage the microcontroller.', 'Free',
 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=600&q=80'),

('e-ard-02', 'l3333333-3333-3333-3333-222222222222', 'Arduino Portenta H7 Vision Shield Prototyping Kit', 'Arduino Kit', 'ARD-PORTENTA-H7',
 'Industrial-grade system-on-module featuring Himax ultra-low power vision camera and dual directional digital microphones for voice and gesture triggers.',
 '{"vision_sensor": "Himax HM-0360 640x480", "microphones": "2x MP34DT05 Omnidirectional", "connectivity": "Ethernet PHY + High-density connectors"}'::jsonb,
 6, 4, 'available', false, 'Keep optical lens free of dust. Use anti-static ESD foam for bench mounting.', 'Free',
 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=600&q=80'),

-- [3] GPU Workstations
('e-gpu-01', 'l2222222-2222-2222-2222-111111111111', 'NVIDIA DGX Station A100 (4x 80GB SXM4)', 'GPU Workstation', 'DGX-A100-320G',
 'AI supercomputing workstation with 4x NVIDIA A100 Tensor Core GPUs interconnected via 200 GB/s NVLink. Built for multi-node LLMs and physics simulation.',
 '{"compute_gpus": "4x NVIDIA A100 80GB SXM4", "vram_total": "320GB HBM2e (1.6 TB/s)", "host_cpu": "AMD EPYC 7742 64-Core", "system_ram": "512GB DDR4 ECC"}'::jsonb,
 2, 1, 'available', true, 'Jobs must be submitted via Slurm queue. Allocate VRAM quotas accurately; orphan processes will be terminated.', 'Free (Grant)',
 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80'),

('e-gpu-02', 'l2222222-2222-2222-2222-111111111111', 'Dual NVIDIA RTX 6000 Ada Generation Deep Learning Workstation', 'GPU Workstation', 'RTX-6000-ADA',
 'High-end vision and generative AI station with 96GB combined ECC GDDR6 VRAM and 4th Generation Tensor Cores.',
 '{"gpus": "2x NVIDIA RTX 6000 Ada 48GB", "cuda_cores": "36,352 Cores", "vram": "96GB GDDR6 with ECC", "cpu": "Intel Xeon w9-3475X 36-Core"}'::jsonb,
 3, 0, 'in_use', true, 'Workstation reserved for Master/PhD theses runs. Log GPU temperatures via nvidia-smi telemetry.', 'Free',
 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80'),

-- [4] IoT Sensors & Environmental Telemetry
('e-iot-01', 'l4444444-4444-4444-4444-111111111111', 'Libelium Waspmote Smart Cities & Air Quality Sensor Station', 'IoT Sensor', 'WASP-SC-AIR',
 'Multiparameter smart infrastructure node measuring PM1.0, PM2.5, PM10, CO2, NO2, temperature, and ambient acoustic dB sound levels.',
 '{"gas_sensors": "CO, NO2, O3, SO2 Electrochemical", "particle_sensor": "Optical PM1/PM2.5/PM10", "telemetry": "LoRaWAN 868MHz + NB-IoT", "enclosure": "IP67 Weatherproof"}'::jsonb,
 6, 5, 'available', false, 'Do not touch electrochemical sensing membranes. Calibrate baseline with reference nitrogen gas when required.', 'Free',
 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'),

('e-iot-02', 'l4444444-4444-4444-4444-111111111111', 'Multi-Axis Piezoelectric Structural Vibration & Accelerometer Array', 'IoT Sensor', 'PCB-PIEZO-356',
 'Triaxial high-sensitivity shear accelerometers with 24-bit dynamic signal acquisition module for bridge and building resonance modal analysis.',
 '{"sensitivity": "100 mV/g", "frequency_range": "0.5 Hz to 5000 Hz", "channels": "8 Simultaneous 24-bit IEPE", "sampling_rate": "102.4 kS/s per channel"}'::jsonb,
 5, 3, 'available', true, 'Secure accelerometer studs with approved cyanoacrylate or petro-wax. Never yank coaxial microdot cables.', 'Free',
 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'),

-- [5] Robotics Kits
('e-rob-01', 'l3333333-3333-3333-3333-111111111111', 'Universal Robots UR5e 6-Axis Collaborative Robot Arm', 'Robotics Kit', 'UR5e-CB3',
 'Precision 6-degree-of-freedom robotic manipulator with built-in force/torque sensor, 5kg payload, 850mm reach, and full ROS 2 Humble integration.',
 '{"payload": "5.0 kg", "reach": "850 mm", "repeatability": "±0.03 mm", "ft_sensor": "Integrated 6-axis F/T @ Tool Flange", "bus": "ROS2 / Modbus TCP / Ethernet/IP"}'::jsonb,
 2, 2, 'available', true, 'Emergency stop pendant must be held by the designated safety observer whenever robot is executing automated trajectories.', 'Free',
 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80'),

('e-rob-02', 'l2222222-2222-2222-2222-222222222222', 'TurtleBot 4 ROS 2 Mobile Robot Platform with 2D LiDAR & OAK-D', 'Robotics Kit', 'TB4-STANDARD',
 'Next-generation educational robot built on iRobot Create 3 base with Raspberry Pi 4 compute, RPLIDAR A1 2D laser scanner, and OAK-D Spatial AI depth camera.',
 '{"base": "iRobot Create 3 Base", "lidar": "RPLIDAR A1 360-degree 12m range", "spatial_ai": "Luxonis OAK-D RGB-D 4K", "sensors": "Cliff, Bump, Optical Flow, IMU"}'::jsonb,
 4, 3, 'available', false, 'Ensure floor test arena is cleared of wires and liquid spills before initiating autonomous navigation or SLAM mapping.', 'Free',
 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80'),

-- [6] 3D Printers & Rapid Prototyping
('e-3dp-01', 'l3333333-3333-3333-3333-111111111111', 'Formlabs Form 3+ SLA Industrial 3D Printer', '3D Printer', 'FORM3P-SLA',
 'Low Force Stereolithography (LFS) 3D printer for millimeter-precise engineering housings, microfluidic channels, and high-modulus brackets.',
 '{"technology": "Low Force Stereolithography", "xy_resolution": "25 Micron", "build_volume": "14.5 x 14.5 x 18.5 cm", "laser_power": "250mW 405nm Precision Laser"}'::jsonb,
 3, 2, 'available', true, 'Chemical-resistant nitrile gloves and UV eye shielding mandatory during resin handling and isopropyl alcohol wash stages.', 'Resin Cost (~$0.15/mL)',
 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80'),

('e-3dp-02', 'l3333333-3333-3333-3333-111111111111', 'Bambu Lab X1-Carbon Dual Extruder High-Speed 3D Printer', '3D Printer', 'BAMBU-X1C',
 'Enclosed high-speed core-XY additive printer capable of carbon-fiber reinforced filaments (PA-CF, PET-CF) with dual automated LiDAR first-layer inspection.',
 '{"build_volume": "256 x 256 x 256 mm", "max_speed": "500 mm/s", "hotend_temp": "Up to 300°C All-Metal", "inspection": "Micro-LiDAR dual automated bed levelling"}'::jsonb,
 4, 4, 'available', false, 'Ensure chamber door remains closed while heating bed. Do not touch active nozzle heated to 300°C.', 'Filament Cost',
 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80'),

-- [7] Oscilloscopes & High-Frequency Test Benches
('e-osc-01', 'l1111111-1111-1111-1111-222222222222', 'Keysight Infiniium 1GHz 4-Channel Mixed Signal Oscilloscope', 'Oscilloscope', 'DSOX4024A',
 'MegaZoom IV mixed signal storage oscilloscope with 5 GSa/s real-time sampling rate, 1 GHz bandwidth, and protocol decoding for CAN, I2C, SPI, UART, LIN.',
 '{"bandwidth": "1.0 GHz Analog", "sample_rate": "5.0 GSa/s Interleaved", "channels": "4 Analog + 16 Digital MSO", "memory_depth": "4 Mpts standard"}'::jsonb,
 6, 4, 'available', false, 'Ensure proper probe ground lead connection. Check 10X attenuation switch on probes before measuring high-voltage rails.', 'Free',
 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'),

('e-osc-02', 'l1111111-1111-1111-1111-222222222222', 'Tektronix 4 Series B MSO 1.5GHz 6-Channel Oscilloscope', 'Oscilloscope', 'MSO46B-1500',
 'High-definition 12-bit ADC oscilloscope with 6 FlexChannel inputs, spectrum analysis mode, and jitter measurement package for gigabit transceivers.',
 '{"bandwidth": "1.5 GHz", "adc_resolution": "12-bit (up to 16-bit High Res)", "channels": "6 FlexChannel Inputs", "record_length": "62.5 Mpoints"}'::jsonb,
 3, 1, 'available', true, 'Use ESD grounding wrist strap. Calibrate probe offset using internal compensation signal before critical bus testing.', 'Free',
 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'),

-- [8] Development Boards
('e-dev-01', 'l1111111-1111-1111-1111-111111111111', 'Xilinx Zynq UltraScale+ MPSoC ZCU102 Evaluation Board', 'Development Board', 'ZCU102-ED',
 'Premier FPGA development platform featuring Quad-core ARM Cortex-A53, Dual-core Cortex-R5F, and 600K UltraScale+ logic cells with FMC expansion slots.',
 '{"fpga_logic": "600K Logic Cells (552K LUTs)", "cpu_cores": "Quad ARM Cortex-A53 + Dual Cortex-R5", "memory": "4GB DDR4 64-bit + 512MB ECC", "transceivers": "16x 16.3Gbps GTH"}'::jsonb,
 4, 3, 'available', true, 'Handle solely inside ESD-safe matting. Power down 12V ATX supply before mounting high-speed FMC daughter cards.', 'Free',
 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'),

('e-dev-02', 'l1111111-1111-1111-1111-111111111111', 'STM32H7 Nucleo-144 ARM Cortex-M7 Real-Time DSP Evaluation Board', 'Development Board', 'NUCLEO-H743ZI2',
 'High-performance 32-bit MCU evaluation board operating at 480MHz with double-precision FPU, DSP instructions, Ethernet, and USB OTG for embedded control.',
 '{"core": "ARM Cortex-M7 @ 480 MHz", "flash": "2MB Dual Bank Flash", "sram": "1MB RAM", "connectivity": "Ethernet RJ45, USB OTG, Arduino ST-Zio"}'::jsonb,
 10, 8, 'available', false, 'Board is bus-powered via Micro-USB. Jumper ST-LINK power select accurately before supplying external 5V.', 'Free',
 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'),

-- [9] Civil Engineering Specialized Equipment
('e-civ-01', 'l4444444-4444-4444-4444-222222222222', 'Topcon HiPer VR GNSS & Robotic Total Station Geomatics Kit', 'Development Board', 'TOPCON-HIPER-VR',
 'Millimeter-accurate robotic laser geomatics surveying system with universal tracking satellite channels and digital terrain modeling.',
 '{"accuracy": "1mm + 1ppm Distance Accuracy", "channels": "226 Universal Satellite Tracking", "operating_range": "Up to 5000m Prism / 1000m Non-Prism", "interfaces": "LongLink Bluetooth + Cellular"}'::jsonb,
 3, 2, 'available', true, 'Level tribrach precisely on heavy-duty aluminum tripod. Transport only inside shockproof hard flight cases.', 'Free',
 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80')

ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    model_number = EXCLUDED.model_number,
    description = EXCLUDED.description,
    specifications = EXCLUDED.specifications,
    total_units = EXCLUDED.total_units,
    available_units = EXCLUDED.available_units,
    status = EXCLUDED.status,
    requires_faculty_approval = EXCLUDED.requires_faculty_approval,
    safety_guidelines = EXCLUDED.safety_guidelines,
    hourly_rate = EXCLUDED.hourly_rate,
    image_url = EXCLUDED.image_url;
