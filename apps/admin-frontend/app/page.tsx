"use client";

import { DashboardStatCard } from "@corpora/ui";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Car, MapPin, TrendingUp, Info, ChartColumnBig, FileSpreadsheet, Loader2, TicketPlus, BookOpenText, Plus } from "lucide-react";
import { SlaPerformanceTrend } from "@/components/dashboard/sla-performance-trend";
import { MonthlySpendTrend } from "@/components/dashboard/monthly-spend-trend";
import { TopVendorPerformance } from "@/components/dashboard/top-vendor-performance";
import { SosAlerts } from "@/components/dashboard/sos-alerts";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PrimaryAction, QuickAction, QuickActions } from "@corpora/ui";
import { MOCK_DASHBOARD_STATS } from "@/lib/mock-dashboard-data";
import { formatMetricValue, formatTrendValue, getTrendType } from "@/lib/stat-helpers";

export default function Page() {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const stats = MOCK_DASHBOARD_STATS;

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

    const quickActions: QuickAction[] = [
        {
            id: "calendar",
            ariaLabel: "Calendar",
            icon: FileSpreadsheet,
            iconClassName: "size-6",
        },
        {
            id: "analytics",
            ariaLabel: "Analytics",
            icon: ChartColumnBig,
            iconClassName: "size-5",
        },
        {
            id: "grid-view",
            ariaLabel: "Grid view",
            icon: TicketPlus,
            iconClassName: "size-5",
        },
        {
            id: "filters",
            ariaLabel: "Filters",
            icon: BookOpenText,
            iconClassName: "size-5",
        },
    ];

    const primaryAction: PrimaryAction = {
        text: "New Booking",
        icon: Plus,
    };

    return (
        <DashboardLayout title="Dashboard" subtitle="Overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardStatCard
                    value={formatMetricValue(stats.totalTrips)}
                    title="Total Trips"
                    icon={Car}
                    trend={{
                        value: formatTrendValue(stats.totalTrips),
                        label: "from last month",
                        type: getTrendType(stats.totalTrips),
                    }}
                />
                <DashboardStatCard
                    value={formatMetricValue(stats.activeTrips)}
                    title="Active Trips"
                    icon={MapPin}
                    trend={{
                        value: formatTrendValue(stats.activeTrips),
                        label: "from last month",
                        type: getTrendType(stats.activeTrips),
                    }}
                />
                <DashboardStatCard
                    value={formatMetricValue(stats.vendorSlaScore, { isPercentage: true })}
                    title="Vendor SLA Score"
                    icon={TrendingUp}
                    trend={{
                        value: formatTrendValue(stats.vendorSlaScore, { isPercentage: true }),
                        label: "from last month",
                        type: getTrendType(stats.vendorSlaScore),
                    }}
                />
                <DashboardStatCard
                    value={formatMetricValue(stats.pendingApprovals)}
                    title="Pending Approvals"
                    icon={Info}
                    trend={{
                        value: formatTrendValue(stats.pendingApprovals),
                        label: "from last month",
                        type: getTrendType(stats.pendingApprovals, true),
                    }}
                />

                <SlaPerformanceTrend />

                <MonthlySpendTrend />

                <TopVendorPerformance />

                <SosAlerts />
                <QuickActions actions={quickActions} primaryAction={primaryAction} />
            </div>
        </DashboardLayout>
    );
}
