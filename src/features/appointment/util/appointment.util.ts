import axios from "axios";
import { ApiResponseType } from "@/features/home/types/type";
import { ApiBaseUrlLocal } from "../../../../const";

/**
 * Fetch both doctor bookings and instant bookings,
 * merge them, and return in the same format as before.
 */
export async function fetchAppointmentsRecords(
  page: number,
  size: number
): Promise<ApiResponseType> {
  try {
    // Run both API calls in parallel
    const [bookingsRes, instantRes] = await Promise.all([
      axios.get(`${ApiBaseUrlLocal}/api/doctor/admin/bookings`, {
        params: { page, pageSize: size },
      }),
      axios.get(`${ApiBaseUrlLocal}/api/instantbookings/admin/instantbooking`, {
        params: { page, pageSize: size },
      }),
    ]);

    const bookingsData = bookingsRes.data?.data || [];
    const instantData = instantRes.data?.data || [];

    // Normalize instant bookings so they match bookings fields
    const formattedInstant = instantData.map((item: any) => ({
      ...item,
      program: item.program || "urgent",
      date: item.date || item.appointmentDate,
      time: item.time || item.appointmentTime,
    }));

    // Merge both lists
    const mergedData = [...bookingsData, ...formattedInstant];
    console.log("mer", mergedData);

    // Combine total counts from both APIs
    const totalCount =
      (bookingsRes.data?.total ?? 0) + (instantRes.data?.total ?? 0);

    return {
      success: true,
      status: 200,
      message: "Appointments fetched successfully",
      data: mergedData,
      page: {
        total: totalCount,
        page,
        size,
      },
    };
  } catch (error: any) {
    console.error("Failed to fetch appointments:", error);
    return {
      success: false,
      status: error?.response?.status || 500,
      message:
        error?.response?.data?.message || "Failed to fetch appointments.",
      data: [],
      page: {
        total: 0,
        page,
        size,
      },
    };
  }
}
