"use client";

import * as React from "react";
import { 
    Sortable, 
    SortableContent, 
    SortableItem, 
    SortableItemHandle,
    Button,
    StatusBadge,
    ActionsDropdown,
    type ActionItem,
} from "@corpora/ui";
import { Banner, BannerPosition, BANNER_POSITIONS } from "./mock-data";
import { GripVertical, Save, Layout, ExternalLink, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface BannersListGroupedProps {
  items: Banner[];
  onSaveOrder: (position: BannerPosition, orderedIds: string[]) => void;
  onToggleActive: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function BannersListGrouped({ 
    items, 
    onSaveOrder, 
    onToggleActive, 
    onDelete, 
    isLoading 
}: BannersListGroupedProps) {
  const router = useRouter();

  // Group items by position
  const grouped = React.useMemo(() => {
    return items.reduce((acc, banner) => {
      if (!acc[banner.position]) acc[banner.position] = [];
      acc[banner.position].push(banner);
      return acc;
    }, {} as Record<BannerPosition, Banner[]>);
  }, [items]);

  // Sort each group by sortOrder
  Object.keys(grouped).forEach(pos => {
      grouped[pos as BannerPosition].sort((a, b) => a.sortOrder - b.sortOrder);
  });

  return (
    <div className="space-y-12">
      {BANNER_POSITIONS.map((pos) => {
          const groupItems = grouped[pos.value] || [];
          return (
              <BannerSection 
                key={pos.value}
                title={pos.label}
                items={groupItems}
                onSaveOrder={(ids) => onSaveOrder(pos.value, ids)}
                onToggleActive={onToggleActive}
                onDelete={onDelete}
                onEdit={(id) => router.push(`/content/banners/${id}`)}
                isLoading={isLoading}
              />
          );
      })}
    </div>
  );
}

interface BannerSectionProps {
    title: string;
    items: Banner[];
    onSaveOrder: (ids: string[]) => void;
    onToggleActive: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
    isLoading?: boolean;
}

function BannerSection({ title, items, onSaveOrder, onToggleActive, onDelete, onEdit, isLoading }: BannerSectionProps) {
    const [localItems, setLocalItems] = React.useState(items);

    React.useEffect(() => {
        setLocalItems(items);
    }, [items]);

    const handleReorder = (newItems: Banner[]) => {
        setLocalItems(newItems);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h2>
                    <span className="h-5 px-2 rounded-md bg-slate-100 text-[10px] font-semibold text-slate-500 border border-slate-200 flex items-center justify-center">
                        {items.length} 
                    </span>
                </div>
                {localItems.length > 1 && (
                    <Button 
                        size="sm" 
                        variant="outline"
                        className="rounded-full gap-2 h-9 border-slate-200 hover:bg-slate-50 shadow-sm"
                        onClick={() => onSaveOrder(localItems.map(i => i.id))}
                        disabled={isLoading}
                    >
                        <Save className="h-3.5 w-3.5" /> Save Order
                    </Button>
                )}
            </div>

            <div className="rounded-2xl border bg-card shadow-sm overflow-hidden border-slate-200">
                <Sortable 
                    value={localItems} 
                    onValueChange={handleReorder} 
                    getItemValue={(item) => item.id}
                >
                    <SortableContent className="divide-y divide-slate-100/50">
                        {localItems.map((item) => (
                            <SortableItem key={item.id} value={item.id} className="group flex items-center gap-4 p-5 hover:bg-slate-50/50 transition-colors">
                                <SortableItemHandle className="p-2 -ml-2 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing transition-colors">
                                    <GripVertical className="h-4.5 w-4.5" />
                                </SortableItemHandle>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-xs font-black text-primary uppercase tracking-widest">{item.id}</p>
                                        <StatusBadge 
                                            status={item.isActive ? "Active" : "Inactive"} 
                                            text={item.isActive ? "Active" : "Inactive"} 
                                            statusToVariant={{ "Active": "green", "Inactive": "red" }}
                                            className="scale-75 origin-left"
                                        />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 truncate tracking-tight">{item.title}</h3>
                                    <p className="text-xs text-muted-foreground truncate font-medium">{item.subtitle || "No subtitle provided"}</p>
                                </div>

                                <div className="hidden lg:flex flex-col items-end gap-1 px-6 border-l border-slate-100">
                                    <div className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline cursor-pointer" onClick={() => window.open(item.link, '_blank')}>
                                        <ExternalLink className="h-3 w-3" /> Link
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-tight">Pos {localItems.indexOf(item) + 1}</p>
                                </div>

                                <div className="shrink-0 ml-4">
                                    <ActionsDropdown items={[
                                        { label: "View Details", icon: "eye", onClick: () => onEdit(item.id) },
                                        { label: item.isActive ? "Disable" : "Activate", icon: item.isActive ? "xcircle" : "circleCheckBig", onClick: () => onToggleActive(item.id) },
                                        { label: "Delete Banner", icon: "trash2", variant: "destructive", onClick: () => onDelete(item.id) }
                                    ]} />
                                </div>
                            </SortableItem>
                        ))}
                    </SortableContent>
                </Sortable>
                {localItems.length === 0 && (
                    <div className="p-12 text-center text-slate-400 italic text-sm font-medium">
                        No banners assigned to this position.
                    </div>
                )}
            </div>
        </div>
    );
}
