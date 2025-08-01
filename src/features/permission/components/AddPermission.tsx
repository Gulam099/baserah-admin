"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface PermissionGroupDisplayProps {
  title: string
  permissions: { label: string; checked: boolean }[]
}

export default function PermissionGroupDisplayWithDialog({
  title,
  permissions,
}: PermissionGroupDisplayProps) {
  const [checkedPermissions, setCheckedPermissions] = useState<string[]>(
    permissions.filter((p) => p.checked).map((p) => p.label)
  )

  const togglePermission = (perm: string) => {
    setCheckedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    )
  }

  // split into 2 columns
  const mid = Math.ceil(permissions.length / 2)
  const leftPermissions = permissions.slice(0, mid)
  const rightPermissions = permissions.slice(mid)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gray-500 text-white">Show Permissions</Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Assigned permissions for this role</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-full justify-between gap-4">
          <div className="grid grid-cols-2 gap-4 pt-4">
            {[leftPermissions, rightPermissions].map((column, colIdx) => (
              <div key={colIdx} className="space-y-3">
                {column.map((permission, idx) => (
                  <div
                    key={colIdx + "-" + idx}
                    className="flex items-start gap-2"
                  >
                    <Checkbox
                      checked={checkedPermissions.includes(permission.label)}
                      onCheckedChange={() => togglePermission(permission.label)}
                    />
                    <span className={cn("text-sm", permission.label === "-" && "text-gray-400 italic")}>
                      {permission.label}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <Button>Adding New Permission</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
