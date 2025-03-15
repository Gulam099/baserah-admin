export type ApprovalContentItemType = {
  _id: string;
  approval_status: "approved" | "pending" | "cancelled"; // Assuming possible statuses
  approved_at: string; // Date in string format
  approved_by: string;
  category: string;
  doctor_name: string;
  file_url: string | null;
  note: string;
  title: string;
  type: "text" | "video" | "article" | "audio"; // Assuming possible types
  uploaded_by: string;
};
