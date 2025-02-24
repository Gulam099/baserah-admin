export type CustomerType = "all" | "vip" | "incomplete" | "forbidden"
export type MedicalType = "all" | "prescription" | "treatment-plans"

export interface Customer {
  id: string
  name: string
  mobileNumber: string
  idNumber: string
  type: CustomerType
}

export interface PaginatedResponse {
  data: Customer[]
  total: number
  page: number
  pageSize: number
}

