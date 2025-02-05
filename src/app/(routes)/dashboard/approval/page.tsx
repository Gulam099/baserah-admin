"use client";

import { format, parseISO } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CircleIcon } from "lucide-react";
import { Eye } from "iconsax-react";
import Link from "next/link";

// Define the status types and their corresponding styles
const statusStyles = {
  Completed: "bg-green-100 text-green-800 hover:bg-green-100",
  Upcoming: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  Ongoing: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  Cancelled: "bg-red-100 text-red-800 hover:bg-red-100",
};

type ContentItem = {
  contentType: string;
  specialist: string;
  datetime: string; // ISO string
  approvalStatus: keyof typeof statusStyles;
};

const contents: ContentItem[] = [
  {
    contentType: "Audio",
    specialist: "Muhammad Al-Muhammad",
    datetime: "2023-03-05T03:50:00Z",
    approvalStatus: "Completed",
  },
  {
    contentType: "Video",
    specialist: "Muhammad Al-Muhammad",
    datetime: "2023-03-05T03:50:00Z",
    approvalStatus: "Upcoming",
  },
  {
    contentType: "Article",
    specialist: "Muhammad Al-Muhammad",
    datetime: "2023-03-05T03:50:00Z",
    approvalStatus: "Ongoing",
  },
  {
    contentType: "Add a specialist",
    specialist: "Muhammad Al-Muhammad",
    datetime: "2023-03-05T03:50:00Z",
    approvalStatus: "Completed",
  },
  {
    contentType: "Program",
    specialist: "Muhammad Al-Muhammad",
    datetime: "2023-03-05T03:50:00Z",
    approvalStatus: "Cancelled",
  },
  {
    contentType: "Support Group",
    specialist: "Muhammad Al-Muhammad",
    datetime: "2023-03-05T03:50:00Z",
    approvalStatus: "Completed",
  },
  {
    contentType: "Audio",
    specialist: "Muhammad Al-Muhammad",
    datetime: "2023-03-05T03:50:00Z",
    approvalStatus: "Completed",
  },
];

export default function ContentApprovalPage() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Content Type</TableHead>
            <TableHead>Specialist</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Approval Status</TableHead>
            <TableHead>Approval Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contents.map((content, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                {content.contentType}
              </TableCell>
              <TableCell>{content.specialist}</TableCell>
              <TableCell>
                {format(parseISO(content.datetime), "HH:mm a")}
              </TableCell>
              <TableCell>
                {format(parseISO(content.datetime), "dd MMM yyyy")}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={statusStyles[content.approvalStatus]}
                >
                  {content.approvalStatus}
                </Badge>
              </TableCell>
              <TableCell >
                <Link href={'/'}>
                <Eye className="size-7 text-white bg-primary-600 p-1 rounded-lg" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
