function App() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <section className="mx-auto max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-cyan-950/30">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
            Tailwind CSS is working
          </p>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Global Asset Ledger
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate-400">
          This responsive test panel confirms that Tailwind utilities, colors,
          spacing, typography, borders, shadows, and breakpoints are active.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            ["Pagination", "Ready"],
            ["Virtualization", "Ready"],
            ["Responsive UI", "Ready"],
          ].map(([label, status]) => (
            <div
              key={label}
              className="rounded-xl border border-slate-700 bg-slate-800/70 p-4"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-2 font-semibold text-cyan-300">{status}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
