import React from 'react';

export const GlassCard = ({
  children,
  title,
  subtitle,
  icon: Icon,
  headerAction,
  hoverEffect = false,
  gradientGlow = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl p-6 shadow-glass 
        ${hoverEffect ? 'transition-all duration-300 hover:border-slate-700/80 hover:bg-slate-900/70 hover:shadow-glow-blue/20 hover:-translate-y-0.5' : ''}
        ${gradientGlow ? 'before:absolute before:-top-24 before:-right-24 before:w-48 before:h-48 before:bg-gradient-to-br before:from-cyan-500/10 before:to-violet-500/10 before:blur-3xl before:rounded-full before:pointer-events-none' : ''}
        ${className}`}
      {...props}
    >
      {(title || subtitle || Icon || headerAction) && (
        <div className="flex items-start justify-between mb-5 gap-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/10 to-violet-500/20 border border-cyan-500/20 text-cyan-400">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-base font-semibold text-slate-100 tracking-tight">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default GlassCard;
