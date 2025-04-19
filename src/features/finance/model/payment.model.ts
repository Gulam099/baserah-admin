import mongoose, { Schema } from "mongoose";

const PaymentSchema = new Schema(
  {
    patientId: { type: String, required: true },
    doctorId: { type: String, required: true },
    paymentId : { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "SAR" },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: [
        "initiated",
        "paid",
        "failed",
        "authorized",
        "captured",
        "refunded",
        "voided",
        "verified",
      ],
      default: "initiated",
    },
    source: {
      type: {
        type: String,
        enum: ["stcpay", "creditcard"],
      },
      company: String,
      name: String,
      number: String,
      message: String,
    },
    invoiceId: String,
  },
  { timestamps: true }
);

export const PaymentModel =
  mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
