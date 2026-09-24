"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@corpora/ui";
import { PackOptionsTable } from "@/components/pack-options/pack-options-table";
import { MOCK_PACK_OPTIONS, PackOption } from "@/components/pack-options/mock-data";

export default function PackOptionsPage() {
    const router = useRouter();
    const [data, setData] = React.useState<PackOption[]>(MOCK_PACK_OPTIONS);

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
            subtitle="Pack Options Management"
            breadcrumbs={[
                { label: "Catalog", href: "/catalog/products" },
                { label: "Pack Options", active: true }
            ]}
        >
            <div className="flex flex-col space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Pack Options</h1>
                        <p className="text-muted-foreground mt-1">
                            Configure polaroid and photo strip options for products.
                        </p>
                    </div>
                    <Button 
                        onClick={() => router.push("/catalog/pack-options/create")}
                        className="gap-2 rounded-full h-11 px-6 shadow-lg shadow-primary/20"
                    >
                        <Plus className="h-4 w-4" /> Create Pack Option
                    </Button>
                </div>

                <div className="bg-card rounded-2xl border p-2">
                    <PackOptionsTable 
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
