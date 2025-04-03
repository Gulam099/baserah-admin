"use client";

import { useRef } from "react";
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

  // ✅ Use TanStack Query for fetching specialists
  const { data, isLoading, error } = useQuery({
    queryKey: ["specialists", currentPage, pageSize], // Cache based on pagination
    queryFn: () => fetchSpecialist(currentPage, pageSize),
  });

  // Extract specialists and total count from API response
  const specialists: SpecialistType[] = data?.data ?? [];
  const total = data?.page?.total ?? 0;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-end items-center gap-2 pb-6">
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
            : specialists.map((specialist, idx) => (
                <SpecialistCard
                  key={specialist.phoneNumber + idx}
                  specialist={specialist}
                />
              ))}
        </div>

        {error && <p className="text-red-500 mt-4">Failed to load specialists.</p>}
      </div>

      <UnifiedPagination total={total} />
    </div>
  );
}
