"use client";

import { useEffect, useState } from "react";
import { LayoutGrid, List, MoreVertical, Loader2 } from "lucide-react";
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
// Import your existing page loading component
import PageLoading from "@/components/page-loading";
import { t } from "i18next";

type Payment = {
  userId?: { name?: string };
  doctorId?: { _id?: string; full_name?: string };
  status?: string | number;
  amount?: number | string;
};

interface DateFilter {
  type: "specific" | "range";
  quickType?: "today" | "week" | "month" | "year";
  specificDate?: string;
  startDate?: string;
  endDate?: string;
}
interface FilterState {
  date: DateFilter | null;
  sourceType: string;
  specialist: string;
  sorting: string;
}
export default function SpecialistsPage() {
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  // Loading states
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    date: null,
    sourceType: "",
    specialist: "",
    sorting: "",
  });
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

  const fetchPayments = async (page = 1, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else if (page === 1) {
        setIsInitialLoading(true);
      }

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
    } catch (error) {
      console.error("Failed to fetch payments:", error);
      // You might want to show an error toast here
    } finally {
      setIsInitialLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPayments(1);
  }, []);

  // Handle export with loading state
  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Simulate export API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Replace with actual export logic
      console.log("Exporting data...");
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

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

  const groupedSpecialists = groupPaymentsByDoctor(filteredPayments);

  // Apply specialist filter
  const filteredSpecialists = filters.specialist
    ? groupedSpecialists.filter(
        (specialist) => specialist.doctor?.full_name === filters.specialist
      )
    : groupedSpecialists;

  // Get unique specialists for dropdown
  const uniqueSpecialists = Array.from(
    new Set(groupedSpecialists.map((r) => r.doctor?.full_name).filter(Boolean))
  );

  const clearAllFilters = () => {
    setSelectedFiltering("");
    setSelectedDate("");
    setSelectedType("");
    setFilters((prev) => ({ ...prev, specialist: "" }));
  };

  // Show page loading component for initial load
  if (isInitialLoading) {
    return <PageLoading />;
  }

  // Loading skeleton for grid view
  const GridSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="border rounded-lg p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );

  // Loading skeleton for table view
  const TableSkeleton = () => (
    <div className="overflow-x-auto rounded-md border">
      <table className="min-w-full text-sm">
        <thead className="bg-muted">
          <tr className="text-left">
            <th className="p-4 font-semibold">{t("nameOfSpecialist")}</th>
            <th className="p-4 font-semibold">{t("numberOfSessions")}</th>
            <th className="p-4 font-semibold">{t("income")}</th>
            <th className="p-4 font-semibold">{t("discountPercentage")}</th>
            <th className="p-4 font-semibold">{t("theDue")}</th>
            <th className="p-4 font-semibold">{t("condition")}</th>
            <th className="p-4 font-semibold">{t("action")}</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, i) => (
            <tr key={i} className="border-b animate-pulse">
              <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </td>
              <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </td>
              <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </td>
              <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </td>
              <td className="p-4">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </td>
              <td className="p-4">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </td>
              <td className="p-4">
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

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
          {t("back")}
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
              disabled={isLoadingMore}
            >
              <option value="">{t("filtering")}</option>
              {/* <option value="recent">Recent</option>
              <option value="amount">By Amount</option>
              <option value="date">By Date</option> */}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Date Dropdown */}
          {/* <div className="relative">
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoadingMore}
            >
              <option value="">Date</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div> */}

          {/* Type Dropdown */}
          {/* <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoadingMore}
            >
              <option value="">Type</option>
              <option value="debtor">Debtor</option>
              <option value="creditor">Creditor</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div> */}

          {/* Specialist's Dropdown */}
          <div className="relative">
            <select
              value={filters.specialist}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  specialist: e.target.value,
                }))
              }
              className={`appearance-none bg-white border rounded px-3 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                filters.specialist
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              }`}
            >
              <option value="">{t("specialist")}</option>
              {uniqueSpecialists.map((specialist) => (
                <option key={specialist} value={specialist}>
                  {specialist}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Clear All Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-600 hover:text-gray-800"
            disabled={isLoadingMore}
          >
            {t("clearAll")}
          </Button>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-3">
          {/* Sort by */}
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-800"
            disabled={isLoadingMore}
          >
            <ArrowUpDown className="w-4 h-4 mr-1" />
            {t("sortBy")}
          </Button>

          {/* Export */}
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-800"
            onClick={handleExport}
            disabled={isExporting || isLoadingMore}
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-1" />
            )}
            {t("export")}
          </Button>
        </div>
      </div>

      {/* Header / Title / View Toggle */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">
          {t("specialistsPercentageAndConsultationCosts")}
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant={viewType === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewType("grid")}
            disabled={isLoadingMore}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewType === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewType("list")}
            disabled={isLoadingMore}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Loading indicator for filter changes */}
      {isLoadingMore && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span className="text-sm text-gray-600">{t("loading")}</span>
        </div>
      )}

      {/* Show skeleton while loading more, otherwise show actual content */}
      {isLoadingMore ? (
        viewType === "grid" ? (
          <GridSkeleton />
        ) : (
          <TableSkeleton />
        )
      ) : (
        <>
          {/* Conditionally render grid or table */}
          {viewType === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSpecialists.map((specialist) => (
                <SpecialistCard
                  key={specialist.doctorId}
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
                    <th className="p-4 font-semibold">
                      {t("nameOfSpecialist")}
                    </th>
                    <th className="p-4 font-semibold">
                      {t("numberOfSessions")}
                    </th>
                    <th className="p-4 font-semibold">{t("income")}</th>
                    <th className="p-4 font-semibold">
                      {t("discountPercentage")}
                    </th>
                    <th className="p-4 font-semibold">{t("theDue")}</th>
                    <th className="p-4 font-semibold">{t("condition")}</th>
                    <th className="p-4 font-semibold">{t("action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSpecialists.map((s) => (
                    <tr key={s.doctor.id} className="border-b last:border-none">
                      <td className="p-4">{s.doctor.full_name}</td>
                      <td className="p-4">{s.sessionCount}</td>
                      <td className="p-4">{s.totalAmount}</td>
                      <td className="p-4">{"N/A"} %</td>
                      <td className="p-4">{"N/A"}</td>
                      <td className="p-4">
                        {/* <Badge
                          variant={
                            s.doctor.paidStatus === "Paid"
                              ? "success"
                              : "destructive"
                          }
                        >
                          {getPaidLabel(s.doctor)}
                        </Badge> */}
                        {"N/A"}
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
                                  {t("viewDetails")}
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

          {/* Empty state */}
          {!isLoadingMore && filteredSpecialists.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-400 text-lg mb-2">
                {t("noSpecialistsFound")}
              </div>
              <div className="text-gray-500 text-sm">
                {t("tryAdjustingFilters")}
              </div>
            </div>
          )}
        </>
      )}

      {/* Simple pagination at bottom */}
      <div className="mt-8 flex justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => {
            const newPage = Math.max(1, currentPage - 1);
            setCurrentPage(newPage);
            fetchPayments(newPage, true);
          }}
          disabled={currentPage === 1 || isLoadingMore}
        >
          {isLoadingMore && currentPage > 1 ? (
            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
          ) : null}
          {t("previous")}
        </Button>

        {[1, 2, 3].map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => {
              setCurrentPage(page);
              fetchPayments(page, true);
            }}
            disabled={isLoadingMore}
          >
            {isLoadingMore && currentPage === page ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              page
            )}
          </Button>
        ))}

        <Button
          variant="outline"
          onClick={() => {
            const newPage = currentPage + 1;
            setCurrentPage(newPage);
            fetchPayments(newPage, true);
          }}
          disabled={currentPage === 3 || isLoadingMore}
        >
          {isLoadingMore && currentPage < 3 ? (
            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
          ) : null}
          {t("next")}
        </Button>
      </div>
    </div>
  );
}
