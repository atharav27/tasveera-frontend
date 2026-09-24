import { z } from "zod";

export const editBookingSchema = z
  .object({
    tripType: z.string().min(1, "Trip Type is required"),
    vendor: z.string().min(1, "Vendor is required"),
    vehicleClass: z.string().min(1, "Vehicle Class is required"),
    package: z.string().min(1, "Package is required"),
    passengerType: z.string().min(1, "Passenger Type is required"),
    employeeId: z.string().optional(),
    pickupLocation: z.string().min(1, "Pickup Location is required"),
    dropoffLocation: z.string().min(1, "Drop-off Location is required"),
    date: z.date({ error: "Date is required" }),
    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:mm format"),
    specialInstructions: z.string().optional(),
  })
  .refine((data) => data.passengerType !== "Employee" || data.employeeId, {
    message: "Employee ID is required when Passenger Type is Employee",
    path: ["employeeId"],
  });

export type EditBookingFormData = z.infer<typeof editBookingSchema>;

