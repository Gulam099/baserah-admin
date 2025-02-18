import { ApiResponseType } from "@/features/home/types/type";
import { ReportSpecialists } from "../data/report.data";

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
    data: {maxSession : 104657 , specialists : ReportSpecialists.slice(start, end)},
    page: {
      total: ReportSpecialists.length,
      page,
      size,
    },
  };
}
