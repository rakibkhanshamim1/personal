import mongoose, { Schema, type Model, type Types } from "mongoose";
import {
  PUBLISH_STATUSES,
  VIDEO_PLATFORMS,
  seoSchema,
  type SeoSubdocument,
} from "./shared";

export interface VideoDocument {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  videoUrl: string;
  platform: (typeof VIDEO_PLATFORMS)[number];
  videoId: string;
  embedUrl: string;
  watchUrl: string;
  thumbnail: string;
  /** Duration in seconds; 0 when unknown. */
  duration: number;
  category: Types.ObjectId | null;
  status: (typeof PUBLISH_STATUSES)[number];
  featured: boolean;
  publishedAt: Date | null;
  seo: SeoSubdocument;
  createdAt: Date;
  updatedAt: Date;
}

const videoSchema = new Schema<VideoDocument>(
  {
    title: { type: String, required: true, trim: true, maxlength: 180 },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: { type: String, default: "", trim: true },
    videoUrl: { type: String, required: true, trim: true },
    platform: { type: String, enum: VIDEO_PLATFORMS, default: "youtube" },
    videoId: { type: String, default: "", trim: true },
    embedUrl: { type: String, default: "", trim: true },
    watchUrl: { type: String, default: "", trim: true },
    thumbnail: { type: String, default: "", trim: true },
    duration: { type: Number, default: 0, min: 0 },
    category: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    status: { type: String, enum: PUBLISH_STATUSES, default: "draft" },
    featured: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
    seo: { type: seoSchema, default: () => ({}) },
  },
  { timestamps: true },
);

videoSchema.index({ status: 1, publishedAt: -1 });
videoSchema.index({ status: 1, featured: -1, publishedAt: -1 });
videoSchema.index({ category: 1 });
videoSchema.index({ title: "text", description: "text" });

export const Video: Model<VideoDocument> =
  (mongoose.models.Video as Model<VideoDocument>) ??
  mongoose.model<VideoDocument>("Video", videoSchema);
