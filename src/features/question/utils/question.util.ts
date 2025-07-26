import { ApiResponseType } from "@/features/home/types/type";
import { ApiBaseUrl } from "../../../../const";

export async function fetchQuestions(
  page: number,
  size: number
): Promise<ApiResponseType> {
  try {
    const response = await fetch(
      `${ApiBaseUrl}/api/group/fetch-group?admin=true&page=${page}&size=${size}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }

    const data = await response.json();
console.log(data, 'fetch data')
    return {
      success: true,
      status: response.status,
      message: "group Fetched",
      data: data?.data || [],
      page: {
        total: data?.data?.length || 0,
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

export async function updateQuestionStatus(
  questionId: string,
  status: "published" | "hidden"
): Promise<ApiResponseType> {
  try {
    const response = await fetch(
      `${ApiBaseUrl}/api/admin/update/${questionId}`,
      {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update question status");
    }

    return {
      success: true,
      status: response.status,
      message: "Question status updated successfully",
      data,
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      data: null,
    };
  }
}

export async function editQuestion(
  questionId: string,
  updateData: Partial<{
    answer: string;
    question_title: string;
    question_type: string;
  }>
): Promise<ApiResponseType> {
  try {
    const response = await fetch(
      `${ApiBaseUrl}/api/admin/edit/${questionId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update question");
    }

    return {
      success: true,
      status: response.status,
      message: "Question updated successfully",
      data,
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      data: null,
    };
  }
}
