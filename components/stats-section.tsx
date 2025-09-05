'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Car, Users, Eye, TrendingUp } from 'lucide-react'
import { formatMWK } from '@/lib/constants'
import { motion } from 'framer-motion'

interface StatsSectionProps {
  stats: {
    totalCars: number
    averagePrice: number | null
    totalSellers: number
  }
}

export function StatsSection({ stats }: StatsSectionProps) {
  const statsData = [
    {
      title: 'Total Cars',
      value: stats.totalCars.toLocaleString(),
      icon: Car,
      description: 'Available now'
    },
    {
      title: 'Average Price',
      value: formatMWK(Number(stats.averagePrice || 0)),
      icon: TrendingUp,
      description: 'Across all listings'
    },
    {
      title: 'Trusted Sellers',
      value: stats.totalSellers.toLocaleString(),
      icon: Users,
      description: 'Verified partners'
    },
    {
      title: 'All Districts',
      value: '28',
      icon: Eye,
      description: 'Malawi coverage'
    }
  ]

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Malawi's Largest Car Marketplace
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connecting car buyers and sellers across all 28 districts with transparency and trust
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold">
                    {stat.value}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-1">{stat.title}</h3>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}