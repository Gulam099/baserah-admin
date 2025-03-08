"use client";
import { useEffect, useRef, useState } from "react";
import { SpecialistType } from "@/features/specialist/types/specialist.type";
import { SpecialistCard } from "@/features/specialist/components/SpecialistCard";
import UnifiedPagination from "@/features/home/components/UnifiedPagination";
import { fetchSpecialist } from "@/features/specialist/utils/specialist.util";
import ExportButton from "@/features/home/components/ExportButton";
import { useSearchParams } from "next/navigation";

export default function SpecialistsPage() {
  const searchParams = useSearchParams();
  const contentRef = useRef<HTMLDivElement>(null);
  // Read page/pageSize from the URL, or fallback to 1 / 9
  const pageParam = searchParams.get("page");
  const pageSizeParam = searchParams.get("pageSize");
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 9;
  const [Specialists, setSpecialists] = useState<SpecialistType[]>([]);
  const [loading, setLoading] = useState(true);

  const [total, setTotal] = useState(0); // track total items

  // Whenever page/pageSize changes in the URL, fetch new data
  useEffect(() => {
    setLoading(true);
    fetchSpecialist(currentPage, pageSize)
      .then((res) => {
        setSpecialists(res.data!);
        setTotal(res.page?.total!); // for UnifiedPagination's `total` prop
      })
      .catch((err) => {
        console.error("Failed to fetch questions:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage, pageSize]);

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
          {loading
            ? Array.from({ length: pageSize }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="h-[200px] rounded-lg border border-gray-200 bg-gray-50 p-4 animate-pulse"
                />
              ))
            : Specialists.map((employee , idx) => (
                <SpecialistCard key={employee.phoneNumber + idx} specialist={employee} />
              ))}
        </div>
      </div>

      <UnifiedPagination total={total} />
    </div>
  );
}
