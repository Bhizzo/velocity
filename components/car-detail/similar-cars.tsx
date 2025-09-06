// components/car-detail/similar-cars.tsx
import { CarCard } from '@/components/car-card'

// Updated type to match serialized car data (with number prices, not Decimal)
type SerializedCarWithDetails = {
  id: string
  make: string
  model: string
  year: number
  price: number // Changed from Decimal to number
  mileage?: number
  color?: string
  transmission: string
  fuelType: string
  district: string
  featured: boolean
  viewCount: number
  status: string
  isFavorited?: boolean // Optional favorite status
  createdAt: string // Serialized date
  updatedAt: string // Serialized date
  expiresAt: string // Serialized date
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
}

interface SimilarCarsProps {
  cars: SerializedCarWithDetails[]
  currentCarId?: string // Make optional since we might not always need it
}

export function SimilarCars({ cars, currentCarId }: SimilarCarsProps) {
  // Filter out the current car from similar cars if currentCarId is provided
  const similarCars = currentCarId 
    ? cars.filter(car => car.id !== currentCarId)
    : cars

  if (similarCars.length === 0) {
    return null
  }

  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-2xl font-bold mb-6">Similar Cars</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {similarCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
            />
          ))}
        </div>
      </div>
    </section>
  )
}