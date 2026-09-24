"use client";

import * as React from "react";
import Image from "next/image";
import { 
  Sortable, 
  SortableContent, 
  SortableItem, 
  SortableItemHandle,
  Button,
} from "@corpora/ui";
import { MediaItem } from "./mock-data";
import { GripVertical, Save } from "lucide-react";

interface MediaReorderProps {
  items: MediaItem[];
  onSave: (orderedIds: string[]) => void;
  isLoading?: boolean;
}

export function MediaReorder({ items, onSave, isLoading }: MediaReorderProps) {
  const [orderedItems, setOrderedItems] = React.useState<MediaItem[]>(items);

  React.useEffect(() => {
    setOrderedItems(items);
  }, [items]);

  const handleReorder = (newItems: MediaItem[]) => {
    setOrderedItems(newItems);
  };

  const handleSave = () => {
    onSave(orderedItems.map(item => item.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-4 bg-primary/5 p-4 rounded-3xl border border-primary/10">
        <div className="space-y-0.5">
            <h4 className="text-sm font-black text-primary uppercase tracking-tighter">Sequence Editor</h4>
            <p className="text-xs text-muted-foreground font-medium">Dragging items across parent groups is not allowed. Stay within context.</p>
        </div>
        <Button 
            onClick={handleSave} 
            disabled={isLoading || items.length < 2} 
            className="rounded-full px-6 gap-2 h-11"
        >
          <Save className="h-4 w-4" /> Commit Sequence
        </Button>
      </div>

      <Sortable 
        value={orderedItems} 
        onValueChange={handleReorder} 
        getItemValue={(item) => item.id}
      >
        <SortableContent className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {orderedItems.map((item) => (
            <SortableItem key={item.id} value={item.id} className="relative aspect-square group bg-card rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-all">
                <Image 
                    src={item.url} 
                    alt="" 
                    fill 
                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                
                {/* Overlay with Index and Handle */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <SortableItemHandle className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white cursor-grab active:cursor-grabbing hover:bg-white/40">
                        <GripVertical className="h-5 w-5" />
                    </SortableItemHandle>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full">
                        Pos: {orderedItems.indexOf(item) + 1}
                    </span>
                </div>
                
                {/* Floating Sort Badge */}
                <div className="absolute top-2 left-2 h-6 w-6 rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center shadow-lg border border-white/20">
                    {orderedItems.indexOf(item) + 1}
                </div>
            </SortableItem>
          ))}
        </SortableContent>
      </Sortable>

      {items.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed rounded-3xl text-muted-foreground italic">
              No media items available for the selected group.
          </div>
      )}
    </div>
  );
}
