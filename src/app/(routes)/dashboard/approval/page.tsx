import ApprovalContentsPage from "@/features/approval/components/approvals";
import React, { Suspense } from "react";

export default function page() {
  return (
    <Suspense>
      <ApprovalContentsPage />
    </Suspense>
  );
}
