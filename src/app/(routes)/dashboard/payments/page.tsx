"use client";

import PaymentList from "@/features/payments/component/page";
import React, { useEffect, useState } from "react";

type Payment = {
  userId?: { name?: string };
  doctorId?: { full_name?: string };
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
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchPayments = async (page = 1, query = "") => {
    const limit = 10;
    const res = await fetch(`/api/payments?page=${page}&limit=${limit}&search=${encodeURIComponent(query)}`);
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
    fetchPayments(1, debouncedSearch);
  }, [debouncedSearch]);

  const handlePageChange = (page: number) => {
    fetchPayments(page, debouncedSearch);
  };
  useEffect(() => {
    const term = search.toLowerCase();
    const filtered = paymentsData.payments.filter(
      (p) =>
        p.userId?.name?.toLowerCase().includes(term) ||
        p.doctorId?.full_name?.toLowerCase().includes(term) ||
        p.status?.toString().includes(term) ||
        p.amount?.toString().includes(term)
    );
    setFilteredPayments(filtered);
  }, [search, paymentsData]);

  return (
    <PaymentList
      payments={filteredPayments}
      total={paymentsData.total}
      currentPage={paymentsData.currentPage}
      hasNext={paymentsData.hasNext}
      onPageChange={handlePageChange}
      search={search}
      onSearchChange={setSearch}
    />
  );
};

export default PaymentPage;
