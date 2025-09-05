import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CarCard } from '@/components/car-card'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Search } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'My Favorites | Car Market Malawi',
  description: 'View and manage your favorite car listings.',
}

async function getFavorites(userId: string) {
  return await prisma.carFavorite.findMany({
    where: { userId },
    include: {
      car: {
        include: {
          images: {
            where: { isPrimary: true },
            take: 1
          },
          seller: true,
          _count: {
            select: { favorites: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/api/auth/signin?callbackUrl=/favorites')
  }

  const favorites = await getFavorites(session.user.id)
  const activeFavorites = favorites.filter(fav => 
    fav.car.status === 'ACTIVE' && new Date(fav.car.expiresAt) > new Date()
  )
  const soldOrExpiredFavorites = favorites.filter(fav => 
    fav.car.status !== 'ACTIVE' || new Date(fav.car.expiresAt) <= new Date()
  )

  return (
    <div className="container py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">My Favorites</h1>
        </div>
        <p className="text-muted-foreground">
          Keep track of cars you're interested in
        </p>
      </div>

      {favorites.length === 0 ? (
        <EmptyFavorites />
      ) : (
        <div className="space-y-8">
          {/* Active Favorites */}
          {activeFavorites.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  Available Cars ({activeFavorites.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeFavorites.map((favorite) => (
                  <CarCard key={favorite.id} car={favorite.car} />
                ))}
              </div>
            </div>
          )}

          {/* Sold/Expired Favorites */}
          {soldOrExpiredFavorites.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-muted-foreground">
                  Sold or Expired ({soldOrExpiredFavorites.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {soldOrExpiredFavorites.map((favorite) => (
                  <div key={favorite.id} className="opacity-60">
                    <CarCard car={favorite.car} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {activeFavorites.length === 0 && soldOrExpiredFavorites.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Looking for similar cars?</h3>
                  <p className="text-muted-foreground mb-4">
                    All your favorite cars are no longer available, but we have many similar options.
                  </p>
                  <Button asChild>
                    <Link href="/cars">Browse Available Cars</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

function EmptyFavorites() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Heart className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
        <p className="text-muted-foreground text-center mb-6 max-w-md">
          Start browsing cars and click the heart icon on any car you're interested in to save it here.
        </p>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/cars">
              <Search className="w-4 h-4 mr-2" />
              Browse Cars
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/featured">View Featured</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}