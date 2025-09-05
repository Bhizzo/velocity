'use client'

import { CarCard } from '@/components/car-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface FeaturedCarsProps {
  cars: Array<{
    id: string
    make: string
    model: string
    year: number
    price: number
    mileage?: number
    color?: string
    transmission: string
    fuelType: string
    district: string
    featured: boolean
    viewCount: number
    status: string
    isFavorited?: boolean // Add optional favorite status
    images: Array<{
      url: string
      isPrimary: boolean
    }>
    seller: {
      name: string
      phone: string
      location: string
    }
    _count: {
      favorites: number
    }
  }>
}

export function FeaturedCars({ cars }: FeaturedCarsProps) {
  if (cars.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No featured cars available</h3>
        <p className="text-muted-foreground mb-4">Check back soon for featured listings</p>
        <Button asChild variant="outline">
          <Link href="/cars">Browse All Cars</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Featured cars grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cars.map((car, index) => (
          <motion.div
            key={car.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5,
              delay: index * 0.1 
            }}
          >
            <CarCard 
              car={car} 
              priority={index < 4}
              showFeaturedBadge={false} // Don't show badge in featured section
            />
          </motion.div>
        ))}
      </div>

      {/* View more button */}
      {cars.length >= 8 && (
        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/featured">
              View All Featured Cars
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}