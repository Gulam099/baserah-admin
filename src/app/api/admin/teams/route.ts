// app/api/admin/teams/route.ts

import { NextRequest, NextResponse } from "next/server";
import { TeamModel } from "@/features/permission/models/team.model";
import { connect } from "@/lib/db";

export async function POST(req: NextRequest) {
  await connect(); // Make sure DB is connected

  try {
    const body = await req.json();
    const { name, members } = body;

    // Validate
    if (!name || !Array.isArray(members) || members.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Team name and at least one member are required",
        },
        { status: 400 }
      );
    }

    // Create team
    const newTeam = await TeamModel.create({ name, members });

    return NextResponse.json(
      {
        success: true,
        message: "Team created successfully",
        team_id: newTeam._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create team error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  await connect();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  const skip = (page - 1) * pageSize;

  try {
    const total = await TeamModel.countDocuments();
    const data = await TeamModel.find()
      .populate("members") // Optional: populate employee data
      .skip(skip)
      .limit(pageSize)
      .lean();

    return NextResponse.json({
      success: true,
      data,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching teams" },
      { status: 500 }
    );
  }
}
