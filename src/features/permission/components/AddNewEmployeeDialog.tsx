"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiBaseUrl } from "../../../../const";
import { useTranslation } from "react-i18next";


// A team item has at least an _id and a name
interface TeamItemType {
  _id: string;
  name: string;
  // Add other fields if needed
}

// The data needed to create an employee
const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  email: z.string().email("Invalid email address."),
  role: z.string().min(2, "Role must be at least 2 characters."),
  department: z.string().min(2, "Department must be at least 2 characters."),
  team_id: z.string().nonempty("Please select at least one team."),
});

// We accept an array of `teams` so the user can pick from them.
interface AddNewEmployeeDialogProps {
  teams: TeamItemType[];
}

export default function AddNewEmployeeDialog({
  teams,
}: AddNewEmployeeDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      department: "",
      team_id: "",
    },
  });
  const { t } = useTranslation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Make the POST request
      const response = await fetch(`/api/admin/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });


      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data?.message || t("employee.createError"));
        return;
      }

      toast.success(data.message || t("employee.createSuccess"));
      form.reset();
    } catch (error) {
      console.error("AddEmployeeDialog error:", error);
      toast.error(t("employee.submitError"));
    }
  }

  return (
    <Dialog >
      <DialogTrigger asChild>
        <Button>{t("employee.addNew")}</Button>
      </DialogTrigger>

      <DialogContent className="max-h-screen overflow-y-auto">

        <DialogHeader>
          <DialogTitle>{t("employee.dialogTitle")}</DialogTitle>
          <DialogDescription>{t("employee.dialogDescription")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-6"
          >
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("employee.nameLabel")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("employee.namePlaceholder")} type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("employee.emailLabel")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("employee.emailPlaceholder")} type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("employee.departmentLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("employee.departmentPlaceholder")}
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Department */}
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("employee.departmentLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("employee.departmentPlaceholder")}
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Teams - Select for team_ids */}
            <FormField
              control={form.control}
              name="team_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("employee.teamLabel")}</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("employee.teamPlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>{t("employee.teamGroupLabel")}</SelectLabel>
                          {teams.map((team) => (
                            <SelectItem key={team._id} value={team._id}>
                              {team.name} - {team._id}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit">{t("employee.createButton")}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
