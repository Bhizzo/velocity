// app/api/cars/route.ts (Fixed)
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { serializeCars } from '@/lib/utils'
import { CarStatus, Transmission, FuelType } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const q = searchParams.get('q')
    const make = searchParams.get('make')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const district = searchParams.get('district')
    const transmission = searchParams.get('transmission')
    const fuelType = searchParams.get('fuelType')
    const minYear = searchParams.get('minYear')
    const maxYear = searchParams.get('maxYear')
    const featured = searchParams.get('featured')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const sort = searchParams.get('sort') || 'newest'
    const limit = parseInt(searchParams.get('limit') || '12')

    // Build where clause
    const where: any = {
      expiresAt: { gt: new Date() }
    }

    // Handle status filter - only allow valid CarStatus values
    if (status) {
      const validStatuses = Object.values(CarStatus)
      if (validStatuses.includes(status as CarStatus)) {
        where.status = status as CarStatus
      } else {
        // Default to ACTIVE if invalid status provided
        where.status = CarStatus.ACTIVE
      }
    } else {
      // Default to ACTIVE if no status provided
      where.status = CarStatus.ACTIVE
    }

    // Search query
    if (q) {
      where.OR = [
        { make: { contains: q, mode: 'insensitive' } },
        { model: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } }
      ]
    }

    // Filters
    if (make) {
      where.make = { contains: make, mode: 'insensitive' }
    }

    if (district) {
      where.district = { contains: district, mode: 'insensitive' }
    }

    if (transmission && Object.values(Transmission).includes(transmission as Transmission)) {
      where.transmission = transmission as Transmission
    }

    if (fuelType && Object.values(FuelType).includes(fuelType as FuelType)) {
      where.fuelType = fuelType as FuelType
    }

    // Price range
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) {
        where.price.gte = parseFloat(minPrice)
      }
      if (maxPrice) {
        where.price.lte = parseFloat(maxPrice)
      }
    }

    // Year range
    if (minYear || maxYear) {
      where.year = {}
      if (minYear) {
        where.year.gte = parseInt(minYear)
      }
      if (maxYear) {
        where.year.lte = parseInt(maxYear)
      }
    }

    // Featured filter
    if (featured === 'true') {
      where.featured = true
    }

    // Sort options
    let orderBy: any = { createdAt: 'desc' } // default
    
    switch (sort) {
      case 'price-low':
        orderBy = { price: 'asc' }
        break
      case 'price-high':
        orderBy = { price: 'desc' }
        break
      case 'year-new':
        orderBy = { year: 'desc' }
        break
      case 'year-old':
        orderBy = { year: 'asc' }
        break
      case 'mileage-low':
        orderBy = { mileage: 'asc' }
        break
      case 'mileage-high':
        orderBy = { mileage: 'desc' }
        break
      case 'popular':
        orderBy = { viewCount: 'desc' }
        break
      case 'featured':
        orderBy = [{ featured: 'desc' }, { createdAt: 'desc' }]
        break
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' }
        break
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Fetch cars and total count
    const [cars, total] = await Promise.all([
      prisma.car.findMany({
        where,
        include: {
          images: { 
            where: { isPrimary: true },
            take: 1 
          },
          seller: true,
          _count: {
            select: { favorites: true }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.car.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    // Serialize data before returning
    const serializedCars = serializeCars(cars)

    return NextResponse.json({
      cars: serializedCars,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Error fetching cars:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cars' },
      { status: 500 }
    )
  }
}