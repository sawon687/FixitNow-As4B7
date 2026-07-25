import { z } from "zod";

const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(1, "Category name is required")
      .min(2, "Category name must be at least 2 characters")
      .max(100, "Category name must not exceed 100 characters"),

    description: z
      .string()
      .trim()
      .min(1, "Description is required")
      .min(10, "Description must be at least 10 characters")
      .max(500, "Description must not exceed 500 characters"),
  }),
});

export const categoryValidation = {
  createCategoryValidationSchema,
};