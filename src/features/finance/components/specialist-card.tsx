import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddAmountDialog } from "./add-amount-dialog";
import { Specialist } from "../types/finance.type";
import { TransferDialog } from "./transfer-dialog";
import ViewSpecialistDetails from "./view-specialist-details-dialog";
import { t } from "i18next";

// interface SpecialistCardProps {
//   specialist: specialist;
//   viewType: "grid" | "list";
// }

export function SpecialistCard({ specialist, viewType }) {
  return (
    <Card
      className={
        viewType === "grid"
          ? "w-full"
          : "w-full md:flex md:items-center md:justify-between"
      }
    >
      <CardContent className={`pt-6 ${viewType === "list" ? "flex-1" : ""}`}>
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg">{specialist.doctor.full_name}</h3>
            <Badge
              variant={
                specialist.paidStatus === "Paid" ? "secondary" : "destructive"
              }
            >
              {specialist.paidStatus} {specialist.month}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{t("theDateOfJoin")}:</p>
              <p className="font-medium">{specialist.doctor.updatedAt}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
               {t("discountCodePercentage")}:
              </p>
              <p className="font-medium">{specialist.discountPercentage}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
               {t("numberOfSessions")}:
              </p>
              <p className="font-medium">{specialist.sessionCount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("taxRate")}:</p>
              <p className="font-medium">{specialist.taxRate}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("grossIncome")}:</p>
              <p className="font-medium">{specialist.grossIncome} {t("SAR")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("totalTax")}:</p>
              <p className="font-medium">{specialist.totalTax}{t("SAR")}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter
        className={`flex gap-2 ${viewType === "list" ? "flex-shrink-0" : ""}`}
      >
        <ViewSpecialistDetails
          name="Muhammad Al-Abdullah Abdul-Rahman"
          joinDate="5-3-2023"
          ratio="15%"
          discountPercentage="50%"
          grossIncome="10484 SAR"
          numberOfSessions="10484 SAR"
          totalDue="3600"
          totalTax="10484 SAR"
          totalDiscount="1000 SAR"
          specialistRatio="30 SAR"
          badgeLabel="Unpaid January"
          badgeVariant="destructive" // or "default", "secondary", etc.
        />
        <TransferDialog />
        <AddAmountDialog />
      </CardFooter>
    </Card>
  );
}
