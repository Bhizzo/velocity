import Link from 'next/link'
import { Car, Mail, Phone, MapPin, Facebook, Twitter } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg gradient-primary">
                 <Image
                              src='/images/logo.png'
                              height={20}
                              width={20}    
                              alt='logo'        
                            />
              </div>
              <div className="flex flex-col">
                <span className="font-bold leading-none">Velocity</span>
                <span className="text-xs text-muted-foreground leading-none">Autotrader</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              Malawi's premier car marketplace connecting buyers and sellers across all 28 districts.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Browse</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/cars" className="text-muted-foreground hover:text-primary transition-colors">All Cars</Link></li>
              <li><Link href="/featured" className="text-muted-foreground hover:text-primary transition-colors">Featured Cars</Link></li>
              <li><Link href="/cars?sort=newest" className="text-muted-foreground hover:text-primary transition-colors">Latest Arrivals</Link></li>
              <li><Link href="/cars?sort=popular" className="text-muted-foreground hover:text-primary transition-colors">Most Popular</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="text-muted-foreground hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/safety" className="text-muted-foreground hover:text-primary transition-colors">Safety Tips</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                info@carmarket.mw
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                +265 123 456 789
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Blantyre, Malawi
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; 2025 Velocity Autotrader. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}