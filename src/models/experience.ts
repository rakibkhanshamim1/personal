import mongoose, { Schema, type Model, type Types } from "mongoose";

export interface ExperienceDocument {
  _id: Types.ObjectId;
  role: string;
  company: string;
  companyUrl: string;
  location: string;
  employmentType: string;
  description: string;
  achievements: string[];
  technologies: string[];
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const experienceSchema = new Schema<ExperienceDocument>(
  {
    role: { type: String, required: true, trim: true, maxlength: 140 },
    company: { type: String, required: true, trim: true, maxlength: 140 },
    companyUrl: { type: String, default: "", trim: true },
    location: { type: String, default: "", trim: true },
    employmentType: { type: String, default: "Full-time", trim: true },
    description: { type: String, default: "", trim: true },
    achievements: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },
    current: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

experienceSchema.index({ order: 1, startDate: -1 });

export const Experience: Model<ExperienceDocument> =
  (mongoose.models.Experience as Model<ExperienceDocument>) ??
  mongoose.model<ExperienceDocument>("Experience", experienceSchema);
