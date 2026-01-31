export default function ErrorBanner({ message, onDismiss }) {
  return (
    <div
      className="flex items-center justify-between gap-3 rounded-lg bg-red-900/20 border border-red-800/50 px-4 py-3 text-sm text-red-300"
      role="alert"
    >
      <span>{message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 p-1 rounded text-red-400 hover:bg-red-900/30 hover:text-red-200"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
