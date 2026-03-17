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
import { useTranslation } from "react-i18next";
import { ExternalLink, FileDown, FileText, Image as ImageIcon } from "lucide-react";

const normalizeUrl = (url: string) => {
  if (!url) return "";
  return url;
};

const getFileType = (url: string) => {
  const extension = url.split('.').pop()?.toLowerCase();
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(extension || '')) return 'image';
  if (extension === 'pdf') return 'pdf';
  if (['doc', 'docx'].includes(extension || '')) return 'word';
  return 'other';
};



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
  const { t } = useTranslation();
  const [contracts, setContracts] = useState<ContractItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    let isMounted = true;
    async function fetchContracts() {
      try {
        const res = await fetch(`${ApiBaseUrlLocal}/api/doctor/contracts/${clerkId}`);
        if (!res.ok) throw new Error(`Failed with status: ${res.status}`);
        const data: ContractsResponse = await res.json();
        if (isMounted) setContracts(data.contracts);
      } catch (err) {
        console.error("Fetch error:", err);
        if (isMounted) setError(t("contracts.error"));
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
      toast.success(t("contracts.approvalUpdated"));
    },
    onError: (error) => {
      console.error("❌ Error updating approval status:", error);
      toast.error(t("contracts.approvalError"));
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
        <span>{t("contracts.loading")}</span>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 border rounded-2xl text-red-500">{error}</div>;
  }

  if (!contracts || contracts.length === 0) {
    return <div className="p-6 border rounded-2xl text-muted-foreground">        {t("contracts.noContracts")}
    </div>;
  }

  return (
    <div className="p-6 flex flex-col gap-6  ">
      {contracts.map((contract) => {
        const formattedDate = formatDateOnly(contract.updatedAt);

        return (
          <div key={contract._id} className="space-y-4 border p-4 rounded-xl shadow-sm">
            <div className=" flex justify-between ">
              <div>
                <p><strong>{t("contracts.status")}:</strong> {contract.status}</p>
                <p><strong>{t("contracts.lastUpdated")}:</strong> {formattedDate}</p>

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
                      {t("contracts.initialApproval")}                    </Button>
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
                      {t("contracts.finalApproval")}
                    </Button>
                  )}
                </div>
              )}
            </div>
            {(() => {
              const url = normalizeUrl(contract.status === "signed" ? contract.s3urlSignedContract! : contract.s3urlContract);
              const type = getFileType(url);

              if (type === 'pdf') {
                return (
                  <div className="space-y-4">
                    <PdfView pdfUrl={url} />
                    <div className="flex justify-center">
                      <Button variant="outline" asChild>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          <FileDown className="mr-2 h-4 w-4" />
                          {t("contracts.downloadPdf")}
                        </a>
                      </Button>
                    </div>
                  </div>
                );
              }

              if (type === 'image') {
                return (
                  <div className="flex flex-col items-center gap-4">
                    <img src={url} alt="Contract" className="max-w-full h-auto rounded-lg shadow-md max-h-[600px]" />
                    <Button variant="outline" asChild>
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        <ImageIcon className="mr-2 h-4 w-4" />
                        {t("contracts.viewImage")}
                      </a>
                    </Button>
                  </div>
                );
              }

              return (
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/30">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">{t("contracts.unsupportedPreview")}</p>
                  <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
                    {t("contracts.unsupportedDesc")}
                  </p>
                  <div className="flex gap-3">
                    <Button asChild>
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {t("contracts.openFile")}
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href={url} download>
                        <FileDown className="mr-2 h-4 w-4" />
                        {t("contracts.download")}
                      </a>
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
        );
      })}


    </div>
  );
}
