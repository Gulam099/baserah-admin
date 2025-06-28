"use client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import PdfView from "@/features/home/components/PdfView";
import { ApiBaseUrlLocal } from "../../../../const";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDoctor } from "../utils/specialist.util";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Outline } from "react-pdf";

interface ContractItem {
  _id: string;
  doctorId: string;
  s3urlContract: string;
  s3urlSignedContract?: string | null;
  status: "pending" | "signed";
  updatedAt: string;
}

interface ContractsResponse {
  contracts: ContractItem[];
}

export default function Contracts({
  specilaistId,
  clerkId,
  initialApprovalStatus,
}: {
  specilaistId: string;
  clerkId: string;
  initialApprovalStatus: string;
}) {
  const [approvalStatus, setApprovalStatus] = useState(initialApprovalStatus);

  const [contracts, setContracts] = useState<ContractItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    let isMounted = true;
    async function fetchContracts() {
      try {
        const res = await fetch(`${ApiBaseUrlLocal}/api/doctor/contracts/${specilaistId}`);
        if (!res.ok) throw new Error(`Failed with status: ${res.status}`);
        const data: ContractsResponse = await res.json();
        if (isMounted) setContracts(data.contracts);
      } catch (err) {
        console.error("Fetch error:", err);
        if (isMounted) setError("Failed to load contracts.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchContracts();
    return () => { isMounted = false; };
  }, [specilaistId]);

  const mutation = useMutation({
    mutationFn: ({ clerkId, status }: { clerkId: string; status: string }) =>
      updateDoctor(clerkId, { unsafeMetadata: { approval_status: status } }),
    onSuccess: (_data, variables) => {
      setApprovalStatus(variables.status); // <- update local state
      queryClient.invalidateQueries({ queryKey: ["specialists"] });
      toast.success("✅ Approval status updated");
    },
    onError: (error) => {
      console.error("❌ Error updating approval status:", error);
      toast.error("❌ Error updating approval status");
    },
  });


  function formatDateOnly(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }


  if (loading) {
    return (
      <div className="p-6 border rounded-2xl flex justify-center items-center min-h-[200px]">
        <Loader2 className="animate-spin mx-2" />
        <span>Loading contracts...</span>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 border rounded-2xl text-red-500">{error}</div>;
  }

  if (!contracts || contracts.length === 0) {
    return <div className="p-6 border rounded-2xl text-muted-foreground">No contract found.</div>;
  }

  return (
    <div className="p-6 flex flex-col gap-6  ">
      {contracts.map((contract) => {
        const formattedDate = formatDateOnly(contract.updatedAt);

        return (
          <div key={contract._id} className="space-y-4 border p-4 rounded-xl shadow-sm">
            <div className=" flex justify-between ">
              <div>
                <p><strong>Status:</strong> {contract.status}</p>
                <p className="text-sm mt-2 text-gray-500">
                  <strong>Last Updated:</strong> {formattedDate}
                </p>
              </div>
              {contract.status === "signed" && (
                <div className="grid  justify-end">
                  {approvalStatus !== "initial_approved" && approvalStatus !== "final_approved" && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        mutation.mutate({
                          clerkId: clerkId,
                          status: "initial_approved",
                        })
                      }
                      className="mb-2"
                    >
                      Initial Approval of the contract
                    </Button>
                  )}
                  {approvalStatus !== "final_approved" && (
                    <Button
                      onClick={() =>
                        mutation.mutate({
                          clerkId: clerkId,
                          status: "final_approved",
                        })
                      }
                    >
                      Final Approval of the contract
                    </Button>
                  )}
                </div>
              )}
            </div>
            <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(contract.status === "signed" ? contract.s3urlSignedContract! : contract.s3urlContract)}`}
              className="w-full h-[600px] rounded"
            />
          </div>
        );
      })}


    </div>
  );
}
