import { NextRequest, NextResponse } from "next/server";
import { createClerkClient } from "@clerk/nextjs/server";

// ✅ Create Clerk Client
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY_PATIENT!,
});

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
