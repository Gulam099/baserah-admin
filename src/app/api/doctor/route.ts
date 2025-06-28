import { NextRequest, NextResponse } from "next/server";
import { createClerkClient } from "@clerk/nextjs/server";
import { connect } from "@/lib/db";
import DoctorModel from "@/features/user/model/doctor.model"; // Adjust path as needed
import Doctor from "@/features/user/model/doctor.model";

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
      sub_specialization: clerkUser.unsafeMetadata?.sub_specialization || "",
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
      fcmToken: clerkUser.unsafeMetadata?.fcmToken || "",
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
    const doctor = await Doctor.findOneAndUpdate(
      { clerkId: clerkUser.id },
      doctorData,
      { upsert: true, new: true }
    );

    console.log("✅ Doctor saved successfully");

    try {
      const updatedClerkUser = await clerkClient.users.updateUser(clerkId, {
        publicMetadata: {
          ...clerkUser.publicMetadata,
          dbUserId: doctor._id.toString(),
          userType: "doctor",
          createdAt: new Date().toISOString(),
        },
      });

      console.log(
        "✅ Clerk user public metadata updated successfully",
        updatedClerkUser
      );
    } catch (clerkError) {
      console.error("⚠️ Error updating Clerk metadata:", clerkError);
    }

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
    const body = await req.json();
    const { clerkId, updates } = body;

    if (!clerkId || !updates) {
      return NextResponse.json(
        { message: "Missing clerkId or updates" },
        { status: 400 }
      );
    }

    // ✅ 1. Update Clerk unsafeMetadata
    const updatedClerkUser = await clerkClient.users.updateUserMetadata(
      clerkId,
      updates
    );

    // ✅ 2. Update Doctor DB
    await connect();

    const meta = updates.unsafeMetadata || {};
    console.log("meta", meta);

    const updateFields: any = {
      specialization: meta.specialization,
      sub_specialization: meta.sub_specialization,
      experience: meta.experience,
      response_time: meta.response_time,
      age_categories: meta.age_categories,
      consultation_method: meta.consultation_method,
      education: meta.education,
      language: meta.language,
      fees: meta.fees,
      bio: meta.bio,
      approval_status: meta.approval_status,
    };

    const full_name =
      updates.firstName || updates.lastName
        ? `Dr. ${updates.firstName || ""} ${updates.lastName || ""}`.trim()
        : undefined;

    if (full_name) {
      updateFields.full_name = full_name;
    }

    const updatedDoctor = await Doctor.findOneAndUpdate(
      { clerkId },
      // {
      //   full_name: `${updates.firstName} ${updates.lastName}`,
      //   specialization: meta.specialization,
      //   sub_specialization: meta.sub_specialization,
      //   experience: meta.experience,
      //   response_time: meta.response_time,
      //   age_categories: meta.age_categories,
      //   consultation_method: meta.consultation_method,
      //   education: meta.education,
      //   language: meta.language,
      //   fees: meta.fees,
      //   bio: meta.bio,
      //   approval_status: meta.approval_status,
      // }
      updateFields
    );

    return NextResponse.json({
      message: "Doctor updated in Clerk and DB",
      user: updatedClerkUser,
      doctor: updatedDoctor,
    });
  } catch (error: any) {
    console.error("❌ Error in PATCH /api/doctor:", error);
    return NextResponse.json(
      { message: "Failed to update doctor", error: error.message },
      { status: 500 }
    );
  }
}
