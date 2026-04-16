"use client";

import { useMemo } from "react";
import { Download } from "lucide-react";
import {
    Line,
    LineChart,
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
import { MOCK_SPEND_TREND } from "@/lib/mock-dashboard-data";

const formatCurrency = (value: number) => {
    if (value >= 100000) {
        return `₹${(value / 100000).toFixed(1)}L`;
    }
    if (value >= 1000) {
        return `₹${Math.round(value / 1000)}K`;
    }
    return `₹${value}`;
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
};

const CustomTooltip = ({
    active,
    payload,
}: {
    active?: boolean;
    payload?: Array<{ value: number; payload: { date: string; spend: number } }>;
}) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-xl border border-border bg-popover p-3 shadow-lg">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-sm bg-primary" />
                        <span className="text-sm font-medium text-popover-foreground">
                            {payload[0].payload.date}
                        </span>
                        <span className="text-sm font-bold ml-2">
                            {formatCurrency(payload[0].value)}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export function MonthlySpendTrend() {
    const spendTrend = MOCK_SPEND_TREND;

    const chartData = useMemo(() => {
        if (!spendTrend.data?.length) {
            return [];
        }
        return spendTrend.data.map((point) => ({
            date: formatDate(point.date),
            spend: point.value,
        }));
    }, [spendTrend.data]);

    const totalSpend = spendTrend.totalSpend || 0;
    const percentageChange = spendTrend.percentageChange || 0;

    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-2 flex flex-col h-full min-h-[400px]">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-2xl font-semibold leading-none tracking-tight">
                        Monthly Spend Trend
                    </CardTitle>
                    <CardDescription className="text-base text-muted-foreground">
                        Total: {formatCurrency(totalSpend)}
                        {percentageChange !== 0 && (
                            <span className={`ml-2 ${percentageChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                                ({percentageChange >= 0 ? "+" : ""}
                                {percentageChange.toFixed(1)}%)
                            </span>
                        )}
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
            <CardContent className="flex-1 pb-4 pt-8">
                {chartData.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        No spend data available for this period
                    </div>
                ) : (
                    <div className="h-full w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={chartData}
                                margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                            >
                                <CartesianGrid
                                    vertical={false}
                                    stroke="var(--border)"
                                    strokeDasharray="0"
                                />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "var(--muted-foreground)", fontSize: 13 }}
                                    dy={15}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "var(--muted-foreground)", fontSize: 13 }}
                                    tickFormatter={formatCurrency}
                                    domain={[0, "auto"]}
                                    width={60}
                                />
                                <Tooltip
                                    content={<CustomTooltip />}
                                    cursor={{
                                        stroke: "var(--border)",
                                        strokeWidth: 1,
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="spend"
                                    stroke="var(--primary)"
                                    strokeWidth={3}
                                    dot={{
                                        r: 6,
                                        fill: "var(--primary)",
                                        strokeWidth: 2,
                                        stroke: "var(--background)",
                                    }}
                                    activeDot={{
                                        r: 8,
                                        strokeWidth: 0,
                                        fill: "var(--primary)",
                                    }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
