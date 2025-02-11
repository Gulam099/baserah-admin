"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Customer,
  CustomerType,
} from "@/features/customer/types/customer.type";
import { fetchCustomers } from "@/features/customer/data/customer.data";
import { CustomerCard } from "@/features/customer/components/CustomerCard";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState<CustomerType>("all");
  const pageSize = 12;

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      try {
        const response = await fetchCustomers(activeTab, currentPage, pageSize);
        setCustomers(response.data);
        setTotalPages(Math.ceil(response.total / pageSize));
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, [activeTab, currentPage]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value as CustomerType);
            setCurrentPage(1);
          }}
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="vip">VIP</TabsTrigger>
            <TabsTrigger value="incomplete">Incomplete</TabsTrigger>
            <TabsTrigger value="forbidden">Forbidden</TabsTrigger>
          </TabsList>
        </Tabs>
        <NewCustomerDialog />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: pageSize }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="h-[180px] rounded-lg border border-gray-200 bg-gray-50 p-4 animate-pulse"
              />
            ))
          : customers.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
      </div>

      <div className="mt-8 flex justify-center gap-2">
        <button
          className="px-3 py-1 rounded border disabled:opacity-50"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1 || loading}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`px-3 py-1 rounded border ${
              currentPage === page ? "bg-blue-800 text-white" : ""
            }`}
            onClick={() => setCurrentPage(page)}
            disabled={loading}
          >
            {page}
          </button>
        ))}
        <button
          className="px-3 py-1 rounded border disabled:opacity-50"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages || loading}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export function NewCustomerDialog() {
  const [open, setOpen] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-800 hover:bg-blue-900">
          Add New Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Enter the customer details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input id="mobile" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="id">ID Number</Label>
              <Input id="id" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Customer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
