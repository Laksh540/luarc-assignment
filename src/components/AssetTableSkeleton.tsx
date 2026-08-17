const SKELETON_ROWS = 8;

const rowWidths = [
  "w-3/4",
  "w-2/5",
  "w-1/3",
  "w-1/4",
  "w-1/5",
  "w-1/3",
  "w-1/3",
];

export function AssetTableSkeleton() {
  return (
    <div role="status" aria-live="polite" aria-label="Loading assets">
      <table className="asset-table w-full min-w-[700px] border-collapse text-sm sm:rounded-2xl sm:border sm:border-slate-800">
        <thead className="hidden sm:table-header-group">
          <tr className="border-b border-slate-800 bg-slate-900">
            {["Name", "Ticker", "Type", "Currency", "Quantity", "Unit Price", "Market Value"].map(
              (label) => (
                <th
                  key={label}
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400"
                >
                  {label}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody className="block sm:table-row-group sm:divide-y sm:divide-slate-800/70 sm:bg-slate-900">
          {Array.from({ length: SKELETON_ROWS }).map((_, rowIndex) => (
            <tr
              key={rowIndex}
              className={rowIndex % 2 === 0 ? "bg-slate-900" : "bg-slate-900/60"}
            >
              {rowWidths.map((width, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3">
                  <span
                    className={`skeleton-bar block h-3.5 rounded ${width} ${
                      cellIndex >= 4 ? "ml-auto" : ""
                    }`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
