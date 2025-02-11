import {
  Customer,
  CustomerType,
  PaginatedResponse,
} from "../types/customer.type";

const mockCustomers: Customer[] = Array.from({ length: 100 }, (_, i) => ({
  id: `cust${i + 1}`,
  name: "Abdullah Al-Abdulrahman",
  mobileNumber: "+966 050000000",
  idNumber: "102040400",
  type: ["all", "vip", "incomplete", "forbidden"][
    Math.floor(Math.random() * 4)
  ] as CustomerType,
}));

export async function fetchCustomers(
  type: CustomerType,
  page: number,
  pageSize: number
): Promise<PaginatedResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const filteredCustomers =
    type === "all"
      ? mockCustomers
      : mockCustomers.filter((customer) => customer.type === type);

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    data: filteredCustomers.slice(start, end),
    total: filteredCustomers.length,
    page,
    pageSize,
  };
}
