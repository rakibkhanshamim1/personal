import { Schema } from "mongoose";

export type SeoSubdocument = {
  seoTitle: string;
  seoDescription: string;
  seoImage: string;
};

/** Reused by every content model so SEO fields stay identical across them. */
export const seoSchema = new Schema<SeoSubdocument>(
  {
    seoTitle: { type: String, default: "", trim: true, maxlength: 70 },
    seoDescription: { type: String, default: "", trim: true, maxlength: 180 },
    seoImage: { type: String, default: "", trim: true },
  },
  { _id: false },
);

export const PUBLISH_STATUSES = ["draft", "published"] as const;
export const PROJECT_STATUSES = ["completed", "in-progress", "planned"] as const;
export const SKILL_GROUPS = ["frontend", "backend", "tools", "other"] as const;
export const CATEGORY_KINDS = ["project", "blog", "video"] as const;
export const MESSAGE_STATUSES = ["unread", "read", "archived"] as const;
export const ADMIN_ROLES = ["owner", "admin", "editor"] as const;
export const VIDEO_PLATFORMS = ["youtube", "vimeo", "direct"] as const;

export type SocialLinkSubdocument = {
  label: string;
  url: string;
  icon: string;
};

export const socialLinkSchema = new Schema<SocialLinkSubdocument>(
  {
    label: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    icon: { type: String, default: "link", trim: true },
  },
  { _id: false },
);

export type LabelValueSubdocument = { label: string; value: string };

export const labelValueSchema = new Schema<LabelValueSubdocument>(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false },
);

export type NavLinkSubdocument = { label: string; href: string };

export const navLinkSchema = new Schema<NavLinkSubdocument>(
  {
    label: { type: String, required: true, trim: true },
    href: { type: String, required: true, trim: true },
  },
  { _id: false },
);
