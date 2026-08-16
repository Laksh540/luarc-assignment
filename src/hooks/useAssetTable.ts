import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { assetColumns } from "../table/columns";
import type { Asset, AssetMetadata } from "../types/asset";

const DEFAULT_LIMIT = 50;

export function useAssetTable(data: Asset[], metadata?: AssetMetadata) {
  return useReactTable({
    data,
    columns: assetColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    manualPagination: true,
    pageCount: metadata?.totalPages ?? 0,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: metadata?.limit ?? DEFAULT_LIMIT,
      },
    },
  });
}
