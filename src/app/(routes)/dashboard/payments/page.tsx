"use client";

import React, { useEffect, useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { groupPaymentsByDoctor } from "@/hooks/group-payment";

type Payment = {
  userId?: { name?: string };
  doctorId?: { _id?: string; full_name?: string };
  status?: string | number;
  amount?: number | string;
};

const PaymentPage = () => {
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

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchPayments = async (page = 1) => {
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
  };

  useEffect(() => {
    fetchPayments(1);
  }, []);

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
  

  const grouped = groupPaymentsByDoctor(filteredPayments);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-2xl">Finance</h1>
        <input
          type="text"
          placeholder="Search payments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-60"
        />
      </div>

      <Accordion type="single" collapsible>
        {grouped.map((group) => (
          <AccordionItem key={group.doctorId} value={group.doctorId}>
            <AccordionTrigger>
              <div className="flex justify-between w-full">
                <span>{group.doctor.full_name}</span>
                <span className="font-bold">{group.totalAmount} SAR</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {group.payments.map((p: any, idx: number) => (
                  <div key={idx} className="flex justify-between border-b py-2">
                    <span>{p.userId?.name || "Unknown Patient"}</span>
                    <span>{p.amount} SAR</span>
                    <span className="text-sm text-gray-500">{p.status}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default PaymentPage;
