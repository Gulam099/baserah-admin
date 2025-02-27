"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UnifiedPagination from "@/features/home/components/UnifiedPagination";
import React, { useEffect, useState } from "react";
import { fetchMedicalRecords } from "../data/customer.data";
import { Button } from "@/components/ui/button";
import { Calendar, ExportCurve, Notepad2, SmsTracking } from "iconsax-react";
import { FaWhatsapp } from "react-icons/fa";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import CopyButton from "@/features/home/components/CopyButton";
import PdfView from "@/features/home/components/PdfView";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CustomerMedicalRecord(props: {
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
  const [activeTab, setActiveTab] = useState<any>("all");

  useEffect(() => {
    currentPage = 1;
  }, [activeTab]);

  // Whenever page/pageSize changes in the URL, fetch new data
  useEffect(() => {
    setLoading(true);
    fetchMedicalRecords(activeTab, currentPage, pageSize)
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
  }, [currentPage, pageSize, activeTab]);

  if (!records) return null;

  const tabData = [
    {
      title: "All",
      id: "all",
      content: (
        <>
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
        </>
      ),
    },
    {
      title: "Medical Prescription",
      id: "prescription",
      content: (
        <>
          {loading
            ? Array.from({ length: pageSize }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="h-[180px] rounded-lg border border-gray-200 bg-gray-50 p-4 animate-pulse"
                />
              ))
            : records.map((customer, i) => (
                <CustomerMedicalCard
                  key={`customer-prescription-${i}`}
                  customer={customer}
                />
              ))}
        </>
      ),
    },
    {
      title: "Treatment Plans",
      id: "treatment-plans",
      content: (
        <>
          {loading
            ? Array.from({ length: pageSize }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="h-[180px] rounded-lg border border-gray-200 bg-gray-50 p-4 animate-pulse"
                />
              ))
            : records.map((customer, i) => (
                <CustomerMedicalCard
                  key={`customer-treatment-${i}`}
                  customer={customer}
                />
              ))}
        </>
      ),
    },
  ];
  return (
    <div className="py-4">
      <Tabs
        defaultValue="general"
        className="w-full"
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          currentPage = 1;
        }}
      >
        <TabsList className="justify-start  h-auto p-0 bg-background flex flex-row flex-wrap">
          {tabData.map((tab, idx) => (
            <TabsTrigger
              key={tab.id + idx}
              value={tab.id}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary "
            >
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabData.map((tab, idx) => (
          <TabsContent key={tab.id + idx} value={tab.id}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 py-6 ">
              {tab.content}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <UnifiedPagination total={total} />
    </div>
  );
}

const CustomerMedicalCard = ({ customer }: any) => {
  const shareLink = `https://example.com/share/${customer.recordId}`;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="rounded-2xl shadow-none cursor-pointer">
          <CardContent className="flex flex-col gap-2">
            <div className="flex flex-row w-full justify-between pt-4">
              <p className="text-lg font-medium">{customer.record_name}</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size={"icon"}
                    variant={"ghost"}
                    className="rounded-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExportCurve />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">
                      Share the file to the client
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-row flex-wrap justify-between gap-4 py-6">
                    <div className="flex-1 flex flex-col gap-6">
                      <p>
                        Choose the channel where the prescription/treatment plan
                        will be shared to the customer
                      </p>
                      <CopyButton text={shareLink} title={shareLink} />
                    </div>
                    <div className="flex-1 flex flex-row justify-around px-4">
                      {[
                        {
                          lable: "Email",
                          value: "email",
                          icon: <SmsTracking size="48" />,
                        },
                        {
                          lable: "SMS",
                          value: "sms",
                          icon: <FaWhatsapp size={48} />,
                        },
                      ].map((item, idx) => (
                        <div key={item.value + idx}>
                          <Link
                            href={`/`}
                            className="flex flex-col items-center gap-4 "
                          >
                            {item.icon}
                            {item.lable}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={(e) => e.stopPropagation()}>Share the file to the client</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <p>Doctor's name : {customer.specialist_name}</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col justify-start items-start gap-2">
            <Separator />
            <div className="flex flex-row gap-2 flex-wrap text-xs justify-between w-full">
              <div className="flex flex-row justify-center items-center gap-1">
                <div className="bg-primary-50/40 rounded-full p-1.5 text-primary-800">
                  <Calendar size="16" />
                </div>
                <p>
                  date :{" "}
                  <span className="text-primary-700">
                    {format(new Date(customer.date), "dd MMM yyyy")}
                  </span>
                </p>
              </div>
              <div className="flex flex-row justify-center items-center gap-1">
                <div className="bg-primary-50/40 rounded-full p-1.5 text-primary-800">
                  <Notepad2 size="16" />
                </div>

                <p>
                  number :{" "}
                  <span className="text-primary-700">{customer.recordId}</span>{" "}
                </p>
              </div>
            </div>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-5xl ">
        <DialogHeader>
          <DialogTitle className="text-2xl">Record File</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] w-full rounded-md border">
          <PdfView pdfUrl="/pdf/text.pdf" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
