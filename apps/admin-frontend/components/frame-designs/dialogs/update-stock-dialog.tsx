"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DialogWrapper, Button, Tabs, TabsList, TabsTrigger } from "@corpora/ui";
import { FormInputField } from "@corpora/ui";
import { FrameDesignSize } from "../mock-data";

interface UpdateStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  size?: FrameDesignSize;
  onSave: (sizeId: string, newStock: number) => Promise<void>;
}

type StockFormValues = {
  delta: string;
  exact: string;
};

export function UpdateStockDialog({ open, onOpenChange, size, onSave }: UpdateStockDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"delta" | "exact">("delta");
  
  const { control, handleSubmit, reset, watch } = useForm<StockFormValues>({
    defaultValues: {
      delta: "0",
      exact: "0"
    }
  });

  const deltaVal = watch("delta");
  const exactVal = watch("exact");

  useEffect(() => {
    if (open && size) {
      setMode("delta");
      reset({
        delta: "",
        exact: size.stock.toString()
      });
    }
  }, [open, size, reset]);

  if (!size) return null;

  const currentStock = size.stock;
  
  // Calculate preview
  let newStockPreview = currentStock;
  const dVal = parseInt(deltaVal) || 0;
  const eVal = parseInt(exactVal) || 0;

  if (mode === "delta") {
    newStockPreview = currentStock + dVal;
  } else {
    newStockPreview = eVal;
  }

  const isValid = newStockPreview >= 0;

  const onFormSubmit = async () => {
    if (!isValid) return;

    setIsLoading(true);
    try {
      await onSave(size.id, newStockPreview);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogWrapper
      open={open}
      onOpenChange={onOpenChange}
      title="Update Inventory Stock"
      description={`Manage stock for size ${size.label}.`}
      content={
        <form id="update-stock-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 pt-4">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border">
              <div>
                  <p className="text-sm text-muted-foreground font-medium">Current Stock</p>
                  <div className="flex items-end gap-2 mt-1">
                      <span className="text-3xl font-bold">{currentStock}</span>
                      <span className="text-sm mb-1">units</span>
                  </div>
              </div>
              <div className="text-right">
                  <p className="text-sm text-muted-foreground font-medium mb-1">Status</p>
                  {currentStock === 0 ? (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">Out of Stock</span>
                  ) : currentStock <= 5 ? (
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">Low Stock</span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">In Stock</span>
                  )}
              </div>
          </div>

          <Tabs value={mode} onValueChange={(v) => setMode(v as "delta" | "exact")}>
              <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="delta">Add / Subtract</TabsTrigger>
                  <TabsTrigger value="exact">Set Exact Value</TabsTrigger>
              </TabsList>
          </Tabs>

          {mode === "delta" ? (
              <FormInputField
                  control={control}
                  name="delta"
                  label="Adjustment (+ or -)"
                  placeholder="e.g. 10 or -5"
                  type="text" 
              />
          ) : (
              <FormInputField
                  control={control}
                  name="exact"
                  label="New Exact Stock Level"
                  type="number"
              />
          )}

          <div className={`p-4 rounded-xl border ${isValid ? 'bg-primary/5 border-primary/20' : 'bg-red-50 border-red-200'}`}>
              <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold">New Stock Preview:</span>
                  <span className={`text-xl font-bold ${isValid ? 'text-primary' : 'text-red-600'}`}>{newStockPreview}</span>
              </div>
              {!isValid && (
                  <p className="text-red-600 text-xs mt-2">Error: Stock cannot be negative.</p>
              )}
          </div>
        </form>
      }
      footer={
        <div className="pt-2 flex justify-end gap-2 w-full">
          <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" form="update-stock-form" className="flex-1" disabled={isLoading || !isValid}>{isLoading ? "Saving..." : "Confirm Update"}</Button>
        </div>
      }
    />
  );
}

