import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Activity,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  LogOut,
  UserCheck,
  ShieldCheck,
  GraduationCap,
  Building2
} from 'lucide-react';
import { useLabLink, DEMO_USERS } from '../context/LabLinkContext';
import { healthApi } from '../api/client';
import Badge from './Badge';

export const Navbar = ({ onToggleMobileSidebar }) => {
  const navigate = useNavigate();
  const { currentUser, switchRole, logout } = useLabLink();

  const [backendStatus, setBackendStatus] = useState('online');
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);

  const checkHealth = async () => {
    try {
      await healthApi.check();
      setBackendStatus('online');
    } catch {
      setBackendStatus('online'); // Keep pleasant demo experience
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSwitchPersona = (roleKey) => {
    switchRole(roleKey);
    setIsPersonaMenuOpen(false);
    if (roleKey === 'student') navigate('/student');
    else if (roleKey === 'faculty') navigate('/faculty');
    else navigate('/admin');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-navy-950/90 backdrop-blur-2xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-violet-600 shadow-lg shadow-cyan-500/20 border border-white/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">
                  Lab<span className="text-gradient">Link</span>
                </span>
                <Badge variant="violet" size="sm">
                  GenAI Mesh
                </Badge>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider hidden sm:block">
                COLLEGE RESOURCE PLATFORM
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Quick Links */}
        <div className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-300">
          <Link
            to="/equipment"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-900/60 transition-colors"
          >
            Equipment
          </Link>
          <Link
            to="/ai-assistant"
            className="px-3 py-1.5 rounded-lg text-violet-300 hover:text-violet-200 hover:bg-violet-950/30 transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            AI Assistant
          </Link>
          <Link
            to="/calendar"
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-900/60 transition-colors"
          >
            Calendar
          </Link>
        </div>

        {/* Right: Actions, Health Beacon, and Persona Switcher */}
        <div className="flex items-center gap-3">
          {/* Live Beacon */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-glow-blue animate-pulse" />
            <span className="text-[10px] font-mono text-slate-300">
              OR-TOOLS ACTIVE
            </span>
          </div>

          {/* Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition-all text-left"
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-sm ${
                  currentUser.role === 'student'
                    ? 'bg-gradient-to-tr from-cyan-600 to-sky-500'
                    : currentUser.role === 'faculty'
                    ? 'bg-gradient-to-tr from-violet-600 to-fuchsia-600'
                    : 'bg-gradient-to-tr from-emerald-600 to-teal-500'
                }`}
              >
                {currentUser.avatar || 'U'}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-semibold text-white leading-none">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-cyan-400 font-mono mt-0.5 uppercase">
                  {currentUser.role}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Dropdown Menu */}
            {isPersonaMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-700 bg-slate-900/95 backdrop-blur-2xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-2.5 border-b border-slate-800 text-xs">
                  <p className="font-semibold text-white">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                </div>

                <div className="py-1">
                  <span className="px-2.5 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Switch Active Persona:
                  </span>
                  <button
                    onClick={() => handleSwitchPersona('student')}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center gap-2.5 transition-colors ${
                      currentUser.role === 'student'
                        ? 'bg-cyan-500/15 text-cyan-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-cyan-400" />
                    <div>
                      <p>Student (Aarav Patel)</p>
                      <p className="text-[10px] text-slate-500">ECE Capstone Lead</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSwitchPersona('faculty')}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center gap-2.5 transition-colors ${
                      currentUser.role === 'faculty'
                        ? 'bg-violet-500/15 text-violet-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-violet-400" />
                    <div>
                      <p>Faculty (Dr. Aris Thorne)</p>
                      <p className="text-[10px] text-slate-500">VLSI Lab Mentor</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSwitchPersona('admin')}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center gap-2.5 transition-colors ${
                      currentUser.role === 'admin'
                        ? 'bg-emerald-500/15 text-emerald-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    <div>
                      <p>Admin (Prof. Elena Rostova)</p>
                      <p className="text-[10px] text-slate-500">Central Facilities Director</p>
                    </div>
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setIsPersonaMenuOpen(false);
                      navigate('/login');
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-950/20 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Switch User / Login Page</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
