"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import CustomerMedicalRecord from "@/features/customer/components/CustomerMedicalRecord";
import CustomerMetricRecord from "@/features/customer/components/CustomerMetricRecord";
import CustomerSpecialistRecord from "@/features/customer/components/CustomerSpecialistRecord";
import CustomerTicketRecord from "@/features/customer/components/CustomerTicketRecord";
import CustomerCommentRecord from "@/features/customer/components/CustomerCommentRecord";
import { ApiBaseUrl } from "../../../../const";
import { format } from "date-fns";

interface ApiResponse {
  message: string;
  user: any;
}

export default function CustomerPage() {
  const params = useParams<{ customer_Id: string }>();
  const { customer_Id } = params;
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1) Fetch the customer data on mount
  useEffect(() => {
    async function fetchCustomer() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get<ApiResponse>(
          `/api/admin/patients/${customer_Id}`
        );
        setCustomer(res.data?.data);
      } catch (err: any) {
        console.error("Failed to fetch customer:", err);
        setError("Failed to load customer data.");
      } finally {
        setLoading(false);
      }
    }
    if (customer_Id) fetchCustomer();
  }, [customer_Id]);

  console.log("single patient", customer);

  // 2) Loading and error states
  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // 3) If no data, show a fallback
  if (!customer) {
    return (
      <div className="container mx-auto py-8">
        <p>No customer data found.</p>
      </div>
    );
  }

  const info = [
    { label: "Gender", value: customer.gender ?? "N/A" },
    { label: "Mobile Number", value: customer.phoneNumber ?? "N/A" },
    { label: "Email", value: customer.email ?? "N/A" },
    {
      label: "Date of Birth",
      value: customer.dob ? format(new Date(customer.dob), "dd-MMM-yyyy") : "N/A",
    },
    {
      label: "Address",
      value:
        `${customer.address?.line1 ?? ""} \n , ${customer.address?.line2 ?? ""}`.trim() ||
        "N/A",
    },
  ];



  // 5) Prepare tab data
  const tabData = [
    {
      title: "General Information",
      id: "general",
      content: (
        <Card className="mt-6">
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
            {info.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="text-sm text-muted-foreground">
                  {item.label}
                </div>
                <div className="font-medium">{item.value}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      ),
    },
    // {
    //   title: "Medical Record",
    //   id: "medical_record",
    //   content: <CustomerMedicalRecord customerId={customer_Id} />,
    // },
    {
      title: "Metrics",
      id: "metrics",
      content: <CustomerMetricRecord customerId={customer_Id} />,
    },
    {
      title: "Family",
      id: "family",
      content: (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 py-6 ">
          {customer.family.length !== 0
            ? customer.family.map((member: any, idx: number) => (
              <Card key={member.name + idx}>
                <CardContent className="flex flex-row gap-2 pt-4">
                  <div className="flex-1 flex flex-col gap-2 text-sm">
                    <p className=" text-lg font-semibold">{member.name}</p>
                    <p>
                      Age : <span>{member.age}</span>
                    </p>
                    <p>
                      File Number : <span>{member.fileNo}</span>
                    </p>
                    <p>
                      Id Number : <span>{member.idNumber}</span>
                    </p>
                    <p>
                      Relation : <span>{member.relationship}</span>
                    </p>
                  </div>
                  <div className="flex flex-col justify-start items-end">
                    {/* <Button variant={"ghost"} size={"sm"} className="text-xs">
                    Switch Profile
                  </Button> */}
                    {/* <Button
                    variant={"ghost"}
                    size={"sm"}
                    className="text-red-500 text-xs"
                  >
                    Delete
                  </Button> */}
                  </div>
                </CardContent>
              </Card>
            ))
            : "No Member added"}
        </div>
      ),
    },
    // {
    //   title: "Specialists",
    //   id: "specialist",
    //   content: <CustomerSpecialistRecord customerId={customer_Id} />,
    // },
    // {
    //   title: "Tickets",
    //   id: "ticket",
    //   content: <CustomerTicketRecord customerId={customer_Id} />,
    // },
    // {
    //   title: "Wallet",
    //   id: "wallet",
    //   content: (
    //     <Card className="mt-6">
    //       <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
    //         {/* Insert wallet info here */}
    //       </CardContent>
    //     </Card>
    //   ),
    // },
    // {
    //   title: "Comments",
    //   id: "comment",
    //   content: <CustomerCommentRecord customerId={customer_Id} />,
    // },
  ];

  // 6) Render the page
  return (
    <div className="container mx-auto py-8">
      <div className="h-full min-h-[80vh]">
        <div className="flex flex-col gap-8">
          {/* Top row: avatar + name + phoneNumber + "Block" button */}
          <div className="flex flex-row justify-between gap-4">
            <div className="flex flex-row gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={customer.imageUrl || ""} />
                <AvatarFallback>
                  {customer.name ? customer.name.slice(0, 2) : "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-semibold">
                    {customer.name || "Unknown Name"}
                  </h1>
                  {/* <Badge>Master</Badge> */}
                </div>
                <p className="text-muted-foreground">
                  {customer.phoneNumber || "No phone"}
                </p>
              </div>
            </div>
            {/* <div>
              <Button>Block the client</Button>
            </div> */}
          </div>

          {/* Tabs */}
          <div>
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="w-full justify-start h-auto p-0 bg-background flex flex-row flex-wrap">
                {tabData.map((tab, idx) => (
                  <TabsTrigger
                    key={tab.id + idx}
                    value={tab.id}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary flex-1"
                  >
                    {tab.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {tabData.map((tab, idx) => (
                <TabsContent key={tab.id + idx} value={tab.id}>
                  {tab.content}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
