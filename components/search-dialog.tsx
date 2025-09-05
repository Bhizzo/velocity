'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { DialogTitle } from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Car, Search, TrendingUp } from 'lucide-react'

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const handleSearch = (searchTerm: string) => {
    onOpenChange(false)
    setQuery('')
    router.push(`/cars?q=${encodeURIComponent(searchTerm)}`)
  }

  const popularSearches = [
    'Toyota Corolla',
    'Honda Civic',
    'BMW X5',
    'Mercedes C-Class',
    'Nissan Altima',
    'Ford Explorer'
  ]

  const quickFilters = [
    { label: 'Featured Cars', href: '/featured' },
    { label: 'Under MK 5M', href: '/cars?maxPrice=5000000' },
    { label: 'Recent Listings', href: '/cars?sort=newest' },
    { label: 'Most Popular', href: '/cars?sort=popular' }
  ]

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <VisuallyHidden>
        <DialogTitle>Search Cars</DialogTitle>
      </VisuallyHidden>
      
      <CommandInput
        placeholder="Search cars..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {query.length > 0 && (
          <CommandGroup heading="Search Results">
            <CommandItem onSelect={() => handleSearch(query)}>
              <Search className="mr-2 h-4 w-4" />
              Search for "{query}"
            </CommandItem>
          </CommandGroup>
        )}

        <CommandGroup heading="Popular Searches">
          {popularSearches.map((search) => (
            <CommandItem key={search} onSelect={() => handleSearch(search)}>
              <TrendingUp className="mr-2 h-4 w-4" />
              {search}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Quick Filters">
          {quickFilters.map((filter) => (
            <CommandItem 
              key={filter.label} 
              onSelect={() => {
                onOpenChange(false)
                router.push(filter.href)
              }}
            >
              <Car className="mr-2 h-4 w-4" />
              {filter.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}