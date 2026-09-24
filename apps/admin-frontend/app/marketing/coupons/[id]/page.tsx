"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@corpora/ui";
import { CouponForm } from "@/components/coupons/coupon-form";
import { CouponUsageTable } from "@/components/coupons/coupon-usage-table";
import { MOCK_COUPONS, Coupon } from "@/components/coupons/mock-data";

export default function CouponDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    
    const [coupon, setCoupon] = React.useState<Coupon | undefined>(
        MOCK_COUPONS.find(c => c.id === id)
    );
    const [isLoading, setIsLoading] = React.useState(false);

    if (!coupon) {
        return (
            <DashboardLayout title="Not Found">
                <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-lg text-muted-foreground mb-4">Promotional campaign not found.</p>
                    <Button onClick={() => router.push("/marketing/coupons")} className="rounded-full px-8">Return to Console</Button>
                </div>
            </DashboardLayout>
        );
    }

    const handleUpdate = async (data: any) => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setCoupon(prev => prev ? { ...prev, ...data } : prev);
        setIsLoading(false);
    };

    return (
        <DashboardLayout 
            title={coupon.code} 
            subtitle={`Campaign Node: ${coupon.id}`}
            breadcrumbs={[
                { label: "Marketing", href: "/marketing/coupons" },
                { label: "Coupons", href: "/marketing/coupons" },
                { label: coupon.code, active: true }
            ]}
        >
            <div className="mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/marketing/coupons")}
                    className="gap-2 font-bold px-0 hover:bg-transparent"
                >
                    <ChevronLeft className="h-4 w-4" /> Back to List
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-16 max-w-5xl mx-auto">
                
                {/* SECTION A: Configuration */}
                <div className="space-y-6">
                    <div className="px-1">
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Configuration</h2>
                    </div>
                    <CouponForm 
                        initialData={coupon} 
                        onSubmit={handleUpdate} 
                        isLoading={isLoading} 
                    />
                </div>
                
                <hr className="border-slate-200" />

                {/* SECTION B: Usage History */}
                <div className="space-y-6 pb-20">
                    <div className="px-1 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Usage History</h2>
                            <p className="text-sm text-muted-foreground font-medium mt-1">Recent storefront applications for this promotional code.</p>
                        </div>
                        <div className="h-9 px-4 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                            <span className="text-xs font-semibold text-slate-600">Total Uses: {coupon.usageCount}</span>
                        </div>
                    </div>
                    
                    {coupon.usageHistory && coupon.usageHistory.length > 0 ? (
                        <div className="px-1">
                            <CouponUsageTable usage={coupon.usageHistory} />
                        </div>
                    ) : (
                        <div className="mx-1 rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 p-12 text-center flex flex-col items-center justify-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                                <Plus className="h-6 w-6" />
                            </div>
                            <div className="space-y-1 text-center">
                                <h3 className="text-sm font-bold text-slate-900">No application history</h3>
                                <p className="text-xs text-slate-500 font-medium">This coupon has not been successfully applied to any orders yet.</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </DashboardLayout>
    );
}
