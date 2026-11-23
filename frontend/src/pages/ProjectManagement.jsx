import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  Plus,
  Calendar,
  User,
  Cpu,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  Target
} from 'lucide-react';
import { useLabLink } from '../context/LabLinkContext';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input, { Select } from '../components/Input';

export const ProjectManagement = () => {
  const navigate = useNavigate();
  const { projects, createProject, currentUser } = useLabLink();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('Embedded Systems & Robotics');
  const [department, setDepartment] = useState('ECE');
  const [mentor, setMentor] = useState('Dr. Aris Thorne');
  const [deadline, setDeadline] = useState('2026-12-15');
  const [priority, setPriority] = useState('high');
  const [description, setDescription] = useState('');

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    createProject({
      title,
      domain,
      department,
      mentor,
      deadline,
      priority,
      description,
      requiredEquipment: ['Xilinx ZCU102 FPGA', 'Keysight 1GHz Oscilloscope'],
    });

    setNotification(`Project "${title.slice(0, 30)}..." successfully registered!`);
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Project <span className="text-gradient">Management & Resource Mapping</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Associate laboratory hardware allocations with verified academic capstones, research grants, and student theses.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
        >
          Register New Project
        </Button>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <GlassCard key={proj.id} hoverEffect className="flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="cyan" size="sm">
                  {proj.department}
                </Badge>
                <Badge
                  variant={
                    proj.priority === 'capstone_critical'
                      ? 'rose'
                      : proj.priority === 'high'
                      ? 'amber'
                      : 'slate'
                  }
                  size="sm"
                  dot
                >
                  {proj.priority.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>

              <h3 className="text-base font-bold text-white leading-snug">
                {proj.title}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Domain: {proj.domain}
              </p>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                {proj.description}
              </p>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Milestone Progress</span>
                  <span className="font-semibold text-white">{proj.progress || 50}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-violet-500 h-1.5 rounded-full"
                    style={{ width: `${proj.progress || 50}%` }}
                  />
                </div>
              </div>

              {/* Mentorship & Deadline metadata */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">Mentor: {proj.mentor}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                  <span>Due: {proj.deadline}</span>
                </div>
              </div>

              {/* Mapped Hardware */}
              {proj.requiredEquipment && (
                <div className="pt-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1.5">
                    Mapped Laboratory Stations
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.requiredEquipment.map((eq, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                      >
                        <Cpu className="w-3 h-3 text-cyan-400" />
                        <span>{eq}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Button */}
            <div className="pt-4 border-t border-slate-800 mt-4 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Lead: {proj.studentLead}
              </span>
              <Button
                variant="primary"
                size="sm"
                icon={Cpu}
                onClick={() => navigate('/equipment')}
              >
                Book Station for Project
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Create New Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register Academic Research Project"
        subtitle="Enable project-based access quotas and priority scheduling for your team"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            label="Project Title"
            placeholder="e.g. Distributed Radar Signal Processing on Heterogeneous MPSoC"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Research Domain"
              placeholder="e.g. VLSI, Bio-Sensors, Edge AI"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
            />
            <Select
              label="Home Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              options={[
                { value: 'ECE', label: 'Electronics & Communication (ECE)' },
                { value: 'CSE', label: 'Computer Science & Engineering (CSE)' },
                { value: 'MECH', label: 'Mechanical & Robotics (MECH)' },
                { value: 'BIOTECH', label: 'Biotechnology & Nanotech (BIOTECH)' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Faculty Advisor / Mentor Name"
              placeholder="e.g. Dr. Aris Thorne"
              value={mentor}
              onChange={(e) => setMentor(e.target.value)}
              required
            />
            <Input
              type="date"
              label="Evaluation / Milestone Deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>

          <Select
            label="Priority Tier for Conflict Resolution"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            options={[
              { value: 'capstone_critical', label: 'Capstone Critical (Final 48-hr milestone)' },
              { value: 'high', label: 'High Priority (Conference submission / Thesis)' },
              { value: 'medium', label: 'Medium Priority (Course project / Exploration)' },
            ]}
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Project Description & Hardware Objectives
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain what experiments or measurements will be carried out..."
              className="w-full rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-slate-100 p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              required
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <Button variant="glass" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" icon={Plus}>
              Register Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectManagement;
