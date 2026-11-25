import mongoose, { Schema, type Model, type Types } from "mongoose";
import { PROJECT_STATUSES, PUBLISH_STATUSES, seoSchema, type SeoSubdocument } from "./shared";

export interface ProjectDocument {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  summary: string;
  description: string;
  coverImage: string;
  gallery: string[];
  technologies: string[];
  category: Types.ObjectId | null;
  liveUrl: string;
  sourceUrl: string;
  projectStatus: (typeof PROJECT_STATUSES)[number];
  status: (typeof PUBLISH_STATUSES)[number];
  featured: boolean;
  startDate: Date | null;
  completedDate: Date | null;
  order: number;
  seo: SeoSubdocument;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<ProjectDocument>(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    summary: { type: String, required: true, trim: true, maxlength: 300 },
    description: { type: String, default: "" },
    coverImage: { type: String, default: "", trim: true },
    gallery: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    category: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    liveUrl: { type: String, default: "", trim: true },
    sourceUrl: { type: String, default: "", trim: true },
    projectStatus: {
      type: String,
      enum: PROJECT_STATUSES,
      default: "completed",
    },
    status: { type: String, enum: PUBLISH_STATUSES, default: "draft" },
    featured: { type: Boolean, default: false },
    startDate: { type: Date, default: null },
    completedDate: { type: Date, default: null },
    order: { type: Number, default: 0 },
    seo: { type: seoSchema, default: () => ({}) },
  },
  { timestamps: true },
);

// Drives the public listing: published first, then manual order, then newest.
projectSchema.index({ status: 1, order: 1, createdAt: -1 });
projectSchema.index({ status: 1, featured: -1 });
projectSchema.index({ category: 1 });
projectSchema.index({ technologies: 1 });
// Backs the search box on /projects.
projectSchema.index({ title: "text", summary: "text", technologies: "text" });

export const Project: Model<ProjectDocument> =
  (mongoose.models.Project as Model<ProjectDocument>) ??
  mongoose.model<ProjectDocument>("Project", projectSchema);
