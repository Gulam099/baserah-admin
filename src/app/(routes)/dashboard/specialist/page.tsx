"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { fetchSpecialist } from "@/features/specialist/data/specialist.data"
import { SpecialistType } from "@/features/specialist/types/specialist.type"
import { SpecialistCard } from "@/features/specialist/components/SpecialistCard"


export default function SpecialistsPage() {
  const [Specialists, setSpecialists] = useState<SpecialistType[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 9

  useEffect(() => {
    const loadSpecialists = async () => {
      setLoading(true)
      try {
        const response = await fetchSpecialist(currentPage, pageSize)
        setSpecialists(response.data)
        setTotalPages(Math.ceil(response.total / pageSize))
      } catch (error) {
        console.error("Failed to fetch Specialists:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSpecialists()
  }, [currentPage])

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: pageSize }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="h-[200px] rounded-lg border border-gray-200 bg-gray-50 p-4 animate-pulse"
              />
            ))
          : Specialists.map((employee) => <SpecialistCard key={employee.id} specialist={employee} />)}
      </div>

      <div className="mt-8 flex justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1 || loading}
        >
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => setCurrentPage(page)}
            disabled={loading}
          >
            {page}
          </Button>
        ))}
        <Button
          variant="outline"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages || loading}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

