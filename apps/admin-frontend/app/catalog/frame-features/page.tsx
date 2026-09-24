"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ListOrdered, Table as TableIcon } from "lucide-react";
import Image from "next/image";

import {
  DashboardLayout,
} from "@/components/dashboard-layout";
import {
  Button,
  TableTopBar,
  CommonAlertDialog,
} from "@corpora/ui";

import { MOCK_FRAME_FEATURES, FrameFeature } from "@/components/frame-features/mock-data";
import { FrameFeaturesTable } from "@/components/frame-features/frame-features-table";
import { FrameFeaturesReorder } from "@/components/frame-features/frame-features-reorder";

export default function FrameFeaturesPage() {
  const router = useRouter();
  const [features, setFeatures] = useState<FrameFeature[]>(MOCK_FRAME_FEATURES);
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Alert State
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleToggleActive = (id: string) => {
    setFeatures(prev => prev.map(f => f.id === id ? { ...f, isActive: !f.isActive } : f));
  };

  const handleDeleteConfirm = (id: string) => {
    setDeleteId(id);
  };

  const executeDelete = async () => {
    if (!deleteId) return;
    setIsUpdating(true);
    // Simulate API
    await new Promise(resolve => setTimeout(resolve, 800));
    setFeatures(prev => prev.filter(f => f.id !== deleteId));
    setDeleteId(null);
    setIsUpdating(false);
  };

  const handleSaveOrder = async (orderedIds: string[]) => {
    setIsUpdating(true);
    // Simulate API reorder
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update local state sortOrder (mocking backend update)
    const newFeatures = [...features].sort((a, b) => {
        return orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id);
    }).map((f, i) => ({ ...f, sortOrder: i + 1 }));
    
    setFeatures(newFeatures);
    setIsReorderMode(false);
    setIsUpdating(false);
  };

  return (
    <DashboardLayout
      title="Frame Features"
      subtitle="Manage glass types, mounting options, and special services."
      breadcrumbs={[
        { label: "Catalog", href: "/catalog/products" },
        { label: "Frame Features", active: true }
      ]}
    >
      <div className="space-y-6">
        <TableTopBar
          title={isReorderMode ? "Reorder Features" : "All Features"}
          subtitle={isReorderMode ? "Drag items to change display priority." : "View and manage frame design features."}
          buttons={[
            {
              text: isReorderMode ? "Switch to List" : "Reorder Features",
              icon: isReorderMode ? <TableIcon className="h-4 w-4" /> : <ListOrdered className="h-4 w-4" />,
              variant: "outline",
              className: "rounded-full h-11 px-6 shadow-sm border-slate-200",
              onClick: () => setIsReorderMode(!isReorderMode)
            },
            {
              text: "Create Feature",
              icon: <Plus className="h-4 w-4" />,
              variant: "default",
              className: "rounded-full h-11 px-6 shadow-md",
              onClick: () => router.push("/catalog/frame-features/create")
            }
          ]}
        />

        {isReorderMode ? (
            <FrameFeaturesReorder 
                items={features} 
                onSave={handleSaveOrder} 
                isLoading={isUpdating}
            />
        ) : (
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <FrameFeaturesTable 
                    data={features} 
                    onToggleActive={handleToggleActive}
                    onDelete={handleDeleteConfirm}
                />
            </div>
        )}
      </div>

      <CommonAlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Feature"
        subtitle="Are you sure you want to delete this feature? This action cannot be undone and may fail if the feature is currently assigned to frame designs."
        variant="error"
        ImageComponent={Image}
        buttons={[
          { label: "Cancel", onClick: () => setDeleteId(null), variant: "outline" },
          { label: "Delete Permanently", onClick: executeDelete, variant: "destructive" }
        ]}
      />
    </DashboardLayout>
  );
}
