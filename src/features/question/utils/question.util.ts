import { ApiResponseType } from "@/features/home/types/type";
import { ApiBaseUrl } from "../../../../const";

export async function fetchQuestions(
  page: number,
  size: number
): Promise<ApiResponseType> {
  try {
    const response = await fetch(
      `${ApiBaseUrl}/api/admin/questions?admin=true&page=${page}&size=${size}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }

    const data = await response.json();

    return {
      success: true,
      status: response.status,
      message: "Questions Fetched",
      data: data.questions || [],
      page: {
        total: data.questions?.length || 0,
        page,
        size,
      },
    };
  } catch (error) {
    console.error("Error fetching questions:", error);
    return {
      success: false,
      status: 500,
      message: "Failed to fetch questions",
      data: [],
      page: {
        total: 0,
        page,
        size,
      },
    };
  }
}
