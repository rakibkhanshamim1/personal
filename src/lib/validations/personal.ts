import { z } from "zod";
import { optionalDate, optionalUrl, requiredDate, stringArraySchema } from "./common";

const socialLinkSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(60),
  url: z.url("Enter a valid URL"),
  icon: z.string().trim().default("link"),
});

const labelValueSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(60),
  value: z.string().trim().min(1, "Value is required").max(60),
});

export const aboutSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(120),
  title: z.string().trim().min(2, "Professional title is required").max(160),
  introduction: z.string().trim().max(600).default(""),
  biography: z.string().default(""),
  profileImage: z.string().trim().default(""),
  resumeUrl: z.string().trim().default(""),
  location: z.string().trim().max(120).default(""),
  email: z.union([z.email("Enter a valid email address"), z.literal("")]).default(""),
  phone: z.string().trim().max(40).default(""),
  availableForWork: z.boolean().default(true),
  interests: stringArraySchema,
  highlights: z.array(labelValueSchema).default([]),
  socialLinks: z.array(socialLinkSchema).default([]),
});

export type AboutInput = z.infer<typeof aboutSchema>;

export const experienceSchema = z
  .object({
    role: z.string().trim().min(2, "Role is required").max(140),
    company: z.string().trim().min(1, "Company is required").max(140),
    companyUrl: optionalUrl,
    location: z.string().trim().max(120).default(""),
    employmentType: z.string().trim().max(60).default("Full-time"),
    description: z.string().trim().default(""),
    achievements: z.array(z.string().trim().min(1)).default([]),
    technologies: stringArraySchema,
    startDate: requiredDate,
    endDate: optionalDate,
    current: z.boolean().default(false),
    order: z.coerce.number().int().default(0),
  })
  .refine((data) => data.current || data.endDate !== null, {
    message: "Set an end date, or mark this role as current",
    path: ["endDate"],
  })
  .refine(
    (data) => !data.endDate || data.endDate >= data.startDate,
    { message: "End date must be after the start date", path: ["endDate"] },
  );

export type ExperienceInput = z.infer<typeof experienceSchema>;

export const educationSchema = z
  .object({
    degree: z.string().trim().min(2, "Degree is required").max(160),
    institution: z.string().trim().min(2, "Institution is required").max(160),
    institutionUrl: optionalUrl,
    location: z.string().trim().max(120).default(""),
    field: z.string().trim().max(140).default(""),
    grade: z.string().trim().max(60).default(""),
    description: z.string().trim().default(""),
    startDate: requiredDate,
    endDate: optionalDate,
    current: z.boolean().default(false),
    order: z.coerce.number().int().default(0),
  })
  .refine((data) => data.current || data.endDate !== null, {
    message: "Set an end date, or mark this as ongoing",
    path: ["endDate"],
  })
  .refine(
    (data) => !data.endDate || data.endDate >= data.startDate,
    { message: "End date must be after the start date", path: ["endDate"] },
  );

export type EducationInput = z.infer<typeof educationSchema>;

export const skillSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  group: z.enum(["frontend", "backend", "tools", "other"]).default("other"),
  level: z.coerce.number().int().min(0).max(100).default(80),
  icon: z.string().trim().max(60).default(""),
  featured: z.boolean().default(false),
  order: z.coerce.number().int().default(0),
});

export type SkillInput = z.infer<typeof skillSchema>;
export const skillUpdateSchema = skillSchema.partial();
