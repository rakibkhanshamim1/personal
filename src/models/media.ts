import mongoose, { Schema, type Model, type Types } from "mongoose";

export interface MediaDocument {
  _id: Types.ObjectId;
  url: string;
  /** Cloudinary public_id, or the on-disk filename for the local provider. */
  publicId: string;
  filename: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  provider: "local" | "cloudinary";
  alt: string;
  uploadedBy: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema<MediaDocument>(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, required: true, trim: true },
    filename: { type: String, required: true, trim: true },
    mimeType: { type: String, required: true, trim: true },
    size: { type: Number, required: true, min: 0 },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    provider: { type: String, enum: ["local", "cloudinary"], default: "local" },
    alt: { type: String, default: "", trim: true, maxlength: 200 },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
  },
  { timestamps: true },
);

mediaSchema.index({ createdAt: -1 });
mediaSchema.index({ publicId: 1 }, { unique: true });

export const Media: Model<MediaDocument> =
  (mongoose.models.Media as Model<MediaDocument>) ??
  mongoose.model<MediaDocument>("Media", mediaSchema);
