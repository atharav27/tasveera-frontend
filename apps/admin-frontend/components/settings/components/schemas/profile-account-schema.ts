import { z } from "zod";

export const profileAccountSchema = z.object({
  // Company Details
  companyName: z.string().min(1, "Company name is required"),
  gstin: z.string().min(1, "GSTIN is required"),
  pan: z.string().min(1, "PAN is required"),
  registeredAddress: z.string().min(1, "Registered address is required"),

  // Contact Information
  contactPerson: z.string().min(1, "Contact person is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
  department: z.string().min(1, "Department is required"),
  corporateEmail: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),

  // Bank Details
  bankName: z.string().min(1, "Bank name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  ifscCode: z.string().min(1, "IFSC code is required"),
});

export type ProfileAccountFormData = z.infer<typeof profileAccountSchema>;

