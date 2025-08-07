"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
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
import { useTranslation } from "react-i18next";
import { title } from "process";
import { Group } from "lucide-react";

// A team item has at least an _id and a name
interface TeamItemType {
  _id: string;
  name: string;
}

// Schema for employee creation form
const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  email: z.string().email("Invalid email address."),
  role: z.string().min(2, "Role must be at least 2 characters."),
  department: z.string().min(2, "Department must be at least 2 characters."),
  team_id: z.string().nonempty("Please select at least one team."),
  permissions: z.array(z.string()).min(1, "Select at least one permission"),
});

const sidebarItems = [
  { key: "appointments", title: "Appointments" },
  { key: "approval", title: "Approval" },
  { key: "reports", title: "Reports" },
  { key: "specialization", title: "Specialization" },
  { key: "contractsSpecialists", title: "Specialists" },
  { key: "customers", title: "Customers" },
  { key: "infoBank", title: "Information Bank" },
  { key: "financial", title: "Financial" },
  { key: "permissions", title: "Permissions" },
  { key: "group", title: "Groups" },
];

interface AddNewEmployeeDialogProps {
  teams: TeamItemType[];
}

export default function AddNewEmployeeDialog({ teams }: AddNewEmployeeDialogProps) {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      department: "",
      team_id: "",
      permissions: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch(`/api/admin/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      console.log("epmlyee submit ", data);

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
    <Dialog>
      <DialogTrigger asChild>
        <Button>{t("employee.addNew")}</Button>
      </DialogTrigger>

      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("employee.dialogTitle")}</DialogTitle>
          <DialogDescription>{t("employee.dialogDescription")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">

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
                  <FormLabel>{t("employee.roleLabel")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("employee.rolePlaceholder")} type="text" {...field} />
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

            {/* Team ID */}
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

            {/* Permissions checkboxes */}
            <FormItem>
              <FormLabel>{t("employee.permissionsLabel")}</FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 gap-2">
                  {sidebarItems.map((item) => (
                    <Controller
                      key={item.key}
                      name="permissions"
                      control={form.control}
                      render={({ field }) => {
                        const isChecked = field.value?.includes(item.key) || false;
                        return (
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  field.onChange([...field.value, item.key]);
                                } else {
                                  field.onChange(
                                    field.value.filter((v: string) => v !== item.key)
                                  );
                                }
                              }}
                            />
                            <label className="text-sm font-normal">{item.title}</label>
                          </div>
                        );
                      }}
                    />
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>

            <Button type="submit">{t("employee.createButton")}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
