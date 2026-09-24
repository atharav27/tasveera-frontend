"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@corpora/ui";
import { SimpleProductOptionsTable } from "@/components/simple-product-options/simple-product-options-table";
import { MOCK_SIMPLE_OPTIONS, SimpleProductOption } from "@/components/simple-product-options/mock-data";

export default function SimpleProductOptionsPage() {
    const router = useRouter();
    const [data, setData] = React.useState<SimpleProductOption[]>(MOCK_SIMPLE_OPTIONS);

    const handleDelete = (id: string) => {
        setData(prev => prev.filter(item => item.id !== id));
    };

    const handleToggleActive = (id: string) => {
        setData(prev => prev.map(item => 
            item.id === id ? { ...item, isActive: !item.isActive } : item
        ));
    };

    return (
        <DashboardLayout 
            title="Catalog" 
            subtitle="Simple Product Options Management"
            breadcrumbs={[
                { label: "Catalog", href: "/catalog/products" },
                { label: "Simple Product Options", active: true }
            ]}
        >
            <div className="flex flex-col space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Simple Product Options</h1>
                        <p className="text-muted-foreground mt-1 text-sm font-medium">
                            Manage individual add-ons, finishes, and peripheral product options.
                        </p>
                    </div>
                    <Button 
                        onClick={() => router.push("/catalog/simple-product-options/create")}
                        className="gap-2 rounded-full h-11 px-6 shadow-lg shadow-primary/20"
                    >
                        <Plus className="h-4 w-4" /> Create Option
                    </Button>
                </div>

                <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
                    <SimpleProductOptionsTable 
                        data={data} 
                        pageCount={1} 
                        onDelete={handleDelete}
                        onToggleActive={handleToggleActive}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
