import mongoose, { Schema, type Model, type Types } from "mongoose";
import {
  labelValueSchema,
  navLinkSchema,
  socialLinkSchema,
  type LabelValueSubdocument,
  type NavLinkSubdocument,
  type SocialLinkSubdocument,
} from "./shared";

export interface SiteSettingsDocument {
  _id: Types.ObjectId;
  /** Singleton guard: always "primary", uniquely indexed. */
  key: string;
  siteTitle: string;
  siteDescription: string;
  logoText: string;
  logoImage: string;
  favicon: string;
  defaultSeoImage: string;
  hero: {
    badge: string;
    greeting: string;
    headline: string;
    subheadline: string;
    description: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    codeCardName: string;
    codeCardRole: string;
    codeCardStack: string;
    codeCardTechBadge: string;
  };
  sections: {
    about: boolean;
    projects: boolean;
    videos: boolean;
    blog: boolean;
    skills: boolean;
    contact: boolean;
    stats: boolean;
  };
  stats: LabelValueSubdocument[];
  navLinks: NavLinkSubdocument[];
  footer: {
    tagline: string;
    copyright: string;
    links: NavLinkSubdocument[];
  };
  contact: {
    email: string;
    phone: string;
    location: string;
    formHeading: string;
    formDescription: string;
  };
  socialLinks: SocialLinkSubdocument[];
  analytics: {
    googleAnalyticsId: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const heroSchema = new Schema(
  {
    badge: { type: String, default: "" },
    greeting: { type: String, default: "" },
    headline: { type: String, default: "" },
    subheadline: { type: String, default: "" },
    description: { type: String, default: "" },
    primaryCtaLabel: { type: String, default: "View Projects" },
    primaryCtaHref: { type: String, default: "/projects" },
    secondaryCtaLabel: { type: String, default: "Contact Me" },
    secondaryCtaHref: { type: String, default: "/contact" },
    codeCardName: { type: String, default: "" },
    codeCardRole: { type: String, default: "" },
    codeCardStack: { type: String, default: "React, Next.js, Node.js" },
    codeCardTechBadge: { type: String, default: "Next.js 16 ⚡" },
  },
  { _id: false },
);

const sectionsSchema = new Schema(
  {
    about: { type: Boolean, default: true },
    projects: { type: Boolean, default: true },
    videos: { type: Boolean, default: true },
    blog: { type: Boolean, default: true },
    skills: { type: Boolean, default: true },
    contact: { type: Boolean, default: true },
    stats: { type: Boolean, default: true },
  },
  { _id: false },
);

const footerSchema = new Schema(
  {
    tagline: { type: String, default: "" },
    copyright: { type: String, default: "" },
    links: { type: [navLinkSchema], default: [] },
  },
  { _id: false },
);

const contactSchema = new Schema(
  {
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    formHeading: { type: String, default: "Let's work together" },
    formDescription: { type: String, default: "" },
  },
  { _id: false },
);

const analyticsSchema = new Schema(
  { googleAnalyticsId: { type: String, default: "" } },
  { _id: false },
);

const siteSettingsSchema = new Schema<SiteSettingsDocument>(
  {
    key: { type: String, default: "primary", unique: true, immutable: true },
    siteTitle: { type: String, default: "Portfolio" },
    siteDescription: { type: String, default: "" },
    logoText: { type: String, default: "Portfolio" },
    logoImage: { type: String, default: "" },
    favicon: { type: String, default: "" },
    defaultSeoImage: { type: String, default: "" },
    hero: { type: heroSchema, default: () => ({}) },
    sections: { type: sectionsSchema, default: () => ({}) },
    stats: { type: [labelValueSchema], default: [] },
    navLinks: { type: [navLinkSchema], default: [] },
    footer: { type: footerSchema, default: () => ({}) },
    contact: { type: contactSchema, default: () => ({}) },
    socialLinks: { type: [socialLinkSchema], default: [] },
    analytics: { type: analyticsSchema, default: () => ({}) },
  },
  { timestamps: true },
);

export const SiteSettings: Model<SiteSettingsDocument> =
  (mongoose.models.SiteSettings as Model<SiteSettingsDocument>) ??
  mongoose.model<SiteSettingsDocument>("SiteSettings", siteSettingsSchema);
