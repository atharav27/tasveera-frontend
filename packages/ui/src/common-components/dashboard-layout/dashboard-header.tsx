"use client";

import * as React from "react";
import { ChevronDown, Search } from "lucide-react";

import { Button } from "../../components/button";
import { Input } from "../../components/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../components/dropdown-menu";
import { NotificationBell } from "../notifications/notification-bell";
import { type Notification } from "../notifications/notifications-data";

// ============================================================================
// Types
// ============================================================================

export interface FilterOption {
    /** Unique value for the filter */
    value: string;
    /** Display label for the filter */
    label: string;
}

export interface DashboardHeaderProps {
    /** Page title */
    title: string;
    /** Page subtitle/description */
    subtitle?: string;
    /** Whether to show the notification bell */
    showNotification?: boolean;
    /** Whether to show the search bar */
    showSearch?: boolean;
    /** Whether to show the filter dropdown */
    showFilter?: boolean;
    /** Search input placeholder */
    searchPlaceholder?: string;
    /** Current search value */
    searchValue?: string;
    /** Callback when search value changes */
    onSearchChange?: (value: string) => void;
    /** Available filter options */
    filterOptions?: FilterOption[];
    /** Currently selected filter value */
    selectedFilter?: string;
    /** Callback when filter selection changes */
    onFilterChange?: (value: string) => void;
    /** Additional action buttons to render on the right */
    actions?: React.ReactNode;
    /** Notifications data */
    notifications?: Notification[];
    /** Callback when "Mark all as read" is clicked */
    onMarkAllAsRead?: () => void;
    /** Callback when \"View More\" is clicked on notifications */
    onViewMoreNotifications?: () => void;
}

// ============================================================================
// Component
// ============================================================================

export function DashboardHeader({
    title,
    subtitle,
    showNotification = true,
    showSearch = true,
    showFilter = true,
    searchPlaceholder = "Search",
    searchValue = "",
    onSearchChange,
    filterOptions = [],
    selectedFilter,
    onFilterChange,
    actions,
    notifications = [],
    onMarkAllAsRead,
    onViewMoreNotifications,
}: DashboardHeaderProps) {
    // Get the label for the currently selected filter
    const selectedFilterLabel = React.useMemo(() => {
        const option = filterOptions.find((opt) => opt.value === selectedFilter);
        return option?.label ?? "Select";
    }, [filterOptions, selectedFilter]);

    return (
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between w-full px-4 lg:px-8 py-4 lg:py-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-3 flex-1">
                <div className="flex-1">
                    <h1 className="text-primary text-xl font-medium tracking-tight">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-base text-slate-600">{subtitle}</p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Time Filter */}
                {showFilter && filterOptions.length > 0 && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="no-focus-outline h-10 px-5 rounded-full border-0 bg-white text-slate-500 shadow-sm hover:bg-slate-50 transition-colors"
                            >
                                <ChevronDown className="mr-2 size-5 text-slate-500" />
                                <span className="text-sm font-normal">
                                    {selectedFilterLabel}
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-48 rounded-lg border-slate-200 bg-white shadow-md"
                        >
                            {filterOptions.map((option) => (
                                <DropdownMenuItem
                                    key={option.value}
                                    onClick={() => onFilterChange?.(option.value)}
                                    className={`text-slate-500 hover:bg-slate-50 ${selectedFilter === option.value
                                        ? "bg-slate-50"
                                        : ""
                                        }`}
                                >
                                    {option.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

                {/* Search Bar */}
                {showSearch && (
                    <div className="relative hidden md:block w-64 lg:w-80">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            className="no-focus-outline w-full rounded-full border-0 bg-white px-5 pl-10 text-slate-500 shadow-sm placeholder:text-sm placeholder:text-slate-500"
                        />
                    </div>
                )}

                {/* Additional Actions */}
                {actions}

                {/* Notifications */}
                {showNotification && (
                    <div className="hidden lg:block">
                        <NotificationBell
                            notifications={notifications}
                            onMarkAllAsRead={onMarkAllAsRead}
                            onViewMore={onViewMoreNotifications}
                        />
                    </div>
                )}
            </div>
        </header>
    );
}
