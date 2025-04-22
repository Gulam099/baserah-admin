import { z } from "zod";

const DoctorSchema = z.object({
  _id: z.string().optional(),
  clerkId: z.string().min(1, "Clerk ID is required"),
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone Number is required"),
  specialization: z.string().min(1, "Specialization is required"),
  sub_specialization: z.string().optional(),
  experience: z.string().optional(),
  language: z.array(z.string()).min(1, "At least one language is required"),
  age_categories: z
    .array(z.string())
    .min(1, "At least one age category is required"),
  response_time: z.string().optional(),
  consultation_method: z
    .array(z.string())
    .min(1, "At least one consultation method is required"),
  bio: z.string().optional(),
  education: z
    .array(z.string())
    .min(1, "At least one education entry is required"),
  profile_picture: z.string().url("Invalid profile picture URL"),
  cv: z.string().url("Invalid CV URL"),
  fees: z.string(),
  schedules: z.record(
    z
      .object({
        start: z.string().nullable().optional(),
        end: z.string().nullable().optional(),
        isHoliday: z.boolean().optional(),
      })
      .optional()
  ),
  address: z.string().optional(),
  available: z.boolean(),
  approval_status: z.string(),
  schedule: z
    .object({
      start_time: z.string(),
      end_time: z.string(),
      days_of_week: z.array(z.string()),
      timezone: z.string(),
      effective_from: z.string(),
      effective_to: z.string(),
    })
    .optional(),
});

export default DoctorSchema;
