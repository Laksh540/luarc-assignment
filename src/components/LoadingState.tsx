export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-12">
      <span className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />
      <p className="text-sm font-medium text-slate-400">Loading assets&hellip;</p>
    </div>
  );
}
