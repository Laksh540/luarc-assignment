import type { Asset } from "../types/asset";

type AssetTableProps = {
  assets: Asset[];
};

const COLUMNS: { key: keyof Asset; label: string; align: "left" | "right" }[] =
  [
    { key: "name", label: "Name", align: "left" },
    { key: "ticker", label: "Ticker", align: "left" },
    { key: "assetType", label: "Type", align: "left" },
    { key: "currency", label: "Currency", align: "left" },
    { key: "quantity", label: "Quantity", align: "right" },
    { key: "unitPrice", label: "Unit Price", align: "right" },
    { key: "marketValue", label: "Market Value", align: "right" },
  ];

function formatCellValue(key: keyof Asset, value: Asset[keyof Asset]): string {
  if (key === "unitPrice" || key === "marketValue") {
    return (value as number).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  if (key === "quantity") {
    return (value as number).toLocaleString("en-US");
  }
  return String(value);
}

export function AssetTable({ assets }: AssetTableProps) {
  return (
    <div className="asset-table-scroll custom-scrollbar sm:rounded-2xl sm:border sm:border-slate-800">
      <table className="asset-table w-full min-w-[700px] border-collapse text-sm">
        <thead className="hidden sm:table-header-group">
          <tr className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm">
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 ${
                  col.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="block sm:table-row-group sm:divide-y sm:divide-slate-800/70 sm:bg-slate-900">
          {assets.map((asset, idx) => (
            <tr
              key={asset.id}
              className={`transition-colors hover:bg-slate-800/50 ${
                idx % 2 === 0 ? "bg-slate-900" : "bg-slate-900/60"
              }`}
            >
              {COLUMNS.map((col) => {
                const value = asset[col.key];
                const formatted = formatCellValue(col.key, value);
                const isMonetary =
                  col.key === "unitPrice" || col.key === "marketValue";

                return (
                  <td
                    key={col.key}
                    data-label={
                      col.key === "name" || col.key === "ticker"
                        ? undefined
                        : col.label
                    }
                    className={`px-4 py-3 ${
                      col.align === "right" ? "text-right" : "text-left"
                    } ${
                      col.key === "name"
                        ? "font-medium text-slate-100"
                        : col.key === "ticker"
                          ? "font-mono font-semibold text-cyan-300"
                          : isMonetary
                            ? "font-mono text-slate-200"
                            : "text-slate-300"
                    }`}
                  >
                    {col.key === "ticker" ? (
                      <span className="asset-ticker">{formatted}</span>
                    ) : (
                      formatted
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
