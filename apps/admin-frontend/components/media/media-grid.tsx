"use client";

import * as React from "react";
import Image from "next/image";
import { MediaItem } from "./mock-data";
import { 
    ActionsDropdown, 
    type ActionItem,
    StatusBadge,
    BadgeVariant
} from "@corpora/ui";
import { format } from "date-fns";
import { Copy, ImageIcon, Eye } from "lucide-react";

interface MediaGridProps {
    items: MediaItem[];
    onEdit: (item: MediaItem) => void;
    onDelete: (id: string) => void;
}

const TYPE_VARIANT: Record<string, BadgeVariant> = {
    PRODUCT_THUMBNAIL: "primary",
    PRODUCT_GALLERY: "primary",
    FRAME_PREVIEW: "amber",
    FRAME_GALLERY: "amber",
    PHOTO_DESIGN_PREVIEW: "neutral",
    PHOTO_TEMPLATE: "neutral",
    BANNER_IMAGE: "green",
    CATEGORY_IMAGE: "neutral",
};

export function MediaGrid({ items, onEdit, onDelete }: MediaGridProps) {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Toast would be good here
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {items.map((item) => (
                <div key={item.id} className="group relative flex flex-col rounded-3xl border bg-card shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border-slate-200/60">
                    {/* Image Section */}
                    <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                        <Image 
                            src={item.url} 
                            alt={item.altText || "Media asset"} 
                            fill 
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            <div className="flex gap-2 w-full">
                                <button 
                                    onClick={() => copyToClipboard(item.url)}
                                    className="flex-1 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white text-[10px] font-black uppercase tracking-tighter py-2 rounded-full transition-colors flex items-center justify-center gap-1.5"
                                >
                                    <Copy className="h-3 w-3" /> Copy URL
                                </button>
                                <button 
                                    className="h-8 w-8 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-colors"
                                    onClick={() => window.open(item.url, '_blank')}
                                >
                                    <Eye className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="absolute top-3 left-3">
                            <StatusBadge 
                                status={item.type} 
                                text={item.type.split('_')[0]} 
                                statusToVariant={TYPE_VARIANT}
                                className="shadow-lg backdrop-blur-md bg-opacity-80 scale-75 origin-top-left"
                            />
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="p-4 flex flex-col gap-1 flex-1 relative">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-0.5 truncate">
                                    {item.id}
                                </p>
                                <h3 className="text-sm font-bold text-slate-900 truncate leading-none mb-1">
                                    {item.altText || "No description"}
                                </h3>
                            </div>
                            <div className="shrink-0 pt-0.5">
                                <ActionsDropdown items={[
                                    { label: "Edit Metadata", icon: "pencil", onClick: () => onEdit(item) },
                                    { label: "Delete Media", icon: "trash2", variant: "destructive", onClick: () => onDelete(item.id) }
                                ]} />
                            </div>
                        </div>

                        <div className="mt-auto pt-3 flex items-center justify-between border-t border-slate-100/50">
                            <div className="flex items-center gap-1.5">
                                <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center">
                                    <ImageIcon className="h-3 w-3 text-slate-400" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                    {format(new Date(item.createdAt), "MMM d, yy")}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                                <span className="text-[9px] font-black text-slate-400">ORDER</span>
                                <span className="text-xs font-black text-primary">{item.sortOrder}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
