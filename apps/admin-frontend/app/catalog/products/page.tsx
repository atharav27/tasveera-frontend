"use client";

import { AdminSectionPlaceholder } from "@/components/admin-section-placeholder";
import { DashboardLayout } from "@/components/dashboard-layout";

export default function Page() {
    return (
        <DashboardLayout title="Catalog" subtitle="Products" showFilter={false} showSearch={false}>
            <AdminSectionPlaceholder title="Products" />
        </DashboardLayout>
    );
}
