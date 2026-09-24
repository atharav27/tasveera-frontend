"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import {
  DashboardLayout,
} from "@/components/dashboard-layout";
import {
  Button,
} from "@corpora/ui";

import { FrameFeatureForm } from "@/components/frame-features/frame-feature-form";

export default function CreateFrameFeaturePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Creating Feature:", data);
    setIsSubmitting(false);
    router.push("/catalog/frame-features");
  };

  return (
    <DashboardLayout
      title="Create Frame Feature"
      subtitle="Define a new feature that can be assigned to frame designs."
      breadcrumbs={[
        { label: "Catalog", href: "/catalog/products" },
        { label: "Frame Features", href: "/catalog/frame-features" },
        { label: "Create", active: true }
      ]}
    >
      <div className="mb-6 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/catalog/frame-features")}
          className="gap-2 -ml-2"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Features
        </Button>
      </div>

      <div className="max-w-5xl">
        <FrameFeatureForm onSubmit={handleSubmit} isLoading={isSubmitting} />
      </div>
    </DashboardLayout>
  );
}
