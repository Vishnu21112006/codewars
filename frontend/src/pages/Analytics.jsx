import React from 'react';
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
  LineChart,
  Line,
  Legend
} from 'recharts';
import { BarChart3, TrendingUp, Cpu, Users, Award, ShieldCheck } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';

const departmentBreakdown = [
  { name: 'ECE (Embedded/VLSI)', value: 18, color: '#38bdf8' },
  { name: 'CSE (AI/Cloud)', value: 14, color: '#8b5cf6' },
  { name: 'Mech (3D/Robotics)', value: 10, color: '#10b981' },
  { name: 'Biotech (Bio-Sensors)', value: 6, color: '#f59e0b' },
];

const weeklyEfficiencyData = [
  { day: 'Mon', manualCollisions: 6, solverFairness: 95, hoursSaved: 12 },
  { day: 'Tue', manualCollisions: 8, solverFairness: 97, hoursSaved: 16 },
  { day: 'Wed', manualCollisions: 11, solverFairness: 94, hoursSaved: 22 },
  { day: 'Thu', manualCollisions: 9, solverFairness: 98, hoursSaved: 18 },
  { day: 'Fri', manualCollisions: 14, solverFairness: 99, hoursSaved: 28 },
  { day: 'Sat', manualCollisions: 4, solverFairness: 96, hoursSaved: 8 },
];

export const Analytics = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Resource <span className="text-gradient">Utilization & Optimization</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Performance metrics powered by Google OR-Tools CP-SAT and real-time laboratory telemetry.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Overall Lab Utilization"
          value="84.6%"
          trend="+18% YoY"
          trendDirection="up"
          icon={TrendingUp}
          color="cyan"
          subtitle="Idle capacity reduced by 62%"
        />
        <StatCard
          title="Fair Allocation Index"
          value="98.2%"
          trend="OR-Tools"
          trendDirection="up"
          icon={ShieldCheck}
          color="violet"
          subtitle="Priority-weighted fairness metric"
        />
        <StatCard
          title="Student Hours Saved"
          value="104 hrs"
          trend="Per Week"
          trendDirection="up"
          icon={Award}
          color="emerald"
          subtitle="Zero manual lab chasing"
        />
        <StatCard
          title="Cross-Dept Collaborations"
          value="34 Projects"
          trend="Interdisciplinary"
          trendDirection="up"
          icon={Users}
          color="amber"
          subtitle="Bridging ECE, CSE & Mech"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Efficiency & Conflict Resolution */}
        <GlassCard
          title="Manual Conflicts vs Solver Optimization"
          subtitle="Impact of constraint satisfaction modeling on booking fairness"
        >
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyEfficiencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="solverFairness"
                  name="Solver Fairness (%)"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="hoursSaved"
                  name="Hours Saved per Day"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Equipment Distribution by Department */}
        <GlassCard
          title="Department Resource Share"
          subtitle="Distribution of specialized hardware stations"
        >
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {departmentBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
            {departmentBreakdown.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-300 truncate">{item.name}</span>
                <span className="font-semibold text-white ml-auto">
                  {item.value} units
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Analytics;
