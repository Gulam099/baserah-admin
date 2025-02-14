"use client";

import {
  AlertTriangle,
  MoreVertical,
  FileText,
  MessageSquare,
  Ticket,
  X,
  Calendar,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ExportButton from "@/features/home/components/ExportButton";
import { useEffect, useRef, useState } from "react";
import { AppointmentType } from "@/features/appointment/types/appointment.type";
import { fetchAppointmentsRecords } from "@/features/appointment/data/appointment.data";
import UnifiedPagination from "@/features/home/components/UnifiedPagination";

export default function page({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500 text-white";
      case "Upcoming":
        return "bg-yellow-500 text-white";
      case "Ongoing":
        return "bg-blue-500 text-white";
      case "Cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Read page/pageSize from the URL, or fallback to 1 / 9
  const pageParam = searchParams.page;
  const pageSizeParam = searchParams.pageSize;
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 10;

  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0); // track total items

  // Whenever page/pageSize changes in the URL, fetch new data
  useEffect(() => {
    setLoading(true);
    fetchAppointmentsRecords(currentPage, pageSize)
      .then((res) => {
        setAppointments(res.data);
        setTotal(res.total); // for UnifiedPagination's `total` prop
      })
      .catch((err) => {
        console.error("Failed to fetch questions:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage, pageSize]);

  return (
    <div className="container mx-auto ">
      <div className="flex justify-end items-center gap-2 py-4">
        <ExportButton contentRef={contentRef} />
      </div>
      <Alert className="mb-6 border-yellow-500 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-600">
          The presence of this symbol means that there is a psychological
          emergency in the case, for example the presence of suicidal thoughts
        </AlertDescription>
      </Alert>

      <div ref={contentRef} className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Booking Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right print:hidden">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.number}</TableCell>
                <TableCell>{appointment.name}</TableCell>
                <TableCell>{appointment.bookingDate}</TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>{appointment.date}</TableCell>
                <TableCell>{appointment.type}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                    {appointment.isImmediate && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right print:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <FileText className="mr-2 h-4 w-4" />
                        Medical Record
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Customer Conversation
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Ticket className="mr-2 h-4 w-4" />
                        Open ticket
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <X className="mr-2 h-4 w-4" />
                        Cancel Session Appointment
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="mr-2 h-4 w-4" />
                        Change Session Appointment
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <UnifiedPagination total={total} />
    </div>
  );
}
