import { approvals } from "@/features/approval/approval.data";
import { ApiResponseType } from "@/features/home/types/type";
import { mockSpecialist, ratings } from "../data/specialist.data";

export async function fetchSpecialist(
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
    message: "Report Fetch Successfully",
    data: mockSpecialist.slice(start, end),
    page: {
      total: mockSpecialist.length,
      page,
      size,
    },
  };
}

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
