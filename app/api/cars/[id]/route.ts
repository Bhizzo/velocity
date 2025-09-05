import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { deleteFromR2 } from '@/lib/cloudflare-r2'
import { serializeForClient } from '@/lib/utils' // Add serialization import

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Changed to Promise
) {
  try {
    // Await params before using
    const resolvedParams = await params
    const { id: carId } = resolvedParams

    const car = await prisma.car.findUnique({
      where: { id: carId }, // Use resolved params
      include: {
        images: {
          orderBy: [
            { isPrimary: 'desc' },
            { createdAt: 'asc' }
          ]
        },
        seller: true,
        _count: {
          select: { favorites: true }
        }
      }
    })

    if (!car) {
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      )
    }

    // Serialize data before returning
    const serializedCar = serializeForClient(car)

    return NextResponse.json({ car: serializedCar })
  } catch (error) {
    console.error('Error fetching car:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Changed to Promise
) {
  try {
    // Await params before using
    const resolvedParams = await params
    const { id: carId } = resolvedParams

    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    const car = await prisma.car.update({
      where: { id: carId }, // Use resolved params
      data: body,
      include: {
        images: true,
        seller: true,
        _count: {
          select: { favorites: true }
        }
      }
    })

    // Serialize data before returning
    const serializedCar = serializeForClient(car)

    return NextResponse.json({ car: serializedCar })
  } catch (error) {
    console.error('Error updating car:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Changed to Promise
) {
  try {
    // Await params before using
    const resolvedParams = await params
    const { id: carId } = resolvedParams

    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get car with images
    const car = await prisma.car.findUnique({
      where: { id: carId }, // Use resolved params
      include: { images: true }
    })

    if (!car) {
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      )
    }

    // Delete images from R2
    await Promise.all(
      car.images.map(image => deleteFromR2(image.key))
    )

    // Delete car (cascades to images and favorites)
    await prisma.car.delete({
      where: { id: carId } // Use resolved params
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting car:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}