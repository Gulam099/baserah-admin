import { ApiResponseType } from "@/features/home/types/type";
import { approvals } from "../approval.data";
import { ApiBaseUrl } from "../../../../const";

export async function fetchApprovalsRecords(page: number, size: number) {
  try {
    // Fetch data from the API endpoint
    const response = await fetch(`${ApiBaseUrl}/api/admin/library/all`);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON data
    const result = await response.json();

    return {
      success: true,
      status: result.status || 200,
      message: result.message || "Approvals fetched successfully",
      data: result.data,
      page: {
        total: result.pagination.total_items,
        page: result.pagination.current_page,
        size: result.pagination.current_page,
      },
    };
  } catch (error) {
    console.error("Error fetching approvals:", error);
    return {
      success: false,
      status: 500,
      message: "Failed to fetch approvals",
      data: [],
      page: {
        total: 0,
        page,
        size,
      },
    };
  }
}

export async function fetchApprovalContent(
  id: string
): Promise<ApiResponseType> {
  try {
    const response = await fetch(`${ApiBaseUrl}/api/library?content_id=${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch approval content");
    }

    return {
      success: true,
      status: response.status,
      message: "Approval Fetch Successfully",
      data: data.data, // Assuming the API returns data inside a `data` field
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
}

export async function updateApprovalStatus(
  contentId: string,
  status: "approved" | "pending" | "cancelled",
  approvedBy: string
): Promise<ApiResponseType> {
  try {
    const response = await fetch(`${ApiBaseUrl}/api/admin/library/approval`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content_id: contentId,
        status,
        approved_by: approvedBy,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update approval status");
    }

    return {
      success: true,
      status: response.status,
      message: "Approval status updated successfully",
      data: data.data, // Assuming the API response includes a `data` field
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
}

