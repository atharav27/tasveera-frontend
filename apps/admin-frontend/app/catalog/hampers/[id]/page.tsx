"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";
import Image from "next/image";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button, CommonAlertDialog } from "@corpora/ui";
import { HamperForm } from "@/components/hampers/hamper-form";
import { HamperItemsList } from "@/components/hampers/hamper-items-list";
import { AddEditItemDialog } from "@/components/hampers/dialogs/add-edit-item-dialog";
import { MOCK_HAMPERS, Hamper, HamperItem } from "@/components/hampers/mock-data";

export default function HamperDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    
    const [hamper, setHamper] = React.useState<Hamper | undefined>(
        MOCK_HAMPERS.find(h => h.id === id)
    );

    // States
    const [isLoading, setIsLoading] = React.useState(false);
    const [isItemDialogOpen, setIsItemDialogOpen] = React.useState(false);
    const [editingItem, setEditingItem] = React.useState<HamperItem | undefined>(undefined);
    const [itemToDelete, setItemToDelete] = React.useState<string | null>(null);

    if (!hamper) {
        return (
            <DashboardLayout title="Not Found">
                <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-lg text-muted-foreground mb-4">Hamper not found.</p>
                    <Button onClick={() => router.push("/catalog/hampers")}>Back to List</Button>
                </div>
            </DashboardLayout>
        );
    }

    // Base Info Update
    const handleUpdateBase = async (data: any) => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setHamper(prev => prev ? { ...prev, ...data } : prev);
        setIsLoading(false);
    };

    // Slot Management
    const handleAddItem = () => {
        setEditingItem(undefined);
        setIsItemDialogOpen(true);
    };

    const handleEditItem = (item: HamperItem) => {
        setEditingItem(item);
        setIsItemDialogOpen(true);
    };

    const handleSaveItem = async (data: any) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        if (editingItem) {
            setHamper(prev => prev ? {
                ...prev,
                items: prev.items.map(i => i.id === editingItem.id ? { ...i, ...data, displayName: "Updated Content" } : i)
            } : prev);
        } else {
            const newItem: HamperItem = {
                ...data,
                id: `hi_${Date.now()}`,
                displayName: "New Item Content"
            };
            setHamper(prev => prev ? {
                ...prev,
                items: [...prev.items, newItem].sort((a, b) => a.sortOrder - b.sortOrder)
            } : prev);
        }
    };

    const handleReorder = async (orderedIds: string[]) => {
        // In real API, call PATCH /hampers/:id/items/reorder
        setHamper(prev => {
            if (!prev) return prev;
            const newItems = [...prev.items].sort((a, b) => 
                orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id)
            );
            return { ...prev, items: newItems };
        });
    };

    const executeDeleteItem = async () => {
        setHamper(prev => prev ? {
            ...prev,
            items: prev.items.filter(i => i.id !== itemToDelete)
        } : prev);
        setItemToDelete(null);
    };

    return (
        <DashboardLayout 
            title={hamper.name} 
            subtitle={`Manage hamper configuration and items`}
            breadcrumbs={[
                { label: "Catalog", href: "/catalog/products" },
                { label: "Hampers", href: "/catalog/hampers" },
                { label: hamper.name, active: true }
            ]}
        >
            <div className="mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/catalog/hampers")}
                    className="gap-2"
                >
                    <ChevronLeft className="h-4 w-4" /> Back to List
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-12 max-w-5xl">
                {/* SECTION A: Base Info */}
                <section className="space-y-6">
                    <div className="px-1 border-l-4 border-primary pl-4">
                        <h2 className="text-xl font-bold tracking-tight">Basic Information</h2>
                        <p className="text-sm text-muted-foreground mt-1 font-medium">Update the name, price and overall visibility.</p>
                    </div>
                    <HamperForm 
                        initialData={hamper} 
                        onSubmit={handleUpdateBase} 
                        isLoading={isLoading} 
                    />
                </section>

                <hr className="border-slate-200" />

                {/* SECTION B: Slot Composition */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <div className="border-l-4 border-indigo-501 pl-4">
                            <h2 className="text-xl font-bold tracking-tight">Slots Composition</h2>
                            <p className="text-sm text-muted-foreground mt-1 font-medium">Define which items make up this hamper bundle.</p>
                        </div>
                        <Button onClick={handleAddItem} className="gap-2 rounded-full h-10 px-5 bg-indigo-600 hover:bg-indigo-700">
                            <Plus className="h-4 w-4" /> Add Slot
                        </Button>
                    </div>

                    <HamperItemsList 
                        items={hamper.items}
                        onEdit={handleEditItem}
                        onDelete={setItemToDelete}
                        onReorder={handleReorder}
                    />
                </section>
            </div>

            <AddEditItemDialog 
                open={isItemDialogOpen}
                onOpenChange={setIsItemDialogOpen}
                item={editingItem}
                onSave={handleSaveItem}
            />

            <CommonAlertDialog
                open={!!itemToDelete}
                onOpenChange={(open) => !open && setItemToDelete(null)}
                title="Remove Slot"
                subtitle="Are you sure you want to remove this item from the hamper?"
                variant="error"
                ImageComponent={Image}
                buttons={[
                    { label: "Cancel", onClick: () => setItemToDelete(null), variant: "outline" },
                    { label: "Remove Permanently", onClick: executeDeleteItem, variant: "destructive" },
                ]}
            />
        </DashboardLayout>
    );
}
