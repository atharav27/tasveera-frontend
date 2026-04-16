"use client";

import * as React from "react";
import type { ColumnDef, Table } from "@tanstack/react-table";
import { format } from "date-fns";
import { Search } from "lucide-react";

import { StatusBadge } from "../badge/status-badge";
import { BadgeVariant, type BadgeVariant as BadgeVariantType } from "../badge/badge-variant";
import { ActionsDropdown } from "../actions/actions-dropdown";
import { CommonAlertDialog } from "../dialogs/common-alert-dialog";
import { Input } from "../../components/input";
import { DataTable } from "../data-table/data-table";
import { DataTableColumnHeader } from "../data-table/data-table-column-header";
import { DataTableToolbar } from "../data-table/data-table-toolbar";
import type { Booking } from "@corpora/utils";

const vendorStatusToVariant: Record<string, BadgeVariantType> = {
    active: "green",
    warning: "amber",
    suspended: "red",
    inactive: "neutral",
};

const bookingStatusToVariant: Record<string, BadgeVariantType> = {
    draft: "neutral",
    requested: "amber",
    awaiting_vendor: "amber",
    vendor_assigned: "primary",
    vendor_accepted: "primary",
    vendor_rejected: "red",
    driver_assigned: "green",
    confirmed: "green",
    en_route_pickup: "primary",
    arrived_pickup: "primary",
    otp_start_verified: "primary",
    ongoing: "primary",
    otp_end_verified: "green",
    completed: "green",
    cancelled: "red",
    no_show_guest: "red",
    no_show_driver: "red",
    exception: "red",
};

export interface BookingTag {
    id: string;
    name: string;
}

export interface Department {
    id: string;
    name: string;
}

export interface VendorOption {
    id: string;
    name: string;
}

export interface BookingsTableProps {
    /** Booking data to display */
    data: Booking[];
    /** Total page count for pagination */
    pageCount: number;
    /** TanStack Table instance - pass this from useDataTable hook */
    table: Table<Booking>;
    /** Callback when edit action is triggered */
    onEdit?: (booking: Booking) => void;
    /** Callback for viewing booking details */
    onView?: (booking: Booking) => void;
    /** Callback for cancelling a booking */
    onCancel?: (booking: Booking) => void;
    /** Callback for raising a ticket */
    onRaiseTicket?: (booking: Booking) => void;
    /** Available tags for filtering */
    tags?: BookingTag[];
    /** Available departments for filtering */
    departments?: Department[];
    /** Available vendors for filtering */
    vendors?: VendorOption[];
    /** Image component for dialogs (Next.js Image or standard img) */
    ImageComponent?: React.ComponentType<{ src: string; alt: string; width: number; height: number; className?: string }>;
    /** Optional custom ticket dialog component */
    renderTicketDialog?: (props: { booking: Booking | null; open: boolean; onOpenChange: (open: boolean) => void }) => React.ReactNode;
}

