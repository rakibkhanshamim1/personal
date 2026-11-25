import type { AboutDocument } from "@/models/about";
import type { BlogPostDocument } from "@/models/blog-post";
import type { CategoryDocument } from "@/models/category";
import type { ContactMessageDocument } from "@/models/contact-message";
import type { EducationDocument } from "@/models/education";
import type { ExperienceDocument } from "@/models/experience";
import type { MediaDocument } from "@/models/media";
import type { ProjectDocument } from "@/models/project";
import type { SiteSettingsDocument } from "@/models/site-settings";
import type { SkillDocument } from "@/models/skill";
import type { TagDocument } from "@/models/tag";
import type { VideoDocument } from "@/models/video";
import type { AdminDocument } from "@/models/admin";
import type {
  AboutDTO,
  AdminUserDTO,
  BlogPostDTO,
  CategoryDTO,
  ContactMessageDTO,
  EducationDTO,
  ExperienceDTO,
  MediaDTO,
  ProjectDTO,
  SiteSettingsDTO,
  SkillDTO,
  TagDTO,
  VideoDTO,
} from "@/types";

function d(v: Date | null | undefined): string | null {
  return v ? v.toISOString() : null;
}

function id(v: { _id: { toString(): string } }): string {
  return v._id.toString();
}

function seo(v: { seoTitle?: string; seoDescription?: string; seoImage?: string }) {
  return {
    seoTitle: v.seoTitle ?? "",
    seoDescription: v.seoDescription ?? "",
    seoImage: v.seoImage ?? "",
  };
}

function mapCategoryInline(v: unknown): CategoryDTO | null {
  if (!v || typeof v !== "object" || !("_id" in v)) return null;
  return mapCategory(v as CategoryDocument);
}

function mapTagInline(v: unknown): TagDTO | null {
  if (!v || typeof v !== "object" || !("_id" in v)) return null;
  return mapTag(v as TagDocument);
}

export function mapCategory(doc: CategoryDocument): CategoryDTO {
  return {
    id: id(doc),
    name: doc.name,
    slug: doc.slug,
    kind: doc.kind,
    description: doc.description,
    color: doc.color,
  };
}

export function mapTag(doc: TagDocument): TagDTO {
  return { id: id(doc), name: doc.name, slug: doc.slug };
}

