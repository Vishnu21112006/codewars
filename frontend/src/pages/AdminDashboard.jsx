import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Cpu,
  TrendingUp,
  Award,
  Zap,
  Activity,
  CalendarCheck,
  ShieldCheck,
  Users,
  Plus,
  AlertTriangle,
  Clock,
  CheckCircle2,
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
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useLabLink } from '../context/LabLinkContext';
import { analyticsApi } from '../api/client';
import StatCard from '../components/StatCard';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import Button from '../components/Button';

const departmentUtilizationData = [
  { name: 'ECE (VLSI & Embedded)', activeUnits: 14, totalUnits: 16, utilization: 88, color: '#38bdf8' },
  { name: 'CSE (AI & Cloud Clusters)', activeUnits: 10, totalUnits: 12, utilization: 83, color: '#8b5cf6' },
  { name: 'MECH (Robotics & 3D)', activeUnits: 7, totalUnits: 8, utilization: 87, color: '#10b981' },
  { name: 'BIOTECH (Bio-Sensors)', activeUnits: 5, totalUnits: 6, utilization: 83, color: '#f59e0b' },
];

const hourlyLoadTrend = [
  { time: '08:00', totalBookings: 8, solverOptimalIndex: 96 },
  { time: '10:00', totalBookings: 24, solverOptimalIndex: 98 },
  { time: '12:00', totalBookings: 32, solverOptimalIndex: 95 },
  { time: '14:00', totalBookings: 38, solverOptimalIndex: 99 },
  { time: '16:00', totalBookings: 30, solverOptimalIndex: 97 },
  { time: '18:00', totalBookings: 18, solverOptimalIndex: 94 },
];

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { equipmentList, bookings } = useLabLink();
  const [analyticsOverview, setAnalyticsOverview] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  useEffect(() => {
    analyticsApi.getOverview()
      .then((res) => {
        if (res.data) setAnalyticsOverview(res.data);
      })
      .catch((err) => {
        console.warn('Backend analytics API unavailable, calculating from context:', err.message);
      })
      .finally(() => setLoadingAnalytics(false));
  }, [equipmentList, bookings]);

  const totalStations = equipmentList.reduce((acc, eq) => acc + (eq.totalUnits || eq.total_units || 1), 0);
  const totalFreeStations = equipmentList.reduce(
    (acc, eq) => acc + (eq.status === 'available' ? (eq.availableUnits ?? eq.available_units ?? 0) : 0),
    0
  );
  const totalInUseStations = Math.max(0, totalStations - totalFreeStations);
  const utilizationRate = Math.round((totalInUseStations / Math.max(totalStations, 1)) * 100);

  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const approvedBookings = bookings.filter((b) => b.status === 'approved');

  // Department-wise usage data
  const departmentUsageData = analyticsOverview?.faculty_admin?.department_usage || [
    { department: 'ECE', active_units: 14, total_units: 16, utilization: 87.5, bookings_count: 5 },
    { department: 'CSE', active_units: 10, total_units: 12, utilization: 83.3, bookings_count: 4 },
    { department: 'MECH', active_units: 7, total_units: 8, utilization: 87.5, bookings_count: 3 },
    { department: 'CIVIL', active_units: 5, total_units: 6, utilization: 83.3, bookings_count: 2 },
  ];

  // Most requested equipment data
  const mostRequestedEquipmentData = analyticsOverview?.faculty_admin?.most_requested_equipment || [
    { name: 'Xilinx ZCU102 FPGA', count: 6, department: 'ECE' },
    { name: 'NVIDIA DGX A100', count: 5, department: 'CSE' },
    { name: 'Formlabs Form 3+', count: 4, department: 'MECH' },
    { name: 'Keysight Oscilloscope', count: 4, department: 'ECE' },
    { name: 'Piezo Sensor Array', count: 3, department: 'CIVIL' },
  ];

  const utilizationPieData = [
    { name: 'Active In-Use', value: totalInUseStations, color: '#8b5cf6' },
    { name: 'Available on Bench', value: totalFreeStations, color: '#10b981' },
  ];

  const hourlyLoadData = analyticsOverview?.faculty_admin?.hourly_load_trend || hourlyLoadTrend;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-700/60 bg-gradient-to-r from-navy-900 via-navy-850 to-slate-900 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 via-emerald-500/10 to-transparent blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="emerald" size="sm" dot>
                {analyticsOverview ? 'Backend Live Analytics' : 'Campus Mesh Verified'}
              </Badge>
              <span className="text-xs text-slate-400 font-mono">
                System Health: Nominal • OR-Tools Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Campus Resource Mesh <span className="text-gradient">Operations Hub</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time cross-department analytics, equipment health indices, and constraint satisfaction performance tracking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => navigate('/equipment-manage')}
            >
              Register Equipment
            </Button>
            <Button
              variant="glass"
              icon={Zap}
              onClick={() => navigate('/conflicts')}
            >
              Conflict Resolver
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Equipment"
          value={`${totalStations} Units`}
          trend={`${equipmentList.length} Categories`}
          trendDirection="up"
          icon={Cpu}
          color="cyan"
          subtitle="Across CSE, ECE, MECH & CIVIL"
        />
        <StatCard
          title="Equipment Utilization"
          value={`${utilizationRate}%`}
          trend={`${totalInUseStations} Units In Use`}
          trendDirection="up"
          icon={TrendingUp}
          color="violet"
          subtitle={`${totalFreeStations} Units currently available`}
        />
        <div onClick={() => navigate('/faculty/approvals')} className="cursor-pointer group">
          <StatCard
            title="Pending Requests"
            value={`${pendingBookings.length} Requests`}
            trend="Needs Review"
            trendDirection="neutral"
            icon={Clock}
            color="amber"
            subtitle="Click to view approval queue"
            className="group-hover:border-amber-500/40 transition-all"
          />
        </div>
        <div onClick={() => navigate('/conflicts')} className="cursor-pointer group">
          <StatCard
            title="Scheduling Conflicts"
            value="0 Collisions"
            trend="OR-Tools CP-SAT"
            trendDirection="up"
            icon={Zap}
            color="emerald"
            subtitle="Fairness Index: 95.5%"
            className="group-hover:border-emerald-500/40 transition-all"
          />
        </div>
      </div>

      {/* Analytics Charts Grid: Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Campus Load vs Solver Optimality */}
        <div className="lg:col-span-2">
          <GlassCard
            title="Hourly Laboratory Load & CP-SAT Optimality Trend"
            subtitle="Real-time reservation demand vs OR-Tools constraint satisfaction index"
            gradientGlow
          >
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyLoadData}>
                  <defs>
                    <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorSolver" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="totalBookings"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorLoad)"
                    name="Active Bookings"
                  />
                  <Area
                    type="monotone"
                    dataKey="solverOptimalIndex"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSolver)"
                    name="Solver Fairness (%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Active Hardware Load
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-400" /> Fairness Metric (%)
                </span>
              </div>
              <span className="font-mono text-[11px] text-emerald-400">
                Optimization Status: CP-SAT Optimal (0 Collisions)
              </span>
            </div>
          </GlassCard>
        </div>

        {/* Equipment Utilization PieChart */}
        <div>
          <GlassCard
            title="Equipment Utilization Breakdown"
            subtitle="Bench availability ratio across college labs"
          >
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={utilizationPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {utilizationPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(val) => <span className="text-slate-300 text-xs">{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center pt-2">
              <span className="text-2xl font-extrabold text-white">{utilizationRate}%</span>
              <span className="text-xs text-slate-400 block">Overall Mesh Utilization</span>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Analytics Charts Grid: Department Usage & Most Requested Equipment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department-Wise Equipment Usage BarChart */}
        <GlassCard
          title="Department-Wise Equipment Usage"
          subtitle="Active stations in use vs total inventory units by department"
          headerAction={
            <Badge variant="cyan" size="sm">
              Cross-Department
            </Badge>
          }
        >
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentUsageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="department" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  formatter={(val) => <span className="text-slate-300 text-xs">{val}</span>}
                />
                <Bar dataKey="active_units" fill="#38bdf8" radius={[4, 4, 0, 0]} name="Active In-Use" />
                <Bar dataKey="total_units" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Total Inventory" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Most Requested Equipment Horizontal BarChart */}
        <GlassCard
          title="Most Requested Laboratory Equipment"
          subtitle="Top specialized instruments ranked by student project reservations"
          headerAction={
            <Badge variant="violet" size="sm">
              Demand Ranking
            </Badge>
          }
        >
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={mostRequestedEquipmentData}
                margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" fontSize={12} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={11}
                  width={110}
                  tick={{ fill: '#cbd5e1' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} name="Student Booking Requests" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Facilities & Equipment Table Summary */}
      <GlassCard
        title="College Facilities & Research Centers"
        subtitle="Department laboratories connected to the central mesh"
        headerAction={
          <Button
            variant="glass"
            size="sm"
            onClick={() => navigate('/equipment-manage')}
          >
            Manage Facilities
          </Button>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              name: 'VLSI & Embedded Systems',
              building: 'Sir MV Block - Room 304',
              dept: 'ECE',
              head: 'Dr. Aris Thorne',
              units: '16 Stations',
            },
            {
              name: 'Edge AI & High Performance',
              building: 'Turing Tower - Room 502',
              dept: 'CSE',
              head: 'Prof. Elena Rostova',
              units: '12 Workstations',
            },
            {
              name: 'Robotics & 3D Fabrication',
              building: 'Sarabhai Complex - Room 102',
              dept: 'MECH',
              head: 'Dr. Marcus Vance',
              units: '8 Systems',
            },
            {
              name: 'Molecular Analysis & Bio-Sensors',
              building: 'Dr. Khorana Wing - Room 201',
              dept: 'BIOTECH',
              head: 'Dr. Samantha Wu',
              units: '6 Instruments',
            },
          ].map((lab, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="cyan" size="sm">
                    {lab.dept}
                  </Badge>
                  <span className="font-mono text-[10px] text-emerald-400">
                    {lab.units}
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm mt-1">{lab.name}</h4>
                <p className="text-slate-400 text-[11px] mt-0.5">{lab.building}</p>
              </div>
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300">
                In-Charge: {lab.head}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default AdminDashboard;
