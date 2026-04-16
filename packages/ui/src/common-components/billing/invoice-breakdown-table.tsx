"use client";

import { useMemo, useState, useCallback } from "react";
import { format } from "date-fns";
import type { ColumnDef, Table } from "@tanstack/react-table";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { ActionsDropdown } from "../actions/actions-dropdown";
import type { BadgeVariant as BadgeVariantType } from "../badge/badge-variant";
import { StatusBadge } from "../badge/status-badge";
import { DataTable } from "../data-table/data-table";
import { DataTablePagination } from "../data-table/data-table-pagination";
import { ExpandableTripIds } from "./expandable-trip-ids";
import { cn } from "../../lib/utils";
import { billingStatusToVariant, type BillingPeriod } from "@corpora/utils";

export interface ExpandedVendorRow {
  id: string;
  vendorName: string;
  invoiceNumber: string;
  totalRides: number;
  totalAmount: string;
  billingPeriodEnd: string;
  status: string;
  invoiceNumbers: string[];
  isExpandedRow?: boolean;
  parentId?: string;
  originalInvoices?: BillingPeriod[];
}

interface InvoiceBreakdownTableProps {
  /** Raw billing data to display */
  data: BillingPeriod[];
  /** Optional external table instance */
  table?: Table<ExpandedVendorRow>;
  /** View details action callback */
  onViewDetails?: (item: ExpandedVendorRow) => void;
  /** Download action callback */
  onDownload?: (item: ExpandedVendorRow) => void;
  /** Raise ticket action callback */
  onRaiseTicket?: (item: ExpandedVendorRow) => void;
}

/**
 * Groups invoice data by vendor for the breakdown table
 */
export function groupInvoicesByVendor(
  data: BillingPeriod[],
  expandedVendors: Set<string>
): ExpandedVendorRow[] {
  const vendorGroups: Record<string, BillingPeriod[]> = {};

  data.forEach((item) => {
    const group = vendorGroups[item.vendorName];
    if (!group) {
      vendorGroups[item.vendorName] = [item];
    } else {
      group.push(item);
    }
  });

  const rows: ExpandedVendorRow[] = [];

  Object.entries(vendorGroups).forEach(([vendorName, invoices]) => {
    if (invoices.length === 0) return;

    const firstInvoice = invoices[0]!;
    const isExpanded = expandedVendors.has(vendorName);
    const invoiceNumbers = invoices.map((inv) => inv.invoiceNumber);

    const totalAmount = invoices.reduce(
      (sum, inv) => sum + parseFloat(inv.totalAmount || "0"),
      0
    );
    const totalRides = invoices.reduce(
      (sum, inv) => sum + (inv.totalRides || 0),
      0
    );

    // Parent row
    rows.push({
      id: vendorName,
      vendorName,
      invoiceNumber: invoiceNumbers[0] ?? "",
      totalRides,
      totalAmount: totalAmount.toString(),
      billingPeriodEnd: firstInvoice.billingPeriodEnd,
      status:
        invoices.every((inv) => inv.status === firstInvoice.status)
          ? firstInvoice.status
          : "mixed",
      invoiceNumbers,
      originalInvoices: invoices,
    });

    // Child rows
    if (isExpanded && invoices.length > 1) {
      invoices.forEach((inv) => {
        rows.push({
          id: `${vendorName}-${inv.id}`,
          vendorName: "",
          invoiceNumber: inv.invoiceNumber,
          totalRides: inv.totalRides,
          totalAmount: inv.totalAmount,
          billingPeriodEnd: inv.billingPeriodEnd,
          status: inv.status,
          invoiceNumbers: [inv.invoiceNumber],
          isExpandedRow: true,
          parentId: vendorName,
        });
      });
    }
  });

  return rows;
}

/**
 * Returns column definitions for the invoice breakdown table.
 * Use this with useDataTable hook to create the table instance.
 */
