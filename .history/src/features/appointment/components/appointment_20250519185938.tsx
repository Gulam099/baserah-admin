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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ExportButton from "@/features/home/components/ExportButton";
import { useEffect, useRef, useState } from "react";
import { AppointmentType } from "@/features/appointment/types/appointment.type";
import UnifiedPagination from "@/features/home/components/UnifiedPagination";
import {
  cancelAppointment,
  fetchAppointmentsRecords,
} from "@/features/appointment/util/appointment.util";
import { format } from "date-fns";
import { toTitleCase } from "@/features/home/utils/string.utils";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ChangeSessionDialog from "./ChangeSessionDialog";

export default function AppointmentPage() {
  const searchParams = useSearchParams();
  const contentRef = useRef<HTMLDivElement>(null);
  const badgeVariant: Record<
    "confirmed" | "cancelled" | "upcoming" | "ongoing",
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning"
    | "danger"
  > = {
    confirmed: "success",
    cancelled: "danger",
    upcoming: "default",
    ongoing: "warning",
  };

  // Read page/pageSize from the URL, or fallback to 1 / 9
  const pageParam = searchParams.get("page");
  const pageSizeParam = searchParams.get("pageSize");
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
        setAppointments(res.data!);
        setTotal(res.page?.total!); // for UnifiedPagination's `total` prop
      })
      .catch((err) => {
        console.error("Failed to fetch questions:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage, pageSize]);

  console.log("appoinment", appointments);

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
              <TableHead>Appointment Number</TableHead>
              {/* <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead> */}
              <TableHead>Booking Date</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Time Slot</TableHead>
              <TableHead>Date</TableHead>
              {/* <TableHead>Status</TableHead> */}
              <TableHead className="text-right print:hidden">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment._id}>
                <TableCell>{appointment._id}</TableCell>
                {/* <TableCell>
                  <Link
                    href={`/dashboard/customer/${appointment.user}`}
                    className="underline"
                  >
                    {appointment.patient_name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/dashboard/specialist/${appointment.doctor}`}
                    className="underline"
                  >
                    {appointment.doctor_name}
                  </Link>
                </TableCell> */}
                <TableCell>
                  {appointment.createdAt
                    ? format(
                      new Date(appointment.createdAt),
                      "EEE , dd MMM yyyy , hh:mm a"
                    )
                    : "Invalid Date"}
                </TableCell>
                <TableCell>{appointment.program}</TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>
                  {appointment.date
                    ? format(
                      new Date(appointment.date),
                      "EEE , dd MMM yyyy , hh:mm a"
                    )
                    : "Invalid Date"}
                </TableCell>
                <TableCell>
                  {/* <div className="flex items-center gap-2">
                    <Badge variant={badgeVariant[appointment.status]}>
                      {toTitleCase(appointment.status)}
                    </Badge>
                    {appointment.isImmediate && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div> */}
                </TableCell>
                <TableCell className="text-right print:hidden">
                  <AppointmentMenu appointment={appointment} />
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

function AppointmentMenu({ appointment }: { appointment: AppointmentType }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* <DropdownMenuItem>
                        <FileText className="mr-2 h-4 w-4" />
                        Medical Record
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Customer Conversation
                      </DropdownMenuItem> */}
        {/* <DropdownMenuItem>
          <Ticket className="mr-2 h-4 w-4" />
          Open ticket
        </DropdownMenuItem> */}
        {appointment.status !== "cancelled" && (
          <>
            <DropdownMenuItem className="text-red-600">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant={"ghost"}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel Session Appointment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <Button onClick={() => cancelAppointment(appointment._id)}>
                    Cancel Session Appointment
                  </Button>
                </DialogContent>
              </Dialog>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ChangeSessionDialog appointment={appointment} />
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
