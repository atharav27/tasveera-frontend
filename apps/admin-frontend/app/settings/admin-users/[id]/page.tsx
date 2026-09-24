"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ShieldAlert, KeyRound, Ban } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button, StatusBadge, Card, CardContent, CommonAlertDialog } from "@corpora/ui";
import { AdminUserForm } from "@/components/admin-users/admin-user-form";
import { MOCK_ADMINS, AdminUser, CURRENT_USER_ID } from "@/components/admin-users/mock-data";

export default function AdminUserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    
    // Simulate initial fetch state using MOCK
    const [user, setUser] = React.useState<AdminUser | undefined>(
        MOCK_ADMINS.find(u => u.id === id)
    );
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [isDeactivating, setIsDeactivating] = React.useState(false);

    if (!user) {
        return (
            <DashboardLayout title="Not Found">
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                    <p className="text-lg font-bold text-slate-900 mb-2">Identity Not Found</p>
                    <p className="text-sm text-slate-500 mb-6 max-w-sm">This administrative account does not exist or has been permanently purged.</p>
                    <Button onClick={() => router.push("/settings/admin-users")} className="rounded-full px-8 shadow-sm">Return to Directory</Button>
                </div>
            </DashboardLayout>
        );
    }

    const isSelf = user.id === CURRENT_USER_ID;
    const isLastSuperAdmin = user.role === "SUPER_ADMIN" && MOCK_ADMINS.filter(a => a.isActive && a.role === "SUPER_ADMIN").length <= 1;
    const canDeactivate = user.isActive && !isSelf && !isLastSuperAdmin;

    const handleUpdate = async (data: any) => {
        setIsUpdating(true);
        await new Promise(r => setTimeout(r, 1500)); // Simulate PATCH
        setUser({ ...user, ...data });
        setIsUpdating(false);
    };

    const handleDeactivate = async () => {
        setIsUpdating(true);
        // Simulate DELETE (Soft Delete mapping to isActive: false)
        await new Promise(r => setTimeout(r, 1000));
        setUser({ ...user, isActive: false });
        setIsUpdating(false);
        setIsDeactivating(false);
    };

    const handleUnlock = async () => {
        setIsUpdating(true);
        // Simulate PATCH /unlock
        await new Promise(r => setTimeout(r, 800));
        setUser({ ...user, isLocked: false });
        setIsUpdating(false);
    };

    return (
        <DashboardLayout 
            title={user.name} 
            subtitle={`Admin ID: ${user.id}`}
            breadcrumbs={[
                { label: "Settings", href: "/settings/my-profile" },
                { label: "Admin Users", href: "/settings/admin-users" },
                { label: "Config", active: true }
            ]}
        >
            <div className="mb-6 max-w-5xl mx-auto">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/settings/admin-users")}
                    className="gap-2 font-semibold px-0 hover:bg-transparent text-slate-500 hover:text-slate-900"
                >
                    <ChevronLeft className="h-4 w-4" /> Back to List
                </Button>
            </div>

            <div className="max-w-5xl mx-auto space-y-6 pb-20">
                
                {/* METADATA STATUS BAR */}
                <Card className="rounded-[1.5rem] border-slate-200/60 shadow-sm overflow-hidden bg-slate-50/50">
                    <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest pl-1">Identified Email Base</div>
                            <div className="text-base font-bold text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 w-fit">
                                {user.email}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {!user.isActive && (
                                <StatusBadge status="Archived" text="Deactivated Account" statusToVariant={{ "Archived": "neutral" }} />
                            )}
                            {user.isLocked && (
                                <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full w-fit">
                                    <ShieldAlert className="h-4 w-4" /> SYSTEM LOCKED
                                </div>
                            )}
                            <span className="text-sm font-medium text-slate-500 hidden md:block">
                                Created on {format(new Date(user.createdAt), "MMMM d, yyyy")}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* SECTION A: CONFIGURATION FORM */}
                <AdminUserForm 
                    initialData={user} 
                    onSubmit={handleUpdate} 
                    isLoading={isUpdating} 
                />
                
                <hr className="border-slate-200 my-8" />

                {/* SECTION B: DANGER ZONE */}
                <div className="space-y-6">
                    <div className="px-1">
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight text-red-600">Danger Zone</h2>
                        <p className="text-sm text-muted-foreground font-medium mt-1">Destructive actions pertaining to system access and security.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* UNLOCK CARD */}
                        <Card className={`rounded-[1.5rem] shadow-sm relative overflow-hidden transition-all ${user.isLocked ? 'border-red-200 bg-red-50/50' : 'border-slate-200/60 bg-slate-50/50 opacity-60'}`}>
                            <CardContent className="p-6 flex flex-col items-start gap-4">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${user.isLocked ? 'bg-red-100 text-red-600' : 'bg-slate-200/50 text-slate-400'}`}>
                                    <KeyRound className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className={`text-sm font-bold mb-1 ${user.isLocked ? 'text-red-900' : 'text-slate-900'}`}>Reset Security Lockout</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                                        If the user has been brute-force locked by the system, this action restores their login capability.
                                    </p>
                                    <Button 
                                        variant="outline"
                                        disabled={!user.isLocked || isUpdating}
                                        onClick={handleUnlock}
                                        className={`rounded-full shadow-sm text-xs font-semibold h-9 ${user.isLocked ? 'border-red-200 text-red-700 bg-white hover:bg-red-100' : ''}`}
                                    >
                                        Unlock Authentication
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* DEACTIVATE CARD */}
                        <Card className="rounded-[1.5rem] border-red-200 shadow-sm bg-red-50/30">
                            <CardContent className="p-6 flex flex-col items-start gap-4">
                                <div className="h-10 w-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                                    <Ban className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-red-900 mb-1">Deactivate Account</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                                        Immediately revokes platform access and nullifies all active sessions. The data record remains intact.
                                    </p>
                                    
                                    {isSelf && <p className="text-[10px] text-red-500 font-bold uppercase mb-2">Notice: You cannot deactivate your own active session.</p>}
                                    {isLastSuperAdmin && !isSelf && <p className="text-[10px] text-red-500 font-bold uppercase mb-2">Notice: Cannot deactivate the final Super Admin.</p>}
                                    {(!user.isActive) && <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Notice: Account is already archived.</p>}

                                    <Button 
                                        variant="destructive"
                                        disabled={!canDeactivate || isUpdating}
                                        onClick={() => setIsDeactivating(true)}
                                        className="rounded-full shadow-sm text-xs font-semibold h-9 bg-red-600 hover:bg-red-700"
                                    >
                                        Deactivate Access
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>

            <CommonAlertDialog
                open={isDeactivating}
                onOpenChange={setIsDeactivating}
                title="Deactivate Authority"
                subtitle={`You are about to revoke system access for ${user.name}. Are you sure you wish to proceed?`}
                variant="error"
                ImageComponent={Image}
                buttons={[
                    { label: "Cancel", onClick: () => setIsDeactivating(false), variant: "outline" },
                    { label: "Confirm Deactivation", onClick: handleDeactivate, variant: "destructive" },
                ]}
            />
        </DashboardLayout>
    );
}
