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
import { FormInputField } from "@corpora/ui";
import { PackOption, PackType, DiscountType } from "./mock-data";
import { useRouter } from "next/navigation";

interface PackOptionFormProps {
  initialData?: PackOption;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

type FormSnapshot = {
  name: string;
  productId: string;
  packType: PackType;
  baseQuantity: number;
  requiredImages: number;
  price: number;
  extraPricePerUnit: number;
  discount: number;
  discountType: DiscountType;
  isActive: boolean;
};

export function PackOptionForm({ initialData, onSubmit, isLoading }: PackOptionFormProps) {
  const router = useRouter();
  
  const { control, handleSubmit } = useForm<FormSnapshot>({
    defaultValues: {
      name: initialData?.name || "",
      productId: initialData?.productId || "",
      packType: initialData?.packType || "POLAROID",
      baseQuantity: initialData?.baseQuantity || 1,
      requiredImages: initialData?.requiredImages || 1,
      price: initialData?.price || 0,
      extraPricePerUnit: initialData?.extraPricePerUnit || 0,
      discount: initialData?.discount || 0,
      discountType: initialData?.discountType || "PERCENTAGE",
      isActive: initialData?.isActive ?? true,
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormInputField
                control={control}
                name="name"
                label="Option Name"
                placeholder="e.g. Premium Polaroid Pack"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInputField
                    control={control}
                    name="productId"
                    label="Product ID"
                    placeholder="PRD-001"
                  />

                  <div className="space-y-2">
                    <Label>Pack Type</Label>
                    <Controller
                        name="packType"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="w-full h-12 rounded-xl">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="POLAROID">Polaroid</SelectItem>
                                    <SelectItem value="STRIP">Photo Strip</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                  </div>
              </div>
            </CardContent>
          </Card>

          {/* Quantity Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Quantity Configuration</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInputField
                control={control}
                name="baseQuantity"
                label="Base Quantity"
                type="number"
                placeholder="10"
              />
              <FormInputField
                control={control}
                name="requiredImages"
                label="Required Images"
                type="number"
                placeholder="10"
              />
            </CardContent>
          </Card>

          {/* Pricing */}
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
                    placeholder="499"
                  />
                  <FormInputField
                    control={control}
                    name="extraPricePerUnit"
                    label="Extra Price Per Unit (₹)"
                    type="number"
                    placeholder="40"
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
            {isLoading ? "Saving..." : initialData ? "Update Option" : "Create Option"}
          </Button>
          <Button type="button" variant="outline" className="w-full h-12 rounded-full" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
