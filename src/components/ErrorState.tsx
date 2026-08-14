interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-red-800/60 bg-red-950/30 p-12 text-center">
      <span className="text-3xl" aria-hidden="true">
        &#9888;
      </span>
      <div>
        <h2 className="text-base font-semibold text-red-200">Something went wrong</h2>
        {message ? <p className="mt-1 text-sm text-red-300/80">{message}</p> : null}
      </div>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-red-500/90 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-400"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
