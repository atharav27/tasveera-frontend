"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { 
  ChevronLeft, 
  Trash2,
  Info,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import {
  DashboardLayout,
} from "@/components/dashboard-layout";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CommonAlertDialog,
  DataTable,
} from "@corpora/ui";

import { MOCK_FRAME_FEATURES, FrameFeature } from "@/components/frame-features/mock-data";
import { FrameFeatureForm } from "@/components/frame-features/frame-feature-form";
import { type ColumnDef } from "@tanstack/react-table";
import { useDataTable } from "@/hooks/use-data-table";

export default function FrameFeatureDetailPage() {
  const params = useParams();
  const router = useRouter();
  const featureId = params.id as string;

  const [feature, setFeature] = useState<FrameFeature | undefined>(
    MOCK_FRAME_FEATURES.find((f) => f.id === featureId)
  );

  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  if (!feature) {
    return (
      <DashboardLayout title="Feature Not Found">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-lg text-muted-foreground mb-4">The frame feature you are looking for does not exist.</p>
          <Button onClick={() => router.push("/catalog/frame-features")}>Back to Features</Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleUpdate = async (data: any) => {
    setIsUpdating(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setFeature(prev => prev ? { ...prev, ...data } : prev);
    setIsUpdating(false);
  };

  const executeDelete = async () => {
    setIsUpdating(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    router.push("/catalog/frame-features");
  };

  const linkedDesignsColumns: ColumnDef<any>[] = [
    {
        accessorKey: "name",
        header: "Design Name",
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>
    },
    {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => <span className="text-xs font-mono">{row.original.slug}</span>
    },
    {
        accessorKey: "productId",
        header: "Product ID",
        cell: ({ row }) => <span className="text-xs">{row.original.productId}</span>
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <Button variant="ghost" size="sm" asChild className="h-8">
                <Link href={`/catalog/frame-designs/${row.original.id}`} className="flex items-center gap-2">
                    <ExternalLink className="h-3.5 w-3.5" /> View Design
                </Link>
            </Button>
        )
    }
  ];

  const { table } = useDataTable({
    data: feature.linkedDesigns || [],
    columns: linkedDesignsColumns,
    pageCount: 1,
    getRowId: (row) => row.id,
    shallow: false,
  });

  return (
    <DashboardLayout
      title={feature.name}
      subtitle={`Feature ID: ${feature.id}`}
      breadcrumbs={[
        { label: "Catalog", href: "/catalog/products" },
        { label: "Frame Features", href: "/catalog/frame-features" },
        { label: feature.name, active: true }
      ]}
    >
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/catalog/frame-features")}
          className="gap-2 -ml-2"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Features
        </Button>
        <Button 
            variant="destructive" 
            size="sm" 
            className="gap-2 h-9 px-4 rounded-full"
            onClick={() => setIsDeleteConfirmOpen(true)}
        >
            <Trash2 className="h-4 w-4" /> Delete Feature
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-10 max-w-5xl">
        
        {/* Feature Info Section */}
        <div className="space-y-6">
            <div className="flex items-center gap-2 px-1">
                <Info className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold tracking-tight">Feature Configuration</h2>
            </div>
            <FrameFeatureForm initialData={feature} onSubmit={handleUpdate} isLoading={isUpdating} />
        </div>
        
        <hr className="border-muted/50" />

        {/* Linked Frame Designs (Read-only) */}
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold tracking-tight">Linked Frame Designs</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Frame designs currently utilizing this feature variation.
                </p>
            </div>
            
            <div className="rounded-xl border bg-card overflow-hidden">
                <DataTable 
                    table={table}
                    className="border-none"
                    tableWrapperClassName="border-none"
                />
                {(feature.linkedDesigns?.length || 0) === 0 && (
                    <div className="py-12 text-center text-muted-foreground italic text-sm">
                        No frame designs are currently linked to this feature.
                    </div>
                )}
            </div>
        </div>

      </div>

      <CommonAlertDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Feature"
        subtitle="Are you sure you want to delete this feature? This will fail if there are linked frame designs."
        variant="error"
        ImageComponent={Image}
        buttons={[
          { label: "Cancel", onClick: () => setIsDeleteConfirmOpen(false), variant: "outline" },
          { label: "Delete Permanently", onClick: executeDelete, variant: "destructive" }
        ]}
      />
    </DashboardLayout>
  );
}
