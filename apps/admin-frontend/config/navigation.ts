import {
    FolderOpen,
    LayoutDashboard,
    LifeBuoy,
    Megaphone,
    Package,
    Settings,
    ShoppingCart,
} from "lucide-react";
import type { SidebarNavChild, SidebarNavItem } from "@corpora/ui";

/** App roles. `super-admin` corresponds to SUPER_ADMIN (e.g. Admin Users). */
export type UserRole = "super-admin" | "corporate-admin" | "travel-desk" | "accounts";

export interface NavChild extends SidebarNavChild {
    /** If set, only these roles see this link. */
    allowedRoles?: UserRole[];
}

export interface NavItem extends Omit<SidebarNavItem, "children"> {
    allowedRoles?: UserRole[];
    children?: NavChild[];
}

export const allNavItems: NavItem[] = [
    {
        name: "Dashboard",
        icon: LayoutDashboard,
        children: [{ name: "Overview", href: "/" }],
    },
    {
        name: "Orders",
        icon: ShoppingCart,
        children: [{ name: "Orders List", href: "/orders" }],
    },
    {
        name: "Catalog",
        icon: Package,
        children: [
            { name: "Products", href: "/catalog/products" },
            { name: "Frame Designs", href: "/catalog/frame-designs" },
            { name: "Photo Designs", href: "/catalog/photo-designs" },
            { name: "Frame Features", href: "/catalog/frame-features" },
            { name: "Pack Options", href: "/catalog/pack-options" },
            { name: "Hampers", href: "/catalog/hampers" },
            { name: "Simple Product Options", href: "/catalog/simple-product-options" },
        ],
    },
    {
        name: "Content",
        icon: FolderOpen,
        children: [
            { name: "Categories", href: "/content/categories" },
            { name: "Tags", href: "/content/tags" },
            { name: "Media Library", href: "/content/media" },
            { name: "Banners", href: "/content/banners" },
        ],
    },
    {
        name: "Marketing",
        icon: Megaphone,
        children: [{ name: "Coupons", href: "/marketing/coupons" }],
    },
    {
        name: "Support",
        icon: LifeBuoy,
        children: [
            { name: "Reviews Queue", href: "/support/reviews" },
            { name: "WhatsApp Logs", href: "/support/whatsapp-logs" },
            { name: "Tickets", href: "/tickets" },
        ],
    },
    {
        name: "Settings",
        icon: Settings,
        children: [
            {
                name: "Admin Users",
                href: "/settings/admin-users",
                allowedRoles: ["super-admin"],
            },
            { name: "My Profile", href: "/settings" },
        ],
    },
];

function filterNavChildren(children: NavChild[] | undefined, role?: UserRole): NavChild[] {
    if (!children?.length) return [];
    return children.filter((ch) => {
        if (!ch.allowedRoles?.length) return true;
        return Boolean(role && ch.allowedRoles.includes(role));
    });
}

/**
 * Filter navigation items based on user role.
 */
export function getNavItemsForRole(role?: UserRole): NavItem[] {
    return allNavItems
        .map((item) => {
            if (item.children?.length) {
                return { ...item, children: filterNavChildren(item.children, role) };
            }
            return item;
        })
        .filter((item) => {
            if (item.allowedRoles?.length && (!role || !item.allowedRoles.includes(role))) {
                return false;
            }
            if (item.children?.length === 0) {
                return false;
            }
            if (item.children?.length) {
                return true;
            }
            return Boolean(item.href);
        });
}