export function useBookingsTableColumns({
    onEdit,
    onView,
    onCancel,
    onRaiseTicket,
    tags = [],
    departments = [],
}: Pick<BookingsTableProps, 'onEdit' | 'onView' | 'onCancel' | 'onRaiseTicket' | 'tags' | 'departments'>) {
    const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);
    const [ticketDialogOpen, setTicketDialogOpen] = React.useState(false);
    const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(null);

    const columns = React.useMemo<ColumnDef<Booking>[]>(
        () => [
            {
                accessorKey: "bookingNumber",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} label="Booking ID" />
                ),
                cell: ({ row }) => (
                    <button
                        type="button"
                        onClick={() => onView?.(row.original)}
                        className="font-medium text-brand-blue-400 hover:underline text-left"
                    >
                        {row.getValue("bookingNumber")}
                    </button>
                ),
                enableSorting: true,
                enableHiding: false,
                enableColumnFilter: false,
                meta: {
                    label: "Booking ID",
                    variant: "text",
                },
            },
            {
                accessorKey: "passengerSummary",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} label="Passenger" />
                ),
                cell: ({ row }) => {
                    const passenger = row.original.passengerSummary;
                    if (!passenger) return <div className="text-muted-foreground">-</div>;
                    return (
                        <div className="flex flex-col">
                            <span className="font-medium text-foreground">{passenger.primaryPassenger}</span>
                            {passenger.additionalCount > 0 && (
                                <span className="text-xs text-muted-foreground">+ {passenger.additionalCount} more</span>
                            )}
                        </div>
                    );
                },
                enableColumnFilter: false,
                meta: {
                    label: "Passenger",
                    variant: "text",
                },
            },
            {
                accessorKey: "rideType",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} label="Trip Type" />
                ),
                cell: ({ row }) => <div>{row.getValue("rideType")}</div>,
            },
            {
                accessorKey: "pickupAddress",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} label="Pick-Up" />
                ),
                cell: ({ row }) => <div className="max-w-[150px] truncate">{row.getValue("pickupAddress")}</div>,
            },
            {
                accessorKey: "vendor",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} label="Vendor" />
                ),
                cell: ({ row }) => {
                    const vendor = row.original.vendor;
                    if (!vendor) return <div className="text-muted-foreground">-</div>;
                    return (
                        <div className="flex flex-col gap-1">
                            <span className="font-medium text-foreground">{vendor.name}</span>
                            <BadgeVariant
                                variant={vendorStatusToVariant[vendor.status] || "neutral"}
                                size="sm"
                                className="w-fit text-[8px] h-4"
                                text={vendor.status.toUpperCase()}
                            />
                        </div>
                    );
                },
                enableColumnFilter: true,
                meta: {
                    label: "Vendor",
                    variant: "select",
                },
                filterFn: (row, id, value) => {
                    return value.includes(row.original.vendor?.name);
                },
            },
            {
                accessorKey: "fare",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} label="Billed Amount" />
                ),
                cell: ({ row }) => {
                    const fare = row.original.fare;
                    if (!fare?.totalAmount) return <div className="font-medium">---</div>;
                    const amount = parseFloat(fare.totalAmount);
                    const formatted = new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: fare.currency || "INR",
                        maximumFractionDigits: 0,
                    }).format(amount);
                    return <div className="font-medium">{formatted}</div>;
                },
            },
            {
                accessorKey: "scheduledPickupTime",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} label="Schedule" />
                ),
                cell: ({ row }) => {
                    const date = row.getValue("scheduledPickupTime") as string;
                    return <div className="text-muted-foreground">{format(new Date(date), "dd MMM, HH:mm")}</div>;
                },
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
                            text={status.replace(/_/g, " ").charAt(0).toUpperCase() + status.replace(/_/g, " ").slice(1)}
                            status={status}
                            statusToVariant={bookingStatusToVariant}
                        />
                    );
                },
                enableColumnFilter: true,
                meta: {
                    label: "Status",
                    variant: "select",
                },
                filterFn: (row, id, value) => {
                    return value.includes(row.getValue(id));
                },
            },
            {
                accessorKey: "department",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} label="Department" />
                ),
                cell: ({ row }) => <div>{row.getValue("department")}</div>,
                enableColumnFilter: true,
                meta: {
                    label: "Department",
                    variant: "select",
                    options: departments.map((dept) => ({ label: dept.name, value: dept.name })),
                },
                enableHiding: true,
            },
            {
                accessorKey: "tags",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} label="Tags" />
                ),
                cell: ({ row }) => {
                    const rowTags = row.getValue("tags") as string[];
                    return (
                        <div className="flex gap-1 flex-wrap">
                            {rowTags?.map(tag => (
                                <BadgeVariant key={tag} variant="neutral" size="sm" className="text-[10px] px-1 py-0">
                                    {tag}
                                </BadgeVariant>
                            ))}
                        </div>
                    )
                },
                enableColumnFilter: true,
                meta: {
                    label: "Tags",
                    variant: "select",
                    options: tags.map(tag => ({ label: tag.name, value: tag.name })),
                },
            },
            {
                id: "actions",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} label="Actions" />
                ),
                cell: ({ row }) => {
                    const booking = row.original;
                    const canCancel = ["requested", "confirmed", "vendor_assigned", "vendor_accepted"].includes(booking.status);

                    return (
                        <ActionsDropdown
                            items={[
                                {
                                    label: "View Booking",
                                    icon: "eye",
                                    onClick: () => onView?.(booking),
                                },
                                {
                                    label: "Edit Booking",
                                    icon: "pencil",
                                    onClick: () => onEdit?.(booking),
                                },
                                {
                                    label: "Raise a Ticket",
                                    icon: "ticket",
                                    onClick: () => {
                                        setSelectedBooking(booking);
                                        if (onRaiseTicket) {
                                            onRaiseTicket(booking);
                                        } else {
                                            setTicketDialogOpen(true);
                                        }
                                    },
                                },
                                {
                                    label: "Cancel Booking",
                                    icon: "xcircle",
                                    variant: "destructive",
                                    disabled: !canCancel,
                                    onClick: () => {
                                        setSelectedBooking(booking);
                                        setCancelDialogOpen(true);
                                    },
                                },
                            ]}
                        />
                    );
                },
            },
        ],
        [onEdit, onView, onRaiseTicket, tags, departments]
    );

    return {
        columns,
        cancelDialogOpen,
        setCancelDialogOpen,
        ticketDialogOpen,
        setTicketDialogOpen,
        selectedBooking,
        setSelectedBooking,
    };
}

