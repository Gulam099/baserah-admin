import { ApiResponseType } from "@/features/home/types/type";
import axios from "axios"
import {
  Customer,
  CustomerType,
  MedicalType,
  MetricType,
  PaginatedResponse,
} from "../types/customer.type";
import { ApiBaseUrl } from "../../../../const";

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
    ticket: Array.from({ length: 20 }, (_, i) => ({
      id: `ticket-${i + 1}`,
      status: ["open", "closed"][Math.floor(Math.random() * 2)],
      type: ["all", "complaint", "inquiry", "feedback"][
        Math.floor(Math.random() * 4)
      ],
      subject: "I cannot add a card",
      date: new Date(),
      reply: "The problem has been solved, you can add it again",
    })),
    comment: Array.from({ length: 20 }, (_, i) => ({
      id: `comment-${i + 1}`,
      name: "Dr. Mada Al-Abdullah Al-Abdulrahman",
      date: new Date(),
      comment: "The problem has been solved, you can add it again",
    })),
  },
}));

export async function fetchCustomers(
  page: number,
  size: number
): Promise<ApiResponseType> {
  try {
    // 1) Make the real API call
    // GET /api/admin/patients?page=2&pageSize=5
    const res = await axios.get(`${ApiBaseUrl}/api/admin/patients`, {
      params: { page, pageSize: size },
    })

    // The response shape from your example:
    // {
    //   "has_more": false,
    //   "page": 2,
    //   "page_size": 10,
    //   "patients": [...],
    //   "success": true,
    //   "total": 10
    // }

    const result = res.data

    // 2) Transform into your ApiResponseType
    return {
      success: result?.success ?? true,
      status: 200,
      message: "Customers Fetch Successfully",
      data: result?.patients ?? [], // The array of patient objects
      page: {
        total: result?.total ?? 0,
        page: result?.page ?? page,
        size: result?.page_size ?? size,
      },
    }
  } catch (error: any) {
    // If something goes wrong, return a fallback response
    console.error("Error fetching customers:", error)

    return {
      success: false,
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || "Failed to fetch customers.",
      data: [],
      page: {
        total: 0,
        page,
        size,
      },
    }
  }
}
// export async function fetchCustomers(
//   type: CustomerType,
//   page: number,
//   size: number
// ): Promise<ApiResponseType> {
//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 1000));

//   const filteredCustomers =
//     type === "all"
//       ? mockCustomers
//       : mockCustomers.filter((customer) => customer.type === type);

//   const start = (page - 1) * size;
//   const end = start + size;

//   return {
//     success: true,
//     status: 200,
//     message: "Customers Fetch Successfully",
//     data: filteredCustomers.slice(start, end),
//     page: {
//       total: filteredCustomers.length,
//       page,
//       size,
//     },
//   };
// }

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
  userId: string,
  page: number,
  size: number
): Promise<ApiResponseType> {
  try {
    let endpoint = "";

    switch (type) {
      case "gad-scales":
        endpoint = `/api/gad-scale/user/${userId}?page=${page}`;
        break;
      case "mood-scales":
        endpoint = `/api/mood-scale/${userId}?page=${page}`;
        break;
      case "depressive-scales":
        endpoint = `/api/depression-scale/user/${userId}?page=${page}`;
        break;
      default:
        throw new Error("Invalid metric type");
    }

    const response = await fetch(
      `https://monkfish-app-6ahnd.ondigitalocean.app${endpoint}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();

    return {
      success: true,
      status: 200,
      message: "Metric records fetched successfully",
      data: data.responses.slice(0, size), // Ensure pagination size
      page: {
        total: data.totalResponses,
        page: data.currentPage,
        size,
      },
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "Error fetching metric records",
      data: [],
      page: {
        total: 0,
        page,
        size,
      },
    };
  }
}


export async function fetchTicketRecords(
  page: number,
  size: number
): Promise<ApiResponseType> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const filteredRecords = mockCustomers[0].record.ticket;
  const start = (page - 1) * size;
  const end = start + size;

  return {
    success: true,
    status: 200,
    message: "Customer's Ticket Record Fetch Successfully",
    data: filteredRecords.slice(start, end),
    page: {
      total: filteredRecords.length,
      page,
      size,
    },
  };
}
export async function fetchCommentRecords(
  page: number,
  size: number
): Promise<ApiResponseType> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const filteredRecords = mockCustomers[0].record.comment;
  const start = (page - 1) * size;
  const end = start + size;

  return {
    success: true,
    status: 200,
    message: "Customer's Ticket Record Fetch Successfully",
    data: filteredRecords.slice(start, end),
    page: {
      total: filteredRecords.length,
      page,
      size,
    },
  };
}
