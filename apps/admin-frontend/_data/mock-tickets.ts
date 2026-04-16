import type {
  RecurringIssue,
  Ticket,
  TicketDetail,
  TicketDistribution,
} from "@/types/tickets";

const vendors = [
  "TravelCorp",
  "GlobalTravel",
  "AsiaTravel",
  "FastCabs",
  "SwiftCabs",
  "ZenCabs",
  "ExpressCabs",
  "Cabs By Corpora",
  "MetroRide",
  "CityCabs",
  "PrimeTransit",
  "EliteCabs",
  "GreenRide",
  "SpeedCabs",
];

export const ticketTypes = [
  { label: "Trip Issue", value: "ride_issue", description: "Issues related to ongoing or past trips" },
  { label: "Billing Issue", value: "billing_issue", description: "Discrepancies in billing or invoices" },
  { label: "Vendor Issue", value: "vendor_issue", description: "Complaints or feedback regarding vendors" },
  { label: "Compliance Issue", value: "compliance_issue", description: "Regulatory or policy compliance matters" },
  { label: "Driver Issue", value: "driver_issue", description: "Feedback or complaints about drivers" },
  { label: "Technical Support", value: "system_issue", description: "App or platform technical difficulties" },
  { label: "Other", value: "other", description: "Any other queries or requests" },
];

export const ticketPriorities = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" },
];

export const vendorOptions = vendors.map((vendor) => ({
  value: vendor,
  label: vendor,
}));

export const mockTickets: Ticket[] = [
  {
    id: "1",
    ticketNumber: "TKT-2025-001",
    ticketId: "DIS-9987-7778",
    ticketType: "Trip Issue",
    bookingId: "BK-2024-0066",
    vendor: "FastCabs",
    createdOn: "2025-03-25",
    subject: "Flight delay assistance needed",
    description: "Need help with rebooking due to flight delay",
    status: "open",
    priority: "high",
    requester: "John Doe",
    assignee: "Support Team A",
    createdAt: "2025-03-25T10:00:00Z",
    updatedAt: "2025-03-25T10:00:00Z",
    category: "Travel Issue",
  },
  {
    id: "2",
    ticketNumber: "TKT-2025-002",
    ticketId: "DIS-9987-7779",
    ticketType: "Billing Issue",
    bookingId: "BK-2024-0067",
    vendor: "SwiftCabs",
    createdOn: "2025-03-24",
    subject: "Invoice discrepancy",
    description: "Invoice amount doesn't match the booking",
    status: "in-progress",
    priority: "medium",
    requester: "Jane Smith",
    assignee: "Support Team B",
    createdAt: "2025-03-24T14:30:00Z",
    updatedAt: "2025-03-24T15:00:00Z",
    category: "Billing",
  },
  {
    id: "3",
    ticketNumber: "TKT-2025-003",
    ticketId: "DIS-9987-7780",
    ticketType: "Vendor Issue",
    bookingId: "BK-2024-0068",
    vendor: "ZenCabs",
    createdOn: "2025-03-23",
    subject: "Driver no-show",
    description: "Driver did not arrive at the scheduled time",
    status: "resolved",
    priority: "high",
    requester: "Mike Johnson",
    assignee: "Support Team A",
    createdAt: "2025-03-23T09:15:00Z",
    updatedAt: "2025-03-23T16:45:00Z",
    resolvedAt: "2025-03-23T16:45:00Z",
    category: "Vendor Issue",
  },
  {
    id: "4",
    ticketNumber: "TKT-2025-004",
    ticketId: "DIS-9987-7781",
    ticketType: "Compliance Issue",
    bookingId: "BK-2024-0069",
    vendor: "BluCabs",
    createdOn: "2025-03-22",
    subject: "Document expiry",
    description: "Vendor compliance documents expired",
    status: "open",
    priority: "medium",
    requester: "Sarah Williams",
    assignee: "Support Team C",
    createdAt: "2025-03-22T11:20:00Z",
    updatedAt: "2025-03-22T11:20:00Z",
    category: "Compliance",
  },
  {
    id: "5",
    ticketNumber: "TKT-2025-005",
    ticketId: "DIS-9987-7782",
    ticketType: "Trip Issue",
    bookingId: "BK-2024-0070",
    vendor: "FastCabs",
    createdOn: "2025-03-21",
    subject: "Route change request",
    description: "Need to change the pickup location",
    status: "in-progress",
    priority: "low",
    requester: "David Brown",
    assignee: "Support Team A",
    createdAt: "2025-03-21T13:45:00Z",
    updatedAt: "2025-03-21T14:00:00Z",
    category: "Trip Issue",
  },
  {
    id: "6",
    ticketNumber: "TKT-2025-006",
    ticketId: "DIS-9987-7783",
    ticketType: "Billing Issue",
    bookingId: "BK-2024-0071",
    vendor: "SwiftCabs",
    createdOn: "2025-03-20",
    subject: "Payment processing error",
    description: "Payment was not processed correctly",
    status: "resolved",
    priority: "medium",
    requester: "Emily Davis",
    assignee: "Support Team B",
    createdAt: "2025-03-20T10:30:00Z",
    updatedAt: "2025-03-20T15:20:00Z",
    resolvedAt: "2025-03-20T15:20:00Z",
    category: "Billing",
  },
];

