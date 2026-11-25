import mongoose, { Schema, type Model, type Types } from "mongoose";

export interface TagDocument {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const tagSchema = new Schema<TagDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true },
);

tagSchema.index({ name: 1 });

export const Tag: Model<TagDocument> =
  (mongoose.models.Tag as Model<TagDocument>) ??
  mongoose.model<TagDocument>("Tag", tagSchema);
