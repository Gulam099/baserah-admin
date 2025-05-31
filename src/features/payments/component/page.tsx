"use client"
import UnifiedPagination from "@/features/home/components/UnifiedPagination";
import Link from "next/link";
import React from "react";
import { CreditCard, Clock, CheckCircle, XCircle, User, Stethoscope } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Payment = {
  _id: string;
  userId: { name?: string } | null;
  doctorId: { full_name?: string } | null;
  amount: number;
  currency: string;
  description: string;
  status: string;
  createdAt: string;
};

type Props = {
  payments: Payment[];
  total: number;
  currentPage: number;
  hasNext: boolean;
  onPageChange: (page: number) => void;
};

const PaymentList: React.FC<Props> = ({
  payments,
  total,
  currentPage,
  hasNext,
  onPageChange,
}) => {

  console.log("payment >>>", payments);
  // Calculate summary stats
  const totalPayments = total;
  const completedPayments = payments.filter(p => p.status === 'paid').length;
  const pendingPayments = payments.filter(p => p.status === 'initiated').length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex  items-center gap-3">
            {/* <Link href="/dashboard/appointment">
              <Button>
                go to dashboard
              </Button>
            </Link> */}
            <Link href='/'>
              <h1 className="text-3xl hover:underline text-blue-500 font-bold ">Payments</h1>
            </Link>
          </div>
          <p className="text-gray-500">Manage and review all payment transactions</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Total</span>
                <CreditCard className="w-4 h-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{totalPayments}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Completed</span>
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-green-600">{completedPayments}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Pending</span>
                <Clock className="w-4 h-4 text-yellow-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-yellow-600">{pendingPayments}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment History Section */}
      <Card className="border rounded-xl overflow-hidden shadow-sm">
        <CardHeader className="bg-gray-50 px-6 py-4 border-b">

          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment History
          </h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No payments found
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span>{payment.userId?.name || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4 text-gray-400" />
                          <span>{payment.doctorId?.full_name || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate">
                        {payment.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {payment.currency} {payment.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={
                            payment.status === "verified"
                              ? "success"
                              : payment.status === "initiated"
                                ? "warning"
                                : payment.status === "paid"
                                  ? "secondary"
                                  : payment.status === "captured"
                                    ? "secondary"
                                    : payment.status === "authorized"
                                      ? "default"
                                      : payment.status === "refunded"
                                        ? "default"
                                        : payment.status === "failed"
                                          ? "destructive"
                                          : payment.status === "voided"
                                            ? "outline"
                                            : "default"
                          }
                          className="capitalize"
                        >
                          {payment.status}
                        </Badge>


                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-center">
        <UnifiedPagination total={total} />
      </div>
    </div>
  );
};

export default PaymentList;