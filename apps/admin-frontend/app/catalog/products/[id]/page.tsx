"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import { 
    ChevronLeft, 
    Star, 
    TrendingUp, 
    Trash2,
    ImageIcon as ImageIconLucide,
    Settings,
    LayoutDashboard
} from "lucide-react";
import Image from "next/image";

import {
  DashboardLayout,
} from "@/components/dashboard-layout";
import {
  DetailCard,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Tabs,
  TabsList,
  TabsTrigger,
  CommonAlertDialog,
} from "@corpora/ui";

import { MOCK_PRODUCTS, Product } from "@/components/products/mock-data";
import { createProductDetailSections } from "@/components/products/product-detail-sections";
import { ProductForm } from "@/components/products/product-form";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = params.id as string;
  const initialTab = searchParams.get("tab") || "details";

  const [product, setProduct] = useState<Product | undefined>(
    MOCK_PRODUCTS.find((p) => p.id === productId)
  );

  const [activeTab, setActiveTab] = useState(initialTab);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!product) {
    return (
      <DashboardLayout title="Product Not Found">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-lg text-muted-foreground mb-4">The product you are looking for does not exist.</p>
          <Button onClick={() => router.push("/catalog/products")}>Back to Products</Button>
        </div>
      </DashboardLayout>
    );
  }

  const sections = createProductDetailSections(product);

  const handleUpdate = async (data: any) => {
    setIsUpdating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProduct(prev => prev ? { ...prev, ...data } : prev);
    setIsUpdating(false);
    setActiveTab("details");
  };

  const handleDelete = () => {
    setIsDeleteConfirmOpen(false);
    router.push("/catalog/products");
  };

  return (
    <DashboardLayout
      title={product.title}
      subtitle={`Product ID: ${product.productId}`}
      breadcrumbs={[
        { label: "Catalog", href: "/catalog/products" },
        { label: "Products", href: "/catalog/products" },
        { label: product.title, active: true }
      ]}
    >
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/catalog/products")}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Products
        </Button>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-muted/50 p-1 rounded-full">
            <TabsList className="bg-transparent h-9 gap-1">
                <TabsTrigger value="details" className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">View Details</TabsTrigger>
                <TabsTrigger value="edit" className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Edit Product</TabsTrigger>
            </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            {activeTab === "details" ? (
                <div className="space-y-6">
                    <DetailCard
                        header={{
                            title: product.title,
                            subtitle: product.subtitle,
                            badge: {
                                label: product.isActive ? "Active" : "Inactive",
                                className: product.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
                            },
                        }}
                        sections={sections}
                    />

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <ImageIconLucide className="h-5 w-5" /> Media Gallery
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {product.media.map((img, i) => (
                                    <div key={i} className="group relative aspect-square rounded-xl overflow-hidden border bg-muted">
                                        <Image src={img.url} alt={img.type} fill className="object-cover transition-transform group-hover:scale-110" />
                                        <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-[10px] text-white font-medium text-center uppercase tracking-wider">{img.type.replace('PRODUCT_', '')}</p>
                                        </div>
                                    </div>
                                ))}
                                {product.media.length === 0 && (
                                    <div className="col-span-full py-10 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl">
                                        <ImageIconLucide className="h-8 w-8 mb-2 opacity-20" />
                                        <p className="text-sm">No images uploaded</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <ProductForm initialData={product} onSubmit={handleUpdate} isLoading={isUpdating} />
            )}
        </div>

        <div className="space-y-6">
            <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                        <Settings className="h-4 w-4" /> Quick Actions
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3">
                    <Button variant="outline" className="justify-start gap-3 bg-white" onClick={() => console.log("Toggle status")}>
                        <LayoutDashboard className="h-4 w-4" /> Toggle Visibility
                    </Button>
                    <Button variant="outline" className="justify-start gap-3 bg-white" onClick={() => console.log("Feature product")}>
                        <Star className="h-4 w-4" /> {product.featured ? "Remove from Featured" : "Add to Featured"}
                    </Button>
                    <Button variant="outline" className="justify-start gap-3 bg-white" onClick={() => console.log("Bestseller product")}>
                        <TrendingUp className="h-4 w-4" /> {product.bestseller ? "Remove Bestseller" : "Mark as Bestseller"}
                    </Button>
                    <div className="pt-2 border-t mt-2">
                        <Button 
                            variant="ghost" 
                            className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setIsDeleteConfirmOpen(true)}
                        >
                            <Trash2 className="h-4 w-4" /> Delete Product
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>

      <CommonAlertDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Product"
        subtitle="Are you sure you want to delete this product? This action cannot be undone."
        variant="error"
        ImageComponent={Image}
        buttons={[
          { label: "Cancel", onClick: () => setIsDeleteConfirmOpen(false), variant: "outline" },
          { label: "Delete Permanently", onClick: handleDelete, variant: "destructive" }
        ]}
      />
    </DashboardLayout>
  );
}
