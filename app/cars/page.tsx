
import { Suspense } from 'react'
import { CarFilters } from '@/components/car-filters'
import { CarGrid } from '@/components/car-grid'
import { CarGridSkeleton } from '@/components/car-grid-skeleton'
import { prisma } from '@/lib/prisma'

export const metadata = {
  title: 'Browse Cars | Car Market Malawi',
  description: 'Browse our extensive collection of quality cars from trusted sellers across Malawi.',
}

interface SearchParams {
  q?: string
  make?: string
  minPrice?: string
  maxPrice?: string
  district?: string
  transmission?: string
  fuelType?: string
  minYear?: string
  maxYear?: string
  featured?: string
  status?: string
  page?: string
  sort?: string
}

async function getFilterOptions() {
  const [makes, districts] = await Promise.all([
    prisma.car.findMany({
      select: { make: true },
      distinct: ['make'],
      where: { status: 'ACTIVE', expiresAt: { gt: new Date() } },
      orderBy: { make: 'asc' }
    }),
    prisma.car.findMany({
      select: { district: true },
      distinct: ['district'],
      where: { status: 'ACTIVE', expiresAt: { gt: new Date() } },
      orderBy: { district: 'asc' }
    })
  ])

  return {
    makes: makes.map(item => item.make),
    districts: districts.map(item => item.district)
  }
}

export default async function CarsPage({ 
  searchParams 
}: { 
  searchParams: Promise<SearchParams> // Changed to Promise
}) {
  // Await searchParams before using
  const resolvedSearchParams = await searchParams
  const filterOptions = await getFilterOptions()

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Browse Cars</h1>
        <p className="text-muted-foreground">
          Find your perfect car from our extensive collection
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <CarFilters 
            filterOptions={filterOptions}
            currentFilters={resolvedSearchParams}
          />
        </div>

        {/* Car Grid */}
        <div className="lg:col-span-3">
          <Suspense fallback={<CarGridSkeleton />}>
            <CarGrid searchParams={resolvedSearchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}