export type ApprovalContentItemType = {
  contentType: string;
  specialist: string;
  datetime: string; // ISO string
  approvalStatus: "completed" | "upcoming" | "ongoing" | "cancelled";
};