export function BookingsTable({
    table,
    onEdit,
    onView,
    onCancel,
    onRaiseTicket,
    tags = [],
    departments = [],
    vendors = [],
    ImageComponent,
    renderTicketDialog,
}: BookingsTableProps) {
    const {
        cancelDialogOpen,
        setCancelDialogOpen,
        ticketDialogOpen,
        setTicketDialogOpen,
        selectedBooking,
    } = useBookingsTableColumns({ onEdit, onView, onCancel, onRaiseTicket, tags, departments });

    const handleCancelBooking = () => {
        if (selectedBooking && onCancel) {
            onCancel(selectedBooking);
        }
        setCancelDialogOpen(false);
    };

    return (
        <>
            <DataTable table={table} className="border-none">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
                    <div className="relative w-full lg:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search Bookings...."
                            className="pl-11 h-11 sm:h-12 rounded-full bg-muted/30 border-none w-full"
                            value={(table.getColumn("bookingNumber")?.getFilterValue() as string) ?? ""}
                            onChange={(event) => {
                                table.getColumn("bookingNumber")?.setFilterValue(event.target.value);
                            }}
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
                        <DataTableToolbar
                            table={table}
                            className="p-0 border-none bg-transparent"
                            filterOptionsOverride={{
                                tags: tags.map(tag => ({ label: tag.name, value: tag.name })),
                                department: departments.map(dept => ({ label: dept.name, value: dept.name })),
                                vendor: vendors.map(v => ({ label: v.name, value: v.name })),
                            }}
                        >
                            {/* The toolbar automatically renders filters for columns with enableColumnFilter: true */}
                        </DataTableToolbar>
                    </div>
                </div>
            </DataTable>

            {/* Cancel Booking Dialog */}
            {ImageComponent && (
                <CommonAlertDialog
                    open={cancelDialogOpen}
                    onOpenChange={setCancelDialogOpen}
                    ImageComponent={ImageComponent}
                    variant="warning"
                    title="Cancel Booking?"
                    subtitle={`Are you sure you want to cancel booking ${selectedBooking?.bookingNumber || ""}? This action may incur cancellation fees.`}
                    buttons={[
                        {
                            label: "Keep Booking",
                            onClick: () => setCancelDialogOpen(false),
                            variant: "outline",
                        },
                        {
                            label: "Cancel Booking",
                            onClick: handleCancelBooking,
                            variant: "destructive",
                        },
                    ]}
                />
            )}

            {/* Custom Ticket Dialog - rendered via prop */}
            {renderTicketDialog?.({
                booking: selectedBooking,
                open: ticketDialogOpen,
                onOpenChange: setTicketDialogOpen,
            })}
        </>
    );
}

// Export status variant maps for external use
export { bookingStatusToVariant, vendorStatusToVariant };
