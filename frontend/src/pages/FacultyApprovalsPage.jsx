import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Send,
  MessageSquare,
  ShieldCheck,
  Filter,
  Zap,
} from 'lucide-react';
import { useLabLink } from '../context/LabLinkContext';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';

export const FacultyApprovalsPage = () => {
  const navigate = useNavigate();
  const { bookings, approveBooking, rejectBooking, equipmentList } = useLabLink();

  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'pending' | 'approved' | 'rejected'
  const [selectedBookingForAction, setSelectedBookingForAction] = useState(null);
  const [actionType, setActionType] = useState('approve'); // 'approve' | 'reject' | 'reschedule'
  const [facultyComment, setFacultyComment] = useState('');
  const [notification, setNotification] = useState('');
  const [isErrorNotification, setIsErrorNotification] = useState(false);

  const filteredBookings = bookings.filter((b) => {
    if (activeFilter === 'ALL') return true;
    return b.status === activeFilter;
  });

  const handleOpenActionModal = (booking, type) => {
    setSelectedBookingForAction(booking);
    setActionType(type);
    setFacultyComment(
      type === 'approve'
        ? 'Verified project milestone. ESD & laboratory handling clearance approved.'
        : type === 'reject'
        ? 'Prerequisite simulation testbenches must be submitted before physical hardware access.'
        : 'Please select an alternate evening window to prevent capstone contention.'
    );
  };

  const handleExecuteAction = async (e) => {
    e.preventDefault();
    if (!selectedBookingForAction) return;

    if (actionType === 'approve') {
      const res = await approveBooking(selectedBookingForAction.id, {
        comments: facultyComment,
        safetyClearance: true,
      });
      if (res && res.error) {
        setIsErrorNotification(true);
        setNotification(`Error: ${res.error}`);
        return;
      }
      setIsErrorNotification(false);
      setNotification(`Safety clearance & digital pass issued for ${selectedBookingForAction.id}!`);
    } else if (actionType === 'reject') {
      await rejectBooking(selectedBookingForAction.id, {
        comments: facultyComment,
      });
      setIsErrorNotification(false);
      setNotification(`Request ${selectedBookingForAction.id} declined with explanatory feedback.`);
    }

    setSelectedBookingForAction(null);
    setTimeout(() => setNotification(''), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Faculty <span className="text-gradient-purple">Approval & Review Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Evaluate project justifications, assess GenAI urgency rankings, and grant certified digital access credentials.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          {[
            { key: 'ALL', label: 'All Requests' },
            { key: 'pending', label: 'Pending Review' },
            { key: 'approved', label: 'Approved' },
            { key: 'rejected', label: 'Declined' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeFilter === tab.key
                  ? 'bg-violet-600/30 text-violet-300 border border-violet-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {notification && (
        <div className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
          isErrorNotification
            ? 'border-rose-500/40 bg-rose-950/40 text-rose-300'
            : 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300'
        }`}>
          {isErrorNotification ? <AlertCircle className="w-4 h-4 text-rose-400" /> : <CheckCircle className="w-4 h-4 text-emerald-400" />}
          <span>{notification}</span>
        </div>
      )}

      {/* Requests List */}
      {filteredBookings.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-12 text-center text-slate-400 space-y-3">
          <ClipboardCheck className="w-10 h-10 mx-auto text-slate-600" />
          <h3 className="text-sm font-semibold text-white">No requests in this filter</h3>
          <p className="text-xs text-slate-500">
            Switch to another filter tab to view all campus booking submissions.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((req) => {
            const eq = equipmentList.find((e) => e.id === req.equipmentId);
            const freeUnits = eq ? eq.availableUnits : 1;
            const totalUnits = eq ? eq.totalUnits : 1;
            const isContended = freeUnits <= 0;

            return (
              <GlassCard key={req.id} hoverEffect className="space-y-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-cyan-400 shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-cyan-400 font-semibold text-xs">
                          {req.id}
                        </span>
                        <h3 className="text-sm font-bold text-white">
                          {req.studentName}
                        </h3>
                        <Badge variant="cyan" size="sm">
                          {req.department}
                        </Badge>
                        <span className="text-xs text-slate-400 font-mono">
                          {req.studentEmail}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-xs text-slate-200 font-medium">
                          {req.projectName}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">• Milestone Due:</span>
                        <Badge variant="amber" size="sm">
                          {req.projectDeadline || '2026-11-28'}
                        </Badge>
                      </div>
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
                        : 'Pending Faculty Review'}
                    </Badge>
                  </div>
                </div>

                {/* Hardware & Slot detail */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3 truncate">
                      <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div>
                        <span className="text-slate-400 text-[11px] block">Target Equipment</span>
                        <span className="font-semibold text-white truncate block">{req.equipmentName}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-slate-400 text-[10px] block font-mono">Bench Status</span>
                      <Badge variant={freeUnits > 0 ? 'emerald' : 'rose'} size="sm">
                        {freeUnits} / {totalUnits} Free
                      </Badge>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-violet-400 shrink-0" />
                    <div>
                      <span className="text-slate-400 text-[11px] block">
                        Requested Reservation Window
                      </span>
                      <span className="font-semibold text-white font-mono">
                        {req.date} • {req.timeSlot}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Scheduling Contention Warning if zero free units */}
                {isContended && req.status === 'pending' && (
                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/40 text-xs text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>
                        <strong>Scheduling Conflict Notice:</strong> 0 units free on bench. Direct approval will trigger capacity collision!
                      </span>
                    </div>
                    <Button
                      variant="glass"
                      size="sm"
                      icon={Zap}
                      onClick={() => navigate('/conflicts')}
                      className="text-amber-300 hover:text-white"
                    >
                      Resolve with CP-SAT
                    </Button>
                  </div>
                )}

              {/* Justification & GenAI Urgency Digest */}
              <div className="space-y-2">
                <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <strong className="text-slate-400 block mb-1">
                    Student Project Justification:
                  </strong>
                  "{req.justification}"
                </div>

                <div className="p-3 rounded-xl bg-violet-950/20 border border-violet-500/30 text-xs text-violet-200 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <strong className="text-violet-300">
                        GenAI Feasibility & Urgency Score:
                      </strong>
                      <Badge variant="violet" size="sm">
                        {req.aiUrgencyScore || 0.85}
                      </Badge>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-300">
                      {req.aiRecommendation || 'High priority alignment with research milestone. Zero safety violation records.'}
                    </p>
                  </div>
                </div>

                {req.facultyNote && (
                  <div className="text-xs p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>Mentor Feedback:</strong> {req.facultyNote}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              {req.status === 'pending' && (
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <Button
                    variant="danger"
                    size="sm"
                    icon={XCircle}
                    onClick={() => handleOpenActionModal(req, 'reject')}
                  >
                    Decline Request
                  </Button>
                  <Button
                    variant="glass"
                    size="sm"
                    onClick={() => handleOpenActionModal(req, 'reschedule')}
                  >
                    Suggest Alternative Slot
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={CheckCircle}
                    onClick={() => handleOpenActionModal(req, 'approve')}
                  >
                    Approve with Lab Clearance
                  </Button>
                </div>
              )}
            </GlassCard>
            );
          })}
        </div>
      )}

      {/* Action Execution Modal */}
      {selectedBookingForAction && (
        <Modal
          isOpen={!!selectedBookingForAction}
          onClose={() => setSelectedBookingForAction(null)}
          title={
            actionType === 'approve'
              ? 'Issue Laboratory Access Clearance'
              : actionType === 'reject'
              ? 'Decline Access Request'
              : 'Propose Slot Reschedule'
          }
          subtitle={`Student: ${selectedBookingForAction.studentName} • ${selectedBookingForAction.equipmentName}`}
        >
          <form onSubmit={handleExecuteAction} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Faculty Review Note / Safety Directives:
              </label>
              <textarea
                rows={3}
                value={facultyComment}
                onChange={(e) => setFacultyComment(e.target.value)}
                className="w-full rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-slate-100 p-3 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                required
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
              <span className="text-slate-400">Target Station:</span>
              <span className="font-semibold text-white">{selectedBookingForAction.equipmentName}</span>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <Button variant="glass" type="button" onClick={() => setSelectedBookingForAction(null)}>
                Cancel
              </Button>
              <Button
                variant={actionType === 'approve' ? 'primary' : actionType === 'reject' ? 'danger' : 'secondary'}
                type="submit"
                icon={Send}
              >
                Confirm Decision
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default FacultyApprovalsPage;
