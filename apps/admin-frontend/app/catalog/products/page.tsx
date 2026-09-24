"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { TableTopBar, StatCard } from "@corpora/ui";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProductsTable } from "@/components/products/products-table";
import { MOCK_PRODUCTS, PRODUCT_STATS, Product } from "@/components/products/mock-data";

export default function ProductsListPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

  const handleDelete = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    console.log("Deleted product:", id);
  };

  const handleToggleActive = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  const handleToggleFeatured = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, featured: !p.featured } : p));
  };

  const handleToggleBestseller = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, bestseller: !p.bestseller } : p));
  };

  const statCards = [
    { title: "Total Products", value: PRODUCT_STATS.TOTAL.toString(), trend: { value: "0%", label: "growth", type: "neutral" as const } },
    { title: "Active", value: PRODUCT_STATS.ACTIVE.toString(), trend: { value: "0%", label: "availability", type: "neutral" as const } },
    { title: "Featured", value: PRODUCT_STATS.FEATURED.toString(), trend: { value: "0%", label: "highlighted", type: "neutral" as const } },
    { title: "Bestsellers", value: PRODUCT_STATS.BESTSELLER.toString(), trend: { value: "0%", label: "performance", type: "neutral" as const } },
  ];

  return (
    <DashboardLayout 
      title="Catalog" 
      subtitle="Products Management"
      breadcrumbs={[
        { label: "Catalog" },
        { label: "Products", active: true }
      ]}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="rounded-2xl bg-card shadow-sm p-8">
        <TableTopBar
          title="Products List"
          subtitle="View and manage all items in your store"
          buttons={[
            {
              text: "Create Product",
              icon: <Plus className="size-4" />,
              variant: "default",
              className: "rounded-full h-11 px-6",
              onClick: () => router.push("/catalog/products/create"),
            },
          ]}
          className="mb-8"
        />

        <ProductsTable
            data={products}
            pageCount={1}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
            onToggleFeatured={handleToggleFeatured}
            onToggleBestseller={handleToggleBestseller}
        />
      </div>
    </DashboardLayout>
  );
}
