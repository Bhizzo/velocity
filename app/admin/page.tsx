import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Car, 
  Users, 
  TrendingUp, 
  Calendar,
  Plus,
  Eye,
  Heart,
  AlertTriangle,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatMWK, isExpiringSoon } from '@/lib/constants'
import { serializeForClient, decimalToNumber } from '@/lib/utils' // Add serialization imports

async function getAdminData() {
  const [
    totalCars,
    activeCars,
    soldCars,
    totalSellers,
    recentCars,
    expiringCars,
    topViewedCars,
    totalViews,
    totalFavorites,
    avgPrice
  ] = await Promise.all([
    prisma.car.count(),
    prisma.car.count({ where: { status: 'ACTIVE' } }),
    prisma.car.count({ where: { status: 'SOLD' } }),
    prisma.seller.count(),
    prisma.car.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { seller: true, images: { take: 1 } }
    }),
    prisma.car.findMany({
      where: { 
        status: 'ACTIVE',
        expiresAt: { 
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        }
      },
      include: { seller: true },
      orderBy: { expiresAt: 'asc' },
      take: 10
    }),
    prisma.car.findMany({
      take: 5,
      orderBy: { viewCount: 'desc' },
      include: { 
        seller: true, 
        images: { take: 1 },
        _count: { select: { favorites: true } }
      }
    }),
    prisma.car.aggregate({
      _sum: { viewCount: true }
    }),
    prisma.carFavorite.count(),
    prisma.car.aggregate({
      _avg: { price: true },
      where: { status: 'ACTIVE' }
    })
  ])

  // Serialize all data to handle Decimals
  return {
    stats: {
      totalCars,
      activeCars,
      soldCars,
      totalSellers,
      totalViews: totalViews._sum.viewCount || 0,
      totalFavorites,
      avgPrice: decimalToNumber(avgPrice._avg.price) // Convert Decimal to number
    },
    recentCars: recentCars.map(car => serializeForClient(car)), // Serialize cars
    expiringCars: expiringCars.map(car => serializeForClient(car)), // Serialize cars
    topViewedCars: topViewedCars.map(car => serializeForClient(car)) // Serialize cars
  }
}

export default async function AdminDashboard() {
  const data = await getAdminData()

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your car marketplace and monitor performance
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/admin/cars/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Car
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/sellers/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Seller
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.totalCars}</div>
            <p className="text-xs text-muted-foreground">
              {data.stats.activeCars} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sellers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.totalSellers}</div>
            <p className="text-xs text-muted-foreground">
              Active sellers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All time views
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatMWK(data.stats.avgPrice)} {/* Now using serialized number */}
            </div>
            <p className="text-xs text-muted-foreground">
              Active listings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Cars
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentCars.map((car) => (
                <div key={car.id} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Car className="h-6 w-6" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <Link 
                      href={`/admin/cars/${car.id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {car.make} {car.model}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {car.seller.name} • {formatMWK(car.price)} {/* Now using serialized number */}
                    </p>
                  </div>
                  <Badge variant={
                    car.status === 'ACTIVE' ? 'default' :
                    car.status === 'SOLD' ? 'secondary' : 'outline'
                  }>
                    {car.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button asChild variant="outline" className="w-full mt-4">
              <Link href="/admin/cars">View All Cars</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Expiring Cars */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Expiring Soon
              {data.expiringCars.length > 0 && (
                <Badge variant="secondary">{data.expiringCars.length}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.expiringCars.length === 0 ? (
              <p className="text-muted-foreground text-sm">No cars expiring soon</p>
            ) : (
              <div className="space-y-4">
                {data.expiringCars.slice(0, 5).map((car) => (
                  <div key={car.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Link 
                        href={`/admin/cars/${car.id}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {car.make} {car.model}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        Expires {new Date(car.expiresAt).toLocaleDateString()} {/* Using serialized date */}
                      </p>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/cars/${car.id}/extend`}>
                        Extend
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Performing Cars */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Performing Cars
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topViewedCars.map((car, index) => (
                <div key={car.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div>
                      <Link 
                        href={`/admin/cars/${car.id}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {car.make} {car.model}
                      </Link>
                      <p className="text-sm text-muted-foreground">{car.seller.name}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Eye className="h-4 w-4" />
                      {car.viewCount} views
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Heart className="h-4 w-4" />
                      {car._count.favorites} favorites
                    </div>
                    <div className="text-sm font-medium">
                      {formatMWK(car.price)} {/* Now using serialized number */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/admin/cars">
                <Car className="h-6 w-6 mb-2" />
                Manage Cars
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/admin/sellers">
                <Users className="h-6 w-6 mb-2" />
                Manage Sellers
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/admin/cars?featured=true">
                <TrendingUp className="h-6 w-6 mb-2" />
                Featured Cars
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/admin/analytics">
                <Eye className="h-6 w-6 mb-2" />
                Analytics
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/admin/cars?status=expired">
                <AlertTriangle className="h-6 w-6 mb-2" />
                Expired Cars
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/admin/settings">
                <TrendingUp className="h-6 w-6 mb-2" />
                Settings
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}