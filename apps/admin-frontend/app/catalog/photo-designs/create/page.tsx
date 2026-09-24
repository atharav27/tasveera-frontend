"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@corpora/ui";
import { PhotoDesignForm } from "@/components/photo-designs/photo-design-form";

export default function CreatePhotoDesignPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (data: any) => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Creating Photo Design:", data);
        setIsLoading(false);
        // Navigate to the list or detail page
        router.push("/catalog/photo-designs");
    };

    return (
        <DashboardLayout 
            title="Create Photo Design" 
            subtitle="Define a new photo arrangement for frames"
            breadcrumbs={[
                { label: "Catalog", href: "/catalog/products" },
                { label: "Photo Designs", href: "/catalog/photo-designs" },
                { label: "Create", active: true }
            ]}
        >
            <div className="mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="gap-2"
                >
                    <ChevronLeft className="h-4 w-4" /> Back to List
                </Button>
            </div>

            <div className="max-w-5xl">
                <PhotoDesignForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
        </DashboardLayout>
    );
}
