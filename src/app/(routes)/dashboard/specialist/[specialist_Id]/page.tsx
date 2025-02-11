import React from "react";

export default function SpecialistViewPage({
  params,
}: {
  params: { specialist_Id: string };
}) {
  const { specialist_Id } = params;

  return (
    <div>
      <div>Specialist : {specialist_Id}</div>
    </div>
  );
}
