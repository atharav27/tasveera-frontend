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
} from "@corpora/ui";
import { FormInputField, FormTextareaField } from "@corpora/ui";
import { FrameDesign } from "./mock-data";
import { useRouter } from "next/navigation";

interface FrameDesignFormProps {
  initialData?: FrameDesign;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

type FormSnapshot = {
  productId: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
};

export function FrameDesignForm({ initialData, onSubmit, isLoading }: FrameDesignFormProps) {
  const router = useRouter();
  
  const { control, handleSubmit, setValue, watch } = useForm<FormSnapshot>({
    defaultValues: {
      productId: initialData?.productId || "",
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      isActive: initialData?.isActive ?? true,
    }
  });

  const nameValue = watch("name");

  React.useEffect(() => {
    if (nameValue) {
      const slug = nameValue.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
      setValue("slug", slug);
    }
  }, [nameValue, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Design Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormInputField
                control={control}
                name="productId"
                label="Parent Product ID"
                placeholder="e.g. PRD-001"
              />
              <p className="text-xs text-muted-foreground -mt-2">The product this design belongs to.</p>
              
              <FormInputField
                control={control}
                name="name"
                label="Design Name"
                placeholder="e.g. Classic Walnut"
              />
              
              <FormInputField
                control={control}
                name="slug"
                label="Design Slug"
                placeholder="classic-walnut"
              />
              
              <FormTextareaField
                control={control}
                name="description"
                label="Description"
                placeholder="Describe your design finish or material..."
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
            {isLoading ? "Saving..." : initialData ? "Update Design" : "Create Design"}
          </Button>
          <Button type="button" variant="outline" className="w-full h-12 rounded-full" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}

