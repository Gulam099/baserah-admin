"use client";
import { Card, CardContent } from "@/components/ui/card";
import UnifiedPagination from "@/features/home/components/UnifiedPagination";
import React, { useEffect, useState } from "react";
import { fetchTicketRecords } from "../data/customer.data";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";

export default function CustomerTicketRecord(props: { customerId: string }) {
  const { customerId } = props;
  const searchParams = useSearchParams();
  // Read page/pageSize from the URL, or fallback to 1 / 9
  const pageParam = searchParams.get("page");
  const pageSizeParam = searchParams.get("pageSize");
  let currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 10;

  const [records, setRecords] = useState<any[]>();
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Whenever page/pageSize changes in the URL, fetch new data
  useEffect(() => {
    setLoading(true);
    fetchTicketRecords(currentPage, pageSize)
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 py-6 ">
        {loading
          ? Array.from({ length: pageSize }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="h-[180px] rounded-lg border border-gray-200 bg-gray-50 p-4 animate-pulse"
              />
            ))
          : records.map((ticket, i) => (
              <CustomerTicketCard key={`ticket-${i}`} ticket={ticket} />
            ))}
      </div>
      <UnifiedPagination total={total} />
    </div>
  );
}

const CustomerTicketCard = ({ ticket }: any) => {
  const ticketVariant = ticket.status === "open" ? "success" : "outline";
  return (
    <Card className="rounded-2xl shadow-none ">
      <CardContent className="flex flex-col items-start  gap-2 pt-4">
        <div className="flex flex-row gap-2 w-full justify-between ">
          <p className="text-sm font-medium">Ticket Status</p>
          <Badge variant={ticketVariant} className="capitalize">
            {ticket.status}
          </Badge>
        </div>
        <Separator />
        <p className="text-sm font-semibold">Ticket Type</p>
        <p className="text-sm ">{ticket.type}</p>
        <Separator />
        <p className="text-sm font-semibold">Ticket Subject</p>
        <p className="text-sm ">{ticket.subject}</p>
        <Separator />
        {ticket.reply && (
          <>
            <p className="text-sm font-semibold">Ticket Subject</p>
            <p className="text-sm ">{ticket.reply}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
};
