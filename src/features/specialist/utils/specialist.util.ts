import { approvals } from "@/features/approval/approval.data";
import { ApiResponseType } from "@/features/home/types/type";
import { mockSpecialist, ratings } from "../data/specialist.data";
import { ApiBaseUrlLocal } from "../../../../const";
import axios from "axios";
import { toast } from "sonner";

export async function fetchSpecialist(
  page: number,
  size: number
): Promise<ApiResponseType> {
  try {
    // Example GET request to /api/doctor/get-doctors
    // with query params { page: 2, pageSize: 5 }
    const response = await axios.get(
      `${ApiBaseUrlLocal}/api/doctors/get-all-doctors`,
      {
        params: { page, pageSize: size },
      }
    );
    const resData = response.data;
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
    };
  } catch (error: any) {
    // Fallback in case of errors
    console.error("Failed to fetch specialists:", error);

    return {
      success: false,
      status: error?.response?.status || 500,
      message:
        error?.response?.data?.message ||
        "Failed to fetch specialists from server.",
      data: [],
      page: {
        total: 0,
        page,
        size,
      },
    };
  }
}

export async function updateDoctor(clerkId: string, updates: any) {
  try {
    const response = await fetch("/api/doctor", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clerkId, updates }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    console.log("✅ Doctor updated successfully:", data);
  } catch (error) {
    console.error("❌ Error updating doctor:", error);
  }
}

export const createDoctor = async (clerkId: string) => {
  try {
    const response = await axios.post(
      "/api/doctor",
      {
        clerkId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
    // console.log("✅ Doctor created successfully:", data);
  } catch (error) {
    console.error("❌ Error creating doctor:", error);
  }
};

export const specialistInitialApproved = async (specialist_id: string) => {
  try {
    const res = await axios.put(
      `${ApiBaseUrl}/api/admin/initial-approval/${specialist_id}`
    );
    const resData = res.data;
    toast.success(resData.message);
  } catch (error: any) {
    const resData = error.response.data;
    toast.error(resData.error || "Failed to Initially Approved Specialist");
  }
};
export const specialistFinalApproved = async (specialist_id: string) => {
  try {
    const res = await axios.put(
      `${ApiBaseUrl}/api/admin/final-approval/${specialist_id}`
    );
    const resData = res.data;
    toast.success(resData.message);
  } catch (error: any) {
    const resData = error.response.data;
    toast.error(resData.error || "Failed to Finally Approved Specialist");
  }
};
export const specialistContractSend = async (specialist_id: string) => {
  try {
    const res = await axios.put(
      `${ApiBaseUrl}/api/admin/send-contract/${specialist_id}`
    );
    const resData = res.data;
    toast.success(resData.message);
  } catch (error: any) {
    const resData = error.response.data;
    toast.error(resData.error || "Failed to send contract to specialist");
  }
};
export const specialistContractAuth = async (specialist_id: string) => {
  try {
    const res = await axios.put(
      `${ApiBaseUrl}/api/admin/authenticate-contract/${specialist_id}`
    );
    const resData = res.data;
    toast.success(resData.message);
  } catch (error: any) {
    const resData = error.response.data;
    toast.error(
      resData.error || "Failed to authenticate contract to specialist"
    );
  }
};

export async function fetchSpecContentRecords(
  doctorId: string,
  page: number,
  size: number
): Promise<ApiResponseType> {
  try {
    const res = await axios.get(
      `${ApiBaseUrlLocal}/api/library/get/${doctorId}`,
      {
        params: { page, size },
      }
    );

    const result = res.data;
    const pagination = result.pagination || {};

    return {
      success: true,
      status: result.status || 200,
      message: result.message || "Approvals Fetch Successfully",
      data: result.data || [],
      page: {
        total: pagination.total_items ?? 0,
        page: pagination.current_page ?? page,
        size: pagination.per_page ?? size,
      },
    };
  } catch (error: any) {
    console.error("Failed to fetch specialist content:", error);

    return {
      success: false,
      status: error?.response?.status || 500,
      message:
        error?.response?.data?.message ||
        "Failed to fetch specialist content from server.",
      data: [],
      page: {
        total: 0,
        page,
        size,
      },
    };
  }
}

export async function fetchSpecRatingRecords(
  doctorId: string,
  page: number,
  size: number
): Promise<ApiResponseType & { averageRating?: string }> {
  try {
    const res = await axios.get(
      `${ApiBaseUrlLocal}/api/ratings/doctor/${doctorId}`,
      {
        params: {
          doctor_id: doctorId,
          page,
          pageSize: size,
        },
      }
    );
    const result = res.data;

    return {
      success: result.success,
      status: result.status,
      message: result.message,
      data: result.data.ratings ?? [], // ensure you're accessing the ratings array
      averageRating: result.data.averageRating, // include this line
      page: {
        total: result.total,
        page: result.page,
        size: result.pageSize,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      status: error?.response?.status || 500,
      message:
        error?.response?.data?.message ||
        "Failed to fetch ratings from server.",
      data: [],
      page: {
        total: 0,
        page,
        size,
      },
    };
  }
}
