"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FinancialRecord } from "@/features/finance/types/finance.type";
import { fetchFinancialRecords } from "@/features/finance/data/finance.data";

export default function FinancialDetailsPage() {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const loadRecords = async () => {
      setLoading(true);
      try {
        const response = await fetchFinancialRecords(currentPage, pageSize);
        setRecords(response.data);
        setTotalPages(Math.ceil(response.total / pageSize));
      } catch (error) {
        console.error("Failed to fetch financial records:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRecords();
  }, [currentPage]);

  const getIncomeTypeBadge = (type: "Debtor" | "Creditor") => {
    const baseClasses = "rounded-full px-2 py-1 text-xs font-medium";
    if (type === "Debtor") {
      return (
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-700 hover:bg-green-100"
        >
          {type}
        </Badge>
      );
    }
    return (
      <Badge
        variant="secondary"
        className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
      >
        {type}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Financial Details</h1>
        <Button className="bg-blue-800 hover:bg-blue-900">Add new</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Specialist</TableHead>
              <TableHead>Administrator</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Income type</TableHead>
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
              : records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.specialist}</TableCell>
                    <TableCell>
                      <span
                        className={record.isEmployee ? "text-blue-600" : ""}
                      >
                        {record.administrator}
                      </span>
                    </TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.source}</TableCell>
                    <TableCell>{record.amount}</TableCell>
                    <TableCell>
                      {getIncomeTypeBadge(record.incomeType)}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                disabled={loading}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || loading}
          >
            Next
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">View</span>
          <select
            className="h-8 rounded-md border border-input bg-background px-2"
            value={pageSize}
            onChange={(e) => {
              const newSize = Number.parseInt(e.target.value);
              // Handle page size change
            }}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
    </div>
  );
}
