import type { Notification } from "@corpora/ui";

// Sample notifications data for development
export const mockNotificationsData: Notification[] = [
    // Activities
    {
        id: "act-1",
        type: "activity",
        category: "Activities",
        title: "Trip #BK-098-9 assigned to RapidCabs",
        subtitle: "Vendor confirmed booking request",
        timestamp: new Date(Date.now() - 0 * 60 * 1000), // Just now
        isRead: false,
        icon: "Calendar",
    },
    {
        id: "act-2",
        type: "activity",
        category: "Activities",
        title: "Vendor DriveEasy accepted Trip #BK-09776-9",
        subtitle: "Driver assignment in progress",
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
        isRead: false,
        icon: "Truck",
    },
    {
        id: "act-3",
        type: "activity",
        category: "Activities",
        title: "Recurring Trip schedule updated",
        subtitle: "Updated by Riya Bansal",
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 min ago
        isRead: false,
        icon: "Calendar",
    },
    // SOS Alerts
    {
        id: "sos-1",
        type: "sos",
        category: "SOS Alerts",
        title: "SOS triggered by driver",
        subtitle: "Trip #BK-0998 immediate attention needed",
        timestamp: new Date(Date.now() - 1 * 60 * 1000), // 1 min ago
        isRead: false,
        icon: "AlertCircle",
    },
    {
        id: "sos-2",
        type: "sos",
        category: "SOS Alerts",
        title: "Route Deviation Detected Trip #BK-9098988",
        subtitle: "3km off planned path",
        timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 min ago
        isRead: false,
        icon: "Route",
    },
    // Ticket Updates
    {
        id: "ticket-1",
        type: "ticket",
        category: "Ticket Updates",
        title: "Ticket Updated",
        subtitle: "Ticket #DIS-7782 moved to In-Progress",
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
        isRead: false,
        icon: "Ticket",
    },
    {
        id: "ticket-2",
        type: "ticket",
        category: "Ticket Updates",
        title: "Ticket Created",
        subtitle: "Ticket #DIS-7782 created for trip issue",
        timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 min ago
        isRead: false,
        icon: "Ticket",
    },
    // Finance Updates
    {
        id: "finance-1",
        type: "finance",
        category: "Finance Updates",
        title: "Invoice #INV-88898 ready for review",
        subtitle: "Total amount: ₹24,600",
        timestamp: new Date(Date.now() - 1 * 60 * 1000), // 1 min ago
        isRead: false,
        icon: "FileText",
    },
    {
        id: "finance-2",
        type: "finance",
        category: "Finance Updates",
        title: "Payment Pending: DriveSafe Cabs",
        subtitle: "Due in T+7 days",
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1h ago
        isRead: false,
        icon: "DollarSign",
    },
    {
        id: "finance-3",
        type: "finance",
        category: "Finance Updates",
        title: "Dispute #DSP-988 resolved successfully",
        subtitle: "Amount refunded to corporate account",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
        isRead: false,
        icon: "FileText",
    },
    // System & Policy
    {
        id: "system-1",
        type: "system",
        category: "System & Policy",
        title: "Travel policy updated to v2.4",
        subtitle: "Review new compliance guidelines",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        isRead: false,
        icon: "Book",
    },
    {
        id: "system-2",
        type: "system",
        category: "System & Policy",
        title: "Riya Bansal added to Finance Team",
        subtitle: "Access permissions needed",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        isRead: false,
        icon: "Users",
    },
];
