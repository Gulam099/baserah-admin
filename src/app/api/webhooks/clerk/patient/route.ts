// app/api/webhooks/patient/route.ts

import { Webhook } from "svix";
import { headers } from "next/headers";
import {
  savePatient,
  updatePatient,
  deletePatient,
} from "@/actions/patient.action";
import { NextResponse } from "next/server";
import { WebhookEvent, clerkClient } from "@clerk/nextjs/server";
import { PatientType } from "@/features/user/types/patient.type";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET_PATIENT;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add WEBHOOK_SECRET_PATIENT to .env");
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing Svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Verification failed", { status: 400 });
  }

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
        unsafe_metadata,
      } = evt.data;

      const patient: Partial<PatientType> = {
        clerkId: id,
        name: `${first_name || ""} ${last_name || ""}`.trim(),
        dob: (unsafe_metadata as Record<string, any>)?.dob as string || "",
        email: email_addresses[0]?.email_address || "",
        phoneNumber: phone_numbers[0]?.phone_number || "",
        gender: (unsafe_metadata as Record<string, any>)?.gender as string,
        passcode: (unsafe_metadata as Record<string, any>)?.passcode as string || "",
        favorites: {
          programs: ((unsafe_metadata as Record<string, any>)?.favorites?.programs as string[]) || [],
          doctors: ((unsafe_metadata as Record<string, any>)?.favorites?.doctors as string[]) || [],
          groups: ((unsafe_metadata as Record<string, any>)?.favorites?.groups as string[]) || [],
          culturalContent: ((unsafe_metadata as Record<string, any>)?.favorites?.culturalContent as string[]) || [],
        },
        address: {
          line1: ((unsafe_metadata as Record<string, any>)?.address?.line1 as string) || "",
          line2: ((unsafe_metadata as Record<string, any>)?.address?.line2 as string) || "",
        },
        imageUrl: image_url || "",
        cards: ((unsafe_metadata as Record<string, any>)?.cards as {
          abbreviatedName: string;
          cardNumber: string;
          nameOnCard: string;
          expiryDate: string;
          cvvCode: string;
        }[]) || [],
        family: ((unsafe_metadata as Record<string, any>)?.family as {
          name: string;
          idNumber: string;
          age: number;
          fileNo: string;
          relationship: string;
        }[]) || [],
        notifications: ((unsafe_metadata as Record<string, any>)?.notifications as {
          date: string;
          message: string;
        }[]) || [],
      };
      

      const newPatient = await savePatient(patient);

      if (newPatient) {
        await client.users?.updateUserMetadata(id, {
          publicMetadata: { dbPatientId: newPatient._id },
        });
      }

      return NextResponse.json({
        message: "Patient created",
        patient: newPatient,
      });
    } catch (error) {
      console.error("Error creating patient:", error);
      return NextResponse.json(
        { message: "Patient creation failed", error },
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

      const updateData: Partial<PatientType> = {
        name: `${first_name || ""} ${last_name || ""}`,
        email: email_addresses[0]?.email_address || "",
        phoneNumber: phone_numbers[0]?.phone_number || "",
        gender: (unsafe_metadata as Record<string, any>)?.gender as string,
        dob: (unsafe_metadata as Record<string, any>)?.dob as string,
        address: {
          line1:
            ((unsafe_metadata as Record<string, any>)?.address
              ?.line1 as string) || "",
          line2:
            ((unsafe_metadata as Record<string, any>)?.address
              ?.line2 as string) || "",
        },
        imageUrl: image_url || "",
        favorites: {
          programs:
            ((unsafe_metadata as Record<string, any>)?.favorites
              ?.programs as string[]) || [],
          doctors:
            ((unsafe_metadata as Record<string, any>)?.favorites
              ?.doctors as string[]) || [],
          groups:
            ((unsafe_metadata as Record<string, any>)?.favorites
              ?.groups as string[]) || [],
          culturalContent:
            ((unsafe_metadata as Record<string, any>)?.favorites
              ?.culturalContent as string[]) || [],
        },
        cards:
          ((unsafe_metadata as Record<string, any>)?.cards as {
            abbreviatedName: string;
            cardNumber: string;
            nameOnCard: string;
            expiryDate: string;
            cvvCode: string;
          }[]) || [],
        family:
          ((unsafe_metadata as Record<string, any>)?.family as {
            name: string;
            idNumber: string;
            age: number;
            fileNo: string;
            relationship: string;
          }[]) || [],
        notifications:
          ((unsafe_metadata as Record<string, any>)?.notifications as {
            date: string;
            message: string;
          }[]) || [],
      };

      const mongoId = public_metadata.dbPatientId;
      const updatedPatient = await updatePatient(mongoId as string, updateData);

      return NextResponse.json({
        message: "Patient updated successfully",
        patient: updatedPatient,
      });
    } catch (error) {
      console.error("Error updating patient:", error);
      return NextResponse.json(
        { message: "Patient update failed", error },
        { status: 500 }
      );
    }
  }

  if (eventType === "user.deleted") {
    try {
      const deletedPatient = await deletePatient(id as string);

      return NextResponse.json({ message: "Patient deleted successfully" });
    } catch (error) {
      console.error("Error deleting patient:", error);
      return NextResponse.json(
        { message: "Patient deletion failed", error },
        { status: 500 }
      );
    }
  }

  return new Response("", { status: 200 });
}
