"use client";

import * as React from "react";
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
import { Tag } from "./mock-data";

interface TagsTableProps {
  data: Tag[];
  onEdit: (tag: Tag) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}

export function TagsTable({ 
  data, 
  onEdit,
  onDelete,
  onToggleActive,
}: TagsTableProps) {
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);

  const columns = React.useMemo<ColumnDef<Tag>[]>(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Tag ID" />
        ),
        cell: ({ row }) => <span className="text-xs font-mono uppercase text-slate-400">{row.getValue("id")}</span>,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Name" />
        ),
        cell: ({ row }) => <span className="font-bold text-slate-900">{row.getValue("name")}</span>,
      },
      {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.getValue("slug")}</span>,
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
        id: "actions",
        cell: ({ row }) => {
          const tag = row.original;
          const items: ActionItem[] = [
            {
              label: "Edit Tag",
              icon: "pencil",
              onClick: () => onEdit(tag),
            },
            {
                label: tag.isActive ? "Deactivate" : "Activate",
                icon: tag.isActive ? "xcircle" : "circleCheckBig",
                onClick: () => onToggleActive(tag.id),
            },
            {
              label: "Delete Tag",
              icon: "trash2",
              variant: "destructive",
              onClick: () => setIsDeleting(tag.id),
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
    [onEdit, onToggleActive]
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount: 1,
    getRowId: (row) => row.id,
    shallow: false,
  });

  return (
    <>
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6 px-4 pt-4">
            <div className="relative w-full lg:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search Tags...."
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
            title="Delete Tag"
            subtitle="Are you sure you want to delete this tag? This will set it as inactive (soft delete)."
            variant="error"
            ImageComponent={Image}
            buttons={[
                { label: "Cancel", onClick: () => setIsDeleting(null), variant: "outline" },
                { label: "Deactivate", onClick: () => {
                    if (isDeleting) {
                        onDelete(isDeleting);
                        setIsDeleting(null);
                    }
                }, variant: "destructive" },
            ]}
        />
    </>
  );
}
