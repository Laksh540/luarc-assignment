import { useMemo } from "react";
import { EmptyState } from "./components/EmptyState";
import { ErrorState } from "./components/ErrorState";
import { LoadingState } from "./components/LoadingState";
import { useAssets } from "./hooks/useAssets";

function App() {
  const query = useMemo(() => ({ page: 1, limit: 50 }), []);
  const result = useAssets(query);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <section className="mx-auto max-w-3xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Global Asset Ledger
          </h1>
          <p className="mt-2 text-base text-slate-400">
            Task 18 &mdash; loading, error, and empty states against the mock
            API.
          </p>
        </header>

        {result.status === "loading" ? <LoadingState /> : null}

        {result.status === "error" ? (
          <ErrorState message={result.error.message} onRetry={result.refetch} />
        ) : null}

        {result.status === "success" ? (
          result.data.assets.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
              <p className="text-sm text-slate-400">
                Loaded <span className="font-semibold text-cyan-300">50</span>{" "}
                assets on page 1.
              </p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {result.data.metadata.total.toLocaleString()}
                <span className="ml-2 text-base font-normal text-slate-400">
                  total assets
                </span>
              </p>
            </div>
          )
        ) : null}
      </section>
    </main>
  );
}

export default App;
