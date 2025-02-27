import { ApiResponseType } from "@/features/home/types/type";
import {
  Customer,
  CustomerType,
  MedicalType,
  MetricType,
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
      specialist_image: "https://randomuser.me/api/portraits",
      specialist_specialization: "Psychiatrist",
      date: new Date(),
      record_name: "Prescription name",
    })),
    metric: Array.from({ length: 40 }, (_, i) => ({
      id: `scale-${i + 1}`,
      type: [
        "all",
        "gad-scales",
        "mood-scales",
        "quality-Life-scales",
        "depressive-scales",
      ][Math.floor(Math.random() * 5)] as MetricType,
      scale_score: Math.floor(Math.random() * 100),
      date: new Date(),
      scale_desc: "Moderate risk of depression",
    })),
    ticket: Array.from({ length: 40 }, (_, i) => ({
      id: `ticket-${i + 1}`,
      status: ["open", "closed"][Math.floor(Math.random() * 2)],
      type: ["all", "complaint", "inquiry", "feedback"][
        Math.floor(Math.random() * 4)
      ],
      subject: "I cannot add a card",
      date: new Date(),
      reply: "The problem has been solved, you can add it again",
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

export async function fetchMetricRecords(
  type: MetricType,
  page: number,
  size: number
): Promise<ApiResponseType> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const filteredRecords =
    type === "all"
      ? mockCustomers[0].record.metric
      : mockCustomers[0].record.metric.filter(
          (customer) => customer.type === type
        );

  const start = (page - 1) * size;
  const end = start + size;

  return {
    success: true,
    status: 200,
    message: "Customer's Metric Record Fetch Successfully",
    data: filteredRecords.slice(start, end),
    page: {
      total: filteredRecords.length,
      page,
      size,
    },
  };
}
