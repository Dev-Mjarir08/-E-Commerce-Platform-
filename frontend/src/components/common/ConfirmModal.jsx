import React, { useEffect } from 'react';
import { AlertTriangle, Database, Trash2, Info, CheckCircle, X } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  title = 'Confirmation Required',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'default', // 'default' | 'danger' | 'warning' | 'database' | 'info' | 'alert'
  isAlert = false,
  onConfirm,
  onCancel
}) => {
  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const renderIcon = () => {
    switch (type) {
      case 'danger':
        return (
          <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <Trash2 className="w-6 h-6" />
          </div>
        );
      case 'database':
        return (
          <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
            <Database className="w-6 h-6" />
          </div>
        );
      case 'warning':
        return (
          <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
        );
      case 'success':
        return (
          <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
        );
      case 'info':
      default:
        return (
          <div className="w-12 h-12 rounded-full bg-[#E5E3DF]/50 border border-[#D4CEC5] flex items-center justify-center text-[#111111] shrink-0">
            <Info className="w-6 h-6" />
          </div>
        );
    }
  };

  const getConfirmButtonStyles = () => {
    if (type === 'danger') {
      return 'bg-rose-600 hover:bg-rose-700 text-white border border-rose-600';
    }
    if (type === 'database') {
      return 'bg-[#111111] hover:bg-[#2a2a2a] text-[#F8F7F4] border border-[#111111]';
    }
    return 'bg-[#111111] hover:bg-[#2a2a2a] text-[#F8F7F4] border border-[#111111]';
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative bg-[#F8F7F4] border border-[#E5E3DF] text-[#111111] w-full max-w-lg shadow-2xl p-6 sm:p-8 transition-all scale-100 z-10 space-y-6"
      >
        {/* Close Icon (Top Right) */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-5 right-5 text-[#8E877F] hover:text-[#111111] transition-colors p-1.5 focus:outline-hidden"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Icon & Title */}
        <div className="flex items-start gap-4">
          {renderIcon()}
          <div className="space-y-1.5 flex-1 pr-6">
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#8E877F] uppercase block">
              ATELIER SYSTEM VERIFICATION
            </span>
            <h3
              id="modal-title"
              className="font-serif text-xl sm:text-2xl font-normal text-[#111111] tracking-tight leading-snug"
            >
              {title}
            </h3>
          </div>
        </div>

        {/* Message Body */}
        <div className="bg-[#FFFFFF] border border-[#E5E3DF] p-4 text-sm text-[#444444] font-sans leading-relaxed">
          {message}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
          {!isAlert && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-mono uppercase tracking-[0.2em] text-[#666666] hover:text-[#111111] border border-[#E5E3DF] hover:border-[#111111] bg-transparent transition-all duration-200"
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            autoFocus
            onClick={onConfirm}
            className={`w-full sm:w-auto px-6 py-2.5 text-xs font-mono uppercase tracking-[0.2em] transition-all duration-200 shadow-xs ${getConfirmButtonStyles()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
