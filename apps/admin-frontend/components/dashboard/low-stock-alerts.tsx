"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, BadgeVariant } from "@corpora/ui";
import { useDashboardApi } from "@/hooks/use-dashboard-api";
import { CheckCircle2 } from "lucide-react";

interface LowStockItem {
    id: string;
    name: string;
    variant?: string;
    stock: number;
    type?: string;
}

interface LowStockResponse {
    data: LowStockItem[];
}

function SkeletonRows() {
    return (
        <div className="animate-pulse space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                    <div className="h-4 bg-muted rounded flex-1" />
                    <div className="h-5 bg-muted rounded w-12" />
                </div>
            ))}
        </div>
    );
}

export function LowStockAlerts() {
    const { data, isLoading, error } = useDashboardApi<LowStockResponse>(
        "/api/v1/admin/dashboard/low-stock"
    );

    const items = data?.data ?? [];

    const isCritical = (stock: number) => stock <= 5;

    return (
        <Card className="col-span-1 flex flex-col h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold tracking-tight">
                    ⚠️ Low Stock Alerts
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                    Items that need restocking
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-4 pt-0">
                {isLoading ? (
                    <SkeletonRows />
                ) : error ? (
                    <p className="text-sm text-destructive py-4">
                        Failed to load stock alerts
                    </p>
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
                        <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                        <p className="text-sm font-medium text-emerald-600">
                            All stocks healthy
                        </p>
                        <p className="text-xs">No restocking needed right now</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className={`flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors ${
                                    isCritical(item.stock)
                                        ? "bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/40"
                                        : "bg-yellow-50/60 dark:bg-yellow-900/10 border border-yellow-200/50 dark:border-yellow-800/30"
                                }`}
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium truncate">
                                        {item.name}
                                        {item.variant ? (
                                            <span className="text-muted-foreground font-normal">
                                                {" "}— {item.variant}
                                            </span>
                                        ) : null}
                                    </p>
                                    {item.type && (
                                        <p className="text-xs text-muted-foreground capitalize">
                                            {item.type}
                                        </p>
                                    )}
                                </div>
                                <BadgeVariant
                                    variant={isCritical(item.stock) ? "red" : "amber"}
                                    size="sm"
                                    rounded="full"
                                    className="ml-3 shrink-0 font-bold"
                                >
                                    {item.stock}
                                </BadgeVariant>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
