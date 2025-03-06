import axios from "axios"
import { ApiResponseType } from "@/features/home/types/type"
import { ApiBaseUrl } from "../../../../const"

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
    const res = await axios.get(`${ApiBaseUrl}/api/admin/appointments`, {
      params: {
        page,
        page_size: size,
      },
    })

    // The response data from your API
    //  {
    //    data: [...],
    //    has_more: true,
    //    page: 1,
    //    page_size: 10,
    //    success: true,
    //    total: 44
    //  }

    const apiData = res.data
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
    }
  } catch (error: any) {
    // If needed, transform error before returning/throwing
    console.error("Failed to fetch appointments:", error)
    return {
      success: false,
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || "Failed to fetch appointments.",
      data: [],
      page: {
        total: 0,
        page,
        size,
      },
    }
  }
}
