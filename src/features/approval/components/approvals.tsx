"use client";

import { format, parseISO } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useEffect, useState } from "react";
import UnifiedPagination from "@/features/home/components/UnifiedPagination";
import { useSearchParams, useRouter } from "next/navigation";
import { ApiBaseUrlLocal } from "../../../../const";
import { useTranslation } from "react-i18next";
import axios from "axios";
import {
  ArrowLeft,
  ArrowUpDown,
  Calendar,
  ChevronDown,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DateFilter {
  type: "specific" | "range";
  quickType?: "today" | "week" | "month" | "year";
  specificDate?: string;
  startDate?: string;
  endDate?: string;
}

interface FilterState {
  date: DateFilter | null;
  type: "all" | "video" | "audio" | "article" | "program" | "group" | "redund";
  specialist: string;
  sorting: string;
}

interface ApprovalItem {
  _id: string;
  title: string;
  type: string;
  status: string;
  createdAt: string;
  recordType: "content" | "group" | "refund";
  doctor?: { full_name: string };
  doctorId?: { full_name: string };
  module?: string;
  approval_status?: boolean;
}

export default function ApprovalContentsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation();

  const pageParam = searchParams.get("page");
  const pageSizeParam = searchParams.get("pageSize");
  const statusParam = searchParams.get("status");

  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 10;
  const [statusFilter, setStatusFilter] = useState(statusParam || "all");

  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [filteredApprovals, setFilteredApprovals] = useState<ApprovalItem[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [selectedFiltering, setSelectedFiltering] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedSpecialist, setSelectedSpecialist] = useState("");

  const [dateFilterOpen, setDateFilterOpen] = useState(false);
  const [dateFilterType, setDateFilterType] = useState<"specific" | "range">(
    "specific"
  );

  const [filters, setFilters] = useState<FilterState>({
    date: null,
    type: "all",
    specialist: "",
    sorting: "",
  });

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1️⃣ Cultural Content
        const contentParams = new URLSearchParams({
          page: "1", // Get all for filtering
          pageSize: "1000", // Large number to get all items
        });

        const culturalRes = await axios.get(
          `${ApiBaseUrlLocal}/api/admin/cultural-content/all?${contentParams.toString()}`
        );
        const culturalItems = (culturalRes.data?.data || []).map(
          (item: any) => ({
            ...item,
            recordType: "content" as const,
            type: item.type || "unknown",
          })
        );

        // 2️⃣ Groups / Programs
        const groupsRes = await axios.get(
          `${ApiBaseUrlLocal}/api/support-groups/get-all`
        );

        const groupItems = (groupsRes.data?.data || []).map((item: any) => ({
          ...item,
          status: item.approval_status,
          recordType: "group" as const,
          type: item.module || "unknown",
        }));

        console.log("approval_status", groupItems.approval_status);
        // 3️⃣ Refunds
        const refundRes = await axios.get(`${ApiBaseUrlLocal}/api/refunds/all`);

        const refundItems = (refundRes.data || []).map((item: any) => ({
          ...item,
          recordType: "refund" as const,
          type: "refund",
        }));

        // 4️⃣ Merge + sort
        const merged = [...culturalItems, ...groupItems, ...refundItems].sort(
          (a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          }
        );

        setApprovals(merged);
        console.log("Merged data:", merged);
      } catch (error) {
        console.error("Error fetching approvals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data based on applied filters
  useEffect(() => {
    let filtered = [...approvals];

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (item) => item.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Type filter
    if (selectedType) {
      filtered = filtered.filter(
        (item) => item.type?.toLowerCase() === selectedType.toLowerCase()
      );
    }

    // Specialist filter
    if (selectedSpecialist) {
      filtered = filtered.filter((item) => {
        const specialistName =
          item.doctor?.full_name || item.doctorId?.full_name || "";
        return specialistName
          .toLowerCase()
          .includes(selectedSpecialist.toLowerCase());
      });
    }

    // Date filter
    if (filters.date) {
      const now = new Date();

      if (filters.date.type === "specific" && filters.date.specificDate) {
        const filterDate = new Date(filters.date.specificDate);
        filtered = filtered.filter((item) => {
          if (!item.createdAt) return false;
          const itemDate = new Date(item.createdAt);
          return itemDate.toDateString() === filterDate.toDateString();
        });
      } else if (
        filters.date.type === "range" &&
        filters.date.startDate &&
        filters.date.endDate
      ) {
        const startDate = new Date(filters.date.startDate);
        const endDate = new Date(filters.date.endDate);
        filtered = filtered.filter((item) => {
          if (!item.createdAt) return false;
          const itemDate = new Date(item.createdAt);
          return itemDate >= startDate && itemDate <= endDate;
        });
      }
    }

    setFilteredApprovals(filtered);
    setTotal(filtered.length);
  }, [approvals, statusFilter, selectedType, selectedSpecialist, filters.date]);


  // Get paginated data
  const paginatedData = filteredApprovals.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = e.target.value;
    setStatusFilter(selectedStatus);

    const params = new URLSearchParams(window.location.search);
    params.set("page", "1");
    if (selectedStatus === "all") params.delete("status");
    else params.set("status", selectedStatus);

    router.push(`?${params.toString()}`);
  };

  const badgeVariant: Record<string, any> = {
    pending: "warning",
    approved: "success",
    rejected: "danger",
    completed: "success",
    cancelled: "danger",
    "-": "outline",
  };

  const typeMap: Record<string, string> = {
    group: "Group",
    program: "Program",
    video: "Video",
    audio: "Audio",
    article: "Article",
    refund: "Refund",
  };

  const clearAllFilters = () => {
    setSelectedFiltering("");
    setSelectedType("");
    setSelectedSpecialist("");
    setFilters((prev) => ({ ...prev, date: null }));
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

  const handleDateFilter = (dateFilter: DateFilter) => {
    setFilters((prev) => ({ ...prev, date: dateFilter }));
    setDateFilterOpen(false);
  };

  // Generate edit URL based on record type and type
  const generateEditUrl = (item: ApprovalItem) => {
    const queryParams = new URLSearchParams({
      type: item.type,
    }).toString();
    if (item.recordType === "content") {
      return `/dashboard/approval/${item.recordType?.toLowerCase()}/${
        item._id
      }?${queryParams}`;
    } else if (item.recordType === "group") {
      return `/dashboard/approval/${item.recordType?.toLowerCase()}/${
        item._id
      }?${queryParams}`;
    } else if (item.recordType === "refund") {
      return `/dashboard/approval/${item.recordType}/${item._id}?${queryParams}`;
    }
    return "#";
  };

  return (
    <div className="container mx-auto px-2">
      <div className="flex items-center justify-between mb-6 py-3 border-b border-gray-200">
        <div className="flex items-center gap-4">
          {/* Filtering Dropdown */}
          <div className="relative">
            <select
              value={selectedFiltering}
              onChange={(e) => setSelectedFiltering(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
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
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">{t("all")}</option>
              <option value="audio">{t("audio")}</option>
              <option value="article">{t("article")}</option>
              <option value="video">{t("video")}</option>
              <option value="program">{t("program")}</option>
              <option value="group">{t("group")}</option>
              <option value="refund">{t("refund")}</option>
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
              <option value="">{t("specialists")}</option>
              {/* <option value="john">John Doe</option>
              <option value="jane">Jane Smith</option>
              <option value="bob">Bob Johnson</option> */}
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
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="border px-3 py-1 rounded-md shadow-sm"
          >
            <option value="all">{t("all")}</option>
            <option value="pending">{t("pending")}</option>
            <option value="approved">{t("approved")}</option>
            <option value="cancelled">{t("cancelled")}</option>
          </select>
        </div>
      </div>

      <div className="min-h-[80vh] rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("type")}</TableHead>
              <TableHead>{t("title")}</TableHead>
              <TableHead>{t("specialist")}</TableHead>
              <TableHead>{t("created_at")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("actions")}</TableHead>
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
              : paginatedData.map((item) => {
                  const url = generateEditUrl(item);

                  return (
                    <TableRow key={item._id}>
                      <TableCell className="capitalize font-medium">
                        {typeMap[item.type?.toLowerCase()] ||
                          item.type ||
                          "Unknown"}
                      </TableCell>
                      <TableCell>{item.title || t("untitled")}</TableCell>
                      <TableCell>
                        {item?.doctor?.full_name ||
                          item?.doctorId?.full_name ||
                          "-"}
                      </TableCell>
                      <TableCell>
                        {item.createdAt
                          ? format(
                              parseISO(item.createdAt),
                              "dd MMM yyyy HH:mm"
                            )
                          : t("unknown")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status
                              ? badgeVariant[item.status.toLowerCase()] ||
                                "outline"
                              : "outline"
                          }
                          className="capitalize"
                        >
                          {t(item.status || "-")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link href={url} className="text-blue-500 underline">
                          {t("edit")}
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </div>

      {total > pageSize && <UnifiedPagination total={total} />}
    </div>
  );
}
