"use client";

import * as React from "react";
import { Plus, FilterX } from "lucide-react";
import { useRouter } from "next/navigation";

import { DashboardLayout } from "@/components/dashboard-layout";
import { 
    Button, 
    TableTopBar,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    Label
} from "@corpora/ui";
import { CouponsTable } from "@/components/coupons/coupons-table";
import { MOCK_COUPONS, Coupon } from "@/components/coupons/mock-data";

export default function CouponsPage() {
    const router = useRouter();
    const [coupons, setCoupons] = React.useState<Coupon[]>(MOCK_COUPONS);
    const [isUpdating, setIsUpdating] = React.useState(false);
    
    // Filters logic
    const [filterType, setFilterType] = React.useState<string>("ALL");
    const [filterStatus, setFilterStatus] = React.useState<string>("ALL");

    const filteredCoupons = React.useMemo(() => {
        return coupons.filter(c => {
            const matchesType = filterType === "ALL" || c.type === filterType;
            const matchesStatus = filterStatus === "ALL" || (filterStatus === "ACTIVE" ? c.isActive : !c.isActive);
            return matchesType && matchesStatus;
        }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [coupons, filterType, filterStatus]);

    const handleToggleActive = (id: string) => {
        setCoupons(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
    };

    const handleDelete = (id: string) => {
        setCoupons(prev => prev.filter(c => c.id !== id));
    };

    return (
        <DashboardLayout 
            title="Marketing Engine" 
            subtitle="Promotion & Coupon Management"
            breadcrumbs={[
                { label: "Marketing", href: "/marketing/coupons" },
                { label: "Coupons", active: true }
            ]}
        >
            <div className="space-y-8">
                {/* FILTERS */}
                <div className="bg-card border rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-end gap-4">
                    <div className="flex-1 w-full space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-700 ml-1">Discount Type</Label>
                        <Select onValueChange={setFilterType} value={filterType}>
                            <SelectTrigger className="w-full h-11 rounded-xl bg-slate-50 border-slate-200">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-200">
                                <SelectItem value="ALL">All Mechanisms</SelectItem>
                                <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                                <SelectItem value="FIXED">Fixed Amount</SelectItem>
                                <SelectItem value="FREE_SHIPPING">Free Shipping</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex-1 w-full space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-700 ml-1">Status</Label>
                        <Select onValueChange={setFilterStatus} value={filterStatus}>
                            <SelectTrigger className="w-full h-11 rounded-xl bg-slate-50 border-slate-200">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-200">
                                <SelectItem value="ALL">Total Coverage</SelectItem>
                                <SelectItem value="ACTIVE">Live Campaigns</SelectItem>
                                <SelectItem value="INACTIVE">Archived / Draft</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-11 w-11 rounded-xl hover:bg-slate-100 shrink-0"
                        onClick={() => { setFilterType("ALL"); setFilterStatus("ALL"); }}
                    >
                        <FilterX className="h-4 w-4" />
                    </Button>
                </div>

                <TableTopBar
                    title="Coupons"
                    subtitle={`Broadcasting ${filteredCoupons.length} unique discount codes.`}
                    buttons={[
                        {
                            text: "Create Coupon",
                            icon: <Plus className="h-4 w-4" />,
                            variant: "default",
                            className: "rounded-full h-10 px-6",
                            onClick: () => router.push("/marketing/coupons/create")
                        }
                    ]}
                />

                <CouponsTable 
                    data={filteredCoupons}
                    onToggleActive={handleToggleActive}
                    onDelete={handleDelete}
                />
            </div>
        </DashboardLayout>
    );
}
