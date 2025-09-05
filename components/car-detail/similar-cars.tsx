// components/car-detail/similar-cars.tsx
import { Car, CarImage, Seller } from '@prisma/client'
import { CarCard } from '@/components/car-card'

type CarWithDetails = Car & {
  images: CarImage[]
  seller: Seller
  _count: {
    favorites: number
  }
}

interface SimilarCarsProps {
  cars: CarWithDetails[]
  currentCarId: string
}

export function SimilarCars({ cars, currentCarId }: SimilarCarsProps) {
  // Filter out the current car from similar cars
  const similarCars = cars.filter(car => car.id !== currentCarId)

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