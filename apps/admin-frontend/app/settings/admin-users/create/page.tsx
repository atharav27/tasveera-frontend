"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@corpora/ui";
import { AdminUserForm } from "@/components/admin-users/admin-user-form";

export default function CreateAdminUserPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (data: any) => {
        setIsLoading(true);
        // Simulate API call POST /api/v1/admin/users
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Provisioning Admin:", data);
        setIsLoading(false);
        router.push("/settings/admin-users");
    };

    return (
        <DashboardLayout 
            title="Provision Identity" 
            subtitle="Grant platform access to a new administrator"
            breadcrumbs={[
                { label: "Settings", href: "/settings/my-profile" },
                { label: "Admin Users", href: "/settings/admin-users" },
                { label: "Create", active: true }
            ]}
        >
            <div className="mb-6 max-w-5xl mx-auto">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="gap-2 font-semibold px-0 hover:bg-transparent text-slate-500 hover:text-slate-900"
                >
                    <ChevronLeft className="h-4 w-4" /> Cancel Process
                </Button>
            </div>

            <div className="max-w-5xl mx-auto">
                <AdminUserForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
        </DashboardLayout>
    );
}
