import mongoose, { Schema, Document, ObjectId } from "mongoose";

// Define the interface for Patient document
export interface Patient extends Document {
  _id: ObjectId;
  clerkId: string;
  name: string;
  address: { line1: string; line2: string };
  gender: string;
  dob: Date;
  phoneNumber: string;
  passcode: string;
  favorites: {
    programs: ObjectId[];
    doctors: ObjectId[];
    groups: ObjectId[];
    culturalContent: ObjectId[];
  };
  isAuthenticated: boolean;
  imageUrl: string;
  cards: {
    abbreviatedName: string;
    cardNumber: string;
    nameOnCard: string;
    expiryDate: string;
    cvvCode: string;
    _id: ObjectId;
  }[];
  family: {
    name: string;
    idNumber: string;
    age: number;
    fileNo: string;
    relationship: string;
    _id: ObjectId;
  }[];
  notifications: {
    date: string;
    message: string;
    _id: ObjectId;
  }[];
  createdAt: Date;
  updatedAt: Date;
  email: string;
  lastOtpSentTime: number;
  otpExpirationTime: number;
}

// Define the Patient schema
const PatientSchema = new Schema<Patient>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    clerkId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    address: {
      line1: { type: String, default: "" },
      line2: { type: String, default: "" },
    },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    dob: { type: Date, required: true },
    email: { type: String, default: " ", sparse: true },
    phoneNumber: { type: String, default: " ", sparse: true },
    passcode: { type: String, required: true },
    favorites: {
      programs: [{ type: Schema.Types.ObjectId, ref: "Program", default: [] }],
      doctors: [{ type: Schema.Types.ObjectId, ref: "Doctor", default: [] }],
      groups: [{ type: Schema.Types.ObjectId, ref: "Group", default: [] }],
      culturalContent: [{ type: Schema.Types.ObjectId, default: [] }],
    },
    imageUrl: { type: String },
    cards: [
      {
        abbreviatedName: { type: String, required: true },
        cardNumber: { type: String, required: true },
        nameOnCard: { type: String, required: true },
        expiryDate: { type: String, required: true },
        cvvCode: { type: String, required: true },
        _id: { type: Schema.Types.ObjectId, auto: true },
      },
    ],
    family: [
      {
        name: { type: String, required: true },
        idNumber: { type: String, required: true },
        age: { type: Number, required: true },
        fileNo: { type: String, required: true },
        relationship: { type: String, required: true },
        _id: { type: Schema.Types.ObjectId, auto: true },
      },
    ],
    notifications: [
      {
        date: { type: String, required: true },
        message: { type: String, required: true },
        _id: { type: Schema.Types.ObjectId, auto: true },
      },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Create and export the Patient model
const Patient =
  mongoose.models.Patient ||
  mongoose.model<Patient>("Patient", PatientSchema, "users");

export default Patient;
