export type ChangeDirection = 'up' | 'down' | 'neutral';

// --- Dashboard Stats ---

export interface ActiveTripsMetric {
    count: number;
    change: number;
    changeDirection: ChangeDirection;
}

export interface IncomingRequestsMetric {
    count: number;
    change: number;
    changeDirection: ChangeDirection;
}

export interface PendingPaymentsMetric {
    amount: string;
    currency: string;
    change: string;
    changeDirection: ChangeDirection;
}

export interface ComplianceScoreMetric {
    percentage: number;
    change: number;
    changeDirection: ChangeDirection;
}

export interface DashboardStatsData {
    activeTrips: ActiveTripsMetric;
    incomingRequests: IncomingRequestsMetric;
    pendingPayments: PendingPaymentsMetric;
    complianceScore: ComplianceScoreMetric;
}

export interface DashboardStatsResponse {
    success: boolean;
    data: DashboardStatsData;
}

// --- Pending Payouts ---

export type PayoutStatus = 'approved' | 'pending';

export interface PayoutItem {
    corporateId: string;
    corporateName: string;
    status: PayoutStatus;
    totalAmount: string;
    currency: string;
    dueDate: string | null;
    invoiceCount: number;
}

export interface PendingPayoutsData {
    payouts: PayoutItem[];
    totalPendingAmount: string;
    currency: string;
}

export interface PendingPayoutsResponse {
    success: boolean;
    data: PendingPayoutsData;
}

export interface PendingPayoutsParams {
    /** Max number of payouts to return (1–50, default 5) */
    limit?: number;
}

// --- Incoming Requests ---

export interface IncomingRequest {
    bookingId: string;
    bookingNumber: string;
    corporateId: string;
    corporateName: string;
    scheduledPickupTime: string;
    pickupAddress: string;
    estimatedFare: string | null;
    currency: string;
    createdAt: string;
}

export interface IncomingRequestsData {
    requests: IncomingRequest[];
    total: number;
    page: number;
    pageSize: number;
}

export interface IncomingRequestsResponse {
    success: boolean;
    data: IncomingRequestsData;
}

export interface IncomingRequestsParams {
    page?: number;
    pageSize?: number;
}

// --- Top Corporates ---

export interface CorporateMetric {
    corporateId: string;
    corporateName: string;
    tripCompletionPercent: number;
    onTimePercent: number;
    invoiceAccuracyPercent: number;
    totalRides: number;
}

export interface TopCorporatesData {
    corporates: CorporateMetric[];
    periodStart: string;
    periodEnd: string;
}

export interface TopCorporatesResponse {
    success: boolean;
    data: TopCorporatesData;
}

export interface TopCorporatesParams {
    /** Max corporates to return (1–50, default 5) */
    limit?: number;
    /** Start date (ISO or YYYY-MM-DD) */
    fromDate?: string;
    /** End date (ISO or YYYY-MM-DD) */
    toDate?: string;
}

// --- Trip Volume Trend ---

export type TrendGranularity = 'daily' | 'weekly' | 'monthly';

export interface TrendDataPoint {
    date: string;
    value: number;
}

export interface TripVolumeTrendData {
    granularity: TrendGranularity;
    totalTrips: number;
    data: TrendDataPoint[];
    percentageChange: number;
    periodStart: string;
    periodEnd: string;
}

export interface TripVolumeTrendResponse {
    success: boolean;
    data: TripVolumeTrendData;
}

export interface TripVolumeTrendParams {
    /** Aggregation granularity */
    granularity?: TrendGranularity;
    /** Start date (ISO or YYYY-MM-DD) */
    fromDate?: string;
    /** End date (ISO or YYYY-MM-DD) */
    toDate?: string;
}

// --- Export Params ---

export interface ExportTopCorporatesParams {
    /** Max rows to export (1–100, default 100) */
    limit?: number;
    fromDate?: string;
    toDate?: string;
}

export interface ExportTripVolumeTrendParams {
    granularity?: TrendGranularity;
    limit?: number;
    fromDate?: string;
    toDate?: string;
}
