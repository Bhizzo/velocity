'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select'
import { ArrowUpDown } from 'lucide-react'

interface CarSortProps {
  currentSort: string
}

const sortOptions = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' }
]

export function CarSort({ currentSort }: CarSortProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('sort', newSort)
    params.delete('page') // Reset to first page when sorting changes
    
    router.push(`/cars?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}