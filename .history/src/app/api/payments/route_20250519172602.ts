import Payment from "@/features/finance/model/payment.model";
import "@/features/user/model/doctor.model";
import "@/features/user/model/patient.model";
import { connect } from "@/lib/db";
import { NextResponse } from "next/server";

interface ApiResponseType<T = any> {
  success: boolean;
  message: string;
  data?: T;
  hasNext?: boolean;
  total?: number;
  currentPage?: number;
}

export async function POST(req: Request) {
  try {
    await connect();
    const data = await req.json();

    const payment = await Payment.create({
      ...data,
      status: "initiated",
    });

    return NextResponse.json<ApiResponseType>(
      {
        success: true,
        message: "Payment object created successfully.",
        data: {
          payment,
          redirectUrl: `/payment/${payment._id}`,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json<ApiResponseType>(
      {
        success: false,
        message: err.message || "Failed to create payment.",
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import Payment from "@/models/payment.model";
import { connect } from "@/utils/db";

export async function GET(req: Request) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("paymentId");
    const doctorId = searchParams.get("doctorId");
    const patientId = searchParams.get("patientId");
    const isAdmin = searchParams.get("isAdmin") === "true";
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "10", 10), 1),
      100
    );
    const skip = (page - 1) * limit;

    // Define population fields for doctor and patient references
    const populateFields = [
      { path: "doctorId", select: "full_name profile_picture specialization" },
      { path: "patientId", select: "name imageUrl cards phoneNumber email" },
    ];

    // Function to fetch payments with filter and pagination
    async function fetchPayments(filter = {}) {
      const [payments, total] = await Promise.all([
        Payment.find(filter)
          .populate(populateFields)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }),
        Payment.countDocuments(filter),
      ]);
      return { payments, total };
    }

    if (isAdmin) {
      const { payments, total } = await fetchPayments();

      console.log("Admin payments sample:", payments[0]);

      const hasNext = skip + payments.length < total;
      return NextResponse.json({
        success: true,
        message: "Payments fetched successfully.",
        data: payments,
        total,
        currentPage: page,
        hasNext,
      });
    }

    if (patientId || doctorId) {
      const filter: any = {};
      if (patientId) filter.patientId = patientId;
      if (doctorId) filter.doctorId = doctorId;

      const { payments, total } = await fetchPayments(filter);

      console.log("Filtered payments sample:", payments[0]);

      const hasNext = skip + payments.length < total;
      return NextResponse.json({
        success: true,
        message: "Filtered payments fetched successfully.",
        data: payments,
        total,
        currentPage: page,
        hasNext,
      });
    }

    if (id) {
      const payment = await Payment.findById(id).populate(populateFields);

      if (!payment) {
        return NextResponse.json(
          { success: false, message: "Payment not found." },
          { status: 404 }
        );
      }

      console.log("Single payment:", payment);

      return NextResponse.json({
        success: true,
        message: "Payment fetched successfully.",
        data: payment,
      });
    }

    // Default: fetch all payments paginated
    const { payments, total } = await fetchPayments();

    const hasNext = skip + payments.length < total;
    return NextResponse.json({
      success: true,
      message: "All payments fetched successfully.",
      data: payments,
      total,
      currentPage: page,
      hasNext,
    });
  } catch (err: any) {
    console.error("GET payments error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch payment." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("paymentId");

    if (!id) {
      return NextResponse.json<ApiResponseType>(
        {
          success: false,
          message: "paymentId is required.",
        },
        { status: 400 }
      );
    }

    const updateData = await req.json();
    const updated = await Payment.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json<ApiResponseType>(
        {
          success: false,
          message: "Payment not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponseType>({
      success: true,
      message: "Payment updated successfully.",
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponseType>(
      {
        success: false,
        message: err.message || "Failed to update payment.",
      },
      { status: 500 }
    );
  }
}
