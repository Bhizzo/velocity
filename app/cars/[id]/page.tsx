import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Heart, 
  Eye, 
  MapPin, 
  Calendar, 
  Gauge, 
  Fuel, 
  Settings, 
  Star,
  Phone,
  Mail,
  User,
  Share2,
  Flag
} from 'lucide-react'
import { formatMWK } from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import { CarImageGallery } from '@/components/car-detail/car-image-gallery'
import { SellerContact } from '@/components/car-detail/seller-contact'
import { SimilarCars } from '@/components/car-detail/similar-cars'
import { FavoriteButton } from '@/components/favorite-button'
import { ShareButton } from '@/components/share-button'
import { ReportButton } from '@/components/report-button'
import { ViewTracker } from '@/components/view-tracker'
import type { Metadata } from 'next'

async function getCarDetails(id: string) {
  const car = await prisma.car.findUnique({
    where: { id },
    include: {
      images: { 
        orderBy: [
          { isPrimary: 'desc' },
          { createdAt: 'asc' }
        ]
      },
      seller: true,
      _count: {
        select: { favorites: true }
      }
    }
  })

  if (!car) {
    return null
  }

  // Get similar cars
  const similarCars = await prisma.car.findMany({
    where: {
      AND: [
        { id: { not: car.id } },
        { status: 'ACTIVE' },
        { expiresAt: { gt: new Date() } },
        {
          OR: [
            { make: car.make },
            { district: car.district },
            {
              price: {
                gte: Number(car.price) * 0.8,
                lte: Number(car.price) * 1.2
              }
            }
          ]
        }
      ]
    },
    include: {
      images: { 
        where: { isPrimary: true },
        take: 1 
      },
      seller: true,
      _count: {
        select: { favorites: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 4
  })

  return { car, similarCars }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const result = await getCarDetails(params.id)
  
  if (!result) {
    return {
      title: 'Car Not Found'
    }
  }

  const { car } = result
  const primaryImage = car.images.find(img => img.isPrimary)

  return {
    title: `${car.make} ${car.model} ${car.year} - ${formatMWK(Number(car.price))} | Car Market Malawi`,
    description: `${car.year} ${car.make} ${car.model} for sale in ${car.district}. ${car.mileage ? `${car.mileage.toLocaleString()} km, ` : ''}${car.transmission}, ${car.fuelType}. Contact seller: ${car.seller.name}`,
    keywords: `${car.make}, ${car.model}, car for sale, ${car.district}, Malawi, ${car.year}`,
    openGraph: {
      title: `${car.make} ${car.model} ${car.year}`,
      description: `${formatMWK(Number(car.price))} - Available in ${car.district}`,
      images: primaryImage ? [primaryImage.url] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${car.make} ${car.model} ${car.year}`,
      description: `${formatMWK(Number(car.price))} - ${car.district}, Malawi`,
      images: primaryImage ? [primaryImage.url] : [],
    }
  }
}

export default async function CarDetailPage({ params }: { params: { id: string } }) {
  const result = await getCarDetails(params.id)
  
  if (!result) {
    notFound()
  }

  const { car, similarCars } = result
  const isExpired = new Date() > car.expiresAt

  return (
    <div className="container py-8 max-w-7xl">
      {/* Track view */}
      <ViewTracker carId={car.id} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <CarImageGallery images={car.images} carName={`${car.make} ${car.model}`} />

          {/* Car Details Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl lg:text-3xl font-bold">
                      {car.make} {car.model}
                    </h1>
                    {car.featured && (
                      <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-3xl font-bold text-primary">
                    {formatMWK(Number(car.price))}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <FavoriteButton carId={car.id} />
                  <ShareButton car={car} />
                  <ReportButton carId={car.id} />
                </div>
              </div>
              
              {/* Status badges */}
              <div className="flex items-center gap-2">
                <Badge variant={car.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {car.status}
                </Badge>
                {isExpired && (
                  <Badge variant="destructive">Expired</Badge>
                )}
                <div className="flex items-center gap-1 text-sm text-muted-foreground ml-auto">
                  <Eye className="w-4 h-4" />
                  {car.viewCount} views
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Heart className="w-4 h-4" />
                  {car._count.favorites} favorites
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Key specifications */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Year</p>
                    <p className="font-medium">{car.year}</p>
                  </div>
                </div>
                
                {car.mileage && (
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Gauge className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Mileage</p>
                      <p className="font-medium">{car.mileage.toLocaleString()} km</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Settings className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Transmission</p>
                    <p className="font-medium">{car.transmission}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Fuel className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Fuel</p>
                    <p className="font-medium">{car.fuelType}</p>
                  </div>
                </div>
              </div>

              {/* Additional details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {car.color && (
                  <div>
                    <p className="text-sm text-muted-foreground">Color</p>
                    <p className="font-medium">{car.color}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <p className="font-medium">{car.district}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {car.description && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Description</h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {car.description}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Seller Contact */}
          <SellerContact seller={car.seller} carTitle={`${car.make} ${car.model}`} />

          {/* Car Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Listing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Listed on</span>
                <span className="text-sm font-medium">
                  {car.createdAt.toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Expires on</span>
                <span className={`text-sm font-medium ${isExpired ? 'text-red-500' : ''}`}>
                  {car.expiresAt.toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={car.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {car.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Safety Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Safety Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Meet in a public, well-lit location</li>
                <li>• Inspect the vehicle thoroughly</li>
                <li>• Verify ownership documents</li>
                <li>• Never wire money or pay upfront</li>
                <li>• Trust your instincts</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Similar Cars */}
      {similarCars.length > 0 && (
        <div className="mt-12">
          <SimilarCars cars={similarCars} />
        </div>
      )}
    </div>
  )
}