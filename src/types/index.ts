import type { VideoPlatform } from "@/lib/utils/video";

export type { VideoPlatform };

/**
 * Serializable DTOs returned by the data layer. Mongoose documents are mapped
 * into these (ids as strings, dates as ISO strings) so they can be handed to
 * Client Components and cached by `use cache` without serialization errors.
 */

export type PublishStatus = "draft" | "published";
export type ProjectStatus = "completed" | "in-progress" | "planned";
export type SkillLevelGroup = "frontend" | "backend" | "tools" | "other";
export type CategoryKind = "project" | "blog" | "video";
export type MessageStatus = "unread" | "read" | "archived";
export type AdminRole = "owner" | "admin" | "editor";

export type SeoFields = {
  seoTitle: string;
  seoDescription: string;
  seoImage: string;
};

export type CategoryDTO = {
  id: string;
  name: string;
  slug: string;
  kind: CategoryKind;
  description: string;
  color: string;
  usageCount?: number;
};

export type TagDTO = {
  id: string;
  name: string;
  slug: string;
  usageCount?: number;
};

export type ProjectDTO = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  coverImage: string;
  gallery: string[];
  technologies: string[];
  category: CategoryDTO | null;
  liveUrl: string;
  sourceUrl: string;
  projectStatus: ProjectStatus;
  status: PublishStatus;
  featured: boolean;
  startDate: string | null;
  completedDate: string | null;
  order: number;
  seo: SeoFields;
  createdAt: string;
  updatedAt: string;
};

export type BlogPostDTO = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: CategoryDTO | null;
  tags: TagDTO[];
  status: PublishStatus;
  featured: boolean;
  readingTime: number;
  publishedAt: string | null;
  authorName: string;
  authorAvatar: string;
  seo: SeoFields;
  createdAt: string;
  updatedAt: string;
};

export type VideoDTO = {
  id: string;
  title: string;
  slug: string;
  description: string;
  videoUrl: string;
  platform: VideoPlatform;
  videoId: string;
  embedUrl: string;
  watchUrl: string;
  thumbnail: string;
  duration: number;
  category: CategoryDTO | null;
  status: PublishStatus;
  featured: boolean;
  publishedAt: string | null;
  seo: SeoFields;
  createdAt: string;
  updatedAt: string;
};

export type SocialLinkDTO = {
  label: string;
  url: string;
  /** Lucide icon key resolved by `components/shared/social-icon.tsx`. */
  icon: string;
};

export type AboutDTO = {
  name: string;
  title: string;
  introduction: string;
  biography: string;
  profileImage: string;
  resumeUrl: string;
  location: string;
  email: string;
  phone: string;
  availableForWork: boolean;
  interests: string[];
  highlights: Array<{ label: string; value: string }>;
  socialLinks: SocialLinkDTO[];
};

export type ExperienceDTO = {
  id: string;
  role: string;
  company: string;
  companyUrl: string;
  location: string;
  employmentType: string;
  description: string;
  achievements: string[];
  technologies: string[];
  startDate: string;
  endDate: string | null;
  current: boolean;
  order: number;
};

export type EducationDTO = {
  id: string;
  degree: string;
  institution: string;
  institutionUrl: string;
  location: string;
  field: string;
  grade: string;
  description: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  order: number;
};

export type SkillDTO = {
  id: string;
  name: string;
  group: SkillLevelGroup;
  level: number;
  icon: string;
  featured: boolean;
  order: number;
};

export type ContactMessageDTO = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  ipHash: string;
  createdAt: string;
};

export type MediaDTO = {
  id: string;
  url: string;
  publicId: string;
  filename: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  provider: "local" | "cloudinary";
  alt: string;
  createdAt: string;
};

export type NavLinkDTO = {
  label: string;
  href: string;
};

export type SiteSettingsDTO = {
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
  stats: Array<{ label: string; value: string }>;
  navLinks: NavLinkDTO[];
  footer: {
    tagline: string;
    copyright: string;
    links: NavLinkDTO[];
  };
  contact: {
    email: string;
    phone: string;
    location: string;
    formHeading: string;
    formDescription: string;
  };
  socialLinks: SocialLinkDTO[];
  analytics: {
    googleAnalyticsId: string;
  };
};

export type AdminUserDTO = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar: string;
  lastLoginAt: string | null;
};

/** Consistent envelope returned by every route handler. */
export type ApiSuccess<T> = {
  success: true;
  data: T;
  meta?: PaginationMeta;
};

export type ApiFailure = {
  success: false;
  error: string;
  /** Field-level validation messages, keyed by form field name. */
  fieldErrors?: Record<string, string[]>;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type Paginated<T> = {
  items: T[];
  meta: PaginationMeta;
};

export type DashboardStats = {
  projects: { total: number; published: number; draft: number; featured: number };
  blog: { total: number; published: number; draft: number; featured: number };
  videos: { total: number; published: number; draft: number; featured: number };
  messages: { total: number; unread: number; archived: number };
  media: { total: number; totalSize: number };
  taxonomy: { categories: number; tags: number };
};

export type ActivityItem = {
  id: string;
  type: "project" | "blog" | "video" | "message";
  title: string;
  status: string;
  href: string;
  timestamp: string;
};

export type ContentTrendPoint = {
  month: string;
  projects: number;
  posts: number;
  videos: number;
};
