"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Breadcrumbs, DashboardHeader, type FilterOption, type Notification } from "@corpora/ui";
import { Menu, Bell } from "lucide-react";
import { Button } from "@corpora/ui";
import { cn } from "@corpora/ui";
import { getNavItemsForRole, type UserRole } from "@/config/navigation";
import { useSession } from "@/lib/auth-client";
import { useDateFilterStore, getFilterLabel, type DateFilterOption } from "@corpora/utils";
import { mockNotificationsData } from "@/_data/mock-notifications";

// Convert app-specific filter options to generic FilterOption format
const dateFilterOptions: DateFilterOption[] = ['today', 'this_week', 'this_month', 'this_year'];

const filterOptions: FilterOption[] = dateFilterOptions.map((option) => ({
    value: option,
    label: getFilterLabel(option),
}));

interface DashboardLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    breadcrumbs?: { label: string; href?: string; active?: boolean }[];
    /** Whether to show the header filter dropdown */
    showFilter?: boolean;
    /** Whether to show the header search bar */
    showSearch?: boolean;
    /** Whether to show the notification bell */
    showNotification?: boolean;
}

export function DashboardLayout({
    children,
    title = "Dashboard",
    subtitle = "Overview of your corporate travel operations",
    breadcrumbs,
    showFilter = true,
    showSearch = true,
    showNotification = true,
}: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const [notifications, setNotifications] = React.useState<Notification[]>(mockNotificationsData);
    const { data: session } = useSession();
    const navItems = React.useMemo(() => {
        const role = (session?.user as { role?: UserRole } | undefined)?.role;
        return getNavItemsForRole(role);
    }, [session]);
    const { selectedFilter, setFilter } = useDateFilterStore();
    const router = useRouter();

    const handleMarkAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        // TODO: Call API to mark all as read
    };

    const handleViewMoreNotifications = () => {
        router.push("/notifications");
    };

    return (
        <div className="flex h-screen w-full bg-muted/30 overflow-hidden">
            {/* Sidebar - Desktop */}
            <Sidebar className="hidden lg:flex sticky top-0" navItems={navItems} />

            {/* Sidebar - Mobile Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-50 bg-black/50 transition-opacity lg:hidden",
                    isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
                )}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar - Mobile Menu */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 transform bg-sidebar transition-transform duration-300 ease-in-out lg:hidden",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <Sidebar className="w-full" navItems={navItems} />
            </aside>

            {/* Main Content */}
            <main className="flex flex-1 flex-col transition-all duration-300 ease-in-out min-w-0">
                {/* Mobile Header Toggle */}
                <div className="flex h-16 items-center px-4 lg:hidden bg-background border-b justify-between">
                    <div className="flex items-center">
                        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                            <Menu className="h-6 w-6" />
                        </Button>
                        <div className="ml-4 flex items-center gap-2">
                            <div className="bg-primary flex h-6 w-6 items-center justify-center rounded text-white overflow-hidden">
                                <span className="text-sm font-bold">C</span>
                            </div>
                            <span className="font-bold tracking-tight">CORPORA</span>
                        </div>
                    </div>

                    {/* Mobile Notification Button */}
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute right-2 top-2 flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                        </span>
                    </Button>
                </div>

                {breadcrumbs ? (
                    <div className="flex h-16 items-center px-4 lg:px-8 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <Breadcrumbs items={breadcrumbs} />
                    </div>
                ) : (
                    <DashboardHeader
                        title={title}
                        subtitle={subtitle}
                        showNotification={showNotification}
                        showSearch={showSearch}
                        showFilter={showFilter}
                        filterOptions={filterOptions}
                        selectedFilter={selectedFilter}
                        onFilterChange={(value) => setFilter(value as DateFilterOption)}
                        notifications={notifications}
                        onMarkAllAsRead={handleMarkAllAsRead}
                        onViewMoreNotifications={handleViewMoreNotifications}
                    />
                )}

                <div className="flex-1 px-4 lg:px-8 pt-4 pb-8 overflow-y-auto min-w-0">
                    {children}
                </div>
            </main>
        </div>
    );
}
