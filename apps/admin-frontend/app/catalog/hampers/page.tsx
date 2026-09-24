"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@corpora/ui";
import { HampersTable } from "@/components/hampers/hampers-table";
import { MOCK_HAMPERS, Hamper } from "@/components/hampers/mock-data";

export default function HampersPage() {
    const router = useRouter();
    const [data, setData] = React.useState<Hamper[]>(MOCK_HAMPERS);

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
            subtitle="Hampers & Gift Combinations"
            breadcrumbs={[
                { label: "Catalog", href: "/catalog/products" },
                { label: "Hampers", active: true }
            ]}
        >
            <div className="flex flex-col space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Hampers</h1>
                        <p className="text-muted-foreground mt-1 text-sm font-medium">
                            Create and manage multi-item bundles and gift sets.
                        </p>
                    </div>
                    <Button 
                        onClick={() => router.push("/catalog/hampers/create")}
                        className="gap-2 rounded-full h-11 px-6 shadow-lg shadow-primary/20"
                    >
                        <Plus className="h-4 w-4" /> Create Hamper
                    </Button>
                </div>

                <div className="bg-card rounded-2xl border p-2">
                    <HampersTable 
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
