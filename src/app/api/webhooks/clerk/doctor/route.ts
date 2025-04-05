import { Webhook } from "svix";
import { headers } from "next/headers";
import { createUser, deleteUser, updateUser } from "@/actions/doctor.action";
import { NextResponse } from "next/server";
import { WebhookEvent, createClerkClient } from "@clerk/nextjs/server";
import { DoctorType } from "@/features/user/types/doctor.type";
// import { createClerkClient } from "@clerk/backend";

// ✅ Fix: Use the correct Clerk Secret Key
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY_DOCTOR!;
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET_DOCTOR!;

if (!CLERK_SECRET_KEY || !WEBHOOK_SECRET) {
  throw new Error(
    "Please add CLERK_SECRET_KEY_DOCTOR and CLERK_WEBHOOK_SECRET_DOCTOR to .env"
  );
}

// ✅ Fix: Create Clerk Client only once
const client = createClerkClient({ secretKey: CLERK_SECRET_KEY });

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  const { id } = evt.data;
  const eventType = evt.type;
  // const client = await clerkClient();

  if (eventType === "user.created") {
    try {
      const {
        id,
        email_addresses,
        image_url,
        first_name,
        last_name,
        phone_numbers,
        public_metadata,
        unsafe_metadata,
      } = evt.data;

      const user: Partial<DoctorType> = {
        clerkId: id,
        full_name: (first_name || "") + (last_name || ""),
        phoneNumber: phone_numbers[0]?.phone_number,
        email: email_addresses[0]?.email_address || "",
        profile_picture: image_url,
        specialization: unsafe_metadata.specialization as string,
        sub_specialization: unsafe_metadata.sub_specialization as string,
        experience: unsafe_metadata.experience as string,
        language: unsafe_metadata.language as string[],
        age_categories: unsafe_metadata.age_categories as string[],
        response_time: unsafe_metadata.response_time as string,
        consultation_method: unsafe_metadata.consultation_method as string[],
        bio: unsafe_metadata.bio as string,
        education: unsafe_metadata.education as string[],
        cv: unsafe_metadata.cv as string,
        fees: unsafe_metadata.fees as string,
        schedules: unsafe_metadata.schedules as Record<string, any>,
        address: unsafe_metadata.address as string,
        available: unsafe_metadata.available as boolean,
        approval_status: unsafe_metadata.approval_status as string,
      };

      const newUser = await createUser(user);

      if (newUser) {
        console.log("User created — syncing metadata");
        console.log("New User ID to sync:", newUser._id);
        console.log("Clerk ID received:", id);

        // Small delay to ensure Clerk has processed the user
        await new Promise((resolve) => setTimeout(resolve, 2000));

        try {
          await client.users?.updateUserMetadata(id, {
            publicMetadata: { dbUserId: newUser._id },
          });
        } catch (err) {
          console.error("Failed to sync metadata to Clerk:", err);
        }
      }

      return NextResponse.json({
        message: "New doctor created",
        user: newUser,
      });
    } catch (error) {
      console.error("Error creating doctor:", error);
      return NextResponse.json(
        { message: "Doctor creation failed", error: error },
        { status: 500 }
      );
    }
  }
  if (eventType === "user.updated") {
    try {
      const {
        public_metadata,
        email_addresses,
        image_url,
        first_name,
        last_name,
        phone_numbers,
        unsafe_metadata,
      } = evt.data;

      const updateData: Partial<DoctorType> = {
        full_name: (first_name || "") + (last_name || ""),
        phoneNumber: phone_numbers[0]?.phone_number,
        email: email_addresses[0]?.email_address,
        profile_picture: image_url,
        specialization: unsafe_metadata.specialization as string,
        sub_specialization: unsafe_metadata.sub_specialization as string,
        experience: unsafe_metadata.experience as string,
        language: unsafe_metadata.language as string[],
        age_categories: unsafe_metadata.age_categories as string[],
        response_time: unsafe_metadata.response_time as string,
        consultation_method: unsafe_metadata.consultation_method as string[],
        bio: unsafe_metadata.bio as string,
        education: unsafe_metadata.education as string[],
        cv: unsafe_metadata.cv as string,
        fees: unsafe_metadata.fees as string,
        schedules: unsafe_metadata.schedules as Record<string, any>,
        address: unsafe_metadata.address as string,
        available: unsafe_metadata.available as boolean,
        approval_status: unsafe_metadata.approval_status as string,
      };

      const mongoId = public_metadata.dbUserId;

      const updatedUser = await updateUser(mongoId as string, updateData);

      return NextResponse.json({
        message: "Doctor updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating doctor:", error);
      return NextResponse.json(
        { message: "Doctor update failed", error: error },
        { status: 500 }
      );
    }
  }
  if (eventType === "user.deleted") {
    try {
      // Extract the user ID from the event data
      const { id } = evt.data;

      // Assuming you have a function `deleteUser` to remove a user from your database
      const deletedUser = await deleteUser(id as string);

      if (deletedUser) {
        console.log(
          `Doctor with Clerk ID ${id} has been deleted from the database.`
        );
      } else {
        console.log(
          `Doctor with Clerk ID ${id} was not found in the database.`
        );
      }

      return NextResponse.json({ message: "Doctor deleted successfully" });
    } catch (error) {
      console.error("Error deleting doctor:", error);
      return NextResponse.json(
        { message: "Doctor deletion failed", error: error },
        { status: 500 }
      );
    }
  }
  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);

  return new Response("", { status: 200 });
}
