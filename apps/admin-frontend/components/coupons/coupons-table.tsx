"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";

import {
  DataTable,
  DataTableColumnHeader,
  StatusBadge,
  BadgeVariant,
  CommonAlertDialog,
  ActionsDropdown,
  type ActionItem,
} from "@corpora/ui";
import { useDataTable } from "@/hooks/use-data-table";
import { Coupon } from "./mock-data";

interface CouponsTableProps {
  data: Coupon[];
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}

const TYPE_VARIANT: Record<string, BadgeVariant> = {
  PERCENTAGE: "primary",
  FIXED: "green",
  FREE_SHIPPING: "amber",
};

export function CouponsTable({ 
  data, 
  onDelete,
  onToggleActive,
}: CouponsTableProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);

  const columns = React.useMemo<ColumnDef<Coupon>[]>(
    () => [
      {
        accessorKey: "code",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Code" />
        ),
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => router.push(`/marketing/coupons/${row.original.id}`)}
            className="font-bold text-primary hover:underline text-lg tracking-tighter"
          >
            {row.getValue("code")}
          </button>
        ),
      },
      {
        accessorKey: "type",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Type" />
        ),
        cell: ({ row }) => {
          const type = row.getValue("type") as string;
          return (
            <StatusBadge 
              status={type} 
              text={type.replace('_', ' ')}
              statusToVariant={TYPE_VARIANT}
            />
          );
        },
      },
      {
        accessorKey: "value",
        header: "Value",
        cell: ({ row }) => {
            const coupon = row.original;
            if (coupon.type === 'FREE_SHIPPING') return <span className="text-muted-foreground">-</span>;
            return (
                <span className="font-bold">
                    {coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : `₹${coupon.value}`}
                </span>
            );
        }
      },
      {
        accessorKey: "usageCount",
        header: "Usage",
        cell: ({ row }) => {
            const c = row.original;
            return (
                <div className="flex flex-col">
                    <span className="text-sm font-bold">{c.usageCount} applied</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">
                        Limit: {c.usageLimit || "∞"}
                    </span>
                </div>
            );
        }
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
      },
      {
        accessorKey: "expiresAt",
        header: "Expiry",
        cell: ({ row }) => {
            const val = row.getValue("expiresAt") as string;
            if (!val) return <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">PERPETUAL</span>;
            return (
                <span className="text-xs font-medium text-slate-600">
                    {format(new Date(val), "MMM d, yyyy")}
                </span>
            );
        }
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const coupon = row.original;
          const items: ActionItem[] = [
            {
              label: "View / Edit",
              icon: "pencil",
              onClick: () => router.push(`/marketing/coupons/${coupon.id}`),
            },
            {
              label: coupon.isActive ? "Deactivate" : "Activate",
              icon: coupon.isActive ? "xcircle" : "circleCheckBig",
              onClick: () => onToggleActive(coupon.id),
            },
            {
              label: "Delete Coupon",
              icon: "trash2",
              variant: "destructive",
              disabled: coupon.usageCount > 0,
              onClick: () => setIsDeleting(coupon.id),
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
    [router, onToggleActive]
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
            tableWrapperClassName="border rounded-[2rem] overflow-hidden shadow-sm bg-card"
        />

        <CommonAlertDialog
            open={!!isDeleting}
            onOpenChange={(open) => !open && setIsDeleting(null)}
            title="Purge Promotional Link"
            subtitle="Are you sure? This coupon will be permanently erased. This operation is only allowed for unused coupons."
            variant="error"
            ImageComponent={Image}
            buttons={[
                { label: "Abort", onClick: () => setIsDeleting(null), variant: "outline" },
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
