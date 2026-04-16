"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Table } from "@tanstack/react-table";

import { ActionsDropdown, type ActionItem } from "../actions/actions-dropdown";
import type { BadgeVariant as BadgeVariantType } from "../badge/badge-variant";
import { StatusBadge } from "../badge/status-badge";
import { DataTable } from "../data-table/data-table";
import { invoiceStatusToVariant, type Invoice } from "@corpora/utils";

interface InvoicesTableProps {
  data: Invoice[];
  table: Table<Invoice>;
  onViewInvoice?: (invoice: Invoice) => void;
  onDownloadInvoice?: (invoice: Invoice) => void;
  onRaiseTicket?: (invoice: Invoice) => void;
}

export function InvoicesTable({
  data,
  table,
  onViewInvoice,
  onDownloadInvoice,
  onRaiseTicket
}: InvoicesTableProps) {
  return (
    <DataTable table={table} />
  );
}

/**
 * Returns column definitions for the invoices table.
 * Use this with useDataTable hook to create the table instance.
 */
export function getInvoicesTableColumns(options?: {
  onViewInvoice?: (invoice: Invoice) => void;
  onDownloadInvoice?: (invoice: Invoice) => void;
  onRaiseTicket?: (invoice: Invoice) => void;
}): ColumnDef<Invoice>[] {
  return [
    {
      accessorKey: "invoiceNumber",
      header: "Invoice Number",
    },
    {
      accessorKey: "vendor",
      header: "Vendor",
    },
    {
      accessorKey: "total",
      header: "Amount",
      cell: ({ row }) => {
        const total = row.original.total;
        return `$${total.toLocaleString()}`;
      },
    },
    {
      accessorKey: "issuedDate",
      header: "Issued",
      cell: ({ row }) => {
        const date = new Date(row.original.issuedDate);
        return date.toLocaleDateString();
      },
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => {
        const date = new Date(row.original.dueDate);
        return date.toLocaleDateString();
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <StatusBadge
            text={status}
            status={status}
            statusToVariant={invoiceStatusToVariant as Record<string, BadgeVariantType>}
          />
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const invoice = row.original;
        const items: ActionItem[] = [
          {
            label: "View Invoice",
            icon: "eye",
            onClick: () => {
              if (options?.onViewInvoice) {
                options.onViewInvoice(invoice);
              } else {
                console.log("View Invoice:", invoice.invoiceNumber);
              }
            },
          },
          {
            label: "Download",
            icon: "download",
            onClick: () => {
              if (options?.onDownloadInvoice) {
                options.onDownloadInvoice(invoice);
              } else {
                console.log("Download Invoice:", invoice.invoiceNumber);
              }
            },
          },
        ];

        if (options?.onRaiseTicket) {
          items.push({
            label: "Raise a Ticket",
            icon: "ticket",
            onClick: () => options.onRaiseTicket!(invoice),
          });
        }

        return <ActionsDropdown items={items} />;
      },
    },
  ];
}
