import { z } from "zod";

const socialLinkSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(60),
  url: z.url("Enter a valid URL"),
  icon: z.string().trim().default("link"),
});

const navLinkSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(60),
  href: z.string().trim().min(1, "Link target is required").max(200),
});

const labelValueSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(60),
  value: z.string().trim().min(1, "Value is required").max(60),
});

export const siteSettingsSchema = z.object({
  siteTitle: z.string().trim().min(2, "Site title is required").max(120),
  siteDescription: z.string().trim().max(320).default(""),
  logoText: z.string().trim().max(60).default(""),
  logoImage: z.string().trim().default(""),
  favicon: z.string().trim().default(""),
  defaultSeoImage: z.string().trim().default(""),
  hero: z
    .object({
      badge: z.string().trim().max(120).default(""),
      greeting: z.string().trim().max(60).default(""),
      headline: z.string().trim().max(160).default(""),
      subheadline: z.string().trim().max(200).default(""),
      description: z.string().trim().max(600).default(""),
      primaryCtaLabel: z.string().trim().max(40).default("View Projects"),
      primaryCtaHref: z.string().trim().max(200).default("/projects"),
      secondaryCtaLabel: z.string().trim().max(40).default("Contact Me"),
      secondaryCtaHref: z.string().trim().max(200).default("/contact"),
    })
    .prefault({}),
  sections: z
    .object({
      about: z.boolean().default(true),
      projects: z.boolean().default(true),
      videos: z.boolean().default(true),
      blog: z.boolean().default(true),
      skills: z.boolean().default(true),
      contact: z.boolean().default(true),
      stats: z.boolean().default(true),
    })
    .prefault({}),
  stats: z.array(labelValueSchema).default([]),
  navLinks: z.array(navLinkSchema).default([]),
  footer: z
    .object({
      tagline: z.string().trim().max(200).default(""),
      copyright: z.string().trim().max(200).default(""),
      links: z.array(navLinkSchema).default([]),
    })
    .prefault({}),
  contact: z
    .object({
      email: z.union([z.email("Enter a valid email address"), z.literal("")]).default(""),
      phone: z.string().trim().max(40).default(""),
      location: z.string().trim().max(120).default(""),
      formHeading: z.string().trim().max(120).default(""),
      formDescription: z.string().trim().max(400).default(""),
    })
    .prefault({}),
  socialLinks: z.array(socialLinkSchema).default([]),
  analytics: z
    .object({
      googleAnalyticsId: z
        .string()
        .trim()
        .max(40)
        .refine(
          (value) => value === "" || /^(G-[A-Z0-9]+|UA-\d+-\d+)$/i.test(value),
          "Enter a Google Analytics id such as G-XXXXXXX",
        )
        .default(""),
    })
    .prefault({}),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
export const siteSettingsUpdateSchema = siteSettingsSchema.partial();

/* -------------------------------------------------------------------------- */
/* Contact form                                                               */
/* -------------------------------------------------------------------------- */

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.email("Enter a valid email address").trim().toLowerCase(),
  subject: z.string().trim().max(200).default(""),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters")
    .max(5000, "Message is too long"),
  /**
   * Honeypot. Real users never see this field, so anything in it is a bot.
   * Validated as "must be empty" rather than stripped, so the handler can
   * reject the submission.
   */
  website: z.string().max(0, "Spam detected").optional().default(""),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

export const messageStatusSchema = z.object({
  status: z.enum(["unread", "read", "archived"]),
});

export const mediaUpdateSchema = z.object({
  alt: z.string().trim().max(200).default(""),
});
