"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { 
    DataTable,
    DataTableColumnHeader,
    StatusBadge,
    BadgeVariant
} from "@corpora/ui";
import { useDataTable } from "@/hooks/use-data-table";
import { CategoryLinkedProduct } from "./mock-data";

interface CategoryProductsTableProps {
    products: CategoryLinkedProduct[];
}

const TYPE_VARIANT: Record<string, BadgeVariant> = {
  FRAME: "primary",
  PACK: "amber",
  HAMPER: "green",
  SIMPLE: "neutral",
  CUSTOM: "primary",
};

export function CategoryProductsTable({ products }: CategoryProductsTableProps) {
    const columns = React.useMemo<ColumnDef<CategoryLinkedProduct>[]>(
        () => [
            {
                accessorKey: "productId",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} label="Product ID" />
                ),
                cell: ({ row }) => <span className="font-mono text-xs">{row.getValue("productId")}</span>,
            },
            {
                accessorKey: "title",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} label="Title" />
                ),
                cell: ({ row }) => <span className="font-bold text-slate-900">{row.getValue("title")}</span>,
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
            },
            {
                accessorKey: "featured",
                header: "Marks",
                cell: ({ row }) => {
                    const p = row.original;
                    const marks = [];
                    if (p.featured) marks.push("Featured");
                    if (p.bestseller) marks.push("Bestseller");
                    return (
                        <span className="text-xs text-muted-foreground font-medium">
                            {marks.length ? marks.join(', ') : '-'}
                        </span>
                    );
                },
            },
        ],
        []
    );

    const { table } = useDataTable({
        data: products,
        columns,
        pageCount: 1,
        initialState: {
            sorting: [{ id: "title", desc: false }],
        },
        getRowId: (row) => row.id,
        shallow: false,
    });

    return (
        <DataTable
            table={table}
            className="border-none"
            tableWrapperClassName="border rounded-xl overflow-hidden shadow-sm bg-card"
        />
    );
}
