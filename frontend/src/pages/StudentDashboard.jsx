import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu,
  CalendarCheck2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  AlertCircle,
  ExternalLink,
  QrCode,
  FolderGit2,
  TrendingUp,
  Activity,
  Layers,
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
  Legend,
} from 'recharts';
import { useLabLink } from '../context/LabLinkContext';
import { analyticsApi } from '../api/client';
import StatCard from '../components/StatCard';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import Button from '../components/Button';

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, equipmentList, bookings, projects } = useLabLink();

  // Filter bookings for student
  const studentBookings = bookings.filter(
    (b) => b.studentId === currentUser.id || b.studentEmail === currentUser.email
  );

  const activeReservations = studentBookings.filter((b) => b.status === 'approved');
  const pendingRequests = studentBookings.filter((b) => b.status === 'pending');
  const totalAvailableEquipment = equipmentList.reduce(
    (acc, item) => acc + (item.status === 'available' ? item.availableUnits : 0),
    0
  );

  // Recommended Resources based on user's department
  const recommendedEquipment = equipmentList.slice(0, 3);

  const [analyticsOverview, setAnalyticsOverview] = useState(null);

  useEffect(() => {
    analyticsApi.getOverview({ student_id: currentUser.id })
      .then((res) => {
        if (res.data) setAnalyticsOverview(res.data);
      })
      .catch((err) => {
        console.warn('Analytics API unavailable:', err.message);
      });
  }, [currentUser]);

  const milestonesData = projects.map((p) => ({
    name: p.title.length > 18 ? p.title.slice(0, 18) + '...' : p.title,
    progress: p.progress || 65,
    urgency: p.priority === 'capstone_critical' ? 95 : p.priority === 'high' ? 80 : 55,
  }));

  const bookingDistributionData = [
    { name: 'Approved Passes', value: Math.max(activeReservations.length, 1), color: '#10b981' },
    { name: 'Pending Review', value: Math.max(pendingRequests.length, 1), color: '#f59e0b' },
    { name: 'Completed Sessions', value: Math.max(studentBookings.filter(b => b.status === 'completed').length, 1), color: '#38bdf8' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Student Profile Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-700/60 bg-gradient-to-r from-navy-900 via-navy-850 to-slate-900 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 via-violet-500/10 to-transparent blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="cyan" size="sm">
                Department of {currentUser.department || 'Engineering'}
              </Badge>
              <span className="text-xs text-slate-400 font-mono">
                {currentUser.academicYear || 'Undergraduate Research'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-gradient">{currentUser.name}</span>!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Your active research capstone: <strong>{currentUser.activeProject || 'Multi-disciplinary Capstone'}</strong>.
              Discover specialized lab hardware or ask the AI matchmaker for conflict-free slot recommendations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              icon={Sparkles}
              onClick={() => navigate('/ai-assistant')}
            >
              Ask AI Matchmaker
            </Button>
            <Button
              variant="glass"
              icon={Cpu}
              onClick={() => navigate('/equipment')}
            >
              Discover Equipment
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Available Equipment"
          value={`${totalAvailableEquipment} Units`}
          trend="4 Campus Labs"
          trendDirection="up"
          icon={Cpu}
          color="cyan"
          subtitle="Ready for immediate reservation"
        />
        <StatCard
          title="Active Reservations"
          value={`${activeReservations.length} Slots`}
          trend="Faculty Cleared"
          trendDirection="up"
          icon={CalendarCheck2}
          color="emerald"
          subtitle="Passcodes generated for lab entry"
        />
        <StatCard
          title="Pending Requests"
          value={`${pendingRequests.length} In Review`}
          trend="Under Faculty Queue"
          trendDirection="neutral"
          icon={Clock}
          color="amber"
          subtitle="Avg mentor turnaround: 3 hrs"
        />
        <StatCard
          title="My Active Projects"
          value={`${projects.length} Projects`}
          trend="OR-Tools Optimized"
          trendDirection="up"
          icon={FolderGit2}
          color="violet"
          subtitle="Deadline priority tracking enabled"
        />
      </div>

      {/* Student Recharts Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Milestone Completion & Urgency BarChart */}
        <div className="lg:col-span-2">
          <GlassCard
            title="Project Milestone Progress & Priority Urgency"
            subtitle="Real-time completion percentage vs deadline urgency tracking"
            headerAction={
              <Badge variant="cyan" size="sm">
                Live Data
              </Badge>
            }
          >
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={milestonesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="progress" fill="#38bdf8" radius={[4, 4, 0, 0]} name="Progress (%)" />
                  <Bar dataKey="urgency" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Deadline Urgency Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" /> Milestone Progress
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-violet-500" /> AI Urgency Metric
              </span>
            </div>
          </GlassCard>
        </div>

        {/* Booking Distribution PieChart */}
        <div>
          <GlassCard
            title="Reservation Distribution"
            subtitle="Active passes vs pending faculty review"
          >
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {bookingDistributionData.map((entry, index) => (
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
          </GlassCard>
        </div>
      </div>

      {/* Main Grid: Upcoming Bookings + Recommended Hardware */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Upcoming Bookings & Reservations */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard
            title="My Upcoming Bookings & Laboratory Slots"
            subtitle="Verified passes and pending slot approvals for your project milestones"
            headerAction={
              <Button
                variant="glass"
                size="sm"
                onClick={() => navigate('/my-reservations')}
              >
                View Passcodes
              </Button>
            }
          >
            {studentBookings.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <p className="text-sm">No reservations yet.</p>
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-3"
                  onClick={() => navigate('/equipment')}
                >
                  Book Your First Equipment Slot
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {studentBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 hover:border-slate-700/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 shrink-0">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">
                            {b.equipmentName}
                          </h4>
                          <Badge variant="cyan" size="sm">
                            {b.department}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {b.lab}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono text-slate-300">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-violet-400" />
                            {b.date} • {b.timeSlot}
                          </span>
                          {b.passCode && b.status === 'approved' && (
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                              <QrCode className="w-3.5 h-3.5" />
                              Pass: {b.passCode}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Badge
                        variant={
                          b.status === 'approved'
                            ? 'emerald'
                            : b.status === 'pending'
                            ? 'amber'
                            : 'slate'
                        }
                        size="md"
                        dot
                        pulsing={b.status === 'pending'}
                      >
                        {b.status === 'approved'
                          ? 'Approved'
                          : b.status === 'pending'
                          ? 'Awaiting Faculty'
                          : b.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Recent Activity Log */}
          <GlassCard
            title="Recent Activity"
            subtitle="Mesh timeline of your slot requests and lab clearances"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shadow-glow-blue" />
                <div className="flex-1">
                  <p className="text-white font-medium">
                    Automated conflict resolution executed by <strong>OR-Tools CP-SAT</strong>
                  </p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Your reservation for Xilinx ZCU102 prioritized over mini-project submission (Score: 0.94).
                  </p>
                  <span className="text-[10px] text-slate-500 font-mono">Today, 11:20 AM</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shadow-glow-blue" />
                <div className="flex-1">
                  <p className="text-white font-medium">
                    Faculty Clearance Granted by <strong>Dr. Aris Thorne</strong>
                  </p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Passcode generated for VLSI Lab MV-304 entry on Nov 24.
                  </p>
                  <span className="text-[10px] text-slate-500 font-mono">Yesterday, 04:35 PM</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-violet-400 mt-1.5 shadow-glow-violet" />
                <div className="flex-1">
                  <p className="text-white font-medium">
                    Project Milestone Registered: <strong>Autonomous Quadcopter</strong>
                  </p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Hardware dependencies mapped to ECE & CSE inventory.
                  </p>
                  <span className="text-[10px] text-slate-500 font-mono">Nov 21, 02:15 PM</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Col: Recommended Resources based on Project */}
        <div className="space-y-6">
          <GlassCard
            title="Recommended for Your Project"
            subtitle="AI suggested specialized kits matching your milestone"
            gradientGlow
          >
            <div className="space-y-4">
              {recommendedEquipment.map((eq) => (
                <div
                  key={eq.id}
                  className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-slate-700 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="cyan" size="sm">
                      {eq.department}
                    </Badge>
                    <Badge
                      variant={eq.availableUnits > 0 ? 'emerald' : 'rose'}
                      size="sm"
                    >
                      {eq.availableUnits} Available
                    </Badge>
                  </div>
                  <h5 className="text-xs font-bold text-white line-clamp-1">
                    {eq.name}
                  </h5>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {eq.lab}
                  </p>
                  <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                    <span className="text-[10px] text-violet-300 font-mono">
                      {eq.category}
                    </span>
                    <Button
                      variant="glass"
                      size="sm"
                      className="text-[11px] py-1 px-2.5"
                      onClick={() => navigate('/equipment')}
                    >
                      Reserve
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate('/equipment')}
            >
              Explore Full Catalog
            </Button>
          </GlassCard>

          {/* Quick Help Box */}
          <div className="p-4 rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-950/20 to-navy-900/40 backdrop-blur-xl space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-bold text-white">Need advice on gear?</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Describe your experiment requirements in conversational natural language, and Gemini will discover cross-department resources.
            </p>
            <Button
              variant="primary"
              size="sm"
              className="w-full text-xs mt-2"
              onClick={() => navigate('/ai-assistant')}
            >
              Launch AI Assistant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
