export type InvoiceStatus = 'pending' | 'approved' | 'paid' | 'overdue' | 'rejected' | 'draft';

export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';

export interface BillingStatMetric {
    value: number;
    amount: string;
    change: number;
    changeDirection: 'up' | 'down' | 'neutral';
}

export interface BillingStatsData {
    pendingInvoices: BillingStatMetric;
    approvedInvoices: BillingStatMetric;
    paidInvoices: BillingStatMetric;
    overdueInvoices: BillingStatMetric;
}

export interface BillingStatsResponse {
    success: boolean;
    data: BillingStatsData;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    vendor: string;
    amount: number;
    tax: number;
    total: number;
    status: string;
    issuedDate: string;
    dueDate: string;
    paidDate?: string;
}

// --- Corporate Billing Types ---

/**
 * Basic billing period summary (used for overview cards)
 */
export interface BillingPeriodSummary {
  startDate: string;
  endDate: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
}

/**
 * Billing period with full invoice details (used in tables)
 */
export interface BillingPeriod {
  id: string;
  periodLabel: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  vendorId: string;
  vendorName: string;
  invoiceNumber: string;
  totalRides: number;
  totalAmount: string;
  status: string;
}

export interface BillingPeriodItem {
  id: string;
  periodLabel: string;
  vendorName: string;
  invoiceId: string;
  tripId: string;
  totalAmount: number;
  paymentStatus: string;
}

export interface InvoiceBreakdownItem {
  id: string;
  invoiceId: string;
  vendorName: string;
  tripIds: string[];
  totalAmount: number;
  dueDate: string;
  paymentStatus: string;
}

/**
 * Invoice line item representing a single trip (corporate billing)
 */
export interface TripInvoiceLineItem {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  tripId: string;
  tripNumber: string;
  vendorId: string;
  vendorName: string;
  tripAmount: string;
  dueDate: string;
  status: string;
}

/**
 * Billing status to badge variant mapping
 */
export const billingStatusToVariant: Record<string, string> = {
  pending: "amber",
  approved: "primary",
  paid: "green",
  overdue: "red",
  sent: "primary",
  disputed: "red",
};

/**
 * Invoice status to badge variant mapping
 */
export const invoiceStatusToVariant: Record<string, string> = {
  draft: "neutral",
  sent: "primary",
  paid: "green",
  overdue: "red",
  cancelled: "red",
};

// --- Vendor Billing Types ---

export interface VendorInvoiceListItem {
    id: string;
    invoiceNumber: string;
    corporate: {
        id: string;
        name: string;
    };
    billingPeriod: {
        start: string;
        end: string;
    };
    totalAmount: string;
    taxAmount: string;
    status: InvoiceStatus;
    dueDate: string;
    createdAt: string;
}

export interface VendorInvoicesResponse {
    success: boolean;
    data: VendorInvoiceListItem[];
    meta: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}

export interface InvoiceLineItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: string;
    amount: string;
    taxAmount: string;
    totalAmount: string;
}

export interface InvoiceDetails {
    id: string;
    invoiceNumber: string;
    status: InvoiceStatus;
    vendorId: string;
    corporateId: string;
    billingPeriodStart: string;
    billingPeriodEnd: string;
    subtotal: string;
    taxTotal: string;
    totalAmount: string;
    dueDate: string;
    notes?: string;
    lineItems: InvoiceLineItem[];
    createdAt: string;
    updatedAt: string;
}

export interface InvoiceDetailsResponse {
    success: boolean;
    data: InvoiceDetails;
}

export interface CreateInvoicePayload {
    corporateId: string;
    billingPeriodStart: string;
    billingPeriodEnd: string;
    dueDate: string;
    notes?: string;
    items: {
        description: string;
        quantity: number;
        unitPrice: string;
    }[];
}

export interface CreateInvoiceResponse {
    success: boolean;
    data: InvoiceDetails;
    message: string;
}

export interface DeleteInvoiceResponse {
    success: boolean;
    message: string;
}
