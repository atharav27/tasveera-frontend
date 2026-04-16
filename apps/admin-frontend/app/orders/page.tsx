"use client";

import { AdminSectionPlaceholder } from "@/components/admin-section-placeholder";
import { DashboardLayout } from "@/components/dashboard-layout";

export default function OrdersListPage() {
    return (
        <DashboardLayout title="Orders" subtitle="Orders List" showFilter={false} showSearch={false}>
            <AdminSectionPlaceholder title="Orders List" />
        </DashboardLayout>
    );
}
