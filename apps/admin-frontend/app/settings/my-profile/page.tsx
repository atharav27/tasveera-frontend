"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ProfileForm, AdminProfile } from "@/components/profile/profile-form";

const MOCK_PROFILE: AdminProfile = {
    id: "ADM-99",
    email: "admin@tasveera.in",
    name: "Atharv Kulkarni",
    role: "Super Admin",
    isActive: true,
    createdAt: new Date("2023-11-12").toISOString(),
};

export default function MyProfilePage() {
    const [profile, setProfile] = React.useState<AdminProfile | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        // Simulate GET /api/v1/admin/profile
        setTimeout(() => {
            setProfile(MOCK_PROFILE);
        }, 600);
    }, []);

    const handleUpdate = async (data: any) => {
        setIsLoading(true);
        // Simulate PATCH /api/v1/admin/profile
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Updating Profile:", data);
        
        if (profile && data.name) {
            setProfile({ ...profile, name: data.name });
        }
        
        setIsLoading(false);
        alert("System credentials and identity synchronized.");
    };

    if (!profile) return null;

    return (
        <DashboardLayout 
            title="Account Settings" 
            subtitle="Manage your administrative credentials"
            breadcrumbs={[
                { label: "Settings", href: "/settings/my-profile" },
                { label: "My Profile", active: true }
            ]}
        >
            <div className="max-w-6xl mx-auto py-4">
                <ProfileForm 
                    initialData={profile} 
                    onUpdate={handleUpdate} 
                    isLoading={isLoading} 
                />
            </div>
        </DashboardLayout>
    );
}
