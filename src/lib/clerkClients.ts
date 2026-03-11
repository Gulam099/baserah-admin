import { createClerkClient } from "@clerk/nextjs/server";

// ✅ Create Clerk Client
export const clerkDoctorClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY_DOCTOR!,
});

export const clerkPatientClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY_PATIENT!,
});
