"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@corpora/ui";
import { useDashboardApi } from "@/hooks/use-dashboard-api";

interface OrderStatusItem {
    status: string;
    count: number;
}

interface OrdersByStatusResponse {
    data: OrderStatusItem[];
    total: number;
}

const STATUS_COLORS: Record<string, string> = {
    PENDING: "#FBBF24",
    CONFIRMED: "#2DD4BF",
    PROCESSING: "#38BDF8",
    SHIPPED: "#818CF8",
    DELIVERED: "#34D399",
    CANCELLED: "#F87171",
};

const STATUS_LABELS: Record<string, string> = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    PROCESSING: "Processing",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
};

function SkeletonDonut() {
    return (
        <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-44 w-44 rounded-full bg-muted" />
            <div className="space-y-2 w-full">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-3 bg-muted rounded w-full" />
                ))}
            </div>
        </div>
    );
}

const CustomTooltip = ({
    active,
    payload,
}: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; payload: OrderStatusItem }>;
}) => {
    if (active && payload && payload.length) {
        const item = payload[0];
        return (
            <div className="rounded-xl border border-border bg-popover p-3 shadow-lg text-sm">
                <div className="font-medium">{STATUS_LABELS[item.name] ?? item.name}</div>
                <div className="text-muted-foreground">{item.value} orders</div>
            </div>
        );
    }
    return null;
};

export function OrdersByStatus() {
    const { data, isLoading, error } = useDashboardApi<OrdersByStatusResponse>(
        "/api/v1/admin/dashboard/orders-by-status"
    );

    const chartData = (data?.data ?? []).map((item) => ({
        ...item,
        name: item.status,
        fill: STATUS_COLORS[item.status] ?? "#94A3B8",
    }));

    const total = data?.total ?? chartData.reduce((acc, d) => acc + d.count, 0);

    return (
        <Card className="col-span-1 flex flex-col h-full min-h-[380px]">
            <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold tracking-tight">
                    Orders by Status
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                    Breakdown of all orders
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-4 pt-0 flex flex-col items-center justify-center">
                {isLoading ? (
                    <SkeletonDonut />
                ) : error ? (
                    <div className="text-sm text-destructive text-center py-8">
                        Failed to load order status
                    </div>
                ) : chartData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
                        <span className="text-3xl">🍩</span>
                        <p className="text-sm">No orders data available</p>
                    </div>
                ) : (
                    <div className="relative w-full h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={3}
                                    dataKey="count"
                                    nameKey="status"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.fill}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    iconType="circle"
                                    iconSize={8}
                                    formatter={(value: string) =>
                                        <span className="text-xs text-muted-foreground">{STATUS_LABELS[value] ?? value}</span>
                                    }
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center total */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ top: "-24px" }}>
                            <span className="text-2xl font-bold">{total}</span>
                            <span className="text-xs text-muted-foreground">Total</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
