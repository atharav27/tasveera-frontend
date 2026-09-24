"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@corpora/ui";
import { HamperForm } from "@/components/hampers/hamper-form";

export default function CreateHamperPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (data: any) => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Creating Hamper:", data);
        setIsLoading(false);
        // Navigate to detail page to add slots
        router.push("/catalog/hampers/HAMP-002"); 
    };

    return (
        <DashboardLayout 
            title="Create Hamper" 
            subtitle="Step 1: Set up the base hamper information"
            breadcrumbs={[
                { label: "Catalog", href: "/catalog/products" },
                { label: "Hampers", href: "/catalog/hampers" },
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
                <HamperForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
        </DashboardLayout>
    );
}
