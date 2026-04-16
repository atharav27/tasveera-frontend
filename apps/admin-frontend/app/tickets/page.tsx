"use client";

import { useState, useMemo, useEffect } from "react";

import { Plus, Loader2 } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard-layout";
import { StatCard } from "@corpora/ui";
import { TableTopBar } from "@corpora/ui";
import { BarChartComponent, PieChartComponent } from "@corpora/ui";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

import { RaiseTicketDialog } from "@/components/support/components/dialogs/raise-ticket-dialog";
import { TicketsTable } from "@/components/support/components/tickets-table";
import { formatTrend } from "@/lib/stat-helpers";
import {
    MOCK_RECURRING_ISSUES,
    MOCK_SUPPORT_METRICS,
    MOCK_TICKET_DASHBOARD_STATS,
} from "@/lib/mock-ticket-dashboard";
import { mockTickets } from "@/_data/mock-tickets";
import { mapMockTicketToTableRow, type TicketsTableRow } from "@/lib/tickets-table-mappers";


const CATEGORY_COLORS: Record<string, string> = {
    "Trip Issue": "#3b82f6",
    "Billing Issue": "#ef4444",
    "Vendor Issue": "#f59e0b",
    "Compliance Issue": "#10b981",
    "Custom": "#8b5cf6",
    "Other": "#94a3b8",
};

const CHART_COLORS = [
    "#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6",
    "#ec4899", "#06b6d4", "#f97316", "#14b8a6", "#6366f1"
];

export default function SupportPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const [raiseDialogOpen, setRaiseDialogOpen] = useState(false);
    const [ticketRows, setTicketRows] = useState<TicketsTableRow[]>(() =>
        mockTickets.map(mapMockTicketToTableRow),
    );

    const stats = MOCK_TICKET_DASHBOARD_STATS;
    const issues = MOCK_RECURRING_ISSUES;
    const metrics = MOCK_SUPPORT_METRICS;

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/login");
        }
    }, [session, isPending, router]);

    const handleRaiseTicket = () => {
        setRaiseDialogOpen(true);
    };

    const onRefresh = () => {
        /* table state is local; no remote refresh */
    };

    const {
        totalTickets: { current: totalCount, change: totalChange },
        openTickets: { current: openCount, change: openChange },
        inProgressTickets: { current: inProgressCount, change: inProgressChange },
        resolvedTickets: { current: resolvedCount, change: resolvedChange },
    } = stats;

    const statCards = useMemo(() => {
        return [
            {
                title: "Total Tickets",
                value: totalCount.toLocaleString(),
                trend: formatTrend(totalChange, totalChange, { isPercentage: true, label: "vs last month" }),
            },
            {
                title: "Open Tickets",
                value: openCount.toLocaleString(),
                trend: formatTrend(openChange, openChange, { isPercentage: true, label: "vs last month" }),
            },
            {
                title: "In Progress",
                value: inProgressCount.toLocaleString(),
                trend: formatTrend(inProgressChange, inProgressChange, { isPercentage: true, label: "vs last month" }),
            },
            {
                title: "Resolved Tickets",
                value: resolvedCount.toLocaleString(),
                trend: formatTrend(resolvedChange, resolvedChange, { isPercentage: true, label: "vs last month" }),
            },
        ];
    }, [
        totalCount,
        totalChange,
        openCount,
        openChange,
        inProgressCount,
        inProgressChange,
        resolvedCount,
        resolvedChange,
    ]);

    const pieChartData = useMemo(() => {
        return Object.entries(metrics.byCategory).map(([name, value]) => {
            const formattedName = name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            return {
                name: formattedName,
                value,
                color: CATEGORY_COLORS[formattedName] || CATEGORY_COLORS["Other"]
            };
        });
    }, [metrics.byCategory]);

    const barChartData = useMemo(() => {
        return issues.map((issue, index) => ({
            name: (issue.subcategory || "Other").replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            repeats: issue.count,
            color: CHART_COLORS[index % CHART_COLORS.length]
        }));
    }, [issues]);

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
        <DashboardLayout
            title="Support Tickets"
            subtitle="Manage ticket activity and follow progress in real time."
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            <div className="grid gap-4 md:gap-6 md:grid-cols-2 mb-8">
                <PieChartComponent
                    data={pieChartData.length > 0 ? pieChartData : [{ name: "No Data", value: 0 }]}
                    dataKey="value"
                    nameKey="name"
                    title="Ticket Distribution"
                    description="Track the most common reasons tickets are raised"
                    showDownloadButton={true}
                    labelFormatter={(entry) => `${(entry as { value: number }).value} Tickets`}
                />
                <BarChartComponent
                    data={barChartData.length > 0 ? barChartData : [{ name: "No Data", repeats: 0 }]}
                    dataKeys={["repeats"]}
                    title="Top Recurring Issues"
                    description="See patterns in repeat problem areas"
                    showDownloadButton={false}
                    layout="vertical"
                    yAxisConfig={{ dataKey: "name", width: 120 }}
                    useCellColors={true}
                />
            </div>

            <div className="rounded-2xl sm:rounded-3xl border-none bg-card shadow-sm dark:bg-zinc-900/50 p-4 sm:p-8 max-w-full overflow-hidden">
                <TableTopBar
                    title="All Tickets"
                    subtitle="View all raised tickets in one place with clear details and status updates"
                    buttons={[
                        {
                            text: "Raise Ticket",
                            icon: <Plus className="size-4" />,
                            onClick: handleRaiseTicket,
                            className: "bg-primary border-1 border-primary text-white",
                        },
                    ]}
                />

                <TicketsTable
                    data={ticketRows}
                    onRefresh={onRefresh}
                    onTicketClosed={(id) =>
                        setTicketRows((prev) =>
                            prev.map((t) => (t.id === id ? { ...t, status: "closed" } : t)),
                        )
                    }
                    onTicketUpdated={(id, updates) =>
                        setTicketRows((prev) =>
                            prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
                        )
                    }
                />
            </div>
            <RaiseTicketDialog
                open={raiseDialogOpen}
                onOpenChange={setRaiseDialogOpen}
                onSuccess={onRefresh}
                onTicketCreated={(row) => setTicketRows((prev) => [row, ...prev])}
            />
        </DashboardLayout>
    );
}
