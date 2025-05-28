import { NextRequest, NextResponse } from "next/server";
import { createClerkClient } from "@clerk/nextjs/server";

// ✅ Create Clerk Client
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY_PATIENT!,
});

export async function GET(
  req: NextRequest,
  { params }: { params: { patientId: string } }
) {
  try {
    const { patientId } = params;

    const user = await clerkClient.users.getUser(patientId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 }
      );
    }

    const patient = {
      _id: user.id,
      __v: 0,
      address: user.privateMetadata?.address || { line1: "", line2: "" },
      cards: user.privateMetadata?.cards || [],
      createdAt: user.createdAt,
      dob: user.privateMetadata?.dob || null,
      email: user.emailAddresses?.[0]?.emailAddress || "",
      family: user.privateMetadata?.family || [],
      favorites: user.privateMetadata?.favorites || {
        culturalContent: [],
        doctors: [],
        groups: [],
        programs: [],
      },
      gender: user.privateMetadata?.gender || "Not specified",
      imageUrl: user.imageUrl || null,
      isAuthenticated: user.publicMetadata?.isAuthenticated || false,
      lastOtpSentTime: user.privateMetadata?.lastOtpSentTime,
      otpExpirationTime: user.privateMetadata?.otpExpirationTime,
      name: user.firstName
        ? `${user.firstName} ${user.lastName || ""}`.trim()
        : "Unknown",
      notifications: user.privateMetadata?.notifications || [],
      passcode: user.privateMetadata?.passcode || null,
      phoneNumber: user.phoneNumbers?.[0]?.phoneNumber || "",
      updatedAt: user.updatedAt,
    };

    return NextResponse.json({
      success: true,
      message: "Patient fetched successfully",
      data: patient,
    });
  } catch (error: any) {
    console.error("❌ [API] Error fetching patient:", error);
    return NextResponse.json(
      { message: "Failed to fetch patient", error: error.message },
      { status: 500 }
    );
  }
}

// ✅ API Route to update a patient's data in Clerk
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

    // ✅ Update Clerk User
    console.log(`🔄 [API] Updating Clerk user: ${clerkId} with data`, updates);
    const updatedUser = await clerkClient.users.updateUserMetadata(
      clerkId,
      updates
    );

    console.log("✅ [API] Clerk user updated successfully:", updatedUser);
    return NextResponse.json({
      message: "Patient updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ [API] Error updating Clerk user:", error);
    return NextResponse.json(
      { message: "Failed to update patient", error },
      { status: 500 }
    );
  }
}
