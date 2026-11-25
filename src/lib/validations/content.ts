import { z } from "zod";
import {
  optionalDate,
  optionalObjectId,
  optionalUrl,
  publishStatusSchema,
  seoSchema,
  slugSchema,
  stringArraySchema,
} from "./common";

/* -------------------------------------------------------------------------- */
/* Projects                                                                   */
/* -------------------------------------------------------------------------- */

export const projectSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(160),
  slug: slugSchema,
  summary: z
    .string()
    .trim()
    .min(10, "Write at least a short summary")
    .max(300, "Keep the summary under 300 characters"),
  description: z.string().default(""),
  coverImage: z.string().trim().default(""),
  gallery: z.array(z.string().trim()).default([]),
  technologies: stringArraySchema,
  category: optionalObjectId,
  liveUrl: optionalUrl,
  sourceUrl: optionalUrl,
  projectStatus: z.enum(["completed", "in-progress", "planned"]).default("completed"),
  status: publishStatusSchema.default("draft"),
  featured: z.boolean().default(false),
  startDate: optionalDate,
  completedDate: optionalDate,
  order: z.coerce.number().int().default(0),
  seo: seoSchema,
});

export type ProjectInput = z.infer<typeof projectSchema>;
export const projectUpdateSchema = projectSchema.partial();

/* -------------------------------------------------------------------------- */
/* Blog posts                                                                 */
/* -------------------------------------------------------------------------- */

export const blogPostSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(180),
  slug: slugSchema,
  excerpt: z.string().trim().max(320, "Keep the excerpt under 320 characters").default(""),
  content: z.string().default(""),
  coverImage: z.string().trim().default(""),
  category: optionalObjectId,
  tags: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).default([]),
  status: publishStatusSchema.default("draft"),
  featured: z.boolean().default(false),
  /** Setting a future date schedules the post. */
  publishedAt: optionalDate,
  seo: seoSchema,
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;
export const blogPostUpdateSchema = blogPostSchema.partial();

/* -------------------------------------------------------------------------- */
/* Videos                                                                     */
/* -------------------------------------------------------------------------- */

export const videoSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(180),
  slug: slugSchema,
  description: z.string().trim().default(""),
  videoUrl: z.url("Enter a valid video URL"),
  thumbnail: z.string().trim().default(""),
  duration: z.coerce.number().int().min(0).default(0),
  category: optionalObjectId,
  status: publishStatusSchema.default("draft"),
  featured: z.boolean().default(false),
  publishedAt: optionalDate,
  seo: seoSchema,
});

export type VideoInput = z.infer<typeof videoSchema>;
export const videoUpdateSchema = videoSchema.partial();

/* -------------------------------------------------------------------------- */
/* Taxonomy                                                                   */
/* -------------------------------------------------------------------------- */

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(80),
  slug: slugSchema,
  kind: z.enum(["project", "blog", "video"]),
  description: z.string().trim().max(300).default(""),
  color: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Use a hex colour such as #06b6d4")
    .default("#06b6d4"),
});

export type CategoryInput = z.infer<typeof categorySchema>;
export const categoryUpdateSchema = categorySchema.partial();

export const tagSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(60),
  slug: slugSchema,
});

export type TagInput = z.infer<typeof tagSchema>;
export const tagUpdateSchema = tagSchema.partial();
