"use client";

import { ShoppingCart, IndianRupee, Clock, AlertTriangle } from "lucide-react";
import { DashboardStatCard } from "@corpora/ui";
import { useDashboardApi } from "@/hooks/use-dashboard-api";
import { Card, CardContent } from "@corpora/ui";

interface DashboardStats {
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    lowStockAlerts: number;
    totalOrdersTrend?: number;
    totalRevenueTrend?: number;
    pendingOrdersTrend?: number;
    lowStockAlertsTrend?: number;
}

function SkeletonCard() {
    return (
        <Card className="rounded-xl shadow-sm overflow-hidden">
            <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                    <div className="h-8 bg-muted rounded w-1/2" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                    <div className="h-3 bg-muted rounded w-3/4" />
                </div>
            </CardContent>
        </Card>
    );
}

function formatRevenue(val: number) {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
    return `₹${val}`;
}

function toTrend(pct?: number): { value: string; label: string; type: "positive" | "negative" | "neutral" } | undefined {
    if (pct === undefined) return undefined;
    const type: "positive" | "negative" | "neutral" = pct > 0 ? "positive" : pct < 0 ? "negative" : "neutral";
    const prefix = pct > 0 ? "+" : "";
    return { value: `${prefix}${pct}%`, label: "from last month", type };
}

export function StatsCards() {
    const { data, isLoading, error } = useDashboardApi<DashboardStats>(
        "/api/v1/admin/dashboard"
    );

    if (isLoading) {
        return (
            <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
            </>
        );
    }

    if (error) {
        return (
            <div className="col-span-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                Failed to load stats: {error}
            </div>
        );
    }

    const stats = data ?? {
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        lowStockAlerts: 0,
    };

    return (
        <>
            <DashboardStatCard
                value={stats.totalOrders.toLocaleString()}
                title="Total Orders"
                icon={ShoppingCart}
                trend={toTrend(stats.totalOrdersTrend)}
            />
            <DashboardStatCard
                value={formatRevenue(stats.totalRevenue)}
                title="Total Revenue"
                icon={IndianRupee}
                trend={toTrend(stats.totalRevenueTrend)}
            />
            <DashboardStatCard
                value={stats.pendingOrders.toLocaleString()}
                title="Pending Orders"
                icon={Clock}
                trend={toTrend(stats.pendingOrdersTrend)}
            />
            <DashboardStatCard
                value={stats.lowStockAlerts.toLocaleString()}
                title="Low Stock Alerts"
                icon={AlertTriangle}
                trend={toTrend(stats.lowStockAlertsTrend)}
            />
        </>
    );
}
