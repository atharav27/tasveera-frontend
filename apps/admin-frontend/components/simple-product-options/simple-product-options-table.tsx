"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";
import Image from "next/image";

import {
  DataTable,
  DataTableColumnHeader,
  StatusBadge,
  Input,
  DataTableToolbar,
  CommonAlertDialog,
  ActionsDropdown,
  type ActionItem,
} from "@corpora/ui";
import { useDataTable } from "@/hooks/use-data-table";
import { SimpleProductOption } from "./mock-data";
import { format } from "date-fns";

interface SimpleProductOptionsTableProps {
  data: SimpleProductOption[];
  pageCount: number;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}

export function SimpleProductOptionsTable({ 
  data, 
  pageCount, 
  onDelete,
  onToggleActive,
}: SimpleProductOptionsTableProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);

  const columns = React.useMemo<ColumnDef<SimpleProductOption>[]>(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="ID" />
        ),
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => router.push(`/catalog/simple-product-options/${row.original.id}`)}
            className="font-medium text-primary hover:underline text-left uppercase text-xs"
          >
            {row.getValue("id")}
          </button>
        ),
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Name" />
        ),
        cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
      },
      {
        accessorKey: "productId",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Product ID" />
        ),
        cell: ({ row }) => <span className="text-xs font-mono">{row.getValue("productId")}</span>,
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => <span className="font-semibold">₹{row.getValue("price")}</span>,
      },
      {
        accessorKey: "stock",
        header: "Stock",
        cell: ({ row }) => {
            const stock = row.getValue("stock") as number;
            return (
                <span className={`font-medium text-sm ${stock === 0 ? 'text-red-500' : stock < 10 ? 'text-amber-500' : 'text-slate-600'}`}>
                    {stock} units
                </span>
            );
        },
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
          <StatusBadge 
            status={row.getValue("isActive") ? "Active" : "Inactive"} 
            text={row.getValue("isActive") ? "Active" : "Inactive"}
            statusToVariant={{ "Active": "green", "Inactive": "red" }}
          />
        ),
        meta: {
          label: "Active Status",
          variant: "multiSelect",
          options: [
            { label: "Active", value: "true" },
            { label: "Inactive", value: "false" },
          ]
        }
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Created At" />
        ),
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {format(new Date(row.getValue("createdAt")), "MMM d, yyyy")}
          </span>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const option = row.original;
          const items: ActionItem[] = [
            {
              label: "View / Edit",
              icon: "pencil",
              onClick: () => router.push(`/catalog/simple-product-options/${option.id}`),
            },
            {
              label: option.isActive ? "Deactivate" : "Activate",
              icon: option.isActive ? "xcircle" : "circleCheckBig",
              onClick: () => onToggleActive(option.id),
            },
            {
              label: "Delete Option",
              icon: "trash2",
              variant: "destructive",
              onClick: () => setIsDeleting(option.id),
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
    [router, onToggleActive]
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
    },
    getRowId: (row) => row.id,
    shallow: false,
  });

  return (
    <>
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6 px-4 pt-4">
            <div className="relative w-full lg:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search Options...."
                    className="pl-11 h-11 sm:h-12 rounded-full bg-muted/30 border-none w-full"
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => {
                        table.getColumn("name")?.setFilterValue(event.target.value);
                    }}
                />
            </div>
            <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
                <DataTableToolbar
                    table={table}
                    className="p-0 border-none bg-transparent"
                />
            </div>
        </div>
        <DataTable
            table={table}
            className="border-none"
            tableWrapperClassName="border-t overflow-hidden"
        />

        <CommonAlertDialog
            open={!!isDeleting}
            onOpenChange={(open) => !open && setIsDeleting(null)}
            title="Delete Simple Product Option"
            subtitle="Are you sure you want to delete this option? Action cannot be undone."
            variant="error"
            ImageComponent={Image}
            buttons={[
                { label: "Cancel", onClick: () => setIsDeleting(null), variant: "outline" },
                { label: "Delete Permanently", onClick: () => isDeleting && onDelete(isDeleting), variant: "destructive" },
            ]}
        />
    </>
  );
}
