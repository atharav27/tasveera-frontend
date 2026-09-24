"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Shield, ShieldAlert } from "lucide-react";
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
import { AdminUser, CURRENT_USER_ID, AdminRole } from "./mock-data";

interface AdminUsersTableProps {
  data: AdminUser[];
  onDeactivate: (id: string) => void;
  onUnlock: (id: string) => void;
}

const ROLE_VARIANT: Record<string, BadgeVariant> = {
  SUPER_ADMIN: "primary",
  ADMIN: "green",
  DESIGNER: "amber",
  SUPPORT: "neutral",
};

export function AdminUsersTable({ 
  data, 
  onDeactivate,
  onUnlock,
}: AdminUsersTableProps) {
  const router = useRouter();
  const [isDeactivating, setIsDeactivating] = React.useState<string | null>(null);

  const columns = React.useMemo<ColumnDef<AdminUser>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} label="Admin Identity" />,
        cell: ({ row }) => {
            const admin = row.original;
            return (
                <div 
                    onClick={() => router.push(`/settings/admin-users/${admin.id}`)}
                    className="flex flex-col cursor-pointer group"
                >
                    <span className="font-bold text-slate-900 group-hover:underline group-hover:text-primary transition-colors flex items-center gap-2">
                        {admin.name} 
                        {admin.id === CURRENT_USER_ID && <span className="px-1.5 py-0.5 rounded text-[9px] bg-primary/10 text-primary uppercase font-bold tracking-widest border border-primary/20">You</span>}
                    </span>
                    <span className="text-xs text-muted-foreground">{admin.email}</span>
                </div>
            );
        },
      },
      {
        accessorKey: "role",
        header: "Authorization Tier",
        cell: ({ row }) => {
          const role = row.getValue("role") as string;
          return (
            <StatusBadge 
              status={role} 
              text={role.replace('_', ' ')}
              statusToVariant={ROLE_VARIANT}
            />
          );
        },
      },
      {
        accessorKey: "isActive",
        header: "Status Configuration",
        cell: ({ row }) => {
            const admin = row.original;
            if (admin.isLocked) {
                return (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-md w-fit">
                        <ShieldAlert className="h-3.5 w-3.5" /> SYSTEM LOCKED
                    </div>
                );
            }

            return (
                <div className="flex items-center gap-1.5">
                    <StatusBadge 
                        status={admin.isActive ? "Active" : "Archived"} 
                        text={admin.isActive ? "Active Account" : "Deactivated"}
                        statusToVariant={{ "Active": "green", "Archived": "neutral" }}
                    />
                </div>
            );
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => <DataTableColumnHeader column={column} label="Onboarded" />,
        cell: ({ row }) => (
            <span className="text-xs font-medium text-slate-500">
                {format(new Date(row.getValue("createdAt")), "MMM d, yyyy")}
            </span>
        )
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const admin = row.original;
          const items: ActionItem[] = [
            {
              label: "Configure Identity",
              icon: "pencil",
              onClick: () => router.push(`/settings/admin-users/${admin.id}`),
            }
          ];

          if (admin.isLocked) {
              items.push({
                  label: "Unlock Account",
                  icon: "circleCheckBig",
                  onClick: () => onUnlock(admin.id),
              });
          }

          if (admin.isActive) {
              const isSelf = admin.id === CURRENT_USER_ID;
              
              const activeSuperAdmins = data.filter(u => u.isActive && u.role === "SUPER_ADMIN");
              const isLastSuperAdmin = admin.role === "SUPER_ADMIN" && activeSuperAdmins.length <= 1;

              items.push({
                  label: "Deactivate Identity",
                  icon: "ban",
                  variant: "destructive",
                  disabled: isSelf || isLastSuperAdmin,
                  onClick: () => setIsDeactivating(admin.id),
              });
          }

          return (
            <div className="flex justify-end">
              <ActionsDropdown items={items} />
            </div>
          );
        },
      },
    ],
    [router, onUnlock, data]
  );

  const { table } = useDataTable({
    data,
    columns,
    // Note: Pagination handled on API side, this just exposes the table state
    pageCount: 1, 
    getRowId: (row) => row.id,
    shallow: false,
  });

  const getDeactivationWarning = () => {
      const u = data.find(x => x.id === isDeactivating);
      if (!u) return "";
      return `Are you sure you want to suspend access for ${u.name}? They will be immediately disconnected from all active console sessions.`;
  };

  return (
    <>
        <DataTable
            table={table}
            className="border-none"
            tableWrapperClassName="border rounded-2xl overflow-hidden shadow-sm bg-card border-slate-200"
        />

        <CommonAlertDialog
            open={!!isDeactivating}
            onOpenChange={(open) => !open && setIsDeactivating(null)}
            title="Deactivate Administration Identity"
            subtitle={getDeactivationWarning()}
            variant="error"
            ImageComponent={Image}
            buttons={[
                { label: "Cancel", onClick: () => setIsDeactivating(null), variant: "outline" },
                { label: "Revoke Access", onClick: () => {
                    if (isDeactivating) {
                        onDeactivate(isDeactivating);
                        setIsDeactivating(null);
                    }
                }, variant: "destructive" },
            ]}
        />
    </>
  );
}
