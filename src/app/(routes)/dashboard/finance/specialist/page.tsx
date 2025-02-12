"use client";

import { useState } from "react";
import { LayoutGrid, List, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Specialist } from "@/features/finance/types/finance.type";
import { SpecialistCard } from "@/features/finance/components/specialist-card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ViewSpecialistDetails from "@/features/finance/components/view-specialist-details-dialog";
import { TransferDialog } from "@/features/finance/components/transfer-dialog";
import { AddAmountDialog } from "@/features/finance/components/add-amount-dialog";

// Example mock data
const mockSpecialists: Specialist[] = [
  {
    id: "1",
    name: "Mada Muhammad Al-Muhammad",
    joinDate: "5-3-2024",
    discountPercentage: 50,
    numberOfSessions: 1000,
    specialistRatio: 50,
    taxRate: 15,
    grossIncome: 10484,
    totalTax: 1002,
    status: "active",
    paidStatus: "Paid", // or "Unpaid"
    month: "January",
  },
  {
    id: "2",
    name: "Abdullah Al-Abdullah",
    joinDate: "2-3-2023",
    discountPercentage: 50,
    numberOfSessions: 298,
    specialistRatio: 50,
    taxRate: 15,
    grossIncome: 10484,
    totalTax: 1002,
    status: "active",
    paidStatus: "Unpaid",
    month: "January",
  },
  {
    id: "3",
    name: "Abdullah Al-Abdullah",
    joinDate: "7-1-2023",
    discountPercentage: 50,
    numberOfSessions: 200,
    specialistRatio: 50,
    taxRate: 15,
    grossIncome: 10484,
    totalTax: 1002,
    status: "active",
    paidStatus: "Paid",
    month: "January",
  },
  // ... more items ...
];

export default function SpecialistsPage() {
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Helper: Format "Paid in January" or "Unpaid January"
  function getPaidLabel(s: Specialist) {
    return s.paidStatus === "Paid" ? `Paid in ${s.month}` : `Unpaid ${s.month}`;
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header / Title / View Toggle */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">
          Specialists Percentage And Consultation Costs
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant={viewType === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewType("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewType === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewType("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Conditionally render grid or table */}
      {viewType === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockSpecialists.map((specialist) => (
            <SpecialistCard
              key={specialist.id}
              specialist={specialist}
              viewType={viewType}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <table className="min-w-full text-sm">
            <thead className="bg-muted">
              <tr className="text-left">
                <th className="p-4 font-semibold">Name of the specialist</th>
                <th className="p-4 font-semibold">Number of sessions</th>
                <th className="p-4 font-semibold">Income</th>
                <th className="p-4 font-semibold">Discount percentage</th>
                <th className="p-4 font-semibold">The due</th>
                <th className="p-4 font-semibold">Condition</th>
                <th className="p-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {mockSpecialists.map((s) => (
                <tr key={s.id} className="border-b last:border-none">
                  <td className="p-4">{s.name}</td>
                  <td className="p-4">{s.numberOfSessions}</td>
                  <td className="p-4">{s.grossIncome}</td>
                  <td className="p-4">{s.discountPercentage}%</td>
                  {/* For example, "the due" might be s.totalDue if you have that field */}
                  <td className="p-4">{3600}</td>
                  <td className="p-4">
                    <Badge
                      variant={
                        s.paidStatus === "Paid" ? "success" : "destructive"
                      }
                    >
                      {getPaidLabel(s)}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
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
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <TransferDialog />
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <AddAmountDialog />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Simple pagination at bottom */}
      <div className="mt-8 flex justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        {[1, 2, 3].map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage === 3}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
