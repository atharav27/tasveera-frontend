"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { SupportedSize } from "./mock-data";
import { 
    DataTable,
    DataTableColumnHeader,
    Button,
    ActionsDropdown,
    type ActionItem,
} from "@corpora/ui";
import { useDataTable } from "@/hooks/use-data-table";

interface PhotoDesignSizesProps {
    sizes: SupportedSize[];
    onRemove: (id: string) => void;
}

export function PhotoDesignSizes({ sizes, onRemove }: PhotoDesignSizesProps) {
    const columns = React.useMemo<ColumnDef<SupportedSize>[]>(
        () => [
            {
                accessorKey: "label",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} label="Size Label" />
                ),
                cell: ({ row }) => <span className="font-bold text-slate-900">{row.getValue("label")}</span>,
            },
            {
                id: "dimensions",
                header: "Dimensions",
                cell: ({ row }) => (
                    <span className="text-muted-foreground font-medium">
                        {row.original.width} x {row.original.height} in
                    </span>
                ),
            },
            {
                accessorKey: "frameDesignName",
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} label="Recommended Frame" />
                ),
                cell: ({ row }) => <span className="text-muted-foreground italic">{row.getValue("frameDesignName")}</span>,
            },
            {
                id: "actions",
                cell: ({ row }) => {
                    const size = row.original;
                    const items: ActionItem[] = [
                        {
                            label: "Remove Size",
                            icon: "trash2",
                            variant: "destructive",
                            onClick: () => onRemove(size.id),
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
        [onRemove]
    );

    const { table } = useDataTable({
        data: sizes,
        columns,
        pageCount: 1,
        initialState: {
            sorting: [{ id: "label", desc: false }],
        },
        getRowId: (row) => row.id,
        shallow: false,
    });

    return (
        <DataTable
            table={table}
            className="border-none"
            tableWrapperClassName="border rounded-xl overflow-hidden shadow-sm bg-card"
        />
    );
}
