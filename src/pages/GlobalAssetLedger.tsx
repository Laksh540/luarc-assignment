import { SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { AssetTable } from "../components/AssetTable";
import { Dropdown } from "../components/Dropdown";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { SearchInput } from "../components/SearchInput";
import { ASSET_TYPE_OPTIONS, CURRENCY_OPTIONS } from "../constants/filters";
import { useAssets } from "../hooks/useAssets";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

function GlobalAssetLedger() {
  const [search, setSearch] = useState("");
  const [assetType, setAssetType] = useState("");
  const [currency, setCurrency] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const debouncedSearch = useDebouncedValue(search, 300);
  const trimmedSearch = debouncedSearch.trim();

  const query = useMemo(
    () => ({
      page: 1,
      limit: 50,
      ...(trimmedSearch && { search: trimmedSearch }),
      ...(assetType && { assetType }),
      ...(currency && { currency }),
    }),
    [trimmedSearch, assetType, currency]
  );
  const result = useAssets(query);

  const isSearching =
    search !== debouncedSearch ||
    (result.status === "loading" && trimmedSearch.length > 0);

  const isInitialLoading = result.status === "loading";

  const emptyMessage = useMemo(() => {
    const filters: string[] = [];
    if (trimmedSearch) filters.push(`matching "${trimmedSearch}"`);
    if (assetType) filters.push(`with type "${assetType}"`);
    if (currency) filters.push(`in currency "${currency}"`);

    if (filters.length === 0) {
      return undefined;
    }
    return `No assets found ${filters.join(" and ")}.`;
  }, [trimmedSearch, assetType, currency]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <section className="mx-auto max-w-4xl">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Global Asset Ledger
          </h1>
          <p className="mt-2 text-base text-slate-400">
            Search and browse assets across the global ledger.
          </p>

        </header>

        <div className="sticky top-0 z-30 -mx-6 border-y border-slate-800 bg-slate-950 px-6 py-3">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((open) => !open)}
              aria-expanded={mobileFiltersOpen}
              aria-controls="asset-filters"
              className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:border-slate-700 hover:text-slate-100 sm:hidden"
            >
              {mobileFiltersOpen ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              )}
              {mobileFiltersOpen ? "Close filters" : "Search and filter"}
            </button>

            <div
              id="asset-filters"
              className={`${mobileFiltersOpen ? "flex" : "hidden"} flex-col gap-3 sm:flex sm:flex-row sm:items-center`}
            >
              <SearchInput
                value={search}
                onChange={setSearch}
                isSearching={isSearching}
                className="flex-1"
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Dropdown
                  id="filter-asset-type"
                  label="Filter by Asset Type"
                  value={assetType}
                  options={ASSET_TYPE_OPTIONS}
                  onChange={setAssetType}
                  placeholder="All Asset Types"
                  className="w-full sm:w-44"
                />
                <Dropdown
                  id="filter-currency"
                  label="Filter by Currency"
                  value={currency}
                  options={CURRENCY_OPTIONS}
                  onChange={setCurrency}
                  placeholder="All Currencies"
                  className="w-full sm:w-40"
                />
              </div>
            </div>
        </div>

        {isInitialLoading ? <LoadingState /> : null}

        {result.status === "error" ? (
          <ErrorState message={result.error.message} onRetry={result.refetch} />
        ) : null}

        {result.status === "success" ? (
          result.data.assets.length === 0 ? (
            <EmptyState message={emptyMessage} />
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-slate-400">
                Showing{" "}
                <span className="font-semibold text-cyan-300">
                  {result.data.assets.length.toLocaleString()}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-200">
                  {result.data.metadata.total.toLocaleString()}
                </span>{" "}
                assets
              </p>
              <AssetTable assets={result.data.assets} />
            </div>
          )
        ) : null}
      </section>
    </main>
  );
}

export default GlobalAssetLedger;
