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
import { BannersListGrouped } from "@/components/banners/banners-list-grouped";
import { MOCK_BANNERS, Banner, BannerPosition, BANNER_POSITIONS } from "@/components/banners/mock-data";

export default function BannersPage() {
    const router = useRouter();
    const [banners, setBanners] = React.useState<Banner[]>(MOCK_BANNERS);
    const [isUpdating, setIsUpdating] = React.useState(false);
    
    // Global filtering
    const [filterPosition, setFilterPosition] = React.useState<string>("ALL");
    const [filterActive, setFilterActive] = React.useState<string>("ALL");

    const filteredBanners = React.useMemo(() => {
        return banners.filter(b => {
            const matchesPos = filterPosition === "ALL" || b.position === filterPosition;
            const matchesActive = filterActive === "ALL" || (filterActive === "TRUE" ? b.isActive : !b.isActive);
            return matchesPos && matchesActive;
        });
    }, [banners, filterPosition, filterActive]);

    const handleSaveOrder = async (position: BannerPosition, orderedIds: string[]) => {
        setIsUpdating(true);
        // Simulate PATCH /api/v1/admin/banners/reorder
        await new Promise(r => setTimeout(r, 1000));
        
        const newBanners = [...banners].map(b => {
            const idx = orderedIds.indexOf(b.id);
            if (idx !== -1) return { ...b, sortOrder: idx + 1 };
            return b;
        });

        setBanners(newBanners);
        setIsUpdating(false);
    };

    const handleToggleActive = (id: string) => {
        setBanners(prev => prev.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b));
    };

    const handleDelete = (id: string) => {
        setBanners(prev => prev.filter(b => b.id !== id));
    };

    return (
        <DashboardLayout 
            title="Content Engine" 
            subtitle="Storefront Banner Management"
            breadcrumbs={[
                { label: "Content", href: "/content/categories" },
                { label: "Banners", active: true }
            ]}
        >
            <div className="space-y-8">
                {/* GLOBAL FILTERS */}
                <div className="bg-card border rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-end gap-4">
                    <div className="flex-1 w-full space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-700 ml-1">Position</Label>
                        <Select onValueChange={setFilterPosition} value={filterPosition}>
                            <SelectTrigger className="w-full h-11 rounded-xl bg-slate-50 border-slate-200 shadow-none px-4">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl shadow-lg border-slate-200">
                                <SelectItem value="ALL">Total Coverage</SelectItem>
                                {BANNER_POSITIONS.map(p => (
                                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex-1 w-full space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-700 ml-1">Status</Label>
                        <Select onValueChange={setFilterActive} value={filterActive}>
                            <SelectTrigger className="w-full h-11 rounded-xl bg-slate-50 border-slate-200 shadow-none px-4">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl shadow-lg border-slate-200">
                                <SelectItem value="ALL">All States</SelectItem>
                                <SelectItem value="TRUE">Live Banners</SelectItem>
                                <SelectItem value="FALSE">Idle / Draft</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-11 w-11 rounded-xl hover:bg-slate-100 shrink-0"
                        onClick={() => { setFilterPosition("ALL"); setFilterActive("ALL"); }}
                    >
                        <FilterX className="h-4 w-4" />
                    </Button>
                </div>

                <TableTopBar
                    title="Banners"
                    subtitle="Management grouped by architectural position."
                    buttons={[
                        {
                            text: "Create Banner",
                            icon: <Plus className="h-4 w-4" />,
                            variant: "default",
                            className: "rounded-full h-10 px-6 shadow-sm",
                            onClick: () => router.push("/content/banners/create")
                        }
                    ]}
                />

                <BannersListGrouped 
                    items={filteredBanners}
                    onSaveOrder={handleSaveOrder}
                    onToggleActive={handleToggleActive}
                    onDelete={handleDelete}
                    isLoading={isUpdating}
                />
            </div>
        </DashboardLayout>
    );
}
