'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Search, Star, Users, Car } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/50">
      <div className="container py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                Find Your
                <span className="text-primary block">Perfect Car</span>
                in Malawi
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Browse thousands of quality vehicles from trusted sellers across all 28 districts. 
                Your next car is just a click away.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/cars">
                  Browse Cars
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link href="/featured">
                  View Featured
                  <Star className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center space-x-8 pt-8 border-t border-border/40">
              <div className="flex items-center space-x-2">
                <Car className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">1000+ Cars</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Trusted Sellers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Search className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Easy Search</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Decorative elements */}
              <div className="absolute inset-0 gradient-primary rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute inset-4 bg-background rounded-full shadow-2xl flex items-center justify-center">
               <Image
                            src='/images/logo.png'
                            height={300}
                            width={300}    
                            alt='logo'        
                          />
              </div>
              
              {/* Floating cards */}
              <div className="absolute -top-4 -right-4 bg-card border shadow-lg rounded-lg p-4 animate-fadeInUp">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Featured</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-card border shadow-lg rounded-lg p-4 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Verified Sellers</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,0.1)_50%,transparent_75%,transparent)] bg-[length:20px_20px]"></div>
    </section>
  )
}