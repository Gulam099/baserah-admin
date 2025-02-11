import {
  PaginatedResponseType,
  SpecialistType,
} from "../types/specialist.type";

const mockSpecialist: SpecialistType[] = Array.from({ length: 50 }, (_, i) => ({
  id: `emp${i + 1}`,
  name: "Abdullah Al-Abdulrahman",
  jobTitle: "Psychologist",
  date: "2023-12-25",
  qualification: "Bachelor's Degree",
  status: [
    "Initially Approved",
    "Will End soon",
    "Approval Pending",
    "Approved",
    "Previously Rejected",
  ][Math.floor(Math.random() * 5)] as SpecialistType["status"],
}));

export async function fetchSpecialist(
  page: number,
  pageSize: number
): Promise<PaginatedResponseType> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    data: mockSpecialist.slice(start, end),
    total: mockSpecialist.length,
    page,
    pageSize,
  };
}
