/**
 * Cache tags shared by the public data layer (`cacheTag`) and the admin API
 * routes (`revalidateTag`). Keeping them in one module is what guarantees an
 * admin edit actually invalidates the public page that renders it.
 *
 * Tag values are stored in plain text by the cache, so they only ever contain
 * stable, non-sensitive identifiers.
 */
export const CACHE_TAGS = {
  projects: "projects",
  project: (slug: string) => `project:${slug}`,
  blog: "blog",
  blogPost: (slug: string) => `blog:${slug}`,
  videos: "videos",
  video: (slug: string) => `video:${slug}`,
  categories: "categories",
  tags: "tags",
  about: "about",
  experience: "experience",
  education: "education",
  skills: "skills",
  settings: "settings",
  media: "media",
} as const;

/** Every tag that a settings change can affect (settings render site-wide). */
export const ALL_CONTENT_TAGS = [
  CACHE_TAGS.projects,
  CACHE_TAGS.blog,
  CACHE_TAGS.videos,
  CACHE_TAGS.categories,
  CACHE_TAGS.tags,
  CACHE_TAGS.about,
  CACHE_TAGS.experience,
  CACHE_TAGS.education,
  CACHE_TAGS.skills,
  CACHE_TAGS.settings,
] as const;
