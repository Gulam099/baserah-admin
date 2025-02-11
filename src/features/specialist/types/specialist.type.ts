export type SpecialistStatusType =
  | "Initially Approved"
  | "Will End soon"
  | "Approval Pending"
  | "Approved"
  | "Previously Rejected";

export interface SpecialistType {
  id: string;
  name: string;
  jobTitle: string;
  date: string;
  qualification: string;
  status: SpecialistStatusType;
}

export interface PaginatedResponseType {
  data: SpecialistType[];
  total: number;
  page: number;
  pageSize: number;
}
