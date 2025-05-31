import axios from "axios";
import { ApiResponseType } from "@/features/home/types/type";
import { ApiBaseUrl } from "../../../../const";
import { toast } from "sonner";

/**
 * Fetch real appointments data from GET /api/admin/appointments
 * @param page - the current page number
 * @param size - how many records per page
 */
export async function fetchAppointmentsRecords(
  page: number,
  size: number
): Promise<ApiResponseType> {
  try {
    // Example: GET /api/admin/appointments?page=1&page_size=10
    const res = await axios.get(`/api/admin/appointments`, {
      params: {
        page,
        pageSize: size,
      },
    });

    // The response data from your API
    //  {
    //    data: [...],
    //    has_more: true,
    //    page: 1,
    //    page_size: 10,
    //    success: true,
    //    total: 44
    //  }

    const apiData = res.data;
    return {
      success: apiData?.success ?? true,
      status: 200,
      message: "Appointments fetched successfully",
      data: apiData?.data || [],
      page: {
        total: apiData?.total ?? 0,
        page: apiData?.page ?? page,
        size: apiData?.page_size ?? size,
      },
    };
  } catch (error: any) {
    // If needed, transform error before returning/throwing
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

export async function cancelAppointment(
  appointmentId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(
      `${ApiBaseUrl}/api/admin/appointments/${appointmentId}/cancel`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message || "Failed to cancel appointment");

      throw new Error(data.message || "Failed to cancel appointment");
    }
    toast.success("Appointment Successfully Canceled");

    return { success: data.success, message: data.message };
  } catch (error) {
    toast.error("Error cancelling appointment");
    return { success: false, message: "Error cancelling appointment" };
  }
}

export async function modifyAppointment(
  appointmentId: string,
  updates: { appointment_time?: string; doctor_id: string }
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(
      `${ApiBaseUrl}/api/admin/appointments/${appointmentId}/modify`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to modify appointment");
    }

    return { success: data.success, message: data.message };
  } catch (error) {
    return { success: false, message: "Error modifying appointment" };
  }
}
