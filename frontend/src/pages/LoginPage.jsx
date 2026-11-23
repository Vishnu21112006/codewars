import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Lock,
  Mail,
  UserCheck,
  ShieldCheck,
  GraduationCap,
  Building2,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useLabLink, DEMO_USERS } from '../context/LabLinkContext';
import Button from '../components/Button';
import Badge from '../components/Badge';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, switchRole } = useLabLink();

  const [email, setEmail] = useState('aarav.patel@college.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState('student'); // 'student' | 'faculty' | 'admin'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      login(email, password, role);

      // Redirect based on selected role
      if (role === 'student') navigate('/student');
      else if (role === 'faculty') navigate('/faculty');
      else navigate('/admin');
    }, 600);
  };

  const handleQuickDemoLogin = (roleKey) => {
    switchRole(roleKey);
    const user = DEMO_USERS[roleKey];
    setEmail(user.email);
    setRole(user.role);

    if (roleKey === 'student') navigate('/student');
    else if (roleKey === 'faculty') navigate('/faculty');
    else navigate('/admin');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-navy-950">
      {/* Background radial glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-violet-600 shadow-xl shadow-cyan-500/20 border border-white/20 mb-2">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Lab<span className="text-gradient">Link</span>
          </h1>
          <p className="text-xs text-slate-400">
            Intelligent Campus Laboratory Resource Sharing & Reservation Mesh
          </p>
        </div>

        {/* Main Login Card */}
        <div className="rounded-3xl border border-slate-700/80 bg-slate-900/60 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-navy-950/80 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white">Access Portal</h2>
              <p className="text-xs text-slate-400">Single Sign-On for campus labs</p>
            </div>
            <Badge variant="cyan" size="sm" dot pulsing>
              Supabase Auth
            </Badge>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Role Selection Tabs */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Sign In As
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'student', label: 'Student', icon: GraduationCap },
                  { key: 'faculty', label: 'Faculty', icon: ShieldCheck },
                  { key: 'admin', label: 'Lab Admin', icon: Building2 },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        setRole(item.key);
                        const user = DEMO_USERS[item.key];
                        if (user) setEmail(user.email);
                      }}
                      className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-semibold border transition-all duration-200 gap-1 ${
                        role === item.key
                          ? 'bg-gradient-to-br from-cyan-500/20 to-violet-600/30 border-cyan-400 text-white shadow-glow-blue/20'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                College Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rollno@college.edu"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-400 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <a href="#forgot" className="text-xs text-cyan-400 hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-400 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              icon={ArrowRight}
              iconPosition="right"
              isLoading={isLoading}
            >
              Sign In to LabLink
            </Button>
          </form>

          {/* Quick Demo Login Personas for Evaluators */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block text-center">
              ⚡ Evaluator Quick Test (1-Click Login)
            </span>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('student')}
                className="text-left p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-cyan-300 flex items-center gap-1.5">
                    <span>Aarav Patel</span>
                    <Badge variant="cyan" size="sm">
                      Student Lead
                    </Badge>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Autonomous Quadcopter Capstone (ECE)
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('faculty')}
                className="text-left p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-violet-500/40 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-violet-300 flex items-center gap-1.5">
                    <span>Dr. Aris Thorne</span>
                    <Badge variant="violet" size="sm">
                      Faculty Reviewer
                    </Badge>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    VLSI & Embedded Systems In-Charge
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-violet-400 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="text-left p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-emerald-300 flex items-center gap-1.5">
                    <span>Prof. Elena Rostova</span>
                    <Badge variant="emerald" size="sm">
                      Central Admin
                    </Badge>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Director of Central Research Facilities
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
