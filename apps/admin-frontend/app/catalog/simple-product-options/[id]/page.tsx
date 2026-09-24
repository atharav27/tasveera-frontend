"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@corpora/ui";
import { SimpleProductOptionForm } from "@/components/simple-product-options/simple-product-option-form";
import { MOCK_SIMPLE_OPTIONS, SimpleProductOption } from "@/components/simple-product-options/mock-data";

export default function SimpleOptionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    
    const [option, setOption] = React.useState<SimpleProductOption | undefined>(
        MOCK_SIMPLE_OPTIONS.find(o => o.id === id)
    );
    const [isLoading, setIsLoading] = React.useState(false);

    if (!option) {
        return (
            <DashboardLayout title="Not Found">
                <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-lg text-muted-foreground mb-4">Option not found.</p>
                    <Button onClick={() => router.push("/catalog/simple-product-options")}>Back to List</Button>
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
    };

    return (
        <DashboardLayout 
            title={option.name} 
            subtitle={`Editing option ${option.id}`}
            breadcrumbs={[
                { label: "Catalog", href: "/catalog/products" },
                { label: "Simple Product Options", href: "/catalog/simple-product-options" },
                { label: option.name, active: true }
            ]}
        >
            <div className="mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/catalog/simple-product-options")}
                    className="gap-2"
                >
                    <ChevronLeft className="h-4 w-4" /> Back to List
                </Button>
            </div>

            <div className="max-w-5xl">
                <SimpleProductOptionForm 
                    initialData={option} 
                    onSubmit={handleSubmit} 
                    isLoading={isLoading} 
                />
            </div>
        </DashboardLayout>
    );
}
