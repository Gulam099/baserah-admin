export interface Question {
  _id: string;
  created_at: string;
  question_type: "depression_program" | "general" | "anxiety_program";
  question_title: string;
  answer: string;
  status: string;
}
