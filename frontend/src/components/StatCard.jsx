import React from 'react';
import GlassCard from './GlassCard';

export const StatCard = ({
  title,
  value,
  trend,
  trendDirection = 'up', // 'up' | 'down' | 'neutral'
  icon: Icon,
  subtitle,
  color = 'cyan', // 'cyan' | 'violet' | 'emerald' | 'amber'
  className = '',
}) => {
  const colorGradients = {
    cyan: 'from-cyan-500/15 via-sky-500/5 to-transparent text-cyan-400 border-cyan-500/20',
    violet: 'from-violet-500/15 via-purple-500/5 to-transparent text-violet-400 border-violet-500/20',
    emerald: 'from-emerald-500/15 via-teal-500/5 to-transparent text-emerald-400 border-emerald-500/20',
    amber: 'from-amber-500/15 via-yellow-500/5 to-transparent text-amber-400 border-amber-500/20',
  };

  return (
    <GlassCard
      hoverEffect
      className={`relative overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {Icon && (
          <div
            className={`p-2.5 rounded-xl border bg-gradient-to-br ${colorGradients[color]}`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-white">
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-medium inline-flex items-center gap-0.5 ${
              trendDirection === 'up'
                ? 'text-emerald-400'
                : trendDirection === 'down'
                ? 'text-rose-400'
                : 'text-slate-400'
            }`}
          >
            {trendDirection === 'up' ? '↑' : trendDirection === 'down' ? '↓' : '•'} {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-slate-400">{subtitle}</p>
      )}
    </GlassCard>
  );
};

export default StatCard;
