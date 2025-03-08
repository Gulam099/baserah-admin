"use client";
import PdfView from "@/features/home/components/PdfView";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function Contracts(props:{specilaistId:string}) {
  return (
    <div className="p-6 flex flex-col gap-4 border rounded-2xl">
      <PdfView pdfUrl="/pdf/text.pdf" />
      <div className="w-full p-4 flex flex-row justify-end items-end gap-4">
        <ContractApprovalDialog />
        <Button variant={'secondary'}>
          Canceling the Contract
        </Button>
        <Button variant={'secondary'}>
          Contract Renewal
        </Button>
        <Button variant={'secondary'}>
          Amending the contract
        </Button>
      </div>
    </div>
  );
}

function ContractApprovalDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Approval of contract</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            The Specialist Has Been Approved, And An Interview Appointment Will
            Be Scheduled
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="team">Team</Label>
            <Select>
              <SelectTrigger id="team">
                <SelectValue placeholder="Administrative" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="administrative">Administrative</SelectItem>
                <SelectItem value="management">Management</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="person">Person's Name</Label>
            <Input id="person" placeholder="Dr. Fahd Al Ghalyini" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              placeholder="Enter note text"
              className="min-h-[150px] resize-none"
            />
          </div>

          <Button
            className="w-full"
            onClick={() => {
              // Handle note submission
              setOpen(false);
            }}
          >
            Send note
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
