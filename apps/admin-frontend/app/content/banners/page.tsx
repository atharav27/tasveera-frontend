"use client";

import { AdminSectionPlaceholder } from "@/components/admin-section-placeholder";
import { DashboardLayout } from "@/components/dashboard-layout";

export default function Page() {
    return (
        <DashboardLayout title="Content" subtitle="Banners" showFilter={false} showSearch={false}>
            <AdminSectionPlaceholder title="Banners" />
        </DashboardLayout>
    );
}
