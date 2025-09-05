'use client'

import { CarCard } from '@/components/car-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface RecentCarsProps {
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

export function RecentCars({ cars }: RecentCarsProps) {
  if (cars.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No cars available</h3>
        <p className="text-muted-foreground">Be the first to list your car!</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Recent cars grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <CarCard car={car} priority={index < 3} />
          </motion.div>
        ))}
      </div>

      {/* View more button */}
      <div className="text-center">
        <Button asChild size="lg">
          <Link href="/cars">
            Browse All Cars
          </Link>
        </Button>
      </div>
    </div>
  )
}