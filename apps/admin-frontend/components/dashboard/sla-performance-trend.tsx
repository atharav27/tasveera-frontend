"use client";

import { useMemo } from "react";
import { Download } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Button } from "@corpora/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@corpora/ui";
import {
    MOCK_SLA_SUMMARY,
    MOCK_SLA_THRESHOLD,
    MOCK_SLA_TREND,
} from "@/lib/mock-dashboard-data";

const formatChartDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
};

interface TooltipPayload {
    payload: {
        date: string;
        dateFull: string;
        sla: number;
        totalRides: number;
        slaMet: number;
        slaBreached: number;
    };
    value: number;
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) => {
    if (active && payload && payload.length) {
        const p = payload[0].payload;
        return (
            <div className="rounded-lg border border-border bg-popover p-3 shadow-md">
                <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-popover-foreground">{p.dateFull}</span>
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-muted-foreground">SLA Compliance</span>
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-primary" />
                            <span className="text-sm font-bold text-popover-foreground">{p.sla}%</span>
                        </div>
                    </div>
                    <div className="mt-1.5 border-t border-border pt-1.5 text-xs text-muted-foreground">
                        {p.totalRides} rides · {p.slaMet} met SLA · {p.slaBreached} breached
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export function SlaPerformanceTrend() {
    const threshold = MOCK_SLA_THRESHOLD;
    const summary = MOCK_SLA_SUMMARY;

    const chartData = useMemo(() => {
        return MOCK_SLA_TREND.map((point) => ({
            date: formatChartDate(point.date),
            dateFull: point.date,
            sla: point.slaPercent,
            totalRides: point.totalRides,
            slaMet: point.slaMet,
            slaBreached: point.slaBreached,
        }));
    }, []);

    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-2 flex flex-col h-full min-h-[400px]">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-2xl font-semibold leading-none tracking-tight">
                        SLA Performance Trend
                    </CardTitle>
                    <CardDescription className="text-base text-muted-foreground">
                        {summary.totalDays > 0
                            ? `${summary.totalDays} days · Avg SLA: ${summary.avgSlaPercent.toFixed(1)}% · Threshold: ${threshold}%`
                            : "Daily SLA compliance over the selected period"}
                    </CardDescription>
                </div>
                <Button
                    type="button"
                    variant="default"
                    className="gap-2"
                    title="Demo only — no file download in frontend-only mode"
                    onClick={() => {
                        /* frontend-only */
                    }}
                >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Download</span>
                </Button>
            </CardHeader>
            <CardContent className="flex-1 pb-4 pt-4">
                {chartData.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        No SLA trend data available
                    </div>
                ) : (
                    <div className="h-full w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSla" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    domain={[0, 100]}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                                    ticks={[0, 25, 50, 75, 100]}
                                />
                                <Tooltip
                                    content={<CustomTooltip />}
                                    cursor={{ stroke: "var(--primary)", strokeWidth: 1, strokeDasharray: "4 4" }}
                                />
                                <ReferenceLine
                                    y={threshold}
                                    stroke="var(--destructive)"
                                    strokeDasharray="4 4"
                                    strokeOpacity={0.8}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="sla"
                                    stroke="var(--primary)"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorSla)"
                                    activeDot={{
                                        r: 6,
                                        strokeWidth: 4,
                                        stroke: "var(--background)",
                                        fill: "var(--primary)",
                                    }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
