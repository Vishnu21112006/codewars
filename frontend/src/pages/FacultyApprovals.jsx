import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  User,
  Cpu,
  Calendar,
  AlertCircle,
  Send
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';

const initialRequests = [
  {
    id: 'REQ-401',
    studentName: 'Aarav Patel',
    department: 'ECE',
    year: '4th Year (Capstone Lead)',
    projectName: 'Autonomous Quadcopter Flight Controller with Low-Latency Telemetry',
    equipment: 'Xilinx Zynq UltraScale+ MPSoC ZCU102',
    lab: 'VLSI & Embedded Systems Research Lab (MV-304)',
    requestedSlot: 'Nov 25, 2026 • 02:00 PM - 05:00 PM',
    justification:
      'We have our final phase-1 capstone demonstration in 48 hours. We must test the hardware-accelerated sensor fusion IP core on the FPGA with real IMU data.',
    aiUrgency: 'High (0.92)',
    aiSummary:
      'Critical milestone dependency. The team has completed all pre-requisite simulation testbenches.',
    status: 'pending',
  },
  {
    id: 'REQ-402',
    studentName: 'Sneha Reddy',
    department: 'CSE',
    year: '3rd Year (Research Intern)',
    projectName: 'High-Throughput Vision-Language Model Quantization',
    equipment: 'NVIDIA DGX Station A100 Workstation (4x 80GB)',
    lab: 'Edge AI & Accelerated Computing Lab (TT-502)',
    requestedSlot: 'Nov 26, 2026 • 10:00 AM - 02:00 PM',
    justification:
      'Need multi-GPU distributed tensor parallelism for 4-bit AWQ quantization benchmark before NeurIPS workshop submission.',
    aiUrgency: 'High (0.87)',
    aiSummary:
      'Paper submission deadline approaching. Requires substantial VRAM memory bandwidth.',
    status: 'pending',
  },
  {
    id: 'REQ-403',
    studentName: 'Rohan Sharma',
    department: 'MECH',
    year: '3rd Year (B.Tech)',
    projectName: 'Underactuated Robotic Gripper for Agriculture',
    equipment: 'Formlabs Form 3+ SLA Industrial 3D Printer',
    lab: 'Autonomous Robotics & 3D Fabrication Studio (VSC-102)',
    requestedSlot: 'Nov 27, 2026 • 01:00 PM - 05:00 PM',
    justification:
      'Need to 3D print flexible finger phalanges using Tough 2000 resin for tensile grip testing.',
    aiUrgency: 'Standard (0.64)',
    aiSummary:
      'Fabrication request for prototype iteration. Standard turnaround feasible.',
    status: 'pending',
  },
];

export const FacultyApprovals = () => {
  const [requests, setRequests] = useState(initialRequests);
  const [selectedReq, setSelectedReq] = useState(null);
  const [comment, setComment] = useState('');
  const [actionSuccess, setActionSuccess] = useState(null);

  const handleAction = (id, newStatus) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    setActionSuccess(`Request ${id} marked as ${newStatus.toUpperCase()}`);
    setTimeout(() => {
      setActionSuccess(null);
      setSelectedReq(null);
    }, 1800);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Faculty <span className="text-gradient">Review & Access Approvals</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review student project justifications, AI urgency assessments, and issue lab access permits.
        </p>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Requests List */}
      <div className="space-y-4">
        {requests.map((req) => (
          <GlassCard key={req.id} hoverEffect className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-cyan-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">
                      {req.studentName}
                    </h3>
                    <Badge variant="cyan" size="sm">
                      {req.department}
                    </Badge>
                    <span className="text-xs text-slate-400 font-mono">
                      {req.year}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium mt-0.5">
                    {req.projectName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    req.status === 'approved'
                      ? 'emerald'
                      : req.status === 'rejected'
                      ? 'rose'
                      : 'amber'
                  }
                  size="md"
                  dot
                >
                  {req.status === 'approved'
                    ? 'Access Approved'
                    : req.status === 'rejected'
                    ? 'Access Declined'
                    : 'Awaiting Faculty Review'}
                </Badge>
              </div>
            </div>

            {/* Equipment & Slot detail */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
                <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <span className="text-slate-400 text-[11px] block">
                    Specialized Resource
                  </span>
                  <span className="font-semibold text-white">
                    {req.equipment}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
                <Calendar className="w-4 h-4 text-violet-400 shrink-0" />
                <div>
                  <span className="text-slate-400 text-[11px] block">
                    Target Reservation Slot
                  </span>
                  <span className="font-semibold text-white">
                    {req.requestedSlot}
                  </span>
                </div>
              </div>
            </div>

            {/* Justification & GenAI Urgency Digest */}
            <div className="space-y-2">
              <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <strong className="text-slate-400 block mb-1">
                  Student Justification:
                </strong>
                "{req.justification}"
              </div>

              <div className="p-3 rounded-xl bg-violet-950/20 border border-violet-500/30 text-xs text-violet-200 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-violet-300">
                    GenAI Priority Assessment ({req.aiUrgency}):
                  </strong>{' '}
                  {req.aiSummary}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            {req.status === 'pending' && (
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <Button
                  variant="danger"
                  size="sm"
                  icon={XCircle}
                  onClick={() => handleAction(req.id, 'rejected')}
                >
                  Decline Access
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={CheckCircle}
                  onClick={() => handleAction(req.id, 'approved')}
                >
                  Approve with Lab Clearance
                </Button>
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default FacultyApprovals;
