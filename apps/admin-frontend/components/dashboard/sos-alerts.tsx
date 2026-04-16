"use client";

import { MapPin, Car, AlertTriangle } from "lucide-react";
import { BadgeVariant } from "@corpora/ui";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@corpora/ui";
import type { SosAlertStatus } from "@/lib/mock-dashboard-data";
import { MOCK_SOS_ALERTS, MOCK_SOS_META } from "@/lib/mock-dashboard-data";

const getStatusVariant = (status: SosAlertStatus) => {
    switch (status) {
        case "triggered":
        case "acknowledged":
        case "in_progress":
            return { variant: "red" as const, baseVariant: "destructive" as const, label: status.replace("_", " ") };
        case "resolved":
            return { variant: "green" as const, baseVariant: "default" as const, label: "resolved" };
        case "false_alarm":
            return { variant: "neutral" as const, baseVariant: "secondary" as const, label: "false alarm" };
        default:
            return { variant: "neutral" as const, baseVariant: "secondary" as const, label: status };
    }
};

const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};

export function SosAlerts() {
    const alerts = MOCK_SOS_ALERTS;
    const meta = MOCK_SOS_META;

    return (
        <Card className="col-span-1 md:col-span-1 lg:col-span-2 flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                    <CardTitle className="text-primary">SOS Alerts</CardTitle>
                    <CardDescription className="text-slate-600">
                        {meta.total > 0
                            ? `${meta.total} alert${meta.total > 1 ? "s" : ""} in the period`
                            : "Real-time trip safety notifications"}
                    </CardDescription>
                </div>
                {meta.total > 5 && (
                    <button type="button" className="text-primary hover:text-primary/80 text-sm font-medium">
                        View More
                    </button>
                )}
            </CardHeader>
            <CardContent className="flex flex-col gap-4 pb-6">
                {alerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <AlertTriangle className="h-8 w-8 mb-2 text-green-500" />
                        <p className="text-sm">No SOS alerts</p>
                        <p className="text-xs">All trips are safe</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {alerts.map((alert) => {
                            const statusInfo = getStatusVariant(alert.status);
                            return (
                                <div key={alert.sosId} className="relative rounded-lg border p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="mb-2 flex items-center gap-2">
                                                <p className="font-semibold text-slate-900">
                                                    {alert.bookingNumber || alert.sosNumber}
                                                </p>
                                                <BadgeVariant
                                                    text={statusInfo.label}
                                                    variant={statusInfo.variant}
                                                    baseVariant={statusInfo.baseVariant}
                                                    size="sm"
                                                    rounded="default"
                                                    className="capitalize"
                                                />
                                            </div>
                                            <div className="mb-1 flex items-center gap-2 text-slate-600 text-sm">
                                                <MapPin className="size-4 text-blue-600" />
                                                <span>{alert.pickupAddress || "Location unavailable"}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-600 text-sm">
                                                <Car className="size-4 text-blue-600" />
                                                <span>
                                                    {alert.vendorName
                                                        ? `Vendor: ${alert.vendorName}`
                                                        : alert.driverName
                                                            ? `Driver: ${alert.driverName}`
                                                            : "Unknown"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-4 right-4 text-slate-600 text-sm">
                                            {formatRelativeTime(alert.triggeredAt)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
