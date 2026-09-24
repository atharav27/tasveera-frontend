"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { 
    DataTable, 
    StatusBadge, 
    ActionsDropdown, 
    DataTableColumnHeader,
    Input
} from "@corpora/ui";
import { FrameFeature } from "./mock-data";
import { useRouter } from "next/navigation";
import { GripVertical, Search } from "lucide-react";
import { useDataTable } from "@/hooks/use-data-table";

interface FrameFeaturesTableProps {
  data: FrameFeature[];
  onToggleActive: (id: string) => void;
  onDelete: (id: string) => void;
  isReorderMode?: boolean;
}

export function FrameFeaturesTable({ 
  data, 
  onToggleActive, 
  onDelete,
  isReorderMode = false
}: FrameFeaturesTableProps) {
  const router = useRouter();

  const columns = React.useMemo<ColumnDef<FrameFeature>[]>(() => [
    ...(isReorderMode ? [{
      id: "drag-handle",
      header: "",
      cell: () => (
        <div className="cursor-grab active:cursor-grabbing p-1">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      ),
      size: 40,
    }] : []),
    {
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} label="ID" />,
      cell: ({ row }) => <span className="font-mono text-xs uppercase">{row.original.id}</span>
    },
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} label="Name" />,
      cell: ({ row }) => <span className="font-medium text-slate-900">{row.original.name}</span>
    },
    {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => <span className="text-muted-foreground text-xs font-mono">{row.original.slug}</span>
    },
    {
      accessorKey: "icon",
      header: "Icon",
      cell: ({ row }) => row.original.icon ? <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase tracking-tight">{row.original.icon}</span> : "-"
    },
    {
      accessorKey: "sortOrder",
      header: ({ column }) => <DataTableColumnHeader column={column} label="Order" />,
      cell: ({ row }) => <span className="font-semibold text-slate-700">{row.original.sortOrder}</span>
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge 
          status={row.original.isActive ? "ACTIVE" : "INACTIVE"} 
          text={row.original.isActive ? "Active" : "Inactive"}
          statusToVariant={{ "ACTIVE": "green", "INACTIVE": "red" }} 
        />
      )
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-end pr-2">
            <ActionsDropdown
            items={[
                {
                label: "View/Edit",
                icon: "pencil",
                onClick: () => router.push(`/catalog/frame-features/${row.original.id}`),
                },
                {
                label: row.original.isActive ? "Deactivate" : "Activate",
                icon: row.original.isActive ? "ban" : "circleCheckBig",
                onClick: () => onToggleActive(row.original.id),
                },
                {
                label: "Delete",
                icon: "trash2",
                variant: "destructive",
                onClick: () => onDelete(row.original.id),
                }
            ]}
            />
        </div>
      )
    }
  ], [isReorderMode, router, onToggleActive, onDelete]);

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
    <div className="space-y-4">
        {!isReorderMode && (
            <div className="flex items-center px-4 pt-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search features..."
                        className="pl-10 h-10 rounded-full bg-slate-50 border-none"
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => {
                            table.getColumn("name")?.setFilterValue(event.target.value);
                        }}
                    />
                </div>
            </div>
        )}
        <DataTable 
            table={table} 
            className="border-none"
            tableWrapperClassName="border-none"
        />
    </div>
  );
}