export function getInvoiceBreakdownColumns(options: {
  expandedVendors: Set<string>;
  toggleVendor: (vendorName: string) => void;
  onViewDetails?: (item: ExpandedVendorRow) => void;
  onDownload?: (item: ExpandedVendorRow) => void;
  onRaiseTicket?: (item: ExpandedVendorRow) => void;
}): ColumnDef<ExpandedVendorRow>[] {
  const { expandedVendors, toggleVendor, onViewDetails, onDownload, onRaiseTicket } = options;

  return [
    {
      accessorKey: "vendorName",
      header: "Vendor Name",
      cell: ({ row }) => (
        <span
          className={cn(
            "text-foreground",
            !row.original.isExpandedRow && "font-semibold"
          )}
        >
          {row.getValue("vendorName")}
        </span>
      ),
    },
    {
      accessorKey: "invoiceNumber",
      header: "Invoice ID",
      cell: ({ row }) => {
        const item = row.original;
        if (item.isExpandedRow) {
          return (
            <span className="text-muted-foreground ml-4">
              {item.invoiceNumber}
            </span>
          );
        }

        return (
          <ExpandableTripIds
            tripIds={item.invoiceNumbers}
            isExpanded={expandedVendors.has(item.vendorName)}
            onToggle={() => toggleVendor(item.vendorName)}
          />
        );
      },
    },
    {
      accessorKey: "totalRides",
      header: "Total Rides",
      cell: ({ row }) => (
        <span className="text-foreground">{row.getValue("totalRides")}</span>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("totalAmount") || "0");
        return (
          <span className="font-medium text-foreground">
            ₹{amount.toLocaleString("en-IN")}
          </span>
        );
      },
    },
    {
      accessorKey: "billingPeriodEnd",
      header: "Billing Date",
      cell: ({ row }) => {
        const date = row.getValue("billingPeriodEnd") as string;
        return (
          <span className="text-muted-foreground">
            {date ? format(new Date(date), "dd MMM, yyyy") : "N/A"}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status =
          (row.getValue("status") as string)?.toLowerCase() || "pending";
        if (status === "mixed") {
          return (
            <StatusBadge
              text="Mixed"
              status="pending"
              statusToVariant={billingStatusToVariant as Record<string, BadgeVariantType>}
            />
          );
        }
        return (
          <StatusBadge
            text={status.charAt(0).toUpperCase() + status.slice(1)}
            status={status}
            statusToVariant={billingStatusToVariant as Record<string, BadgeVariantType>}
          />
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <ActionsDropdown
            items={[
              {
                label: "View Details",
                icon: "eye",
                onClick: () => {
                  if (onViewDetails) {
                    onViewDetails(item);
                  } else {
                    console.log("View Invoice Details:", item.id);
                  }
                },
              },
              {
                label: "Download",
                icon: "download",
                onClick: () => {
                  if (onDownload) {
                    onDownload(item);
                  } else {
                    console.log("Download Invoice:", item.invoiceNumber);
                  }
                },
              },
              {
                label: "Raise a Ticket",
                icon: "ticket",
                onClick: () => {
                  if (onRaiseTicket) {
                    onRaiseTicket(item);
                  } else {
                    console.log("Raise Ticket for:", item.invoiceNumber);
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
 * Hook to manage expanded vendors state for the invoice breakdown table
 */
export function useExpandedVendors() {
  const [expandedVendors, setExpandedVendors] = useState<Set<string>>(
    new Set()
  );

  const toggleVendor = useCallback((vendorName: string) => {
    setExpandedVendors((prev) => {
      const next = new Set(prev);
      if (next.has(vendorName)) next.delete(vendorName);
      else next.add(vendorName);
      return next;
    });
  }, []);

  return { expandedVendors, toggleVendor };
}

/**
 * Hook to create a basic invoice breakdown table instance.
 * For advanced features like URL state sync, use your app's useDataTable hook instead.
 */
export function useInvoiceBreakdownTable({
  data,
  onViewDetails,
  onDownload,
  onRaiseTicket,
}: {
  data: BillingPeriod[];
  onViewDetails?: (item: ExpandedVendorRow) => void;
  onDownload?: (item: ExpandedVendorRow) => void;
  onRaiseTicket?: (item: ExpandedVendorRow) => void;
}) {
  const { expandedVendors, toggleVendor } = useExpandedVendors();

  const transformedData = useMemo(
    () => groupInvoicesByVendor(data, expandedVendors),
    [data, expandedVendors]
  );

  const columns = useMemo(
    () =>
      getInvoiceBreakdownColumns({
        expandedVendors,
        toggleVendor,
        onViewDetails,
        onDownload,
        onRaiseTicket,
      }),
    [expandedVendors, toggleVendor, onViewDetails, onDownload, onRaiseTicket]
  );

  const table = useReactTable({
    data: transformedData,
    columns,
    pageCount: Math.ceil(transformedData.length / 10),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) => row.id,
  });

  return { table, columns, expandedVendors, toggleVendor, transformedData };
}

export function InvoiceBreakdownTable({
  data,
  table: externalTable,
  onViewDetails,
  onDownload,
  onRaiseTicket,
}: InvoiceBreakdownTableProps) {
  // Create internal table if no external table provided
  const { table: internalTable } = useInvoiceBreakdownTable({
    data,
    onViewDetails,
    onDownload,
    onRaiseTicket,
  });

  // Use external table if provided, otherwise use internal
  const table = externalTable || internalTable;

  return (
    <>
      <DataTable table={table} className="border-none" />
      <div className="mt-4">
        <DataTablePagination table={table} />
      </div>
    </>
  );
}
