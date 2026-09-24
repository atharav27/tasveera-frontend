"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { 
  Button, 
  Label,
  Checkbox,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@corpora/ui";
import { FormInputField, FormTextareaField, FormSelectField } from "@corpora/ui";
import { Product, ProductType } from "./mock-data";
import { useRouter } from "next/navigation";

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

type ProductFormValues = {
  title: string;
  subtitle: string;
  description: string;
  slug: string;
  type: ProductType;
  requiresImage: boolean;
  maxImages: number;
  isFragile: boolean;
  featured: boolean;
  bestseller: boolean;
  isActive: boolean;
  tags: string;
};

export function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
  const router = useRouter();
  
  const { control, handleSubmit, setValue, watch } = useForm<ProductFormValues>({
    defaultValues: {
      title: initialData?.title || "",
      subtitle: initialData?.subtitle || "",
      description: initialData?.description || "",
      slug: initialData?.slug || "",
      type: (initialData?.type || "FRAME") as ProductType,
      requiresImage: initialData?.requiresImage || false,
      maxImages: initialData?.maxImages || 1,
      isFragile: initialData?.isFragile || false,
      featured: initialData?.featured || false,
      bestseller: initialData?.bestseller || false,
      isActive: initialData?.isActive ?? true,
      tags: initialData?.tags.map(t => t.name).join(", ") || "",
    }
  });

  const titleValue = watch("title");
  const requiresImageValue = watch("requiresImage");

  React.useEffect(() => {
    if (titleValue) {
      const slug = titleValue.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
      setValue("slug", slug);
    }
  }, [titleValue, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormInputField
                control={control}
                name="title"
                label="Product Title"
                placeholder="e.g. Classic Wooden Frame"
              />
              <FormInputField
                control={control}
                name="subtitle"
                label="Subtitle"
                placeholder="e.g. Elegant handcrafted wood"
              />
              <FormInputField
                control={control}
                name="slug"
                label="Product Slug"
                placeholder="classic-wooden-frame"
              />
              <FormTextareaField
                control={control}
                name="description"
                label="Description"
                placeholder="Describe your product..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelectField
                  control={control}
                  name="type"
                  label="Product Type"
                  options={[
                    { value: "FRAME", label: "Frame" },
                    { value: "PACK", label: "Pack" },
                    { value: "HAMPER", label: "Hamper" },
                    { value: "SIMPLE", label: "Simple" },
                    { value: "CUSTOM", label: "Custom" },
                  ]}
                />
                {requiresImageValue && (
                  <FormInputField
                    control={control}
                    name="maxImages"
                    label="Max Images"
                    type="number"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <Controller
                    name="requiresImage"
                    control={control}
                    render={({ field }) => (
                      <Checkbox 
                        id="requiresImage" 
                        checked={field.value} 
                        onCheckedChange={field.onChange} 
                      />
                    )}
                  />
                  <Label htmlFor="requiresImage" className="font-normal cursor-pointer select-none">Requires customer images</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Controller
                    name="isFragile"
                    control={control}
                    render={({ field }) => (
                      <Checkbox 
                        id="isFragile" 
                        checked={field.value} 
                        onCheckedChange={field.onChange} 
                      />
                    )}
                  />
                  <Label htmlFor="isFragile" className="font-normal cursor-pointer select-none">Mark as fragile</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Categories</Label>
                <div className="flex flex-wrap gap-2 p-3 border rounded-xl min-h-[50px] bg-muted/20">
                  <span className="text-xs text-muted-foreground italic">Relational mapping will be implemented with live APIs</span>
                </div>
                <p className="text-xs text-muted-foreground">Select categories where this product will appear.</p>
              </div>
              <FormInputField
                control={control}
                name="tags"
                label="Tags"
                placeholder="Add tags (comma separated)"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visibility & Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl border bg-muted/30">
                <div className="space-y-0.5">
                  <Label htmlFor="isActive" className="text-sm font-semibold cursor-pointer">Active State</Label>
                  <p className="text-xs text-muted-foreground">Visible on storefront</p>
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

              <div className="flex items-center justify-between p-3 rounded-xl border">
                <div className="space-y-0.5">
                  <Label htmlFor="featured" className="text-sm font-semibold cursor-pointer">Featured Product</Label>
                  <p className="text-xs text-muted-foreground">Show in featured collections</p>
                </div>
                <Controller
                  name="featured"
                  control={control}
                  render={({ field }) => (
                    <Checkbox 
                      id="featured" 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                    />
                  )}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border">
                <div className="space-y-0.5">
                  <Label htmlFor="bestseller" className="text-sm font-semibold cursor-pointer">Bestseller</Label>
                  <p className="text-xs text-muted-foreground">Apply bestseller badge</p>
                </div>
                <Controller
                  name="bestseller"
                  control={control}
                  render={({ field }) => (
                    <Checkbox 
                      id="bestseller" 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                    />
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full h-12 rounded-full text-base font-semibold" disabled={isLoading}>
            {isLoading ? "Saving..." : initialData ? "Update Product" : "Create Product"}
          </Button>
          <Button type="button" variant="outline" className="w-full h-12 rounded-full" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}

