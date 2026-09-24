"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@corpora/ui";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { FrameDesignForm } from "@/components/frame-designs/frame-design-form";
import { useState } from "react";

export default function CreateFrameDesignPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    // Simulate API call to POST /api/v1/admin/frame-designs
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Created design:", data);
    setIsLoading(false);
    router.push("/catalog/frame-designs");
  };

  return (
    <DashboardLayout
      title="Create Frame Design"
      subtitle="Add a new finish or style to a product"
      breadcrumbs={[
        { label: "Catalog", href: "/catalog/products" },
        { label: "Frame Designs", href: "/catalog/frame-designs" },
        { label: "Create", active: true }
      ]}
    >
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/catalog/frame-designs")}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Designs
        </Button>
      </div>

      <div className="max-w-5xl mx-auto">
        <FrameDesignForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
}
