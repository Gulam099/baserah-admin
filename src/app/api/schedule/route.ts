import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Doctor from "@/features/user/model/doctor.model";
import Booking from "@/features/appointment/model/booking.model";

function parseDate(dateStr: string): Date | null {
  const [day, month, year] = dateStr.split("-").map(Number);
  if (!day || !month || !year) return null;
  return new Date(year, month - 1, day);
}

function getDefaultRange(): { from: Date; to: Date } {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 2); // Last day of month
  return { from, to };
}

export async function GET(req: Request) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);

    const doctorId = searchParams.get("doctorId");
    const patientId = searchParams.get("patientId");

    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");

    const fromDate = fromParam ? parseDate(fromParam) : null;
    const toDate = toParam ? parseDate(toParam) : null;

    const { from, to } =
      fromDate && toDate && fromDate <= toDate
        ? { from: fromDate, to: toDate }
        : getDefaultRange();

    if (doctorId) {
      const doctor = await Doctor.findById(doctorId);
      if (!doctor || !doctor.schedule) {
        return NextResponse.json(
          { success: false, message: "Doctor or schedule not found" },
          { status: 404 }
        );
      }

      const {
        days_of_week,
        start_time,
        end_time,
        timezone,
        effective_from,
        effective_to,
      } = doctor.schedule;

      const bookings = await Booking.find({
        doctorId,
        bookingSchedule: {
          $gte: from,
          $lte: to,
        },
      });

      const except: string[] = bookings.map((booking: any) =>
        new Date(booking.bookingSchedule).toISOString()
      );

      return NextResponse.json({
        success: true,
        message: "Doctor schedule fetched successfully.",
        schedule: {
          start_time,
          end_time,
          timezone,
          days_of_week,
          effective_from,
          effective_to,
          except,
        },
      });
    }

    if (patientId) {
      const bookings = await Booking.find({
        patientId,
        bookingSchedule: {
          $gte: from,
          $lte: to,
        },
      });

      const except: string[] = bookings.map((booking: any) =>
        new Date(booking.bookingSchedule).toISOString()
      );

      return NextResponse.json({
        success: true,
        message: "Patient schedule fetched successfully.",
        schedule: {
          start_time: "00:00",
          end_time: "23:59",
          timezone: "UTC",
          days_of_week: [0, 1, 2, 3, 4, 5, 6],
          effective_from: from.toISOString().split("T")[0],
          effective_to: to.toISOString().split("T")[0],
          except,
        },
      });
    }

    return NextResponse.json(
      { success: false, message: "doctorId or patientId is required" },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to fetch schedule.",
      },
      { status: 500 }
    );
  }
}
