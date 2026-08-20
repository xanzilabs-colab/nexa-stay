import { z } from "zod";

export const bookingSchema = z.object({
  propertyId: z.string().min(1), firstName: z.string().min(2).max(80), lastName: z.string().min(2).max(80),
  email: z.email(), phone: z.string().min(7).max(30), whatsapp: z.string().min(7).max(30),
  checkIn: z.coerce.date(), checkOut: z.coerce.date(), guests: z.coerce.number().int().positive().max(30),
  contactPreference: z.enum(["phone", "email", "whatsapp"]), message: z.string().max(1000).optional(),
}).refine((data) => data.checkOut > data.checkIn, { message: "Check-out must be after check-in.", path: ["checkOut"] }).refine((data) => (data.checkOut.getTime() - data.checkIn.getTime()) / 86_400_000 <= 5, { message: "Enquiries are limited to stays of up to 5 nights.", path: ["checkOut"] });