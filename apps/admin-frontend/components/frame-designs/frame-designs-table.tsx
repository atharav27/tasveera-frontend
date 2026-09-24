"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { 
  Search, 
} from "lucide-react";
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
import { FrameDesign } from "./mock-data";
import { format } from "date-fns";

interface FrameDesignsTableProps {
  data: FrameDesign[];
  pageCount: number;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}

export function FrameDesignsTable({ 
  data, 
  pageCount, 
  onDelete,
  onToggleActive,
}: FrameDesignsTableProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);

  const columns = React.useMemo<ColumnDef<FrameDesign>[]>(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="ID" />
        ),
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => router.push(`/catalog/frame-designs/${row.original.id}`)}
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
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium">{row.getValue("name")}</span>
            <span className="text-xs text-muted-foreground line-clamp-1">{row.original.slug}</span>
          </div>
        ),
      },
      {
        accessorKey: "productId",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Product ID" />
        ),
        cell: ({ row }) => <span className="text-sm font-medium">{row.getValue("productId")}</span>,
        meta: { label: "Product ID", variant: "text" }
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
          <span className="text-sm text-muted-foreground">
            {format(new Date(row.getValue("createdAt")), "MMM d, yyyy")}
          </span>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const design = row.original;
          const items: ActionItem[] = [
            {
              label: "View / Edit",
              icon: "pencil",
              onClick: () => router.push(`/catalog/frame-designs/${design.id}`),
            },
            {
              label: design.isActive ? "Deactivate" : "Activate",
              icon: design.isActive ? "xcircle" : "circleCheckBig",
              onClick: () => onToggleActive(design.id),
            },
            {
              label: "Delete Design",
              icon: "trash2",
              variant: "destructive",
              onClick: () => setIsDeleting(design.id),
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
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
            <div className="relative w-full lg:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search Frame Designs...."
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
            tableWrapperClassName="border rounded-xl overflow-hidden"
        />

        <CommonAlertDialog
            open={!!isDeleting}
            onOpenChange={(open) => !open && setIsDeleting(null)}
            title="Delete Frame Design"
            subtitle="Are you sure you want to delete this frame design? This action cannot be undone and may fail if referenced by orders."
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
