import { approvals } from "@/features/approval/approval.data";
import { ApiResponseType } from "@/features/home/types/type";
import { mockSpecialist, ratings } from "../data/specialist.data";
import { ApiBaseUrl } from "../../../../const";
import axios from "axios";

export async function fetchSpecialist(
  page: number,
  size: number
): Promise<ApiResponseType> {
  try {
    // Example GET request to /api/doctor/get-doctors
    // with query params { page: 2, pageSize: 5 }
    const response = await axios.get(`${ApiBaseUrl}/api/doctor/get-doctors`, {
      params: { page, pageSize: size },
    })

    // The server response looks like:
    // {
    //   "data": [...],
    //   "has_more": false,
    //   "message": "Doctors fetched successfully",
    //   "page": 1,
    //   "page_size": 10,
    //   "status": 200,
    //   "success": true,
    //   "total": 4
    // }

    const resData = response.data

    // Transform into your ApiResponseType
    return {
      success: resData?.success ?? true,
      status: resData?.status ?? 200,
      message: resData?.message ?? "Report Fetch Successfully",
      data: resData?.data ?? [],
      page: {
        total: resData?.total ?? 0,
        page: resData?.page ?? page,
        size: resData?.page_size ?? size,
      },
    }
  } catch (error: any) {
    // Fallback in case of errors
    console.error("Failed to fetch specialists:", error)

    return {
      success: false,
      status: error?.response?.status || 500,
      message:
        error?.response?.data?.message || "Failed to fetch specialists from server.",
      data: [],
      page: {
        total: 0,
        page,
        size,
      },
    }
  }
}

// export async function fetchSpecialist(
//   page: number,
//   size: number
// ): Promise<ApiResponseType> {
//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 1000));

//   const start = (page - 1) * size;
//   const end = start + size;

//   return {
//     success: true,
//     status: 200,
//     message: "Report Fetch Successfully",
//     data: mockSpecialist.slice(start, end),
//     page: {
//       total: mockSpecialist.length,
//       page,
//       size,
//     },
//   };
// }

export async function fetchSpecContentRecords(
  page: number,
  size: number
): Promise<ApiResponseType> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const sendData = approvals.slice(0, 3);

  const start = (page - 1) * size;
  const end = start + size;

  return {
    success: true,
    status: 200,
    message: "Approvals Fetch Successfully",
    data: sendData.slice(start, end),
    page: {
      total: sendData.length,
      page,
      size,
    },
  };
}

export async function fetchSpecRatingRecords(
  page: number,
  size: number
): Promise<ApiResponseType> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const start = (page - 1) * size;
  const end = start + size;

  return {
    success: true,
    status: 200,
    message: "Ratings Fetch Successfully",
    data: ratings.slice(start, end),
    page: {
      total: ratings.length,
      page,
      size,
    },
  };
}