export const supportTicketMetrics = [
  {
    title: "Total Tickets",
    value: "20",
    trend: {
      value: "+10%",
      label: "from last month",
      type: "positive" as const,
    },
  },
  {
    title: "Open Tickets",
    value: "8",
    trend: {
      value: "+5%",
      label: "from last month",
      type: "negative" as const,
    },
  },
  {
    title: "In Progress",
    value: "6",
    trend: {
      value: "+5%",
      label: "from last month",
      type: "positive" as const,
    },
  },
  {
    title: "Resolved Tickets",
    value: "6",
    trend: {
      value: "+5%",
      label: "from last month",
      type: "positive" as const,
    },
  },
];

export const ticketDistributionData: TicketDistribution[] = [
  { name: "Trip Issue", value: 35, color: "#FBBF24" }, // yellow
  { name: "Billing Issue", value: 28, color: "brand-blue-400" }, // blue
  { name: "Vendor Issue", value: 18, color: "#EF4444" }, // red
  { name: "Compliance Issue", value: 12, color: "#10B981" }, // green
  { name: "Custom", value: 7, color: "#F97316" }, // orange
];

export const recurringIssuesData: RecurringIssue[] = [
  { name: "Billing Mismatch", repeats: 7, color: "#EC4899" }, // pink
  { name: "Driver No-Show", repeats: 5, color: "#F97316" }, // orange
  { name: "Compliance Expiry", repeats: 3, color: "#FBBF24" }, // yellow
];

export const mockTicketDetails: Record<string, TicketDetail> = {
  "DIS-9987-7778": {
    id: "1",
    ticketNumber: "TKT-2025-001",
    ticketId: "DIS-9987-7778",
    ticketType: "Trip Issue",
    bookingId: "BK-2024-0066",
    createdOn: "2025-03-25",
    subject: "Driver did not arrive at pickup location",
    description: "Driver did not arrive at pickup location despite confirmation. Customer waited for 20 minutes before canceling. This caused significant delay for an important meeting.",
    status: "open",
    priority: "high",
    requester: "John Doe",
    assignee: "Support Team A",
    createdAt: "2025-03-15T10:30:00Z",
    updatedAt: "2025-03-15T14:45:00Z",
    category: "Travel Issue",
    vendor: {
      name: "FastCabs",
      sla: "SLA 98%",
      driverName: "Rajesh Verma",
      vehicleDetails: "Sedan - KA-03-HA-1000",
      contactNumber: "+91 7676767676",
    },
    trip: {
      pickupLocation: "Whitefield Office, Bangalore, KA",
      dropoffLocation: "Kormangala, Bangalore, KA",
      pickupTime: "13 Nov, 10:00",
      tripDuration: "2 hours",
      vehicleClass: "Sedan",
      package: "Full Day",
    },
    passenger: {
      name: "John Dakota - EMP009",
      type: "Employee",
      additionalCount: 10,
    },
    issueDescription:
      "Driver did not arrive at pickup location despite confirmation. Customer waited for 20 minutes before canceling. This caused significant delay for an important meeting.",
    attachments: [
      {
        id: "1",
        name: "googlemaps-route.pdf",
        size: "94 KB of 94 KB",
        status: "Uploaded",
        url: "#",
      },
      {
        id: "2",
        name: "googlemaps-route.pdf",
        size: "94 KB of 94 KB",
        status: "Uploaded",
        url: "#",
      },
    ],
    progress: [
      {
        id: "1",
        label: "Ticket Created",
        status: "completed",
        timestamp: "2025-03-15 10:30 AM",
        icon: "check",
      },
      {
        id: "2",
        label: "Assigned / Acknowledged",
        status: "completed",
        timestamp: "2025-03-15 11:15 AM",
        icon: "check",
      },
      {
        id: "3",
        label: "In-Progress",
        status: "completed",
        timestamp: "2025-03-15 02:45 PM",
        icon: "check",
      },
      {
        id: "4",
        label: "Resolved",
        status: "pending",
        icon: "clock",
      },
    ],
  },
};

/** Booking number → vendor for raise-ticket lookup (frontend-only). */
export const mockBookingLookup: Record<string, { bookingNumber: string; vendorName: string }> =
    Object.fromEntries(
        mockTickets.map((t) => [t.bookingId, { bookingNumber: t.bookingId, vendorName: t.vendor }]),
    );
