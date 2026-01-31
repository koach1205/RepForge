import { useEffect } from 'react';

export default function ConfirmModal({
  open,
  onClose,
  title = 'Confirm',
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  variant = 'danger',
}) {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const variantStyles = {
    danger: 'bg-red-600 hover:bg-red-500 text-white',
    primary: 'bg-amber-500 hover:bg-amber-400 text-slate-900',
  };
  const btnClass = variantStyles[variant] ?? variantStyles.primary;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-slate-800 border border-slate-600 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5">
          <h2 id="modal-title" className="text-lg font-semibold text-slate-100">
            {title}
          </h2>
          <p className="mt-2 text-sm text-slate-400">{message}</p>
        </div>
        <div className="flex gap-3 p-5 pt-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-slate-600 text-slate-300 text-sm font-medium hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${btnClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
