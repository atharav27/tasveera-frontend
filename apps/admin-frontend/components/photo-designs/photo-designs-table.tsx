"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";

import {
  DataTable,
  DataTableColumnHeader,
  StatusBadge,
  Input,
  DataTableToolbar,
  ActionsDropdown,
  type ActionItem,
} from "@corpora/ui";
import { useDataTable } from "@/hooks/use-data-table";
import { PhotoDesign } from "./mock-data";
import { format } from "date-fns";

interface PhotoDesignsTableProps {
  data: PhotoDesign[];
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}

export function PhotoDesignsTable({ 
  data, 
  onDelete,
  onToggleActive,
}: PhotoDesignsTableProps) {
  const router = useRouter();

  const columns = React.useMemo<ColumnDef<PhotoDesign>[]>(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="ID" />
        ),
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => router.push(`/catalog/photo-designs/${row.original.id}`)}
            className="font-medium text-primary hover:underline text-left uppercase text-xs"
          >
            {row.getValue("id")}
          </button>
        ),
      },
      {
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Title" />
        ),
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium">{row.getValue("title")}</span>
            <span className="text-xs text-muted-foreground line-clamp-1">{row.original.slug}</span>
          </div>
        ),
      },
      {
        accessorKey: "requiredImages",
        header: "Req. Images",
        cell: ({ row }) => <span className="font-medium">{row.getValue("requiredImages")}</span>,
      },
      {
          accessorKey: "sortOrder",
          header: "Sort Order",
          cell: ({ row }) => <span className="text-xs text-muted-foreground">#{row.getValue("sortOrder")}</span>,
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
          <span className="text-xs text-muted-foreground">
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
              onClick: () => router.push(`/catalog/photo-designs/${design.id}`),
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
              onClick: () => onDelete(design.id),
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
    [router, onToggleActive, onDelete]
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount: 1,
    initialState: {
      sorting: [{ id: "sortOrder", desc: false }],
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
                    placeholder="Search Photo Designs...."
                    className="pl-11 h-11 sm:h-12 rounded-full bg-muted/30 border-none w-full"
                    value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => {
                        table.getColumn("title")?.setFilterValue(event.target.value);
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
    </>
  );
}
