'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Search, MapPin, Car, Filter } from 'lucide-react'
import { MALAWI_DISTRICTS, CAR_MAKES, PRICE_RANGES } from '@/lib/constants'

export function SearchSection() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMake, setSelectedMake] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedPriceRange, setSelectedPriceRange] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    
    if (searchQuery.trim()) {
      params.append('q', searchQuery.trim())
    }
    // Update these conditions to check for the new "all" values
    if (selectedMake && selectedMake !== 'all') {
      params.append('make', selectedMake)
    }
    if (selectedDistrict && selectedDistrict !== 'all') {
      params.append('district', selectedDistrict)
    }
    if (selectedPriceRange && selectedPriceRange !== 'all') {
      const priceRange = PRICE_RANGES.find(range => range.label === selectedPriceRange)
      if (priceRange) {
        params.append('minPrice', priceRange.min.toString())
        if (priceRange.max) {
          params.append('maxPrice', priceRange.max.toString())
        }
      }
    }

    router.push(`/cars?${params.toString()}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Find Your Perfect Car</h2>
            <p className="text-muted-foreground">Search through thousands of quality vehicles</p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Main search bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by make, model, or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10 h-12 text-base"
                  />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Select value={selectedMake} onValueChange={setSelectedMake}>
                    <SelectTrigger className="h-12">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Any Make" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Make</SelectItem>
                      {CAR_MAKES.map((make) => (
                        <SelectItem key={make} value={make}>
                          {make}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                    <SelectTrigger className="h-12">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Any District" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any District</SelectItem>
                      {MALAWI_DISTRICTS.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Any Price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Price</SelectItem>
                      {PRICE_RANGES.map((range) => (
                        <SelectItem key={range.label} value={range.label}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button onClick={handleSearch} size="lg" className="h-12">
                    Search Cars
                  </Button>
                </div>

                {/* Quick links */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <span className="text-sm text-muted-foreground">Popular searches:</span>
                  {['Toyota', 'Honda', 'BMW', 'Featured Cars'].map((term) => (
                    <Button
                      key={term}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (term === 'Featured Cars') {
                          router.push('/featured')
                        } else {
                          router.push(`/cars?make=${term}`)
                        }
                      }}
                      className="h-8 text-xs"
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}