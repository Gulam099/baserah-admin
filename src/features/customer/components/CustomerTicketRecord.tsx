"use client";
import { Card, CardContent } from "@/components/ui/card";
import UnifiedPagination from "@/features/home/components/UnifiedPagination";
import React, { useEffect, useState } from "react";
import { fetchMedicalRecords } from "../data/customer.data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RescheduleSessionDrawer from "./RescheduleSessionDrawer";
import CancelSessionDrawer from "./CancelSessionDrawer";

export default function CustomerTicketRecord(props: {
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
    fetchMedicalRecords("all", currentPage, pageSize)
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 py-6 ">
        {loading
          ? Array.from({ length: pageSize }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="h-[180px] rounded-lg border border-gray-200 bg-gray-50 p-4 animate-pulse"
              />
            ))
          : records.map((customer, i) => (
              <CustomerMedicalCard
                key={`customer-all-${i}`}
                customer={customer}
              />
            ))}
      </div>
      <UnifiedPagination total={total} />
    </div>
  );
}

const CustomerMedicalCard = ({ customer }: any) => {
  return (
    <Card className="rounded-2xl shadow-none ">
      <CardContent className="flex flex-row items-center  gap-4 pt-4">
        <Avatar>
          <AvatarImage src={customer.specialist_image} />
          <AvatarFallback>
            {customer.specialist_name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col w-full justify-between ">
          <p className="text-sm font-semibold">{customer.specialist_name}</p>
          <p className="text-sm">{customer.specialist_specialization}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <RescheduleSessionDrawer customer={customer} />
          <CancelSessionDrawer customer={customer} />
        </div>
      </CardContent>
    </Card>
  );
};
