"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import Contracts from "@/features/specialist/components/contracts";
import CV from "@/features/specialist/components/cv";
import Content from "@/features/specialist/components/content";
import Rating from "@/features/specialist/components/rating";
import EditSpecialistDialog from "@/features/specialist/components/edit-specialist-dialog";
import { useParams } from "next/navigation";

export default function SpecialistPage() {
  const params = useParams<{ specialist_Id: string }>();

  const { specialist_Id } = params;

  const info = [
    { label: "Mobile Number", value: "0555555555" },
    { label: "Email", value: "mmmmmmm@gmail.com" },
    { label: "Language Selection", value: "Arabic" },
    { label: "Age Category", value: "Adults" },
    { label: "Profile Picture", value: "jpg and png file" },
    { label: "Consultation Method", value: "Video - Audio" },
    { label: "Bank IBAN", value: "Al Rajhi Bank" },
    { label: "Account Number", value: "100000000000000000" },
    { label: "Session Price or Pricing", value: "300 SAR" },
  ];

  const timeline = [
    {
      status: "Submit Specialist",
      date: "12-12-2023",
      active: true,
    },
    {
      status: "Initial approval",
      date: "G note",
      active: true,
    },
    {
      status: "Interview",
      date: "",
      active: false,
    },
    {
      status: "Final approval",
      date: "",
      active: false,
    },
    {
      status: "Send Contract",
      date: "",
      active: false,
    },
    {
      status: "Authenticate Contract",
      date: "",
      active: false,
    },
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
      title: "Contracts",
      id: "contracts",
      content: <Contracts specilaistId={specialist_Id} />,
    },
    {
      title: "CV",
      id: "cv",
      content: <CV specilaistId={specialist_Id} />,
    },
    {
      title: "Content",
      id: "content",
      content: <Content specilaistId={specialist_Id} />,
    },
    {
      title: "Ratings",
      id: "rating",
      content: <Rating specilaistId={specialist_Id} />,
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="grid md:grid-cols-[5fr,2fr] gap-4 items-start justify-between h-full min-h-[80vh]">
        <div className="flex flex-col gap-8">
          <div className="flex gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>RA</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold">
                  Rayan Abdullah Al Abdullah
                </h1>
                <span className="text-sm px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                  Approval Pending
                </span>
              </div>
              <p className="text-muted-foreground">Psychologist</p>
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

        <div className="flex flex-col gap-4 h-full ">
          <div className=" bg-red-100 p-6 rounded-2xl ">
            <div className="flex  items-start gap-2 text-destructive mb-2">
              <AlertTriangle className="w-4 h-4" />
              <div>
                <div className="font-semibold">
                  Commission Classification Number
                </div>
              </div>
            </div>
            <p className="text-destructive">204587599395</p>
            <div className="text-sm text-muted-foreground">
              Expiry Date: 2023/07/15
            </div>
          </div>
          <div className="h-full flex flex-col gap-2 border rounded-2xl p-6">
            <div className="relative flex-1">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />
              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <div key={index} className="relative pl-8">
                    <div
                      className={`absolute left-4 w-2.5 h-2.5 rounded-full -translate-x-1/2 ${
                        item.active ? "bg-primary" : "bg-muted-foreground"
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
            <div className="flex gap-2 justify-end ">
              <StatusDialog timeline={timeline} />
              <AddNoteDialog />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
                  className={`absolute left-3.5 w-2.5 h-2.5 rounded-full -translate-x-1/2 ${
                    item.active ? "bg-primary" : "bg-muted-foreground"
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
