// app/api/admin/employees/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/db";
import { EmployeeModel } from "@/features/permission/models/employee.model";
import { TeamModel } from "@/features/permission/models/team.model";

const CLERK_ADMIN_KEY = process.env.CLERK_SECRET_KEY as string;
const CLERK_API_URL = "https://api.clerk.com/v1/users";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, role, department, team_id, permissions } = body;
    console.log("persmission>>", permissions);

    if (
      !name ||
      !role ||
      !department ||
      !team_id ||
      !Array.isArray(permissions)
    ) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    await connect();

    const [firstName, ...lastNameParts] = name.split(" ");
    const lastName = lastNameParts.join(" ");

    // 1. Create Clerk user
    const clerkRes = await fetch(CLERK_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CLERK_ADMIN_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: [email],
        password: "Temp@1234",
        first_name: firstName,
        last_name: lastName,
        legal_accepted_at: new Date().toISOString(),
        unsafe_metadata: {
          role,
          department,
          permissions,
        },
      }),
    });

    console.log("clerk update", clerkRes);

    if (!clerkRes.ok) {
      const errorData = await clerkRes.json();
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create Clerk user",
          error: errorData,
        },
        { status: 500 }
      );
    }

    const clerkUser = await clerkRes.json();

    // 2. Save employee to MongoDB
    const newEmployee = await EmployeeModel.create({
      name,
      email,
      role,
      department,
      clerk_id: clerkUser.id,
      permissions,
    });

    console.log("clerk >>", newEmployee.permissions);

    console.log("newemployee", newEmployee);

    // 3. Add to team
    await TeamModel.findByIdAndUpdate(
      team_id,
      { $addToSet: { members: newEmployee._id } },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Employee created successfully",
      employee_id: newEmployee._id,
    });
  } catch (error: any) {
    console.error("Employee creation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create employee",
        error: error.message,
      },
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
    const total = await EmployeeModel.countDocuments();
    const data = await EmployeeModel.find().skip(skip).limit(pageSize).lean();

    return NextResponse.json({
      success: true,
      data,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching employees" },
      { status: 500 }
    );
  }
}
