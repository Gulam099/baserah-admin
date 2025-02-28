"use client";
import { Card, CardContent } from "@/components/ui/card";
import UnifiedPagination from "@/features/home/components/UnifiedPagination";
import React, { useEffect, useState } from "react";
import { fetchCommentRecords, fetchTicketRecords } from "../data/customer.data";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

export default function CustomerCommentRecord(props: {
  searchParams: {
    [key: string]: string;
  };
  customerId: string;
}) {
  const { customerId, searchParams } = props;

  // Read page/pageSize from the URL, or fallback to 1 / 9
  const pageParam = searchParams.page;
  const pageSizeParam = searchParams.pageSize;
  let currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 10;

  const [records, setRecords] = useState<any[]>();
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Whenever page/pageSize changes in the URL, fetch new data
  useEffect(() => {
    setLoading(true);
    fetchCommentRecords(currentPage, pageSize)
      .then((res) => {
        setRecords(res.data!);
        setTotal(res.page?.total!); // for UnifiedPagination's `total` prop
      })
      .catch((err) => {
        console.error("Failed to fetch questions:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage, pageSize]);

  if (!records) return null;

  return (
    <div className="py-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 py-6 ">
        {loading
          ? Array.from({ length: pageSize }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="h-[180px] rounded-lg border border-gray-200 bg-gray-50 p-4 animate-pulse"
              />
            ))
          : records.map((comment, i) => (
              <CustomerCommentCard key={`comment-${i}`} comment={comment} />
            ))}
      </div>
      <UnifiedPagination total={total} />
    </div>
  );
}

const CustomerCommentCard = ({ comment }: any) => {
  return (
    <Card className="rounded-2xl shadow-none ">
      <CardContent className="flex flex-col items-start  gap-2 pt-4">
        <p className="text-sm font-semibold">{comment.name}</p>
        <p className="text-sm ">{format(comment.date, "dd MMM yyyy")}</p>
        <p className="text-sm ">{comment.comment}</p>
      </CardContent>
    </Card>
  );
};
