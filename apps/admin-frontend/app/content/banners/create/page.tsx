"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@corpora/ui";
import { BannerForm } from "@/components/banners/banner-form";

export default function CreateBannerPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (data: any) => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Creating Banner:", data);
        setIsLoading(false);
        router.push("/content/banners");
    };

    return (
        <DashboardLayout 
            title="Banner Deployment" 
            subtitle="Configure a new promotional billboard"
            breadcrumbs={[
                { label: "Content", href: "/content/categories" },
                { label: "Banners", href: "/content/banners" },
                { label: "Create", active: true }
            ]}
        >
            <div className="mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="gap-2 font-bold hover:bg-slate-100"
                >
                    <ChevronLeft className="h-4 w-4" /> Cancel & Return
                </Button>
            </div>

            <div className="max-w-5xl mx-auto">
                <BannerForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
        </DashboardLayout>
    );
}
