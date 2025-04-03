import { Webhook } from "svix";
import { headers } from "next/headers";
import { createUser, deleteUser, updateUser } from "@/actions/user.action";
import { NextResponse } from "next/server";
import { WebhookEvent, clerkClient } from "@clerk/nextjs/server";
import { UserType } from "@/features/user/types/user.type";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

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
  const client = await clerkClient();

  if (eventType === "user.created") {
    try {
      const {
        id,
        email_addresses,
        image_url,
        first_name,
        last_name,
        phone_numbers,
        public_metadata
      } = evt.data;

      const user: Partial<UserType> = {
        clerkId: id,
        email: email_addresses[0].email_address,
        imageUrl: image_url,
        fullName: (first_name || "First_Name") + (last_name || "Last_Name"),
        mobile_number : phone_numbers[0].phone_number,
        role : public_metadata.role as string
      };

      const newUser = await createUser(user);

      if (newUser) {
        await client.users?.updateUserMetadata(id, {
          publicMetadata: {
            dbUserId: newUser._id,
            role : "user"
          },
        });
      }

      return NextResponse.json({ message: "New user created", user: newUser });
    } catch (error) {
      console.error("Error creating user:", error);
      return NextResponse.json(
        { message: "User creation failed", error: error },
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
        phone_numbers
      } = evt.data;

      const updateData: Partial<UserType> = {
        email: email_addresses[0].email_address,
        imageUrl: image_url,
        fullName: (first_name || "First_Name") + (last_name || "Last_Name"),
        mobile_number : phone_numbers[0].phone_number,
        role : public_metadata.role as string
      };


      const mongoId = public_metadata.dbUserId;

      const updatedUser = await updateUser(mongoId as string, updateData);

      return NextResponse.json({
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      return NextResponse.json(
        { message: "User update failed", error: error },
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
          `User with Clerk ID ${id} has been deleted from the database.`
        );
      } else {
        console.log(`User with Clerk ID ${id} was not found in the database.`);
      }

      return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      return NextResponse.json(
        { message: "User deletion failed", error: error },
        { status: 500 }
      );
    }
  }
  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);

  return new Response("", { status: 200 });
}