import mongoose, { Schema, type Model, type Types } from "mongoose";
import { SKILL_GROUPS } from "./shared";

export interface SkillDocument {
  _id: Types.ObjectId;
  name: string;
  group: (typeof SKILL_GROUPS)[number];
  /** Proficiency percentage, 0–100. Drives the proficiency bars. */
  level: number;
  icon: string;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const skillSchema = new Schema<SkillDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    group: { type: String, enum: SKILL_GROUPS, default: "other" },
    level: { type: Number, default: 80, min: 0, max: 100 },
    icon: { type: String, default: "", trim: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

skillSchema.index({ group: 1, order: 1 });
skillSchema.index({ name: 1, group: 1 }, { unique: true });

export const Skill: Model<SkillDocument> =
  (mongoose.models.Skill as Model<SkillDocument>) ??
  mongoose.model<SkillDocument>("Skill", skillSchema);
