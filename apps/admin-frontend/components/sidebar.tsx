"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { DashboardSidebar, type SidebarNavItem } from "@corpora/ui";
import { useAuthStore } from "@corpora/utils";
import { signOut, useSession } from "@/lib/auth-client";

interface SidebarProps {
    className?: string;
    navItems: SidebarNavItem[];
}

export function Sidebar({ className, navItems }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, setUser } = useAuthStore();
    const { data: session } = useSession();
    const [isLoggingOut, setIsLoggingOut] = React.useState(false);

    React.useEffect(() => {
        if (session?.user) {
            setUser({
                name: session.user.name,
                email: session.user.email,
                image: session.user.image,
            });
        }
    }, [session, setUser]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    useAuthStore.getState().clearUser();
                    router.push("/login");
                },
            },
        });
        setIsLoggingOut(false);
    };

    return (
        <DashboardSidebar
            className={className}
            navItems={navItems}
            currentPath={pathname}
            user={user}
            logoSrc="/logo.png"
            onLogout={handleLogout}
            isLoggingOut={isLoggingOut}
            LinkComponent={Link}
            ImageComponent={Image}
        />
    );
}

// Re-export the type for convenience
export type { SidebarNavItem };
