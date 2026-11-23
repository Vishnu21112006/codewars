import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Cpu,
  Building2,
  CalendarCheck,
  CheckCircle,
  Lightbulb,
  Zap,
  ArrowRight
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Badge from '../components/Badge';
import Button from '../components/Button';

const promptPresets = [
  'I need to test high-speed 10Gbps serial transceivers and verify signal integrity for a satellite telemetry board.',
  'We are training a lightweight Vision-Language Model on autonomous rover cameras with edge inference on ROS2.',
  'Need to fabricate a custom microfluidic channel enclosure and test DNA absorbance samples for bio-sensor calibration.',
];

export const AiMatchmaker = () => {
  const [projectPrompt, setProjectPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  const handleMatch = (customText) => {
    const textToAnalyze = customText || projectPrompt;
    if (!textToAnalyze.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRecommendation({
        projectSummary:
          'High-throughput Edge Robotics & Sensor Integrity Validation Pipeline',
        matchConfidence: '97.8%',
        detectedDomains: ['Embedded Systems', 'Edge AI', 'Rapid Prototyping'],
        matchedEquipment: [
          {
            name: 'NVIDIA Jetson AGX Orin 64GB Developer Kit',
            lab: 'Robotics & Vision Studio (TT-405)',
            department: 'CSE',
            reason:
              'Provides 275 TOPS AI inference and native ROS2 JetPack acceleration for real-time edge obstacle processing.',
            recommendedSlot: 'Nov 25 • 10:00 AM - 01:00 PM',
            urgencyScore: 'High (0.89)',
          },
          {
            name: 'Formlabs Form 3+ SLA Industrial 3D Printer',
            lab: 'Autonomous Robotics Studio (VSC-102)',
            department: 'MECH',
            reason:
              'Necessary for 25-micron precision sensor mount and custom chassis casing fabrication.',
            recommendedSlot: 'Nov 25 • 02:00 PM - 05:00 PM',
            urgencyScore: 'Medium (0.75)',
          },
          {
            name: 'Keysight 1GHz 4-Channel Digital Storage Oscilloscope',
            lab: 'Electronics Instrumentation Facility (MV-201)',
            department: 'ECE',
            reason:
              'Essential to verify power-rail ripple and high-speed camera sensor MIPI CSI-2 bus timing.',
            recommendedSlot: 'Nov 26 • 09:00 AM - 12:00 PM',
            urgencyScore: 'Standard (0.68)',
          },
        ],
        facultyAdvisors: [
          { name: 'Dr. Aris Thorne', dept: 'ECE', email: 'a.thorne@college.edu' },
          { name: 'Prof. Elena Rostova', dept: 'CSE', email: 'e.rostova@college.edu' },
        ],
        fairnessAdvice:
          'Both kits are free during early morning slots. Reserving Nov 25 morning slot has 0% collision with senior Capstone teams.',
      });
    }, 1400);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>GenAI Assistant Powered by Google Gemini</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          AI Equipment & <span className="text-gradient">Lab Matchmaker</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Describe your academic project, thesis, or hackathon goal in plain English.
          Gemini analyzes requirements across departments, pairs you with ideal lab kits, and calculates optimal slots.
        </p>
      </div>

      {/* Input Console */}
      <GlassCard gradientGlow>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Describe Your Project or Experiment Requirements
            </label>
            <textarea
              rows={4}
              value={projectPrompt}
              onChange={(e) => setProjectPrompt(e.target.value)}
              placeholder="e.g. We are building an autonomous drone with stereo depth cameras and need to train an edge vision model, then measure signal timing on the motor controller board..."
              className="w-full rounded-2xl bg-slate-950/70 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-500 p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-400 transition-all backdrop-blur-md"
            />
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Try Sample Prompts:
            </span>
            <div className="flex flex-wrap gap-2">
              {promptPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setProjectPrompt(preset);
                    handleMatch(preset);
                  }}
                  className="text-left text-xs bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white px-3 py-2 rounded-xl transition-all"
                >
                  💡 {preset.slice(0, 60)}...
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              variant="primary"
              size="md"
              icon={Sparkles}
              isLoading={loading}
              onClick={() => handleMatch()}
            >
              Analyze & Find Equipment
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Recommendations Output */}
      {recommendation && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="rounded-2xl border border-violet-500/40 bg-gradient-to-br from-violet-950/20 via-navy-900/60 to-slate-900/80 backdrop-blur-xl p-6 shadow-glow-violet/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-violet-500/20">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  Analysis Synthesized
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {recommendation.projectSummary}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="violet" size="md">
                  Match Score: {recommendation.matchConfidence}
                </Badge>
              </div>
            </div>

            {/* Domains */}
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-slate-400">Classified Domains:</span>
              {recommendation.detectedDomains.map((d, i) => (
                <Badge key={i} variant="slate" size="sm">
                  {d}
                </Badge>
              ))}
            </div>

            {/* Matched Equipment Cards */}
            <div className="mt-6 space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Recommended Cross-Department Hardware & Workstations
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendation.matchedEquipment.map((eq, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="cyan" size="sm">
                          {eq.department}
                        </Badge>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {eq.urgencyScore}
                        </span>
                      </div>
                      <h5 className="font-bold text-white text-sm mb-1">{eq.name}</h5>
                      <p className="text-[11px] text-slate-400 mb-3 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                        <span className="truncate">{eq.lab}</span>
                      </p>
                      <p className="text-slate-300 text-xs leading-relaxed mb-4">
                        {eq.reason}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80">
                      <div className="text-[11px] text-emerald-400 font-mono mb-2 flex items-center gap-1">
                        <CalendarCheck className="w-3.5 h-3.5" />
                        <span>{eq.recommendedSlot}</span>
                      </div>
                      <Button
                        variant="glass"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => (window.location.href = '/equipment')}
                      >
                        Reserve Slot
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fairness Advice */}
            <div className="mt-6 p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200 flex items-start gap-3">
              <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-cyan-300">OR-Tools Allocation Insight:</strong>{' '}
                {recommendation.fairnessAdvice}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiMatchmaker;
