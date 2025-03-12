"use client";

import { EmployeeItemType } from "../types/permission.type";

export default function EmployeesView(props: { employees: EmployeeItemType[] }) {
  const { employees } = props;

  return (
    <div className="p-4 space-y-4">
      {employees.map((emp) => (
        <div key={emp._id} className="p-4 border border-gray-200 rounded-lg">
          <h2 className="text-lg font-semibold">{emp.name || "Unnamed"}</h2>
          <p className="text-sm text-muted-foreground">
            Role: {emp.role || "N/A"}
          </p>
          <p className="text-sm">Email: {emp.email || "N/A"}</p>
        </div>
      ))}
    </div>
  );
}
