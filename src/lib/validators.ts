import { z } from "zod";

// ─── AUTH ────────────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .max(15)
    .regex(/^[+]?[\d\s-]+$/, "Invalid phone number"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72)
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ─── VEHICLE ────────────────────────────────────────────────────────────────────

export const vehicleSchema = z.object({
  make: z.string().min(1, "Make is required").max(50),
  model: z.string().min(1, "Model is required").max(50),
  year: z.coerce
    .number()
    .int()
    .min(1990, "Year must be 1990 or later")
    .max(new Date().getFullYear() + 1),
  color: z.string().max(30).optional(),
  plateNumber: z.string().max(20).optional(),
  vehicleType: z.enum(["hatchback", "sedan", "compact_suv", "suv", "luxury", "bike"]),
});

// ─── BOOKING ────────────────────────────────────────────────────────────────────

export const bookingSchema = z.object({
  serviceId: z.string().min(1, "Service is required"),
  vehicle: vehicleSchema,
  date: z.string().min(1, "Date is required"),
  timeSlot: z.string().min(1, "Time slot is required"),
  needsPickup: z.boolean(),
  pickup: z
    .object({
      address: z.string().min(5, "Address is required"),
      city: z.string().min(2, "City is required"),
      pincode: z
        .string()
        .length(6, "Pincode must be 6 digits")
        .regex(/^\d+$/, "Invalid pincode"),
    })
    .optional(),
  notes: z.string().max(500).optional(),
});

// ─── CONTACT ────────────────────────────────────────────────────────────────────

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Invalid email"),
  phone: z
    .string()
    .max(20)
    .optional()
    .or(z.literal("")),
  subject: z.string().min(2, "Subject is required").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VehicleInput = z.infer<typeof vehicleSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
