export interface UserSettings {
  userId: string;
  theme: "light" | "dark" | "system";
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  preferences: {
    dateFormat: string;
    timezone: string;
    currency: string;
  };
}

export interface CompanySettings {
  companyId: string;
  name: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  taxId: string;
  logo?: string;
  settings: {
    allowSelfBooking: boolean;
    requireApproval: boolean;
    maxBookingDays: number;
  };
}

export interface ProfileAccountData {
  companyName: string;
  gstin: string;
  pan: string;
  registeredAddress: string;
  contactPerson: string;
  employeeId: string;
  department: string;
  corporateEmail: string;
  phoneNumber: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}

export interface NotificationPreferencesData {
  bookingConfirmations: boolean;
  invoiceReady: boolean;
  paymentReminders: boolean;
  supportUpdates: boolean;
}

export interface TravelPolicy {
  id: string;
  policyName: string;
  version: string;
  effectiveDate: string;
  lastUpdated: string;
  status: "Active" | "Expired";
}
