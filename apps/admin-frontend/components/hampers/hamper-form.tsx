"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { 
  Button, 
  Checkbox,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@corpora/ui";
import { FormInputField, FormTextareaField } from "@corpora/ui";
import { Hamper, DiscountType } from "./mock-data";
import { useRouter } from "next/navigation";

interface HamperFormProps {
  initialData?: Hamper;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

type FormSnapshot = {
  name: string;
  productId: string;
  description: string;
  price: number;
  discount: number;
  discountType: DiscountType;
  isActive: boolean;
};

export function HamperForm({ initialData, onSubmit, isLoading }: HamperFormProps) {
  const router = useRouter();
  
  const { control, handleSubmit } = useForm<FormSnapshot>({
    defaultValues: {
      name: initialData?.name || "",
      productId: initialData?.productId || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      discount: initialData?.discount || 0,
      discountType: initialData?.discountType || "PERCENTAGE",
      isActive: initialData?.isActive ?? true,
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hamper Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormInputField
                control={control}
                name="name"
                label="Hamper Name"
                placeholder="e.g. Wedding Gift Set"
              />
              
              <FormInputField
                control={control}
                name="productId"
                label="Parent Product ID"
                placeholder="PRD-101"
              />

              <FormTextareaField
                control={control}
                name="description"
                label="Description"
                placeholder="Briefly describe what's inside..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & Discounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInputField
                    control={control}
                    name="price"
                    label="Base Price (₹)"
                    type="number"
                    placeholder="2499"
                  />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInputField
                    control={control}
                    name="discount"
                    label="Discount Value"
                    type="number"
                    placeholder="10"
                  />
                  <div className="space-y-2">
                    <Label>Discount Type</Label>
                    <Controller
                        name="discountType"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="w-full h-12 rounded-xl">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                                    <SelectItem value="FIXED">Fixed Amount (₹)</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                  </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl border bg-muted/30">
                <div className="space-y-0.5">
                  <Label htmlFor="isActive" className="text-sm font-semibold cursor-pointer">Active State</Label>
                  <p className="text-xs text-muted-foreground">Visible to customers</p>
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
            </CardContent>
          </Card>

          <Button type="submit" className="w-full h-12 rounded-full text-base font-semibold" disabled={isLoading}>
            {isLoading ? "Saving..." : initialData ? "Update Hamper" : "Create Hamper"}
          </Button>
          <Button type="button" variant="outline" className="w-full h-12 rounded-full" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
