import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Cpu,
  Building2,
  CalendarCheck2,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Zap,
  Activity,
  Layers
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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

export const FacultyDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, bookings, equipmentList, updateBookingStatus } = useLabLink();

  const [notification, setNotification] = useState('');
  const [analyticsOverview, setAnalyticsOverview] = useState(null);

  useEffect(() => {
    analyticsApi.getOverview()
      .then((res) => {
        if (res.data) setAnalyticsOverview(res.data);
      })
      .catch((err) => {
        console.warn('Backend analytics API unavailable:', err.message);
      });
  }, [bookings, equipmentList]);

  const departmentUsageData = analyticsOverview?.faculty_admin?.department_usage || [
    { department: 'ECE', active_units: 14, total_units: 16, utilization: 87.5 },
    { department: 'CSE', active_units: 10, total_units: 12, utilization: 83.3 },
    { department: 'MECH', active_units: 7, total_units: 8, utilization: 87.5 },
    { department: 'CIVIL', active_units: 5, total_units: 6, utilization: 83.3 },
  ];

  const mostRequestedData = analyticsOverview?.faculty_admin?.most_requested_equipment || [
    { name: 'Xilinx FPGA', count: 6 },
    { name: 'NVIDIA DGX A100', count: 5 },
    { name: 'Formlabs 3D Printer', count: 4 },
    { name: 'Keysight Scope', count: 4 },
  ];

  const pendingRequests = bookings.filter((b) => b.status === 'pending');
  const approvedBookings = bookings.filter((b) => b.status === 'approved');
  const availableStations = equipmentList.reduce(
    (acc, eq) => acc + (eq.status === 'available' ? eq.availableUnits : 0),
    0
  );

  const handleQuickApprove = (id) => {
    updateBookingStatus(id, 'approved', 'Quick approved via Faculty Portal.');
    setNotification(`Access request ${id} approved with lab clearance!`);
    setTimeout(() => setNotification(''), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Faculty Welcome Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-700/60 bg-gradient-to-r from-navy-900 via-navy-850 to-slate-900 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-violet-500/10 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="violet" size="sm">
                Faculty Portal
              </Badge>
              <span className="text-xs text-slate-400 font-mono">
                {currentUser.title || 'Department of ECE'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Faculty Command: <span className="text-gradient-purple">{currentUser.name}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Review student hardware milestone justifications, verify lab handling clearance, and inspect cross-department resource utilization.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              icon={ClipboardCheck}
              onClick={() => navigate('/faculty/approvals')}
            >
              Review All Requests ({pendingRequests.length})
            </Button>
            <Button
              variant="glass"
              icon={CalendarCheck2}
              onClick={() => navigate('/calendar')}
            >
              Inspect Schedule
            </Button>
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Pending Milestone Requests"
          value={`${pendingRequests.length} Requests`}
          trend="Awaiting Review"
          trendDirection="neutral"
          icon={Clock}
          color="amber"
          subtitle="Highest urgency: Capstone Team (0.94)"
        />
        <StatCard
          title="Approved Lab Bookings"
          value={`${approvedBookings.length} Approved`}
          trend="Safety Cleared"
          trendDirection="up"
          icon={ShieldCheck}
          color="emerald"
          subtitle="Active passes issued to students"
        />
        <StatCard
          title="Available Hardware Units"
          value={`${availableStations} Units`}
          trend="Across 4 Labs"
          trendDirection="up"
          icon={Cpu}
          color="cyan"
          subtitle="Real-time calibration verified"
        />
        <div onClick={() => navigate('/conflicts')} className="cursor-pointer group">
          <StatCard
            title="Scheduling Engine"
            value="OR-Tools"
            trend="Resolve (CP-SAT)"
            trendDirection="up"
            icon={Zap}
            color="violet"
            subtitle="Click to balance competing requests"
            className="group-hover:border-violet-500/50 transition-all"
          />
        </div>
      </div>

      {/* Faculty Recharts Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Usage */}
        <GlassCard
          title="Department-Wise Equipment Utilization"
          subtitle="Real-time active workstations vs total laboratory inventory"
          headerAction={
            <Badge variant="cyan" size="sm">
              Live Mesh
            </Badge>
          }
        >
          <div className="h-60 w-full pt-4">
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
                <Bar dataKey="active_units" fill="#38bdf8" radius={[4, 4, 0, 0]} name="In-Use" />
                <Bar dataKey="total_units" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Total Units" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Most Requested Hardware */}
        <GlassCard
          title="Most Requested Hardware Stations"
          subtitle="Frequency of student reservations across college departments"
          headerAction={
            <Badge variant="violet" size="sm">
              High Contention
            </Badge>
          }
        >
          <div className="h-60 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={mostRequestedData} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} width={90} tick={{ fill: '#cbd5e1' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} name="Requests" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Main Review Section & Scheduling Conflicts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Student Requests (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard
            title="Pending Access Requests"
            subtitle="Student submissions requiring faculty mentor clearance"
            headerAction={
              <Button
                variant="glass"
                size="sm"
                onClick={() => navigate('/faculty/approvals')}
              >
                Approval Center
              </Button>
            }
          >
            {pendingRequests.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
                <p className="text-sm font-semibold text-white">All requests reviewed!</p>
                <p className="text-xs text-slate-500 mt-1">Zero pending access queues.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingRequests.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-slate-700 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-800/80 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-cyan-400 font-semibold text-xs">
                            {b.id}
                          </span>
                          <span className="font-bold text-white text-sm">
                            {b.studentName}
                          </span>
                          <Badge variant="cyan" size="sm">
                            {b.department}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-300 font-medium mt-0.5">
                          {b.projectName}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="violet" size="sm">
                          AI Urgency: {b.aiUrgencyScore}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{b.equipmentName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300 font-mono">
                        <Clock className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                        <span>{b.date} • {b.timeSlot}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 italic bg-slate-900/40 p-2.5 rounded-lg border border-slate-800">
                      "{b.justification}"
                    </p>

                    <div className="pt-2 flex items-center justify-end gap-2">
                      <Button
                        variant="glass"
                        size="sm"
                        onClick={() => navigate('/faculty/approvals')}
                      >
                        Inspect Details
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        icon={CheckCircle2}
                        onClick={() => handleQuickApprove(b.id)}
                      >
                        Approve Clearance
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right Col: Equipment Availability & Conflict Watch */}
        <div className="space-y-6">
          <GlassCard
            title="Station Availability Health"
            subtitle="Department workstation status"
          >
            <div className="space-y-3">
              {equipmentList.slice(0, 4).map((eq) => (
                <div
                  key={eq.id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="truncate max-w-[170px]">
                    <p className="font-bold text-white truncate">{eq.name}</p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {eq.department} • Room {eq.room}
                    </span>
                  </div>
                  <Badge
                    variant={eq.availableUnits > 0 ? 'emerald' : 'rose'}
                    size="sm"
                  >
                    {eq.availableUnits} / {eq.totalUnits} Free
                  </Badge>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4"
              onClick={() => navigate('/equipment-manage')}
            >
              Manage Equipment Roster
            </Button>
          </GlassCard>

          {/* Scheduling Conflicts Box */}
          <GlassCard
            title="Conflict Radar"
            subtitle="Real-time multi-objective collision detection"
          >
            <div className="p-3.5 rounded-xl border border-violet-500/30 bg-violet-950/20 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-violet-300">CP-SAT Fairness Engine</span>
                <Badge variant="violet" size="sm">
                  Active
                </Badge>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Google OR-Tools CP-SAT balances deadline urgency (40%), equipment necessity (25%), historical access fairness (20%), and slot feasibility (15%).
              </p>
              <Button
                variant="primary"
                size="sm"
                className="w-full mt-2"
                icon={Zap}
                onClick={() => navigate('/conflicts')}
              >
                Launch Conflict Resolver
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Approved Laboratory Booking Schedules Table */}
      <GlassCard
        title="Approved Laboratory Booking Schedules"
        subtitle="Active campus equipment allocations with verified safety and mentor clearances"
        headerAction={
          <Button
            variant="glass"
            size="sm"
            icon={CalendarCheck2}
            onClick={() => navigate('/calendar')}
          >
            Open Booking Calendar
          </Button>
        }
      >
        {approvedBookings.length === 0 ? (
          <div className="py-8 text-center text-slate-400">
            <CalendarCheck2 className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p className="text-xs text-slate-400">No approved sessions active at this moment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                  <th className="pb-3 font-semibold">Pass / Booking ID</th>
                  <th className="pb-3 font-semibold">Student & Project</th>
                  <th className="pb-3 font-semibold">Allocated Station</th>
                  <th className="pb-3 font-semibold">Date & Time Slot</th>
                  <th className="pb-3 font-semibold">Clearance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {approvedBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 font-mono text-cyan-400 font-semibold">
                      {b.passCode || b.id}
                    </td>
                    <td className="py-3">
                      <span className="font-bold text-white block">{b.studentName}</span>
                      <span className="text-[11px] text-slate-400 truncate max-w-[220px] block">
                        {b.projectName}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="text-white block font-medium">{b.equipmentName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{b.lab}</span>
                    </td>
                    <td className="py-3 font-mono text-slate-200">
                      <span className="block font-semibold">{b.date}</span>
                      <span className="text-violet-300 text-[11px]">{b.timeSlot}</span>
                    </td>
                    <td className="py-3">
                      <Badge variant="emerald" size="sm" dot>
                        Safety Cleared
                      </Badge>
                      {b.facultyNote && (
                        <span className="text-[10px] text-slate-400 block mt-0.5 truncate max-w-[180px]">
                          "{b.facultyNote}"
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default FacultyDashboard;
