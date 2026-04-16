import type {
  CompanySettings,
  NotificationPreferencesData,
  ProfileAccountData,
  TravelPolicy,
  UserSettings,
} from "@/types/settings";

export interface SettingsCategory {
  id: string;
  title: string;
  description: string;
  defaultExpanded: boolean;
}

export const settingsCategories: SettingsCategory[] = [
  {
    id: "profile-account",
    title: "Profile & Account",
    description: "Your personal & corporate information",
    defaultExpanded: true,
  },
  {
    id: "notification-preferences",
    title: "Notification Preferences",
    description: "Choose how you receive system alerts & notifications",
    defaultExpanded: false,
  },
  {
    id: "change-password",
    title: "Change Password",
    description: "Update your account password",
    defaultExpanded: false,
  },
  {
    id: "travel-policy",
    title: "Travel Policy",
    description: "Access current policy documents and track version updates.",
    defaultExpanded: false,
  },
];

export const mockUserSettings: UserSettings = {
  userId: "1",
  theme: "light",
  language: "en",
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
  preferences: {
    dateFormat: "MM/DD/YYYY",
    timezone: "UTC",
    currency: "USD",
  },
};

export const mockCompanySettings: CompanySettings = {
  companyId: "1",
  name: "Corpora Inc.",
  address: "123 Business St, City, State 12345",
  contactEmail: "contact@corpora.com",
  contactPhone: "+1-555-0100",
  taxId: "TAX-123456",
  settings: {
    allowSelfBooking: true,
    requireApproval: true,
    maxBookingDays: 30,
  },
};

export const mockProfileAccountData: ProfileAccountData = {
  companyName: "Infotech Pvt. Ltd.",
  gstin: "29AADCB2230M1ZP",
  pan: "AADCB2230M",
  registeredAddress: "123 Fleet Street, Koramangala, Bangalore - 560034",
  contactPerson: "Cyan Nathan",
  employeeId: "EMP-2024-1234",
  department: "Operations",
  corporateEmail: "cyan.nathan@corpora.com",
  phoneNumber: "+91 98765 43210",
  bankName: "HDFC Bank",
  accountNumber: "****4567",
  ifscCode: "HDFC0001234",
};

export const mockNotificationPreferencesData: NotificationPreferencesData = {
  bookingConfirmations: true,
  invoiceReady: true,
  paymentReminders: true,
  supportUpdates: true,
};

export const mockTravelPolicies: TravelPolicy[] = [
  {
    id: "1",
    policyName: "Corporate Travel Policy",
    version: "v2.1",
    effectiveDate: "2025-03-25",
    lastUpdated: "2025-03-25",
    status: "Active",
  },
  {
    id: "2",
    policyName: "Expense Reimbursement Guidelines",
    version: "v1.3",
    effectiveDate: "2025-03-25",
    lastUpdated: "2025-05-20",
    status: "Active",
  },
  {
    id: "3",
    policyName: "International Travel Protocol",
    version: "v1.0",
    effectiveDate: "2025-03-25",
    lastUpdated: "2025-06-02",
    status: "Expired",
  },
];
