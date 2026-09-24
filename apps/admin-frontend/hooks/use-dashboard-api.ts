"use client";

/**
 * Mock version of useDashboardApi — returns static data immediately.
 * No network calls are made. Replace this implementation with real fetch
 * logic when the backend is ready.
 */

import { useMemo } from "react";

export interface UseDashboardApiResult<T> {
    data: T | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
}

// ─── Mock data keyed by endpoint pattern ─────────────────────────────────────

const MOCK_DASHBOARD: object = {
    totalOrders: 3_842,
    totalRevenue: 2_840_500,
    pendingOrders: 128,
    lowStockAlerts: 7,
    totalOrdersTrend: 12,
    totalRevenueTrend: 8,
    pendingOrdersTrend: -5,
    lowStockAlertsTrend: 3,
};

const MOCK_REVENUE_DAILY: object = {
    period: "daily",
    data: [
        { bucket: "Mon", revenue: 48000 },
        { bucket: "Tue", revenue: 62000 },
        { bucket: "Wed", revenue: 55000 },
        { bucket: "Thu", revenue: 71000 },
        { bucket: "Fri", revenue: 83000 },
        { bucket: "Sat", revenue: 59000 },
        { bucket: "Sun", revenue: 43000 },
    ],
};

const MOCK_REVENUE_WEEKLY: object = {
    period: "weekly",
    data: [
        { bucket: "W1", revenue: 310000 },
        { bucket: "W2", revenue: 425000 },
        { bucket: "W3", revenue: 388000 },
        { bucket: "W4", revenue: 462000 },
    ],
};

const MOCK_REVENUE_MONTHLY: object = {
    period: "monthly",
    data: [
        { bucket: "Jan", revenue: 1_200_000 },
        { bucket: "Feb", revenue: 980_000 },
        { bucket: "Mar", revenue: 1_350_000 },
        { bucket: "Apr", revenue: 1_540_000 },
        { bucket: "May", revenue: 1_290_000 },
        { bucket: "Jun", revenue: 1_670_000 },
    ],
};

const MOCK_ORDERS_BY_STATUS: object = {
    total: 3842,
    data: [
        { status: "PENDING", count: 128 },
        { status: "CONFIRMED", count: 412 },
        { status: "PROCESSING", count: 287 },
        { status: "SHIPPED", count: 634 },
        { status: "DELIVERED", count: 2204 },
        { status: "CANCELLED", count: 177 },
    ],
};

const MOCK_TOP_PRODUCTS: object = {
    data: [
        { productId: "p1", productName: "Polarised Sunglasses Frame", unitsSold: 843, revenue: 1_265_000 },
        { productId: "p2", productName: "Blue Light Blocking Frame", unitsSold: 721, revenue: 1_081_000 },
        { productId: "p3", productName: "Classic Aviator Frame", unitsSold: 612, revenue: 918_000 },
        { productId: "p4", productName: "Anti-Glare Lenses", unitsSold: 589, revenue: 706_800 },
        { productId: "p5", productName: "Progressive Lenses", unitsSold: 473, revenue: 850_000 },
        { productId: "p6", productName: "Round Metal Frame", unitsSold: 401, revenue: 481_200 },
        { productId: "p7", productName: "Cat Eye Frame", unitsSold: 378, revenue: 415_800 },
        { productId: "p8", productName: "Photochromic Lenses", unitsSold: 312, revenue: 624_000 },
        { productId: "p9", productName: "Sports Frame", unitsSold: 289, revenue: 318_000 },
        { productId: "p10", productName: "Kids Frame Set", unitsSold: 241, revenue: 192_800 },
    ],
};

