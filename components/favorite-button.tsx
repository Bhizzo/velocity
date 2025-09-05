'use client'

import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useFavorite } from '@/hooks/use-favorite'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  carId: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function FavoriteButton({ carId, className, size = 'md' }: FavoriteButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { isFavorited, toggleFavorite, isLoading } = useFavorite(carId)

  const handleClick = () => {
    if (!session?.user) {
      router.push('/api/auth/signin?callbackUrl=' + encodeURIComponent(window.location.href))
      return
    }
    toggleFavorite()
  }

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10', 
    lg: 'h-12 w-12'
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        sizeClasses[size],
        'p-0 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20',
        className
      )}
      onClick={handleClick}
      disabled={isLoading}
      title={session?.user ? (isFavorited ? 'Remove from favorites' : 'Add to favorites') : 'Sign in to save favorites'}
    >
      <Heart 
        className={cn(
          iconSizes[size],
          'transition-colors',
          isFavorited ? 'fill-red-500 text-red-500' : 'text-white'
        )}
      />
    </Button>
  )
}