import { z } from "zod";

export const patientSchema = z.object({
  _id: z.string().optional(),
  clerkId: z.string().min(1, "Clerk ID is required"),
  name: z.string(),
  address: z.object({
    line1: z.string(),
    line2: z.string().optional(),
  }),
  gender: z.string().optional(),
  dob: z.string(),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone Number is required"),
  passcode: z.string().min(6),
  favorites: z.object({
    programs: z.array(z.string()),
    doctors: z.array(z.string()),
    groups: z.array(z.string()),
    culturalContent: z.array(z.string()),
  }),
  imageUrl: z.string().url(),
  cards: z.array(
    z.object({
      abbreviatedName: z.string(),
      cardNumber: z.string(),
      nameOnCard: z.string(),
      expiryDate: z.string(),
      cvvCode: z.string(),
    })
  ),
  family: z.array(
    z.object({
      name: z.string(),
      idNumber: z.string(),
      age: z.number().min(0),
      fileNo: z.string(),
      relationship: z.string(),
    })
  ),
  notifications: z.array(
    z.object({
      date: z.string(),
      message: z.string(),
    })
  ),
});
