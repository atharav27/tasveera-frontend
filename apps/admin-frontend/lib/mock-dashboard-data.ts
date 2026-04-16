/** Static dashboard data for frontend-only mode (no API). */

export interface DashboardStatMetric {
    value: number;
    change: number;
    percentage: number;
}

export interface DashboardStats {
    totalTrips: DashboardStatMetric;
    activeTrips: DashboardStatMetric;
    vendorSlaScore: DashboardStatMetric;
    pendingApprovals: DashboardStatMetric;
}

export const MOCK_DASHBOARD_STATS: DashboardStats = {
    totalTrips: { value: 1240, change: 48, percentage: 4.1 },
    activeTrips: { value: 186, change: -12, percentage: -6.1 },
    vendorSlaScore: { value: 94.2, change: 1.2, percentage: 1.3 },
    pendingApprovals: { value: 23, change: 5, percentage: 27.8 },
};

export type SosAlertStatus =
    | "triggered"
    | "acknowledged"
    | "in_progress"
    | "resolved"
    | "false_alarm";

export interface MockSosAlert {
    sosId: string;
    sosNumber?: string;
    bookingNumber?: string;
    status: SosAlertStatus;
    pickupAddress?: string;
    vendorName?: string;
    driverName?: string;
    triggeredAt: string;
}

export const MOCK_SLA_THRESHOLD = 92;

export const MOCK_SLA_TREND = [
    { date: "2025-03-01", slaPercent: 91, totalRides: 120, slaMet: 109, slaBreached: 11 },
    { date: "2025-03-05", slaPercent: 93, totalRides: 132, slaMet: 123, slaBreached: 9 },
    { date: "2025-03-10", slaPercent: 90, totalRides: 118, slaMet: 106, slaBreached: 12 },
    { date: "2025-03-15", slaPercent: 94, totalRides: 140, slaMet: 132, slaBreached: 8 },
    { date: "2025-03-20", slaPercent: 95, totalRides: 151, slaMet: 144, slaBreached: 7 },
];

export const MOCK_SLA_SUMMARY = {
    totalDays: MOCK_SLA_TREND.length,
    avgSlaPercent:
        MOCK_SLA_TREND.reduce((a, p) => a + p.slaPercent, 0) / MOCK_SLA_TREND.length,
};

export const MOCK_SPEND_TREND_POINTS = [
    { date: "2025-03-01", value: 420000 },
    { date: "2025-03-05", value: 455000 },
    { date: "2025-03-10", value: 398000 },
    { date: "2025-03-15", value: 512000 },
    { date: "2025-03-20", value: 489000 },
];

export const MOCK_SPEND_TREND = {
    data: MOCK_SPEND_TREND_POINTS,
    totalSpend: MOCK_SPEND_TREND_POINTS.reduce((a, p) => a + p.value, 0),
    percentageChange: 6.2,
};

export const MOCK_VENDOR_PERFORMANCE = {
    vendors: [
        { vendorName: "FastCabs", slaScore: 96, complianceScore: 94, onTimeRate: 91 },
        { vendorName: "SwiftCabs", slaScore: 93, complianceScore: 90, onTimeRate: 88 },
        { vendorName: "ZenCabs", slaScore: 89, complianceScore: 87, onTimeRate: 85 },
    ],
    totalVendors: 3,
    averageSlaScore: 92.7,
    averageComplianceScore: 90.3,
};

export const MOCK_SOS_ALERTS: MockSosAlert[] = [
    {
        sosId: "sos-1",
        bookingNumber: "BK-2024-0066",
        status: "acknowledged",
        pickupAddress: "Whitefield, Bangalore",
        vendorName: "FastCabs",
        triggeredAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
];

export const MOCK_SOS_META = { total: MOCK_SOS_ALERTS.length, page: 1, pageSize: 5 };
