"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@corpora/ui";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/products/product-form";
import { useState } from "react";

export default function CreateProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    console.log("Creating product with data:", data);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    router.push("/catalog/products");
  };

  return (
    <DashboardLayout
      title="Create Product"
      subtitle="Add a new item to your catalog"
      breadcrumbs={[
        { label: "Catalog", href: "/catalog/products" },
        { label: "Products", href: "/catalog/products" },
        { label: "Create", active: true }
      ]}
    >
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/catalog/products")}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Products
        </Button>
      </div>

      <div className="max-w-5xl mx-auto">
        <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
}
