"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@corpora/ui";
import { PackOptionForm } from "@/components/pack-options/pack-option-form";
import { MOCK_PACK_OPTIONS, PackOption } from "@/components/pack-options/mock-data";

export default function PackOptionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    
    const [option, setOption] = React.useState<PackOption | undefined>(
        MOCK_PACK_OPTIONS.find(o => o.id === id)
    );
    const [isLoading, setIsLoading] = React.useState(false);

    if (!option) {
        return (
            <DashboardLayout title="Not Found">
                <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-lg text-muted-foreground mb-4">Pack option not found.</p>
                    <Button onClick={() => router.push("/catalog/pack-options")}>Back to List</Button>
                </div>
            </DashboardLayout>
        );
    }

    const handleSubmit = async (data: any) => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setOption(prev => prev ? { ...prev, ...data } : prev);
        setIsLoading(false);
        // Optional: toast notification
    };

    return (
        <DashboardLayout 
            title={option.name} 
            subtitle={`Editing pack option ${option.id}`}
            breadcrumbs={[
                { label: "Catalog", href: "/catalog/products" },
                { label: "Pack Options", href: "/catalog/pack-options" },
                { label: option.name, active: true }
            ]}
        >
            <div className="mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/catalog/pack-options")}
                    className="gap-2"
                >
                    <ChevronLeft className="h-4 w-4" /> Back to List
                </Button>
            </div>

            <div className="max-w-5xl">
                <PackOptionForm 
                    initialData={option} 
                    onSubmit={handleSubmit} 
                    isLoading={isLoading} 
                />
            </div>
        </DashboardLayout>
    );
}
