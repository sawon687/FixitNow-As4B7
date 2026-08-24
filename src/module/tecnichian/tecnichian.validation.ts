import { z } from "zod";
import { BookingStatus } from "../../../generated/prisma/enums";


// ================================
// CREATE TECHNICIAN PROFILE
// ================================

const technicianProfileValidationSchema = z.object({
  body: z.object({


    bio: z
      .string()
      .trim()
      .min(10, "Bio must be at least 10 characters")
      .max(1000, "Bio must not exceed 1000 characters"),

    yearsOfExperience: z
      .number({
        message: "Years of experience must be a number",
      })
      .int("Years of experience must be a whole number")
      .min(0, "Years of experience cannot be negative")
      .max(50, "Years of experience must not exceed 50 years"),

    skills: z
      .array(
        z
          .string()
          .trim()
          .min(1, "Skill cannot be empty")
      )
      .min(1, "At least one skill is required")
      .max(20, "You can add a maximum of 20 skills"),

    location: z
      .string()
      .trim()
      .min(1, "Location is required")
      .max(200, "Location must not exceed 200 characters"),

    profilePhoto: z
      .string()
      .url("Invalid profile photo URL").optional()
      
  }),
});


// ================================
// UPDATE TECHNICIAN PROFILE
// ================================

const updateTechnicianProfileValidationSchema = z.object({
  body: z.object({
    

    bio: z
      .string()
      .trim()
      .min(10, "Bio must be at least 10 characters")
      .max(1000, "Bio must not exceed 1000 characters"),

    yearsOfExperience: z
      .number({
        message: "Years of experience must be a number",
      })
      .int("Years of experience must be a whole number")
      .min(0, "Years of experience cannot be negative")
      .max(50, "Years of experience must not exceed 50 years"),

    skills: z
      .array(
        z
          .string()
          .trim()
          .min(1, "Skill cannot be empty")
      )
      .min(1, "At least one skill is required")
      .max(20, "You can add a maximum of 20 skills"),

    location: z
      .string()
      .trim()
      .min(1, "Location is required")
      .max(200, "Location must not exceed 200 characters"),

    // Image optional
    profilePhoto: z
      .string()
      .url("Invalid profile photo URL").optional()
      
  }),
});


// ================================
// BOOKING STATUS
// ================================

const updateBookingStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(BookingStatus, {
      message:
        "Status must be REQUESTED, ACCEPTED, COMPLETED or CANCELLED",
    }),
  }),
});


// ================================
// EXPORT
// ================================

export const technicianValidation = {
  technicianProfileValidationSchema,
  updateTechnicianProfileValidationSchema,
  updateBookingStatusValidationSchema,
};