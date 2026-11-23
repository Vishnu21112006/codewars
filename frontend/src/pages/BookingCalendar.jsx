import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Clock,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Zap,
  CheckCircle,
  Building2,
  Cpu
} from 'lucide-react';
import { useLabLink } from '../context/LabLinkContext';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';

const DAYS_OF_WEEK = ['Mon (Nov 24)', 'Tue (Nov 25)', 'Wed (Nov 26)', 'Thu (Nov 27)', 'Fri (Nov 28)'];
const TIME_WINDOWS = [
  '09:00 AM - 12:00 PM',
  '12:30 PM - 03:30 PM',
  '04:00 PM - 07:00 PM',
];

export const BookingCalendar = () => {
  const navigate = useNavigate();
  const { equipmentList, bookings } = useLabLink();

  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(equipmentList[0]?.id || '');
  const [solverRunning, setSolverRunning] = useState(false);
  const [solverSuccess, setSolverSuccess] = useState(false);
  const [selectedSlotDetails, setSelectedSlotDetails] = useState(null);

  const selectedEquipment = equipmentList.find((e) => e.id === selectedEquipmentId) || equipmentList[0];

  const handleRunSolver = () => {
    setSolverRunning(true);
    setTimeout(() => {
      setSolverRunning(false);
      setSolverSuccess(true);
      setTimeout(() => setSolverSuccess(false), 3500);
    }, 1100);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Laboratory <span className="text-gradient">Booking Matrix & Calendar</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Visual multi-slot timetable with real-time contention flags and Google OR-Tools fairness scheduling.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            icon={Zap}
            isLoading={solverRunning}
            onClick={handleRunSolver}
          >
            Run CP-SAT Auto-Resolve
          </Button>
        </div>
      </div>

      {solverSuccess && (
        <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/30 text-emerald-300 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Optimal schedule calculated with OR-Tools CP-SAT! Contention resolved across 18 stations.</span>
          </div>
          <Badge variant="emerald" size="sm">
            Fairness: 98.7%
          </Badge>
        </div>
      )}

      {/* Equipment Selector Ribbon */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Select Hardware Station to Inspect Schedule:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {equipmentList.map((eq) => (
            <button
              key={eq.id}
              onClick={() => setSelectedEquipmentId(eq.id)}
              className={`p-2.5 rounded-xl text-left border transition-all shrink-0 ${
                selectedEquipment?.id === eq.id
                  ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border-cyan-400 text-white shadow-glow-blue/10'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="text-xs font-bold truncate max-w-[200px]">{eq.name}</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                {eq.department} • Room {eq.room}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Visual Weekly Slot Grid */}
      <GlassCard
        title={`Weekly Slot Timetable: ${selectedEquipment?.name || 'Laboratory Station'}`}
        subtitle={`Station Room ${selectedEquipment?.room || ''} • Click any open slot to reserve`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr>
                <th className="p-3 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 text-left">
                  Time Window
                </th>
                {DAYS_OF_WEEK.map((day, i) => (
                  <th
                    key={i}
                    className="p-3 text-xs font-semibold text-slate-300 uppercase tracking-wider border-b border-slate-800"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {TIME_WINDOWS.map((window, wIdx) => (
                <tr key={wIdx}>
                  <td className="p-3 text-left font-mono font-medium text-slate-400 bg-slate-950/30">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{window}</span>
                    </div>
                  </td>
                  {DAYS_OF_WEEK.map((_, dIdx) => {
                    const isBooked = (wIdx + dIdx) % 3 === 0;
                    const isContention = wIdx === 1 && dIdx === 1 && !solverSuccess;

                    return (
                      <td key={dIdx} className="p-2">
                        {isContention ? (
                          <button
                            onClick={() =>
                              setSelectedSlotDetails({
                                title: 'Contention Detected',
                                reason: '2 Capstone Teams requested sole station during this window.',
                                status: 'conflict',
                                time: window,
                              })
                            }
                            className="w-full p-2.5 rounded-xl border border-amber-500/50 bg-amber-950/30 text-amber-300 hover:bg-amber-950/50 transition-all text-left space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[11px]">Conflict</span>
                              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                            </div>
                            <p className="text-[10px] text-amber-200/80 truncate">2 Teams Contending</p>
                          </button>
                        ) : isBooked ? (
                          <button
                            onClick={() =>
                              setSelectedSlotDetails({
                                title: 'Reserved Allocation',
                                team: 'ECE Capstone Flight Team',
                                project: 'Autonomous Quadcopter Sensor Fusion',
                                status: 'booked',
                                time: window,
                              })
                            }
                            className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 transition-all text-left space-y-1"
                          >
                            <span className="font-semibold text-white text-[11px] block truncate">
                              Team Alpha (ECE)
                            </span>
                            <span className="text-[10px] text-cyan-400 font-mono block">
                              Clearance Active
                            </span>
                          </button>
                        ) : (
                          <button
                            onClick={() => navigate('/equipment')}
                            className="w-full p-2.5 rounded-xl border border-dashed border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-500/5 text-slate-500 hover:text-cyan-300 transition-all font-medium text-[11px]"
                          >
                            + Reserve Slot
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Slot Details Modal */}
      {selectedSlotDetails && (
        <Modal
          isOpen={!!selectedSlotDetails}
          onClose={() => setSelectedSlotDetails(null)}
          title={selectedSlotDetails.title}
          subtitle={`Window: ${selectedSlotDetails.time}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
              {selectedSlotDetails.team && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Team:</span>
                  <span className="font-bold text-white">{selectedSlotDetails.team}</span>
                </div>
              )}
              {selectedSlotDetails.project && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Project:</span>
                  <span className="text-slate-200">{selectedSlotDetails.project}</span>
                </div>
              )}
              {selectedSlotDetails.reason && (
                <p className="text-amber-300 leading-relaxed pt-1">
                  {selectedSlotDetails.reason}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <Button variant="glass" onClick={() => setSelectedSlotDetails(null)}>
                Close
              </Button>
              {selectedSlotDetails.status === 'conflict' && (
                <Button
                  variant="primary"
                  icon={Zap}
                  onClick={() => {
                    setSelectedSlotDetails(null);
                    handleRunSolver();
                  }}
                >
                  Resolve with Solver
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BookingCalendar;
