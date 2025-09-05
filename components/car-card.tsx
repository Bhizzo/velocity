'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, Eye, MapPin, Calendar, Gauge, Fuel, Settings, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatMWK } from '@/lib/constants'
import { useFavorite } from '@/hooks/use-favorite'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CarCardProps {
  car: {
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
  }
  className?: string
  showFeaturedBadge?: boolean
  priority?: boolean
}

export function CarCard({ car, className, showFeaturedBadge = true, priority = false }: CarCardProps) {
  // Use provided favorite status if available, otherwise use hook
  const shouldUseFavoriteHook = car.isFavorited === undefined
  const { isFavorited, toggleFavorite, isLoading } = useFavorite(
    car.id, 
    shouldUseFavoriteHook, 
    car.isFavorited // Pass initial favorite status
  )

  const [imageLoaded, setImageLoaded] = useState(false)

  const primaryImage = car.images.find(img => img.isPrimary) || car.images[0]
  const imageUrl = primaryImage?.url || '/placeholder-car.jpg'

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("group", className)}
    >
      <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
        <div className="relative">
          {/* Image */}
          <div className="relative aspect-video bg-muted overflow-hidden">
            <Image
              src={imageUrl}
              alt={`${car.make} ${car.model}`}
              fill
              className={cn(
                "object-cover transition-all duration-500 group-hover:scale-110",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
              priority={priority}
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {car.featured && showFeaturedBadge && (
                <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
              {car.status === 'SOLD' && (
                <Badge variant="destructive">Sold</Badge>
              )}
            </div>

            {/* Favorite button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-3 right-3 h-8 w-8 p-0 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20"
              onClick={handleFavoriteClick}
              disabled={isLoading}
            >
              <Heart 
                className={cn(
                  "h-4 w-4 transition-colors",
                  isFavorited ? "fill-red-500 text-red-500" : "text-white"
                )}
              />
            </Button>

            {/* View count */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1 text-white text-xs bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
              <Eye className="w-3 h-3" />
              {car.viewCount}
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-4 space-y-3">
            {/* Title and Price */}
            <div className="space-y-1">
              <Link 
                href={`/cars/${car.id}`}
                className="block hover:text-primary transition-colors"
              >
                <h3 className="font-semibold text-lg leading-tight line-clamp-1">
                  {car.make} {car.model}
                </h3>
              </Link>
              <p className="text-2xl font-bold text-primary">
                {formatMWK(car.price)}
              </p>
            </div>

            {/* Car details */}
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {car.year}
              </div>
              {car.mileage && (
                <div className="flex items-center gap-1">
                  <Gauge className="w-3 h-3" />
                  {car.mileage.toLocaleString()} km
                </div>
              )}
              <div className="flex items-center gap-1">
                <Settings className="w-3 h-3" />
                {car.transmission}
              </div>
              <div className="flex items-center gap-1">
                <Fuel className="w-3 h-3" />
                {car.fuelType}
              </div>
            </div>

            {/* Location and Seller */}
            <div className="space-y-2 pt-2 border-t border-border/40">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {car.district}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{car.seller.name}</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Heart className="w-3 h-3" />
                  {car._count.favorites}
                </div>
              </div>
            </div>

            {/* Action button */}
            <Link href={`/cars/${car.id}`} className="block pt-2">
              <Button className="w-full" variant="outline">
                View Details
              </Button>
            </Link>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  )
}