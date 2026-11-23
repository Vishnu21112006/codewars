import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Send,
  User,
  Bot,
  Cpu,
  Building2,
  CalendarCheck,
  ShieldAlert,
  Lightbulb,
  CheckCircle,
  HelpCircle,
  Calendar,
  Clock,
  Layers,
  FolderPlus,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { useLabLink } from '../context/LabLinkContext';
import { aiApi } from '../api/client';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input, { Select } from '../components/Input';

const SAMPLE_PRESETS = [
  {
    title: 'Autonomous Robotics Navigation & Vision Tracking',
    description: 'Developing an autonomous robotics platform with real-time OAK-D camera perception, 2D LiDAR SLAM, and edge motor control on Raspberry Pi. Requires high-throughput GPU workstation for visual SLAM deep learning training.',
    duration: '4 Weeks',
    deadline: '2026-12-15',
  },
  {
    title: 'Distributed Vision-Language Model Quantization',
    description: 'Benchmarking 4-bit and 3-bit activation-aware weight quantization on multi-GPU nodes for zero-shot mobile robot spatial grounding. Need to measure edge inference latency on portable SBC hardware.',
    duration: '3 Weeks',
    deadline: '2026-12-18',
  },
  {
    title: 'Smart Seismic Modal Analysis for Long-Span Bridges',
    description: 'Deploying high-sensitivity multi-axis piezoelectric vibration sensors on structural bridge models to record dynamic resonance dampening ratios under artificial ground acceleration.',
    duration: '5 Weeks',
    deadline: '2026-12-24',
  },
];

