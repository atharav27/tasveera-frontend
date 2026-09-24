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
import { Category, CategoryType } from "./mock-data";
import { useRouter } from "next/navigation";

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

type FormSnapshot = {
  name: string;
  slug: string;
  type: CategoryType;
  sortOrder: number;
  isActive: boolean;
};

export function CategoryForm({ initialData, onSubmit, isLoading }: CategoryFormProps) {
  const router = useRouter();
  
  const { control, handleSubmit, setValue, watch } = useForm<FormSnapshot>({
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      type: initialData?.type || "PRODUCT",
      sortOrder: initialData?.sortOrder || 1,
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
              <CardTitle>Category Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormInputField
                control={control}
                name="name"
                label="Category Name"
                placeholder="e.g. Wedding Collection"
              />
              
              <FormInputField
                control={control}
                name="slug"
                label="Slug"
                placeholder="wedding-collection"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label>Category Type</Label>
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="w-full h-12 rounded-xl">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PRODUCT">Product Group</SelectItem>
                                    <SelectItem value="OCCASION">Occasion / Event</SelectItem>
                                    <SelectItem value="COLLECTION">Thematic Collection</SelectItem>
                                    <SelectItem value="PROMOTION">Promotional Campaign</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                  </div>
                  
                  <FormInputField
                    control={control}
                    name="sortOrder"
                    label="Sort Order"
                    type="number"
                    placeholder="1"
                  />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visibility Strategy</CardTitle>
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
            {isLoading ? "Saving..." : initialData ? "Update Category" : "Create Category"}
          </Button>
          <Button type="button" variant="outline" className="w-full h-12 rounded-full" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
