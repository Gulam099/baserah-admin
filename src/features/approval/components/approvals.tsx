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
import { ApprovalContentItemType } from "@/features/approval/approval.type";
import UnifiedPagination from "@/features/home/components/UnifiedPagination";
import { useSearchParams, useRouter } from "next/navigation";
import { ApiBaseUrlLocal } from "../../../../const";
import { useTranslation } from "react-i18next";

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

  const [approvals, setApprovals] = useState<ApprovalContentItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          pageSize: pageSize.toString(),
        });

        if (statusFilter !== "all") {
          queryParams.append("status", statusFilter);
        }

        const response = await fetch(
          `${ApiBaseUrlLocal}/api/admin/cultural-content/all?${queryParams.toString()}`
        );
        const data = await response.json();

        setApprovals(data?.data || []);
        setTotal(data?.total || data?.data?.length || 0);
      } catch (error) {
        console.error("Error fetching approvals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, pageSize, statusFilter]);

  console.log("approval", approvals);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = e.target.value;
    setStatusFilter(selectedStatus);

    // Update URL params for deep linking
    const params = new URLSearchParams(window.location.search);
    params.set("page", "1"); // reset to first page on filter change
    if (selectedStatus === "all") {
      params.delete("status");
    } else {
      params.set("status", selectedStatus);
    }

    router.push(`?${params.toString()}`);
  };

  const badgeVariant: {
    [key in string]:
    | "default"
    | "success"
    | "warning"
    | "danger"
    | "secondary"
    | "destructive"
    | "outline";
  } = {
    pending: "warning",
    approved: "success",
    rejected: "danger",
    completed: "success",
    cancelled: "danger",
  };

  return (
    <div className="container mx-auto px-2">
      <div className="flex justify-between items-center my-4">
        <h1 className="text-xl font-semibold">{t("cultural_content_approvals")}</h1>
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

      <div className="min-h-[80vh] rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("content_type")}</TableHead>
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
              : approvals.map((content) => {
                const url = content.type
                  ? `/dashboard/approval/${encodeURIComponent(
                    content.type.toLowerCase()
                  )}/${content._id}`
                  : "#";
                return (
                  <TableRow key={content._id}>
                    <TableCell className="capitalize font-medium">
                      {content.type || t("unknown")}
                    </TableCell>
                    <TableCell>{content.title || t("untitled")}</TableCell>
                    <TableCell>
                      {content?.doctorId?.full_name || t("unknown")}
                    </TableCell>
                    <TableCell>
                      {content.createdAt
                        ? format(
                          parseISO(content?.createdAt),
                          "dd MMM yyyy HH:mm"
                        )
                        : t("unknown")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          content.status
                            ? badgeVariant[content?.status.toLowerCase()]
                            : "outline"
                        }
                        className="capitalize"
                      >
                        {content.status || "pending"}
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

      {total > pageSize && (
        <UnifiedPagination
          total={total}
        // currentPage={currentPage}
        // pageSize={pageSize}
        />
      )}
    </div>
  );
}
