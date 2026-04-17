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
import UnifiedPagination from "@/features/home/components/UnifiedPagination";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import PageLoading from "@/components/page-loading";


export default function CustomersPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  // Read page/pageSize from the URL, or fallback to 1 / 9
  const pageParam = searchParams.get("page");
  const pageSizeParam = searchParams.get("pageSize");
  let currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 9;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<CustomerType>("all");
  const [total, setTotal] = useState(0); // track total items
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    currentPage = 1;
  }, [activeTab]);

  // Whenever page/pageSize changes in the URL, fetch new data
  useEffect(() => {
    setLoading(true);
    fetchCustomers(currentPage, pageSize)
      .then((res) => {
        if (Array.isArray(res.data?.data)) {
          setCustomers(res.data.data);
        } else {
          setCustomers([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch questions:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage, pageSize]);

  const filteredCustomers = customers.filter((customer) => {
    const name = customer.name?.toLowerCase() || "";
    const id = customer._id?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();

    return name.includes(term) || id.includes(term);
  });



  //   useEffect(() => {
  //     currentPage = 1;
  //   }, [activeTab]);

  //   // Whenever page/pageSize changes in the URL, fetch new data
  //   useEffect(() => {
  //     setLoading(true);
  //     fetchCustomers(activeTab, currentPage, pageSize)
  //       .then((res) => {
  //         setCustomers(res.data!);
  //         setTotal(res.page?.total!); // for UnifiedPagination's `total` prop
  //       })
  //       .catch((err) => {
  //         console.error("Failed to fetch questions:", err);
  //       })
  //       .finally(() => {
  //         setLoading(false);
  //       });
  //   }, [currentPage, pageSize, activeTab]);

  if (loading) {
    return <PageLoading />
  }

  return (
    <div className="container mx-auto py-5">
      <div className="relative w-full max-w-md pb-5">
        <Input
          type="text"
          placeholder={t("customers.searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label="Clear search"
            type="button"
          >
            &#x2715;
          </button>
        )}
      </div>
      {/* <div className="flex justify-between items-center mb-6">
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value as CustomerType);
            currentPage = 1;
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
      </div> */}
      <div className="min-h-[70vh]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {filteredCustomers.map((customer) => (
            <CustomerCard key={customer._id} customer={customer} />
          ))}
        </div>
      </div>
      <UnifiedPagination total={total} />
    </div>
  );
}

function NewCustomerDialog() {
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
