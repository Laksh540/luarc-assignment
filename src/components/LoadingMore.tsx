export function LoadingMore() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[48px] items-center justify-center gap-3 py-4 text-sm text-slate-400"
    >
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-cyan-400" />
      <span>Loading more assets&hellip;</span>
    </div>
  );
}
