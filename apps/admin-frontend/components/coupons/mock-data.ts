export type CouponType = 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING';

export interface CouponUsageHistory {
    id: string;
    orderId: string;
    orderNumber: string;
    totalAmount: number;
    createdAt: string;
}

export interface Coupon {
    id: string;
    code: string;
    type: CouponType;
    value: number;
    minOrderAmount?: number;
    usageLimit?: number;
    usageCount: number;
    isActive: boolean;
    expiresAt?: string;
    createdAt: string;
    usageHistory?: CouponUsageHistory[];
}

export const MOCK_COUPONS: Coupon[] = [
    {
        id: "CPN-001",
        code: "WELCOME10",
        type: "PERCENTAGE",
        value: 10,
        minOrderAmount: 1000,
        usageLimit: 100,
        usageCount: 42,
        isActive: true,
        expiresAt: new Date("2024-12-31").toISOString(),
        createdAt: new Date("2024-01-01").toISOString(),
        usageHistory: [
            { id: "UH-1", orderId: "ORD-101", orderNumber: "TAS-123456", totalAmount: 1250, createdAt: new Date("2024-03-20").toISOString() },
            { id: "UH-2", orderId: "ORD-102", orderNumber: "TAS-123457", totalAmount: 3400, createdAt: new Date("2024-03-21").toISOString() },
        ]
    },
    {
        id: "CPN-002",
        code: "FREESHIP",
        type: "FREE_SHIPPING",
        value: 0,
        minOrderAmount: 500,
        usageLimit: undefined,
        usageCount: 15,
        isActive: true,
        createdAt: new Date("2024-02-15").toISOString()
    },
    {
        id: "CPN-003",
        code: "DUMMY",
        type: "FIXED",
        value: 500,
        minOrderAmount: 2000,
        usageLimit: 10,
        usageCount: 0,
        isActive: false,
        expiresAt: new Date("2024-04-01").toISOString(),
        createdAt: new Date("2024-03-01").toISOString()
    }
];
