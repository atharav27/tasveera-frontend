"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, Trash2, Camera, ExternalLink } from "lucide-react";
import { Button } from "@corpora/ui";
import { UploadMediaDialog } from "@/components/media/dialogs/upload-media-dialog";

interface BannerMediaItem {
    id: string;
    url: string;
    altText: string;
}

interface BannerMediaManagerProps {
    bannerId: string;
}

export function BannerMediaManager({ bannerId }: BannerMediaManagerProps) {
    const [media, setMedia] = React.useState<BannerMediaItem[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isUploadOpen, setIsUploadOpen] = React.useState(false);

    // Mock fetching linked media for this banner
    React.useEffect(() => {
        setIsLoading(true);
        // Simulate GET /api/v1/admin/media?type=BANNER_IMAGE&bannerId=...
        setTimeout(() => {
            setMedia([
                { id: "m-b-1", url: "https://images.unsplash.com/photo-1544450503-469601334005?q=80&w=1200", altText: "Summer Promo Image" }
            ]);
            setIsLoading(false);
        }, 800);
    }, [bannerId]);

    const handleDeleteMedia = async (id: string) => {
        // Simulate DELETE
        setMedia(prev => prev.filter(item => item.id !== id));
    };

    const handleUploadComplete = (newAsset: any) => {
        setMedia(prev => [...prev, { id: newAsset.id, url: newAsset.url, altText: newAsset.altText }]);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">Banner Media</h2>
                    <p className="text-sm text-muted-foreground font-medium mt-1">Upload and manage images for this banner.</p>
                </div>
                <Button 
                    onClick={() => setIsUploadOpen(true)}
                    className="rounded-full h-10 px-6 gap-2 shadow-sm"
                >
                    <Plus className="h-4 w-4" /> Link New Asset
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {media.map((asset) => (
                    <div key={asset.id} className="group relative rounded-[1.5rem] overflow-hidden border border-slate-200 bg-card shadow-sm hover:shadow-md transition-all">
                        <div className="relative aspect-[21/9] w-full bg-slate-50">
                            <Image src={asset.url} alt={asset.altText} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <Button size="sm" variant="secondary" className="rounded-full h-10 px-4 gap-2" onClick={() => window.open(asset.url, '_blank')}>
                                    <ExternalLink className="h-4 w-4" /> Native View
                                </Button>
                                <Button size="sm" variant="destructive" className="rounded-full h-10 w-10 p-0" onClick={() => handleDeleteMedia(asset.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <Camera className="h-3 w-3" />
                                </span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{asset.id}</span>
                            </div>
                            <span className="text-xs font-bold text-slate-600 truncate max-w-[200px]">{asset.altText || "Untitled Asset"}</span>
                        </div>
                    </div>
                ))}

                {media.length === 0 && !isLoading && (
                    <div className="col-span-full py-16 bg-slate-50 border border-dashed border-slate-200 rounded-[1.5rem] flex flex-col items-center justify-center gap-4 text-center">
                        <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                            <Plus className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-sm font-bold text-slate-900">No media linked</h3>
                            <p className="text-xs text-slate-500 font-medium max-w-[240px]">This banner has no images uploaded yet.</p>
                        </div>
                    </div>
                )}
            </div>

            <UploadMediaDialog 
                open={isUploadOpen}
                onOpenChange={setIsUploadOpen}
                onUploadComplete={handleUploadComplete}
            />
        </div>
    );
}
