import React, { useState, useEffect } from 'react';
import {
  Cpu,
  CalendarCheck2,
  Clock,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Microchip,
  AlertTriangle,
  Flame
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import StatCard from '../components/StatCard';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { healthApi } from '../api/client';

const mockUtilizationData = [
  { time: '08:00', ECE: 45, CSE: 60, MECH: 30, BIOTECH: 25 },
  { time: '10:00', ECE: 85, CSE: 90, MECH: 75, BIOTECH: 60 },
  { time: '12:00', ECE: 92, CSE: 95, MECH: 80, BIOTECH: 70 },
  { time: '14:00', ECE: 78, CSE: 88, MECH: 85, BIOTECH: 80 },
  { time: '16:00', ECE: 88, CSE: 92, MECH: 70, BIOTECH: 65 },
  { time: '18:00', ECE: 60, CSE: 82, MECH: 45, BIOTECH: 35 },
];

const mockRecentBookings = [
  {
    id: 'B-1092',
    student: 'Aarav Patel',
    project: 'Autonomous Quadcopter Flight Controller',
    equipment: 'Xilinx ZCU102 FPGA Dev Kit',
    department: 'ECE',
    slot: 'Today, 2:00 PM - 5:00 PM',
    status: 'approved',
    priority: 'high',
  },
  {
    id: 'B-1093',
    student: 'Sneha Reddy',
    project: 'Edge Vision LLM on Mobile Robotics',
    equipment: 'NVIDIA DGX Station A100 Workstation',
    department: 'CSE',
    slot: 'Tomorrow, 10:00 AM - 1:00 PM',
    status: 'pending',
    priority: 'capstone',
  },
  {
    id: 'B-1094',
    student: 'Rohan Sharma',
    project: 'Prosthetic Hand Gripper Prototype',
    equipment: 'Formlabs Form 3+ SLA 3D Printer',
    department: 'MECH',
    slot: 'Nov 25, 11:00 AM - 3:00 PM',
    status: 'approved',
    priority: 'medium',
  },
  {
    id: 'B-1095',
    student: 'Ananya Roy',
    project: 'Microfluidic DNA Amplification Assay',
    equipment: 'Thermo Scientific NanoDrop One',
    department: 'BIOTECH',
    slot: 'Nov 26, 9:00 AM - 12:00 PM',
    status: 'pending',
    priority: 'high',
  },
];

export const Dashboard = () => {
  const [healthStatus, setHealthStatus] = useState(null);

  useEffect(() => {
    healthApi
      .check()
      .then((res) => setHealthStatus(res.data))
      .catch(() => setHealthStatus({ status: 'offline' }));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-700/60 bg-gradient-to-r from-navy-900 via-navy-850 to-slate-900 p-8 shadow-2xl backdrop-blur-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 via-violet-500/10 to-transparent blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cross-Department Resource Sharing Active</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Campus Lab <span className="text-gradient">Resource Mesh</span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Discover high-end laboratory gear across ECE, CSE, Mechanical, and Biotechnology.
              Schedule conflict-free slots powered by <strong>Google OR-Tools</strong> and <strong>Gemini AI</strong>.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              icon={Sparkles}
              onClick={() => (window.location.href = '/matchmaker')}
            >
              Ask AI Matchmaker
            </Button>
            <Button
              variant="glass"
              icon={ArrowUpRight}
              onClick={() => (window.location.href = '/equipment')}
            >
              Explore Equipment
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Specialized Equipment"
          value="48 Units"
          trend="4 Labs Linked"
          trendDirection="up"
          icon={Cpu}
          color="cyan"
          subtitle="98.2% calibrated & functional"
        />
        <StatCard
          title="Active Slot Allocations"
          value="126 Slots"
          trend="+14% this week"
          trendDirection="up"
          icon={CalendarCheck2}
          color="emerald"
          subtitle="Zero overlapping collisions"
        />
        <StatCard
          title="Pending Faculty Reviews"
          value="7 Requests"
          trend="3 High Urgency"
          trendDirection="neutral"
          icon={Clock}
          color="amber"
          subtitle="Avg turnaround: 2.4 hrs"
        />
        <StatCard
          title="Fairness / Solver Score"
          value="96.4%"
          trend="OR-Tools CP-SAT"
          trendDirection="up"
          icon={Sparkles}
          color="violet"
          subtitle="Deadlines strictly weighted"
        />
      </div>

      {/* Charts & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Department Utilization Chart */}
        <div className="lg:col-span-2">
          <GlassCard
            title="Real-Time Department Lab Utilization"
            subtitle="Hourly load index (%) across campus laboratory stations"
            gradientGlow
          >
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockUtilizationData}>
                  <defs>
                    <linearGradient id="colorECE" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorCSE" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#fff',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="ECE"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorECE)"
                    name="ECE / Embedded"
                  />
                  <Area
                    type="monotone"
                    dataKey="CSE"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCSE)"
                    name="CSE / AI Clusters"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> ECE Labs
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-400" /> CSE Clusters
                </span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">
                Peak Window: 12:00 PM - 02:00 PM
              </span>
            </div>
          </GlassCard>
        </div>

        {/* Live Fairness & Conflict Resolver Box */}
        <div className="space-y-6">
          <GlassCard
            title="Intelligent Conflict Resolution"
            subtitle="Recent fair allocations solved by CP-SAT"
            icon={ShieldCheck}
          >
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-emerald-300">
                    Slot Contention Resolved
                  </span>
                  <Badge variant="emerald" size="sm">
                    Solved
                  </Badge>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  2 Teams requested <strong>NVIDIA DGX A100</strong> at 2:00 PM. High-priority capstone team assigned primary slot; secondary simulation team moved to 5:00 PM off-peak window.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-950/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-cyan-300">
                    Auto-Discovered Alternate
                  </span>
                  <Badge variant="cyan" size="sm">
                    Re-routed
                  </Badge>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Keysight Oscilloscope occupied in ECE-304. Student redirected to identical unit in Physics Instrumentation Lab.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Recent Equipment Requests Table */}
      <GlassCard
        title="Recent Project Resource Bookings"
        subtitle="Live feed of student reservation requests across campus departments"
        headerAction={
          <Button variant="glass" size="sm" onClick={() => (window.location.href = '/scheduler')}>
            View All Slots
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 px-3">Req ID</th>
                <th className="pb-3 px-3">Student & Project</th>
                <th className="pb-3 px-3">Specialized Equipment</th>
                <th className="pb-3 px-3">Dept</th>
                <th className="pb-3 px-3">Reserved Slot</th>
                <th className="pb-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {mockRecentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-3 font-mono font-medium text-cyan-400">
                    {b.id}
                  </td>
                  <td className="py-3.5 px-3">
                    <p className="font-semibold text-white">{b.student}</p>
                    <p className="text-slate-400 text-[11px] truncate max-w-xs">{b.project}</p>
                  </td>
                  <td className="py-3.5 px-3 font-medium text-slate-200">
                    {b.equipment}
                  </td>
                  <td className="py-3.5 px-3">
                    <Badge variant="slate" size="sm">
                      {b.department}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-3 text-slate-300">{b.slot}</td>
                  <td className="py-3.5 px-3">
                    <Badge
                      variant={b.status === 'approved' ? 'emerald' : 'amber'}
                      size="sm"
                      dot
                      pulsing={b.status === 'pending'}
                    >
                      {b.status === 'approved' ? 'Approved' : 'Pending Faculty'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default Dashboard;
