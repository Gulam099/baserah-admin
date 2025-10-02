"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  ArrowLeft,
  ArrowUpDown,
  ChevronDown,
  Download,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FinancialRecord } from "@/features/finance/types/finance.type";
import { fetchFinancialRecords } from "@/features/finance/data/finance.data";
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
  sourceType: string;
  specialist: string;
  sorting: string;
}

export default function FinancialDetailsPage() {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const router = useRouter();

  const [filters, setFilters] = useState<FilterState>({
    date: null,
    sourceType: "",
    specialist: "",
    sorting: "",
  });

  const [dateFilterOpen, setDateFilterOpen] = useState(false);
  const [dateFilterType, setDateFilterType] = useState<"specific" | "range">(
    "specific"
  );

  // Get unique specialists from records
  const uniqueSpecialists = Array.from(
    new Set(records.map((r) => r.specialist).filter(Boolean))
  );

  useEffect(() => {
    const loadRecords = async () => {
      setLoading(true);
      try {
        const response = await fetchFinancialRecords(currentPage, pageSize);
        setRecords(response.data);
        setTotalRecords(response.total);
        setTotalPages(Math.ceil(response.total / pageSize));
      } catch (error) {
        console.error("Failed to fetch financial records:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRecords();
  }, [currentPage, pageSize]);

  useEffect(() => {
    let filtered = [...records];

    // Date filtering
    if (filters.date) {
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.date);

        switch (filters.date!.type) {
          case "specific":
            if (filters.date!.specificDate) {
              const specificDate = new Date(filters.date!.specificDate);
              return recordDate.toDateString() === specificDate.toDateString();
            }
            return true;
          case "range":
            if (filters.date!.startDate && filters.date!.endDate) {
              const startDate = new Date(filters.date!.startDate);
              const endDate = new Date(filters.date!.endDate);
              return recordDate >= startDate && recordDate <= endDate;
            }
            return true;
          default:
            return true;
        }
      });
    }

    // Source type filtering
    if (filters.sourceType) {
      filtered = filtered.filter(
        (record) =>
          record.source.toLowerCase() === filters.sourceType.toLowerCase()
      );
    }

    // Specialist filtering
    if (filters.specialist) {
      filtered = filtered.filter(
        (record) => record.specialist === filters.specialist
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
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          break;
        case "date-desc":
          filtered.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          break;
        default:
          break;
      }
    }

    setFilteredRecords(filtered);
    setCurrentPage(1);
  }, [records, filters]);

  const clearAllFilters = () => {
    setFilters({
      date: null,
      sourceType: "",
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

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const getIncomeTypeBadge = (type: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      group: { label: "Group", className: "bg-blue-100 text-blue-800" },
      program: { label: "Program", className: "bg-green-100 text-green-800" },
      consultation: {
        label: "Consultation",
        className: "bg-purple-100 text-purple-800",
      },
    };

    const variant = variants[type] || {
      label: type,
      className: "bg-gray-100 text-gray-800",
    };
    return (
      <Badge className={variant.className} variant="secondary">
        {variant.label}
      </Badge>
    );
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const totalPagesToShow = Math.ceil(filteredRecords.length / pageSize);
    const actualTotalPages = totalPagesToShow || totalPages;

    if (actualTotalPages <= maxVisiblePages) {
      for (let i = 1; i <= actualTotalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(actualTotalPages);
      } else if (currentPage >= actualTotalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = actualTotalPages - 3; i <= actualTotalPages; i++)
          pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(actualTotalPages);
      }
    }

    return pages;
  };

  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalFilteredPages = Math.ceil(filteredRecords.length / pageSize);
  const displayTotalPages = totalFilteredPages || totalPages;

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

          {/* Source Type Dropdown */}
          <div className="relative">
            <select
              value={filters.sourceType}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sourceType: e.target.value,
                }))
              }
              className={`appearance-none bg-white border rounded px-3 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                filters.sourceType
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              }`}
            >
              <option value="all">{t("all")}</option>
              <option value="group">{t("group")}</option>
              <option value="program">{t("Program")}</option>
              <option value="consultation">{t("consultation")}</option>
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

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{t("financialDetails")}</h1>
        {/* <Button className="bg-blue-800 hover:bg-blue-900">{t("addNew")}</Button> */}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>{t("specialist")}</TableHead>
              <TableHead>{t("administrator")}</TableHead>
              <TableHead>{t("date")}</TableHead>
              <TableHead>{t("source")}</TableHead>
              <TableHead>{t("amount")}</TableHead>
              {/* <TableHead>Income type</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  <TableCell colSpan={6}>
                    <div className="h-6 w-full animate-pulse bg-slate-100 rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : paginatedRecords.length > 0 ? (
              paginatedRecords.map((record, index) => (
                <TableRow
                  key={record.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                >
                  <TableCell>{record.specialist}</TableCell>
                  <TableCell>
                    <span className={record.isEmployee ? "text-blue-600" : ""}>
                      {record.administrator}
                    </span>
                  </TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.source}</TableCell>
                  <TableCell>{record.amount}</TableCell>
                  <TableCell>{getIncomeTypeBadge(record.incomeType)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                 {t("noRecordsFound")}
                </TableCell>
              </TableRow>
            )}
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
            {generatePageNumbers().map((page, index) => (
              <div key={index}>
                {page === "..." ? (
                  <span className="px-3 py-1 text-gray-500">...</span>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page as number)}
                    disabled={loading}
                  >
                    {page}
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((p) => Math.min(displayTotalPages, p + 1))
            }
            disabled={currentPage === displayTotalPages || loading}
          >
           {t("next")}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">View</span>
          <select
            className="h-8 rounded-md border border-input bg-background px-2"
            value={pageSize}
            onChange={(e) =>
              handlePageSizeChange(Number.parseInt(e.target.value))
            }
            disabled={loading}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span className="text-sm text-muted-foreground">per page</span>
        </div>
      </div>
    </div>
  );
}
