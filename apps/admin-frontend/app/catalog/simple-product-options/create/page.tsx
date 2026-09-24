"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@corpora/ui";
import { SimpleProductOptionForm } from "@/components/simple-product-options/simple-product-option-form";

export default function CreateSimpleOptionPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (data: any) => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Creating Simple Option:", data);
        setIsLoading(false);
        router.push("/catalog/simple-product-options");
    };

    return (
        <DashboardLayout 
            title="Create Option" 
            subtitle="Add a new simple product option"
            breadcrumbs={[
                { label: "Catalog", href: "/catalog/products" },
                { label: "Simple Product Options", href: "/catalog/simple-product-options" },
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
                <SimpleProductOptionForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
        </DashboardLayout>
    );
}
