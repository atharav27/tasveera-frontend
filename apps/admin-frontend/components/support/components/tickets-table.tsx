"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import type { ColumnDef } from "@tanstack/react-table";

import { ActionsDropdown, StatusBadge, CommonAlertDialog, type BadgeVariant as BadgeVariantType, DataTable, DataTableColumnHeader, DataTableToolbar } from "@corpora/ui";
import { useDataTable } from "@/lib/use-data-table";
import type { TicketsTableRow } from "@/lib/tickets-table-mappers";

import { RaiseTicketDialog } from "./dialogs/raise-ticket-dialog";
import Image from "next/image";
import { Search } from "lucide-react";
import { ticketTypes, vendorOptions } from "@/_data/mock-tickets";
import { Input } from "@corpora/ui";

const ticketStatusToVariant: Record<string, BadgeVariantType> = {
  open: "amber",
  in_progress: "primary",
  resolved: "green",
  closed: "red",
};

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    open: "Open",
    "in_progress": "In-Progress",
    resolved: "Resolved",
    closed: "Closed",
  };
  return labels[status?.toLowerCase()] || status;
}

function getCategoryLabel(category: string): string {
  return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

interface TicketsTableProps {
  data: TicketsTableRow[];
  onRefresh?: () => void;
  onTicketClosed?: (id: string) => void;
  onTicketUpdated?: (id: string, updates: Partial<TicketsTableRow>) => void;
}

export function TicketsTable({ data, onRefresh, onTicketClosed, onTicketUpdated }: TicketsTableProps) {
  const router = useRouter();
  const [isTicketDialogOpen, setIsTicketDialogOpen] = React.useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = React.useState(false);
  const [selectedTicket, setSelectedTicket] = React.useState<TicketsTableRow | null>(null);
  const [isClosing, setIsClosing] = React.useState(false);

  const uniqueTicketTypes = React.useMemo(() => ticketTypes, []);
  const uniqueStatuses = React.useMemo(() => [
    { label: "Open", value: "open" },
    { label: "In-Progress", value: "in_progress" },
    { label: "Resolved", value: "resolved" },
    { label: "Closed", value: "closed" },
  ], []);
  const vendors = React.useMemo(() => vendorOptions, []);

  const handleOpenTicket = (ticket: TicketsTableRow) => {
    setSelectedTicket(ticket);
    setIsTicketDialogOpen(true);
  };

  const handleCloseClick = (ticket: TicketsTableRow) => {
    setSelectedTicket(ticket);
    setCloseDialogOpen(true);
  };

  const handleCloseTicket = async () => {
    if (selectedTicket) {
      setIsClosing(true);
      try {
        onTicketClosed?.(selectedTicket.id);
        setCloseDialogOpen(false);
        setSelectedTicket(null);
        onRefresh?.();
      } finally {
        setIsClosing(false);
      }
    }
  };

  const columns = React.useMemo<ColumnDef<TicketsTableRow>[]>(
    () => [
      {
        accessorKey: "ticketId",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Ticket ID" />
        ),
        cell: ({ row }) => (
          <span className="font-medium text-foreground">{row.getValue("ticketId")}</span>
        ),
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: "category",
        id: "category",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Ticket Type" />
        ),
        cell: ({ row }) => (
          <span className="text-foreground">{getCategoryLabel(row.getValue("category"))}</span>
        ),
        enableSorting: true,
        enableColumnFilter: true,
        meta: {
          label: "Type",
          variant: "select",
          options: uniqueTicketTypes,
        },
      },
      {
        accessorKey: "linkedBooking.bookingNumber",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Booking ID" />
        ),
        cell: ({ row }) => (
          <span className="text-foreground">{row.original.linkedBooking?.bookingNumber || "N/A"}</span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "vendorId",
        id: "vendorId",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Vendor" />
        ),
        cell: ({ row }) => (
          <span className="text-foreground">{row.getValue("vendorId") || "N/A"}</span>
        ),
        enableSorting: true,
        enableColumnFilter: true,
        meta: {
          label: "Vendor",
          variant: "select",
          options: vendors,
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Created On" />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">{new Date(row.getValue("createdAt")).toLocaleDateString()}</span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "status",
        id: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Status" />
        ),
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <StatusBadge
              text={getStatusLabel(status)}
              status={status}
              statusToVariant={ticketStatusToVariant}
            />
          );
        },
        enableColumnFilter: true,
        meta: {
          label: "Status",
          variant: "select",
          options: uniqueStatuses,
        },
      },
      {
        id: "actions",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Actions" />
        ),
        cell: ({ row }) => {
          const ticket = row.original;
          return (
            <ActionsDropdown
              items={[
                {
                  label: "View Details",
                  icon: "eye",
                  onClick: () => {
                    router.push(`/tickets/${ticket.ticketId || ticket.id}`);
                  },
                },
                {
                  label: "Edit Details",
                  icon: "pencil",
                  onClick: () => {
                    handleOpenTicket(ticket);
                  },
                },
                {
                  label: "Close Ticket",
                  icon: "xcircle",
                  variant: "destructive",
                  disabled: ticket.status === "closed" || ticket.status === "resolved",
                  onClick: () => {
                    handleCloseClick(ticket);
                  },
                },
              ]}
            />
          );
        },
      },
    ],
    [router, uniqueTicketTypes, vendors, uniqueStatuses]
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount: -1,
    clientMode: true,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
    },
    getRowId: (row) => row.id,
    shallow: false,
  });

  return (
    <>
      <DataTable table={table} className="border-none">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Ticket ID..."
              className="pl-11 h-11 sm:h-12 rounded-full bg-muted/30 border-none w-full"
              value={(table.getColumn("ticketId")?.getFilterValue() as string) ?? ""}
              onChange={(event) => {
                table.getColumn("ticketId")?.setFilterValue(event.target.value);
              }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
            <DataTableToolbar
              table={table}
              className="p-0 border-none bg-transparent"
              filterOptionsOverride={{
                category: uniqueTicketTypes,
                status: uniqueStatuses,
                vendorId: vendors,
              }}
            >
            </DataTableToolbar>
          </div>
        </div>
      </DataTable>

      <RaiseTicketDialog
        ticketId={selectedTicket?.id}
        editRow={selectedTicket}
        bookingId={selectedTicket?.linkedBooking?.id}
        open={isTicketDialogOpen}
        onOpenChange={(open) => {
          setIsTicketDialogOpen(open);
          if (!open) setSelectedTicket(null);
        }}
        onSuccess={onRefresh}
        onTicketUpdated={onTicketUpdated}
      />
      <CommonAlertDialog
        open={closeDialogOpen}
        onOpenChange={setCloseDialogOpen}
        ImageComponent={Image}
        variant="error"
        title="Close Ticket?"
        subtitle="Closing this ticket will mark it as resolved and move it out of your active queue."
        buttons={[
          {
            id: "close-ticket",
            label: isClosing ? "Closing..." : "Close Ticket",
            onClick: handleCloseTicket,
            disabled: isClosing,
            variant: "outline",
            className: "border-red-500 text-red-500 hover:bg-red-50",
          },
          {
            id: "go-back",
            label: "Go Back",
            onClick: () => {
              setCloseDialogOpen(false);
              setSelectedTicket(null);
            },
            disabled: isClosing,
            variant: "default",
            className: "bg-primary hover:bg-primary/90 text-white",
          },
        ]}
      />
    </>
  );
}
