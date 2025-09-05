'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { 
  X, 
  Upload, 
  Star, 
  StarOff, 
  Image as ImageIcon,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value: Array<{
    url: string
    key: string
    isPrimary: boolean
  }>
  onChange: (images: Array<{
    url: string
    key: string
    isPrimary: boolean
  }>) => void
  maxFiles?: number
}

export function ImageUpload({ value, onChange, maxFiles = 10 }: ImageUploadProps) {
  const { toast } = useToast()
  const [uploading, setUploading] = useState<string[]>([])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (value.length + acceptedFiles.length > maxFiles) {
      toast({
        title: 'Too many files',
        description: `Maximum ${maxFiles} images allowed`,
        variant: 'destructive',
      })
      return
    }

    const uploadPromises = acceptedFiles.map(async (file) => {
      const tempId = Math.random().toString(36)
      setUploading(prev => [...prev, tempId])

      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Upload failed')
        }

        const data = await response.json()
        return {
          url: data.url,
          key: data.key,
          isPrimary: value.length === 0 // First image is primary by default
        }
      } catch (error) {
        toast({
          title: 'Upload failed',
          description: `Failed to upload ${file.name}`,
          variant: 'destructive',
        })
        return null
      } finally {
        setUploading(prev => prev.filter(id => id !== tempId))
      }
    })

    const results = await Promise.all(uploadPromises)
    const successfulUploads = results.filter(result => result !== null)
    
    if (successfulUploads.length > 0) {
      onChange([...value, ...successfulUploads])
    }
  }, [value, onChange, maxFiles, toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: uploading.length > 0 || value.length >= maxFiles
  })

  const removeImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index)
    
    // If we removed the primary image, make the first remaining image primary
    if (value[index].isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true
    }
    
    onChange(newImages)
  }

  const setPrimary = (index: number) => {
    const newImages = value.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }))
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Upload dropzone */}
      {value.length < maxFiles && (
        <Card>
          <CardContent className="pt-6">
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
                (uploading.length > 0 || value.length >= maxFiles) && "cursor-not-allowed opacity-50"
              )}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-2">
                {uploading.length > 0 ? (
                  <>
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Uploading {uploading.length} image{uploading.length > 1 ? 's' : ''}...
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      {isDragActive ? 'Drop images here' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, WebP up to 10MB ({value.length}/{maxFiles} images)
                    </p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((image, index) => (
            <Card key={image.key} className="relative group overflow-hidden">
              <div className="aspect-square relative">
                <Image
                  src={image.url}
                  alt={`Car image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                
                {/* Primary badge */}
                {image.isPrimary && (
                  <Badge className="absolute top-2 left-2 bg-yellow-500 hover:bg-yellow-600 text-black">
                    <Star className="w-3 h-3 mr-1" />
                    Primary
                  </Badge>
                )}
                
                {/* Actions */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!image.isPrimary && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0"
                      onClick={() => setPrimary(index)}
                      title="Set as primary image"
                    >
                      <StarOff className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 w-8 p-0"
                    onClick={() => removeImage(index)}
                    title="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Instructions */}
      {value.length > 0 && (
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• The primary image will be displayed as the main car photo</p>
          <p>• Click the star icon to set a different primary image</p>
          <p>• You can upload up to {maxFiles} images per car</p>
        </div>
      )}
    </div>
  )
}