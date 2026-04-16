import type { Ticket } from "@/types/tickets";

const TICKET_TYPE_TO_CATEGORY: Record<string, string> = {
    "Trip Issue": "ride_issue",
    "Billing Issue": "billing_issue",
    "Vendor Issue": "vendor_issue",
    "Compliance Issue": "compliance_issue",
    Custom: "other",
};

/** Row shape expected by `TicketsTable` columns (API-style fields). */
export type TicketsTableRow = {
    id: string;
    ticketId: string;
    ticketNumber: string;
    category: string;
    priority: string;
    subject: string;
    description: string;
    linkedBooking: {
        id: string;
        bookingNumber: string;
        status: string;
        scheduledPickupTime: string;
    };
    vendorId: string;
    createdAt: string;
    status: string;
};

export function mapMockTicketToTableRow(t: Ticket): TicketsTableRow {
    const status =
        t.status === "in-progress" ? "in_progress" : t.status === "closed" ? "closed" : t.status;
    const priority = t.priority === "urgent" ? "critical" : t.priority;

    return {
        id: t.id,
        ticketId: t.ticketId,
        ticketNumber: t.ticketNumber,
        category: TICKET_TYPE_TO_CATEGORY[t.ticketType] ?? "other",
        priority,
        subject: t.subject,
        description: t.description,
        linkedBooking: {
            id: t.bookingId,
            bookingNumber: t.bookingId,
            status: "confirmed",
            scheduledPickupTime: t.createdAt,
        },
        vendorId: t.vendor,
        createdAt: t.createdAt,
        status,
    };
}
