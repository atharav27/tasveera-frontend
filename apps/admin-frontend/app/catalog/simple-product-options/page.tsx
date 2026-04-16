"use client";

import { AdminSectionPlaceholder } from "@/components/admin-section-placeholder";
import { DashboardLayout } from "@/components/dashboard-layout";

export default function Page() {
    return (
        <DashboardLayout title="Catalog" subtitle="Simple Product Options" showFilter={false} showSearch={false}>
            <AdminSectionPlaceholder title="Simple Product Options" />
        </DashboardLayout>
    );
}
