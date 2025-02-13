import { ApiResponseType } from "@/features/home/types/type";
import { AppointmentType } from "../types/appointment.type";

export const appointments: AppointmentType[] = [
  {
    id: "1",
    number: "187546321",
    name: "Muhammad Al-Khalidi",
    bookingDate: "5-3-2023",
    time: "03:50",
    date: "5-3-2023",
    type: "tabular",
    status: "Completed",
    isImmediate: false,
  },
  {
    id: "2",
    number: "187546321",
    name: "Muhammad Al-Khalidi",
    bookingDate: "5-3-2023",
    time: "03:50",
    date: "5-3-2023",
    type: "tabular",
    status: "Upcoming",
    isImmediate: true,
  },
  {
    id: "3",
    number: "187546321",
    name: "Muhammad Al-Khalidi",
    bookingDate: "5-3-2023",
    time: "03:50",
    date: "5-3-2023",
    type: "tabular",
    status: "Completed",
    isImmediate: false,
  },
  {
    id: "4",
    number: "187546321",
    name: "Muhammad Al-Khalidi",
    bookingDate: "5-3-2023",
    time: "03:50",
    date: "5-3-2023",
    type: "tabular",
    status: "Upcoming",
    isImmediate: true,
  },
  {
    id: "5",
    number: "187546321",
    name: "Muhammad Al-Khalidi",
    bookingDate: "5-3-2023",
    time: "03:50",
    date: "5-3-2023",
    type: "tabular",
    status: "Completed",
    isImmediate: false,
  },
  {
    id: "6",
    number: "187546321",
    name: "Muhammad Al-Khalidi",
    bookingDate: "5-3-2023",
    time: "03:50",
    date: "5-3-2023",
    type: "tabular",
    status: "Upcoming",
    isImmediate: true,
  },
  // Add more mock data as needed...
];

export async function fetchAppointmentsRecords(
  page: number,
  pageSize: number
): Promise<ApiResponseType> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    data: appointments.slice(start, end),
    total: appointments.length,
    page,
    pageSize,
  };
}
