"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { 
    DataTable,
    DataTableColumnHeader,
} from "@corpora/ui";
import { useDataTable } from "@/hooks/use-data-table";
import { CouponUsageHistory } from "./mock-data";
import { format } from "date-fns";
import Link from "next/link";

interface CouponUsageTableProps {
    usage: CouponUsageHistory[];
}

export function CouponUsageTable({ usage }: CouponUsageTableProps) {
    const columns = React.useMemo<ColumnDef<CouponUsageHistory>[]>(
        () => [
            {
                accessorKey: "orderNumber",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} label="Order #" />
                ),
                cell: ({ row }) => (
                    <Link 
                        href={`/orders/${row.original.orderId}`}
                        className="font-bold text-primary hover:underline font-mono"
                    >
                        {row.getValue("orderNumber")}
                    </Link>
                ),
            },
            {
                accessorKey: "totalAmount",
                header: "Revenue",
                cell: ({ row }) => <span className="font-medium text-slate-900">₹{row.getValue("totalAmount")}</span>,
            },
            {
                accessorKey: "createdAt",
                header: "Applied On",
                cell: ({ row }) => (
                    <span className="text-xs text-muted-foreground">
                        {format(new Date(row.getValue("createdAt")), "MMM d, yyyy HH:mm")}
                    </span>
                ),
            },
        ],
        []
    );

    const { table } = useDataTable({
        data: usage,
        columns,
        pageCount: 1,
        getRowId: (row) => row.id,
        shallow: false,
    });

    return (
        <DataTable
            table={table}
            className="border-none"
            tableWrapperClassName="border rounded-[2rem] overflow-hidden shadow-sm bg-card"
        />
    );
}
