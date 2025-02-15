import { ApiResponseType } from "@/features/home/types/type";
import { approvals } from "../approval.data";

export async function fetchApprovalsRecords(
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
    message: "Approvals Fetch Successfully",
    data: approvals.slice(start, end),
    page: {
      total: approvals.length,
      page,
      size,
    },
  };
}
