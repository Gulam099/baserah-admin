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
    // Run all API calls in parallel
    const [bookingsRes, instantRes, groupsRes, programsRes] = await Promise.all([
      axios.get(`${ApiBaseUrlLocal}/api/doctor/admin/bookings`, {
        params: { page, pageSize: size },
      }),
      axios.get(`${ApiBaseUrlLocal}/api/instantbookings/admin/instantbooking`, {
        params: { page, pageSize: size },
      }),
      axios.get(`${ApiBaseUrlLocal}/api/groups-booking/fetch-group`, {
        params: { page, pageSize: size },
      }),
      axios.get(`${ApiBaseUrlLocal}/api/programs-booking/fetch-program`, {
        params: { page, pageSize: size },
      }),
    ]);

    const bookingsData = bookingsRes.data?.data || [];
    const instantData = instantRes.data?.data || [];
    const groupsData = groupsRes.data?.data || [];
    const programsData = programsRes.data?.data || [];

    // Normalize instant bookings
    const formattedInstant = instantData.map((item: any) => ({
      ...item,
      program: item.program || "urgent",
      date: item.date || item.appointmentDate,
      time: item.time || item.appointmentTime,
      type: "urgent",
    }));

    // Normalize group bookings
    const formattedGroups = groupsData.map((item: any) => ({
      ...item,
      type: "group",
      program: item.title || "Group",
      // Map other fields if necessary
    }));

    // Normalize program bookings
    const formattedPrograms = programsData.map((item: any) => ({
      ...item,
      type: "program",
      program: item.title || "Program",
      // Map other fields if necessary
    }));

    // Merge all lists
    const mergedData = [
      ...bookingsData.map((b: any) => ({ ...b, type: "scheduled" })),
      ...formattedInstant,
      ...formattedGroups,
      ...formattedPrograms,
    ];

    // Combine total counts from all APIs
    const totalCount =
      (bookingsRes.data?.total ?? 0) +
      (instantRes.data?.total ?? 0) +
      (groupsRes.data?.page?.total ?? 0) +
      (programsRes.data?.page?.total ?? 0);

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
