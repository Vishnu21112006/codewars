import React, { useState } from 'react';
import {
  Cpu,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Wrench,
  Building2,
  Trash2,
  SlidersHorizontal,
  ShieldCheck,
  Send
} from 'lucide-react';
import { useLabLink } from '../context/LabLinkContext';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input, { Select } from '../components/Input';

export const EquipmentManagement = () => {
  const { equipmentList, addEquipment, updateEquipmentStatus } = useLabLink();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState('');

  // Add Equipment Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('FPGA & SoC');
  const [department, setDepartment] = useState('ECE');
  const [lab, setLab] = useState('VLSI & Embedded Systems Research Lab');
  const [room, setRoom] = useState('MV-304');
  const [model, setModel] = useState('');
  const [totalUnits, setTotalUnits] = useState('2');
  const [requiresApproval, setRequiresApproval] = useState(true);
  const [safetyGuidelines, setSafetyGuidelines] = useState('Wear appropriate PPE and ESD wrist strap.');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80');

  const filteredItems = equipmentList.filter((item) => {
    const matchesDept = selectedDept === 'ALL' || item.department === selectedDept;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addEquipment({
      name,
      category,
      department,
      lab,
      room,
      model: model || 'GEN-2026',
      totalUnits: parseInt(totalUnits, 10) || 1,
      availableUnits: parseInt(totalUnits, 10) || 1,
      requiresApproval,
      safetyGuidelines,
      image,
      hourlyRate: 'Free (Academic Grant)',
      inCharge: 'Lab In-Charge',
      specs: {
        'Deploy Type': 'Specialized Bench Workstation',
        'Architecture': 'Hardware Evaluation Platform',
      },
    });

    setNotification(`Successfully added ${name} to the college mesh catalog!`);
    setIsAddModalOpen(false);
    setName('');
    setModel('');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleStatusChange = (id, newStatus) => {
    updateEquipmentStatus(id, newStatus);
    setNotification(`Workstation status updated to ${newStatus.toUpperCase()}`);
    setTimeout(() => setNotification(''), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Equipment & <span className="text-gradient">Workstation Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Central research administrator portal: register new specialized hardware, calibrate stations, and update status.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add New Equipment
        </Button>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between">
          <div>
            <span className="text-slate-400">Total Registered Stations:</span>
            <p className="text-xl font-bold text-white mt-1">
              {equipmentList.reduce((acc, eq) => acc + eq.totalUnits, 0)} Units
            </p>
          </div>
          <Cpu className="w-8 h-8 text-cyan-400" />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between">
          <div>
            <span className="text-slate-400">Currently Available:</span>
            <p className="text-xl font-bold text-emerald-400 mt-1">
              {equipmentList.reduce((acc, eq) => acc + (eq.status === 'available' ? eq.availableUnits : 0), 0)} Units
            </p>
          </div>
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between">
          <div>
            <span className="text-slate-400">Under Maintenance / Calibration:</span>
            <p className="text-xl font-bold text-amber-400 mt-1">
              {equipmentList.filter((eq) => eq.status === 'maintenance').length} Stations
            </p>
          </div>
          <Wrench className="w-8 h-8 text-amber-400" />
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['ALL', 'ECE', 'CSE', 'MECH', 'BIOTECH'].map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                selectedDept === dept
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {dept === 'ALL' ? 'All Departments' : dept}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search equipment or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900/80 border border-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          />
        </div>
      </div>

      {/* Equipment Management Table */}
      <GlassCard title="Hardware Station Roster">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 px-3">Equipment & Model</th>
                <th className="pb-3 px-3">Dept & Lab</th>
                <th className="pb-3 px-3">Category</th>
                <th className="pb-3 px-3">Units (Free / Total)</th>
                <th className="pb-3 px-3">Current Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-3">
                    <p className="font-bold text-white">{item.name}</p>
                    <p className="text-[11px] font-mono text-cyan-400">
                      Model: {item.model}
                    </p>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-semibold text-slate-200">
                      {item.department}
                    </span>
                    <p className="text-[11px] text-slate-400 truncate max-w-xs">
                      {item.lab} ({item.room})
                    </p>
                  </td>
                  <td className="py-3.5 px-3">
                    <Badge variant="violet" size="sm">
                      {item.category}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-medium">
                    <span className="text-emerald-400">{item.availableUnits}</span> / {item.totalUnits} Units
                  </td>
                  <td className="py-3.5 px-3">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className={`text-xs rounded-lg px-2.5 py-1 font-semibold border focus:outline-none ${
                        item.status === 'available'
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                          : item.status === 'maintenance'
                          ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                          : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                      }`}
                    >
                      <option value="available" className="bg-slate-900 text-slate-200">
                        Available
                      </option>
                      <option value="in_use" className="bg-slate-900 text-slate-200">
                        In Use
                      </option>
                      <option value="maintenance" className="bg-slate-900 text-slate-200">
                        Maintenance
                      </option>
                    </select>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <Button
                      variant="glass"
                      size="sm"
                      className="text-xs"
                      onClick={() => alert(`Diagnostics running for ${item.name}. Calibration: Nominal.`)}
                    >
                      Calibrate
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Add New Equipment Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register Specialized Equipment"
        subtitle="Add specialized hardware to the campus resource sharing platform"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="Equipment Name"
            placeholder="e.g. Rohde & Schwarz Vector Network Analyzer"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              options={[
                { value: 'ECE', label: 'Electronics & Communication (ECE)' },
                { value: 'CSE', label: 'Computer Science & Engineering (CSE)' },
                { value: 'MECH', label: 'Mechanical & Robotics (MECH)' },
                { value: 'BIOTECH', label: 'Biotechnology & Nanotech (BIOTECH)' },
              ]}
            />
            <Select
              label="Equipment Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: 'FPGA & SoC', label: 'FPGA & SoC' },
                { value: 'GPU Workstation', label: 'GPU Workstation' },
                { value: 'Test & Measurement', label: 'Test & Measurement' },
                { value: 'Edge AI Kit', label: 'Edge AI Kit' },
                { value: 'Rapid Prototyping', label: 'Rapid Prototyping' },
                { value: 'Robotics Manipulator', label: 'Robotics Manipulator' },
                { value: 'Analytical Bio-Instrument', label: 'Analytical Bio-Instrument' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Laboratory Name"
              value={lab}
              onChange={(e) => setLab(e.target.value)}
              required
            />
            <Input
              label="Room Number"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              required
            />
            <Input
              label="Model Number"
              placeholder="e.g. VNA-4000"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="number"
              min="1"
              max="20"
              label="Total Available Units"
              value={totalUnits}
              onChange={(e) => setTotalUnits(e.target.value)}
              required
            />
            <Select
              label="Approval Policy"
              value={requiresApproval ? 'yes' : 'no'}
              onChange={(e) => setRequiresApproval(e.target.value === 'yes')}
              options={[
                { value: 'yes', label: 'Requires Faculty Approval' },
                { value: 'no', label: 'Self-Service Direct Reservation' },
              ]}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Safety Guidelines & Handling Protocol
            </label>
            <textarea
              rows={2}
              value={safetyGuidelines}
              onChange={(e) => setSafetyGuidelines(e.target.value)}
              className="w-full rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-slate-100 p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              required
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <Button variant="glass" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" icon={Send}>
              Register Equipment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EquipmentManagement;
