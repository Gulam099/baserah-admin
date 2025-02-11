export type CustomerType = "all" | "vip" | "incomplete" | "forbidden"

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

