"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AddAmountDialog } from "./add-amount-dialog";
import { TransferDialog } from "./transfer-dialog";

interface SpecialistData {
  name: string;
  joinDate: string;
  ratio: string;
  discountPercentage: string;
  grossIncome: string;
  numberOfSessions: string;
  totalDue: string;
  totalTax: string;
  totalDiscount: string;
  specialistRatio: string;
  badgeLabel?: string;
  badgeVariant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | null
    | undefined;
}

export default function ViewSpecialistDetails(props: SpecialistData) {
  const [open, setOpen] = useState(false);

  // Destructure props for readability
  const {
    name,
    joinDate,
    ratio,
    discountPercentage,
    grossIncome,
    numberOfSessions,
    totalDue,
    totalTax,
    totalDiscount,
    specialistRatio,
    badgeLabel = "Unpaid January",
    badgeVariant = "destructive",
  } = props;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={(e) => e.stopPropagation()} variant="outline">View Details</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-5xl">
        {/* Header */}
        <DialogHeader className="p-0">
          <div className="flex items-start justify-between w-full px-6 pt-4">
            <div className="flex flex-col">
              <DialogTitle className="text-xl font-bold">
                Specialist: {name}
              </DialogTitle>
              <span className="text-sm mt-1 text-green-600">
                the date of join : {joinDate}
              </span>
            </div>
            <Badge variant={badgeVariant} className="mt-2">
              {badgeLabel}
            </Badge>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-4 gap-x-6 gap-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">The ratio :</span>
              <p className="font-semibold">{ratio}</p>
            </div>

            <div>
              <span className="text-muted-foreground">
                discount percentage:
              </span>
              <p className="font-semibold">{discountPercentage}</p>
            </div>

            <div>
              <span className="text-muted-foreground">Gross income :</span>
              <p className="font-semibold">{grossIncome}</p>
            </div>

            <div>
              <span className="text-muted-foreground">Number of sessions:</span>
              <p className="font-semibold">{numberOfSessions}</p>
            </div>

            <div>
              <span className="text-muted-foreground">Total due:</span>
              <p className="font-semibold">{totalDue}</p>
            </div>

            <div>
              <span className="text-muted-foreground">Total tax:</span>
              <p className="font-semibold">{totalTax}</p>
            </div>

            <div>
              <span className="text-muted-foreground">Total discount:</span>
              <p className="font-semibold">{totalDiscount}</p>
            </div>

            <div>
              <span className="text-muted-foreground">Specialist ratio:</span>
              <p className="font-semibold">{specialistRatio}</p>
            </div>
          </div>
        </div>

        {/* Footer: action buttons */}
        <div className="px-6 pb-4 flex gap-3 justify-end">
          <TransferDialog />
          <AddAmountDialog />
        </div>
      </DialogContent>
    </Dialog>
  );
}
