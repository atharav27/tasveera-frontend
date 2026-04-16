"use client";

import { AdminSectionPlaceholder } from "@/components/admin-section-placeholder";
import { DashboardLayout } from "@/components/dashboard-layout";

export default function Page() {
    return (
        <DashboardLayout title="Catalog" subtitle="Frame Designs" showFilter={false} showSearch={false}>
            <AdminSectionPlaceholder title="Frame Designs" />
        </DashboardLayout>
    );
}
