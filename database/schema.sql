-- ====================================================================
-- LabLink: Campus Laboratory Resource-Sharing Platform
-- Complete Supabase PostgreSQL Schema (7 Core Tables)
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles (linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE, -- linked to auth.users if Supabase Auth is active
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'faculty', 'lab_admin', 'super_admin')) DEFAULT 'student',
    department TEXT NOT NULL,
    roll_number TEXT,
    academic_year TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Departments (CSE, ECE, Mechanical, Civil, etc.)
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    building TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Laboratories
CREATE TABLE IF NOT EXISTS public.laboratories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    room_number TEXT NOT NULL,
    capacity INT DEFAULT 30,
    lab_incharge_name TEXT,
    lab_incharge_email TEXT,
    operating_hours TEXT DEFAULT '09:00 AM - 05:00 PM',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Equipment & Dev Kits
CREATE TABLE IF NOT EXISTS public.equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lab_id UUID REFERENCES public.laboratories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Development Board', 'Raspberry Pi Kit', 'Arduino Kit', 'GPU Workstation', 'IoT Sensor', 'Robotics Kit', '3D Printer', 'Oscilloscope'
    model_number TEXT,
    description TEXT,
    specifications JSONB DEFAULT '{}'::jsonb,
    total_units INT DEFAULT 1 CHECK (total_units >= 0),
    available_units INT DEFAULT 1 CHECK (available_units >= 0),
    status TEXT NOT NULL CHECK (status IN ('available', 'maintenance', 'in_use', 'decommissioned')) DEFAULT 'available',
    requires_faculty_approval BOOLEAN DEFAULT true,
    safety_guidelines TEXT,
    hourly_rate TEXT DEFAULT 'Free',
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Student Projects
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    domain TEXT NOT NULL, -- e.g., 'Robotics', 'VLSI', 'Structural Dynamics', 'AI/ML'
    deadline DATE NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'capstone_critical')) DEFAULT 'medium',
    faculty_mentor_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Booking Requests & Allocations
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_id UUID REFERENCES public.equipment(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    justification TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'cancelled')) DEFAULT 'pending',
    allocated_by_optimizer BOOLEAN DEFAULT FALSE,
    ai_urgency_score FLOAT DEFAULT 0.0,
    pass_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Approvals (Faculty Mentor & Lab Administrator Decision Trail)
CREATE TABLE IF NOT EXISTS public.approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    faculty_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    decision TEXT NOT NULL CHECK (decision IN ('approved', 'rejected', 'rescheduled', 'safety_conditional')),
    feedback_comments TEXT,
    safety_clearance_issued BOOLEAN DEFAULT FALSE,
    suggested_alternative_slot TEXT,
    reviewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Supporting Table: Optimization Scheduling Resolutions
CREATE TABLE IF NOT EXISTS public.scheduling_resolutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    competing_booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    conflict_reason TEXT NOT NULL,
    ai_recommendation TEXT NOT NULL,
    suggested_alternative_start TIMESTAMPTZ,
    suggested_alternative_end TIMESTAMPTZ,
    status TEXT DEFAULT 'proposed' CHECK (status IN ('proposed', 'accepted', 'dismissed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for high-frequency discovery queries
CREATE INDEX IF NOT EXISTS idx_equipment_lab_id ON public.equipment(lab_id);
CREATE INDEX IF NOT EXISTS idx_equipment_category ON public.equipment(category);
CREATE INDEX IF NOT EXISTS idx_equipment_status ON public.equipment(status);
CREATE INDEX IF NOT EXISTS idx_bookings_equipment_id ON public.bookings(equipment_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_approvals_booking_id ON public.approvals(booking_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laboratories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduling_resolutions ENABLE ROW LEVEL SECURITY;

-- Permissive RLS policies for hackathon demonstration
CREATE POLICY "Public read departments" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Public read laboratories" ON public.laboratories FOR SELECT USING (true);
CREATE POLICY "Public read equipment" ON public.equipment FOR SELECT USING (true);
CREATE POLICY "Public write equipment" ON public.equipment FOR ALL USING (true);
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public write profiles" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public write projects" ON public.projects FOR ALL USING (true);
CREATE POLICY "Public read bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Public write bookings" ON public.bookings FOR ALL USING (true);
CREATE POLICY "Public read approvals" ON public.approvals FOR SELECT USING (true);
CREATE POLICY "Public write approvals" ON public.approvals FOR ALL USING (true);
CREATE POLICY "Public read resolutions" ON public.scheduling_resolutions FOR SELECT USING (true);
