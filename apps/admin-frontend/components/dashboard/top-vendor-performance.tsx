"use client";

import { useMemo } from "react";
import { Download } from "lucide-react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { Button } from "@corpora/ui";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@corpora/ui";
import { MOCK_VENDOR_PERFORMANCE } from "@/lib/mock-dashboard-data";

interface TooltipPayloadItem {
    name: string;
    value: number;
    color: string;
}

const CustomTooltip = ({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: TooltipPayloadItem[];
    label?: string;
}) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-2xl border border-border bg-popover p-4 shadow-xl min-w-[180px]">
                <div className="flex flex-col gap-3">
                    <span className="text-sm font-semibold text-popover-foreground">
                        {label}
                    </span>
                    <div className="space-y-2">
                        {payload.map((entry, index) => (
                            <div key={index} className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="h-3 w-1.5 rounded-full"
                                        style={{ backgroundColor: entry.color }}
                                    />
                                    <span className="text-sm text-muted-foreground">
                                        {entry.name}
                                    </span>
                                </div>
                                <span className="text-sm font-bold text-popover-foreground">
                                    {entry.value}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export function TopVendorPerformance() {
    const vendorPerformance = MOCK_VENDOR_PERFORMANCE;

    const chartData = useMemo(() => {
        if (!vendorPerformance.vendors?.length) {
            return [];
        }
        return vendorPerformance.vendors.map((vendor) => ({
            name: vendor.vendorName,
            sla: vendor.slaScore,
            compliance: vendor.complianceScore,
            onTime: vendor.onTimeRate,
        }));
    }, [vendorPerformance.vendors]);

    const totalVendors = vendorPerformance.totalVendors || 0;
    const avgSlaScore = vendorPerformance.averageSlaScore || 0;

    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-2 flex flex-col h-full min-h-[400px]">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-2xl font-semibold leading-none tracking-tight">
                        Top Vendor Performance
                    </CardTitle>
                    <CardDescription className="text-base text-muted-foreground">
                        {totalVendors > 0
                            ? `${totalVendors} vendors · Avg SLA: ${avgSlaScore.toFixed(1)}%`
                            : "Comparative metrics across vendors"}
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
                        No vendor performance data available
                    </div>
                ) : (
                    <div className="h-full w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{ top: 20, right: 10, left: -20, bottom: 20 }}
                                barGap={4}
                            >
                                <CartesianGrid
                                    vertical={false}
                                    stroke="var(--border)"
                                    strokeDasharray="0"
                                    opacity={0.5}
                                />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "var(--muted-foreground)", fontSize: 14 }}
                                    dy={20}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "var(--muted-foreground)", fontSize: 13 }}
                                    domain={[0, 100]}
                                    ticks={[0, 25, 50, 75, 100]}
                                    width={60}
                                />
                                <Tooltip
                                    content={<CustomTooltip />}
                                    cursor={{
                                        fill: "rgba(0,0,0,0.02)",
                                    }}
                                />
                                <Bar
                                    dataKey="sla"
                                    name="SLA Score"
                                    fill="#7DD3FC"
                                    radius={[4, 4, 4, 4]}
                                    barSize={20}
                                />
                                <Bar
                                    dataKey="compliance"
                                    name="Compliance"
                                    fill="#FCD34D"
                                    radius={[4, 4, 4, 4]}
                                    barSize={20}
                                />
                                <Bar
                                    dataKey="onTime"
                                    name="On-Time Rate"
                                    fill="#FDBA74"
                                    radius={[4, 4, 4, 4]}
                                    barSize={20}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
