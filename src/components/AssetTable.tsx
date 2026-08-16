import { flexRender, type Table } from "@tanstack/react-table";
import type { Asset } from "../types/asset";

type AssetTableProps = {
  table: Table<Asset>;
};

export function AssetTable({ table }: AssetTableProps) {
  return (
    <div className="asset-table-scroll custom-scrollbar sm:rounded-2xl sm:border sm:border-slate-800">
      <table className="asset-table w-full min-w-[700px] border-collapse text-sm">
        <thead className="hidden sm:table-header-group">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="sticky top-[80px] z-10 border-b border-slate-800 bg-slate-900"
            >
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta!;
                return (
                  <th
                    key={header.id}
                    scope="col"
                    className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 ${
                      meta.align === "right" ? "text-right" : "text-left"
                    }`}
                  >
                    {meta.label}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="block sm:table-row-group sm:divide-y sm:divide-slate-800/70 sm:bg-slate-900">
          {table.getRowModel().rows.map((row, idx) => (
            <tr
              key={row.id}
              className={`transition-colors hover:bg-slate-800/50 ${
                idx % 2 === 0 ? "bg-slate-900" : "bg-slate-900/60"
              }`}
            >
              {row.getVisibleCells().map((cell) => {
                const meta = cell.column.columnDef.meta!;
                const rendered = flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext(),
                );
                const isMonetary = meta.kind === "monetary";
                const textClass =
                  meta.kind === "name"
                    ? "font-medium text-slate-100"
                    : meta.kind === "ticker"
                      ? "font-mono font-semibold text-cyan-300"
                      : isMonetary
                        ? "font-mono text-slate-200"
                        : "text-slate-300";

                return (
                  <td
                    key={cell.id}
                    data-label={
                      meta.kind === "name" || meta.kind === "ticker"
                        ? undefined
                        : meta.label
                    }
                    className={`px-4 py-3 ${
                      meta.align === "right" ? "text-right" : "text-left"
                    } ${textClass}`}
                  >
                    {meta.kind === "ticker" ? (
                      <span className="asset-ticker">{rendered}</span>
                    ) : (
                      rendered
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
