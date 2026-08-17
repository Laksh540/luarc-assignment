import { flexRender, type Row, type Table } from "@tanstack/react-table";
import { useEffect, useRef } from "react";
import { useAssetVirtualizer } from "../hooks/useAssetVirtualizer";
import { useMediaQuery } from "../hooks/useMediaQuery";
import type { Asset } from "../types/asset";

const MOBILE_CARD_GAP = 12;
const MOBILE_CARD_HEIGHT = 120;

type AssetTableProps = {
  table: Table<Asset>;
  onEndReached?: () => void;
};

function AssetRowCells({ row }: { row: Row<Asset> }) {
  return row.getVisibleCells().map((cell) => {
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
        <span
          className={`asset-cell${
            cell.column.id === "quantity" ||
            cell.column.id === "unitPrice" ||
            cell.column.id === "marketValue"
              ? " asset-cell-wrap"
              : ""
          }`}
        >
          {meta.kind === "ticker" ? (
            <span className="asset-ticker">{rendered}</span>
          ) : (
            rendered
          )}
        </span>
      </td>
    );
  });
}

function VirtualSpacer({ height }: { height: number }) {
  if (height <= 0) {
    return null;
  }
  return (
    <tr aria-hidden="true" role="presentation" className="asset-virtual-spacer">
      <td style={{ height }} />
    </tr>
  );
}

export function AssetTable({ table, onEndReached }: AssetTableProps) {
  const wasAtEndRef = useRef(false);
  const rows = table.getRowModel().rows.map((row) => row.original);
  const isMobile = useMediaQuery("(max-width: 639px)");
  const { virtualizer, virtualItems, getTotalSize, scrollMargin, containerRef } =
    useAssetVirtualizer({
      rows,
      estimateSize: isMobile ? MOBILE_CARD_HEIGHT : undefined,
      gap: isMobile ? MOBILE_CARD_GAP : 0,
    });

  useEffect(() => {
    if (!onEndReached || rows.length === 0) {
      wasAtEndRef.current = false;
      return;
    }
    const items = virtualItems;
    if (items.length === 0) {
      return;
    }
    const lastIndex = items[items.length - 1].index;
    const isAtEnd = lastIndex >= rows.length - 1;
    if (isAtEnd && !wasAtEndRef.current) {
      onEndReached();
    }
    wasAtEndRef.current = isAtEnd;
  }, [virtualItems, rows.length, onEndReached]);

  const firstItem = virtualItems[0];
  const lastItem = virtualItems[virtualItems.length - 1];
  const totalSize = getTotalSize();
  const topSpacerHeight = firstItem ? firstItem.start - scrollMargin : 0;
  const bottomSpacerHeight = totalSize - (lastItem ? lastItem.end - scrollMargin : 0);

  return (
    <div
      ref={containerRef}
      className="asset-table-scroll custom-scrollbar sm:rounded-2xl sm:border sm:border-slate-800"
    >
      <table className="asset-table w-full border-collapse text-sm">
        <colgroup>
          <col style={{ width: "150px" }} />
          <col style={{ width: "85px" }} />
          <col style={{ width: "110px" }} />
          <col style={{ width: "112px" }} />
          <col style={{ width: "108px" }} />
          <col style={{ width: "120px" }} />
          <col style={{ width: "150px" }} />
        </colgroup>
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
                    <span className="asset-cell">{meta.label}</span>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="block sm:table-row-group sm:divide-y sm:divide-slate-800/70 sm:bg-slate-900">
          <VirtualSpacer height={topSpacerHeight} />
          {virtualItems.map((item) => {
            const row = table.getRowModel().rows[item.index];
            if (!row) {
              return null;
            }
            return (
              <tr
                key={row.id}
                ref={virtualizer.measureElement}
                data-index={item.index}
                className={`transition-colors hover:bg-slate-800/50 ${
                  item.index % 2 === 0 ? "bg-slate-900" : "bg-slate-900/60"
                }`}
              >
                <AssetRowCells row={row} />
              </tr>
            );
          })}
          <VirtualSpacer height={bottomSpacerHeight} />
        </tbody>
      </table>
    </div>
  );
}
