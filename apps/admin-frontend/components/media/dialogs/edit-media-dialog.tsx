"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@corpora/ui";
import { FormInputField } from "@corpora/ui";
import { MediaItem } from "../mock-data";

interface EditMediaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: MediaItem;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function EditMediaDialog({
  open,
  onOpenChange,
  item,
  onSubmit,
  isLoading,
}: EditMediaDialogProps) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      altText: "",
      sortOrder: 0,
    },
  });

  React.useEffect(() => {
    if (item) {
      reset({
        altText: item.altText,
        sortOrder: item.sortOrder,
      });
    }
  }, [item, reset, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Media Metadata</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <FormInputField
            control={control}
            name="altText"
            label="Alt Text"
            placeholder="e.g. Handmade wooden frame detail"
          />
          
          <FormInputField
            control={control}
            name="sortOrder"
            label="Sort Order"
            type="number"
            placeholder="0"
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Update Metadata"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
