import { NextRequest, NextResponse } from "next/server";
import { createClerkClient } from "@clerk/nextjs/server";
import { connect } from "@/lib/db";
import DoctorModel from "@/features/user/model/doctor.model"; // Adjust path as needed

// ✅ Create Clerk Client
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY_DOCTOR!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clerkId } = body;

    if (!clerkId) {
      return NextResponse.json(
        { message: "Missing clerkId in request body" },
        { status: 400 }
      );
    }
    const clerkUser = await clerkClient.users.getUser(clerkId);

    if (!clerkUser) {
      return NextResponse.json(
        { message: "User not found in Clerk" },
        { status: 404 }
      );
    }

    await connect();

    // Prepare doctor data from Clerk user
    const doctorData = {
      clerkId: clerkUser.id,
      full_name: `${clerkUser.firstName || ""} ${
        clerkUser.lastName || ""
      }`.trim(),
      email: clerkUser.emailAddresses?.[0]?.emailAddress || "",
      phoneNumber: clerkUser.phoneNumbers?.[0]?.phoneNumber || "",
      specialization: clerkUser.unsafeMetadata?.specialization || "",
      sub_specialization: clerkUser.unsafeMetadata?.subSpecialization || "",
      experience: clerkUser.unsafeMetadata?.experience || "",
      language: clerkUser.unsafeMetadata?.language || [],
      age_categories: clerkUser.unsafeMetadata?.age_categories || [],
      response_time: clerkUser.unsafeMetadata?.response_time || "",
      consultation_method: clerkUser.unsafeMetadata?.consultation_method || [],
      bio: clerkUser.unsafeMetadata?.bio || "",
      education: clerkUser.unsafeMetadata?.education || [],
      profile_picture: clerkUser.imageUrl || "",
      cv: clerkUser.unsafeMetadata?.cv || "",
      fees: clerkUser.unsafeMetadata?.fees || "",
      address: clerkUser.unsafeMetadata?.address || "",
      available: clerkUser.unsafeMetadata?.available || false,
      approval_status:
        clerkUser.unsafeMetadata?.approval_status || "under_review",
      schedule: (() => {
        const schedule = clerkUser.unsafeMetadata?.schedule;
        return {
          start_time:
            typeof schedule === "object" && schedule && "start_time" in schedule
              ? (schedule as any).start_time || ""
              : "",
          end_time:
            typeof schedule === "object" && schedule && "end_time" in schedule
              ? (schedule as any).end_time || ""
              : "",
          days_of_week:
            typeof schedule === "object" &&
            schedule &&
            "days_of_week" in schedule
              ? (schedule as any).days_of_week || []
              : [],
          timezone:
            typeof schedule === "object" && schedule && "timezone" in schedule
              ? (schedule as any).timezone || ""
              : "",
          effective_from:
            typeof schedule === "object" &&
            schedule &&
            "effective_from" in schedule
              ? (schedule as any).effective_from || ""
              : "",
          effective_to:
            typeof schedule === "object" &&
            schedule &&
            "effective_to" in schedule
              ? (schedule as any).effective_to || ""
              : "",
        };
      })(),
    };

    // Insert or update doctor in MongoDB
    const doctor = await DoctorModel.findOneAndUpdate(
      { clerkId: clerkUser.id },
      doctorData,
      { upsert: true, new: true }
    );

    // ✅ FIXED: Make sure to return the user data for your axios call
    return NextResponse.json(
      {
        message: "Doctor created/updated successfully",
        doctor,
        user: clerkUser, // ✅ Add this so your axios call can access user.unsafeMetadata
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error in POST /api/doctor:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
// ✅ API Route to update a doctor's data in Clerk
export async function PATCH(req: NextRequest) {
  try {
    // ✅ Parse request JSON
    const body = await req.json();
    const { clerkId, updates } = body;
    if (!clerkId || !updates) {
      console.error("❌ [API] Missing clerkId or updates in request");
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedUser = await clerkClient.users?.updateUserMetadata(
      clerkId,
      updates
    );
    return NextResponse.json({
      message: "Doctor updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ [API] Error updating Clerk user:", error);
    return NextResponse.json(
      { message: "Failed to update doctor", error },
      { status: 500 }
    );
  }
}
