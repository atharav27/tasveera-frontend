export type TicketStatus = "open" | "in-progress" | "resolved" | "closed";

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export type TicketType = "Trip Issue" | "Billing Issue" | "Vendor Issue" | "Compliance Issue" | "Custom";

export interface Ticket {
  id: string;
  ticketNumber: string;
  ticketId: string; // Format: DIS-9987-7778
  ticketType: TicketType;
  bookingId: string; // Format: BK-2024-0066
  vendor: string;
  createdOn: string; // Date format: 2025-03-25
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  requester: string;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  category: string;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface SupportTicketMetrics {
  title: string;
  value: string | number;
  trend: number;
  trendText: string;
  trendSuffix?: string;
}

export interface TicketDistribution {
  name: string;
  value: number;
  color: string;
}

export interface RecurringIssue {
  name: string;
  repeats: number;
  color: string;
}

export interface TicketAttachment {
  id: string;
  name: string;
  size: string; // e.g., "94 KB of 94 KB"
  status: "Uploaded" | "Pending" | "Failed";
  url?: string;
}

export interface TicketProgressStep {
  id: string;
  label: string;
  status: "completed" | "pending";
  timestamp?: string; // format: "2025-03-15 10:30 AM"
  icon?: "check" | "clock";
}

export interface TicketDetail extends Omit<Ticket, "vendor"> {
  vendor: {
    name: string;
    sla?: string;
    driverName: string;
    vehicleDetails: string;
    contactNumber: string;
  };
  trip: {
    pickupLocation: string;
    dropoffLocation: string;
    pickupTime: string;
    tripDuration: string;
    vehicleClass: string;
    package: string;
  };
  passenger: {
    name: string;
    type: string;
    additionalCount?: number;
  };
  issueDescription: string;
  attachments: TicketAttachment[];
  progress: TicketProgressStep[];
}

