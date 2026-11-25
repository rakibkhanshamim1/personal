/**
 * Single import point for every model. Importing this module guarantees all
 * schemas are registered with Mongoose before any `populate()` runs.
 */
export { Admin, type AdminDocument } from "./admin";
export { About, type AboutDocument } from "./about";
export { BlogPost, type BlogPostDocument } from "./blog-post";
export { Category, type CategoryDocument } from "./category";
export { ContactMessage, type ContactMessageDocument } from "./contact-message";
export { Education, type EducationDocument } from "./education";
export { Experience, type ExperienceDocument } from "./experience";
export { Media, type MediaDocument } from "./media";
export { Project, type ProjectDocument } from "./project";
export { SiteSettings, type SiteSettingsDocument } from "./site-settings";
export { Skill, type SkillDocument } from "./skill";
export { Tag, type TagDocument } from "./tag";
export { Video, type VideoDocument } from "./video";
export * from "./shared";
