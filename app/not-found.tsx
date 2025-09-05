import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Home, Car } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container py-8 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Car className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or may have been moved.
          </p>
          
          <div className="flex gap-3 justify-center">
            <Button asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/cars">
                <Search className="w-4 h-4 mr-2" />
                Browse Cars
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}