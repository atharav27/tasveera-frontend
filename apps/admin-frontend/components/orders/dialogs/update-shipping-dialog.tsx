"use client";

import {
  DialogWrapper,
  Button,
} from "@corpora/ui";
import { FormInputField } from "@corpora/ui";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

interface UpdateShippingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (shippingData: { courier: string; awbNumber: string }) => void;
  initialData?: { courier?: string; awbNumber?: string };
}

type ShippingFormValues = {
  courier: string;
  awbNumber: string;
};

export function UpdateShippingDialog({
  open,
  onOpenChange,
  onUpdate,
  initialData,
}: UpdateShippingDialogProps) {
  const { control, handleSubmit, reset } = useForm<ShippingFormValues>({
    defaultValues: {
      courier: initialData?.courier || "",
      awbNumber: initialData?.awbNumber || "",
    }
  });

  useEffect(() => {
    if (open) {
      reset({
        courier: initialData?.courier || "",
        awbNumber: initialData?.awbNumber || "",
      });
    }
  }, [open, initialData, reset]);

  return (
    <DialogWrapper
      open={open}
      onOpenChange={onOpenChange}
      title="Update Shipping Info"
      description="Add courier and tracking details. This will transition the order to SHIPPED status."
      maxWidth="md"
      content={
        <form id="update-shipping-form" onSubmit={handleSubmit(onUpdate)} className="space-y-4 py-4">
          <FormInputField
            control={control}
            name="courier"
            label="Courier Name"
            placeholder="e.g. Delhivery, FedEx"
          />
          <FormInputField
            control={control}
            name="awbNumber"
            label="AWB Number"
            placeholder="Enter tracking number"
          />
        </form>
      }
      footer={
        <div className="flex gap-3 w-full pt-4">
          <Button type="button" variant="outline" className="flex-1 rounded-full h-12" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="update-shipping-form" className="flex-1 rounded-full h-12">
            Save Details
          </Button>
        </div>
      }
    />
  );
}


