import mongoose, { Schema, type Model, type Types } from "mongoose";

export interface EducationDocument {
  _id: Types.ObjectId;
  degree: string;
  institution: string;
  institutionUrl: string;
  location: string;
  field: string;
  grade: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const educationSchema = new Schema<EducationDocument>(
  {
    degree: { type: String, required: true, trim: true, maxlength: 160 },
    institution: { type: String, required: true, trim: true, maxlength: 160 },
    institutionUrl: { type: String, default: "", trim: true },
    location: { type: String, default: "", trim: true },
    field: { type: String, default: "", trim: true },
    grade: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },
    current: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

educationSchema.index({ order: 1, startDate: -1 });

export const Education: Model<EducationDocument> =
  (mongoose.models.Education as Model<EducationDocument>) ??
  mongoose.model<EducationDocument>("Education", educationSchema);
