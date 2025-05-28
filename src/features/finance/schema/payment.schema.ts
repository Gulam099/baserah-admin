import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const PaymentZodSchema = z.object({
  _id: z.string().optional(),
  patientId: z.string().regex(objectIdRegex, "Invalid ObjectId string"),
  doctorId: z.string().regex(objectIdRegex, "Invalid ObjectId string"),
  moyasarPaymentId: z.string().optional(),
  amount: z.number().positive(),
  currency: z.string().default("SAR"),
  description: z.string(),
  status: z.enum([
    "initiated",
    "paid",
    "failed",
    "authorized",
    "captured",
    "refunded",
    "voided",
    "verified",
  ]),
  source: z.object({
    type: z.enum(["stcpay", "creditcard"]),
    company: z.string().optional(),
    name: z.string().optional(),
    number: z.string().optional(),
    message: z.string().optional(),
  }),
  invoiceId: z.string().optional(),
  paidAt: z.date().optional(), // To track successful payment date
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});
