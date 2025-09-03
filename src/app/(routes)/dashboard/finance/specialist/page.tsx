"use client";

import { useEffect, useState } from "react";
import { LayoutGrid, List, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Specialist } from "@/features/finance/types/finance.type";
import { SpecialistCard } from "@/features/finance/components/specialist-card";
import { SpecialistDetailsModal } from "@/features/finance/components/specialist-payment";
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
import { ArrowLeft, ArrowUpDown, ChevronDown, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { groupPaymentsByDoctor } from "@/hooks/group-payment";

type Payment = {
  userId?: { name?: string };
  doctorId?: { _id?: string; full_name?: string };
  status?: string | number;
  amount?: number | string;
};

export default function SpecialistsPage() {
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const router = useRouter();

  const [selectedFiltering, setSelectedFiltering] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedSpecialist, setSelectedSpecialist] = useState("");
  const [paymentsData, setPaymentsData] = useState<{
    payments: Payment[];
    total: number;
    currentPage: number;
    hasNext: boolean;
  }>({
    payments: [],
    total: 0,
    currentPage: 1,
    hasNext: false,
  });
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const fetchPayments = async (page = 1) => {
    const limit = 50; // fetch more since grouping
    const res = await fetch(`/api/payments?page=${page}&limit=${limit}`);
    const data = await res.json();
    if (data.success) {
      setPaymentsData({
        payments: data.data,
        total: data.total,
        currentPage: data.currentPage,
        hasNext: data.hasNext,
      });
    }
  };

  useEffect(() => {
    fetchPayments(1);
  }, []);

  // 🔎 Apply frontend filtering before grouping
  const filteredPayments = paymentsData.payments.filter((p) => {
    const searchLower = debouncedSearch.toLowerCase();
    return (
      p.userId?.name?.toLowerCase().includes(searchLower) ||
      p.doctorId?.full_name?.toLowerCase().includes(searchLower) ||
      p.status?.toString().toLowerCase().includes(searchLower) ||
      p.amount?.toString().includes(searchLower)
    );
  });

  const grouped = groupPaymentsByDoctor(filteredPayments);

  // Helper: Format "Paid in January" or "Unpaid January"
  function getPaidLabel(s: Specialist) {
    return s.paidStatus === "Paid" ? `Paid in ${s.month}` : `Unpaid ${s.month}`;
  }
  const clearAllFilters = () => {
    setSelectedFiltering("");
    setSelectedDate("");
    setSelectedType("");
    setSelectedSpecialist("");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-800"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
      </div>
      <div className="flex items-center justify-between mb-6 py-3 border-b border-gray-200">
        <div className="flex items-center gap-4">
          {/* Filtering Dropdown */}
          <div className="relative">
            <select
              value={selectedFiltering}
              onChange={(e) => setSelectedFiltering(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Filtering</option>
              <option value="recent">Recent</option>
              <option value="amount">By Amount</option>
              <option value="date">By Date</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Date Dropdown */}
          <div className="relative">
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Date</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Type Dropdown */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Type</option>
              <option value="debtor">Debtor</option>
              <option value="creditor">Creditor</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Specialist's Dropdown */}
          <div className="relative">
            <select
              value={selectedSpecialist}
              onChange={(e) => setSelectedSpecialist(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Specialist's</option>
              <option value="john">John Doe</option>
              <option value="jane">Jane Smith</option>
              <option value="bob">Bob Johnson</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Clear All Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-600 hover:text-gray-800"
          >
            Clear All
          </Button>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-3">
          {/* Sort by */}
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowUpDown className="w-4 h-4 mr-1" />
            Sort by
          </Button>

          {/* Export */}
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-800"
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

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
          {grouped.map((specialist) => (
            <SpecialistCard
              key={specialist.doctorId}
              specialist={specialist.doctor}
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
              {grouped.map((s) => (
                <tr key={s.doctor.id} className="border-b last:border-none">
                  <td className="p-4">{s.doctor.full_name}</td>
                  <td className="p-4">{"N/A"}</td>
                  <td className="p-4">{s.totalAmount}</td>
                  <td className="p-4">{"N/A"} %</td>
                  {/* For example, "the due" might be s.totalDue if you have that field */}
                  <td className="p-4">{"N/A"}</td>
                  <td className="p-4">
                    <Badge
                      variant={
                        s.doctor.paidStatus === "Paid"
                          ? "success"
                          : "destructive"
                      }
                    >
                      {getPaidLabel(s.doctor)}
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
                        <DropdownMenuItem asChild>
                          <SpecialistDetailsModal
                            doctor={s.doctor}
                            payments={s.payments}
                            totalAmount={s.totalAmount}
                          >
                            <div className="w-full rounded-md border px-2.5 py-2.5 text-sm hover:bg-gray-100 cursor-pointer">
                              View Details
                            </div>
                          </SpecialistDetailsModal>
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
