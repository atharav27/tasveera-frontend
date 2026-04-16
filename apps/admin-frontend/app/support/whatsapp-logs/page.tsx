"use client";

import { AdminSectionPlaceholder } from "@/components/admin-section-placeholder";
import { DashboardLayout } from "@/components/dashboard-layout";

export default function Page() {
    return (
        <DashboardLayout title="Support" subtitle="WhatsApp Logs" showFilter={false} showSearch={false}>
            <AdminSectionPlaceholder title="WhatsApp Logs" />
        </DashboardLayout>
    );
}
