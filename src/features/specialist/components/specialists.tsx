"use client";

import { useRef, useState } from "react";
import { SpecialistType } from "@/features/specialist/types/specialist.type";
import { SpecialistCard } from "@/features/specialist/components/SpecialistCard";
import UnifiedPagination from "@/features/home/components/UnifiedPagination";
import { fetchSpecialist } from "@/features/specialist/utils/specialist.util";
import ExportButton from "@/features/home/components/ExportButton";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query"; // ✅ Import TanStack Query

export default function SpecialistsPage() {
  const searchParams = useSearchParams();
  const contentRef = useRef<HTMLDivElement>(null);

  // Read page/pageSize from the URL, or fallback to 1 / 9
  const pageParam = searchParams.get("page");
  const pageSizeParam = searchParams.get("pageSize");
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 9;

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);


  // ✅ Use TanStack Query for fetching specialists
  const { data, isLoading, error } = useQuery({
    queryKey: ["specialists", currentPage, pageSize], // Cache based on pagination
    queryFn: () => fetchSpecialist(currentPage, pageSize),
  });

  // Extract specialists and total count from API response
  const specialists: SpecialistType[] = data?.data ?? [];
  const total = data?.page?.total ?? 0;
  console.log("total", total);


  const filteredSpecialists = specialists.filter((specialist) => {
    const name = specialist.firstName?.toLowerCase() || "";
    const id = specialist._id?.toLowerCase() || "";
    const status = specialist?.unsafeMetadata?.approval_status || "";
    const term = searchTerm.toLowerCase();

    const matchesSearch = name.includes(term) || id.includes(term);
    const matchesStatus = statusFilter ? status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });


  console.log("doctor", specialists);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center gap-2 pb-6">
        <div className="relative flex gap-3  w-full max-w-md">
          <input
            type="text"
            placeholder="Search specialists by name or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Clear search"
              type="button"
            >
              ×
            </button>
          )}
          <select
            value={statusFilter ?? ""}
            onChange={(e) =>
              setStatusFilter(e.target.value === "" ? null : e.target.value)
            }
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="accepted">Accepte</option>
            <option value="contract_send">Contract Send</option>
            <option value="auth_contract">Auth Contract</option>
            <option value="initial_approved">Initial Approved</option>
            <option value="final_approved">Final Approved</option>

          </select>
        </div>
        <ExportButton contentRef={contentRef} />
      </div>
      <div className="min-h-[70vh]">
        <div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          ref={contentRef}
        >
          {isLoading
            ? Array.from({ length: pageSize }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="h-[200px] rounded-lg border border-gray-200 bg-gray-50 p-4 animate-pulse"
              />
            ))
            : filteredSpecialists.map((specialist, idx) => (
              <SpecialistCard
                key={specialist.phoneNumber + idx}
                specialist={specialist}
              />
            ))}
        </div>

        {error && (
          <p className="text-red-500 mt-4">Failed to load specialists.</p>
        )}
      </div>

      <UnifiedPagination total={total} />
    </div>
  );
}
