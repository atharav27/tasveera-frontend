"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@corpora/ui";
import { BannerForm } from "@/components/banners/banner-form";
import { BannerMediaManager } from "@/components/banners/banner-media-manager";
import { MOCK_BANNERS, Banner } from "@/components/banners/mock-data";

export default function BannerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    
    const [banner, setBanner] = React.useState<Banner | undefined>(
        MOCK_BANNERS.find(b => b.id === id)
    );
    const [isLoading, setIsLoading] = React.useState(false);

    if (!banner) {
        return (
            <DashboardLayout title="Not Found">
                <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-lg text-muted-foreground mb-4">Banner deployment not found.</p>
                    <Button onClick={() => router.push("/content/banners")} className="rounded-full px-8">Back to Engine</Button>
                </div>
            </DashboardLayout>
        );
    }

    const handleUpdate = async (data: any) => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setBanner(prev => prev ? { ...prev, ...data } : prev);
        setIsLoading(false);
    };

    return (
        <DashboardLayout 
            title={banner.title} 
            subtitle={`Deployment Node: ${banner.id}`}
            breadcrumbs={[
                { label: "Content", href: "/content/categories" },
                { label: "Banners", href: "/content/banners" },
                { label: banner.title, active: true }
            ]}
        >
            <div className="mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/content/banners")}
                    className="gap-2 font-bold"
                >
                    <ChevronLeft className="h-4 w-4" /> Back to Console
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-16 max-w-5xl mx-auto">
                
                {/* SECTION A: Configuration */}
                <div className="space-y-6">
                    <BannerForm 
                        initialData={banner} 
                        onSubmit={handleUpdate} 
                        isLoading={isLoading} 
                    />
                </div>
                
                <hr className="border-slate-200" />

                {/* SECTION B: Media Content */}
                <div className="pb-20">
                    <BannerMediaManager bannerId={banner.id} />
                </div>

            </div>
        </DashboardLayout>
    );
}
