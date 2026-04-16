export type DriverStatus = 'pending_verification' | 'active' | 'suspended' | 'blacklisted';
export type DriverOnlineStatus = 'online' | 'offline' | 'busy';
export type DocumentStatus = 'pending_upload' | 'pending_verification' | 'verified' | 'rejected' | 'expired';

export interface DriverStatMetric {
    count: number;
    change: number;
    changeDirection: 'up' | 'down' | 'neutral';
}

export interface DriverStatsData {
    totalDrivers: DriverStatMetric;
    activeDrivers: DriverStatMetric;
    suspendedDrivers: DriverStatMetric;
    pendingVerification: DriverStatMetric;
}

export interface DriverStatsResponse {
    success: boolean;
    data: DriverStatsData;
}

export interface DriverListItem {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    licenseNumber: string;
    status: DriverStatus;
    driverStatus: DriverOnlineStatus;
    isVerified: boolean;
    rating: string;
    currentVehicle: {
        id: string;
        registrationNumber: string;
    } | null;
    docsStatus: 'verified' | 'pending' | 'expired';
    verifiedAt: string;
}

export interface DriverListResponse {
    success: boolean;
    data: DriverListItem[];
    meta: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}

export interface CreateDriverPayload {
    firstName: string;
    lastName?: string;
    email?: string;
    phone: string;
    licenseNumber: string;
    licenseExpiry: string;
    dateOfBirth?: string;
    aadhaarNumber?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
}

export interface DriverDocument {
    id: string;
    documentType: string;
    status: DocumentStatus;
    expiresAt: string;
    verifiedAt: string | null;
}

export interface DriverDetail {
    id: string;
    vendorId: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    licenseNumber: string;
    licenseType: string;
    licenseExpiry: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    status: DriverStatus;
    driverStatus: DriverOnlineStatus;
    isVerified: boolean;
    verifiedAt: string;
    rating: string;
    totalRides: number;
    completedRides: number;
    onTimeArrivalRate: number;
    noShowCount: number;
    emergencyContactName: string;
    emergencyContactPhone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    currentVehicle: {
        id: string;
        registrationNumber: string;
    } | null;
    documents: DriverDocument[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateDriverResponse {
    success: boolean;
    data: DriverDetail;
    message: string;
}

export interface DriverDetailResponse {
    success: boolean;
    data: DriverDetail;
}

export interface UpdateDriverPayload extends Partial<CreateDriverPayload> {
    alternatePhone?: string;
    postalCode?: string;
    state?: string;
}

export interface AssignVehiclePayload {
    vehicleId: string;
    vendorId: string;
    shiftStart?: string;
    shiftEnd?: string;
}

export interface AssignVehicleResponse {
    success: boolean;
    message?: string;
}
