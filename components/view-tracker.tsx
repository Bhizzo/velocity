'use client'

import { useEffect } from 'react'

interface ViewTrackerProps {
  carId: string
}

export function ViewTracker({ carId }: ViewTrackerProps) {
  useEffect(() => {
    const trackView = async () => {
      try {
        await fetch(`/api/cars/${carId}/view`, {
          method: 'POST',
        })
      } catch (error) {
        console.error('Error tracking view:', error)
      }
    }

    trackView()
  }, [carId])

  return null
}