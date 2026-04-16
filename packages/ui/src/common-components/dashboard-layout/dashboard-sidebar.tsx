"use client";

import * as React from "react";
import { ChevronDown, LogOut } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../../components/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/avatar";
import { CommonAlertDialog } from "../dialogs/common-alert-dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../components/collapsible";

// ============================================================================
// Types
// ============================================================================

export interface SidebarNavChild {
    name: string;
    href: string;
    disabled?: boolean;
}

export interface SidebarNavItem {
    name: string;
    /**
     * Link for a single (leaf) item. Optional when `children` is set — the row is group-only.
     */
    href?: string;
    icon: LucideIcon;
    disabled?: boolean;
    children?: SidebarNavChild[];
}

export interface SidebarUser {
    name?: string | null;
    email?: string | null;
    image?: string | null;
}

type LinkComponentProps = {
    href: string;
    className?: string;
    children: React.ReactNode;
};

type ImageComponentProps = {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
};

export interface DashboardSidebarProps {
    /** Additional CSS classes */
    className?: string;
    /** Navigation items to display */
    navItems: SidebarNavItem[];
    /** Current pathname for active state */
    currentPath: string;
    /** User data for the profile section */
    user?: SidebarUser | null;
    /** Logo image source */
    logoSrc?: string;
    /** Callback when logout is confirmed */
    onLogout: () => void | Promise<void>;
    /** Link component for navigation (e.g., next/link) */
    LinkComponent: React.ComponentType<LinkComponentProps>;
    /** Image component for optimized images (e.g., next/image) */
    ImageComponent: React.ComponentType<ImageComponentProps>;
    /** Optional loading state for logout */
    isLoggingOut?: boolean;
    /** Logout dialog configuration */
    logoutDialog?: {
        title?: string;
        subtitle?: string;
    };
}

// ============================================================================
// Helpers
// ============================================================================

function isRouteActive(href: string, currentPath: string): boolean {
    if (!href || href === "#") return false;
    if (href === "/") return currentPath === "/";
    return currentPath === href || currentPath.startsWith(`${href}/`);
}

// ============================================================================
// Component
// ============================================================================

export function DashboardSidebar({
    className,
    navItems,
    currentPath,
    user,
    logoSrc = "/logo.png",
    onLogout,
    LinkComponent,
    ImageComponent,
    isLoggingOut = false,
    logoutDialog = {
        title: "Confirm Logout",
        subtitle: "Are you sure you want to log out? You will need to sign in again to access your account.",
    },
}: DashboardSidebarProps) {
    const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);
    const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({});

    React.useEffect(() => {
        setOpenSections((prev) => {
            const next = { ...prev };
            for (const item of navItems) {
                if (item.children?.some((c) => isRouteActive(c.href, currentPath))) {
                    next[item.name] = true;
                }
            }
            return next;
        });
    }, [currentPath, navItems]);

    const handleLogoutClick = () => {
        setShowLogoutDialog(true);
    };

    const handleLogoutConfirm = async () => {
        await onLogout();
        setShowLogoutDialog(false);
    };

    const userInitials = user?.name
        ? user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
        : "U";

    return (
        <div
            className={cn(
                "flex h-screen w-64 flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
                className,
            )}
        >
            {/* Logo */}
            <div className="flex h-20 items-center px-6">
                <div className="flex items-center w-full">
                    <img
                        src={logoSrc}
                        alt="Logo"
                        className="max-h-12 w-full object-contain"
                    />
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                {navItems.map((item) => {
                    const Icon = item.icon;

                    if (item.children?.length) {
                        const isOpen = openSections[item.name] ?? false;
                        const childActive = item.children.some((c) => isRouteActive(c.href, currentPath));
                        const parentActive =
                            (item.href && isRouteActive(item.href, currentPath)) || childActive;

                        return (
                            <Collapsible
                                key={item.name}
                                open={isOpen}
                                onOpenChange={(open) =>
                                    setOpenSections((s) => ({ ...s, [item.name]: open }))
                                }
                            >
                                <CollapsibleTrigger
                                    disabled={item.disabled}
                                    className={cn(
                                        "group flex w-full items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition-colors outline-none",
                                        parentActive
                                            ? "bg-brand-blue-base/15 text-sidebar-primary"
                                            : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                        item.disabled && "pointer-events-none opacity-50",
                                    )}
                                >
                                    <Icon
                                        className={cn(
                                            "h-5 w-5 shrink-0 transition-colors",
                                            parentActive
                                                ? "text-sidebar-primary"
                                                : "text-muted-foreground group-hover:text-sidebar-accent-foreground",
                                        )}
                                    />
                                    <span className="flex-1 truncate text-left">{item.name}</span>
                                    <ChevronDown
                                        className={cn(
                                            "h-4 w-4 shrink-0 transition-transform duration-200",
                                            isOpen && "rotate-180",
                                        )}
                                    />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="mt-1 space-y-0.5 border-l border-border/60 pl-3 ml-4">
                                    {item.children.map((child) => {
                                        const active = isRouteActive(child.href, currentPath);
                                        return (
                                            <LinkComponent
                                                key={child.href}
                                                href={child.href}
                                                className={cn(
                                                    "flex items-center rounded-full px-3 py-2 text-sm transition-colors",
                                                    active
                                                        ? "bg-brand-blue-base text-sidebar-primary font-medium"
                                                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                                    child.disabled && "pointer-events-none opacity-50",
                                                )}
                                            >
                                                {child.name}
                                            </LinkComponent>
                                        );
                                    })}
                                </CollapsibleContent>
                            </Collapsible>
                        );
                    }

                    const href = item.href ?? "#";
                    const isActive = isRouteActive(href, currentPath);

                    return (
                        <LinkComponent
                            key={href}
                            href={href}
                            className={cn(
                                "group flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-brand-blue-base text-sidebar-primary"
                                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                item.disabled && "pointer-events-none opacity-50",
                            )}
                        >
                            <Icon
                                className={cn(
                                    "h-5 w-5 transition-colors",
                                    isActive
                                        ? "text-sidebar-primary"
                                        : "text-muted-foreground group-hover:text-sidebar-accent-foreground",
                                )}
                            />
                            {item.name}
                        </LinkComponent>
                    );
                })}
            </nav>

            {/* Bottom Section - User Profile */}
            <div className="border-t p-4">
                <div className="flex items-center gap-3 px-2 py-3 rounded-xl bg-muted/30">
                    <Avatar className="h-10 w-10 border-2 border-background">
                        <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {userInitials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-1 flex-col overflow-hidden">
                        <span className="text-xs text-muted-foreground">Welcome back 👋</span>
                        <span className="truncate text-sm font-semibold">
                            {user?.name || "User"}
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 hover:bg-destructive/10 hover:text-destructive"
                        onClick={handleLogoutClick}
                        disabled={isLoggingOut}
                    >
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Logout Confirmation Dialog */}
            <CommonAlertDialog
                open={showLogoutDialog}
                onOpenChange={setShowLogoutDialog}
                variant="warning"
                title={logoutDialog.title || "Confirm Logout"}
                subtitle={logoutDialog.subtitle || "Are you sure you want to log out?"}
                ImageComponent={ImageComponent}
                buttons={[
                    {
                        label: "Cancel",
                        onClick: () => setShowLogoutDialog(false),
                        variant: "outline",
                        disabled: isLoggingOut,
                    },
                    {
                        label: isLoggingOut ? "Logging out..." : "Logout",
                        onClick: handleLogoutConfirm,
                        variant: "destructive",
                        disabled: isLoggingOut,
                    },
                ]}
            />
        </div>
    );
}
