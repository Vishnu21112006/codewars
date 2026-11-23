import React from 'react';
import { AlertCircle, RefreshCw, ServerCrash } from 'lucide-react';
import Button from './Button';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <div
        className={`${sizes[size]} rounded-full border-slate-700/60 border-t-cyan-400 border-r-violet-500 animate-spin`}
      />
    </div>
  );
};

export const LoadingState = ({ message = 'Loading laboratory resources...', className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <div className="relative mb-4">
        <Spinner size="lg" />
        <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl animate-pulse" />
      </div>
      <p className="text-sm font-medium text-slate-300 tracking-wide">{message}</p>
      <span className="text-xs text-slate-500 mt-1">Connecting to LabLink mesh services</span>
    </div>
  );
};

export const ErrorState = ({
  title = 'Failed to load resources',
  message = 'There was an issue retrieving laboratory data. Ensure backend services are running.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`rounded-2xl border border-rose-900/40 bg-rose-950/20 backdrop-blur-xl p-8 text-center max-w-lg mx-auto ${className}`}
    >
      <div className="mx-auto w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4 shadow-lg shadow-rose-950/50">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-lg font-bold text-white mb-1.5">{title}</h4>
      <p className="text-xs text-rose-300/80 mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          icon={RefreshCw}
          className="hover:border-rose-400/50"
        >
          Retry Connection
        </Button>
      )}
    </div>
  );
};

export const AlertBanner = ({
  type = 'info', // 'info' | 'warning' | 'error' | 'success'
  title,
  message,
  onClose,
  className = '',
}) => {
  const styles = {
    info: 'bg-cyan-950/30 border-cyan-500/30 text-cyan-300',
    warning: 'bg-amber-950/30 border-amber-500/30 text-amber-300',
    error: 'bg-rose-950/30 border-rose-500/30 text-rose-300',
    success: 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300',
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md ${styles[type]} ${className}`}
    >
      <div className="flex-1">
        {title && <h5 className="font-semibold text-sm mb-0.5">{title}</h5>}
        {message && <p className="text-xs opacity-90 leading-relaxed">{message}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-xs opacity-60 hover:opacity-100 p-1 transition-opacity"
        >
          ✕
        </button>
      )}
    </div>
  );
};
