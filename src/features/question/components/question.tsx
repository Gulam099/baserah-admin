"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UnifiedPagination from "@/features/home/components/UnifiedPagination";
import ExportButton from "@/features/home/components/ExportButton";
import { Question } from "@/features/question/types/question.type";
import {
  fetchQuestions,
  updateQuestionStatus,
} from "@/features/question/utils/question.util";
import { useSearchParams } from "next/navigation";
import InformationFormDialog from "./QuestionDialog";
import EditQuestionDialog from "./EditQuestionDilaog";
import { toast } from "sonner";

const formSchema = z.object({
  question: z.string().min(10),
  type: z.string(),
  answer: z.string().min(1),
});

export default function QuestionPage() {
  const searchParams = useSearchParams();
  const contentRef = useRef<HTMLDivElement>(null);
  // Read page/pageSize from the URL, or fallback to 1 / 9
  const pageParam = searchParams.get("page");
  const pageSizeParam = searchParams.get("pageSize");
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 9;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0); // track total items


  const refreshQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchQuestions(currentPage, pageSize);
      console.log(res, "response");
      setQuestions(res.data);
      setTotal(res.page?.total!);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

   useEffect(() => {
    refreshQuestions();
  }, [refreshQuestions]);
  console.log("questions", questions);
  // Whenever page/pageSize changes in the URL, fetch new data
  useEffect(() => {
    setLoading(true);
    fetchQuestions(currentPage, pageSize)
      .then((res) => {
        console.log(res, "response");
        setQuestions(res.data);
        setTotal(res.page?.total!); // for UnifiedPagination's `total` prop
      })
      .catch((err) => {
        console.error("Failed to fetch questions:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage, pageSize]);

  const handleStatusChange = async (
    questionId: string,
    status: "published" | "hidden"
  ) => {
    const response = await updateQuestionStatus(questionId, status);

    if (response.success) {
      toast.success(
        `Question ${status === "hidden" ? "hidden" : "published"} successfully`
      );
      refreshQuestions();
      console.log("Status updated:", response.data);
    } else {
      console.error("Error:", response.message);
    }
  };

  return (
    <>
      <div className="container mx-auto ">
        <div className="flex justify-end items-center gap-2 pb-6">
          <ExportButton contentRef={contentRef} />
          <InformationFormDialog
          onSuccess={refreshQuestions}
           />
        </div>
        <div className="min-h-[70vh]">
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 grow-0 shrink  "
            ref={contentRef}
          >
            {loading
              ? Array.from({ length: pageSize }).map((_, i) => (
                  <Card key={`skeleton-${i}`} className="animate-pulse">
                    <CardHeader className="h-16 bg-gray-200 rounded-t-lg" />
                    <CardContent className="h-24 bg-gray-100" />
                    <CardFooter className="h-16 bg-gray-200 rounded-b-lg" />
                  </Card>
                ))
              : questions.map((question) => (
                  <Card key={question._id}>
                    <CardHeader>
                      <Badge
                        variant={
                          question.question_type === "general"
                            ? "success"
                            : question.question_type === "depression_program"
                            ? "warning"
                            : question.question_type === "anxiety_program"
                            ? "default"
                            : "outline"
                        }
                        className="w-fit"
                      >
                        {question.question_type === "general"
                          ? "General"
                          : question.question_type === "depression_program"
                          ? "Depression program"
                          : question.question_type === "anxiety_program"
                          ? "Anxiety program"
                          : question.question_type}
                      </Badge>
                      <h3 className="font-semibold mt-2">
                        {question.question_title}
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {question.answer}
                      </p>
                    </CardContent>
                    <CardFooter className="flex gap-2 print:hidden">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          handleStatusChange(question._id, "hidden")
                        }
                        disabled={question.status === "hidden"}
                      >
                        Hide
                      </Button>
                      <EditQuestionDialog question={question}
                      onSuccess={refreshQuestions}
                       />
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          handleStatusChange(question._id, "published")
                        }
                        disabled={question.status === "published"}
                      >
                        Publish
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
          </div>
        </div>

        <UnifiedPagination total={total} />
      </div>
    </>
  );
}
