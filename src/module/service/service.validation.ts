import { z } from "zod";

const createServiceValidationSchema = z.object({
  body: z.object({
    categoryId: z
      .string()
      .uuid("Category ID must be a valid UUID"),

    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title must not exceed 100 characters"),

    description: z
      .string()
      .trim()
      .min(1, "Description is required")
      .min(10, "Description must be at least 10 characters")
      .max(1000, "Description must not exceed 1000 characters"),

    price: z
      .number({
        message: "Price must be a number",
      })
      .positive("Price must be greater than 0"),

    priceType: z
      .string()
      .trim()
      .min(1, "Price type is required"),

    location: z
      .string()
      .trim()
      .min(1, "Location is required")
      .max(200, "Location must not exceed 200 characters"),
  }),
});

export const serviceValidation = {
  createServiceValidationSchema,
};