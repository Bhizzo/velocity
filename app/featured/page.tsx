import { prisma } from '@/lib/prisma'
import { CarCard } from '@/components/car-card'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { serializeForClient } from '@/lib/utils' // Add serialization import
import { auth } from '@/lib/auth' // Add auth import

export const metadata = {
  title: 'Featured Cars | Car Market Malawi',
  description: 'Browse our handpicked selection of premium vehicles from trusted sellers.',
}

async function getFeaturedCars(userId?: string) {
  return await prisma.car.findMany({
    where: {
      featured: true,
      status: 'ACTIVE',
      expiresAt: { gt: new Date() }
    },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1
      },
      seller: true,
      _count: {
        select: { favorites: true }
      },
      // Include user's favorite status if logged in
      favorites: userId ? {
        where: { userId },
        select: { id: true }
      } : false
    },
    orderBy: [
      { createdAt: 'desc' }
    ]
  })
}

export default async function FeaturedPage() {
  // Get current user for favorite status
  const session = await auth()
  const userId = session?.user?.id

  const featuredCars = await getFeaturedCars(userId)

  // Serialize cars data for client components
  const serializedFeaturedCars = featuredCars.map(car => 
    serializeForClient({
      ...car,
      isFavorited: car.favorites && car.favorites.length > 0,
      favorites: undefined // Remove favorites array from response
    })
  )

  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg gradient-primary">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Featured Cars</h1>
            <p className="text-muted-foreground">
              Handpicked premium vehicles from trusted sellers
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="w-3 h-3" />
            Premium Selection
          </Badge>
          <span className="text-sm text-muted-foreground">
            {serializedFeaturedCars.length} featured cars available
          </span>
        </div>
      </div>

      {serializedFeaturedCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serializedFeaturedCars.map((car) => (
            <CarCard 
              key={car.id} 
              car={car} 
              showFeaturedBadge={false} // Don't show badge since all cars here are featured
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Star className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No featured cars available</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Check back soon for our latest premium vehicle selections, or browse all available cars.
            </p>
            <Button asChild>
              <Link href="/cars">Browse All Cars</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}