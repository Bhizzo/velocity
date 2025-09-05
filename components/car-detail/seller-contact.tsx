'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Phone, Mail, MapPin, User, MessageCircle } from 'lucide-react'
import { useState } from 'react'

interface SellerContactProps {
  seller: {
    id: string
    name: string
    email: string
    phone: string
    location: string
    description?: string | null
  }
  carTitle: string
}

export function SellerContact({ seller, carTitle }: SellerContactProps) {
  const [showContact, setShowContact] = useState(false)

  const handleCallSeller = () => {
    window.open(`tel:${seller.phone}`, '_self')
  }

  const handleEmailSeller = () => {
    const subject = encodeURIComponent(`Inquiry about ${carTitle}`)
    const body = encodeURIComponent(`Hi ${seller.name},\n\nI'm interested in your ${carTitle} listing. Could you please provide more details?\n\nBest regards`)
    window.open(`mailto:${seller.email}?subject=${subject}&body=${body}`, '_self')
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hi, I'm interested in your ${carTitle} listing on Car Market Malawi. Could you please provide more details?`)
    window.open(`https://wa.me/${seller.phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Seller Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Seller profile */}
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src="" alt={seller.name} />
            <AvatarFallback>
              {seller.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold">{seller.name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-3 h-3" />
              {seller.location}
            </div>
          </div>
          <Badge variant="outline">Verified</Badge>
        </div>

        {/* Seller description */}
        {seller.description && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">{seller.description}</p>
          </div>
        )}

        {/* Contact actions */}
        <div className="space-y-2">
          {!showContact ? (
            <Button 
              onClick={() => setShowContact(true)}
              className="w-full"
            >
              Show Contact Information
            </Button>
          ) : (
            <>
              <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4" />
                  <span className="font-mono">{seller.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4" />
                  <span>{seller.email}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCallSeller} className="flex-1" variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
                <Button onClick={handleWhatsApp} className="flex-1" variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
              
              <Button onClick={handleEmailSeller} variant="outline" className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}