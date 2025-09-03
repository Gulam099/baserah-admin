"use client";

import { useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { fetchTransactions } from "@/features/finance/data/finance.data";
import { Transaction } from "@/features/finance/types/finance.type";
import { ArrowLeft, ArrowUpDown, ChevronDown, Download } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  const router = useRouter();

  const [selectedFiltering, setSelectedFiltering] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedSpecialist, setSelectedSpecialist] = useState("");
  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      try {
        const response = await fetchTransactions(currentPage, pageSize);
        setTransactions(response.data);
        setTotalPages(Math.ceil(response.total / pageSize));
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [currentPage]);

  const clearAllFilters = () => {
    setSelectedFiltering("");
    setSelectedDate("");
    setSelectedType("");
    setSelectedSpecialist("");
  };
  return (
    <div className="container mx-auto py-8">
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-800"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
      </div>
      <div className="flex items-center justify-between mb-6 py-3 border-b border-gray-200">
        <div className="flex items-center gap-4">
          {/* Filtering Dropdown */}
          <div className="relative">
            <select
              value={selectedFiltering}
              onChange={(e) => setSelectedFiltering(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Filtering</option>
              <option value="recent">Recent</option>
              <option value="amount">By Amount</option>
              <option value="date">By Date</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Date Dropdown */}
          <div className="relative">
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Date</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Type Dropdown */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Type</option>
              <option value="debtor">Debtor</option>
              <option value="creditor">Creditor</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Specialist's Dropdown */}
          <div className="relative">
            <select
              value={selectedSpecialist}
              onChange={(e) => setSelectedSpecialist(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Specialist's</option>
              <option value="john">John Doe</option>
              <option value="jane">Jane Smith</option>
              <option value="bob">Bob Johnson</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Clear All Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-600 hover:text-gray-800"
          >
            Clear All
          </Button>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-3">
          {/* Sort by */}
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowUpDown className="w-4 h-4 mr-1" />
            Sort by
          </Button>

          {/* Export */}
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-800"
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Administrator</TableHead>
              <TableHead>Wallet Amount</TableHead>
              <TableHead className="text-right">Action</TableHead>
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
              : transactions.map((transaction, index) => (
                  <TableRow
                    key={transaction.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                  >
                    <TableCell
                      className={
                        transaction.type === "Inward"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {transaction.type}
                    </TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>
                      <span
                        className={
                          transaction.isEmployee ? "text-blue-600" : ""
                        }
                      >
                        {transaction.administrator}
                      </span>
                    </TableCell>
                    <TableCell>{transaction.walletAmount}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>
                            Transfer to the card
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Add to wallet
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
