import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          className={`w-full rounded-xl bg-slate-950/70 border text-sm text-slate-100 placeholder-slate-500 py-2.5 px-4 
            ${Icon ? 'pl-10' : ''} 
            ${error ? 'border-rose-500/80 focus:border-rose-400 focus:ring-rose-500/30' : 'border-slate-800 focus:border-cyan-400 focus:ring-cyan-500/30'}
            focus:outline-none focus:ring-2 transition-all duration-200 backdrop-blur-sm ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-400">{error}</p>}
      {!error && helperText && (
        <p className="text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
};

export const Select = ({
  label,
  error,
  options = [],
  children,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
          {label}
        </label>
      )}
      <select
        className={`w-full rounded-xl bg-slate-950/70 border text-sm text-slate-100 py-2.5 px-4 
          ${error ? 'border-rose-500/80 focus:border-rose-400 focus:ring-rose-500/30' : 'border-slate-800 focus:border-cyan-400 focus:ring-cyan-500/30'}
          focus:outline-none focus:ring-2 transition-all duration-200 backdrop-blur-sm ${className}`}
        {...props}
      >
        {children ||
          options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
              {opt.label}
            </option>
          ))}
      </select>
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
};

export default Input;
