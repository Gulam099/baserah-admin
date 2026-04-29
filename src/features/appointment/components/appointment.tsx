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
import { fetchAppointmentsRecords } from "@/features/appointment/util/appointment.util";
import { format } from "date-fns";
import { toTitleCase } from "@/features/home/utils/string.utils";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ChangeSessionDialog from "./ChangeSessionDialog";
import { useTranslation } from "react-i18next";
import PageLoading from "@/components/page-loading";

export default function AppointmentPage() {
  const { t } = useTranslation("common");
  const searchParams = useSearchParams();
  const contentRef = useRef<HTMLDivElement>(null);
  const badgeVariant: Record<
    "completed" | "cancelled" | "upcoming" | "ongoing" | "urgent" | "program" | "group",
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning"
    | "danger"
  > = {
    completed: "success",
    cancelled: "danger",
    upcoming: "default",
    ongoing: "secondary",
    urgent: "warning",
    program: "secondary",
    group: "secondary",
  };

  // Read page/pageSize from the URL, or fallback to 1 / 9
  const pageParam = searchParams.get("page");
  const pageSizeParam = searchParams.get("pageSize");
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 10;

  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0); // track total items
  const [searchTerm, setSearchTerm] = useState("");

  // Whenever page/pageSize changes in the URL, fetch new data
  useEffect(() => {
    setLoading(true);
    fetchAppointmentsRecords(currentPage, pageSize)
      .then((res) => {
        setAppointments(res.data!);
        setTotal(res.page?.total!);
      })
      .catch((err) => {
        console.error("Failed to fetch appointments:", err);
      })
      .finally(() => {
        setLoading(false);
      });
    setSearchTerm("");
  }, [currentPage, pageSize]);

  console.log("appointments merger", appointments)

  const filteredAppointments = appointments.filter((appointment) => {
    const patientName = appointment.userId?.name?.toLowerCase() || "";
    const appointmentId = appointment._id?.toLowerCase() || "";
    const doctorName = appointment.doctorId?.full_name?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();

    return (
      patientName.includes(term) ||
      appointmentId.includes(term) ||
      doctorName.includes(term) ||
      appointment.type?.includes(term)
    );
  });

  const appointmentsWithType = filteredAppointments;

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div className="container mx-auto  rtl:flex-row-reverse">
      <div className="flex justify-between items-center gap-2 py-4">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder={t("search_placeholder")}
            className="w-full border rounded px-4 py-2 pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-600"
              aria-label={t("clear_search")}
            >
              &#x2715;
            </button>
          )}
        </div>
        <ExportButton contentRef={contentRef} label={t("export")} excelData={filteredAppointments} />
      </div>

      <Alert className="mb-6 border-yellow-500 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-600">
          {t("emergency_notice")}
        </AlertDescription>
      </Alert>

      <div ref={contentRef} className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("appointment_number")}</TableHead>
              <TableHead>{t("patient")}</TableHead>
              <TableHead>{t("doctor")}</TableHead>
              <TableHead>{t("booking_date")}</TableHead>
              <TableHead>{t("appointment_date")}</TableHead>
              <TableHead>{t("time_slot")}</TableHead>
              <TableHead>{t("type")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              {/* <TableHead className="text-right print:hidden">
                {t("actions")}
              </TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.map((appointment) => {
              const bookingDate = appointment.selectedSlots?.[0]
                ? new Date(appointment.selectedSlots[0])
                : null;

              return (
                <TableRow key={appointment._id}>
                  <TableCell>{appointment._id}</TableCell>
                  <TableCell>
                    {appointment.patientId?.name || appointment.userId?.name || "-"}
                  </TableCell>
                  <TableCell>
                    {appointment.doctor?.full_name || appointment.doctorId?.full_name || "-"}
                  </TableCell>
                  <TableCell>
                    {appointment.createdAt
                      ? format(new Date(appointment.createdAt), "EEE,dd MMM yyyy")
                      : t("-")}
                  </TableCell>
                  <TableCell>
                    {bookingDate
                      ? format(bookingDate, "EEE,dd MMM yyyy")
                      : t("-")}
                  </TableCell>
                  <TableCell>
                    {bookingDate
                      ? format(bookingDate, "hh:mm a")
                      : t("-")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={badgeVariant[appointment.type as keyof typeof badgeVariant] || "secondary"}>
                      {t(appointment.type || "scheduled")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const displayStatus =
                        appointment.status === "pending" ? "upcoming" : appointment.status;

                      return (
                        <Badge
                          variant={
                            badgeVariant[
                            displayStatus as keyof typeof badgeVariant
                            ]
                          }
                        >
                          {t(`status_${displayStatus}`)}
                        </Badge>
                      );
                    })()}
                  </TableCell>
                  {/* <TableCell className="text-right print:hidden px-1">
                    <AppointmentMenu appointment={appointment} />
                  </TableCell> */}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <UnifiedPagination total={total} />
    </div>
  );
}

function AppointmentMenu({ appointment }: { appointment: AppointmentType }) {
  const { t } = useTranslation();
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
                {/* <DialogTrigger asChild>
                  <Button
                    variant={"ghost"}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel Session Appointment
                  </Button>
                </DialogTrigger> */}
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  {/* <Button onClick={() => cancelAppointment(appointment._id)}>
                    Cancel Session Appointment
                  </Button> */}
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
