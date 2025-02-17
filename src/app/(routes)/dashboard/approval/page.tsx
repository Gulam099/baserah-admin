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
import { Eye } from "iconsax-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchApprovalsRecords } from "@/features/approval/utils/approval.util";
import { ApprovalContentItemType } from "@/features/approval/approval.type";
import UnifiedPagination from "@/features/home/components/UnifiedPagination";
import { toTitleCase } from "@/features/home/utils/string.utils";

export default function ApprovalContentTablePage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  // Read page/pageSize from the URL, or fallback to 1 / 9
  const pageParam = searchParams.page;
  const pageSizeParam = searchParams.pageSize;
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 10;

  const [approvals, setApprovals] = useState<ApprovalContentItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0); // track total items

  // Whenever page/pageSize changes in the URL, fetch new data
  useEffect(() => {
    setLoading(true);
    fetchApprovalsRecords(currentPage, pageSize)
      .then((res) => {
        setApprovals(res.data!);
        setTotal(res.page?.total!); // for UnifiedPagination's `total` prop
      })
      .catch((err) => {
        console.error("Failed to fetch questions:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage, pageSize]);

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
    upcoming: "default",
    completed: "success",
    ongoing: "warning",
    cancelled: "danger",
  };

  return (
    <div className="container mx-auto ">
      <div className="min-h-[80vh] rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Content Type</TableHead>
              <TableHead>Specialist</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Approval Status</TableHead>
              <TableHead>Approval Status</TableHead>
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
              : approvals.map((content, index: number) => {
                  const url = `/dashboard/approval/${encodeURIComponent(
                    content.contentType.toLowerCase()
                  )}/${content.id}`;
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium capitalize">
                        {toTitleCase(content.contentType)}
                      </TableCell>
                      <TableCell>{content.specialist}</TableCell>
                      <TableCell>
                        {format(parseISO(content.datetime), "HH:mm a")}
                      </TableCell>
                      <TableCell>
                        {format(parseISO(content.datetime), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={badgeVariant[content.approvalStatus]}
                          className={"capitalize"}
                        >
                          {content.approvalStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link href={url}>
                          <Eye className="size-7 text-white bg-primary-600 p-1 rounded-lg" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </div>
      <UnifiedPagination total={total} />
    </div>
  );
}
