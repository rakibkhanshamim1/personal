import { z } from "zod";

export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

/** Accepts an id, an empty string or null — all meaning "no relation". */
export const optionalObjectId = z
  .union([objectIdSchema, z.literal(""), z.null()])
  .optional()
  .transform((value) => (value ? value : null));

export const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(96, "Slug is too long")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers and single hyphens",
  );

/** Empty string is a valid "cleared" value for every optional URL field. */
export const optionalUrl = z
  .union([z.url("Enter a valid URL"), z.literal("")])
  .optional()
  .transform((value) => value ?? "");

/** HTML date inputs submit "" when cleared, so null must round-trip. */
export const optionalDate = z
  .union([z.string().trim(), z.null()])
  .optional()
  .transform((value, ctx) => {
    if (value === null || value === undefined || value === "") return null;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      ctx.addIssue({ code: "custom", message: "Enter a valid date" });
      return null;
    }
    return parsed;
  });

export const requiredDate = z
  .string()
  .trim()
  .min(1, "Date is required")
  .transform((value, ctx) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      ctx.addIssue({ code: "custom", message: "Enter a valid date" });
      return new Date();
    }
    return parsed;
  });

export const stringArraySchema = z
  .array(z.string().trim().min(1))
  .default([])
  .transform((values) => Array.from(new Set(values)));

export const seoSchema = z
  .object({
    seoTitle: z.string().trim().max(70, "Keep SEO titles under 70 characters").default(""),
    seoDescription: z
      .string()
      .trim()
      .max(180, "Keep SEO descriptions under 180 characters")
      .default(""),
    seoImage: z.string().trim().default(""),
  })
  .default({ seoTitle: "", seoDescription: "", seoImage: "" });

export const publishStatusSchema = z.enum(["draft", "published"]);

/** Shared list query for every admin table and public listing. */
export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  search: z.string().trim().max(120).optional(),
  category: z.string().trim().optional(),
  tag: z.string().trim().optional(),
  tech: z.string().trim().optional(),
  status: z.enum(["draft", "published", "all"]).optional(),
  featured: z.enum(["true", "false"]).optional(),
  sort: z.string().trim().max(40).optional(),
});

export type ListQuery = z.infer<typeof listQuerySchema>;

export const bulkIdsSchema = z.object({
  ids: z.array(objectIdSchema).min(1, "Select at least one item"),
});
