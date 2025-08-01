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
import { useTranslation } from "react-i18next"

const formSchema = z.object({
  name: z.string().min(3, "Team name must be at least 3 characters."),
  members: z.array(z.string()).nonempty("Please select at least one member."),
})

type CreateTeamFormType = z.infer<typeof formSchema>

interface AddNewTeamDialogProps {
  employees: EmployeeItemType[]
  teams: TeamItemType[]
}

// Dummy permissions list
const allPermissions = [
  "view_tickets",
  "reply_to_tickets",
  "transfer_tickets",
  "edit_notes",
  "review_chats",
  "reply_chats",
  "delete_chats",
  "close_ticket",
  "add_sla",
]

export default function AddNewTeamDialog(props: AddNewTeamDialogProps) {
  const { employees } = props
  const { t } = useTranslation()

  const [createdTeamId, setCreatedTeamId] = useState<string | null>(null)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

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
      const response = await fetch(`/api/admin/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        toast.error(data?.message || t("teamm.createError"))
        return
      }

      toast.success(data.message || t("teamm.createSuccess"))
      setCreatedTeamId(data.team_id)
      setSelectedPermissions([]) // reset permission checkboxes
      form.reset()
    } catch (error) {
      console.error("Form submission error", error)
      toast.error(t("teamm.submitError"))
    }
  }

  async function savePermissions() {
    if (!createdTeamId) return

    try {
      const res = await fetch(`/api/admin/teams/${createdTeamId}/permissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissions: selectedPermissions }),
      })

      const result = await res.json()

      if (!res.ok || !result.success) {
        toast.error(result?.message || "Failed to save permissions")
        return
      }

      toast.success("Permissions updated successfully")
      setCreatedTeamId(null)
    } catch (err) {
      console.error(err)
      toast.error("Error saving permissions")
    }
  }

  const togglePermission = (perm: string) => {
    setSelectedPermissions(prev =>
      prev.includes(perm)
        ? prev.filter(p => p !== perm)
        : [...prev, perm]
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{t("teamm.addNew")}</Button>
      </DialogTrigger>

      <DialogContent className="max-h-[94vh] overflow-y-auto">

        <DialogHeader>
          <DialogTitle>{t("teamm.dialogTitle")}</DialogTitle>
          <DialogDescription>{t("teamm.dialogDescription")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
            {/* Team Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("teamm.nameLabel")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("teamm.namePlaceholder")} type="text" {...field} />
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
                  <FormLabel>{t("teamm.membersLabel")}</FormLabel>
                  <FormControl>
                    <MultiSelector values={field.value} onValuesChange={field.onChange} loop>
                      <MultiSelectorTrigger>
                        <MultiSelectorInput placeholder={t("teamm.membersPlaceholder")} />
                      </MultiSelectorTrigger>
                      <MultiSelectorContent>
                        <MultiSelectorList>
                          {employees.map((emp) => (
                            <MultiSelectorItem key={emp._id} value={emp._id}>
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
            <Button type="submit">{t("teamm.createButton")}</Button>
          </form>
        </Form>

        {/* Permission Checkboxes After Team Creation */}
        {createdTeamId && (
          <div className="mt-6 space-y-4">
            <h4 className="font-semibold">Set Team Permissions</h4>
            <div className="grid grid-cols-2 gap-3">
              {allPermissions.map((perm) => (
                <label key={perm} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(perm)}
                    onChange={() => togglePermission(perm)}
                  />
                  {perm.replaceAll("_", " ")}
                </label>
              ))}
            </div>
            <Button className="mt-4" onClick={savePermissions}>
              Save Permission Settings
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
