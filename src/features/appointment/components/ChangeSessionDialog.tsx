"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DatetimePicker } from "@/components/ui/datetime-picker";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "iconsax-react";
import { AppointmentType } from "../types/appointment.type";
import { format } from "date-fns";
import { ApiBaseUrlLocal } from "../../../../const";
import { useTranslation } from "react-i18next";

const formSchema = z.object({
  appointment_time: z.coerce.date().optional(),
  doctorId: z.string().optional(),
});

export default function ChangeSessionDialog({
  appointment,
}: {
  appointment: AppointmentType;
}) {
  const { t } = useTranslation("common");
  const [changeDoctor, setChangeDoctor] = useState(false);
  const [doctors, setDoctors] = useState<{ _id: string; full_name: string }[]>(
    []
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appointment_time: appointment.date
        ? new Date(appointment.date)
        : new Date(),
      doctorId: appointment.doctorId?._id || "",
    },
  });

  useEffect(() => {
    async function loadDoctors() {
      try {
        const res = await fetch(`${ApiBaseUrlLocal}/api/doctors/getall`);
        const data = await res.json();
        if (data.success) {
          setDoctors(data.data);
        } else {
          console.error("Failed to load doctors:", data.message);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    }
    loadDoctors();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const payload: Record<string, any> = {};

      if (values.appointment_time) {
        payload.selectedSlots = [values.appointment_time];
      }
      if (changeDoctor && values.doctorId) {
        payload.doctorId = values.doctorId;
      }

      const res = await fetch(
        `${ApiBaseUrlLocal}/api/admin/appointments/${appointment._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to update appointment");
      toast.success(t("appointment_modified_success"));
    } catch (error) {
      console.error("Form submission error", error);
      toast.error(t("appointment_modified_error"));
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" onClick={(e) => e.stopPropagation()}>
          <Calendar className="mr-2 h-4 w-4" />
          {t("change_session_appointment")}
        </Button>
      </DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{t("modify_appointment")}</DialogTitle>
          <DialogDescription>{t("modify_appointment_desc")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mx-auto py-6"
          >
            {/* Appointment Time */}
            <FormField
              control={form.control}
              name="appointment_time"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <p className="text-sm">
                    {appointment.date
                      ? format(
                        new Date(appointment.date),
                        "EEE, dd MMM yyyy, hh:mm a"
                      )
                      : t("invalid_date")}
                  </p>
                  <FormLabel>{t("new_appointment_time")}</FormLabel>
                  <DatetimePicker
                    {...field}
                    format={[
                      ["months", "days", "years"],
                      ["hours", "minutes", "am/pm"],
                    ]}
                  />
                  <FormDescription>
                    {t("new_appointment_time_desc")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Change Doctor Switch */}
            <div className="flex items-center space-x-2">
              <Switch
                checked={changeDoctor}
                onCheckedChange={setChangeDoctor}
              />
              <FormLabel>{t("change_doctor")}</FormLabel>
            </div>

            {/* Doctor Dropdown */}
            {changeDoctor && (
              <FormField
                control={form.control}
                name="doctorId"
                render={({ field }) => (
                  <FormItem>
                    <p className="text-sm">
                      {t("current_doctor")}:{" "}
                      {appointment.doctorId?.full_name || t("not_available")}
                    </p>
                    <FormLabel>{t("new_doctor")}</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("select_a_doctor_placeholder")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors.map((doc) => (
                            <SelectItem key={doc._id} value={doc._id}>
                              {doc.full_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      {t("transfer_appointment_desc")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit">{t("confirm_changes")}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
