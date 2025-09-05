import { Car } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Car className="w-12 h-12 text-primary animate-bounce" />
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
        </div>
        <div className="text-center">
          <h3 className="font-semibold">Loading...</h3>
          <p className="text-sm text-muted-foreground">
            Please wait while we fetch your content
          </p>
        </div>
      </div>
    </div>
  )
}