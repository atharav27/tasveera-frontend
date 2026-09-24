"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
    BookingsTable as SharedBookingsTable,
    useBookingsTableColumns,
} from "@corpora/ui";
import { useDataTable } from "@/hooks/use-data-table";
import type { Booking } from "@corpora/utils";
import { useBookingTags, useVendors } from "@/hooks/use-bookings";
import { useDepartments } from "@/hooks/use-departments";
import { useSession } from "@/lib/auth-client";
import { RaiseTicketDialog } from "@/components/support/components/dialogs/raise-ticket-dialog";

interface BookingsTableProps {
    data: Booking[];
    pageCount: number;
    onEdit?: (booking: Booking) => void;
}

export function BookingsTable({ data, pageCount, onEdit }: BookingsTableProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const corporateId = (session?.user as { corporateId?: string } | undefined)?.corporateId;
    const { tags } = useBookingTags();
    const { departments } = useDepartments(corporateId || '');
    const { vendors } = useVendors();

    const [ticketDialogOpen, setTicketDialogOpen] = React.useState(false);
    const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(null);

    const handleView = React.useCallback((booking: Booking) => {
        router.push(`/bookings/${booking.id}`);
    }, [router]);

    const handleCancel = React.useCallback((booking: Booking) => {
        console.log("Cancelling booking:", booking.bookingNumber);
        // TODO: Implement cancel booking API call
    }, []);

    const handleRaiseTicket = React.useCallback((booking: Booking) => {
        setSelectedBooking(booking);
        setTicketDialogOpen(true);
    }, []);

    const { columns } = useBookingsTableColumns({
        onEdit,
        onView: handleView,
        onCancel: handleCancel,
        onRaiseTicket: handleRaiseTicket,
        tags,
        departments,
    });

    const { table } = useDataTable({
        data,
        columns,
        pageCount,
        initialState: {
            sorting: [{ id: "bookingNumber", desc: true }],
            columnVisibility: {
                department: false,
                tags: false,
            },
        },
        getRowId: (row) => row.id,
        shallow: false,
    });

    return (
        <>
            <SharedBookingsTable
                data={data}
                pageCount={pageCount}
                table={table}
                onEdit={onEdit}
                onView={handleView}
                onCancel={handleCancel}
                onRaiseTicket={handleRaiseTicket}
                tags={tags}
                departments={departments}
                vendors={vendors}
                ImageComponent={Image}
                renderTicketDialog={({ booking, open, onOpenChange }) => (
                    <RaiseTicketDialog
                        booking={booking}
                        open={open}
                        onOpenChange={onOpenChange}
                    />
                )}
            />

            {/* Raise Ticket Dialog - handled separately for app-specific logic */}
            <RaiseTicketDialog
                booking={selectedBooking}
                open={ticketDialogOpen}
                onOpenChange={setTicketDialogOpen}
            />
        </>
    );
}
