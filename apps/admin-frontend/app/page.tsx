"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// New API-driven dashboard sections
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { OrdersByStatus } from "@/components/dashboard/orders-by-status";
import { TopProductsTable } from "@/components/dashboard/top-products-table";
import { LowStockAlerts } from "@/components/dashboard/low-stock-alerts";
import { RecentOrders } from "@/components/dashboard/recent-orders";

export default function Page() {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/login");
        }
    }, [session, isPending, router]);

    if (isPending) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <DashboardLayout title="Dashboard" subtitle="Overview">
            <div className="space-y-6">

                {/* Row 1: Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCards />
                </div>

                {/* Row 2: Revenue Chart + Orders by Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <RevenueChart />
                    <OrdersByStatus />
                </div>

                {/* Row 3: Top Products + Low Stock Alerts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TopProductsTable />
                    <LowStockAlerts />
                </div>

                {/* Row 4: Recent Orders */}
                <div className="grid grid-cols-1 gap-4">
                    <RecentOrders />
                </div>

            </div>
        </DashboardLayout>
    );
}
