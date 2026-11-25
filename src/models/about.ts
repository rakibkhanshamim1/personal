import mongoose, { Schema, type Model, type Types } from "mongoose";
import {
  labelValueSchema,
  socialLinkSchema,
  type LabelValueSubdocument,
  type SocialLinkSubdocument,
} from "./shared";

export interface AboutDocument {
  _id: Types.ObjectId;
  /** Singleton guard: always "primary", uniquely indexed. */
  key: string;
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
  highlights: LabelValueSubdocument[];
  socialLinks: SocialLinkSubdocument[];
  createdAt: Date;
  updatedAt: Date;
}

const aboutSchema = new Schema<AboutDocument>(
  {
    key: { type: String, default: "primary", unique: true, immutable: true },
    name: { type: String, default: "", trim: true, maxlength: 120 },
    title: { type: String, default: "", trim: true, maxlength: 160 },
    introduction: { type: String, default: "", trim: true, maxlength: 600 },
    biography: { type: String, default: "" },
    profileImage: { type: String, default: "", trim: true },
    resumeUrl: { type: String, default: "", trim: true },
    location: { type: String, default: "", trim: true },
    email: { type: String, default: "", trim: true, lowercase: true },
    phone: { type: String, default: "", trim: true },
    availableForWork: { type: Boolean, default: true },
    interests: { type: [String], default: [] },
    highlights: { type: [labelValueSchema], default: [] },
    socialLinks: { type: [socialLinkSchema], default: [] },
  },
  { timestamps: true },
);

export const About: Model<AboutDocument> =
  (mongoose.models.About as Model<AboutDocument>) ??
  mongoose.model<AboutDocument>("About", aboutSchema);
