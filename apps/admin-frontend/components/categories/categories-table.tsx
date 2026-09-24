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
import { Category } from "./mock-data";
import { format } from "date-fns";
import { BadgeVariant } from "@corpora/ui";

interface CategoriesTableProps {
  data: Category[];
  pageCount?: number;
  onDelete: (id: string) => void;
}

const TYPE_VARIANT: Record<string, BadgeVariant> = {
  PRODUCT: "primary",
  OCCASION: "amber",
  COLLECTION: "neutral",
  PROMOTION: "green",
};

export function CategoriesTable({ 
  data, 
  pageCount = 1, 
  onDelete,
}: CategoriesTableProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);

  const columns = React.useMemo<ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="ID" />
        ),
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => router.push(`/content/categories/${row.original.id}`)}
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
        accessorKey: "type",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Type" />
        ),
        cell: ({ row }) => {
          const type = row.getValue("type") as string;
          return (
            <StatusBadge 
              status={type} 
              text={type}
              statusToVariant={TYPE_VARIANT}
            />
          );
        },
        meta: {
            label: "Category Type",
            variant: "multiSelect",
            options: [
                { label: "Product", value: "PRODUCT" },
                { label: "Occasion", value: "OCCASION" },
                { label: "Collection", value: "COLLECTION" },
                { label: "Promotion", value: "PROMOTION" },
            ]
        }
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
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {format(new Date(row.getValue("createdAt")), "MMM d, yyyy")}
          </span>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const category = row.original;
          const items: ActionItem[] = [
            {
              label: "View / Edit",
              icon: "pencil",
              onClick: () => router.push(`/content/categories/${category.id}`),
            },
            {
              label: "Delete Category",
              icon: "trash2",
              variant: "destructive",
              onClick: () => setIsDeleting(category.id),
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
    [router, onDelete]
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
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
                    placeholder="Search Categories...."
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
            title="Delete Category"
            subtitle="Are you sure you want to delete this category? This will soft delete and set it as inactive."
            variant="error"
            ImageComponent={Image}
            buttons={[
                { label: "Cancel", onClick: () => setIsDeleting(null), variant: "outline" },
                { label: "Deactivate (Delete)", onClick: () => {
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
