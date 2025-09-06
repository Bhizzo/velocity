'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { X, Filter, RotateCcw } from 'lucide-react'
import { TRANSMISSION_OPTIONS, FUEL_TYPE_OPTIONS, formatMWK } from '@/lib/constants'

interface FilterState {
  q: string
  make: string
  district: string
  transmission: string
  fuelType: string
  minPrice: number
  maxPrice: number
  minYear: number
  maxYear: number
  featured: boolean
}

interface CarFiltersProps {
  filterOptions: {
    makes: string[]
    districts: string[]
  }
  currentFilters: Record<string, string | undefined>
}

export function CarFilters({ filterOptions, currentFilters }: CarFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [filters, setFilters] = useState<FilterState>({
    q: currentFilters.q || '',
    make: currentFilters.make || 'all',
    district: currentFilters.district || 'all',
    transmission: currentFilters.transmission || 'all',
    fuelType: currentFilters.fuelType || 'all',
    minPrice: currentFilters.minPrice ? parseInt(currentFilters.minPrice) : 0,
    maxPrice: currentFilters.maxPrice ? parseInt(currentFilters.maxPrice) : 50000000,
    minYear: currentFilters.minYear ? parseInt(currentFilters.minYear) : 2000,
    maxYear: currentFilters.maxYear ? parseInt(currentFilters.maxYear) : new Date().getFullYear(),
    featured: currentFilters.featured === 'true'
  })

  const applyFilters = () => {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      // Handle different types more explicitly
      const shouldInclude = (() => {
        if (typeof value === 'boolean') {
          return value === true // Only include if true
        }
        if (typeof value === 'string') {
          return value !== '' && value !== 'all'
        }
        if (typeof value === 'number') {
          // Skip default values
          if (key === 'minPrice' && value === 0) return false
          if (key === 'maxPrice' && value === 50000000) return false
          if (key === 'minYear' && value === 2000) return false
          if (key === 'maxYear' && value === new Date().getFullYear()) return false
          return true
        }
        return false
      })()
      
      if (shouldInclude) {
        params.append(key, value.toString())
      }
    })

    // Keep current page and sort
    if (currentFilters.sort) {
      params.append('sort', currentFilters.sort)
    }

    router.push(`/cars?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({
      q: '',
      make: 'all',
      district: 'all',
      transmission: 'all',
      fuelType: 'all',
      minPrice: 0,
      maxPrice: 50000000,
      minYear: 2000,
      maxYear: new Date().getFullYear(),
      featured: false
    })
    router.push('/cars')
  }

  const activeFilterCount = Object.entries(currentFilters).filter(([key, value]) => {
    if (key === 'sort') return false // Don't count sort as an active filter
    if (typeof value === 'string') {
      return value !== '' && value !== 'all' && value !== 'false'
    }
    return false
  }).length

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary">{activeFilterCount}</Badge>
            )}
          </div>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-auto p-0"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label>Search</Label>
          <Input
            placeholder="Search cars..."
            value={filters.q}
            onChange={(e) => setFilters(prev => ({ ...prev, q: e.target.value }))}
          />
        </div>

        <Separator />

        {/* Make */}
        <div className="space-y-2">
          <Label>Make</Label>
          <Select 
            value={filters.make} 
            onValueChange={(value) => setFilters(prev => ({ ...prev, make: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any make" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any make</SelectItem>
              {filterOptions.makes
                .filter(make => make && make.trim() !== '') // Filter out empty values
                .map((make) => (
                  <SelectItem key={make} value={make}>
                    {make}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* District */}
        <div className="space-y-2">
          <Label>District</Label>
          <Select 
            value={filters.district} 
            onValueChange={(value) => setFilters(prev => ({ ...prev, district: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any district" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any district</SelectItem>
              {filterOptions.districts
                .filter(district => district && district.trim() !== '') // Filter out empty values
                .map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Price Range */}
        <div className="space-y-4">
          <Label>Price Range</Label>
          <div className="px-2">
            <Slider
              min={0}
              max={50000000}
              step={100000}
              value={[filters.minPrice, filters.maxPrice]}
              onValueChange={([min, max]) => 
                setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }))
              }
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatMWK(filters.minPrice)}</span>
            <span>{formatMWK(filters.maxPrice)}</span>
          </div>
        </div>

        {/* Year Range */}
        <div className="space-y-4">
          <Label>Year Range</Label>
          <div className="px-2">
            <Slider
              min={2000}
              max={new Date().getFullYear()}
              step={1}
              value={[filters.minYear, filters.maxYear]}
              onValueChange={([min, max]) => 
                setFilters(prev => ({ ...prev, minYear: min, maxYear: max }))
              }
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{filters.minYear}</span>
            <span>{filters.maxYear}</span>
          </div>
        </div>

        <Separator />

        {/* Transmission */}
        <div className="space-y-2">
          <Label>Transmission</Label>
          <Select 
            value={filters.transmission} 
            onValueChange={(value) => setFilters(prev => ({ ...prev, transmission: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any transmission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any transmission</SelectItem>
              {TRANSMISSION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fuel Type */}
        <div className="space-y-2">
          <Label>Fuel Type</Label>
          <Select 
            value={filters.fuelType} 
            onValueChange={(value) => setFilters(prev => ({ ...prev, fuelType: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any fuel type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any fuel type</SelectItem>
              {FUEL_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Featured Only */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={filters.featured}
            onCheckedChange={(checked) => 
              setFilters(prev => ({ ...prev, featured: checked === true }))
            }
          />
          <Label htmlFor="featured" className="text-sm font-normal">
            Featured cars only
          </Label>
        </div>

        {/* Apply Filters */}
        <Button onClick={applyFilters} className="w-full" size="lg">
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  )
}