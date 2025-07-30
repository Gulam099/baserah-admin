"use client";

import { EmployeeItemType } from "../types/permission.type";
import { useTranslation } from "react-i18next";


export default function EmployeesView(props: { employees: EmployeeItemType[] }) {
  const { employees } = props;
  const { t } = useTranslation();

  return (
    <div className="p-4 space-y-4">
      {employees.map((emp) => (
        <div key={emp._id} className="p-4 border border-gray-200 rounded-lg">
          <h2 className="text-lg font-semibold">
            {emp.name || t("employees.unnamed")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("employees.role")}: {emp.role || t("employees.notAvailable")}
          </p>
          <p className="text-sm">
            {t("employees.email")}: {emp.email || t("employees.notAvailable")}
          </p>
        </div>
      ))}
    </div>
  );
}
