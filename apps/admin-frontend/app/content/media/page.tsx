"use client";

import * as React from "react";
import { 
    Plus, 
    ListOrdered, 
    LayoutGrid, 
    Filter,
    Search,
    ChevronDown,
} from "lucide-react";
import Image from "next/image";

import { DashboardLayout } from "@/components/dashboard-layout";
import { 
    Button, 
    TableTopBar, 
    CommonAlertDialog,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    Input,
    Label
} from "@corpora/ui";

import { MOCK_MEDIA, MediaItem, MediaType } from "@/components/media/mock-data";
import { MediaGrid } from "@/components/media/media-grid";
import { MediaReorder } from "@/components/media/media-reorder";
import { UploadMediaDialog } from "@/components/media/dialogs/upload-media-dialog";
import { EditMediaDialog } from "@/components/media/dialogs/edit-media-dialog";

export default function MediaLibraryPage() {
    const [media, setMedia] = React.useState<MediaItem[]>(MOCK_MEDIA);
    const [isReorderMode, setIsReorderMode] = React.useState(false);
    const [isUpdating, setIsUpdating] = React.useState(false);
    
    // Filters logic
    const [selectedType, setSelectedType] = React.useState<string>("ALL");
    const [parentId, setParentId] = React.useState("");

    // Dialogs state
    const [isUploadOpen, setIsUploadOpen] = React.useState(false);
    const [isEditOpen, setIsEditOpen] = React.useState(false);
    const [editingItem, setEditingItem] = React.useState<MediaItem | undefined>(undefined);
    const [deletingId, setDeletingId] = React.useState<string | null>(null);

    const filteredMedia = React.useMemo(() => {
        return media.filter(item => {
            const matchesType = selectedType === "ALL" || item.type === selectedType;
            const matchesParent = parentId === "" || 
                item.productId === parentId || 
                item.frameDesignId === parentId || 
                item.photoDesignId === parentId ||
                item.bannerId === parentId ||
                item.categoryId === parentId;
            return matchesType && matchesParent;
        });
    }, [media, selectedType, parentId]);

    const handleToggleReorder = () => {
        if (!isReorderMode && parentId === "" && selectedType === "ALL") {
            alert("Please select a specific parent ID or Type to enable reordering context.");
            return;
        }
        setIsReorderMode(!isReorderMode);
    };

    const handleUploadComplete = (newMedia: any) => {
        const id = `m-${Math.floor(Math.random() * 1000 + 500)}`;
        setMedia(prev => [{ ...newMedia, id }, ...prev]);
    };

    const handleUpdateMetadata = async (data: any) => {
        if (!editingItem) return;
        setIsUpdating(true);
        await new Promise(r => setTimeout(r, 800));
        setMedia(prev => prev.map(m => m.id === editingItem.id ? { ...m, ...data } : m));
        setIsUpdating(false);
        setIsEditOpen(false);
    };

    const handleDelete = async () => {
        if (!deletingId) return;
        setIsUpdating(true);
        await new Promise(r => setTimeout(r, 800));
        setMedia(prev => prev.filter(m => m.id !== deletingId));
        setDeletingId(null);
        setIsUpdating(false);
    };

    const handleSaveOrder = async (orderedIds: string[]) => {
        setIsUpdating(true);
        await new Promise(r => setTimeout(r, 1000));
        
        const newOrder = [...media].map(m => {
            const idx = orderedIds.indexOf(m.id);
            if (idx !== -1) return { ...m, sortOrder: idx + 1 };
            return m;
        });

        setMedia(newOrder);
        setIsReorderMode(false);
        setIsUpdating(false);
    };

    return (
        <DashboardLayout 
            title="Cloud Storage" 
            subtitle="Centralized Asset Management"
            breadcrumbs={[
                { label: "Content", href: "/content/categories" },
                { label: "Media Library", active: true }
            ]}
        >
            <div className="space-y-8">
                {/* ADVANCED FILTERING SUITE */}
                {!isReorderMode && (
                    <div className="bg-card border rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row items-end gap-6 border-slate-200/60">
                        <div className="flex-1 w-full space-y-2">
                             <Label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Global Type Filter</Label>
                             <Select onValueChange={setSelectedType} defaultValue={selectedType}>
                                <SelectTrigger className="w-full h-14 rounded-2xl bg-slate-50/50 border-slate-100 shadow-none px-6">
                                    <SelectValue placeholder="All Assets" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                                    <SelectItem value="ALL">Total Repository</SelectItem>
                                    <SelectItem value="PRODUCT_THUMBNAIL">Product Thumbnails</SelectItem>
                                    <SelectItem value="PRODUCT_GALLERY">Product Galleries</SelectItem>
                                    <SelectItem value="FRAME_PREVIEW">Frame Previews</SelectItem>
                                    <SelectItem value="BANNER_IMAGE">Banners</SelectItem>
                                </SelectContent>
                             </Select>
                        </div>
                        
                        <div className="flex-1 w-full space-y-2">
                             <Label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Parent Context Lookup</Label>
                             <div className="relative">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input 
                                    placeholder="Enter Parent ID (e.g PRD-001)" 
                                    className="h-14 rounded-2xl bg-slate-50/50 border-slate-100 pl-12 shadow-none"
                                    value={parentId}
                                    onChange={(e) => setParentId(e.target.value)}
                                />
                             </div>
                        </div>

                        <Button 
                            variant="outline" 
                            className="h-14 w-14 rounded-2xl border-slate-100 text-slate-400 hover:text-primary hover:bg-primary/5 transition-all"
                            onClick={() => { setSelectedType("ALL"); setParentId(""); }}
                        >
                            <Filter className="h-5 w-5" />
                        </Button>
                    </div>
                )}

                {/* ACTION BAR */}
                <TableTopBar
                    title={isReorderMode ? "Matrix Sequence Editor" : "Asset Library"}
                    subtitle={isReorderMode ? "Synchronize visual order for the selected parent context." : `Displaying ${filteredMedia.length} assets matches.`}
                    buttons={[
                        {
                            text: isReorderMode ? "Exit Sequence" : "Reorder Gallery",
                            icon: isReorderMode ? <LayoutGrid className="h-4 w-4" /> : <ListOrdered className="h-4 w-4" />,
                            variant: "outline",
                            className: "rounded-full h-11 px-6 shadow-sm border-slate-200",
                            onClick: handleToggleReorder
                        },
                        {
                            text: "Uplink Media",
                            icon: <Plus className="h-4 w-4" />,
                            variant: "default",
                            className: "rounded-full h-11 px-6 shadow-md shadow-primary/20",
                            onClick: () => setIsUploadOpen(true)
                        }
                    ]}
                />

                {/* MAIN VIEWPORT */}
                <div className="min-h-[400px]">
                    {isReorderMode ? (
                        <MediaReorder 
                            items={filteredMedia} 
                            onSave={handleSaveOrder} 
                            isLoading={isUpdating}
                        />
                    ) : (
                        <MediaGrid 
                            items={filteredMedia} 
                            onEdit={(item) => { setEditingItem(item); setIsEditOpen(true); }}
                            onDelete={(id) => setDeletingId(id)}
                        />
                    )}
                </div>
            </div>

            {/* MODALS */}
            <UploadMediaDialog 
                open={isUploadOpen} 
                onOpenChange={setIsUploadOpen} 
                onUploadComplete={handleUploadComplete} 
            />

            <EditMediaDialog 
                open={isEditOpen} 
                onOpenChange={setIsEditOpen} 
                item={editingItem} 
                onSubmit={handleUpdateMetadata} 
                isLoading={isUpdating} 
            />

            <CommonAlertDialog 
                open={!!deletingId} 
                onOpenChange={(open) => !open && setDeletingId(null)}
                title="S3 Asset Removal"
                subtitle="Are you sure? This will permanently erase the cloud object and break all associated product links across the infrastructure."
                variant="error"
                ImageComponent={Image}
                buttons={[
                    { label: "Retain Asset", onClick: () => setDeletingId(null), variant: "outline" },
                    { label: "Purge Cloud Entry", onClick: handleDelete, variant: "destructive" }
                ]}
            />
        </DashboardLayout>
    );
}