const MOCK_LOW_STOCK: object = {
    data: [
        { id: "s1", name: "Aviator Frame", variant: "Gold / Large", stock: 3, type: "Frame" },
        { id: "s2", name: "Anti-Reflective Coating", variant: "Standard", stock: 5, type: "Lens Add-on" },
        { id: "s3", name: "Cat Eye Frame", variant: "Black / Medium", stock: 2, type: "Frame" },
        { id: "s4", name: "Cleaning Kit", variant: null, stock: 8, type: "Accessory" },
        { id: "s5", name: "Sport Strap", variant: "Blue", stock: 12, type: "Accessory" },
        { id: "s6", name: "Progressive Lens", variant: "High Index 1.67", stock: 4, type: "Lens" },
        { id: "s7", name: "Nose Pad Set", variant: "Silicone", stock: 1, type: "Frame Part" },
    ],
};

const MOCK_RECENT_ORDERS: object = {
    data: [
        { orderId: "o1", orderNumber: "ORD-2024-0981", customerName: "Aisha Patel", status: "DELIVERED", amount: 4800, date: "2024-04-14T10:30:00Z" },
        { orderId: "o2", orderNumber: "ORD-2024-0980", customerName: "Rahul Mehta", status: "SHIPPED", amount: 2350, date: "2024-04-14T09:15:00Z" },
        { orderId: "o3", orderNumber: "ORD-2024-0979", customerName: "Priya Sharma", status: "PROCESSING", amount: 6200, date: "2024-04-13T18:45:00Z" },
        { orderId: "o4", orderNumber: "ORD-2024-0978", customerName: "Vikram Singh", status: "CONFIRMED", amount: 1900, date: "2024-04-13T16:20:00Z" },
        { orderId: "o5", orderNumber: "ORD-2024-0977", customerName: "Sneha Iyer", status: "PENDING", amount: 3400, date: "2024-04-13T14:00:00Z" },
        { orderId: "o6", orderNumber: "ORD-2024-0976", customerName: "Ankit Joshi", status: "CANCELLED", amount: 2800, date: "2024-04-13T11:30:00Z" },
        { orderId: "o7", orderNumber: "ORD-2024-0975", customerName: "Divya Nair", status: "DELIVERED", amount: 5100, date: "2024-04-12T20:00:00Z" },
        { orderId: "o8", orderNumber: "ORD-2024-0974", customerName: "Karan Malhotra", status: "DELIVERED", amount: 3750, date: "2024-04-12T17:45:00Z" },
        { orderId: "o9", orderNumber: "ORD-2024-0973", customerName: "Meera Reddy", status: "SHIPPED", amount: 2100, date: "2024-04-12T15:10:00Z" },
        { orderId: "o10", orderNumber: "ORD-2024-0972", customerName: "Arjun Das", status: "PROCESSING", amount: 4400, date: "2024-04-12T12:30:00Z" },
    ],
};

// ─── Resolve mock data from endpoint string ───────────────────────────────────

function getMockData(endpoint: string): object {
    if (endpoint.includes("/revenue")) {
        if (endpoint.includes("weekly")) return MOCK_REVENUE_WEEKLY;
        if (endpoint.includes("monthly")) return MOCK_REVENUE_MONTHLY;
        return MOCK_REVENUE_DAILY;
    }
    if (endpoint.includes("/orders-by-status")) return MOCK_ORDERS_BY_STATUS;
    if (endpoint.includes("/top-products")) return MOCK_TOP_PRODUCTS;
    if (endpoint.includes("/low-stock")) return MOCK_LOW_STOCK;
    if (endpoint.includes("/recent-orders")) return MOCK_RECENT_ORDERS;
    if (endpoint.includes("/dashboard")) return MOCK_DASHBOARD;
    return {};
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDashboardApi<T>(
    endpoint: string,
    // deps kept for API compatibility — ignored in mock mode
    _deps: unknown[] = []
): UseDashboardApiResult<T> {
    const data = useMemo(
        () => getMockData(endpoint) as T,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [endpoint]
    );

    return {
        data,
        isLoading: false,
        error: null,
        refetch: () => {},
    };
}
