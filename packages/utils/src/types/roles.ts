/**
 * Role Management Types
 */

export type UserStatus = "Active" | "Suspended" | "Inactive";

export type UserRole =
    | "Corporate Admin"
    | "Travel Desk"
    | "Accounts"
    | "Manager"
    | "Employee";

export interface CorporateUser {
    id: string;
    name: string;
    employeeId: string;
    email: string;
    role: UserRole;
    roleIcon?: string;
    department: string;
    lastLogin: string;
    status: UserStatus;
    createdAt?: string;
    updatedAt?: string;
}

export interface RoleStats {
    vendorsOnboarded: number;
    usersOnboarded: number;
    activeUsers: number;
    usersSuspended: number;
    comparison: {
        vendorsOnboarded: { change: number; percentage: number };
        usersOnboarded: { change: number; percentage: number };
        activeUsers: { change: number; percentage: number };
        usersSuspended: { change: number; percentage: number };
    };
}

export interface ActivityLog {
    id: string;
    userId: string;
    userName: string;
    employeeId: string;
    role: UserRole;
    action: string;
    timestamp: string;
    ipAddress: string;
    status: "Success" | "Failed" | "Pending";
}

export interface UsersQueryParams {
    page?: number;
    pageSize?: number;
    search?: string;
    department?: string;
    role?: UserRole;
    status?: UserStatus;
}

export interface UserActivity {
    id: string;
    action: string;
    timestamp: string;
    ipAddress: string;
    category: string;
}

export interface UserDetail extends CorporateUser {
    recentActivity: UserActivity[];
}
