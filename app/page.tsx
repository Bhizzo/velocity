import { Suspense } from 'react'
import { HeroSection } from '@/components/hero-section'
import { FeaturedCars } from '@/components/featured-cars'
import { SearchSection } from '@/components/search-section'
import { StatsSection } from '@/components/stats-section'
import { RecentCars } from '@/components/recent-cars'
import { prisma } from '@/lib/prisma'
import { CarGridSkeleton } from '@/components/car-grid-skeleton'
import { serializeCars, serializeForClient } from '@/lib/utils'
import { auth } from '@/lib/auth' // Add auth import

async function getHomeData() {
  // Get current user session for favorite status
  const session = await auth()
  const userId = session?.user?.id

  const [featuredCars, recentCars, stats] = await Promise.all([
    prisma.car.findMany({
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
        // Include user's favorite status
        favorites: userId ? {
          where: { userId },
          select: { id: true } // Just need to know if it exists
        } : false
      },
      orderBy: { createdAt: 'desc' },
      take: 8
    }),
    prisma.car.findMany({
      where: { 
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
        // Include user's favorite status
        favorites: userId ? {
          where: { userId },
          select: { id: true } // Just need to know if it exists
        } : false
      },
      orderBy: { createdAt: 'desc' },
      take: 6
    }),
    prisma.car.aggregate({
      where: { 
        status: 'ACTIVE',
        expiresAt: { gt: new Date() }
      },
      _count: { id: true },
      _avg: { price: true }
    })
  ])

  const totalSellers = await prisma.seller.count()

  // Transform and serialize data, adding favorite status
  const transformCarWithFavorites = (car: any) => {
    const serializedCar = serializeForClient(car)
    return {
      ...serializedCar,
      isFavorited: car.favorites && car.favorites.length > 0,
      favorites: undefined // Remove the favorites array from response
    }
  }

  return {
    featuredCars: featuredCars.map(transformCarWithFavorites),
    recentCars: recentCars.map(transformCarWithFavorites),
    stats: serializeForClient({
      totalCars: stats._count.id,
      averagePrice: stats._avg.price,
      totalSellers
    })
  }
}

export default async function HomePage() {
  const { featuredCars, recentCars, stats } = await getHomeData()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Search Section */}
      <SearchSection />

      {/* Stats Section */}
      <StatsSection stats={stats} />

      {/* Featured Cars Section */}
      {featuredCars.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Featured Cars
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Handpicked premium vehicles from trusted sellers across Malawi
              </p>
            </div>
            <Suspense fallback={<CarGridSkeleton />}>
              <FeaturedCars cars={featuredCars} />
            </Suspense>
          </div>
        </section>
      )}

      {/* Recent Cars Section */}
      {recentCars.length > 0 && (
        <section className="py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">
                  Latest Arrivals
                </h2>
                <p className="text-muted-foreground">
                  Fresh listings from our marketplace
                </p>
              </div>
            </div>
            <Suspense fallback={<CarGridSkeleton />}>
              <RecentCars cars={recentCars} />
            </Suspense>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 gradient-primary">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Find Your Perfect Car?
            </h2>
            <p className="text-lg mb-8 text-white/90">
              Browse our extensive collection of quality vehicles from trusted sellers across all 28 districts of Malawi.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}