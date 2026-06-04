"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

import { useParams, useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft } from "lucide-react";

import Contracts from "@/features/specialist/components/contracts";
import CV from "@/features/specialist/components/cv";
import Content from "@/features/specialist/components/content";
import Rating from "@/features/specialist/components/rating";
import EditSpecialistDialog from "@/features/specialist/components/edit-specialist-dialog";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ApiBaseUrl, ApiBaseUrlLocal } from "../../../../const";
import { toast } from "sonner";
import Certificate from "./certificate";
import { useTranslation } from "react-i18next";


interface SpecialistData {
  _id: string;
  clerkId: string;
  address: string;
  age_categories: string[];
  approval_status: string;
  available: boolean;
  bio: string;
  classification?: string;
  consultation_method: string[];
  contract?: any;
  created_at: string;
  cv?: string | null;
  education: string[];
  email: string;
  experience: string;
  fees: string;
  full_name: string;
  is_active: boolean;
  is_approved: boolean;
  is_authenticated: boolean;
  language: string[];
  phoneNumber: string;
  profile_picture: string;
  response_time: string;
  specialization: string;
  sub_specialization: string;
  updated_at: string;
}

type UploadedCertificate = {
  title: string;
  s3url: string;
  // add other fields if needed
};

export default function SpecialistPage() {
  const { specialist_Id } = useParams<{ specialist_Id: string }>();
  const router = useRouter();
  const { t } = useTranslation();

  const [specialist, setSpecialist] = useState<SpecialistData | null>(null);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);



  // 1) fetch the specialist on mount
  useEffect(() => {
    async function fetchSpecialist() {
      const res = await axios.get(
        `${ApiBaseUrlLocal}/api/doctors/doctor/${specialist_Id}`
      );
      const data = res.data?.data;
      setSpecialist(data as SpecialistData);
    }
    if (specialist_Id) {
      fetchSpecialist();
    }
  }, [specialist_Id]);

  // if (loading) {
  //   return (
  //     <div className="container mx-auto py-6">
  //       <p>Loading...</p>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="container mx-auto py-6">
  //       <p className="text-red-500">{error}</p>
  //     </div>
  //   );
  // }

  if (!specialist) {
    return (
      <div className="container mx-auto py-6">
        <p>{t("no_specialist_data")}</p>
      </div>
    );
  }

  console.log("special??", specialist);

  const info = [
    { label: t("mobile_number"), value: specialist?.phoneNumber },
    { label: t("email"), value: specialist?.email || t("not_available") },
    {
      label: t("language_selection"),
      value: specialist?.language?.join(", ") || t("not_available"),
    },
    {
      label: t("age_categories"),
      value: specialist?.age_categories?.join(", ") || t("not_available"),
    },
    {
      label: t("fees"),
      value: specialist?.fees ? `${specialist?.fees} SAR` : t("not_available"),
    },
  ];

  // 2) timeline could be partly dynamic if you want to reflect
  // approval_status logic. Here's an example:
  const timeline = [
    { status: t("accepted"), key: "accepted", date: "", active: false },
    { status: t("contract_send"), key: "contract_send", date: "", active: false },
    { status: t("auth_contract"), key: "auth_contract", date: "", active: false },
    {
      status: t("initial_approved"),
      key: "initial_approved",
      date: specialist.approval_status === "Initial Approved" ? "Date here" : "",
      active: specialist.approval_status === "Initial Approved",
    },
    {
      status: t("final_approved"),
      key: "final_approved",
      date: specialist.approval_status === "Final Approved" ? "some date" : "",
      active: specialist.approval_status === "Final Approved",
    },
  ];

  const tabData = [
    {
      title: t("general_information"),
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
      title: t("contract"),
      id: "contracts",
      content: <Contracts initialApprovalStatus={specialist?.approval_status} specilaistId={specialist?._id} clerkId={specialist?.clerkId} />,
    },
    {
      title: t("cvv"),
      id: "cv",
      content: <CV data={specialist} />,
    },
    {
      title: t("certificatess"),
      id: "certificates",
      content: <Certificate doctorNumber={specialist?.phoneNumber} />,
    },
    {
      title: t("contentt"),
      id: "content",
      content: <Content doctorId={specialist?._id} />,
    },
    {
      title: t("ratings"),
      id: "rating",
      content: <Rating doctorId={specialist?._id} />,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "final_approved":
        return "bg-green-100 text-green-700";
      case "auth_contract":
        return "bg-red-100 text-red-700";
      case "initial_approved":
        return "bg-purple-100 text-purple-700";
      case "contract_send":
        return "bg-yellow-100 text-yellow-700";
      case "accepted":
        return "bg-blue-100 text-blue-700"; // Add this line
      default:
        return "bg-gray-100 text-gray-700";
    }
  };


  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button variant="outline" onClick={() => router.back()} className="w-fit">
        <ArrowLeft className="w-4 h-4 mr-2" />
      </Button>
      <div className="grid md:grid-cols-[5fr,2fr] gap-4 items-start justify-between h-full min-h-[80vh]">
        <div className="flex flex-col gap-8">
          {/* Top row with avatar & name */}
          <div className="flex gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={specialist?.profile_picture || ""} />
              <AvatarFallback>RA</AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold">
                  {specialist?.full_name || t("unknown_specialist")}
                </h1>

                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(
                    specialist?.approval_status
                  )}`}
                >
                  {t(specialist?.approval_status?.toLowerCase() || "no_status")}
                </span>
              </div>

              <p className="text-muted-foreground">
                {specialist?.specialization}
              </p>
            </div>
          </div>

          {/* Tabs */}
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

        {/* Right Column: classification + timeline */}
        <div className="flex flex-col gap-4 h-full">
          {/* <div className="bg-red-100 p-6 rounded-2xl">
            <div className="flex items-start gap-2 text-destructive mb-2">
              <AlertTriangle className="w-4 h-4" />
              <div className="font-semibold">
                Commission Classification Number
              </div>
            </div>
            <p className="text-destructive">
              {specialist?.classification || "N/A"}
            </p>
            <div className="text-sm text-muted-foreground">
              Expiry Date: 2023/07/15
            </div>
          </div> */}

          <div className="h-96 flex flex-col gap-2 border rounded-2xl p-6">
            <div className="relative flex-1">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />
              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <div key={index} className="relative pl-8">
                    <div
                      className={`absolute left-4 w-2.5 h-2.5 rounded-full -translate-x-1/2 ${specialist?.approval_status === item.key ? "bg-primary" : "bg-muted-foreground"
                        }`}
                    />
                    <div className="font-medium">{item.status}</div>
                    {item.date && (
                      <div className="text-sm text-muted-foreground">
                        {item.date}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              {/* <StatusDialog timeline={timeline} /> */}
              {/* <AddNoteDialog /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// The dialog for adding a note
function AddNoteDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Write Note</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Enter Note</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Team</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Administrator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Person's Name</Label>
            <Input placeholder="Dr. Fahd AlSultan" />
          </div>

          <div className="grid gap-2">
            <Label>Note</Label>
            <Textarea className="min-h-[150px]" placeholder="Enter note text" />
          </div>

          <Button>Send note</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// The dialog for viewing full status timeline
function StatusDialog(props: {
  timeline: {
    status: string;
    date: string;
    active: boolean;
  }[];
}) {
  const { timeline } = props;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>View Full Status</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Specialist Status</DialogTitle>
        </DialogHeader>

        <div className="relative mt-6">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={index} className="relative pl-8">
                <div
                  className={`absolute left-3.5 w-2.5 h-2.5 rounded-full -translate-x-1/2 ${item.active ? "bg-primary" : "bg-muted-foreground"
                    }`}
                />
                <div className="font-medium">{item.status}</div>
                {item.date && (
                  <div className="text-sm text-muted-foreground">
                    {item.date}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
