"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@corpora/ui";
import { CategoryForm } from "@/components/categories/category-form";
import { CategoryProductsTable } from "@/components/categories/category-products-table";
import { MOCK_CATEGORIES, Category } from "@/components/categories/mock-data";

export default function CategoryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    
    const [category, setCategory] = React.useState<Category | undefined>(
        MOCK_CATEGORIES.find(c => c.id === id)
    );
    const [isLoading, setIsLoading] = React.useState(false);

    if (!category) {
        return (
            <DashboardLayout title="Not Found">
                <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-lg text-muted-foreground mb-4">Category not found.</p>
                    <Button onClick={() => router.push("/content/categories")}>Back to List</Button>
                </div>
            </DashboardLayout>
        );
    }

    const handleUpdate = async (data: any) => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setCategory(prev => prev ? { ...prev, ...data } : prev);
        setIsLoading(false);
    };

    return (
        <DashboardLayout 
            title={category.name} 
            subtitle="Configure category details and view linked products"
            breadcrumbs={[
                { label: "Content", href: "/content/categories" },
                { label: "Categories", href: "/content/categories" },
                { label: category.name, active: true }
            ]}
        >
            <div className="mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/content/categories")}
                    className="gap-2"
                >
                    <ChevronLeft className="h-4 w-4" /> Back to List
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-12 max-w-5xl">
                
                {/* SECTION A: Category Information */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold tracking-tight px-1">Category Info</h2>
                    <CategoryForm 
                        initialData={category} 
                        onSubmit={handleUpdate} 
                        isLoading={isLoading} 
                    />
                </div>
                
                <hr className="border-slate-200" />

                {/* SECTION B: Linked Products */}
                <div className="space-y-6">
                    <div className="px-1">
                        <h2 className="text-xl font-bold tracking-tight">Linked Products</h2>
                        <p className="text-sm text-muted-foreground mt-1 font-medium">Products currently assigned to this category. Managed via Catalog.</p>
                    </div>
                    
                    {category.linkedProducts && category.linkedProducts.length > 0 ? (
                        <CategoryProductsTable products={category.linkedProducts} />
                    ) : (
                        <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
                            No products are currently assigned to this category.
                        </div>
                    )}
                </div>

            </div>
        </DashboardLayout>
    );
}
