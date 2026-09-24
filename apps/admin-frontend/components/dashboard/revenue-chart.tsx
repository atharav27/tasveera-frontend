"use client";

import { useState } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@corpora/ui";
import { useDashboardApi } from "@/hooks/use-dashboard-api";

type Period = "daily" | "weekly" | "monthly";

interface RevenuePoint {
    bucket: string;
    revenue: number;
}

interface RevenueResponse {
    period: Period;
    data: RevenuePoint[];
}

const formatCurrency = (value: number) => {
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${Math.round(value / 1000)}K`;
    return `₹${value}`;
};

const CustomTooltip = ({
    active,
    payload,
}: {
    active?: boolean;
    payload?: Array<{ value: number; payload: RevenuePoint }>;
}) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-xl border border-border bg-popover p-3 shadow-lg">
                <div className="text-xs text-muted-foreground mb-1">
                    {payload[0].payload.bucket}
                </div>
                <div className="text-sm font-bold">{formatCurrency(payload[0].value)}</div>
            </div>
        );
    }
    return null;
};

function SkeletonChart() {
    return (
        <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-1/3 mb-2" />
            <div className="h-4 bg-muted rounded w-1/2 mb-6" />
            <div className="h-56 bg-muted rounded" />
        </div>
    );
}

export function RevenueChart() {
    const [period, setPeriod] = useState<Period>("daily");
    const { data, isLoading, error } = useDashboardApi<RevenueResponse>(
        `/api/v1/admin/dashboard/revenue?period=${period}`,
        [period]
    );

    const chartData = data?.data ?? [];

    return (
        <Card className="col-span-1 md:col-span-2 flex flex-col h-full min-h-[380px]">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                <div className="space-y-1">
                    <CardTitle className="text-xl font-semibold tracking-tight">
                        Revenue Overview
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        Revenue trend over time
                    </CardDescription>
                </div>
                {/* Period toggle */}
                <div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-1">
                    {(["daily", "weekly", "monthly"] as Period[]).map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => setPeriod(p)}
                            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors capitalize ${
                                period === p
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="flex-1 pb-4 pt-2">
                {isLoading ? (
                    <SkeletonChart />
                ) : error ? (
                    <div className="flex items-center justify-center h-48 text-sm text-destructive">
                        Failed to load revenue data
                    </div>
                ) : chartData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-2">
                        <span className="text-3xl">📊</span>
                        <p className="text-sm">No revenue data for this period</p>
                    </div>
                ) : (
                    <div className="h-56 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={chartData}
                                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="var(--border)"
                                />
                                <XAxis
                                    dataKey="bucket"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                                    dy={8}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                                    tickFormatter={formatCurrency}
                                    width={55}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--border)", strokeWidth: 1 }} />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#FF6B6B"
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill="url(#revenueGrad)"
                                    activeDot={{ r: 5, fill: "#FF6B6B", strokeWidth: 0 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
