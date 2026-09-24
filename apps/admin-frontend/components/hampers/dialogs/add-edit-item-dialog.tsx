"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@corpora/ui";
import { FormInputField } from "@corpora/ui";
import { HamperItem, HamperItemType } from "../mock-data";

interface AddEditItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: HamperItem;
  onSave: (data: any) => void;
}

export function AddEditItemDialog({
  open,
  onOpenChange,
  item,
  onSave,
}: AddEditItemDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      label: item?.label || "",
      itemType: item?.itemType || "FRAME",
      quantity: item?.quantity || 1,
      sortOrder: item?.sortOrder || 1,
      frameDesignId: item?.frameDesignId || "",
      frameSizeId: item?.frameSizeId || "",
      packOptionId: item?.packOptionId || "",
      simpleProductOptionId: item?.simpleProductOptionId || "",
    },
  });

  const selectedType = watch("itemType");

  React.useEffect(() => {
    if (open) {
      reset({
        label: item?.label || "",
        itemType: item?.itemType || "FRAME",
        quantity: item?.quantity || 1,
        sortOrder: item?.sortOrder || 1,
        frameDesignId: item?.frameDesignId || "",
        frameSizeId: item?.frameSizeId || "",
        packOptionId: item?.packOptionId || "",
        simpleProductOptionId: item?.simpleProductOptionId || "",
      });
    }
  }, [open, item, reset]);

  const onFormSubmit = async (data: any) => {
    setIsLoading(true);
    await onSave(data);
    setIsLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Slot" : "Add Content Slot"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInputField
              control={control}
              name="label"
              label="Slot Label"
              placeholder="e.g. Centerpiece"
            />
            <div className="space-y-2">
              <Label>Item Type</Label>
              <Controller
                name="itemType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FRAME">Frame</SelectItem>
                      <SelectItem value="POLAROID">Polaroid</SelectItem>
                      <SelectItem value="STRIP">Photo Strip</SelectItem>
                      <SelectItem value="SIMPLE_PRODUCT">Simple Product</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <hr className="border-border" />

          {selectedType === "FRAME" && (
            <div className="grid grid-cols-2 gap-4">
              <FormInputField
                control={control}
                name="frameDesignId"
                label="Frame Design ID"
                placeholder="fd_001"
              />
              <FormInputField
                control={control}
                name="frameSizeId"
                label="Frame Size ID"
                placeholder="fs_001"
              />
            </div>
          )}

          {(selectedType === "POLAROID" || selectedType === "STRIP") && (
            <FormInputField
              control={control}
              name="packOptionId"
              label="Pack Option ID"
              placeholder="po_001"
            />
          )}

          {selectedType === "SIMPLE_PRODUCT" && (
            <FormInputField
              control={control}
              name="simpleProductOptionId"
              label="Product Option ID"
              placeholder="spo_001"
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <FormInputField
              control={control}
              name="quantity"
              label="Quantity"
              type="number"
            />
            <FormInputField
              control={control}
              name="sortOrder"
              label="Sort Order"
              type="number"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : item ? "Update Slot" : "Add to Hamper"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
