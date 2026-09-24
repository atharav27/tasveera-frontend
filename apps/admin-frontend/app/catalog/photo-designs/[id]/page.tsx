"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Plus, ImageIcon } from "lucide-react";
import Image from "next/image";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@corpora/ui";
import { PhotoDesignForm } from "@/components/photo-designs/photo-design-form";
import { PhotoDesignSizes } from "@/components/photo-designs/photo-design-sizes";
import { AddSizeDialog } from "@/components/photo-designs/dialogs/add-size-dialog";
import { MOCK_PHOTO_DESIGNS, PhotoDesign, MOCK_FRAME_SIZES } from "@/components/photo-designs/mock-data";

export default function PhotoDesignDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    
    const [design, setDesign] = React.useState<PhotoDesign | undefined>(
        MOCK_PHOTO_DESIGNS.find(d => d.id === id)
    );

    const [isLoading, setIsLoading] = React.useState(false);
    const [isSizeDialogOpen, setIsSizeDialogOpen] = React.useState(false);

    if (!design) {
        return (
            <DashboardLayout title="Not Found">
                <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-lg text-muted-foreground mb-4">The requested layout was not found.</p>
                    <Button onClick={() => router.push("/catalog/photo-designs")}>Back to Layouts</Button>
                </div>
            </DashboardLayout>
        );
    }

    const handleUpdateDesign = async (data: any) => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDesign(prev => prev ? { ...prev, ...data } : prev);
        setIsLoading(false);
    };

    const handleRemoveSize = (sizeId: string) => {
        setDesign(prev => prev ? {
            ...prev,
            supportedSizes: prev.supportedSizes.filter(s => s.id !== sizeId)
        } : prev);
    };

    const handleAddSizes = async (sizeIds: string[]) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        const newSizes = MOCK_FRAME_SIZES.filter(s => sizeIds.includes(s.id));
        setDesign(prev => prev ? {
            ...prev,
            supportedSizes: [...prev.supportedSizes, ...newSizes]
        } : prev);
    };

    return (
        <DashboardLayout 
            title={design.title} 
            subtitle="Configure layout details and size compatibility"
            breadcrumbs={[
                { label: "Catalog", href: "/catalog/products" },
                { label: "Photo Designs", href: "/catalog/photo-designs" },
                { label: design.title, active: true }
            ]}
        >
            <div className="mb-6 flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => router.push("/catalog/photo-designs")} className="gap-2">
                    <ChevronLeft className="h-4 w-4" /> Back to Layouts
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-12 max-w-5xl">
                
                {/* SECTION A: Design Information */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold tracking-tight px-1">Design Information</h2>
                    <PhotoDesignForm initialData={design} onSubmit={handleUpdateDesign} isLoading={isLoading} />
                </div>
                
                <hr className="border-slate-200" />

                {/* SECTION B: Supported Frame Sizes */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">Compatible Frame Sizes</h2>
                            <p className="text-sm text-muted-foreground mt-1 font-medium">Map which physical frame sizes can use this layout.</p>
                        </div>
                        <Button onClick={() => setIsSizeDialogOpen(true)} className="gap-2 rounded-full h-10 px-5 bg-indigo-600 hover:bg-indigo-700">
                            <Plus className="h-4 w-4" /> Link Sizes
                        </Button>
                    </div>
                    
                    <PhotoDesignSizes sizes={design.supportedSizes} onRemove={handleRemoveSize} />
                </div>

                <hr className="border-slate-200" />

                {/* SECTION C: Media Preview */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold tracking-tight px-1">Preview Gallery</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {design.media.map((img) => (
                            <div key={img.id} className="group relative aspect-square rounded-2xl overflow-hidden border bg-muted shadow-sm hover:shadow-md transition-all">
                                <Image src={img.url} alt="Preview" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="bg-white/90 backdrop-blur-sm text-[10px] font-black uppercase px-2 py-1 rounded shadow-lg tracking-tighter">Preview</span>
                                </div>
                            </div>
                        ))}
                        <div className="aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground bg-muted/10 hover:bg-muted/30 transition-colors cursor-pointer group">
                             <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Plus className="h-5 w-5" />
                             </div>
                             <span className="text-[10px] font-black uppercase mt-3 tracking-widest opacity-50">Upload Link</span>
                        </div>
                    </div>
                </div>

            </div>

            <AddSizeDialog 
                open={isSizeDialogOpen}
                onOpenChange={setIsSizeDialogOpen}
                existingSizeIds={design.supportedSizes.map(s => s.id)}
                onAdd={handleAddSizes}
            />
        </DashboardLayout>
    );
}
