"use client";

import React, { useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UnifiedPaginationProps {
  total: number;
}

export default function UnifiedPagination({ total }: UnifiedPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  let propTotalPages = 0;

  // 1) On mount, if the URL is missing page or pageSize, set them
  useEffect(() => {
    if (!searchParams) return;
    const newParams = new URLSearchParams(searchParams.toString());

    let changed = false;
    if (!newParams.has("page")) {
      newParams.set("page", "1");
      changed = true;
    }
    if (!newParams.has("pageSize")) {
      newParams.set("pageSize", "10");
      changed = true;
    }

    if (changed) {
      // Replace so we don't break the back button
      router.replace(`?${newParams.toString()}`);
    }
  }, [router, searchParams]);

  // 2) Helper to set a single search param & navigate
  const setSearchParam = useCallback(
    (name: string, value: string) => {
      if (!searchParams) return;
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      // We push so the user can go back in history if needed
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  // 3) Read current page/pageSize from URL. Fallback to defaults if not present
  const pageParam = searchParams?.get("page");
  const pageSizeParam = searchParams?.get("pageSize");

  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 10;

  // 4) Compute totalPages if not explicitly provided
  const totalPages = React.useMemo(() => {
    if (propTotalPages) return propTotalPages;
    if (!total) return 1; // fallback
    return Math.max(1, Math.ceil(total / pageSize));
  }, [propTotalPages, total, pageSize]);

  // 5) Handlers for page changes
  function handleSetPage(newPage: number) {
    if (newPage < 1) newPage = 1;
    if (newPage > totalPages) newPage = totalPages;
    setSearchParam("page", String(newPage));
  }

  function handlePrevPage() {
    handleSetPage(currentPage - 1);
  }

  function handleNextPage() {
    handleSetPage(currentPage + 1);
  }

  // 6) Handler for page size changes
  function handlePageSizeChange(newSize: number) {
    if (!searchParams) return;

    // clone current params
    const params = new URLSearchParams(searchParams.toString());

    // set both page=1 and pageSize=newSize
    params.set("page", "1");
    params.set("pageSize", String(newSize));

    // now do one push/replace with both updates
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
      {/* Display "Page X of Y" */}
      <div className="flex gap-2 text-sm font-medium text-neutral-700">
        <p>Page </p> <p>{currentPage + "/" + totalPages}</p>
      </div>

      {/* Pagination UI */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={handlePrevPage} />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => handleSetPage(page)}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext onClick={handleNextPage} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Page size dropdown */}
      <Select
        value={String(pageSize)}
        onValueChange={(value) => handlePageSizeChange(parseInt(value, 10))}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Page Size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5</SelectItem>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="30">30</SelectItem>
          <SelectItem value="50">50</SelectItem>
          <SelectItem value="100">100</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
