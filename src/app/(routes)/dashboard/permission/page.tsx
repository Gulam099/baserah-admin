import PermissionPage from "@/features/permission/components/permission";
import React, { Suspense } from "react";

export default function page() {
  return (
    <Suspense>
      <PermissionPage />
    </Suspense>
  );
}
