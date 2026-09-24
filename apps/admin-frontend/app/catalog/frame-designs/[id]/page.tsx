"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { 
  ChevronLeft, 
  Trash2,
  ImageIcon as ImageIconLucide,
  Settings,
  Plus
} from "lucide-react";
import Image from "next/image";

import {
  DashboardLayout,
} from "@/components/dashboard-layout";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CommonAlertDialog,
  TableTopBar,
  BadgeVariant
} from "@corpora/ui";

import { MOCK_FRAME_DESIGNS, FrameDesign, FrameDesignSize, FrameDesignFeature } from "@/components/frame-designs/mock-data";
import { FrameDesignForm } from "@/components/frame-designs/frame-design-form";
import { SizesTable } from "@/components/frame-designs/sizes-table";
import { AddEditSizeDialog } from "@/components/frame-designs/dialogs/add-edit-size-dialog";
import { UpdateStockDialog } from "@/components/frame-designs/dialogs/update-stock-dialog";

export default function FrameDesignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const designId = params.id as string;

  const [design, setDesign] = useState<FrameDesign | undefined>(
    MOCK_FRAME_DESIGNS.find((fd) => fd.id === designId)
  );

  const [isUpdating, setIsUpdating] = useState(false);

  // Dialog states
  const [sizeDialogOpen, setSizeDialogOpen] = useState(false);
  const [editingSize, setEditingSize] = useState<FrameDesignSize | undefined>(undefined);
  
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [stockTargetSize, setStockTargetSize] = useState<FrameDesignSize | undefined>(undefined);
  
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [sizeToDelete, setSizeToDelete] = useState<string | null>(null);

  if (!design) {
    return (
      <DashboardLayout title="Design Not Found">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-lg text-muted-foreground mb-4">The frame design you are looking for does not exist.</p>
          <Button onClick={() => router.push("/catalog/frame-designs")}>Back to Designs</Button>
        </div>
      </DashboardLayout>
    );
  }

  // General Design Update
  const handleUpdateDesign = async (data: any) => {
    setIsUpdating(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setDesign(prev => prev ? { ...prev, ...data } : prev);
    setIsUpdating(false);
  };

  // Specific Actions
  const handleToggleActive = () => {
    setDesign(prev => prev ? { ...prev, isActive: !prev.isActive } : prev);
  };

  // Size Actions
  const handleAddSizeClick = () => {
    setEditingSize(undefined);
    setSizeDialogOpen(true);
  };

  const handleEditSizeClick = (size: FrameDesignSize) => {
    setEditingSize(size);
    setSizeDialogOpen(true);
  };

  const handleUpdateStockClick = (size: FrameDesignSize) => {
    setStockTargetSize(size);
    setStockDialogOpen(true);
  };

  const handleDeleteSizeConfirm = (id: string) => {
    setSizeToDelete(id);
  };

  // Dialog Handlers
  const handleSaveSize = async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (editingSize) {
        setDesign(prev => prev ? {
            ...prev,
            sizes: prev.sizes.map(s => s.id === editingSize.id ? { ...s, ...data } : s)
        } : prev);
    } else {
        const newSize = { ...data, id: `size-${Date.now()}` };
        setDesign(prev => prev ? {
            ...prev,
            sizes: [...prev.sizes, newSize]
        } : prev);
    }
  };

  const handleSaveStock = async (sizeId: string, newStock: number) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    setDesign(prev => prev ? {
        ...prev,
        sizes: prev.sizes.map(s => s.id === sizeId ? { ...s, stock: newStock } : s)
    } : prev);
  };

  const executeDeleteSize = async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    setDesign(prev => prev ? {
        ...prev,
        sizes: prev.sizes.filter(s => s.id !== sizeToDelete)
    } : prev);
    setSizeToDelete(null);
  };

  // Features Actions (Simplified mock)
  const removeFeature = (fId: string) => {
    setDesign(prev => prev ? {
        ...prev,
        features: prev.features.filter(f => f.id !== fId)
    } : prev);
  };

  return (
    <DashboardLayout
      title={design.name}
      subtitle={`Product ID: ${design.productId}`}
      breadcrumbs={[
        { label: "Catalog", href: "/catalog/products" },
        { label: "Frame Designs", href: "/catalog/frame-designs" },
        { label: design.name, active: true }
      ]}
    >
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/catalog/frame-designs")}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Designs
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 max-w-5xl">
        
        {/* SECTION A: General Form Info */}
        <div className="space-y-6">
            <h2 className="text-xl font-semibold tracking-tight px-1">Design Info & Visibility</h2>
            <FrameDesignForm initialData={design} onSubmit={handleUpdateDesign} isLoading={isUpdating} />
        </div>
        
        <hr className="my-4 border-muted/50" />

        {/* SECTION B: Sizes Management */}
        <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight">Sizes & Pricing Management</h2>
                    <p className="text-sm text-muted-foreground mt-1">Manage dimensions, price, and inventory for this design.</p>
                </div>
                <Button onClick={handleAddSizeClick} className="gap-2 rounded-full h-10 px-5">
                    <Plus className="h-4 w-4" /> Add Size
                </Button>
            </div>
            
            <div className="rounded-xl border bg-card">
                <SizesTable 
                    data={design.sizes}
                    onEdit={handleEditSizeClick}
                    onUpdateStock={handleUpdateStockClick}
                    onDelete={handleDeleteSizeConfirm}
                />
            </div>
        </div>

        <hr className="my-4 border-muted/50" />

        {/* SECTION C & D: Features & Media */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Settings className="h-5 w-5" /> Assigned Features
                    </CardTitle>
                    <Button variant="outline" size="sm" className="h-8">Assign Feature</Button>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {design.features.map((f, i) => (
                            <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-800">
                                {f.name}
                                <button onClick={() => removeFeature(f.id)} className="text-slate-400 hover:text-slate-600 focus:outline-none">
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </span>
                        ))}
                        {design.features.length === 0 && (
                            <p className="text-sm text-muted-foreground italic w-full text-center py-4">No features assigned yet.</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <ImageIconLucide className="h-5 w-5" /> Media Gallery
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                        {design.media.map((img, i) => (
                            <div key={i} className="group relative aspect-square rounded-xl overflow-hidden border bg-muted">
                                <Image src={img.url} alt={img.type} fill className="object-cover transition-transform group-hover:scale-110" />
                                <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-[10px] text-white font-medium text-center uppercase tracking-wider">{img.type}</p>
                                </div>
                            </div>
                        ))}
                        {design.media.length === 0 && (
                            <div className="col-span-full py-6 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl">
                                <ImageIconLucide className="h-6 w-6 mb-2 opacity-20" />
                                <p className="text-sm">No images uploaded</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>

      </div>

      <CommonAlertDialog
        open={!!sizeToDelete}
        onOpenChange={(open) => !open && setSizeToDelete(null)}
        title="Delete Size"
        subtitle="Are you sure you want to delete this size? This action cannot be undone."
        variant="error"
        ImageComponent={Image}
        buttons={[
          { label: "Cancel", onClick: () => setSizeToDelete(null), variant: "outline" },
          { label: "Delete Permanently", onClick: executeDeleteSize, variant: "destructive" }
        ]}
      />

      <AddEditSizeDialog 
        open={sizeDialogOpen}
        onOpenChange={setSizeDialogOpen}
        size={editingSize}
        onSave={handleSaveSize}
      />

      <UpdateStockDialog
        open={stockDialogOpen}
        onOpenChange={setStockDialogOpen}
        size={stockTargetSize}
        onSave={handleSaveStock}
      />

    </DashboardLayout>
  );
}
