"use client";

import * as React from "react";
import type { ColumnDef, Table } from "@tanstack/react-table";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table";
import { format } from "date-fns";

import { ActionsDropdown } from "../actions/actions-dropdown";
import { StatusBadge } from "../badge/status-badge";
import type { BadgeVariant as BadgeVariantType } from "../badge/badge-variant";
import { DataTable } from "../data-table/data-table";
import { DataTableColumnHeader } from "../data-table/data-table-column-header";
import { DataTableToolbar } from "../data-table/data-table-toolbar";
import { SearchFilter } from "../filters/search-filter";
import { billingStatusToVariant, type BillingPeriod } from "@corpora/utils";

/**
 * Props for BillingTable component.
 * Can work in two modes:
 * 1. Controlled mode: Pass `table` prop created with useDataTable hook
 * 2. Uncontrolled mode: Pass `data` and `pageCount`, component creates internal table
 */
interface BillingTableProps {
  /** Billing data to display */
  data: BillingPeriod[];
  /** Total page count for pagination */
  pageCount: number;
  /** Optional external table instance (from useDataTable hook) */
  table?: Table<BillingPeriod>;
  /** Search callback */
  onSearch?: (value: string) => void;
  /** View invoice action callback */
  onViewInvoice?: (item: BillingPeriod) => void;
  /** Download invoice action callback */
  onDownload?: (item: BillingPeriod) => void;
  /** Raise ticket action callback */
  onRaiseTicket?: (item: BillingPeriod) => void;
}

/**
 * Status options for filtering
 */
export const billingStatusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Paid", value: "paid" },
  { label: "Overdue", value: "overdue" },
  { label: "Sent", value: "sent" },
];

/**
 * Returns column definitions for the billing table.
 * Use this with useDataTable hook to create the table instance.
 */
export function getBillingTableColumns(options?: {
  onViewInvoice?: (item: BillingPeriod) => void;
  onDownload?: (item: BillingPeriod) => void;
  onRaiseTicket?: (item: BillingPeriod) => void;
}): ColumnDef<BillingPeriod>[] {
  return [
    {
      accessorKey: "periodLabel",
      id: "periodLabel",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Billing Period" />
      ),
      cell: ({ row }) => {
        const { periodLabel, billingPeriodStart, billingPeriodEnd } =
          row.original;
        return (
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{periodLabel}</span>
            <span className="text-[10px] text-muted-foreground">
              {format(new Date(billingPeriodStart), "dd MMM")} -{" "}
              {format(new Date(billingPeriodEnd), "dd MMM, yyyy")}
            </span>
          </div>
        );
      },
      enableSorting: true,
      enableHiding: false,
      enableColumnFilter: true,
    },
    {
      accessorKey: "vendorName",
      id: "vendorName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Vendor Name" />
      ),
      cell: ({ row }) => (
        <span className="text-foreground">{row.getValue("vendorName")}</span>
      ),
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      accessorKey: "invoiceNumber",
      id: "invoiceNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Invoice ID" />
      ),
      cell: ({ row }) => (
        <span className="text-foreground">{row.getValue("invoiceNumber")}</span>
      ),
      enableSorting: true,
      enableColumnFilter: false,
    },
    {
      accessorKey: "totalRides",
      id: "totalRides",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Total Rides" />
      ),
      cell: ({ row }) => (
        <span className="text-foreground">{row.getValue("totalRides")}</span>
      ),
      enableSorting: true,
      enableColumnFilter: false,
    },
    {
      accessorKey: "totalAmount",
      id: "totalAmount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Total Amount" />
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("totalAmount") || "0");
        return (
          <span className="font-medium text-foreground">
            ₹{amount.toLocaleString("en-IN")}
          </span>
        );
      },
      enableSorting: true,
      enableColumnFilter: false,
    },
    {
      accessorKey: "status",
      id: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Payment Status" />
      ),
      cell: ({ row }) => {
        const status =
          (row.getValue("status") as string)?.toLowerCase() || "pending";
        return (
          <StatusBadge
            text={status.charAt(0).toUpperCase() + status.slice(1)}
            status={status}
            statusToVariant={billingStatusToVariant as Record<string, BadgeVariantType>}
          />
        );
      },
      enableColumnFilter: true,
      meta: {
        label: "Status",
        variant: "select",
        options: billingStatusOptions,
      },
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Actions" />
      ),
      cell: ({ row }) => {
        const item = row.original;
        return (
          <ActionsDropdown
            items={[
              {
                label: "View Invoice",
                icon: "eye",
                onClick: () => {
                  if (options?.onViewInvoice) {
                    options.onViewInvoice(item);
                  } else {
                    console.log("View Invoice:", item.id);
                  }
                },
              },
              {
                label: "Download",
                icon: "download",
                onClick: () => {
                  if (options?.onDownload) {
                    options.onDownload(item);
                  } else {
                    console.log("Download Invoice:", item.invoiceNumber);
                  }
                },
              },
              {
                label: "Raise a Ticket",
                icon: "ticket",
                onClick: () => {
                  if (options?.onRaiseTicket) {
                    options.onRaiseTicket(item);
                  } else {
                    console.log("Raise Ticket for Invoice:", item.invoiceNumber);
                  }
                },
              },
            ]}
          />
        );
      },
    },
  ];
}

/**
 * Hook to create a basic billing table instance.
 * For advanced features like URL state sync, use your app's useDataTable hook instead.
 */
export function useBillingTable({
  data,
  pageCount,
  onViewInvoice,
  onDownload,
  onRaiseTicket,
}: {
  data: BillingPeriod[];
  pageCount: number;
  onViewInvoice?: (item: BillingPeriod) => void;
  onDownload?: (item: BillingPeriod) => void;
  onRaiseTicket?: (item: BillingPeriod) => void;
}) {
  const columns = React.useMemo(
    () => getBillingTableColumns({ onViewInvoice, onDownload, onRaiseTicket }),
    [onViewInvoice, onDownload, onRaiseTicket]
  );

  const table = useReactTable({
    data,
    columns,
    pageCount,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getRowId: (row) => row.id,
    initialState: {
      sorting: [{ id: "periodLabel", desc: false }],
    },
  });

  return { table, columns };
}

export function BillingTable({
  data,
  pageCount,
  table: externalTable,
  onSearch,
  onViewInvoice,
  onDownload,
  onRaiseTicket,
}: BillingTableProps) {
  // Create internal table if no external table provided
  const { table: internalTable } = useBillingTable({
    data,
    pageCount,
    onViewInvoice,
    onDownload,
    onRaiseTicket,
  });

  // Use external table if provided, otherwise use internal
  const table = externalTable || internalTable;

  return (
    <>
      <DataTable table={table} className="border-none">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
          <SearchFilter
            placeholder="Search by Invoice ID..."
            className="w-full lg:w-80"
            onSearchChange={(value) => {
              if (onSearch) {
                onSearch(value);
              } else {
                table.getColumn("invoiceNumber")?.setFilterValue(value);
              }
            }}
          />
          <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
            <DataTableToolbar
              table={table}
              className="p-0 border-none bg-transparent"
            >
              {/* The toolbar automatically renders filters for columns with enableColumnFilter: true */}
            </DataTableToolbar>
          </div>
        </div>
      </DataTable>
    </>
  );
}
