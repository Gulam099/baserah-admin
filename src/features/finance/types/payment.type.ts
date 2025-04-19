import { z } from "zod";
import { PaymentZodSchema } from "../schema/payment.schema";

export type PaymentType = z.infer<typeof PaymentZodSchema>;
