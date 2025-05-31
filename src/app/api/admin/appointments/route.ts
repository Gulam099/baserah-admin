// app/api/appointments/route.ts
import mongoose from "mongoose";
import "@/features/user/model/user.model";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/db";
import { AppointmentModel } from "@/features/appointment/model/appoinment.model";

export async function GET(req: NextRequest) {
  try {
    await connect(); // Make sure the DB connection is established

    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    const skip = (page - 1) * pageSize;

    const [appointments, total] = await Promise.all([
      AppointmentModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate("userId")
        .lean(),
      AppointmentModel.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      data: appointments,
      page,
      page_size: pageSize,
      has_more: skip + pageSize < total,
      total,
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch appointments." },
      { status: 500 }
    );
  }
}
