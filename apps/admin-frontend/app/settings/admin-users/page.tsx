"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { AdminSectionPlaceholder } from "@/components/admin-section-placeholder";
import { DashboardLayout } from "@/components/dashboard-layout";
import type { UserRole } from "@/config/navigation";
import { useSession } from "@/lib/auth-client";

export default function AdminUsersPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const role = (session?.user as { role?: UserRole } | undefined)?.role;

    useEffect(() => {
        if (isPending) return;
        if (role !== "super-admin") {
            router.replace("/settings");
        }
    }, [isPending, role, router]);

    if (isPending) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (role !== "super-admin") {
        return null;
    }

    return (
        <DashboardLayout
            title="Settings"
            subtitle="Admin Users"
            showFilter={false}
            showSearch={false}
            breadcrumbs={[{ label: "Settings", href: "/settings" }, { label: "Admin Users", active: true }]}
        >
            <AdminSectionPlaceholder title="Admin Users" description="Manage SUPER_ADMIN and other admin accounts (coming soon)." />
        </DashboardLayout>
    );
}
