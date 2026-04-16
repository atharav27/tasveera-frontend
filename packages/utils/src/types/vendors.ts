export interface Vendor {
  id: string;
  name: string;
  type: string;
  contactEmail: string;
  contactPhone: string;
  slaScore: number;
  totalTrips: number;
  status: "active" | "inactive";
  createdAt: string;
}

export interface VendorPerformance {
  vendorId: string;
  period: string;
  slaScore: number;
  totalTrips: number;
  onTimeDelivery: number;
  customerRating: number;
}

export interface VendorSLA {
  vendorId: string;
  metric: string;
  target: number;
  actual: number;
  status: "met" | "below" | "exceeded";
}

export interface VendorTableData extends Vendor {
  operatingRegions: Array<{ city: string; state: string; code: string }>;
  complianceStatus: "Active" | "Warning";
}

export interface VendorDocument {
  name: string;
  status: "Valid" | "Expired" | "Pending";
  expiryDate: string;
  downloadUrl?: string;
}

export interface VendorSLABreakdown {
  onTimeReporting: number;
  tripCompletionRate: number;
  invoiceAccuracy: number;
  noShowCancellation: number;
}

export interface VendorDetail extends VendorTableData {
  contactPersonName: string;
  verifiedSince: string;
  slaBreakdown: VendorSLABreakdown;
  documents: VendorDocument[];
}

export interface VendorBooking {
  bookingId: string;
  passenger: string;
  tripType: string;
  pickupLocation: string;
  dropoffLocation: string;
  vehicleDetails: string;
  schedule: string;
  status: string;
}
