'use client'

import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { Share2, Copy, MessageCircle, Mail } from 'lucide-react'

interface ShareButtonProps {
  car: {
    id: string
    make: string
    model: string
    year: number
    price: number
  }
}

export function ShareButton({ car }: ShareButtonProps) {
  const { toast } = useToast()

  const carUrl = `${window.location.origin}/cars/${car.id}`
  const carTitle = `${car.make} ${car.model} ${car.year}`
  const shareText = `Check out this ${carTitle} for MWK ${car.price.toLocaleString()}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(carUrl)
      toast({
        title: 'Link copied!',
        description: 'The car listing link has been copied to your clipboard.',
      })
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Please copy the URL manually.',
        variant: 'destructive',
      })
    }
  }

  const shareViaWhatsApp = () => {
    const message = encodeURIComponent(`${shareText}\n\n${carUrl}`)
    window.open(`https://wa.me/?text=${message}`, '_blank')
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Car Listing: ${carTitle}`)
    const body = encodeURIComponent(`${shareText}\n\nView details: ${carUrl}`)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20"
        >
          <Share2 className="h-4 w-4 text-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={copyToClipboard}>
          <Copy className="mr-2 h-4 w-4" />
          Copy link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareViaWhatsApp}>
          <MessageCircle className="mr-2 h-4 w-4" />
          Share on WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareViaEmail}>
          <Mail className="mr-2 h-4 w-4" />
          Share via email
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}