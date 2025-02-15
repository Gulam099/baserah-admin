import { Question } from "../types/question.type";

export const mockQuestions: Question[] = Array.from({ length: 50 }, (_, i) => ({
    id: `q${i + 1}`,
    tag: i % 3 === 0 ? "General" : "Anxiety program",
    title: "The wording of the first question?",
    content:
      "ext of the answer to the question Text of the answer to the question Text of the answer to the",
  }));