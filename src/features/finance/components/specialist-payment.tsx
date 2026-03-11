import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Doctor {
  id: string;
  full_name: string;
  paidStatus: 'Paid' | 'Unpaid';
  month?: string;
}

type Payment = {
  id?: string;
  userId?: { name?: string };
  doctorId?: { _id?: string; full_name?: string };
  status?: string | number;
  amount?: number | string;
  createdAt?: string;
};

interface SpecialistDetailsModalProps {
  doctor: Doctor;
  payments: Payment[];
  totalAmount: number;
  children: React.ReactNode; // This will be the trigger button
}

export const SpecialistDetailsModal: React.FC<SpecialistDetailsModalProps> = ({
  doctor,
  payments,
  totalAmount,
  children,
}) => {
  // Helper: Format "Paid in January" or "Unpaid January"
  const getPaidLabel = (doctor: Doctor) => {
    return doctor.paidStatus === "Paid" ? `Paid in ${doctor.month}` : `Unpaid ${doctor.month}`;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{doctor.full_name}</span>
          </DialogTitle>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Total Income: <span className="font-semibold">{totalAmount} SAR</span></p>
          </div>
        </DialogHeader>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Patient</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Payment</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {payments.length > 0 ? (
                  payments.map((payment, idx) => (
                    <tr key={payment.id || idx} className="border-b last:border-none hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {payment.userId?.name || "Unknown Patient"}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {payment.amount} SAR
                      </td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant={payment.status === "paid" || payment.status === "Paid" ? "default" : "secondary"}
                          className="capitalize"
                        >
                          {payment.status || "pending"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No payments found for this specialist
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Summary Statistics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700">Total Paid</h4>
              <p className="text-xl font-bold text-green-600">
                {payments.filter(p => p.status === "paid" || p.status === "Paid").length}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700">Total Pending</h4>
              <p className="text-xl font-bold text-yellow-600">
                {payments.filter(p => p.status !== "paid" && p.status !== "Paid").length}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700">Average Payment</h4>
              <p className="text-xl font-bold text-blue-600">
                {payments.length > 0 ? Math.round(totalAmount / payments.length) : 0} SAR
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};