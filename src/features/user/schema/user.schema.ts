// /schema/user.schema.ts
import { z } from "zod";

export const UserSchema = z.object({
  _id: z.string().optional(),
  clerkId: z.string().min(1, "Clerk ID is required"),
  email: z.string().email("Invalid email address"),
  mobile_number: z.string().min(1, "Mobile Number is required"),
  imageUrl: z.string().url("Invalid image URL"),
  fullName: z.string().min(1, "First name is required"),
  role: z.string().min(1, "Role is required"),
});
