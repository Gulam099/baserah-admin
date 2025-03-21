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
  approval_status:
    | "Initial Approved"
    | "Under Review"
    | "Approved"
    | "Rejected";
}

// Define the Doctor schema
const DoctorSchema = new Schema<Doctor>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    clerkId: { type: String, required: true, unique: true },
    full_name: { type: String, required: true },
    email: { type: String},
    phoneNumber: { type: String, required: true },
    specialization: { type: String, required: true },
    sub_specialization: { type: String },
    experience: { type: String },
    language: { type: [String], required: true },
    age_categories: { type: [String], required: true },
    response_time: { type: String },
    consultation_method: { type: [String], required: true },
    bio: { type: String },
    education: { type: [String], required: true },
    profile_picture: { type: String, required: true },
    cv: { type: String, required: true },
    fees: { type: String, required: true },
    address: { type: String },
    available: { type: Boolean, required: true },
    approval_status: {
      type: String,
      default: "Under Review",
    },
  },
  { timestamps: true }
);

// Create and export the Doctor model
const Doctor =
  mongoose.models.Doctor ||
  mongoose.model<Doctor>("Doctor", DoctorSchema, "doctors");

export default Doctor;
