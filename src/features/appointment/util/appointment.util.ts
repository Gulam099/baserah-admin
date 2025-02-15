import { ApiResponseType } from "@/features/home/types/type";
import { appointments } from "../data/appointment.data";

export async function fetchAppointmentsRecords(
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
    message: "Appointments Fetch Successfully",
    data: appointments.slice(start, end),
    page: {
      total: appointments.length,
      page,
      size,
    },
  };
}
