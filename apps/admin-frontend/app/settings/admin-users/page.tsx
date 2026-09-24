"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { DashboardLayout } from "@/components/dashboard-layout";
import { 
    Button, 
    TableTopBar,
    Checkbox,
    Label
} from "@corpora/ui";
import { AdminUsersTable } from "@/components/admin-users/admin-users-table";
import { MOCK_ADMINS, AdminUser } from "@/components/admin-users/mock-data";

export default function AdminUsersPage() {
    const router = useRouter();
    const [admins, setAdmins] = React.useState<AdminUser[]>(MOCK_ADMINS);
    const [includeInactive, setIncludeInactive] = React.useState<boolean>(false);

    const filteredAdmins = React.useMemo(() => {
        return admins.filter(a => {
            if (!includeInactive && !a.isActive) return false;
            return true;
        }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [admins, includeInactive]);

    const handleDeactivate = async (id: string) => {
        // Simulate API Delete (Soft Delete)
        await new Promise(r => setTimeout(r, 1000));
        setAdmins(prev => prev.map(a => a.id === id ? { ...a, isActive: false } : a));
    };

    const handleUnlock = async (id: string) => {
        // Simulate API Unlock
        await new Promise(r => setTimeout(r, 1000));
        setAdmins(prev => prev.map(a => a.id === id ? { ...a, isLocked: false } : a));
    };

    return (
        <DashboardLayout 
            title="Access Management" 
            subtitle="Admin Users Directory"
            breadcrumbs={[
                { label: "Settings", href: "/settings/my-profile" },
                { label: "Admin Users", active: true }
            ]}
        >
            <div className="space-y-6 max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Active Team Directory</h3>
                            <p className="text-sm text-slate-500 font-medium">Managing core system access and roles.</p>
                        </div>
                        
                        <div className="flex items-center gap-6">
                            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
                                <Checkbox 
                                    id="includeInactive" 
                                    checked={includeInactive}
                                    onCheckedChange={(c) => setIncludeInactive(c as boolean)}
                                />
                                <Label htmlFor="includeInactive" className="text-xs font-semibold text-slate-700 cursor-pointer">Show Archived</Label>
                            </div>
                            <Button 
                                onClick={() => router.push("/settings/admin-users/create")}
                                className="rounded-full h-10 px-6 gap-2 font-semibold shadow-sm"
                            >
                                <Plus className="h-4 w-4" /> Provision User
                            </Button>
                        </div>
                    </div>
                    
                    <AdminUsersTable 
                        data={filteredAdmins}
                        onDeactivate={handleDeactivate}
                        onUnlock={handleUnlock}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
