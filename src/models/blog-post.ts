import mongoose, { Schema, type Model, type Types } from "mongoose";
import { PUBLISH_STATUSES, seoSchema, type SeoSubdocument } from "./shared";

export interface BlogPostDocument {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: Types.ObjectId | null;
  tags: Types.ObjectId[];
  status: (typeof PUBLISH_STATUSES)[number];
  featured: boolean;
  readingTime: number;
  /** May be in the future — the public layer filters those out (scheduling). */
  publishedAt: Date | null;
  author: Types.ObjectId | null;
  seo: SeoSubdocument;
  createdAt: Date;
  updatedAt: Date;
}

const blogPostSchema = new Schema<BlogPostDocument>(
  {
    title: { type: String, required: true, trim: true, maxlength: 180 },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    excerpt: { type: String, default: "", trim: true, maxlength: 320 },
    content: { type: String, default: "" },
    coverImage: { type: String, default: "", trim: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    status: { type: String, enum: PUBLISH_STATUSES, default: "draft" },
    featured: { type: Boolean, default: false },
    readingTime: { type: Number, default: 1, min: 1 },
    publishedAt: { type: Date, default: null },
    author: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
    seo: { type: seoSchema, default: () => ({}) },
  },
  { timestamps: true },
);

blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ status: 1, featured: -1, publishedAt: -1 });
blogPostSchema.index({ category: 1 });
blogPostSchema.index({ tags: 1 });
blogPostSchema.index({ title: "text", excerpt: "text" });

export const BlogPost: Model<BlogPostDocument> =
  (mongoose.models.BlogPost as Model<BlogPostDocument>) ??
  mongoose.model<BlogPostDocument>("BlogPost", blogPostSchema);
