"use client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import PdfView from "@/features/home/components/PdfView";
import { ApiBaseUrlLocal } from "../../../../const";

interface ContractItem {
  _id: string;
  doctorId: string;
  s3urlContract: string;
  s3urlSignedContract?: string | null;
  status: "pending" | "signed";
}

interface ContractsResponse {
  contracts: ContractItem[];
}

export default function Contracts({ specilaistId }: { specilaistId: string }) {
  const [contracts, setContracts] = useState<ContractItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  console.log("contracts", contracts);

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
      {contracts.map((contract) => (
        <div key={contract._id} className="  space-y-4">
          <p>Contract Status: <strong>{contract.status}</strong></p>

          <iframe
            src={
              contract.status === "signed"
                ? contract.s3urlSignedContract
                : contract.s3urlContract
            }
            className="w-full h-[400px] rounded"
          />
        </div>
      ))}


    </div>
  );
}
