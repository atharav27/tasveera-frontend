"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { 
  Button, 
  Checkbox,
  Label,
  Card,
  CardContent,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@corpora/ui";
import { FormInputField } from "@corpora/ui";
import { Banner, BannerPosition, BANNER_POSITIONS } from "./mock-data";
import { useRouter } from "next/navigation";

interface BannerFormProps {
  initialData?: Banner;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

type FormSnapshot = {
  title: string;
  subtitle: string;
  link: string;
  position: BannerPosition;
  sortOrder: number;
  isActive: boolean;
};

export function BannerForm({ initialData, onSubmit, isLoading }: BannerFormProps) {
  const router = useRouter();
  
  const { control, handleSubmit } = useForm<FormSnapshot>({
    defaultValues: {
      title: initialData?.title || "",
      subtitle: initialData?.subtitle || "",
      link: initialData?.link || "",
      position: initialData?.position || "HOMEPAGE_HERO",
      sortOrder: initialData?.sortOrder ?? 1,
      isActive: initialData?.isActive ?? true,
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-[1.5rem] border-slate-200/60 shadow-sm overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Banner Identity</h3>
              <FormInputField
                control={control}
                name="title"
                label="Primary Title"
                placeholder="e.g. Mega Summer Sale"
                className="h-12 rounded-xl bg-slate-50/50 border-slate-200 shadow-none focus:bg-white"
              />
              
              <FormInputField
                control={control}
                name="subtitle"
                label="Secondary Subtitle (Optional)"
                placeholder="e.g. Massive discounts on curated frames"
                className="h-12 rounded-xl bg-slate-50/50 border-slate-200 shadow-none focus:bg-white"
              />

              <FormInputField
                control={control}
                name="link"
                label="Destination URL"
                type="url"
                placeholder="https://tasveera.in/collection/sale"
                className="h-12 rounded-xl bg-slate-50/50 border-slate-200 shadow-none focus:bg-white"
              />
            </CardContent>
          </Card>

          <Card className="rounded-[1.5rem] border-slate-200/60 shadow-sm overflow-hidden">
            <CardContent className="p-8 space-y-6">
                <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Placement Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-700 ml-1">Display Position</Label>
                        <Controller
                            name="position"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="w-full h-12 rounded-xl bg-slate-50/50 border-slate-200 shadow-none px-4 hover:bg-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-slate-200 shadow-lg">
                                        {BANNER_POSITIONS.map(p => (
                                            <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <FormInputField
                        control={control}
                        name="sortOrder"
                        label="Priority / Sort Order"
                        type="number"
                        placeholder="1"
                        className="h-12 rounded-xl bg-slate-50/50 border-slate-200 shadow-none focus:bg-white"
                    />
                </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-[1.5rem] border-slate-200/60 shadow-sm">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Status</h3>
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="space-y-0.5">
                  <Label htmlFor="isActive" className="text-sm font-semibold text-slate-900 cursor-pointer">Live on Store</Label>
                  <p className="text-xs text-muted-foreground font-medium">Visible to traffic</p>
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

          <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full h-12 rounded-full font-semibold shadow-sm" disabled={isLoading}>
                {isLoading ? "Saving..." : initialData ? "Save Changes" : "Create Banner"}
              </Button>
              <Button type="button" variant="outline" className="w-full h-12 rounded-full font-medium" onClick={() => router.back()}>
                Cancel
              </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
