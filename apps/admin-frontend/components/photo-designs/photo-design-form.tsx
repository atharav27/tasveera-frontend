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
import { PhotoDesign } from "./mock-data";
import { useRouter } from "next/navigation";

interface PhotoDesignFormProps {
  initialData?: PhotoDesign;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

type FormSnapshot = {
  title: string;
  slug: string;
  requiredImages: number;
  allowExtraImages: boolean;
  allowDesignerChoice: boolean;
  description: string;
  isActive: boolean;
};

export function PhotoDesignForm({ initialData, onSubmit, isLoading }: PhotoDesignFormProps) {
  const router = useRouter();
  
  const { control, handleSubmit, setValue, watch } = useForm<FormSnapshot>({
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      requiredImages: initialData?.requiredImages || 1,
      allowExtraImages: initialData?.allowExtraImages || false,
      allowDesignerChoice: initialData?.allowDesignerChoice || false,
      description: initialData?.description || "",
      isActive: initialData?.isActive ?? true,
    }
  });

  const titleValue = watch("title");

  React.useEffect(() => {
    if (titleValue && !initialData) {
      const slug = titleValue.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
      setValue("slug", slug);
    }
  }, [titleValue, setValue, initialData]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Design Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormInputField
                control={control}
                name="title"
                label="Layout Title"
                placeholder="e.g. Modern Mosaic"
              />
              
              <FormInputField
                control={control}
                name="slug"
                label="Slug"
                placeholder="modern-mosaic"
              />

              <FormInputField
                control={control}
                name="requiredImages"
                label="Required Images Count"
                type="number"
                placeholder="1"
              />
              
              <FormTextareaField
                control={control}
                name="description"
                label="Description"
                placeholder="Describe this layout style..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuration Flags</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-2 p-4 rounded-xl border bg-muted/20">
                <Controller
                  name="allowExtraImages"
                  control={control}
                  render={({ field }) => (
                    <Checkbox 
                      id="allowExtraImages" 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                    />
                  )}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="allowExtraImages" className="text-sm font-bold">Allow Extra Images</Label>
                  <p className="text-xs text-muted-foreground">User can upload more than required</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 p-4 rounded-xl border bg-muted/20">
                <Controller
                  name="allowDesignerChoice"
                  control={control}
                  render={({ field }) => (
                    <Checkbox 
                      id="allowDesignerChoice" 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                    />
                  )}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="allowDesignerChoice" className="text-sm font-bold">Designer Choice</Label>
                  <p className="text-xs text-muted-foreground">Option for designer to arrange images</p>
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
