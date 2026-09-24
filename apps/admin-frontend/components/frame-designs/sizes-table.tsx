"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import {
  DataTable,
  DataTableColumnHeader,
  StatusBadge,
  ActionsDropdown,
  type ActionItem,
} from "@corpora/ui";
import { useDataTable } from "@/hooks/use-data-table";
import { FrameDesignSize } from "./mock-data";

interface SizesTableProps {
  data: FrameDesignSize[];
  onEdit: (size: FrameDesignSize) => void;
  onUpdateStock: (size: FrameDesignSize) => void;
  onDelete: (id: string) => void;
}

export function SizesTable({ 
  data, 
  onEdit,
  onUpdateStock,
  onDelete,
}: SizesTableProps) {

  const columns = React.useMemo<ColumnDef<FrameDesignSize>[]>(
    () => [
      {
        accessorKey: "label",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Label" />
        ),
        cell: ({ row }) => (
          <span className="font-medium">{row.getValue("label")}</span>
        ),
      },
      {
        id: "dimensions",
        header: "Dimensions (W x H)",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.width}" × {row.original.height}"
          </span>
        ),
      },
      {
        accessorKey: "price",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Price" />
        ),
        cell: ({ row }) => {
          const price = parseFloat(row.getValue("price") as string);
          return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
        },
      },
      {
        id: "discount",
        header: "Discount",
        cell: ({ row }) => {
          const discount = row.original.discount;
          const type = row.original.discountType;
          if (!discount) return "-";
          return type === 'PERCENTAGE' ? `${discount}%` : `₹${discount}`;
        },
      },
      {
        accessorKey: "stock",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Stock" />
        ),
        cell: ({ row }) => {
          const stock = parseInt(row.getValue("stock") as string, 10);
          return (
            <span className={`font-semibold ${stock <= 5 ? (stock === 0 ? "text-destructive" : "text-amber-500") : ""}`}>
              {stock}
            </span>
          );
        },
      },
      {
        accessorKey: "isAvailable",
        header: "Availability",
        cell: ({ row }) => (
          <StatusBadge 
            status={row.getValue("isAvailable") ? "Available" : "Unavailable"} 
            text={row.getValue("isAvailable") ? "Available" : "Unavailable"}
            statusToVariant={{ "Available": "green", "Unavailable": "red" }}
          />
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const size = row.original;
          const items: ActionItem[] = [
            {
              label: "Edit Size",
              icon: "pencil",
              onClick: () => onEdit(size),
            },
            {
              label: "Update Stock",
              icon: "trendingUp",
              onClick: () => onUpdateStock(size),
            },
            {
              label: "Delete Size",
              icon: "trash2",
              variant: "destructive",
              onClick: () => onDelete(size.id),
            },
          ];

          return (
            <div className="flex justify-end">
              <ActionsDropdown items={items} />
            </div>
          );
        },
      },
    ],
    [onEdit, onUpdateStock, onDelete]
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount: 1,
    initialState: {
      sorting: [{ id: "label", desc: false }],
    },
    getRowId: (row) => row.id,
    shallow: false,
  });

  return (
    <DataTable
        table={table}
        className="border-none"
        tableWrapperClassName="border rounded-xl overflow-hidden"
    />
  );
}
