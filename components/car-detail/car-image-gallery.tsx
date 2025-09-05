'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, X, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CarImageGalleryProps {
  images: Array<{
    url: string
    isPrimary: boolean
  }>
  carName: string
}

export function CarImageGallery({ images, carName }: CarImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)

  if (!images || images.length === 0) {
    return (
      <Card>
        <CardContent className="aspect-video flex items-center justify-center bg-muted">
          <div className="text-center">
            <div className="w-16 h-16 bg-muted-foreground/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Image width={32} height={32} src="/placeholder-car.jpg" alt="No image" />
            </div>
            <p className="text-sm text-muted-foreground">No images available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const primaryImage = images.find(img => img.isPrimary) || images[0]
  const thumbnailImages = images.length > 1 ? images : []

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index)
    setShowLightbox(true)
  }

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <>
      <div className="space-y-4">
        {/* Main image */}
        <Card className="overflow-hidden">
          <div className="relative aspect-video bg-muted cursor-pointer group" onClick={() => openLightbox(0)}>
            <Image
              src={primaryImage.url}
              alt={`${carName} main image`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority
            />
            
            {/* Primary badge */}
            {primaryImage.isPrimary && images.length > 1 && (
              <Badge className="absolute top-4 left-4 bg-yellow-500 hover:bg-yellow-600 text-black">
                <Star className="w-3 h-3 mr-1" />
                Main Photo
              </Badge>
            )}
            
            {/* View all overlay */}
            {images.length > 1 && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium">View all {images.length} photos</span>
                </div>
              </div>
            )}
            
            {/* Image counter */}
            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-sm px-2 py-1 rounded">
              1 / {images.length}
            </div>
          </div>
        </Card>

        {/* Thumbnail grid */}
        {thumbnailImages.length > 1 && (
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {images.map((image, index) => (
              <Card 
                key={index} 
                className={cn(
                  "overflow-hidden cursor-pointer transition-all hover:shadow-md",
                  index === selectedImageIndex && "ring-2 ring-primary"
                )}
                onClick={() => openLightbox(index)}
              >
                <div className="relative aspect-square">
                  <Image
                    src={image.url}
                    alt={`${carName} image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {image.isPrimary && (
                    <div className="absolute top-1 left-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={showLightbox} onOpenChange={setShowLightbox}>
        <DialogContent className="max-w-7xl h-[90vh] p-0 bg-black/95">
          <div className="relative h-full flex items-center justify-center">
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white"
              onClick={() => setShowLightbox(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Image counter */}
            <div className="absolute top-4 left-4 z-50 bg-black/50 text-white text-sm px-3 py-1 rounded">
              {selectedImageIndex + 1} / {images.length}
            </div>

            {/* Main image */}
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <Image
                src={images[selectedImageIndex].url}
                alt={`${carName} image ${selectedImageIndex + 1}`}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={cn(
                      "relative w-12 h-8 cursor-pointer rounded overflow-hidden border-2 transition-all",
                      index === selectedImageIndex ? "border-white" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <Image
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}