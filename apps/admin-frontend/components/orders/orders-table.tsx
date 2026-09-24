"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { Search, MoreVertical, Eye, Trash2 } from "lucide-react";

import {
  DataTable,
  DataTableColumnHeader,
  Button,
  StatusBadge,
  Input,
  DataTableToolbar,
  ActionsDropdown,
  type ActionItem
} from "@corpora/ui";
import { useDataTable } from "@/hooks/use-data-table";
import { Order } from "./mock-data";
import type { BadgeVariant } from "@corpora/ui";

interface OrdersTableProps {
  data: Order[];
  pageCount: number;
  onDelete: (id: string) => void;
}

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  PENDING: "amber",
  PAID: "green",
  PROCESSING: "primary",
  SHIPPED: "neutral",
  DELIVERED: "green",
  CANCELLED: "red",
};

const PAYMENT_STATUS_VARIANT: Record<string, BadgeVariant> = {
  UNPAID: "amber",
  PAID: "green",
  REFUNDED: "red",
};

export function OrdersTable({ data, pageCount, onDelete }: OrdersTableProps) {
  const router = useRouter();

  const columns = React.useMemo<ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: "orderNumber",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Order #" />
        ),
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => router.push(`/orders/${row.original.id}`)}
            className="font-medium text-primary hover:underline text-left"
          >
            {row.getValue("orderNumber")}
          </button>
        ),
        enableColumnFilter: true,
        meta: {
            label: "Order Number",
            variant: "text",
        }
      },
      {
        accessorKey: "customerName",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Customer" />
        ),
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium">{row.getValue("customerName")}</span>
            <span className="text-xs text-muted-foreground">{row.original.email}</span>
          </div>
        ),
      },
      {
        accessorKey: "phone",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Phone" />
        ),
      },
      {
        accessorKey: "totalAmount",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Amount" />
        ),
        cell: ({ row }) => (
          <span className="font-semibold">
            ₹{row.original.totalAmount.toLocaleString("en-IN")}
          </span>
        ),
        enableColumnFilter: true,
        meta: {
            label: "Amount",
            variant: "range",
        }
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Status" />
        ),
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          return (
            <StatusBadge
              status={status}
              text={status}
              statusToVariant={STATUS_VARIANT}
            />
          );
        },
      },
      {
        accessorKey: "paymentStatus",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Payment" />
        ),
        cell: ({ row }) => {
          const status = row.getValue("paymentStatus") as string;
          return (
            <StatusBadge
              status={status}
              text={status}
              statusToVariant={PAYMENT_STATUS_VARIANT}
            />
          );
        },
        enableColumnFilter: true,
        meta: {
            label: "Payment Status",
            variant: "multiSelect",
            options: [
                { label: "Unpaid", value: "UNPAID" },
                { label: "Paid", value: "PAID" },
                { label: "Refunded", value: "REFUNDED" },
            ]
        }
      },
      {
        accessorKey: "courier",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Courier / AWB" />
        ),
        cell: ({ row }) => {
          const courier = row.original.courier;
          const awb = row.original.awbNumber;
          return courier ? (
            <div className="flex flex-col text-xs">
              <span className="font-medium">{courier}</span>
              <span className="text-muted-foreground">{awb}</span>
            </div>
          ) : (
            "-"
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Created At" />
        ),
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {new Date(row.getValue("createdAt")).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            })}
          </span>
        ),
        enableColumnFilter: true,
        meta: {
            label: "Date Range",
            variant: "dateRange",
        }
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const order = row.original;
          const items: ActionItem[] = [
            {
              label: "View Details",
              icon: "eye",
              onClick: () => router.push(`/orders/${order.id}`),
            },
            {
              label: "Delete Order",
              icon: "trash2",
              variant: "destructive",
              onClick: () => onDelete(order.id),
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
                    placeholder="Search Orders...."
                    className="pl-11 h-11 sm:h-12 rounded-full bg-muted/30 border-none w-full"
                    value={(table.getColumn("orderNumber")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => {
                        table.getColumn("orderNumber")?.setFilterValue(event.target.value);
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
    </>
  );
}
