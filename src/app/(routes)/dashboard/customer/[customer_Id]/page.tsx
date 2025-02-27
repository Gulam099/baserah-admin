"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CustomerMedicalRecord from "@/features/customer/components/CustomerMedicalRecord";
import CustomerMetricRecord from "@/features/customer/components/CustomerMetricRecord";
import { Repeat, Trash } from "iconsax-react";
import CustomerSpecialistRecord from "@/features/customer/components/CustomerSpecialistRecord";
import CustomerTicketRecord from "@/features/customer/components/CustomerTicketRecord";

export default function CustomerPage({
  params,
  searchParams,
}: {
  params: { customer_id: string };
  searchParams: { [key: string]: string };
}) {
  const { customer_id } = params;

  const info = [
    { label: "Sex", value: "Male" },
    { label: "Mobile Number", value: "0555555555" },
    { label: "Email", value: "mmmmmmm@gmail.com" },
    { label: "Date of Birth", value: "24-06-2000" },
    { label: "Language Selection", value: "Arabic" },
    { label: "Age Category", value: "Adults" },
    { label: "Profile Picture", value: "jpg and png file" },
    { label: "Bank IBAN", value: "Al Rajhi Bank" },
    { label: "Account Number", value: "100000000000000000" },
  ];

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
    {
      title: "Medical Record",
      id: "medical_record",
      content: (
        <CustomerMedicalRecord
          customerId={customer_id}
          searchParams={searchParams}
        />
      ),
    },
    {
      title: "Metrics",
      id: "metrics",
      content: (
        <CustomerMetricRecord
          customerId={customer_id}
          searchParams={searchParams}
        />
      ),
    },
    {
      title: "Family",
      id: "family",
      content: (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 py-6 ">
          {[
            {
              name: "Rima Majid Al Majid",
              relation: "Mother",
              age: 50,
              file: 564564566,
            },
            {
              name: "Muhammad Majid Al Majid",
              relation: "Mother",
              age: 15,
              file: 6546456456,
            },
          ].map((member, idx) => (
            <Card className="" key={member.name + idx}>
              <CardContent className="flex flex-row gap-2 pt-4">
                <div className="flex-1 flex flex-col gap-2 text-sm">
                  <p className=" text-lg font-semibold">{member.name}</p>
                  <p>
                    Age : <span>{member.age}</span>
                  </p>
                  <p>
                    File Number : <span>{member.file}</span>
                  </p>
                  <p>
                    Relative Relation : <span>{member.relation}</span>
                  </p>
                </div>
                <div className="flex flex-col justify-start items-end">
                  <Button variant={"ghost"} size={"sm"} className="text-xs">
                    <Repeat />
                    <span>Switch Profile</span>
                  </Button>
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    className="text-red-500 text-xs"
                  >
                    <Trash />
                    <span>Delete</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ),
    },
    {
      title: "Specialists",
      id: "specialist",
      content: (
        <CustomerSpecialistRecord
          customerId={customer_id}
          searchParams={searchParams}
        />
      ),
    },
    {
      title: "Tickets",
      id: "ticket",
      content: (
        <CustomerTicketRecord
        customerId={customer_id}
        searchParams={searchParams}
      />
      ),
    },
    {
      title: "Wallet",
      id: "wallet",
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
    {
      title: "Comments",
      id: "comment",
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
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="h-full min-h-[80vh]">
        <div className="flex flex-col gap-8">
          <div className="flex flex-row justify-between gap-4">
            <div className="flex flex-row gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>RA</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-semibold">
                    Rayan Abdullah Al Abdullah
                  </h1>
                  <Badge>Master</Badge>
                </div>
                <p className="text-muted-foreground">0985430574895784</p>
              </div>
            </div>
            <div>
              <Button>Block the client</Button>
            </div>
          </div>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="w-full justify-start  h-auto p-0 bg-background flex flex-row flex-wrap">
              {tabData.map((tab, idx) => (
                <TabsTrigger
                  key={tab.id + idx}
                  value={tab.id}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary  flex-1"
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
  );
}
