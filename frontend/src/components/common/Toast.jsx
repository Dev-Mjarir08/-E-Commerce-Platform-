import { CheckCircle2, Info, X } from 'lucide-react';

export const Toast = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#111111] text-[#F8F7F4] border-l-2 border-[#D4CEC5] px-4 py-3.5 shadow-2xl flex items-center justify-between gap-3 text-xs tracking-wider uppercase font-mono transition-all duration-300 translate-y-0 opacity-100"
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'info' ? (
              <Info className="w-4 h-4 text-[#D4CEC5]" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#D4CEC5]" />
            )}
            <span className="text-[11px] normal-case font-sans tracking-normal">{toast.message}</span>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-[#888888] hover:text-[#FFFFFF] transition-colors p-1"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
