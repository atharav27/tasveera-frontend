"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { 
  Search, 
  MoreVertical, 
  Eye, 
  Trash2, 
  Edit, 
  CheckCircle, 
  XCircle, 
  Star, 
  TrendingUp,
  ImageIcon
} from "lucide-react";
import Image from "next/image";

import {
  DataTable,
  DataTableColumnHeader,
  Button,
  StatusBadge,
  Input,
  DataTableToolbar,
  CommonAlertDialog,
  ActionsDropdown,
  type ActionItem,
  type BadgeVariant
} from "@corpora/ui";
import { useDataTable } from "@/hooks/use-data-table";
import { Product, ProductType } from "./mock-data";

interface ProductsTableProps {
  data: Product[];
  pageCount: number;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onToggleBestseller: (id: string) => void;
}

const TYPE_VARIANT: Record<ProductType, BadgeVariant> = {
  FRAME: "primary",
  PACK: "amber",
  HAMPER: "green",
  SIMPLE: "neutral",
  CUSTOM: "primary",
};

export function ProductsTable({ 
  data, 
  pageCount, 
  onDelete,
  onToggleActive,
  onToggleFeatured,
  onToggleBestseller
}: ProductsTableProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);
  const [isTogglingActive, setIsTogglingActive] = React.useState<string | null>(null);
  const [isTogglingFeatured, setIsTogglingFeatured] = React.useState<string | null>(null);
  const [isTogglingBestseller, setIsTogglingBestseller] = React.useState<string | null>(null);

  const columns = React.useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "productId",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="ID" />
        ),
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => router.push(`/catalog/products/${row.original.id}`)}
            className="font-medium text-primary hover:underline text-left"
          >
            {row.getValue("productId")}
          </button>
        ),
        meta: { label: "Product ID", variant: "text" }
      },
      {
        accessorKey: "thumbnail",
        header: "Image",
        cell: ({ row }) => {
          const thumbnail = row.original.media.find(m => m.type === 'PRODUCT_THUMBNAIL');
          return (
            <div className="relative h-10 w-10 rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
              {thumbnail ? (
                <Image src={thumbnail.url} alt={row.original.title} fill className="object-cover" />
              ) : (
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Title" />
        ),
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium">{row.getValue("title")}</span>
            <span className="text-xs text-muted-foreground line-clamp-1">{row.original.slug}</span>
          </div>
        ),
      },
      {
        accessorKey: "type",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Type" />
        ),
        cell: ({ row }) => {
          const type = row.getValue("type") as ProductType;
          return (
            <StatusBadge
              status={type}
              text={type}
              statusToVariant={TYPE_VARIANT}
            />
          );
        },
        meta: {
          label: "Type",
          variant: "multiSelect",
          options: [
            { label: "Frame", value: "FRAME" },
            { label: "Pack", value: "PACK" },
            { label: "Hamper", value: "HAMPER" },
            { label: "Simple", value: "SIMPLE" },
            { label: "Custom", value: "CUSTOM" },
          ]
        }
      },
      {
        accessorKey: "requiresImage",
        header: "Requires Image",
        cell: ({ row }) => (
          <StatusBadge 
            status={row.getValue("requiresImage") ? "Yes" : "No"} 
            text={row.getValue("requiresImage") ? "Yes" : "No"}
            statusToVariant={{ "Yes": "green", "No": "neutral" }}
          />
        ),
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
          <StatusBadge 
            status={row.getValue("isActive") ? "Active" : "Inactive"} 
            text={row.getValue("isActive") ? "Active" : "Inactive"}
            statusToVariant={{ "Active": "green", "Inactive": "red" }}
          />
        ),
        meta: {
          label: "Active Status",
          variant: "multiSelect",
          options: [
            { label: "Active", value: "true" },
            { label: "Inactive", value: "false" },
          ]
        }
      },
      {
        accessorKey: "featured",
        header: "Featured",
        cell: ({ row }) => (
            row.getValue("featured") ? <Star className="h-4 w-4 text-amber-500 fill-amber-500" /> : "-"
        ),
        meta: {
            label: "Featured",
            variant: "multiSelect",
            options: [
              { label: "Yes", value: "true" },
              { label: "No", value: "false" },
            ]
        }
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const product = row.original;
          const items: ActionItem[] = [
            {
              label: "View Details",
              icon: "eye",
              onClick: () => router.push(`/catalog/products/${product.id}`),
            },
            {
              label: "Edit Product",
              icon: "pencil",
              onClick: () => router.push(`/catalog/products/${product.id}?tab=edit`),
            },
            {
              label: product.isActive ? "Deactivate" : "Activate",
              icon: product.isActive ? "xcircle" : "circleCheckBig",
              onClick: () => setIsTogglingActive(product.id),
            },
            {
              label: product.featured ? "Unfeature" : "Feature",
              icon: "star",
              onClick: () => setIsTogglingFeatured(product.id),
            },
            {
              label: product.bestseller ? "Remove Bestseller" : "Set Bestseller",
              icon: "trendingUp",
              onClick: () => setIsTogglingBestseller(product.id),
            },
            {
              label: "Delete Product",
              icon: "trash2",
              variant: "destructive",
              onClick: () => setIsDeleting(product.id),
            },
          ];

          return (
            <div className="flex justify-end">
              <ActionsDropdown items={items} />
            </div>
          );
        },
      },
    ],
    [router, onToggleFeatured, onToggleBestseller]
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    initialState: {
      sorting: [{ id: "productId", desc: false }],
    },
    getRowId: (row) => row.id,
    shallow: false,
  });

  return (
    <>
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
            <div className="relative w-full lg:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search Products...."
                    className="pl-11 h-11 sm:h-12 rounded-full bg-muted/30 border-none w-full"
                    value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => {
                        table.getColumn("title")?.setFilterValue(event.target.value);
                    }}
                />
            </div>
            <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
                <DataTableToolbar
                    table={table}
                    className="p-0 border-none bg-transparent"
                />
            </div>
        </div>
        <DataTable
            table={table}
            className="border-none"
            tableWrapperClassName="border rounded-xl overflow-hidden"
        />

        <CommonAlertDialog
            open={!!isDeleting}
            onOpenChange={(open) => !open && setIsDeleting(null)}
            title="Delete Product"
            subtitle="Are you sure you want to delete this product? This will mark it as inactive."
            variant="error"
            ImageComponent={Image}
            buttons={[
                { label: "Cancel", onClick: () => setIsDeleting(null), variant: "outline" },
                { label: "Delete", onClick: () => isDeleting && onDelete(isDeleting), variant: "destructive" },
            ]}
        />

        <CommonAlertDialog
            open={!!isTogglingActive}
            onOpenChange={(open) => !open && setIsTogglingActive(null)}
            title="Toggle Status"
            subtitle="Change the active status of this product."
            variant="warning"
            ImageComponent={Image}
            buttons={[
                { label: "Cancel", onClick: () => setIsTogglingActive(null), variant: "outline" },
                { label: "Confirm", onClick: () => isTogglingActive && onToggleActive(isTogglingActive), variant: "default" },
            ]}
        />

        <CommonAlertDialog
            open={!!isTogglingFeatured}
            onOpenChange={(open) => !open && setIsTogglingFeatured(null)}
            title="Toggle Featured"
            subtitle="Change the featured status of this product. Featured products appear on the home page."
            variant="warning"
            ImageComponent={Image}
            buttons={[
                { label: "Cancel", onClick: () => setIsTogglingFeatured(null), variant: "outline" },
                { label: "Confirm", onClick: () => isTogglingFeatured && onToggleFeatured(isTogglingFeatured), variant: "default" },
            ]}
        />

        <CommonAlertDialog
            open={!!isTogglingBestseller}
            onOpenChange={(open) => !open && setIsTogglingBestseller(null)}
            title="Toggle Bestseller"
            subtitle="Change the bestseller status of this product. Bestsellers get a special badge."
            variant="warning"
            ImageComponent={Image}
            buttons={[
                { label: "Cancel", onClick: () => setIsTogglingBestseller(null), variant: "outline" },
                { label: "Confirm", onClick: () => isTogglingBestseller && onToggleBestseller(isTogglingBestseller), variant: "default" },
            ]}
        />
    </>
  );
}