export const AiAssistant = () => {
  const navigate = useNavigate();
  const { currentUser, createBooking, createProject } = useLabLink();

  // Project Input Fields
  const [projectTitle, setProjectTitle] = useState('Autonomous Robotics Navigation & Vision Tracking');
  const [projectDescription, setProjectDescription] = useState(
    'Developing an autonomous robotics platform with real-time OAK-D camera perception, 2D LiDAR SLAM, and edge motor control on Raspberry Pi. Requires high-throughput GPU workstation for visual SLAM deep learning training.'
  );
  const [requiredDate, setRequiredDate] = useState('2026-12-15');
  const [projectDuration, setProjectDuration] = useState('4 Weeks');

  // Chat and Analyzer State
  const [messages, setMessages] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showConfigDrawer, setShowConfigDrawer] = useState(true);
  const [notification, setNotification] = useState('');
  const [savedProjectIds, setSavedProjectIds] = useState(new Set());

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAnalyzing]);

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: 1,
        sender: 'ai',
        text: `Welcome, ${currentUser.name}! I am your LabLink GenAI Research Architect powered by Google Gemini. Fill in your project parameters above or pick a sample preset to extract equipment requirements, specifications, and match against campus lab stations.`,
        timestamp: '10:00 AM',
      },
    ]);
  }, [currentUser]);

  const handleApplyPreset = (preset) => {
    setProjectTitle(preset.title);
    setProjectDescription(preset.description);
    setProjectDuration(preset.duration);
    setRequiredDate(preset.deadline);
  };

  const handleAnalyzeProject = async () => {
    if (!projectTitle.trim() || !projectDescription.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: `Analyze Project: "${projectTitle}"\nDuration: ${projectDuration} • Deadline: ${requiredDate}\n\nDescription: ${projectDescription}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsAnalyzing(true);
    setShowConfigDrawer(false);

    try {
      const payload = {
        title: projectTitle,
        description: projectDescription,
        required_completion_date: requiredDate,
        project_duration: projectDuration,
      };

      const res = await aiApi.analyzeProject(payload);
      const analysisData = res.data;

      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: `Analysis complete for "${analysisData.project_title}". Here is the synthesized equipment mapping, specifications, and inventory availability:`,
        analysis: analysisData,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.warn('Backend analyzer error, performing clean fallback:', err.message);

      // Deterministic client fallback if backend is unreachable
      const fallbackAnalysis = {
        project_title: projectTitle,
        project_category: 'Embedded Systems & Autonomous Hardware',
        domain_summary: 'Hardware-software integration requiring high-speed digital analysis, real-time compute, and rapid mechanical iteration.',
        technical_specifications: {
          'Protocol Analysis': 'CAN-FD, SPI & I2C @ 10MHz+',
          'Compute Platform': 'ARM Cortex-M or FPGA acceleration',
          'Fabrication': 'Precision stereolithography (<50 Micron)',
        },
        estimated_usage_duration: `${projectDuration} (~24 Laboratory Hours)`,
        engine_mode: 'deterministic_demo_mode',
        fairness_and_safety_notes: 'OR-Tools scheduler will allocate slots with minimal contention. Wear static-safe wristbands when handling bare boards.',
        essential_equipment: [
          {
            equipment_name: 'Xilinx Zynq UltraScale+ MPSoC ZCU102 Evaluation Board',
            category: 'Development Board',
            required_quantity: 1,
            technical_specifications: { 'Logic Cells': '600K' },
            estimated_usage_duration: '16 Hours',
            is_essential: true,
            justification: 'Required for real-time sensor processing and telemetry.',
          },
          {
            equipment_name: 'Keysight Infiniium 1GHz 4-Channel Mixed Signal Oscilloscope',
            category: 'Oscilloscope',
            required_quantity: 1,
            technical_specifications: { 'Bandwidth': '1.0 GHz' },
            estimated_usage_duration: '8 Hours',
            is_essential: true,
            justification: 'Necessary to measure bus clock jitter and logic rise times.',
          },
        ],
        optional_equipment: [
          {
            equipment_name: 'Formlabs Form 3+ SLA Industrial 3D Printer',
            category: '3D Printer',
            required_quantity: 1,
            technical_specifications: { 'Resin': 'Tough 2000' },
            estimated_usage_duration: '4 Hours',
            is_essential: false,
            justification: 'Optional for rapid bracket enclosure fabrication.',
          },
        ],
        matched_inventory: [
          {
            inventory_id: 'e-dev-01',
            name: 'Xilinx Zynq UltraScale+ MPSoC ZCU102 Evaluation Board',
            model: 'ZCU102-ED',
            category: 'Development Board',
            department: 'ECE',
            lab: 'VLSI & Embedded Systems Research Lab',
            room: 'MV-304',
            available_units: 3,
            total_units: 4,
            status: 'available',
            is_available: true,
            match_confidence: 0.98,
            hourly_rate: 'Free',
            alternatives: [],
          },
          {
            inventory_id: 'e-osc-01',
            name: 'Keysight Infiniium 1GHz 4-Channel Mixed Signal Oscilloscope',
            model: 'DSOX4024A',
            category: 'Oscilloscope',
            department: 'ECE',
            lab: 'Electronics Instrumentation Facility',
            room: 'MV-201',
            available_units: 4,
            total_units: 6,
            status: 'available',
            is_available: true,
            match_confidence: 0.96,
            hourly_rate: 'Free',
            alternatives: [],
          },
        ],
      };

      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: `Analysis complete for "${fallbackAnalysis.project_title}" (Demo Mode):`,
        analysis: fallbackAnalysis,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveProject = (analysis) => {
    const newProject = createProject({
      title: analysis.project_title,
      domain: analysis.project_category,
      department: currentUser.department || 'ECE',
      mentor: 'Dr. Aris Thorne',
      deadline: requiredDate || '2026-12-15',
      priority: 'high',
      description: analysis.domain_summary,
      requiredEquipment: analysis.matched_inventory.map((item) => item.name),
    });

    setSavedProjectIds((prev) => new Set([...prev, analysis.project_title]));
    setNotification(`Project "${analysis.project_title}" successfully saved to your Project Management portal!`);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleQuickBook = (item) => {
    createBooking({
      equipmentId: item.inventory_id || item.id,
      equipmentName: item.name,
      department: item.department,
      lab: `${item.lab} (${item.room})`,
      projectId: 'proj-1',
      projectName: projectTitle,
      date: requiredDate || '2026-11-26',
      timeSlot: '02:00 PM - 05:00 PM',
      justification: `AI Project Analyzer reserved station: required for ${projectTitle}.`,
      requiresApproval: true,
      facultyMentor: 'Dr. Aris Thorne',
    });

    setNotification(`Reservation requested for ${item.name}! Check your passes.`);
    setTimeout(() => {
      setNotification('');
      navigate('/my-reservations');
    }, 1500);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              AI-Powered <span className="text-gradient">Project Analyzer</span>
            </h1>
            <Badge variant="violet" size="sm" dot pulsing>
              Google Gemini API
            </Badge>
          </div>
          <p className="text-xs text-slate-400">
            Extract equipment requirements, technical specs, and match against actual LabLink campus inventory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="glass"
            size="sm"
            onClick={() => setShowConfigDrawer(!showConfigDrawer)}
          >
            {showConfigDrawer ? 'Hide Project Parameters' : 'Edit Project Parameters'}
          </Button>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/30 text-emerald-300 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
          <Button
            variant="glass"
            size="sm"
            className="text-[11px] py-1 px-2 text-cyan-300"
            onClick={() => navigate('/projects')}
          >
            View Projects
          </Button>
        </div>
      )}

      {/* Project Parameters Card */}
      {showConfigDrawer && (
        <GlassCard gradientGlow className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Project Description & Objectives
            </span>
            <span className="text-[11px] text-slate-500">
              Pydantic Validated Extraction
            </span>
          </div>

          {/* Preset Chips */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Sample Project Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="px-3 py-1.5 rounded-xl text-xs bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all text-left truncate max-w-xs"
                >
                  💡 {p.title}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Project Title"
                placeholder="e.g. Real-Time Hardware Sensor Fusion"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="date"
                label="Required Completion Date"
                value={requiredDate}
                onChange={(e) => setRequiredDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Technical Methodology & Requirements Description
              </label>
              <textarea
                rows={3}
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Describe what your engineering team is building, target protocols, sensors, or algorithms..."
                className="w-full rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                required
              />
            </div>
            <div>
              <Select
                label="Project Duration"
                value={projectDuration}
                onChange={(e) => setProjectDuration(e.target.value)}
                options={[
                  { value: '2 Weeks', label: '2 Weeks (Mini-Project Milestone)' },
                  { value: '4 Weeks', label: '4 Weeks (Standard Sprint)' },
                  { value: '8 Weeks', label: '8 Weeks (Capstone Phase 1)' },
                  { value: 'Full Semester', label: 'Full Semester (Thesis / Grant)' },
                ]}
              />
              <Button
                variant="primary"
                size="md"
                className="w-full mt-6"
                icon={Sparkles}
                isLoading={isAnalyzing}
                onClick={handleAnalyzeProject}
              >
                Analyze Project with Gemini
              </Button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Conversational Stream Container */}
      <div className="space-y-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 p-4 sm:p-6 backdrop-blur-xl min-h-[400px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3.5 max-w-4xl ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-tr from-cyan-500 to-sky-600 text-white shadow-glow-blue/20'
                  : 'bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white shadow-glow-violet/20 border border-white/20'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className="space-y-4 flex-1">
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-sky-700 text-white rounded-tr-none'
                    : 'bg-slate-900/90 border border-slate-700/80 text-slate-200 rounded-tl-none shadow-glass'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <span className="text-[10px] opacity-60 block mt-1 text-right font-mono">
                  {msg.timestamp}
                </span>
              </div>

              {/* Rich Analysis Dashboard Output */}
              {msg.analysis && (
                <div className="p-5 sm:p-6 rounded-3xl border border-violet-500/40 bg-gradient-to-br from-violet-950/30 via-slate-900/95 to-navy-950/95 backdrop-blur-2xl shadow-2xl space-y-6">
                  {/* Top Bar: Category, Duration, Engine Mode & Save Project Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-violet-500/20 gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="cyan" size="sm">
                          {msg.analysis.project_category}
                        </Badge>
                        <Badge
                          variant={msg.analysis.engine_mode === 'google_gemini_live' ? 'violet' : 'emerald'}
                          size="sm"
                          dot
                        >
                          {msg.analysis.engine_mode === 'google_gemini_live'
                            ? 'Gemini Live'
                            : 'Deterministic Analyzer'}
                        </Badge>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1">
                        {msg.analysis.project_title}
                      </h3>
                      <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                        {msg.analysis.domain_summary}
                      </p>
                    </div>

                    <Button
                      variant={savedProjectIds.has(msg.analysis.project_title) ? 'secondary' : 'primary'}
                      size="sm"
                      icon={savedProjectIds.has(msg.analysis.project_title) ? CheckCircle : FolderPlus}
                      disabled={savedProjectIds.has(msg.analysis.project_title)}
                      onClick={() => handleSaveProject(msg.analysis)}
                      className="shrink-0"
                    >
                      {savedProjectIds.has(msg.analysis.project_title) ? 'Project Saved' : 'Save Analyzed Project'}
                    </Button>
                  </div>

                  {/* Specifications & Estimated Usage Duration */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                      <span className="text-slate-400 font-semibold uppercase text-[10px] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-violet-400" /> Estimated Usage Duration
                      </span>
                      <p className="font-bold text-white text-sm">
                        {msg.analysis.estimated_usage_duration}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                      <span className="text-slate-400 font-semibold uppercase text-[10px] flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Extracted Technical Specifications
                      </span>
                      <div className="grid grid-cols-2 gap-1 text-[11px]">
                        {Object.entries(msg.analysis.technical_specifications || {}).map(([k, v]) => (
                          <div key={k} className="truncate">
                            <span className="text-slate-500">{k}:</span>{' '}
                            <span className="text-slate-200 font-medium">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Essential vs Optional Extracted Equipment */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                      Extracted Hardware Dependencies:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* Essential */}
                      <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-cyan-400" /> Essential Hardware (Mandatory)
                          </span>
                          <Badge variant="cyan" size="sm">
                            {msg.analysis.essential_equipment.length} Items
                          </Badge>
                        </div>
                        <ul className="space-y-2 pt-1 text-slate-300">
                          {msg.analysis.essential_equipment.map((item, idx) => (
                            <li key={idx} className="pb-2 border-b border-slate-800/80 last:border-0">
                              <div className="flex justify-between font-semibold text-white">
                                <span>{item.equipment_name}</span>
                                <span className="font-mono text-cyan-400">Qty: {item.required_quantity}</span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-0.5">{item.justification}</p>
                              <span className="text-[10px] text-slate-500 font-mono">
                                Est. Time: {item.estimated_usage_duration}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Optional */}
                      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-300 flex items-center gap-1.5">
                            <Info className="w-4 h-4 text-violet-400" /> Optional / Enhancement
                          </span>
                          <Badge variant="slate" size="sm">
                            {msg.analysis.optional_equipment.length} Items
                          </Badge>
                        </div>
                        <ul className="space-y-2 pt-1 text-slate-400">
                          {msg.analysis.optional_equipment.length === 0 ? (
                            <li className="text-[11px] text-slate-500">None required.</li>
                          ) : (
                            msg.analysis.optional_equipment.map((item, idx) => (
                              <li key={idx} className="pb-2 border-b border-slate-800/80 last:border-0">
                                <div className="flex justify-between font-semibold text-slate-200">
                                  <span>{item.equipment_name}</span>
                                  <span className="font-mono text-violet-400">Qty: {item.required_quantity}</span>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-0.5">{item.justification}</p>
                              </li>
                            ))
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Matched Actual LabLink Inventory Cards */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-400" /> Matched Against Actual LabLink Campus Inventory
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Zero Invented Gear • Verified Locations
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {msg.analysis.matched_inventory.map((inv, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-slate-700 transition-all text-xs flex flex-col justify-between space-y-3"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <Badge variant="cyan" size="sm">
                                {inv.department}
                              </Badge>
                              <Badge
                                variant={inv.is_available ? 'emerald' : 'rose'}
                                size="sm"
                                dot
                              >
                                {inv.is_available
                                  ? `${inv.available_units} / ${inv.total_units} Free`
                                  : 'Currently In Use'}
                              </Badge>
                            </div>

                            <h5 className="font-bold text-white text-sm line-clamp-1">{inv.name}</h5>
                            <p className="text-[11px] text-slate-400 font-mono mt-0.5">Model: {inv.model}</p>

                            <div className="mt-2 text-[11px] text-slate-300 flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                              <span className="truncate">{inv.lab} ({inv.room})</span>
                            </div>
                          </div>

                          {/* Alternatives if item is unavailable */}
                          {!inv.is_available && inv.alternatives && inv.alternatives.length > 0 && (
                            <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-[11px] space-y-1">
                              <span className="font-bold text-amber-300 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> Available Alternative:
                              </span>
                              <p className="text-slate-300 font-semibold">{inv.alternatives[0].name}</p>
                              <span className="text-emerald-400 font-mono text-[10px]">
                                {inv.alternatives[0].available_units} units ready in {inv.alternatives[0].department}
                              </span>
                            </div>
                          )}

                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                            <span className="text-[10px] text-slate-400 font-mono">
                              Rate: {inv.hourly_rate}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <Button
                                variant="glass"
                                size="sm"
                                className="text-xs py-1 px-2.5 text-violet-300 hover:text-white"
                                icon={Zap}
                                onClick={() => navigate('/calendar')}
                                title="Inspect Timetable in Calendar"
                              >
                                Timetable
                              </Button>
                              <Button
                                variant={inv.is_available ? 'primary' : 'secondary'}
                                size="sm"
                                className="text-xs py-1 px-3"
                                icon={CalendarCheck}
                                onClick={() =>
                                  handleQuickBook(
                                    !inv.is_available && inv.alternatives?.length > 0
                                      ? inv.alternatives[0]
                                      : inv
                                  )
                                }
                              >
                                {inv.is_available ? 'Book Station' : 'Book Alternative'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Safety & Fairness Insight */}
                  <div className="p-3.5 rounded-xl bg-violet-950/30 border border-violet-500/30 text-xs text-violet-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <Lightbulb className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-violet-300">OR-Tools Optimization & Safety Advisory:</strong>{' '}
                        {msg.analysis.fairness_and_safety_notes}
                      </div>
                    </div>
                    <Button
                      variant="glass"
                      size="sm"
                      icon={Zap}
                      className="shrink-0 text-violet-300 hover:text-white border-violet-500/40"
                      onClick={() => navigate('/conflicts')}
                    >
                      CP-SAT Fairness Engine
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isAnalyzing && (
          <div className="flex gap-3 max-w-md items-center">
            <div className="w-9 h-9 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-violet-300 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Analyzing project specifications and matching LabLink inventory...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default AiAssistant;
