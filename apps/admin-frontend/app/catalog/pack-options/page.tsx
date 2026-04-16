"use client";

import { AdminSectionPlaceholder } from "@/components/admin-section-placeholder";
import { DashboardLayout } from "@/components/dashboard-layout";

export default function Page() {
    return (
        <DashboardLayout title="Catalog" subtitle="Pack Options" showFilter={false} showSearch={false}>
            <AdminSectionPlaceholder title="Pack Options" />
        </DashboardLayout>
    );
}
