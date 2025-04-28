import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Booking from "@/features/appointment/model/booking.model";
import "@/features/user/model/doctor.model";
import  "@/features/user/model/patient.model";
import  "@/features/finance/model/payment.model";

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
    const body = await req.json();

    const booking = await Booking.create(body);

    return NextResponse.json<ApiResponseType>(
      {
        success: true,
        message: "Booking created successfully.",
        data: booking,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json<ApiResponseType>(
      {
        success: false,
        message: error.message || "Failed to create booking.",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
    try {
      await connect();
      const { searchParams } = new URL(req.url);
  
      const bookingId = searchParams.get("bookingId");
      const paymentId = searchParams.get("paymentId");
      const patientId = searchParams.get("patientId");
      const doctorId = searchParams.get("doctorId");
      const status = searchParams.get("status"); // status to filter by
      const isAdmin = searchParams.get("isAdmin") === "true";
  
      const page = parseInt(searchParams.get("page") || "1", 10);
      const limit = parseInt(searchParams.get("limit") || "10", 10);
      const skip = (page - 1) * limit;
  
      const filter: { [key: string]: any } = {};
  
      // Apply filters for status, patientId, or doctorId if passed
      if (status) filter.status = status;
      if (patientId) filter.patientId = patientId;
      if (doctorId) filter.doctorId = doctorId;
  
      if (bookingId) {
        // Fetch by Booking ID
        const booking = await Booking.findOne({ bookingId })
          .populate("patientId", "name imageUrl phoneNumber email cards")
          .populate("doctorId", "full_name profile_picture");
  
        if (!booking) {
          return NextResponse.json<ApiResponseType>({
            success: false,
            message: "Booking not found.",
          }, { status: 404 });
        }
  
        return NextResponse.json<ApiResponseType>({
          success: true,
          message: "Booking fetched successfully.",
          data: booking,
        });
      }
  
      if (paymentId) {
        // Fetch by Payment ID
        const booking = await Booking.findOne({ paymentId })
          .populate("patientId", "name imageUrl phoneNumber email cards")
          .populate("doctorId", "full_name profile_picture");
  
        if (!booking) {
          return NextResponse.json<ApiResponseType>({
            success: false,
            message: "Booking not found with this Payment ID.",
          }, { status: 404 });
        }
  
        return NextResponse.json<ApiResponseType>({
          success: true,
          message: "Booking fetched successfully.",
          data: booking,
        });
      }
  
      if (patientId) {
        // Fetch all bookings related to a specific patient with optional status filter
        const bookings = await Booking.find(filter)
          .populate("patientId", "name imageUrl phoneNumber email cards")
          .populate("doctorId", "full_name profile_picture")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);
  
        return NextResponse.json<ApiResponseType>({
          success: true,
          message: "Bookings fetched successfully for the patient.",
          data: bookings,
        });
      }
  
      if (doctorId) {
        // Fetch all bookings related to a specific doctor with optional status filter
        const bookings = await Booking.find(filter)
          .populate("patientId", "name imageUrl phoneNumber email cards")
          .populate("doctorId", "full_name profile_picture")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);
  
        return NextResponse.json<ApiResponseType>({
          success: true,
          message: "Bookings fetched successfully for the doctor.",
          data: bookings,
        });
      }
  
      if (isAdmin) {
        // Fetch all bookings with Pagination for Admin with optional status filter
        const total = await Booking.countDocuments(filter);
        const bookings = await Booking.find(filter)
          .populate("patientId", "name imageUrl phoneNumber email cards")
          .populate("doctorId", "full_name profile_picture")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);
  
        const hasNext = page * limit < total;
  
        return NextResponse.json<ApiResponseType>({
          success: true,
          message: "All bookings fetched successfully.",
          data: bookings,
          total,
          currentPage: page,
          hasNext,
        });
      }
  
      // If none of bookingId, paymentId, patientId, doctorId, or isAdmin
      return NextResponse.json<ApiResponseType>({
        success: false,
        message: "bookingId, paymentId, patientId, doctorId, or isAdmin is required.",
      }, { status: 400 });
  
    } catch (error: any) {
      return NextResponse.json<ApiResponseType>({
        success: false,
        message: error.message || "Failed to fetch booking(s).",
      }, { status: 500 });
    }
  }
  

export async function PATCH(req: Request) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("bookingId");
    if (!id) {
      return NextResponse.json<ApiResponseType>(
        {
          success: false,
          message: "bookingId is required.",
        },
        { status: 400 }
      );
    }

    const body = await req.json();

    const updated = await Booking.findByIdAndUpdate(id, body, { new: true });

    if (!updated) {
      return NextResponse.json<ApiResponseType>(
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponseType>({
      success: true,
      message: "Booking updated successfully.",
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json<ApiResponseType>(
      {
        success: false,
        message: error.message || "Failed to update booking.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("bookingId");
    if (!id) {
      return NextResponse.json<ApiResponseType>(
        {
          success: false,
          message: "bookingId is required.",
        },
        { status: 400 }
      );
    }

    const deleted = await Booking.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json<ApiResponseType>(
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponseType>({
      success: true,
      message: "Booking deleted successfully.",
    });
  } catch (error: any) {
    return NextResponse.json<ApiResponseType>(
      {
        success: false,
        message: error.message || "Failed to delete booking.",
      },
      { status: 500 }
    );
  }
}
