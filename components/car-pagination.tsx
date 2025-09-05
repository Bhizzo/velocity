'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  MoreHorizontal 
} from 'lucide-react'

interface CarPaginationProps {
  currentPage: number
  totalPages: number
  searchParams: Record<string, string | undefined>
}

export function CarPagination({ currentPage, totalPages, searchParams }: CarPaginationProps) {
  const router = useRouter()

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams()
    
    // Add all existing search params except page
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== 'page' && value) {
        params.append(key, value)
      }
    })
    
    if (page > 1) {
      params.append('page', page.toString())
    }
    
    return `/cars?${params.toString()}`
  }

  const goToPage = (page: number) => {
    router.push(createPageUrl(page))
  }

  // Generate page numbers to show
  const getVisiblePages = () => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 7

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 4) {
        pages.push('...')
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 3) {
        pages.push('...')
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {((currentPage - 1) * 12) + 1} to {Math.min(currentPage * 12, totalPages * 12)} results
      </p>
      
      <div className="flex items-center space-x-2">
        {/* First page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Previous page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        {visiblePages.map((page, index) => (
          <Button
            key={index}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => typeof page === 'number' ? goToPage(page) : undefined}
            disabled={page === '...'}
            className="min-w-[40px]"
          >
            {page === '...' ? <MoreHorizontal className="h-4 w-4" /> : page}
          </Button>
        ))}

        {/* Next page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}