import GroupPage from "@/features/group/component/Group";
import React, { Suspense } from "react";

export default function page() {
  return (
    <Suspense>
      <GroupPage/>
    </Suspense>
  );
}
