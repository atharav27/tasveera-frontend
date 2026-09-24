import { z } from "zod";

export const createBookingSchema = z.object({
  rideType: z.enum(['local', 'outstation', 'package']),
  vehicleClass: z.string().min(1, "Vehicle class is required"),
  scheduledPickupTime: z.date().min(new Date(1900, 0, 1), "Pickup time is required"),
  pickupAddress: z.string().min(5, "Address must be at least 5 characters"),
  pickupLocation: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
  pickupLandmark: z.string().optional(),
  dropAddress: z.string().optional(),
  dropLocation: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
  dropLandmark: z.string().optional(),
  passengerType: z.enum(['employee', 'guest', 'vip']),
  passengerName: z.string().min(2, "Name is required"),
  passengerPhone: z.string().min(10, "Phone must be at least 10 digits").max(15),
  passengerEmail: z.string().email().optional().or(z.literal("")),
  employeeId: z.string().optional(),
  passengerGender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']),
  governmentId: z.string().optional(),
  governmentIdType: z.enum(['aadhaar', 'pan', 'voter_id', 'driving_license', 'passport']),
  tagIds: z.array(z.string()).optional(),
  rateCatalogId: z.string().optional(),
  specialInstructions: z.string().optional(),
});

export type CreateBookingFormData = z.infer<typeof createBookingSchema>;

