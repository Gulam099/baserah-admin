import { z } from "zod";

export const PaymentZodSchema = z.object({
  patientId: z.string().min(1),
  doctorId: z.string().min(1),
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
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});
