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
import { Coupon, CouponType } from "./mock-data";
import { useRouter } from "next/navigation";

interface CouponFormProps {
  initialData?: Coupon;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

type FormSnapshot = {
  code: string;
  type: CouponType;
  value: number;
  minOrderAmount: number;
  usageLimit: number | null;
  expiresAt: string;
  isActive: boolean;
};

export function CouponForm({ initialData, onSubmit, isLoading }: CouponFormProps) {
  const router = useRouter();
  
  const { control, handleSubmit, setValue, watch } = useForm<FormSnapshot>({
    defaultValues: {
      code: initialData?.code || "",
      type: initialData?.type || "PERCENTAGE",
      value: initialData?.value || 0,
      minOrderAmount: initialData?.minOrderAmount || 0,
      usageLimit: initialData?.usageLimit || null,
      expiresAt: initialData?.expiresAt ? new Date(initialData.expiresAt).toISOString().split('T')[0] : "",
      isActive: initialData?.isActive ?? true,
    }
  });

  const selectedType = watch("type");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-[1.5rem] border-slate-200/60 shadow-sm overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Discount Definition</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-700 ml-1">Coupon Code</Label>
                    <Controller
                        name="code"
                        control={control}
                        render={({ field }) => (
                            <div className="relative">
                                <input
                                    {...field}
                                    placeholder="SUMMER2024"
                                    className="w-full h-12 rounded-xl bg-slate-50/50 border border-slate-200 shadow-none px-4 uppercase font-bold text-base focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                />
                            </div>
                        )}
                    />
                    <p className="text-[10px] text-muted-foreground ml-1">Codes are auto-normalized to uppercase.</p>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-700 ml-1">Discount Type</Label>
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={(val) => {
                                field.onChange(val);
                                if (val === 'FREE_SHIPPING') setValue('value', 0);
                            }} defaultValue={field.value}>
                                <SelectTrigger className="w-full h-12 rounded-xl bg-slate-50/50 border-slate-200 shadow-none px-4 hover:bg-white transition-colors">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-200 shadow-lg">
                                    <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                                    <SelectItem value="FIXED">Fixed Amount (₹)</SelectItem>
                                    <SelectItem value="FREE_SHIPPING">Free Shipping</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInputField
                    control={control}
                    name="value"
                    label="Discount Value"
                    type="number"
                    placeholder="20"
                    disabled={selectedType === 'FREE_SHIPPING'}
                    className="h-12 rounded-xl bg-slate-50/50 border-slate-200 shadow-none focus:bg-white transition-colors"
                  />
                  <FormInputField
                    control={control}
                    name="minOrderAmount"
                    label="Minimum Order Amount (₹)"
                    type="number"
                    placeholder="500"
                    className="h-12 rounded-xl bg-slate-50/50 border-slate-200 shadow-none focus:bg-white transition-colors"
                  />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.5rem] border-slate-200/60 shadow-sm overflow-hidden">
            <CardContent className="p-8 space-y-6">
                <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Usage Limits & Expiry</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInputField
                        control={control}
                        name="usageLimit"
                        label="Total Usage Limit"
                        type="number"
                        placeholder="Unlimited if empty"
                        className="h-12 rounded-xl bg-slate-50/50 border-slate-200 shadow-none focus:bg-white transition-colors"
                    />

                    <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-700 ml-1">Expiry Date</Label>
                        <Controller
                            name="expiresAt"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type="date"
                                    className="w-full h-12 rounded-xl bg-slate-50/50 border border-slate-200 shadow-none px-4 focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium"
                                />
                            )}
                        />
                    </div>
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
                  <Label htmlFor="isActive" className="text-sm font-semibold text-slate-900 cursor-pointer">Active</Label>
                  <p className="text-xs text-muted-foreground font-medium">Coupon can be used at checkout</p>
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

              {initialData && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center">
                    <p className="text-xs text-muted-foreground font-medium mb-1">Total Usage</p>
                    <p className="text-xl font-bold text-slate-900">{initialData.usageCount} Orders</p>
                  </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full h-12 rounded-full font-semibold shadow-sm" disabled={isLoading}>
                {isLoading ? "Saving..." : initialData ? "Save Changes" : "Create Coupon"}
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
