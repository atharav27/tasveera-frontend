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
  Checkbox,
} from "@corpora/ui";
import { FormInputField } from "@corpora/ui";
import { Tag } from "../mock-data";

interface AddEditTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag?: Tag;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function AddEditTagDialog({
  open,
  onOpenChange,
  tag,
  onSubmit,
  isLoading,
}: AddEditTagDialogProps) {
  const { control, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      isActive: true,
    },
  });

  React.useEffect(() => {
    if (tag) {
      reset({
        name: tag.name,
        slug: tag.slug,
        isActive: tag.isActive,
      });
    } else {
      reset({
        name: "",
        slug: "",
        isActive: true,
      });
    }
  }, [tag, reset, open]);

  const nameValue = watch("name");

  React.useEffect(() => {
    if (nameValue && !tag) {
      const slug = nameValue.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
      setValue("slug", slug);
    }
  }, [nameValue, setValue, tag]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{tag ? "Edit Tag" : "Create New Tag"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <FormInputField
            control={control}
            name="name"
            label="Tag Name"
            placeholder="e.g. Handmade"
          />
          
          <FormInputField
            control={control}
            name="slug"
            label="Slug"
            placeholder="handmade"
          />

          <div className="flex items-center justify-between p-3 rounded-xl border bg-muted/30">
            <div className="space-y-0.5">
                <Label htmlFor="isActive" className="text-sm font-semibold cursor-pointer">Active Status</Label>
                <p className="text-[10px] text-muted-foreground">Is this tag visible to customers?</p>
            </div>
            <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                <Checkbox 
                    id="isActive" 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                />
                )}
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
              {isLoading ? "Saving..." : tag ? "Update Tag" : "Create Tag"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
