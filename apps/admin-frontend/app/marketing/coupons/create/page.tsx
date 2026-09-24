"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@corpora/ui";
import { CouponForm } from "@/components/coupons/coupon-form";

export default function CreateCouponPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (data: any) => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Issuing Coupon:", data);
        setIsLoading(false);
        router.push("/marketing/coupons");
    };

    return (
        <DashboardLayout 
            title="Issue Promotion" 
            subtitle="Configure a new promotional discount campaign"
            breadcrumbs={[
                { label: "Marketing", href: "/marketing/coupons" },
                { label: "Coupons", href: "/marketing/coupons" },
                { label: "Create", active: true }
            ]}
        >
            <div className="mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="gap-2 font-bold px-0 hover:bg-transparent"
                >
                    <ChevronLeft className="h-4 w-4" /> Cancel Campaign
                </Button>
            </div>

            <div className="max-w-5xl mx-auto">
                <CouponForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
        </DashboardLayout>
    );
}
