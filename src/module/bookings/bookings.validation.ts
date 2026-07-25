import { z } from "zod";

const createBookingValidationSchema = z.object({
  body: z.object({
    technicianId: z
      .string()
      .uuid("Technician ID must be a valid UUID"),

    serviceId: z
      .string()
      .uuid("Service ID must be a valid UUID"),

    scheduledDate: z
      .string()
      .datetime("Scheduled date must be a valid ISO date"),

    address: z
      .string()
      .trim()
      .min(1, "Address is required")
      .min(5, "Address must be at least 5 characters")
      .max(255, "Address must not exceed 255 characters"),

    totalAmount: z
      .number({
        error: "Total amount must be a number",
      
      }).min(1, "totalAmount is required") 
      .positive("Total amount must be greater than 0"),
  }),
});

export const bookingValidation = {
  createBookingValidationSchema,
};