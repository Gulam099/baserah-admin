"use client"
import { useState } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { EmployeeItemType, TeamItemType } from "../types/permission.type"
import { ApiBaseUrl } from "../../../../const"

const formSchema = z.object({
  name: z.string().min(3, "Team name must be at least 3 characters."),
  members: z.array(z.string()).nonempty("Please select at least one member."),
})

type CreateTeamFormType = z.infer<typeof formSchema>

interface AddNewTeamDialogProps {
  employees: EmployeeItemType[]
  teams: TeamItemType[]
}

export default function AddNewTeamDialog(props: AddNewTeamDialogProps) {
  const { employees } = props

  const form = useForm<CreateTeamFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      members: [],
    },
  })

  // Handle form submission
  async function onSubmit(values: CreateTeamFormType) {
    try {
      // 1) POST to /api/admin/teams
      const response = await fetch(`/api/admin/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      // 2) Check if response is OK
      if (!response.ok) {
        // e.g. 400 or 500
        const errorData = await response.json()
        toast.error(errorData?.message || "Failed to create team.")
        return
      }

      // 3) Parse JSON
      const data = await response.json()
      // data might look like:
      // {
      //   "message": "Team created",
      //   "success": true,
      //   "team_id": "67d178ab623032180afb17e7"
      // }

      if (data.success) {
        toast.success(data.message || "Team created successfully!")
        // Optionally reset the form and/or close dialog
        form.reset()
      } else {
        // e.g. "Missing required fields", "success": false
        toast.error(data.message || "Failed to create team.")
      }
    } catch (error) {
      console.error("Form submission error", error)
      toast.error("Failed to submit the form. Please try again.")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add new team</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Team</DialogTitle>
          <DialogDescription>You can create a new team here.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
            {/* Team Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Technical team" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Members Field */}
            <FormField
              control={form.control}
              name="members"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Add members</FormLabel>
                  <FormControl>
                    <MultiSelector
                      values={field.value}
                      onValuesChange={field.onChange}
                      loop
                    >
                      <MultiSelectorTrigger>
                        <MultiSelectorInput placeholder="Select members" />
                      </MultiSelectorTrigger>
                      <MultiSelectorContent>
                        <MultiSelectorList>
                          {employees.map((emp, idx) => (
                            <MultiSelectorItem
                              key={emp._id}
                              value={emp._id}
                            >
                              {emp.name} - {emp._id}
                            </MultiSelectorItem>
                          ))}
                        </MultiSelectorList>
                      </MultiSelectorContent>
                    </MultiSelector>
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
  )
}
