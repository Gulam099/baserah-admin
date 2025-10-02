import Payment from "@/features/finance/model/payment.model";
import "@/features/user/model/doctor.model";
import "@/features/user/model/user.model";
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

    // ---- Base Filter ----
    const filter: any = {};
    if (doctorId) filter.doctorId = new mongoose.Types.ObjectId(doctorId);
    if (patientId) filter.userId = new mongoose.Types.ObjectId(patientId);
    if (id) filter._id = new mongoose.Types.ObjectId(id);

    // ---- Enhanced Aggregation for All Booking Types ----
    const payments = await Payment.aggregate([
      { $match: filter },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },

      // Convert string IDs to ObjectIds for lookups
      {
        $addFields: {
          bookingObjectId: {
            $cond: {
              if: { $ne: ["$bookingId", null] },
              then: { $toObjectId: "$bookingId" },
              else: null,
            },
          },
          groupbookingObjectId: {
            $cond: {
              if: { $ne: ["$groupbookingId", null] },
              then: { $toObjectId: "$groupbookingId" },
              else: null,
            },
          },
          programbookingObjectId: {
            $cond: {
              if: { $ne: ["$programbookingId", null] },
              then: { $toObjectId: "$programbookingId" },
              else: null,
            },
          },
        },
      },

      // Lookup for scheduled bookings
      {
        $lookup: {
          from: "bookings",
          localField: "bookingObjectId",
          foreignField: "_id",
          as: "scheduleBooking",
        },
      },

      // Lookup for instant bookings
      {
        $lookup: {
          from: "instantbookings",
          localField: "bookingObjectId",
          foreignField: "_id",
          as: "instantBooking",
        },
      },

      // Lookup for group bookings (you need to replace "groupbookings" with your actual collection name)
      {
        $lookup: {
          from: "groupbookings", // Replace with your actual group booking collection name
          localField: "groupbookingObjectId",
          foreignField: "_id",
          as: "groupBooking",
        },
      },

      // Lookup for program bookings (you need to replace "programbookings" with your actual collection name)
      {
        $lookup: {
          from: "programbookings", // Replace with your actual program booking collection name
          localField: "programbookingObjectId",
          foreignField: "_id",
          as: "programBooking",
        },
      },

      // Create unified bookingData and sessionCount
      {
        $addFields: {
          bookingData: {
            $switch: {
              branches: [
                {
                  case: { $gt: [{ $size: "$scheduleBooking" }, 0] },
                  then: {
                    $mergeObjects: [
                      { $arrayElemAt: ["$scheduleBooking", 0] },
                      { bookingType: "Scheduled" },
                    ],
                  },
                },
                {
                  case: { $gt: [{ $size: "$instantBooking" }, 0] },
                  then: {
                    $mergeObjects: [
                      { $arrayElemAt: ["$instantBooking", 0] },
                      { bookingType: "Instant" },
                    ],
                  },
                },
                {
                  case: { $gt: [{ $size: "$groupBooking" }, 0] },
                  then: {
                    $mergeObjects: [
                      { $arrayElemAt: ["$groupBooking", 0] },
                      { bookingType: "Support Group" },
                    ],
                  },
                },
                {
                  case: { $gt: [{ $size: "$programBooking" }, 0] },
                  then: {
                    $mergeObjects: [
                      { $arrayElemAt: ["$programBooking", 0] },
                      { bookingType: "Program" },
                    ],
                  },
                },
              ],
              default: null,
            },
          },

          // Calculate session count based on booking type
          sessionCount: {
            $switch: {
              branches: [
                {
                  // For scheduled and instant bookings, get numberOfSessions from the booking
                  case: {
                    $or: [
                      { $gt: [{ $size: "$scheduleBooking" }, 0] },
                      { $gt: [{ $size: "$instantBooking" }, 0] },
                    ],
                  },
                  then: {
                    $cond: {
                      if: { $gt: [{ $size: "$scheduleBooking" }, 0] },
                      then: {
                        $arrayElemAt: ["$scheduleBooking.numberOfSessions", 0],
                      },
                      else: {
                        $arrayElemAt: ["$instantBooking.numberOfSessions", 0],
                      },
                    },
                  },
                },
                {
                  // For group bookings, return 1 (or get from group booking if it has session count)
                  case: { $gt: [{ $size: "$groupBooking" }, 0] },
                  then: 1, // Or use: { $arrayElemAt: ["$groupBooking.numberOfSessions", 0] } if group bookings have this field
                },
                {
                  // For program bookings, return 1 (or get from program booking if it has session count)
                  case: { $gt: [{ $size: "$programBooking" }, 0] },
                  then: 1, // Or use: { $arrayElemAt: ["$programBooking.numberOfSessions", 0] } if program bookings have this field
                },
              ],
              default: 0,
            },
          },
        },
      },

      // Doctor info
      {
        $lookup: {
          from: "doctors",
          localField: "doctorId",
          foreignField: "_id",
          as: "doctorId",
        },
      },
      { $unwind: { path: "$doctorId", preserveNullAndEmptyArrays: true } },

      // User info
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      { $unwind: { path: "$userId", preserveNullAndEmptyArrays: true } },

      // Clean up temporary fields
      {
        $project: {
          bookingObjectId: 0,
          groupbookingObjectId: 0,
          programbookingObjectId: 0,
          scheduleBooking: 0,
          instantBooking: 0,
          groupBooking: 0,
          programBooking: 0,
        },
      },
    ]);

    const total = await Payment.countDocuments(filter);
    const hasNext = skip + payments.length < total;

    return NextResponse.json<ApiResponseType>({
      success: true,
      message: "Payments with booking sessions fetched successfully.",
      data: payments,
      total,
      currentPage: page,
      hasNext,
    });
  } catch (err: any) {
    console.error("GET payments error:", err);
    return NextResponse.json<ApiResponseType>(
      { success: false, message: err.message || "Failed to fetch payments." },
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
