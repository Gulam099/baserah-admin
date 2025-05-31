import mongoose, { Schema, Document, ObjectId } from "mongoose";

// Define the interface representing a Payment document in MongoDB
export interface PaymentSchema extends Document {
  _id: ObjectId;
  userId: ObjectId;
  doctorId: ObjectId;
  moyasarPaymentId?: string;
  amount: number;
  currency: string;
  description: string;
  status:
    | "initiated"
    | "paid"
    | "failed"
    | "authorized"
    | "captured"
    | "refunded"
    | "voided"
    | "verified";
  source?: {
    type: "stcpay" | "creditcard";
    company?: string;
    name?: string;
    number?: string;
    message?: string;
  };
  invoiceId?: ObjectId;
  refundId?: ObjectId;
  paidAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the Payment schema
const PaymentSchema = new Schema<PaymentSchema>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },

    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },

    moyasarPaymentId: { type: String },
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

    invoiceId: {
      type: Schema.Types.ObjectId,
      ref: "Invoice",
    },
    refundId: {
      type: Schema.Types.ObjectId,
      ref: "Refund",
    },

    paidAt: { type: Date },
  },
  { timestamps: true }
);

// Create and export the Payment model
const Payment =
  mongoose.models.Payment ||
  mongoose.model<PaymentSchema>("Payment", PaymentSchema, "payments");

export default Payment;
