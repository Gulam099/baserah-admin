"use client";

import { useEffect, useState } from "react";
import { Calendar, MoreVertical } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { fetchTransactions } from "@/features/finance/data/finance.data";
import { Transaction } from "@/features/finance/types/finance.type";
import { ArrowLeft, ArrowUpDown, ChevronDown, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { t } from "i18next";

interface DateFilter {
  type: "specific" | "range";
  quickType?: "today" | "week" | "month" | "year";
  specificDate?: string;
  startDate?: string;
  endDate?: string;
}

interface FilterState {
  date: DateFilter | null;
  transactionType: "all" | "credit" | "debit";
  specialist: string;
  sorting: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  const router = useRouter();

  const [filters, setFilters] = useState<FilterState>({
    date: null,
    transactionType: "all",
    specialist: "",
    sorting: "",
  });

  const [dateFilterOpen, setDateFilterOpen] = useState(false);
  const [dateFilterType, setDateFilterType] = useState<"specific" | "range">(
    "specific"
  );

  // Get unique specialists from transactions
  const uniqueSpecialists = Array.from(
    new Set(transactions.map((t) => t.user?.name).filter(Boolean))
  );
  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      try {
        const response = await fetchTransactions(currentPage, pageSize);
        setTransactions(response.data);
        setTotalPages(Math.ceil(response.total / pageSize));
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [currentPage]);

  useEffect(() => {
    let filtered = [...transactions];

    // Date filtering
    if (filters.date) {
      filtered = filtered.filter((transaction) => {
        const transactionDate = new Date(transaction.createdAt);
        const today = new Date();

        switch (filters.date!.type) {
          case "specific":
            if (filters.date!.specificDate) {
              const specificDate = new Date(filters.date!.specificDate);
              return (
                transactionDate.toDateString() === specificDate.toDateString()
              );
            }
            return true;
          case "range":
            if (filters.date!.startDate && filters.date!.endDate) {
              const startDate = new Date(filters.date!.startDate);
              const endDate = new Date(filters.date!.endDate);
              return transactionDate >= startDate && transactionDate <= endDate;
            }
            return true;
          default:
            return true;
        }
      });
    }

    // Transaction type filtering
    if (filters.transactionType) {
      filtered = filtered.filter(
        (transaction) => transaction.type === filters.transactionType
      );
    }

    // Specialist filtering
    if (filters.specialist) {
      filtered = filtered.filter(
        (transaction) => transaction.user?.name === filters.specialist
      );
    }

    // Apply sorting
    if (filters.sorting) {
      switch (filters.sorting) {
        case "amount-asc":
          filtered.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
          break;
        case "amount-desc":
          filtered.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
          break;
        case "date-asc":
          filtered.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          break;
        case "date-desc":
          filtered.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        default:
          break;
      }
    }

    setFilteredTransactions(filtered);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [transactions, filters]);

  const clearAllFilters = () => {
    setFilters({
      date: null,
      transactionType: "all",
      specialist: "",
      sorting: "",
    });
  };

  const handleDateFilter = (dateFilter: DateFilter) => {
    setFilters((prev) => ({ ...prev, date: dateFilter }));
    setDateFilterOpen(false);
  };

  const getDateFilterDisplay = () => {
    if (!filters.date) return t("date");

    switch (filters.date.type) {
      case "specific":
        return filters.date.specificDate
          ? new Date(filters.date.specificDate).toLocaleDateString()
          : "Specific Date";
      case "range":
        return filters.date.startDate && filters.date.endDate
          ? `${new Date(
              filters.date.startDate
            ).toLocaleDateString()} - ${new Date(
              filters.date.endDate
            ).toLocaleDateString()}`
          : "Date Range";
      default:
        return t("date");
    }
  };

  const hasActiveFilters =
    filters.date || filters.transactionType || filters.specialist;

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalFilteredPages = Math.ceil(filteredTransactions.length / pageSize);

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
            <select className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">{t("filtering")}</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Date Dropdown */}
          <Popover open={dateFilterOpen} onOpenChange={setDateFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`justify-between ${
                  filters.date ? "border-blue-500 bg-blue-50" : ""
                }`}
              >
                <Calendar className="w-4 h-4 mr-2" />
                {getDateFilterDisplay()}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <Button
                    variant={
                      dateFilterType === "specific" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setDateFilterType("specific")}
                  >
                    {t("specific")}
                  </Button>
                  <Button
                    variant={dateFilterType === "range" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateFilterType("range")}
                  >
                    {t("range")}
                  </Button>
                </div>
                {dateFilterType === "specific" && (
                  <div className="space-y-2">
                    <Label>{t("selectDate")}</Label>
                    <Input
                      type="date"
                      onChange={(e) => {
                        if (e.target.value) {
                          handleDateFilter({
                            type: "specific",
                            specificDate: e.target.value,
                          });
                        }
                      }}
                    />
                  </div>
                )}

                {dateFilterType === "range" && (
                  <div className="space-y-2">
                    <div>
                      <Label>{t("startDate")}</Label>
                      <Input
                        type="date"
                        onChange={(e) => {
                          const startDate = e.target.value;
                          if (startDate) {
                            setFilters((prev) => ({
                              ...prev,
                              date: {
                                type: "range",
                                startDate,
                                endDate: prev.date?.endDate || "",
                              },
                            }));
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Label>{t("endDate")}</Label>
                      <Input
                        type="date"
                        onChange={(e) => {
                          const endDate = e.target.value;
                          if (endDate && filters.date?.startDate) {
                            handleDateFilter({
                              type: "range",
                              startDate: filters.date.startDate,
                              endDate,
                            });
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Type Dropdown */}
          <div className="relative">
            <select
              value={filters.transactionType}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  transactionType: e.target.value as "credit" | "debit" | "",
                }))
              }
              className={`appearance-none bg-white border rounded px-3 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                filters.transactionType
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              }`}
            >
              <option value="all">{t("all")}</option>
              <option value="credit">{t("credit")}</option>
              <option value="debit">{t("debit")}</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

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
          >
            <ArrowUpDown className="w-4 h-4 mr-1" />
             {t("sortBy")}
          </Button>

          {/* Export */}
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-800"
          >
            <Download className="w-4 h-4 mr-1" />
            {t("export")}
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
               <TableHead>{t("type")}</TableHead>
          <TableHead>{t("amount")}</TableHead>
          <TableHead>{t("date")}</TableHead>
          <TableHead>{t("administrator")}</TableHead>
          <TableHead>{t("walletAmount")}</TableHead>
          <TableHead className="text-right">{t("action")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: pageSize }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    <TableCell colSpan={6}>
                      <div className="h-6 w-full animate-pulse bg-slate-100 rounded" />
                    </TableCell>
                  </TableRow>
                ))
              : transactions.map((transaction, index) => (
                  <TableRow
                    key={transaction.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                  >
                    <TableCell
                      className={
                        transaction.type === "credit"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {transaction.type}
                    </TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>
                      {(() => {
                        const d = new Date(transaction.createdAt);
                        const day = d.getDate();
                        const month = d.getMonth() + 1; // months are 0-based
                        const year = d.getFullYear();
                        return `${day}-${month}-${year}`;
                      })()}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          transaction.isEmployee ? "text-blue-600" : ""
                        }
                      >
                        {transaction?.user?.name || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell>{transaction?.walletData?.amount}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>{t("viewDetails")}</DropdownMenuItem>
                      <DropdownMenuItem>{t("transferToCard")}</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        {t("addToWallet")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || loading}
          >
             {t("previous")}
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                disabled={loading}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || loading}
          >
            {t("next")}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{t("view")}</span>
          <select
            className="h-8 rounded-md border border-input bg-background px-2"
            value={pageSize}
            onChange={(e) => {
              const newSize = Number.parseInt(e.target.value);
              // Handle page size change
            }}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
    </div>
  );
}
