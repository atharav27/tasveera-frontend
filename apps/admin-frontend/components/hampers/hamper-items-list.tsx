"use client";

import * as React from "react";
import { 
  Sortable, 
  SortableContent, 
  SortableItem, 
  SortableItemHandle,
  Button,
  ActionsDropdown,
  type ActionItem,
} from "@corpora/ui";
import { HamperItem } from "./mock-data";
import { GripVertical, Layers, Trash2, Pencil } from "lucide-react";

interface HamperItemsListProps {
  items: HamperItem[];
  onReorder: (orderedIds: string[]) => void;
  onEdit: (item: HamperItem) => void;
  onDelete: (id: string) => void;
  isReordering?: boolean;
}

export function HamperItemsList({ 
  items, 
  onReorder, 
  onEdit, 
  onDelete,
  isReordering 
}: HamperItemsListProps) {
  const [localItems, setLocalItems] = React.useState<HamperItem[]>(items);

  React.useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const handleReorder = (newItems: HamperItem[]) => {
    setLocalItems(newItems);
  };

  const handleSaveOrder = () => {
    onReorder(localItems.map(i => i.id));
  };

  const getItemBadgeColor = (type: string) => {
    switch (type) {
        case 'FRAME': return 'bg-blue-100 text-blue-700';
        case 'POLAROID':
        case 'STRIP': return 'bg-purple-100 text-purple-700';
        case 'SIMPLE_PRODUCT': return 'bg-orange-100 text-orange-700';
        default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-muted-foreground italic">
            Composition sequence in the UI. Total {items.length} slots.
        </p>
        <Button 
            disabled={isReordering || JSON.stringify(items.map(i => i.id)) === JSON.stringify(localItems.map(i => i.id))}
            onClick={handleSaveOrder}
            variant="outline"
            size="sm"
            className="rounded-full h-8"
        >
            {isReordering ? "Saving..." : "Save Sorting Order"}
        </Button>
      </div>

      <div className="rounded-xl border bg-card/50">
        <Sortable value={localItems} onValueChange={handleReorder} getItemValue={(item) => item.id}>
          <SortableContent className="divide-y divide-border">
            {localItems.map((item) => (
              <SortableItem key={item.id} value={item.id} className="flex items-center gap-4 p-4 bg-card hover:bg-slate-50/50 transition-colors">
                <SortableItemHandle className="p-1 -ml-1 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing">
                  <GripVertical className="h-4 w-4" />
                </SortableItemHandle>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
                    <Layers className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900">{item.label}</span>
                        <span className={`text-[10px] uppercase font-black px-1.5 py-0.5 rounded-sm ${getItemBadgeColor(item.itemType)}`}>
                            {item.itemType}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                        <span className="truncate max-w-[200px]">{item.displayName}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                        <span>Qty: {item.quantity}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex justify-end pr-2">
                        <ActionsDropdown 
                            items={[
                                { label: "Edit Slot", icon: "pencil", onClick: () => onEdit(item) },
                                { label: "Remove Slot", icon: "trash2", variant: "destructive", onClick: () => onDelete(item.id) },
                            ]}
                        />
                    </div>
                </div>
              </SortableItem>
            ))}
          </SortableContent>
        </Sortable>

        {items.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                <Layers className="h-10 w-10 mb-2 opacity-20" />
                <p>No items added to this hamper composition yet.</p>
            </div>
        )}
      </div>
    </div>
  );
}
