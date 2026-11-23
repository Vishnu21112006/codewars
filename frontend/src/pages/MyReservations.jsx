import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  Clock,
  QrCode,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Cpu,
  Building2,
  Printer,
  ShieldCheck,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useLabLink } from '../context/LabLinkContext';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';

export const MyReservations = () => {
  const navigate = useNavigate();
  const { currentUser, bookings, cancelBooking } = useLabLink();

  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'APPROVED' | 'PENDING' | 'REJECTED' | 'COMPLETED'
  const [selectedPass, setSelectedPass] = useState(null);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [notification, setNotification] = useState('');

  // Filter bookings for current student
  const studentBookings = bookings.filter(
    (b) => b.studentId === currentUser.id || b.studentEmail === currentUser.email
  );

  const filteredBookings = studentBookings.filter((b) => {
    if (activeTab === 'APPROVED') return b.status === 'approved';
    if (activeTab === 'PENDING') return b.status === 'pending';
    if (activeTab === 'REJECTED') return b.status === 'rejected';
    if (activeTab === 'COMPLETED') return b.status === 'completed';
    return true;
  });

  const handleConfirmCancel = async () => {
    if (cancelModalBooking) {
      const res = await cancelBooking(cancelModalBooking.id, 'Student cancelled pending reservation request');
      if (res && res.error) {
        setNotification(`Error: ${res.error}`);
      } else {
        setNotification(`Reservation ${cancelModalBooking.id} successfully cancelled. Station returned to pool.`);
      }
      setCancelModalBooking(null);
      setTimeout(() => setNotification(''), 3500);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My <span className="text-gradient">Reservations & Lab Passes</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access credentials, reservation status, and digital QR clearance for physical lab entry.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Cpu}
          onClick={() => navigate('/equipment')}
        >
          Book Another Station
        </Button>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="p-3.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 text-cyan-200 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-cyan-400" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification('')} className="text-slate-400 hover:text-white text-xs">✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {[
          { key: 'ALL', label: `All (${studentBookings.length})` },
          { key: 'APPROVED', label: `Active Passes (${studentBookings.filter((b) => b.status === 'approved').length})` },
          { key: 'PENDING', label: `Pending Faculty (${studentBookings.filter((b) => b.status === 'pending').length})` },
          { key: 'REJECTED', label: `Declined (${studentBookings.filter((b) => b.status === 'rejected').length})` },
          { key: 'COMPLETED', label: `Completed (${studentBookings.filter((b) => b.status === 'completed').length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeTab === tab.key
                ? 'bg-gradient-to-r from-cyan-500/20 to-violet-600/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-12 text-center text-slate-400 space-y-3">
          <CalendarCheck className="w-10 h-10 mx-auto text-slate-600" />
          <h3 className="text-sm font-semibold text-white">No reservations in this view</h3>
          <p className="text-xs text-slate-500">
            Select another filter tab or reserve specialized equipment from the catalog.
          </p>
          <Button variant="glass" size="sm" onClick={() => navigate('/equipment')}>
            Explore Equipment
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredBookings.map((b) => (
            <GlassCard key={b.id} hoverEffect className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-cyan-400 font-semibold">
                    {b.id}
                  </span>
                  <Badge
                    variant={
                      b.status === 'approved'
                        ? 'emerald'
                        : b.status === 'pending'
                        ? 'amber'
                        : b.status === 'rejected'
                        ? 'rose'
                        : b.status === 'cancelled'
                        ? 'rose'
                        : 'slate'
                    }
                    size="sm"
                    dot
                  >
                    {b.status === 'approved'
                      ? 'Approved & Ready'
                      : b.status === 'pending'
                      ? 'Awaiting Faculty'
                      : b.status === 'rejected'
                      ? 'Declined by Faculty'
                      : b.status === 'cancelled'
                      ? 'Cancelled'
                      : 'Completed'}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-white mb-1">
                  {b.equipmentName}
                </h3>
                <p className="text-xs text-slate-400 mb-4 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                  <span className="truncate">{b.lab}</span>
                </p>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Scheduled Date:</span>
                    <span className="font-semibold text-white">{b.date}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Time Window:</span>
                    <span className="font-mono font-medium text-cyan-300">{b.timeSlot}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Project:</span>
                    <span className="truncate max-w-[200px] text-slate-200">{b.projectName}</span>
                  </div>
                </div>

                {b.facultyNote && (
                  <div className={`mt-3 p-2.5 rounded-lg border text-[11px] ${
                    b.status === 'rejected'
                      ? 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                      : b.status === 'approved'
                      ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300'
                      : 'bg-slate-900/40 border-slate-800 text-slate-300'
                  }`}>
                    <strong>{b.status === 'rejected' ? 'Faculty Decision Reason:' : 'Mentor Note:'}</strong> {b.facultyNote}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                {b.status === 'approved' && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={QrCode}
                      onClick={() => setSelectedPass(b)}
                    >
                      Digital Lab Pass
                    </Button>
                    <span className="text-[10px] text-slate-500 italic">
                      Clearance Issued
                    </span>
                  </>
                )}

                {b.status === 'rejected' && (
                  <Button
                    variant="glass"
                    size="sm"
                    className="text-cyan-400 hover:text-cyan-300"
                    onClick={() => navigate('/equipment')}
                  >
                    Browse Alternative Stations
                  </Button>
                )}

                {b.status === 'pending' && (
                  <>
                    <span className="text-xs text-amber-300/80 font-mono">
                      Under Review by {b.facultyMentor}
                    </span>
                    <Button
                      variant="glass"
                      size="sm"
                      className="text-rose-400 hover:text-rose-300 hover:border-rose-500/40"
                      onClick={() => setCancelModalBooking(b)}
                    >
                      Cancel Request
                    </Button>
                  </>
                )}

                {b.status === 'cancelled' && (
                  <span className="text-xs text-slate-500 font-mono">
                    Slot Released to Pool
                  </span>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Digital Lab Pass QR Modal */}
      {selectedPass && (
        <Modal
          isOpen={!!selectedPass}
          onClose={() => setSelectedPass(null)}
          title="Digital Laboratory Access Clearance Pass"
          subtitle="Present this QR credential or passcode at the lab station entrance"
          maxWidth="max-w-md"
        >
          <div className="space-y-6 text-center">
            {/* Visual QR Card */}
            <div className="p-6 rounded-2xl bg-white text-navy-950 mx-auto w-64 shadow-2xl flex flex-col items-center">
              <div className="w-48 h-48 bg-slate-100 border-2 border-dashed border-slate-400 rounded-xl flex items-center justify-center p-3">
                {/* SVG QR Code Simulation */}
                <div className="grid grid-cols-6 gap-1 w-full h-full p-2 bg-slate-900 rounded-lg">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-sm ${
                        (i * 7 + 3) % 2 === 0 ? 'bg-cyan-400' : (i * 3) % 5 === 0 ? 'bg-violet-400' : 'bg-slate-800'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="font-mono text-xs font-extrabold tracking-widest text-navy-950 mt-3">
                {selectedPass.passCode}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                VALIDATED BY FACULTY CLEARANCE
              </span>
            </div>

            {/* Pass Metadata */}
            <div className="text-left text-xs bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Student Name:</span>
                <span className="font-semibold text-white">{selectedPass.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Station:</span>
                <span className="font-semibold text-cyan-300">{selectedPass.equipmentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Facility Location:</span>
                <span className="text-slate-200">{selectedPass.lab}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Approved Slot:</span>
                <span className="font-mono text-emerald-400">{selectedPass.date} • {selectedPass.timeSlot}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-[11px] text-amber-200 text-left flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Safety Verification:</strong> Wear appropriate PPE. Observe electrostatic grounding and safety interlocks for this workstation.
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
              <Button variant="glass" onClick={() => setSelectedPass(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                icon={Printer}
                onClick={() => {
                  alert(`Digital Pass ${selectedPass.passCode} ready for export.`);
                }}
              >
                Print / Save PDF
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalBooking && (
        <Modal
          isOpen={!!cancelModalBooking}
          onClose={() => setCancelModalBooking(null)}
          title="Cancel Reservation?"
          subtitle="Are you sure you want to release this laboratory workstation slot?"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              Releasing this slot will immediately return <strong>{cancelModalBooking.equipmentName}</strong> to the available inventory pool for other academic teams.
            </p>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <Button variant="glass" onClick={() => setCancelModalBooking(null)}>
                Keep Reservation
              </Button>
              <Button variant="danger" onClick={handleConfirmCancel}>
                Confirm Cancellation
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyReservations;
