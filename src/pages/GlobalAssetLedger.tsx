import { useMemo, useState } from "react";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { useAssets } from "../hooks/useAssets";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

function GlobalAssetLedger() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);

  const query = useMemo(
    () => ({ page: 1, limit: 50, search: debouncedSearch }),
    [debouncedSearch]
  );
  const result = useAssets(query);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <section className="mx-auto max-w-3xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Global Asset Ledger
          </h1>
          <p className="mt-2 text-base text-slate-400">
            Task 21 &mdash; Global Asset Ledger page.
          </p>

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search assets…"
            className="mt-6 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500"
          />
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
                Loaded{" "}
                <span className="font-semibold text-cyan-300">
                  {result.data.assets.length}
                </span>{" "}
                assets on page {result.data.metadata.page}.
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

export default GlobalAssetLedger;
