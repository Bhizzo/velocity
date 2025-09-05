import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Changed to Promise
) {
  try {
    // Await params before using
    const resolvedParams = await params
    const { id: carId } = resolvedParams

    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ isFavorited: false })
    }

    const favorite = await prisma.carFavorite.findUnique({
      where: {
        userId_carId: {
          userId: session.user.id,
          carId: carId // Use resolved params
        }
      }
    })

    return NextResponse.json({ isFavorited: !!favorite })
  } catch (error) {
    console.error('Error checking favorite:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Changed to Promise
) {
  try {
    // Await params before using
    const resolvedParams = await params
    const { id: carId } = resolvedParams

    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if car exists
    const car = await prisma.car.findUnique({
      where: { id: carId } // Use resolved params
    })

    if (!car) {
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      )
    }

    // Add favorite
    await prisma.carFavorite.create({
      data: {
        userId: session.user.id,
        carId: carId // Use resolved params
      }
    })

    // Update car like count
    await prisma.car.update({
      where: { id: carId }, // Use resolved params
      data: {
        likeCount: {
          increment: 1
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
  // Check if it's a Prisma error with a code property
  if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
    return NextResponse.json(
      { error: 'Already favorited' },
      { status: 400 }
    )
  }
  console.error('Error adding favorite:', error)
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
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Remove favorite
    await prisma.carFavorite.delete({
      where: {
        userId_carId: {
          userId: session.user.id,
          carId: carId // Use resolved params
        }
      }
    })

    // Update car like count
    await prisma.car.update({
      where: { id: carId }, // Use resolved params
      data: {
        likeCount: {
          decrement: 1
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing favorite:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}