interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">
      <span className="text-3xl" aria-hidden="true">
        &#128269;
      </span>
      <div>
        <h2 className="text-base font-semibold text-slate-200">No assets found</h2>
        <p className="mt-1 text-sm text-slate-400">
          {message ?? 'Try adjusting your search or filters.'}
        </p>
      </div>
    </div>
  );
}
