import { z } from "zod";

export const editTicketSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  vendor: z.string().min(1, "Vendor is required"),
  ticketType: z.string().min(1, "Ticket Type is required"),
  description: z.string().min(1, "Description is required"),
  attachments: z.array(z.instanceof(File)).optional(),
});

export type EditTicketFormData = z.infer<typeof editTicketSchema>;

