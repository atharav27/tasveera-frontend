"use client";

import * as React from "react";
import { Download, Plus } from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/tabs";
import { Button } from "../../components/button";
import type { Booking } from "@corpora/utils";

export interface BookingsTabsProps {
    /** Booking data to display */
    data: Booking[];
    /** Current active tab value */
    activeTab: string;
    /** Callback when tab changes */
    onTabChange: (tab: string) => void;
    /** Render prop for rendering the table in each tab */
    renderTable: (filteredData: Booking[]) => React.ReactNode;
    /** Callback for new booking button click */
    onNewBooking?: () => void;
    /** Callback for download report button click */
    onDownloadReport?: () => void;
    /** Custom title */
    title?: string;
    /** Custom description */
    description?: string;
    /** Hide action buttons */
    hideActions?: boolean;
    /** Tab configuration - allows customizing tabs */
    tabs?: Array<{
        value: string;
        label: string;
        filterFn: (data: Booking[]) => Booking[];
    }>;
}

const defaultTabs = [
    {
        value: "active",
        label: "Active Bookings",
        filterFn: (data: Booking[]) => data.filter((b) => ["requested", "scheduled", "ongoing"].includes(b.status)),
    },
    {
        value: "completed",
        label: "Completed Bookings",
        filterFn: (data: Booking[]) => data.filter((b) => b.status === "completed"),
    },
    {
        value: "cancelled",
        label: "Cancelled Bookings",
        filterFn: (data: Booking[]) => data.filter((b) => b.status === "cancelled"),
    },
];

export function BookingsTabs({
    data,
    activeTab,
    onTabChange,
    renderTable,
    onNewBooking,
    onDownloadReport,
    title = "All Bookings",
    description = "View, add, and download booking reports in one place",
    hideActions = false,
    tabs = defaultTabs,
}: BookingsTabsProps) {
    const getFilteredData = React.useCallback((tabValue: string) => {
        const tab = tabs.find(t => t.value === tabValue);
        return tab ? tab.filterFn(data) : data;
    }, [data, tabs]);

    return (
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
            <div className="border-b border-border px-8 pt-2">
                <TabsList className="bg-transparent w-full justify-start rounded-none h-auto p-0">
                    {tabs.map((tab) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4 text-sm font-medium"
                        >
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>

            <div className="p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-bold text-foreground">{title}</h3>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                    {!hideActions && (
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                className="rounded-full h-11 px-6 border-border"
                                onClick={onDownloadReport}
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Download Report
                            </Button>
                            <Button
                                className="rounded-full h-11 px-6 bg-primary hover:bg-primary/90 text-white"
                                onClick={onNewBooking}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                New Booking
                            </Button>
                        </div>
                    )}
                </div>

                {tabs.map((tab) => (
                    <TabsContent key={tab.value} value={tab.value} className="mt-0 outline-none">
                        {renderTable(getFilteredData(tab.value))}
                    </TabsContent>
                ))}
            </div>
        </Tabs>
    );
}

// Export default tabs for convenience
export { defaultTabs as bookingsDefaultTabs };
