export type VehicleClass =
    | 'hatchback'
    | 'sedan'
    | 'sedan_premium'
    | 'suv'
    | 'suv_premium'
    | 'muv'
    | 'tempo_traveller_12'
    | 'tempo_traveller_17'
    | 'tempo_traveller_26'
    | 'mini_bus'
    | 'bus_35'
    | 'bus_45'
    | 'luxury';

export type BookingStatus =
    | 'draft'
    | 'requested'
    | 'awaiting_vendor'
    | 'vendor_assigned'
    | 'vendor_accepted'
    | 'vendor_rejected'
    | 'driver_assigned'
    | 'confirmed'
    | 'en_route_pickup'
    | 'arrived_pickup'
    | 'otp_start_verified'
    | 'ongoing'
    | 'otp_end_verified'
    | 'completed'
    | 'cancelled'
    | 'no_show_guest'
    | 'no_show_driver'
    | 'exception';

export type RideType = 'local' | 'outstation' | 'package';

// Request Query
export interface ListBookingsQuery {
    status?: BookingStatus;
    fromDate?: string;    // ISO 8601
    toDate?: string;      // ISO 8601
    vendorId?: string;    // UUID
    departmentId?: string; // UUID
    page?: number;
    pageSize?: number;
    includePassengers?: boolean;
    includeVendor?: boolean;
    includeFare?: boolean;
    includeDepartment?: boolean;
    includeTags?: boolean;
}

// Base Booking Response
export interface BookingResponse {
    id: string;
    bookingNumber: string;
    status: BookingStatus;
    rideType: RideType;
    vehicleClass: VehicleClass;
    scheduledPickupTime: string;
    pickupAddress: string;
    pickupLandmark: string | null;
    dropAddress: string | null;
    dropLandmark: string | null;
    startOtp: string | null;
    endOtp: string | null;
    isFallbackVendor: boolean;
    slaBreached: boolean;
    specialInstructions: string | null;
    createdAt: string;
    updatedAt: string;
}

// Enriched Booking (when include flags are true)
export interface EnrichedBookingItem extends BookingResponse {
    passengerSummary?: {
        primaryPassenger: string;
        additionalCount: number;
        totalCount: number;
    };
    vendor?: {
        id: string;
        name: string;
        code: string;
        status: string;
    };
    fare?: {
        totalAmount: string | null;
        currency: string;
        isCalculated: boolean;
    };
}

// Pagination Meta
export interface PaginationMeta {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

// Full Response
export interface BookingListResponse {
    success: true;
    data: EnrichedBookingItem[];
    meta: PaginationMeta;
}

export interface BookingDetail extends BookingResponse {
    corporateId: string;
    departmentId: string;
    vendorId: string | null;
    driverId: string | null;
    vehicleId: string | null;
    pickupLocation: {
        latitude: number;
        longitude: number;
    };
    dropLocation?: {
        latitude: number;
        longitude: number;
    };
    pickupCity?: string;
    costCenterCode: string | null;
    actualDistanceKm: number | null;
    actualDurationMinutes: number | null;
    waitingTimeMinutes: number | null;
    tagIds?: string[];
    vendor?: {
        id: string;
        name: string;
        code: string;
        phone?: string;
        status?: string;
    };
    driver?: {
        id: string;
        firstName: string;
        lastName: string;
        phone: string;
        rating: number;
    };
    vehicle?: {
        id: string;
        registrationNumber: string;
        vehicleClass: VehicleClass;
        make: string;
        model: string;
    };
    passengers: {
        id: string;
        name: string;
        phone: string;
        email?: string;
        passengerType: string;
        employeeId?: string;
        gender: string;
        rating?: number;
        feedback?: string;
        governmentId?: string;
        governmentIdType?: string;
    }[];
    statusHistory: {
        fromStatus: BookingStatus;
        toStatus: BookingStatus;
        changedAt: string;
        changedBy: string;
        notes: string | null;
    }[];
    fare?: {
        baseFare: number;
        extraKmFare: number;
        extraHourFare: number;
        tollCharges: number;
        parkingCharges: number;
        totalAmount: number;
        currency: string;
    };
}

export interface BookingDetailResponse {
    success: true;
    data: BookingDetail;
}

export type Booking = EnrichedBookingItem;

// --- Vendor Specific Booking Types ---

export interface VendorBookingStatMetric {
    value: number;
    change: number;
    changeDirection: 'up' | 'down' | 'neutral';
}

export interface VendorBookingStatsData {
    completedTrips: VendorBookingStatMetric;
    activeTrips: VendorBookingStatMetric;
    upcomingTrips: VendorBookingStatMetric;
    pendingRequests: VendorBookingStatMetric;
}

export interface VendorBookingStatsResponse {
    success: boolean;
    data: VendorBookingStatsData;
}

export interface VendorBookingItem {
    bookingId: string;
    bookingNumber: string;
    corporate: {
        id: string;
        name: string;
    };
    route: {
        pickup: string;
        drop: string | null;
    };
    package: {
        id: string;
        name: string;
    } | null;
    schedule: {
        date: string;
        time: string;
    };
    estimatedFare: {
        amount: string | null;
        currency: string;
    };
    status: string;
}

export interface VendorBookingsData {
    bookings: VendorBookingItem[];
    total: number;
    page: number;
    pageSize: number;
}

export interface VendorBookingsResponse {
    success: boolean;
    data: VendorBookingsData;
}

export interface ListVendorBookingsQuery {
    search?: string;
    corporateIds?: string[];
    packageIds?: string[];
    statuses?: string[];
    tab?: 'requests' | 'upcoming' | 'completed';
    fromDate?: string;
    toDate?: string;
    page?: number;
    pageSize?: number;
}

// --- Assign Driver Types ---

export interface AssignDriverPayload {
    driverId: string;
    skipGenderValidation?: boolean;
    vehicleId?: string;
}

export interface AssignDriverResponse {
    success: boolean;
    message?: string;
    data: {
        booking: {
            id: string;
            bookingNumber: string;
            status: string;
            driverId: string;
            vehicleId: string;
            assignedAt: string;
        };
        driver: {
            id: string;
            firstName: string;
            lastName: string;
            phone: string;
            rating: string;
        };
        vehicle: {
            id: string;
            registrationNumber: string;
            vehicleClass: VehicleClass;
        };
    };
}
