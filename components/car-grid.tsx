// components/car-grid.tsx (Fixed for Next.js 15)
import { CarCard } from '@/components/car-card'
import { CarPagination } from '@/components/car-pagination'
import { CarSort } from '@/components/car-sort'

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
  [key: string]: string | undefined // Add index signature
}

interface CarGridProps {
  searchParams: SearchParams // Now receives resolved searchParams, not Promise
}

interface Car {
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
  isFavorited?: boolean
  images: {
    url: string
    isPrimary: boolean
  }[]
  seller: {
    name: string
    phone: string
    location: string
  }
  _count: {
    favorites: number
  }
}

interface PaginationData {
  page: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

interface ApiResponse {
  cars: Car[]
  pagination: PaginationData
}

async function getCars(searchParams: SearchParams): Promise<ApiResponse> {
  const params = new URLSearchParams()

  // Add all search parameters safely
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value && value !== '') {
      params.append(key, value)
    }
  })

  // Default values
  if (!searchParams.page) {
    params.append('page', '1')
  }
  if (!searchParams.sort) {
    params.append('sort', 'newest')
  }

  const url = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/cars?${params.toString()}`
  
  const response = await fetch(url, {
    cache: 'no-store', // Ensure fresh data
  })

  if (!response.ok) {
    throw new Error('Failed to fetch cars')
  }

  return response.json()
}

export async function CarGrid({ searchParams }: CarGridProps) {
  try {
    const data = await getCars(searchParams)
    const { cars, pagination } = data

    if (!cars || cars.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No cars found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria to find more results.
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {/* Sort and Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {cars.length} of {pagination.total} cars
          </p>
          <CarSort currentSort={searchParams.sort || 'newest'} />
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <CarPagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            searchParams={searchParams}
          />
        )}
      </div>
    )
  } catch (error) {
    console.error('Error loading cars:', error)
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Failed to load cars</h3>
        <p className="text-muted-foreground">
          Please try again later or refresh the page.
        </p>
      </div>
    )
  }
}