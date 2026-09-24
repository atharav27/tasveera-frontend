"use client";

import * as React from "react";
import { useQueryState } from "nuqs";

import { BookingsTabs as SharedBookingsTabs } from "@corpora/ui";
import { BookingsTable } from "./bookings-table";
import type { Booking } from "@corpora/utils";

interface BookingsTabsProps {
    data: Booking[];
}

export function BookingsTabs({ data }: BookingsTabsProps) {
    const [activeTab, setActiveTab] = useQueryState("tab", {
        defaultValue: "active",
        shallow: false,
    });

    return (
        <SharedBookingsTabs
            data={data}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            renderTable={(filteredData) => (
                <BookingsTable data={filteredData} pageCount={1} />
            )}
        />
    );
}
