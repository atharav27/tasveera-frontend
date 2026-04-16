/** Mock support / ticket dashboard aggregates (frontend-only). */

export interface TicketStatMetric {
    current: number;
    change: number;
}

export interface TicketDashboardStats {
    period: { from: string; to: string };
    totalTickets: TicketStatMetric;
    openTickets: TicketStatMetric;
    inProgressTickets: TicketStatMetric;
    resolvedTickets: TicketStatMetric;
}

export interface SupportMetricsData {
    period: { from: string; to: string };
    totalTickets: number;
    openTickets: number;
    acknowledgedTickets: number;
    inProgressTickets: number;
    escalatedTickets: number;
    resolvedTickets: number;
    closedTickets: number;
    averageResponseTime: number;
    averageResolutionTime: number;
    slaComplianceRate: number;
    slaBreakdown: {
        responseBreached: number;
        resolutionBreached: number;
        slaCompliant: number;
    };
    byCategory: Record<string, number>;
    byPriority: Record<string, number>;
    feedbackStats: {
        totalFeedback: number;
        averageRating: number;
        ratingDistribution: Record<string, number>;
    };
    trends: Array<{
        date: string;
        totalTickets: number;
        resolvedTickets: number;
        avgResponseMinutes: number;
        avgResolutionMinutes: number;
        slaComplianceRate: number;
    }>;
}

export const MOCK_TICKET_DASHBOARD_STATS: TicketDashboardStats = {
    period: { from: "2025-03-01", to: "2025-03-25" },
    totalTickets: { current: 248, change: 12 },
    openTickets: { current: 42, change: -3 },
    inProgressTickets: { current: 28, change: 5 },
    resolvedTickets: { current: 178, change: 8 },
};

export const MOCK_RECURRING_ISSUES: { subcategory: string; count: number }[] = [
    { subcategory: "billing_mismatch", count: 12 },
    { subcategory: "driver_no_show", count: 9 },
    { subcategory: "route_delay", count: 7 },
    { subcategory: "invoice_error", count: 5 },
];

export const MOCK_SUPPORT_METRICS: SupportMetricsData = {
    period: { from: "2025-03-01", to: "2025-03-25" },
    totalTickets: 248,
    openTickets: 42,
    acknowledgedTickets: 18,
    inProgressTickets: 28,
    escalatedTickets: 4,
    resolvedTickets: 178,
    closedTickets: 156,
    averageResponseTime: 42,
    averageResolutionTime: 360,
    slaComplianceRate: 91,
    slaBreakdown: { responseBreached: 8, resolutionBreached: 5, slaCompliant: 235 },
    byCategory: {
        ride_issue: 72,
        billing_issue: 58,
        vendor_issue: 41,
        compliance_issue: 22,
        other: 55,
    },
    byPriority: { low: 40, medium: 120, high: 70, critical: 18 },
    feedbackStats: {
        totalFeedback: 96,
        averageRating: 4.2,
        ratingDistribution: { "5": 40, "4": 35, "3": 15, "2": 4, "1": 2 },
    },
    trends: [],
};
