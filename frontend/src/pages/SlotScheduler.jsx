import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  AlertTriangle,
  Sparkles,
  CheckCircle,
  Cpu,
  ArrowRight,
  ShieldAlert,
  Zap
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import Button from '../components/Button';

export const SlotScheduler = () => {
  const [selectedDate, setSelectedDate] = useState('2026-11-24');
  const [activeConflict, setActiveConflict] = useState(true);
  const [resolving, setResolving] = useState(false);
  const [resolutionResult, setResolutionResult] = useState(null);

  const handleRunOptimizer = () => {
    setResolving(true);
    setTimeout(() => {
      setResolving(false);
      setActiveConflict(false);
      setResolutionResult({
        algorithm: 'OR-Tools CP-SAT (Constraint Programming - Satisfiability)',
        status: 'Optimal Feasible Schedule Found',
        executionTime: '38ms',
        fairnessMetric: '98.5%',
        allocations: [
          {
            team: 'Team A (Capstone Lead - ECE)',
            equipment: 'Xilinx ZCU102 FPGA Kit #1',
            assignedSlot: '02:00 PM - 05:00 PM',
            reason: 'Critical Final Capstone Milestone deadline in 48 hours (Priority: Tier-1)',
          },
          {
            team: 'Team B (Mini-Project - CSE)',
            equipment: 'Xilinx ZCU102 FPGA Kit #2 (Re-routed to Lab MV-302)',
            assignedSlot: '02:00 PM - 05:00 PM',
            reason: 'Identical FPGA kit discovered in adjacent lab. Zero schedule slippage.',
          },
        ],
      });
    }, 1200);
  };

  const scheduleSlots = [
    {
      time: '09:00 AM - 11:00 AM',
      equipment: 'NVIDIA DGX Station A100',
      team: 'Deep Vision Lab',
      project: 'Transformer Pre-training',
      status: 'confirmed',
      conflict: false,
    },
    {
      time: '11:30 AM - 01:30 PM',
      equipment: 'Formlabs 3D Printer #1',
      team: 'Robotics Guild',
      project: 'Soft Robotic Gripper',
      status: 'confirmed',
      conflict: false,
    },
    {
      time: '02:00 PM - 05:00 PM',
      equipment: 'Xilinx ZCU102 UltraScale+',
      team: 'Team Alpha vs Team Beta',
      project: 'Contention: 2 Teams requested sole FPGA station',
      status: activeConflict ? 'conflict' : 'resolved',
      conflict: activeConflict,
    },
    {
      time: '05:30 PM - 07:30 PM',
      equipment: 'Keysight 1GHz Oscilloscope',
      team: 'RF Communication Team',
      project: 'Antenna Impedance Match',
      status: 'confirmed',
      conflict: false,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Intelligent <span className="text-gradient">Slot Scheduler</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time conflict detection and fair multi-objective resource allocation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3.5 py-2 text-xs rounded-xl bg-slate-900/80 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          />
          <Button
            variant="primary"
            size="sm"
            icon={Zap}
            isLoading={resolving}
            onClick={handleRunOptimizer}
          >
            Run CP-SAT Solver
          </Button>
        </div>
      </div>

      {/* Conflict Alert Banner if contention exists */}
      {activeConflict && (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-950/20 backdrop-blur-xl p-5 shadow-lg shadow-amber-950/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">
                  1 Scheduling Contention Detected for Today
                </h4>
                <Badge variant="amber" size="sm">
                  High Overlap
                </Badge>
              </div>
              <p className="text-xs text-amber-200/80 mt-1 leading-relaxed">
                Both Team Alpha (ECE Capstone) and Team Beta (CSE Mini-Project) requested the same <strong>Xilinx ZCU102 FPGA</strong> during 02:00 PM – 05:00 PM.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={Sparkles}
            isLoading={resolving}
            onClick={handleRunOptimizer}
            className="shrink-0"
          >
            Resolve with AI & Solver
          </Button>
        </div>
      )}

      {/* Solver Resolution Card */}
      {resolutionResult && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 backdrop-blur-xl p-6 shadow-glow-blue/10 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-emerald-500/20 gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {resolutionResult.status}
                </h4>
                <p className="text-xs text-slate-400 font-mono">
                  Engine: {resolutionResult.algorithm} • Solved in {resolutionResult.executionTime}
                </p>
              </div>
            </div>
            <Badge variant="emerald" size="md">
              Fairness: {resolutionResult.fairnessMetric}
            </Badge>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {resolutionResult.allocations.map((alloc, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-400">{alloc.team}</span>
                  <Badge variant="cyan" size="sm">
                    {alloc.assignedSlot}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-white font-medium">
                  <Cpu className="w-4 h-4 text-violet-400" />
                  <span>{alloc.equipment}</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  <strong>Constraint Factor:</strong> {alloc.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Day Schedule Slots Timeline */}
      <GlassCard title={`Equipment Schedule Timeline (${selectedDate})`}>
        <div className="space-y-3">
          {scheduleSlots.map((slot, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                slot.conflict
                  ? 'border-amber-500/50 bg-amber-950/20'
                  : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs shrink-0 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{slot.time}</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    {slot.equipment}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {slot.team} • <span className="text-slate-300">{slot.project}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  variant={
                    slot.conflict
                      ? 'amber'
                      : slot.status === 'resolved'
                      ? 'emerald'
                      : 'cyan'
                  }
                  size="sm"
                  dot
                >
                  {slot.conflict
                    ? 'Contention Detected'
                    : slot.status === 'resolved'
                    ? 'OR-Tools Optimized'
                    : 'Confirmed Allocation'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default SlotScheduler;
