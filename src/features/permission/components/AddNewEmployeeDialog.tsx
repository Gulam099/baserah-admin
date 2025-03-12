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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Make the POST request
      const response = await fetch(`${ApiBaseUrl}/api/admin/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        // e.g. 400 or 500
        const errorData = await response.json();
        toast.error(errorData?.message || "Failed to create employee.");
        return;
      }

      const data = await response.json();
      // Example success:
      // {
      //   "employee_id": "67d16e81cc99d18ce55fca6e",
      //   "message": "Employee created",
      //   "success": true
      // }

      if (data.success) {
        toast.success(data.message || "Employee created successfully!");
        form.reset();
        // Optionally close dialog or re-fetch employees
      } else {
        toast.error(data.message || "Failed to create employee.");
      }
    } catch (error) {
      console.error("AddEmployeeDialog error:", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add new employee</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Use this form to create a new employee record.
          </DialogDescription>
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Alice Johnson" type="text" {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="alice@example.com"
                      type="email"
                      {...field}
                    />
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
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input placeholder="QA Engineer" type="text" {...field} />
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
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Quality Assurance"
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
                  <FormLabel>Teams</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a team" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Team</SelectLabel>
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
            <Button type="submit">Create</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
