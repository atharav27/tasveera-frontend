"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Star, CheckCircle, XCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import {
  DataTable,
  DataTableColumnHeader,
  StatusBadge,
  CommonAlertDialog,
  ActionsDropdown,
  type ActionItem,
} from "@corpora/ui";
import { useDataTable } from "@/hooks/use-data-table";
import { Review } from "./mock-data";

interface ReviewsTableProps {
  data: Review[];
  onDelete: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function ReviewsTable({ 
  data, 
  onDelete,
  onApprove,
  onReject
}: ReviewsTableProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);

  const columns = React.useMemo<ColumnDef<Review>[]>(
    () => [
      {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => {
            const rating = row.original.rating;
            return (
                <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                            key={star}
                            className={`h-4 w-4 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200'}`}
                        />
                    ))}
                </div>
            );
        }
      },
      {
        accessorKey: "reviewerName",
        header: ({ column }) => <DataTableColumnHeader column={column} label="Customer" />,
        cell: ({ row }) => <span className="font-bold text-slate-900">{row.getValue("reviewerName")}</span>,
      },
      {
        accessorKey: "product",
        header: "Product Ref",
        cell: ({ row }) => {
            const product = row.original.product;
            return (
                <Link href={`/catalog/products/${product.id}`} className="text-xs font-semibold text-primary hover:underline line-clamp-1 max-w-[150px]">
                    {product.title}
                </Link>
            );
        }
      },
      {
        accessorKey: "comment",
        header: "Critique",
        cell: ({ row }) => (
            <span className="text-xs text-slate-600 line-clamp-2 max-w-[250px] italic">
                "{row.getValue("comment")}"
            </span>
        )
      },
      {
        accessorKey: "isApproved",
        header: "Status",
        cell: ({ row }) => {
            const approved = row.getValue("isApproved");
            return (
                <StatusBadge 
                    status={approved ? "Approved" : "Pending"} 
                    text={approved ? "Approved" : "Pending Review"}
                    statusToVariant={{ "Approved": "green", "Pending": "amber" }}
                />
            );
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => <DataTableColumnHeader column={column} label="Date" />,
        cell: ({ row }) => (
            <span className="text-xs font-medium text-slate-500">
                {format(new Date(row.getValue("createdAt")), "MMM d, yyyy")}
            </span>
        )
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const review = row.original;
          
          const items: ActionItem[] = [
            {
              label: "View Details",
              icon: "eye",
              onClick: () => router.push(`/support/reviews/${review.id}`),
            },
            {
              label: "Approve Review",
              icon: "circleCheckBig",
              onClick: () => onApprove(review.id),
            },
            {
               label: "Reject / Ignore",
               icon: "xcircle",
               onClick: () => onReject(review.id),
               variant: "destructive"
            },
            {
              label: "Delete Terminally",
              icon: "trash2",
              variant: "destructive",
              onClick: () => setIsDeleting(review.id),
            },
          ];

          return (
            <div className="flex justify-end gap-2 items-center">
                {!review.isApproved && (
                    <button onClick={() => onApprove(review.id)} className="h-8 w-8 rounded-full hover:bg-green-50 text-green-600 flex items-center justify-center transition-colors" title="Quick Approve">
                        <CheckCircle className="h-4 w-4" />
                    </button>
                )}
              <ActionsDropdown items={items} />
            </div>
          );
        },
      },
    ],
    [router, onApprove, onReject]
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount: 1,
    getRowId: (row) => row.id,
    shallow: false,
  });

  return (
    <>
        <DataTable
            table={table}
            className="border-none"
            tableWrapperClassName="border rounded-2xl overflow-hidden shadow-sm bg-card border-slate-200"
        />

        <CommonAlertDialog
            open={!!isDeleting}
            onOpenChange={(open) => !open && setIsDeleting(null)}
            title="Delete Review Data"
            subtitle="Are you sure? This removes the review from the system permanently."
            variant="error"
            ImageComponent={Image}
            buttons={[
                { label: "Cancel", onClick: () => setIsDeleting(null), variant: "outline" },
                { label: "Delete Permanently", onClick: () => {
                    if (isDeleting) {
                        onDelete(isDeleting);
                        setIsDeleting(null);
                    }
                }, variant: "destructive" },
            ]}
        />
    </>
  );
}
