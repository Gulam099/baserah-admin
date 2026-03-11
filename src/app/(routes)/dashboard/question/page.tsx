import QuestionPage from "@/features/question/components/question";
import React, { Suspense } from "react";

export default function page() {
  return (
    <Suspense>
      <QuestionPage />
    </Suspense>
  );
}
