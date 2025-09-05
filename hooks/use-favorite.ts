// hooks/use-favorite.ts (Fixed version)
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

export function useFavorite(carId: string, shouldFetch: boolean = true, initialFavoriteStatus?: boolean) {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  
  // Use initial status if provided, otherwise default to false
  const [isFavorited, setIsFavorited] = useState(initialFavoriteStatus ?? false)
  const [isLoading, setIsLoading] = useState(false)

  // Only fetch if shouldFetch is true and no initial status provided
  useEffect(() => {
    if (!shouldFetch || !session?.user || !carId || initialFavoriteStatus !== undefined) {
      return
    }

    const checkFavoriteStatus = async () => {
      try {
        const response = await fetch(`/api/cars/${carId}/favorite`)
        const data = await response.json()
        setIsFavorited(data.isFavorited)
      } catch (error) {
        console.error('Error checking favorite status:', error)
      }
    }

    checkFavoriteStatus()
  }, [carId, session?.user, shouldFetch, initialFavoriteStatus])

  // Update state when initial status changes
  useEffect(() => {
    if (initialFavoriteStatus !== undefined) {
      setIsFavorited(initialFavoriteStatus)
    }
  }, [initialFavoriteStatus])

  const toggleFavorite = async () => {
    if (!session?.user) {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.href))
      return
    }

    setIsLoading(true)

    try {
      const method = isFavorited ? 'DELETE' : 'POST'
      const response = await fetch(`/api/cars/${carId}/favorite`, {
        method,
      })

      if (!response.ok) {
        const error = await response.json()
        
        // Handle specific error cases
        if (error.error === 'Already favorited' && !isFavorited) {
          // If we think it's not favorited but it actually is, update state
          setIsFavorited(true)
          toast({
            title: 'Already in favorites',
            description: 'This car is already in your favorites',
          })
          return
        }
        
        throw new Error(error.error || 'Failed to update favorite')
      }

      const newFavoriteStatus = !isFavorited
      setIsFavorited(newFavoriteStatus)
      
      toast({
        title: newFavoriteStatus ? 'Added to favorites' : 'Removed from favorites',
        description: newFavoriteStatus 
          ? 'Car added to your favorites'
          : 'Car removed from your favorites',
      })

    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast({
        title: 'Error',
        description: 'Failed to update favorite. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isFavorited,
    toggleFavorite,
    isLoading,
  }
}