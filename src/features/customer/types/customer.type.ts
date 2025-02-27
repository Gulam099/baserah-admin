export type CustomerType = "all" | "vip" | "incomplete" | "forbidden";
export type MedicalType = "all" | "prescription" | "treatment-plans";
export type MetricType =
  | "all"
  | "gad-scales"
  | "mood-scales"
  | "quality-Life-scales"
  | "depressive-scales";

export interface Customer {
  id: string;
  name: string;
  mobileNumber: string;
  idNumber: string;
  type: CustomerType;
}

export interface PaginatedResponse {
  data: Customer[];
  total: number;
  page: number;
  pageSize: number;
}
