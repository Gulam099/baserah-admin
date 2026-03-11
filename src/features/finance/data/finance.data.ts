import { ApiBaseUrl } from "../../../../const";
import {
  FinancialRecord,
  PaginatedResponse,
  Transaction,
} from "../types/finance.type";

export async function fetchTransactions(
  page: number,
  pageSize: number
): Promise<PaginatedResponse> {
  try {
    const res = await fetch(
      `${ApiBaseUrl}/api/walletTransaction/getall?page=${page}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch transactions");
    }

    const data = await res.json();

    return {
      data: data.data as Transaction[],
      total: data.total,
      page: data.page,
      pageSize: data.pageSize,
    };
  } catch (err) {
    console.error("Error fetching transactions:", err);
    return {
      data: [],
      total: 0,
      page,
      pageSize,
    };
  }
}

export async function fetchFinancialRecords(
  page: number,
  pageSize: number
): Promise<PaginatedResponse> {
  try {
    // Call your backend API
    const response = await fetch(
      `${ApiBaseUrl}/api/payments/paidpaymentlist?page=${page}&pageSize=${pageSize}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch financial records");
    }

    const apiResponse = await response.json();

    // Extract the payments array from the response
    // Based on your network response, the data should be in apiResponse.data
    const payments = apiResponse.data || apiResponse || [];

    // Map backend payments -> FinancialRecord[]
    const records: FinancialRecord[] = payments.map((p: any) => ({
      id: p._id,
      specialist: p.doctorId?.full_name || "Unknown Doctor",
      administrator: p.userId?.name || "Unknown User",
      isEmployee: false, // you can adjust based on your schema
      date: new Date(p.createdAt).toLocaleDateString(),
      source: p.description || "Unknown Source",
      amount: p.amount, // Format the amount with currency symbol
    }));

    // If your backend already handles pagination, use the total from API response
    // Otherwise, use the records length for client-side pagination
    const totalRecords = apiResponse.pagination?.totalCount || 0;

    return {
      data: records,
      total: totalRecords,
      page,
      pageSize,
    };
  } catch (error: any) {
    console.error("Error fetching financial records:", error.message);
    return {
      data: [],
      total: 0,
      page,
      pageSize,
    };
  }
}
