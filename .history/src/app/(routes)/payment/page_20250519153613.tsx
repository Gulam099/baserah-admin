import React, { useEffect, useState } from "react";
import PaymentList from "./PaymentList";

const PaymentPage = () => {
  const [paymentsData, setPaymentsData] = useState<{
    payments: any[];
    total: number;
    currentPage: number;
    hasNext: boolean;
  }>({
    payments: [],
    total: 0,
    currentPage: 1,
    hasNext: false,
  });

  const fetchPayments = async (page = 1) => {
    const limit = 10;
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
    fetchPayments();
  }, []);

  return (
    <PaymentList
      payments={paymentsData.payments}
      total={paymentsData.total}
      currentPage={paymentsData.currentPage}
      hasNext={paymentsData.hasNext}
      onPageChange={(page) => fetchPayments(page)}
    />
  );
};

export default PaymentPage;
