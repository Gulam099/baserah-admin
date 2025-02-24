import { ApiResponseType } from "@/features/home/types/type";
import {
  Customer,
  CustomerType,
  MedicalType,
  PaginatedResponse,
} from "../types/customer.type";

const mockCustomers = Array.from({ length: 100 }, (_, i) => ({
  id: `cust${i + 1}`,
  name: "Abdullah Al-Abdulrahman",
  mobileNumber: "+966 050000000",
  idNumber: `Id${Math.floor(Math.random() * 100)}`,
  type: ["all", "vip", "incomplete", "forbidden"][
    Math.floor(Math.random() * 4)
  ] as CustomerType,
  record: {
    medical: Array.from({ length: 20 }, (_, i) => ({
      recordId: `medical${i + 1}`,
      type: ["all", "prescription", "treatment-plans"][
        Math.floor(Math.random() * 3)
      ] as MedicalType,
      specialist_name: "Mada Muhammad Al-Muhammad",
      date: new Date(),
      record_name: "Prescription name",
    })),
  },
}));

export async function fetchCustomers(
  type: CustomerType,
  page: number,
  size: number
): Promise<ApiResponseType> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const filteredCustomers =
    type === "all"
      ? mockCustomers
      : mockCustomers.filter((customer) => customer.type === type);

  const start = (page - 1) * size;
  const end = start + size;

  return {
    success: true,
    status: 200,
    message: "Customers Fetch Successfully",
    data: filteredCustomers.slice(start, end),
    page: {
      total: filteredCustomers.length,
      page,
      size,
    },
  };
}

export async function fetchMedicalRecords(
  type: "all" | "prescription" | "treatment-plans",
  page: number,
  size: number
): Promise<ApiResponseType> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const filteredRecords =
    type === "all"
      ? mockCustomers[0].record.medical
      : mockCustomers[0].record.medical.filter(
          (customer) => customer.type === type
        );

  const start = (page - 1) * size;
  const end = start + size;

  return {
    success: true,
    status: 200,
    message: "Customer's Medical Record Fetch Successfully",
    data: filteredRecords.slice(start, end),
    page: {
      total: filteredRecords.length,
      page,
      size,
    },
  };
}
