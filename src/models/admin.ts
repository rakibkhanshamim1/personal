import mongoose, { Schema, type Model, type Types } from "mongoose";
import { ADMIN_ROLES } from "./shared";

export type AdminRole = (typeof ADMIN_ROLES)[number];

export interface AdminDocument {
  _id: Types.ObjectId;
  name: string;
  email: string;
  /** bcrypt hash — never selected by default, see `select: false`. */
  passwordHash: string;
  role: AdminRole;
  avatar: string;
  lastLoginAt: Date | null;
  failedLoginAttempts: number;
  lockedUntil: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new Schema<AdminDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Excluded from queries by default so a hash can never leak through a
    // forgotten `.select()` on an admin listing endpoint.
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ADMIN_ROLES, default: "admin" },
    avatar: { type: String, default: "", trim: true },
    lastLoginAt: { type: Date, default: null },
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Date, default: null },
  },
  { timestamps: true },
);

export const Admin: Model<AdminDocument> =
  (mongoose.models.Admin as Model<AdminDocument>) ??
  mongoose.model<AdminDocument>("Admin", adminSchema);
