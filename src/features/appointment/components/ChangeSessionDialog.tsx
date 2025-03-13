"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
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
import { Input } from "@/components/ui/input";
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
import { modifyAppointment } from "../util/appointment.util";

const formSchema = z.object({
  appointment_time: z.coerce.date().optional(),
  doctor_id: z.string().optional(),
});

export default function ChangeSessionDialog(props: {
  appointment: AppointmentType;
}) {
  const { appointment } = props;
  const [changeDoctor, setChangeDoctor] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appointment_time: new Date(),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      modifyAppointment(appointment._id, {
        appointment_time: values.appointment_time?.toString(),
        doctor_id: changeDoctor && values.doctor_id ? values.doctor_id : appointment.doctor,
      });
      toast.success("Appointment modified successfully");
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to modify the appointment. Please try again.");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"} onClick={(e) => e.stopPropagation()}>
          <Calendar className="mr-2 h-4 w-4" />
          Change Session Appointment
        </Button>
      </DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Modify Appointment</DialogTitle>
          <DialogDescription>
            Adjust the appointment details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mx-auto py-6"
          >
            <FormField
              control={form.control}
              name="appointment_time"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <p className="text-sm">
                    {appointment.date
                      ? format(
                          new Date(appointment.date),
                          "EEE , dd MMM yyyy , hh:mm a"
                        )
                      : "Invalid Date"}
                  </p>
                  <FormLabel>New Appointment Time</FormLabel>
                  <DatetimePicker
                    {...field}
                    format={[["months", "days", "years"], ["hours", "minutes", "am/pm"]]}
                  />
                  <FormDescription>
                    Select a new date and time for the appointment.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-2">
              <Switch
                checked={changeDoctor}
                onCheckedChange={setChangeDoctor}
              />
              <FormLabel>Change Doctor</FormLabel>
            </div>

            {changeDoctor && (
              <FormField
                control={form.control}
                name="doctor_id"
                render={({ field }) => (
                  <FormItem>
                    <p className="text-sm">Current Doctor: {appointment.doctor_name}</p>
                    <FormLabel>New Doctor ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter new doctor ID"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Transfer this appointment to a different specialist.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type="submit">Confirm Changes</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
