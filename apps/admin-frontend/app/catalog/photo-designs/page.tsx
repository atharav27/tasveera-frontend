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

import { MOCK_PHOTO_DESIGNS, PhotoDesign } from "@/components/photo-designs/mock-data";
import { PhotoDesignsTable } from "@/components/photo-designs/photo-designs-table";
import { PhotoDesignsReorder } from "@/components/photo-designs/photo-designs-reorder";

export default function PhotoDesignsPage() {
  const router = useRouter();
  const [designs, setDesigns] = useState<PhotoDesign[]>(MOCK_PHOTO_DESIGNS);
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Alert State
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleToggleActive = (id: string) => {
    setDesigns(prev => prev.map(d => d.id === id ? { ...d, isActive: !d.isActive } : d));
  };

  const handleDeleteConfirm = (id: string) => {
    setDeleteId(id);
  };

  const executeDelete = async () => {
    if (!deleteId) return;
    setIsUpdating(true);
    // Simulate API
    await new Promise(resolve => setTimeout(resolve, 800));
    setDesigns(prev => prev.filter(d => d.id !== deleteId));
    setDeleteId(null);
    setIsUpdating(false);
  };

  const handleSaveOrder = async (orderedIds: string[]) => {
    setIsUpdating(true);
    // Simulate API reorder
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newDesigns = [...designs].sort((a, b) => {
        return orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id);
    }).map((d, i) => ({ ...d, sortOrder: i + 1 }));
    
    setDesigns(newDesigns);
    setIsReorderMode(false);
    setIsUpdating(false);
  };

  return (
    <DashboardLayout
      title="Photo Layouts"
      subtitle="Define image arrangements for collage frames."
      breadcrumbs={[
        { label: "Catalog", href: "/catalog/products" },
        { label: "Photo Designs", active: true }
      ]}
    >
      <div className="space-y-6">
        <TableTopBar
          title={isReorderMode ? "Arrange Layouts" : "All Layouts"}
          subtitle={isReorderMode ? "Drag items to change customer selection priority." : "Manage collage photo arrangements and image requirements."}
          buttons={[
            {
              text: isReorderMode ? "List View" : "Reorder Designs",
              icon: isReorderMode ? <TableIcon className="h-4 w-4" /> : <ListOrdered className="h-4 w-4" />,
              variant: "outline",
              className: "rounded-full h-11 px-6 shadow-sm border-slate-200",
              onClick: () => setIsReorderMode(!isReorderMode)
            },
            {
              text: "Create Layout",
              icon: <Plus className="h-4 w-4" />,
              variant: "default",
              className: "rounded-full h-11 px-6 shadow-md",
              onClick: () => router.push("/catalog/photo-designs/create")
            }
          ]}
        />

        {isReorderMode ? (
            <PhotoDesignsReorder 
                items={designs} 
                onSave={handleSaveOrder} 
                isLoading={isUpdating}
            />
        ) : (
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <PhotoDesignsTable 
                    data={designs} 
                    onToggleActive={handleToggleActive}
                    onDelete={handleDeleteConfirm}
                />
            </div>
        )}
      </div>

      <CommonAlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Photo Design"
        subtitle="Are you sure you want to delete this layout? This will break references in existing products if used."
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
