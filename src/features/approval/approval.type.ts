export type ApprovalContentItemType = {
  id:string;
  contentType: "program" | "support_group" | "cultural_library" | "add_specialist";
  specialist: string;
  datetime: string; // ISO string
  approvalStatus: "completed" | "upcoming" | "ongoing" | "cancelled";
  content:any;
};
