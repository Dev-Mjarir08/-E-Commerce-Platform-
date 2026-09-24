import React from 'react';
import { CheckCircle2, Info, AlertCircle, AlertTriangle, X } from 'lucide-react';

export const Toast = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  const renderIcon = (type) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />;
      case 'info':
        return <Info className="w-4 h-4 text-[#D4CEC5] shrink-0" />;
      case 'success':
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
    }
  };

  const getAccentBorder = (type) => {
    switch (type) {
      case 'error':
        return 'border-l-rose-500';
      case 'warning':
        return 'border-l-amber-400';
      case 'info':
        return 'border-l-[#D4CEC5]';
      case 'success':
      default:
        return 'border-l-emerald-400';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9998] flex flex-col gap-3 pointer-events-none max-w-md w-full px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto bg-[#111111] text-[#F8F7F4] border border-[#2A2A2A] border-l-4 ${getAccentBorder(
            toast.type
          )} p-4 shadow-2xl flex items-start justify-between gap-3.5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3`}
        >
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="mt-0.5">{renderIcon(toast.type)}</div>
            <div className="space-y-1 flex-1 min-w-0">
              <span className="text-[9px] font-mono tracking-[0.25em] text-[#8E877F] uppercase block">
                {toast.type === 'error'
                  ? 'ATELIER ALERT'
                  : toast.type === 'warning'
                  ? 'ATELIER NOTICE'
                  : 'ATELIER UPDATE'}
              </span>
              <p className="text-xs font-sans text-[#F0EFEB] leading-relaxed break-words">
                {toast.message}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            className="text-[#8E877F] hover:text-[#FFFFFF] transition-colors p-1 shrink-0 mt-0.5"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
