import { z } from "zod";

const createReviewValidationSchema = z.object({
  body: z.object({
    bookingId: z
      .string()
      .uuid("Booking ID must be a valid UUID"),

    rating: z
      .number({
        message: "Rating must be a number",
      })
      .min(1, "Rating must be at least 1")
      .max(5, "Rating must not exceed 5"),

    comment: z
      .string()
      .trim()
      .min(1, "Comment is required")
      .min(10, "Comment must be at least 10 characters")
      .max(1000, "Comment must not exceed 1000 characters"),
  }),
});

export const reviewValidation = {
  createReviewValidationSchema,
};