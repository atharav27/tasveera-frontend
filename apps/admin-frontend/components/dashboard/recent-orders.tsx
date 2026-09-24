"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    StatusBadge,
} from "@corpora/ui";
import type { BadgeVariant } from "@corpora/ui";
import { useDashboardApi } from "@/hooks/use-dashboard-api";

interface RecentOrder {
    orderId: string;
    orderNumber: string;
    customerName: string;
    status: string;
    amount: number;
    date: string;
}

interface RecentOrdersResponse {
    data: RecentOrder[];
}

// Map each order status to the BadgeVariant colours available in @corpora/ui
const ORDER_STATUS_VARIANT: Record<string, BadgeVariant> = {
    PENDING: "amber",
    CONFIRMED: "green",
    PROCESSING: "primary",
    SHIPPED: "neutral",
    DELIVERED: "green",
    CANCELLED: "red",
};

// Human-readable labels for each status
const ORDER_STATUS_LABEL: Record<string, string> = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    PROCESSING: "Processing",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
};

function formatDate(dateStr: string) {
    try {
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "2-digit",
        });
    } catch {
        return dateStr;
    }
}

function formatAmount(val: number) {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
    return `₹${val}`;
}

function SkeletonRows() {
    return (
        <div className="animate-pulse space-y-3 px-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                    <div className="h-4 bg-muted rounded w-24" />
                    <div className="h-4 bg-muted rounded flex-1" />
                    <div className="h-5 bg-muted rounded w-20" />
                    <div className="h-4 bg-muted rounded w-16" />
                    <div className="h-4 bg-muted rounded w-16" />
                </div>
            ))}
        </div>
    );
}

export function RecentOrders() {
    const { data, isLoading, error } = useDashboardApi<RecentOrdersResponse>(
        "/api/v1/admin/dashboard/recent-orders"
    );

    const orders = data?.data ?? [];

    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold tracking-tight">
                    🧾 Recent Orders
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                    Latest 10 orders across the platform
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-4 pt-0">
                {isLoading ? (
                    <SkeletonRows />
                ) : error ? (
                    <p className="text-sm text-destructive py-4">
                        Failed to load recent orders
                    </p>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
                        <span className="text-3xl">🧾</span>
                        <p className="text-sm">No recent orders</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order #</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="text-right">Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.slice(0, 10).map((order) => (
                                <TableRow key={order.orderId}>
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {order.orderNumber}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {order.customerName}
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge
                                            status={order.status}
                                            text={ORDER_STATUS_LABEL[order.status] ?? order.status}
                                            statusToVariant={ORDER_STATUS_VARIANT}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">
                                        {formatAmount(order.amount)}
                                    </TableCell>
                                    <TableCell className="text-right text-muted-foreground">
                                        {formatDate(order.date)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
