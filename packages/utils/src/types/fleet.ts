export type VehicleComplianceStatus = 'verified' | 'expiring' | 'pending';
export type VehicleStatus = 'active' | 'suspended' | 'inactive';

export interface FleetStatMetric {
    value: number;
    change: number;
    changeDirection: 'up' | 'down' | 'neutral';
}

export interface FleetStatsData {
    totalVehicles: FleetStatMetric;
    activeVehicles: FleetStatMetric;
    expiringSoon: FleetStatMetric;
    suspended: FleetStatMetric;
}

export interface FleetStatsResponse {
    success: boolean;
    data: FleetStatsData;
}

export interface VehicleListItem {
    id: string;
    vehicleId: string;
    type: string;
    plate: string;
    seating: number;
    fuel: string;
    assignedDriver: string | null;
    compliance: VehicleComplianceStatus;
    status: VehicleStatus;
    lastVerification: string;
}

export interface VehicleListResponse {
    success: boolean;
    data: VehicleListItem[];
    meta: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}

export interface CreateVehiclePayload {
    plate: string;
    type: string;
    fuel: string;
    seating: number;
    vendorId: string;
    year?: string;
    color?: string;
}

export interface VehicleDocument {
    fileName: string;
    expiresDate?: string;
    status: VehicleComplianceStatus;
}

export interface VehicleRecentTrip {
    company: string;
    route: string;
    distance: string;
    date: string;
}

export interface VehicleDetail {
    id: string;
    vehicleId: string;
    makeModel: string;
    plate: string;
    status: VehicleStatus;
    type: string;
    year: string;
    seating: number;
    fuel: string;
    color: string;
    documents: VehicleDocument[];
    recentTrips: VehicleRecentTrip[];
}

export interface VehicleDetailResponse {
    success: boolean;
    data: VehicleDetail;
}

export interface UpdateVehiclePayload extends Partial<CreateVehiclePayload> {
    status?: VehicleStatus;
}

export interface AssignDriverToVehiclePayload {
    vehicleId: string;
    vendorId: string;
    shiftStart?: string;
    shiftEnd?: string;
}
