"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UnifiedPagination from "@/features/home/components/UnifiedPagination";
import React, { useEffect, useState } from "react";
import { fetchMetricRecords } from "../data/customer.data";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSearchParams } from "next/navigation";
import { MetricType } from "../types/customer.type";

export default function CustomerMetricRecord(props: { customerId: string }) {
  const { customerId } = props;
  const searchParams = useSearchParams();
  // Read page/pageSize from the URL, or fallback to 1 / 9
  const pageParam = searchParams.get("page");
  const pageSizeParam = searchParams.get("pageSize");
  let currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 10;

  const [records, setRecords] = useState<any[]>();
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [activeTab, setActiveTab] = useState<any>("gad-scales");

  useEffect(() => {
    currentPage = 1;
  }, [activeTab]);

  // Whenever page/pageSize changes in the URL, fetch new data
  useEffect(() => {
    setLoading(true);
    fetchMetricRecords(activeTab, customerId, currentPage, pageSize)
      .then((res) => {
        setRecords(res.data!);
        setTotal(res.page?.total!); // for UnifiedPagination's `total` prop
      })
      .catch((err) => {
        console.error("Failed to fetch records:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage, pageSize, activeTab]);

  if (!records) return null;

  const tabData = [
    // {
    //   title: "All",
    //   id: "all",
    //   content: (
    //     <>
    //       {loading
    //         ? Array.from({ length: pageSize }).map((_, i) => (
    //             <div
    //               key={`skeleton-${i}`}
    //               className="h-[180px] rounded-lg border border-gray-200 bg-gray-50 p-4 animate-pulse"
    //             />
    //           ))
    //         : records.map((record, i) => (
    //             <CustomerScaleCard key={`scale-all-${i}`} customer={record} />
    //           ))}
    //     </>
    //   ),
    // },
    {
      title: "Generalized Anxiety Disorders",
      id: "gad-scales",
      content: (
        <>
          {loading
            ? Array.from({ length: pageSize }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="h-[180px] rounded-lg border border-gray-200 bg-gray-50 p-4 animate-pulse"
                />
              ))
            : records.map((record, i) => (
                <CustomerScaleCard
                  key={`scale-gad-${i}`}
                  customer={record}
                  scaleType="gad-scales"
                />
              ))}
        </>
      ),
    },
    {
      title: "Mood",
      id: "mood-scales",
      content: (
        <>
          {loading
            ? Array.from({ length: pageSize }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="h-[180px] rounded-lg border border-gray-200 bg-gray-50 p-4 animate-pulse"
                />
              ))
            : records.map((record, i) => (
                <CustomerScaleCard
                  key={`scale-mood-${i}`}
                  customer={record}
                  scaleType="mood-scales"
                />
              ))}
        </>
      ),
    },
    // {
    //   title: "Quality of Life",
    //   id: "quality-Life-scales",
    //   content: (
    //     <>
    //       {loading
    //         ? Array.from({ length: pageSize }).map((_, i) => (
    //             <div
    //               key={`skeleton-${i}`}
    //               className="h-[180px] rounded-lg border border-gray-200 bg-gray-50 p-4 animate-pulse"
    //             />
    //           ))
    //         : records.map((record, i) => (
    //             <CustomerScaleCard
    //               key={`scale-quality-${i}`}
    //               customer={record}
    //             />
    //           ))}
    //     </>
    //   ),
    // },
    {
      title: "Depressive Disorders",
      id: "depressive-scales",
      content: (
        <>
          {loading
            ? Array.from({ length: pageSize }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="h-[180px] rounded-lg border border-gray-200 bg-gray-50 p-4 animate-pulse"
                />
              ))
            : records.map((record, i) => (
                <CustomerScaleCard
                  scaleType="depressive-scales"
                  key={`scale-depressive-${i}`}
                  customer={record}
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

const CustomerScaleCard = (props: { customer: any; scaleType: MetricType }) => {
  return (
    <Card className="h-full">
      <CardContent>
        <div className="flex flex-row justify-between items-center pt-4">
          <div className="flex flex-row items-center gap-4">
            <Avatar>
              <AvatarFallback className="bg-primary-800 text-white font-semibold">
                {props.customer.score}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-start gap-2">
              {props.scaleType === "mood-scales" ? (
                <p className="text-base font-semibold">
                  {props.customer.mood} ( {props.customer.reasons.join(", ")} )
                </p>
              ) : (
                <p className="text-base font-semibold">
                  {props.customer.score <= 30
                    ? "High Risk"
                    : props.customer.score <= 60
                    ? "Moderate Risk"
                    : "No Risk"}
                </p>
              )}
              {props.customer.createdAt && (
                <p className="text-muted-foreground text-sm">
                  {format(props.customer.createdAt, "dd MMM yyyy")}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
