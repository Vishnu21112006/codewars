import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  CalendarDays,
  Sparkles,
  ClipboardCheck,
  BarChart3,
  QrCode,
  FolderGit2,
  Wrench,
  ShieldCheck,
  Building2,
  GraduationCap,
  Zap,
  X
} from 'lucide-react';
import { useLabLink } from '../context/LabLinkContext';

export const Sidebar = ({ isOpenMobile, onCloseMobile }) => {
  const { currentUser } = useLabLink();

  const sections = [
    {
      title: 'Portals',
      items: [
        {
          to: '/student',
          label: 'Student Dashboard',
          icon: GraduationCap,
          badge: currentUser.role === 'student' ? 'Active' : null,
        },
        {
          to: '/faculty',
          label: 'Faculty Dashboard',
          icon: ShieldCheck,
          badge: currentUser.role === 'faculty' ? 'Active' : null,
        },
        {
          to: '/admin',
          label: 'Admin Analytics',
          icon: Building2,
          badge: currentUser.role === 'admin' ? 'Active' : null,
        },
      ],
    },
    {
      title: 'Lab Mesh Operations',
      items: [
        {
          to: '/equipment',
          label: 'Equipment Discovery',
          icon: Cpu,
          badge: 'Live',
        },
        {
          to: '/ai-assistant',
          label: 'AI Project Assistant',
          icon: Sparkles,
          badge: 'Gemini',
        },
        {
          to: '/projects',
          label: 'Project Management',
          icon: FolderGit2,
          badge: null,
        },
        {
          to: '/calendar',
          label: 'Booking Calendar',
          icon: CalendarDays,
          badge: null,
        },
        {
          to: '/my-reservations',
          label: 'My Reservations',
          icon: QrCode,
          badge: 'Passes',
        },
      ],
    },
    {
      title: 'Review & Management',
      items: [
        {
          to: '/faculty/approvals',
          label: 'Faculty Approvals',
          icon: ClipboardCheck,
          badge: 'Queue',
        },
        {
          to: '/conflicts',
          label: 'Conflict Resolver',
          icon: Zap,
          badge: 'CP-SAT',
        },
        {
          to: '/equipment-manage',
          label: 'Equipment Management',
          icon: Wrench,
          badge: null,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-navy-950/80 backdrop-blur-md z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 md:top-16 z-50 md:z-30 h-full md:h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-slate-800/80 bg-navy-950/95 md:bg-navy-950/40 backdrop-blur-2xl p-4 overflow-y-auto transition-transform duration-300 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between pb-3 mb-2 md:hidden border-b border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            LabLink Navigation
          </span>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-1.5">
              <span className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase block">
                {section.title}
              </span>
              <nav className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={onCloseMobile}
                      className={({ isActive }) =>
                        `group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-white border border-cyan-500/40 shadow-glow-blue/10 font-semibold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-2.5">
                            <Icon
                              className={`w-4 h-4 transition-colors ${
                                isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                              }`}
                            />
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                                item.badge === 'Gemini'
                                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                                  : item.badge === 'Live' || item.badge === 'Active'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          ))}

          {/* Engine Status Banner */}
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-md">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-300">
                Optimization Mesh
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">CP-SAT</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed mb-2">
              Fair multi-objective slot allocation active.
            </p>
            <div className="w-full bg-slate-800 rounded-full h-1">
              <div className="bg-gradient-to-r from-cyan-400 to-violet-500 h-1 rounded-full w-[94%]" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
