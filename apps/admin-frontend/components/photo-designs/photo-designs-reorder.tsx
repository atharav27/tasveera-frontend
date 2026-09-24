"use client";

import * as React from "react";
import { 
  Sortable, 
  SortableContent, 
  SortableItem, 
  SortableItemHandle,
  Button,
} from "@corpora/ui";
import { PhotoDesign } from "./mock-data";
import { GripVertical, Save, Layout } from "lucide-react";

interface PhotoDesignsReorderProps {
  items: PhotoDesign[];
  onSave: (orderedIds: string[]) => void;
  isLoading?: boolean;
}

export function PhotoDesignsReorder({ items, onSave, isLoading }: PhotoDesignsReorderProps) {
  const [orderedItems, setOrderedItems] = React.useState<PhotoDesign[]>(items);

  React.useEffect(() => {
    setOrderedItems(items);
  }, [items]);

  const handleReorder = (newItems: PhotoDesign[]) => {
    setOrderedItems(newItems);
  };

  const handleSave = () => {
    onSave(orderedItems.map(item => item.id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-muted-foreground">Drag to rearrange the display order for the gallery.</p>
        <Button 
            onClick={handleSave} 
            disabled={isLoading} 
            size="sm" 
            className="gap-2 rounded-full px-4"
        >
          <Save className="h-4 w-4" /> Save Order
        </Button>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <Sortable 
            value={orderedItems} 
            onValueChange={handleReorder} 
            getItemValue={(item) => item.id}
        >
          <SortableContent className="divide-y">
            {orderedItems.map((item) => (
              <SortableItem key={item.id} value={item.id} className="flex items-center gap-4 p-4 bg-card hover:bg-slate-50/50 transition-colors">
                <SortableItemHandle className="p-2 -ml-2 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing">
                  <GripVertical className="h-4 w-4" />
                </SortableItemHandle>
                
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Layout className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{item.title}</p>
                  <p className="text-xs text-slate-400 truncate">{item.slug}</p>
                </div>

                <div className="flex items-center gap-2 px-4 border-l border-slate-100">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Sort</span>
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-black text-slate-600">
                        {item.sortOrder}
                    </span>
                </div>
              </SortableItem>
            ))}
          </SortableContent>
        </Sortable>
      </div>
    </div>
  );
}
