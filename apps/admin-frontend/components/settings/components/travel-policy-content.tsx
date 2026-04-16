"use client";

import { useMemo } from "react";

import { ColumnDef } from "@tanstack/react-table";

import { ActionsDropdown, BadgeVariant, DataTable, DataTableColumnHeader, DataTableToolbar } from "@corpora/ui";
import { useDataTable } from "@/lib/use-data-table";
import type { TravelPolicy } from "@/types/settings";

interface TravelPolicyContentProps {
  policies: TravelPolicy[];
}

export function TravelPolicyContent({ policies }: TravelPolicyContentProps) {
  const columns: ColumnDef<TravelPolicy>[] = useMemo(
    () => [
      {
        accessorKey: "policyName",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Policy Name" />
        ),
      },
      {
        accessorKey: "version",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Version" />
        ),
        cell: ({ row }) => {
          return (
            <BadgeVariant
              text={row.original.version}
              variant="primary"
              size="md"
              rounded="full"
              className="font-medium"
            />
          );
        },
      },
      {
        accessorKey: "effectiveDate",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Effective Date" />
        ),
      },
      {
        accessorKey: "lastUpdated",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Last Updated" />
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Status" />
        ),
        cell: ({ row }) => {
          const status = row.original.status;
          const isActive = status === "Active";
          return (
            <BadgeVariant
              text={status}
              variant={isActive ? "green" : "neutral"}
              size="md"
              rounded="full"
              className="font-medium"
            />
          );
        },
      },
      {
        id: "actions",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Actions" />
        ),
        cell: ({ row }) => {
          const policy = row.original;
          return (
            <ActionsDropdown
              items={[
                {
                  label: "View Policy",
                  icon: "eye",
                  onClick: () => {
                    console.log("View Policy", policy.id);
                    // TODO: Implement view policy
                  },
                },
                {
                  label: "Download",
                  icon: "download",
                  onClick: () => {
                    console.log("Download", policy.id);
                    // TODO: Implement download
                  },
                },
                {
                  label: "Request Update",
                  icon: "pencil",
                  onClick: () => {
                    console.log("Request Update", policy.id);
                    // TODO: Implement request update
                  },
                  variant: "destructive",
                },
              ]}
            />
          );
        },
      },
    ],
    [],
  );

  const { table } = useDataTable({
    data: policies,
    columns,
    pageCount: -1,
    clientMode: true,
  });

  return (
    <div className="flex flex-col gap-4">
      <DataTable table={table} className="border rounded-md">
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}

