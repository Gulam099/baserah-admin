"use client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

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

// The API returns { "contracts": [...] }, each possibly with a pdf_url
interface ContractItem {
  _id: string;
  pdf_url?: string;
  [key: string]: any; // other fields
}

interface ContractsResponse {
  contracts: ContractItem[];
}

/**
 * Renders the Contracts section, fetching from:
 * GET /api/doctor/contracts/:specilaistId
 */
export default function Contracts(props: { specilaistId: string }) {
  const { specilaistId } = props;

  const [contracts, setContracts] = useState<ContractItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1) Fetch the contract(s) for this specialist
  useEffect(() => {
    let isMounted = true;

    async function fetchContracts() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://monkfish-app-6ahnd.ondigitalocean.app/api/doctor/contracts/${specilaistId}`
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch. Status: ${res.status}`);
        }
        const data: ContractsResponse = await res.json();
        if (isMounted) {
          setContracts(data.contracts);
        }
      } catch (err: any) {
        console.error("Failed to fetch contracts:", err);
        if (isMounted) {
          setError("Failed to fetch contract data.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchContracts();

    return () => {
      isMounted = false;
    };
  }, [specilaistId]);

  // 2) Handle loading, error, and empty
  if (loading) {
    return (
      <div className="p-6 border rounded-2xl flex justify-center items-center min-h-[200px]">
        <Loader2 className="animate-spin mx-2" />
        <span>Loading contracts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 border rounded-2xl text-red-500">
        {error}
      </div>
    );
  }

  if (!contracts || contracts.length === 0) {
    return (
      <div className="p-6 border rounded-2xl">
        <p className="text-muted-foreground">No contract found.</p>
      </div>
    );
  }

  // 3) Show the first (or multiple) contract's PDF if available
  // (Adjust as needed for multiple contracts or other fields)
  const firstContract = contracts[0];
  const pdfUrl = firstContract.pdf_url || "/pdf/text.pdf"; // fallback to a local PDF?

  return (
    <div className="p-6 flex flex-col gap-4 border rounded-2xl">
      <PdfView pdfUrl={pdfUrl} />
      <div className="w-full p-4 flex flex-row justify-end items-end gap-4">
        <ContractApprovalDialog />
        <Button variant="secondary">Canceling the Contract</Button>
        <Button variant="secondary">Contract Renewal</Button>
        <Button variant="secondary">Amending the contract</Button>
      </div>
    </div>
  );
}

// The same ContractApprovalDialog from your example
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
              // Handle note submission logic
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
