import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

export const raiseTicketSchema = z.object({
  bookingId: z.string().optional(),
  vendor: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  ticketType: z.enum(["ride_issue", "billing_issue", "vendor_issue", "compliance_issue", "driver_issue", "system_issue", "other"]),
  priority: z.enum(["low", "medium", "high", "critical"]).optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  attachments: z
    .array(z.instanceof(File))
    .optional()
    .refine(
      (files) => {
        if (!files || files.length === 0) {
          return true;
        }
        return files.every((file) => file.size <= MAX_FILE_SIZE);
      },
      { message: "Each file must be less than 10MB" },
    )
    .refine(
      (files) => {
        if (!files || files.length === 0) {
          return true;
        }
        return files.every((file) => ACCEPTED_FILE_TYPES.includes(file.type));
      },
      { message: "Only JPG, PNG, and PDF files are allowed" },
    ),
});

export type RaiseTicketFormData = z.infer<typeof raiseTicketSchema>;

