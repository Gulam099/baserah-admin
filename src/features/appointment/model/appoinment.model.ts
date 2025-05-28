import mongoose, { Schema, model, models } from "mongoose";

const appointmentSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  program: {
    type: String,
    enum: ["Urgent", "Consultation"],
    default: "Consultation",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const AppointmentModel =
  mongoose.models.Appointment || model("Appointment", appointmentSchema);

export { AppointmentModel };
