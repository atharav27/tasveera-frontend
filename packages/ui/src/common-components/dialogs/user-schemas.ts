import { z } from "zod";

export const addUserSchema = z.object({
  role: z.enum(["Admin", "Travel Desk", "Accounts"]),
  fullName: z.string().min(1, "Full name is required").min(2, "Full name must be at least 2 characters"),
  contactNumber: z
    .string()
    .min(1, "Contact number is required")
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, "Invalid phone number format"),
  companyEmailId: z.string().min(1, "Company email is required").email("Invalid email format"),
  departmentId: z.string().min(1, "Department is required"),
});

export type AddUserFormData = z.infer<typeof addUserSchema>;

export const editUserSchema = z.object({
  fullName: z.string().min(1, "Full name is required").min(2, "Full name must be at least 2 characters"),
  contactNumber: z
    .string()
    .min(1, "Contact number is required")
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, "Invalid phone number format"),
  companyEmailId: z.string().min(1, "Company email is required").email("Invalid email format"),
  department: z.string().min(1, "Department is required"),
});

export type EditUserFormData = z.infer<typeof editUserSchema>;
