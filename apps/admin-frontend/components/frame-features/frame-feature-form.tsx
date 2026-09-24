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
import { FrameFeature } from "./mock-data";
import { useRouter } from "next/navigation";

interface FrameFeatureFormProps {
  initialData?: FrameFeature;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

type FormValues = {
  name: string;
  slug: string;
  description: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
};

export function FrameFeatureForm({ initialData, onSubmit, isLoading }: FrameFeatureFormProps) {
  const router = useRouter();
  
  const { control, handleSubmit, setValue, watch, reset } = useForm<FormValues>({
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      icon: initialData?.icon || "",
      sortOrder: initialData?.sortOrder || 0,
      isActive: initialData?.isActive ?? true,
    }
  });

  const nameValue = watch("name");

  React.useEffect(() => {
    if (nameValue && !initialData) {
      const slug = nameValue.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
      setValue("slug", slug);
    }
  }, [nameValue, setValue, initialData]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormInputField
                control={control}
                name="name"
                label="Feature Name"
                placeholder="e.g. Anti-Reflective Coating"
              />
              
              <FormInputField
                control={control}
                name="slug"
                label="Slug"
                placeholder="anti-reflective-coating"
              />
              
              <FormTextareaField
                control={control}
                name="description"
                label="Description"
                placeholder="Explain the benefits of this feature..."
              />

              <div className="grid grid-cols-2 gap-4">
                <FormInputField
                    control={control}
                    name="icon"
                    label="Icon Reference"
                    placeholder="e.g. glass, shield"
                />
                <FormInputField
                    control={control}
                    name="sortOrder"
                    label="Sort Order"
                    type="number"
                />
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
                  <p className="text-xs text-muted-foreground">Visible on listings</p>
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
            {isLoading ? "Saving..." : initialData ? "Update Feature" : "Create Feature"}
          </Button>
          <Button type="button" variant="outline" className="w-full h-12 rounded-full" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
