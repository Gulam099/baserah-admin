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

  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1️⃣ Cultural Content
        const contentParams = new URLSearchParams({
          page: currentPage.toString(),
          pageSize: pageSize.toString(),
        });
        if (statusFilter !== "all") contentParams.append("status", statusFilter);

        const culturalRes = await axios.get(
          `${ApiBaseUrlLocal}/api/admin/cultural-content/all?${contentParams.toString()}`
        );
        const culturalItems = (culturalRes.data?.data || []).map((item: any) => ({
          ...item,
          recordType: "content",
        }));

        // 2️⃣ Groups / Programs
        const groupsRes = await axios.get(`${ApiBaseUrlLocal}/api/support-groups/get-all`);
        const groupItems = (groupsRes.data?.data || []).map((item: any) => ({
          ...item,
          type: item.module === "support" ? "group" : item.module?.toLowerCase(), // group or program
          status: item.approval_status ? "approved" : "pending",
          recordType: "group",
        }));
        console.log("grop", groupItems);

        // 3️⃣ Merge + sort
        const merged = [...culturalItems, ...groupItems].sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });

        setApprovals(merged);
        setTotal(merged.length);
      } catch (error) {
        console.error("Error fetching approvals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, pageSize, statusFilter]);

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
              : approvals.map((item) => {
                let url = "#";
                if (item.recordType === "content") {
                  url = `/dashboard/approval/${encodeURIComponent(
                    item.type?.toLowerCase() || ""
                  )}/${item._id}`;
                } else if (item.recordType === "group") {
                  url = `/dashboard/group/${item._id}`;
                }

                return (
                  <TableRow key={item._id}>
                    <TableCell className="capitalize font-medium">
                      {typeMap[item.type?.toLowerCase()] || "Unknown"}
                    </TableCell>
                    <TableCell>{item.title || t("untitled")}</TableCell>
                    <TableCell>
                      {item?.doctor?.full_name || item?.doctorId?.full_name || "-"}
                    </TableCell>
                    <TableCell>
                      {item.createdAt
                        ? format(parseISO(item.createdAt), "dd MMM yyyy HH:mm")
                        : t("unknown")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status
                            ? badgeVariant[item.status.toLowerCase()] || "outline"
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
