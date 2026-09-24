"use client";

import * as React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Label,
  Checkbox,
} from "@corpora/ui";
import { MOCK_FRAME_SIZES, SupportedSize } from "../mock-data";

interface AddSizeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingSizeIds: string[];
  onAdd: (sizeIds: string[]) => void;
}

export function AddSizeDialog({
  open,
  onOpenChange,
  existingSizeIds,
  onAdd,
}: AddSizeDialogProps) {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const availableSizes = MOCK_FRAME_SIZES.filter(
    (s) => !existingSizeIds.includes(s.id)
  );

  const toggleSize = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleApply = async () => {
    setIsLoading(true);
    await onAdd(selectedIds);
    setIsLoading(false);
    setSelectedIds([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Link Supported Frame Sizes</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <p className="text-sm text-muted-foreground">Select one or more frame sizes that are compatible with this photo layout.</p>
          
          <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2">
            {availableSizes.map((size) => (
              <div 
                key={size.id} 
                className="flex items-center space-x-3 p-3 rounded-xl border hover:bg-slate-50 cursor-pointer"
                onClick={() => toggleSize(size.id)}
              >
                <Checkbox 
                    id={size.id} 
                    checked={selectedIds.includes(size.id)}
                    onCheckedChange={() => toggleSize(size.id)}
                />
                <div className="flex-1">
                  <Label htmlFor={size.id} className="font-bold cursor-pointer">{size.label}</Label>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase">{size.frameDesignName}</p>
                </div>
                <div className="text-right text-xs font-mono text-slate-400">
                  {size.width}x{size.height}
                </div>
              </div>
            ))}
            {availableSizes.length === 0 && (
                <p className="text-center py-8 text-sm text-muted-foreground italic">No more sizes available to link.</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleApply} disabled={isLoading || selectedIds.length === 0}>
              {isLoading ? "Adding..." : `Link ${selectedIds.length} Selected`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