export function mapProject(doc: ProjectDocument): ProjectDTO {
  return {
    id: id(doc),
    title: doc.title,
    slug: doc.slug,
    summary: doc.summary,
    description: doc.description,
    coverImage: doc.coverImage,
    gallery: doc.gallery,
    technologies: doc.technologies,
    category: mapCategoryInline(doc.category),
    liveUrl: doc.liveUrl,
    sourceUrl: doc.sourceUrl,
    projectStatus: doc.projectStatus,
    status: doc.status,
    featured: doc.featured,
    startDate: d(doc.startDate),
    completedDate: d(doc.completedDate),
    order: doc.order,
    seo: seo(doc.seo),
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export function mapBlogPost(doc: BlogPostDocument): BlogPostDTO {
  const author = doc.author as unknown as { name?: string; avatar?: string } | null;
  return {
    id: id(doc),
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt,
    content: doc.content,
    coverImage: doc.coverImage,
    category: mapCategoryInline(doc.category),
    tags: (doc.tags as unknown[]).map(mapTagInline).filter(Boolean) as TagDTO[],
    status: doc.status,
    featured: doc.featured,
    readingTime: doc.readingTime,
    publishedAt: d(doc.publishedAt),
    authorName: author?.name ?? "",
    authorAvatar: author?.avatar ?? "",
    seo: seo(doc.seo),
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export function mapVideo(doc: VideoDocument): VideoDTO {
  return {
    id: id(doc),
    title: doc.title,
    slug: doc.slug,
    description: doc.description,
    videoUrl: doc.videoUrl,
    platform: doc.platform,
    videoId: doc.videoId,
    embedUrl: doc.embedUrl,
    watchUrl: doc.watchUrl,
    thumbnail: doc.thumbnail,
    duration: doc.duration,
    category: mapCategoryInline(doc.category),
    status: doc.status,
    featured: doc.featured,
    publishedAt: d(doc.publishedAt),
    seo: seo(doc.seo),
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export function mapAbout(doc: AboutDocument): AboutDTO {
  return {
    name: doc.name,
    title: doc.title,
    introduction: doc.introduction,
    biography: doc.biography,
    profileImage: doc.profileImage,
    resumeUrl: doc.resumeUrl,
    location: doc.location,
    email: doc.email,
    phone: doc.phone,
    availableForWork: doc.availableForWork,
    interests: doc.interests,
    highlights: doc.highlights.map((h) => ({ label: h.label, value: h.value })),
    socialLinks: doc.socialLinks.map((s) => ({ label: s.label, url: s.url, icon: s.icon })),
  };
}

export function mapExperience(doc: ExperienceDocument): ExperienceDTO {
  return {
    id: id(doc),
    role: doc.role,
    company: doc.company,
    companyUrl: doc.companyUrl,
    location: doc.location,
    employmentType: doc.employmentType,
    description: doc.description,
    achievements: doc.achievements,
    technologies: doc.technologies,
    startDate: doc.startDate.toISOString(),
    endDate: d(doc.endDate),
    current: doc.current,
    order: doc.order,
  };
}

export function mapEducation(doc: EducationDocument): EducationDTO {
  return {
    id: id(doc),
    degree: doc.degree,
    institution: doc.institution,
    institutionUrl: doc.institutionUrl,
    location: doc.location,
    field: doc.field,
    grade: doc.grade,
    description: doc.description,
    startDate: doc.startDate.toISOString(),
    endDate: d(doc.endDate),
    current: doc.current,
    order: doc.order,
  };
}

export function mapSkill(doc: SkillDocument): SkillDTO {
  return {
    id: id(doc),
    name: doc.name,
    group: doc.group,
    level: doc.level,
    icon: doc.icon,
    featured: doc.featured,
    order: doc.order,
  };
}

export function mapMessage(doc: ContactMessageDocument): ContactMessageDTO {
  return {
    id: id(doc),
    name: doc.name,
    email: doc.email,
    subject: doc.subject,
    message: doc.message,
    status: doc.status,
    ipHash: (doc as unknown as { ipHash?: string }).ipHash ?? "",
    createdAt: doc.createdAt.toISOString(),
  };
}

export function mapMedia(doc: MediaDocument): MediaDTO {
  return {
    id: id(doc),
    url: doc.url,
    publicId: doc.publicId,
    filename: doc.filename,
    mimeType: doc.mimeType,
    size: doc.size,
    width: doc.width,
    height: doc.height,
    provider: doc.provider,
    alt: doc.alt,
    createdAt: doc.createdAt.toISOString(),
  };
}

export function mapSettings(doc: SiteSettingsDocument): SiteSettingsDTO {
  return {
    siteTitle: doc.siteTitle,
    siteDescription: doc.siteDescription,
    logoText: doc.logoText,
    logoImage: doc.logoImage,
    favicon: doc.favicon,
    defaultSeoImage: doc.defaultSeoImage,
    hero: {
      badge: doc.hero.badge,
      greeting: doc.hero.greeting,
      headline: doc.hero.headline,
      subheadline: doc.hero.subheadline,
      description: doc.hero.description,
      primaryCtaLabel: doc.hero.primaryCtaLabel,
      primaryCtaHref: doc.hero.primaryCtaHref,
      secondaryCtaLabel: doc.hero.secondaryCtaLabel,
      secondaryCtaHref: doc.hero.secondaryCtaHref,
      codeCardName: doc.hero.codeCardName ?? "",
      codeCardRole: doc.hero.codeCardRole ?? "",
      codeCardStack: doc.hero.codeCardStack ?? "React, Next.js, Node.js",
      codeCardTechBadge: doc.hero.codeCardTechBadge ?? "Next.js 16 ⚡",
    },
    sections: {
      about: doc.sections.about,
      projects: doc.sections.projects,
      videos: doc.sections.videos,
      blog: doc.sections.blog,
      skills: doc.sections.skills,
      contact: doc.sections.contact,
      stats: doc.sections.stats,
    },
    stats: doc.stats.map((s) => ({ label: s.label, value: s.value })),
    navLinks: doc.navLinks.map((n) => ({ label: n.label, href: n.href })),
    footer: {
      tagline: doc.footer.tagline,
      copyright: doc.footer.copyright,
      links: doc.footer.links.map((l) => ({ label: l.label, href: l.href })),
    },
    contact: {
      email: doc.contact.email,
      phone: doc.contact.phone,
      location: doc.contact.location,
      formHeading: doc.contact.formHeading,
      formDescription: doc.contact.formDescription,
    },
    socialLinks: doc.socialLinks.map((s) => ({ label: s.label, url: s.url, icon: s.icon })),
    analytics: { googleAnalyticsId: doc.analytics.googleAnalyticsId },
  };
}

export function mapAdmin(doc: AdminDocument): AdminUserDTO {
  return {
    id: id(doc),
    name: doc.name,
    email: doc.email,
    role: doc.role,
    avatar: doc.avatar,
    lastLoginAt: d(doc.lastLoginAt),
  };
}
