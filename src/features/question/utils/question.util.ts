import { ApiResponseType } from "@/features/home/types/type";
import { mockQuestions } from "../data/question.data";

// Mock "fetch" function
export async function fetchQuestions(
  page: number,
  size: number
): Promise<ApiResponseType> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const start = (page - 1) * size;
  const end = start + size;

  return {
    success: true,
    status: 200,
    message: "Questions Fetched",
    data: mockQuestions.slice(start, end),
    page: {
      total: mockQuestions.length,
      page,
      size,
    },
  };
}
