import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Changed to Promise
) {
  try {
    // Await params before using
    const resolvedParams = await params
    const { id: carId } = resolvedParams

    await prisma.car.update({
      where: { id: carId }, // Use resolved params
      data: {
        viewCount: {
          increment: 1
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking view:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}