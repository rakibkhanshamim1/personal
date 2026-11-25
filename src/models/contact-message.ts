import mongoose, { Schema, type Model, type Types } from "mongoose";
import { MESSAGE_STATUSES } from "./shared";

export interface ContactMessageDocument {
  _id: Types.ObjectId;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: (typeof MESSAGE_STATUSES)[number];
  /** Salted hash of the sender IP — enables rate limiting without storing PII. */
  ipHash: string;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

const contactMessageSchema = new Schema<ContactMessageDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, default: "", trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: { type: String, enum: MESSAGE_STATUSES, default: "unread" },
    ipHash: { type: String, default: "", select: false },
    userAgent: { type: String, default: "", select: false },
  },
  { timestamps: true },
);

contactMessageSchema.index({ status: 1, createdAt: -1 });
contactMessageSchema.index({ createdAt: -1 });
// Supports the submission rate-limit lookup.
contactMessageSchema.index({ ipHash: 1, createdAt: -1 });

export const ContactMessage: Model<ContactMessageDocument> =
  (mongoose.models.ContactMessage as Model<ContactMessageDocument>) ??
  mongoose.model<ContactMessageDocument>("ContactMessage", contactMessageSchema);
