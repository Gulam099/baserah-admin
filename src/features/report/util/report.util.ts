import { ApiResponseType } from "@/features/home/types/type";
import { ReportSpecialists } from "../data/report.data";
import { ApiBaseUrl } from "../../../../const";

export async function fetchReportSpecialistRecords(
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
    data: {
      maxSession: 104657,
      specialists: ReportSpecialists.slice(start, end),
    },
    page: {
      total: ReportSpecialists.length,
      page,
      size,
    },
  };
}

export async function fetchPatientReturnStats(): Promise<ApiResponseType> {
  try {
    const response = await fetch(
      `${ApiBaseUrl}/api/admin/appointments/patient-return-stats`
    );
    const data = await response.json();

    if (!data.success) {
      throw new Error("Failed to fetch patient return stats");
    }

    return {
      success: true,
      status: 200,
      message: "Patient return stats fetched successfully",
      data: {
        returningPatients: data.returning_patients,
        nonReturningPatients: data.non_returning_patients,
      },
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "Error fetching patient return stats",
      data: null,
    };
  }
}
