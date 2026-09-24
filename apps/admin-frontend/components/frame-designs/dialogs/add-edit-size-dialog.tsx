"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { DialogWrapper, Label, Checkbox, Button } from "@corpora/ui";
import { FormInputField, FormSelectField } from "@corpora/ui";
import { FrameDesignSize } from "../mock-data";

interface AddEditSizeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  size?: FrameDesignSize;
  onSave: (data: any) => Promise<void>;
}

type SizeFormValues = {
  label: string;
  width: number;
  height: number;
  price: number;
  discount: number;
  discountType: "FIXED" | "PERCENTAGE";
  stock: number;
  isAvailable: boolean;
};

export function AddEditSizeDialog({ open, onOpenChange, size, onSave }: AddEditSizeDialogProps) {
  const isEditing = !!size;
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, reset, watch, setValue } = useForm<SizeFormValues>({
    defaultValues: {
      label: "",
      width: 0,
      height: 0,
      price: 0,
      discount: 0,
      discountType: "FIXED",
      stock: 0,
      isAvailable: true,
    }
  });

  useEffect(() => {
    if (open) {
      if (size) {
        reset({
          label: size.label,
          width: size.width,
          height: size.height,
          price: size.price,
          discount: size.discount,
          discountType: size.discountType,
          stock: size.stock,
          isAvailable: size.isAvailable,
        });
      } else {
        reset({
          label: "",
          width: 0,
          height: 0,
          price: 0,
          discount: 0,
          discountType: "FIXED",
          stock: 0,
          isAvailable: true,
        });
      }
    }
  }, [open, size, reset]);

  const width = watch("width");
  const height = watch("height");
  const labelValue = watch("label");

  const onFormSubmit = async (data: SizeFormValues) => {
    setIsLoading(true);
    try {
      let finalData = { ...data };
      if (!finalData.label && finalData.width && finalData.height) {
        finalData.label = `${finalData.width}x${finalData.height}`;
      }
      await onSave(finalData);
      onOpenChange(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogWrapper
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? "Edit Size" : "Add Size"}
      description={isEditing ? "Update details for this size variation." : "Add a new size variation for this design."}
      content={
        <form id="add-edit-size-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInputField
              control={control}
              name="width"
              label="Width (inches)"
              type="number"
            />
            <FormInputField
              control={control}
              name="height"
              label="Height (inches)"
              type="number"
            />
          </div>

          <FormInputField
            control={control}
            name="label"
            label="Size Label"
            placeholder="e.g. 12x18 (autofilled if empty)"
          />

          <FormInputField
            control={control}
            name="price"
            label="Base Price"
            type="number"
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInputField
              control={control}
              name="discount"
              label="Discount"
              type="number"
            />
            <FormSelectField
              control={control}
              name="discountType"
              label="Discount Type"
              options={[
                { value: "FIXED", label: "Flat Fixed (₹)" },
                { value: "PERCENTAGE", label: "Percentage (%)" }
              ]}
            />
          </div>

          <FormInputField
            control={control}
            name="stock"
            label="Initial Stock"
            type="number"
            disabled={isEditing}
          />
          {isEditing && <p className="text-xs text-muted-foreground -mt-3">Use the Update Stock action in the table to modify inventory.</p>}

          <div className="flex items-center space-x-2 pt-2">
            <Controller
              name="isAvailable"
              control={control}
              render={({ field }) => (
                <Checkbox 
                  id="isAvailable" 
                  checked={field.value} 
                  onCheckedChange={field.onChange} 
                />
              )}
            />
            <Label htmlFor="isAvailable" className="cursor-pointer">Currently Available</Label>
          </div>
        </form>
      }
      footer={
        <div className="pt-4 flex justify-end gap-2 w-full">
          <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" form="add-edit-size-form" className="flex-1" disabled={isLoading}>{isLoading ? "Saving..." : "Save Size"}</Button>
        </div>
      }
    />
  );
}

