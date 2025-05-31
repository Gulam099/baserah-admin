// app/api/admin/patients/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClerkClient } from "@clerk/nextjs/server";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY_PATIENT!,
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    const result = await clerkClient.users.getUserList({
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    const patients = (result.data || []).map((user) => ({
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
    }));

    return NextResponse.json({
      success: true,
      message: "Patients fetched successfully",
      data: patients,
      page: {
        page,
        size: pageSize,
        total: patients.length, // Clerk does not provide total count
      },
    });
  } catch (error: any) {
    console.error("❌ [API] Error fetching all patients:", error);
    return NextResponse.json(
      { message: "Failed to fetch patients", error: error.message },
      { status: 500 }
    );
  }
}
