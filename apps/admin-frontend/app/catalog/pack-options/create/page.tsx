"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@corpora/ui";
import { PackOptionForm } from "@/components/pack-options/pack-option-form";

export default function CreatePackOptionPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (data: any) => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Creating Pack Option:", data);
        setIsLoading(false);
        router.push("/catalog/pack-options");
    };

    return (
        <DashboardLayout 
            title="Create Pack Option" 
            subtitle="Add a new pricing/quantity configuration"
            breadcrumbs={[
                { label: "Catalog", href: "/catalog/products" },
                { label: "Pack Options", href: "/catalog/pack-options" },
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
                <PackOptionForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
        </DashboardLayout>
    );
}
