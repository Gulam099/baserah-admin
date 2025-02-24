"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UnifiedPagination from "@/features/home/components/UnifiedPagination";
import React, { useEffect, useState } from "react";
import { fetchMedicalRecords } from "../data/customer.data";
import { Button } from "@/components/ui/button";
import { ExportCurve } from "iconsax-react";

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
                <Card className="mt-6" key={`customer-all-${i}`}>
                  <CardContent >
                    <div className="flex flex-row w-full justify-between">
                      <p>{customer.record_name}</p>
                      <Button size={"icon"}>
                        <ExportCurve />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </>
      ),
    },
    {
      title: "Medical Prescription",
      id: "prescription",
      content: (
        <Card className="mt-6">
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 p-6"></CardContent>
        </Card>
      ),
    },
    {
      title: "Treatment Plans",
      id: "treatment-plans",
      content: (
        <Card className="mt-6">
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 p-6"></CardContent>
        </Card>
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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {tab.content}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <UnifiedPagination total={total} />
    </div>
  );
}
