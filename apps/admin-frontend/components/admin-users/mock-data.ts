export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'DESIGNER' | 'SUPPORT';

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: AdminRole;
    isActive: boolean;
    isLocked: boolean; // Simulating brute-force lockout states
    createdAt: string;
}

export const MOCK_ADMINS: AdminUser[] = [
    {
        id: "ADM-001", // Simulated logged in user
        name: "Atharv Kulkarni",
        email: "admin@tasveera.in",
        role: "SUPER_ADMIN",
        isActive: true,
        isLocked: false,
        createdAt: new Date("2023-11-12T10:00:00Z").toISOString(),
    },
    {
        id: "ADM-002",
        name: "Riya Desai",
        email: "riya.design@tasveera.in",
        role: "DESIGNER",
        isActive: true,
        isLocked: false,
        createdAt: new Date("2024-01-15T09:30:00Z").toISOString(),
    },
    {
        id: "ADM-003",
        name: "Amit Patel",
        email: "amit.mgmt@tasveera.in",
        role: "ADMIN",
        isActive: true,
        isLocked: true, // Currently locked out
        createdAt: new Date("2024-02-01T14:20:00Z").toISOString(),
    },
    {
        id: "ADM-004",
        name: "Pooja Sharma",
        email: "pooja.support@tasveera.in",
        role: "SUPPORT",
        isActive: false, // Deactivated account
        isLocked: false,
        createdAt: new Date("2024-03-10T11:15:00Z").toISOString(),
    }
];

export const CURRENT_USER_ID = "ADM-001";
