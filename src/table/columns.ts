import {
  createColumnHelper,
  type RowData,
} from "@tanstack/react-table";
import type { Asset } from "../types/asset";
import { formatCurrency } from "../utils/format";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    align: "left" | "right";
    kind: "name" | "ticker" | "monetary" | "default";
    label: string;
  }
}

const columnHelper = createColumnHelper<Asset>();

export const assetColumns = [
  columnHelper.accessor("name", {
    header: "Name",
    meta: { align: "left", kind: "name", label: "Name" },
  }),
  columnHelper.accessor("ticker", {
    header: "Ticker",
    meta: { align: "left", kind: "ticker", label: "Ticker" },
  }),
  columnHelper.accessor("assetType", {
    header: "Type",
    meta: { align: "left", kind: "default", label: "Type" },
  }),
  columnHelper.accessor("currency", {
    header: "Currency",
    meta: { align: "left", kind: "default", label: "Currency" },
  }),
  columnHelper.accessor("quantity", {
    header: "Quantity",
    cell: (info) => info.getValue<number>().toLocaleString("en-US"),
    meta: { align: "right", kind: "default", label: "Quantity" },
  }),
  columnHelper.accessor("unitPrice", {
    header: "Unit Price",
    cell: (info) => formatCurrency(info.getValue<number>(), info.row.original.currency),
    meta: { align: "right", kind: "monetary", label: "Unit Price" },
  }),
  columnHelper.accessor("marketValue", {
    header: "Market Value",
    cell: (info) => formatCurrency(info.getValue<number>(), info.row.original.currency),
    meta: { align: "right", kind: "monetary", label: "Market Value" },
  }),
];
