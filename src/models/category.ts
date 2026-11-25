import mongoose, { Schema, type Model, type Types } from "mongoose";
import { CATEGORY_KINDS } from "./shared";

export type CategoryKind = (typeof CATEGORY_KINDS)[number];

export interface CategoryDocument {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  kind: CategoryKind;
  description: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<CategoryDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    slug: { type: String, required: true, trim: true, lowercase: true },
    kind: { type: String, enum: CATEGORY_KINDS, required: true },
    description: { type: String, default: "", trim: true, maxlength: 300 },
    color: { type: String, default: "#06b6d4", trim: true },
  },
  { timestamps: true },
);

// A slug only needs to be unique within its content kind, so "tutorials" can
// exist for both blog posts and videos.
categorySchema.index({ kind: 1, slug: 1 }, { unique: true });
categorySchema.index({ kind: 1, name: 1 });

export const Category: Model<CategoryDocument> =
  (mongoose.models.Category as Model<CategoryDocument>) ??
  mongoose.model<CategoryDocument>("Category", categorySchema);
