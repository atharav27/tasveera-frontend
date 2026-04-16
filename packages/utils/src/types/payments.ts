export type PaymentChangeDirection = 'up' | 'down' | 'neutral';

export interface PaymentStatMetric {
    amount: string;
    currency: string;
    change: string;
    changeDirection: PaymentChangeDirection;
}

export interface VendorPaymentStatsData {
    totalApproved: PaymentStatMetric;
    pendingSettlements: PaymentStatMetric;
    releasedAmount: PaymentStatMetric;
    overdue: PaymentStatMetric;
}

export interface VendorPaymentStatsResponse {
    success: boolean;
    data: VendorPaymentStatsData;
}
