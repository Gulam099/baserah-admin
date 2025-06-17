import mongoose, { Schema, Document, ObjectId } from "mongoose";

// Define the interface representing a Doctor document in MongoDB
export interface Doctor extends Document {
  _id: ObjectId;
  clerkId: string;
  full_name: string;
  email: string;
  phoneNumber: string;
  specialization: string;
  sub_specialization?: string;
  experience?: string;
  language: string[];
  age_categories: string[];
  response_time?: string;
  consultation_method: string[];
  bio?: string;
  education: string[];
  profile_picture: string;
  cv: string;
  fees: string;
  address?: string;
  available: boolean;
  approval_status: string;
  fcmToken: string;
  schedule: {
    start_time: string;
    end_time: string;
    days_of_week: string[];
    timezone: string;
    effective_from: string;
    effective_to: string;
  };
}

// Define the Doctor schema
const DoctorSchema = new Schema<Doctor>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    clerkId: { type: String, required: true, unique: true },
    full_name: { type: String },
    email: { type: String, default: " ", sparse: true },
    phoneNumber: { type: String, default: " ", sparse: true },
    specialization: { type: String },
    sub_specialization: { type: String },
    experience: { type: String },
    language: { type: [String] },
    age_categories: { type: [String] },
    response_time: { type: String },
    consultation_method: { type: [String] },
    bio: { type: String },
    education: { type: [String] },
    profile_picture: { type: String },
    cv: { type: String },
    price: { type: String },
    fees: { type: String },
    address: { type: String },
    available: { type: Boolean },
    fcmToken: { type: String },
    approval_status: {
      type: String,
      default: "under_review",
    },
    schedule: {
      start_time: { type: String },
      end_time: { type: String },
      days_of_week: { type: [String] },
      timezone: { type: String },
      effective_from: { type: String },
      effective_to: { type: String },
    },
  },
  { timestamps: true }
);

// Create and export the Doctor model
const Doctor =
  mongoose.models.Doctor ||
  mongoose.model<Doctor>("Doctor", DoctorSchema, "doctors");

export default Doctor;
