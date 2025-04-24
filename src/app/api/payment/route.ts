import Payment from "@/features/finance/model/payment.model";
import "@/features/user/model/doctor.model";
import  "@/features/user/model/patient.model";
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

    return NextResponse.json<ApiResponseType>({
      success: true,
      message: "Payment object created successfully.",
      data: {
        payment,
        redirectUrl: `/payment/${payment._id}`,
      },
    }, { status: 201 });

  } catch (err: any) {
    return NextResponse.json<ApiResponseType>({
      success: false,
      message: err.message || "Failed to create payment.",
    }, { status: 500 });
  }
}

export async function GET(req: Request) {
    try {
      await connect();
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("paymentId");
      const isAdmin = searchParams.get("isAdmin") === "true";
      const page = parseInt(searchParams.get("page") || "1", 10);
      const limit = parseInt(searchParams.get("limit") || "10", 10);
  
      if (isAdmin) {
        const skip = (page - 1) * limit;
  
        const [payments, total] = await Promise.all([
          Payment.find({})
            .populate("doctorId", "full_name profile_picture")
            .populate("patientId", "name imageUrl cards phoneNumber email")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }),
          Payment.countDocuments(),
        ]);
  
        const hasNext = skip + payments.length < total;
  
        return NextResponse.json<ApiResponseType>({
          success: true,
          message: "Payments fetched successfully.",
          data: payments,
          total,
          currentPage: page,
          hasNext,
        });
      }
  
      if (!id) {
        return NextResponse.json<ApiResponseType>({
          success: false,
          message: "paymentId is required.",
        }, { status: 400 });
      }
  
      const payment = await Payment.findById(id)
      .populate({
        path: "doctorId",
        select: "full_name profile_picture specialization",
        model: "Doctor",
      })
      .populate({
        path: "patientId",
        select: "name imageUrl cards phoneNumber email",
        model: "Patient",
      });
  
      if (!payment) {
        return NextResponse.json<ApiResponseType>({
          success: false,
          message: "Payment not found.",
        }, { status: 404 });
      }
  
      return NextResponse.json<ApiResponseType>({
        success: true,
        message: "Payment fetched successfully.",
        data: payment,
      });
    } catch (err: any) {
      return NextResponse.json<ApiResponseType>({
        success: false,
        message: err.message || "Failed to fetch payment.",
      }, { status: 500 });
    }
  }

export async function PATCH(req: Request) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("paymentId");

    if (!id) {
      return NextResponse.json<ApiResponseType>({
        success: false,
        message: "paymentId is required.",
      }, { status: 400 });
    }

    const updateData = await req.json();
    const updated = await Payment.findByIdAndUpdate(id, updateData, { new: true });

    if (!updated) {
      return NextResponse.json<ApiResponseType>({
        success: false,
        message: "Payment not found.",
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponseType>({
      success: true,
      message: "Payment updated successfully.",
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponseType>({
      success: false,
      message: err.message || "Failed to update payment.",
    }, { status: 500 });
  }
}
