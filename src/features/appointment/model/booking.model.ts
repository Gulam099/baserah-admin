import mongoose, { Schema, Document } from "mongoose";

export interface Booking extends Document {
  patientId: Schema.Types.ObjectId;
  doctorId: Schema.Types.ObjectId;
  bookingSchedule: Date;
  duration: number;
  numberOfSession: number;
  complaint?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentId: Schema.Types.ObjectId;
  paymentStatus: "pending" | "paid" | "failed";
  videoCallRoomId?: Schema.Types.ObjectId;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<Booking>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true }, 
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true }, 
    bookingSchedule: { type: Date, required: true },
    duration: { type: Number, default: 30 }, // in minutes
    numberOfSession: { type: Number, default: 1 }, 
    complaint: { type: String },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment" , required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    videoCallRoomId: { type: Schema.Types.ObjectId, ref: "VideoCallRoom" },

    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true, // ✅ auto createdAt and updatedAt
  }
);

const BookingModel =
  mongoose.models.Booking ||
  mongoose.model<Booking>("Booking", BookingSchema, "bookings");

export default BookingModel;
