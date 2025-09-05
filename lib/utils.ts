import { Decimal } from '@prisma/client/runtime/library'

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/**
 * Convert Prisma Decimal to number
 */
export function decimalToNumber(decimal: Decimal | null | undefined): number {
  return decimal ? decimal.toNumber() : 0
}

/**
 * Convert Prisma Decimal to string with formatting
 */
export function decimalToString(decimal: Decimal | null | undefined): string {
  return decimal ? decimal.toString() : '0'
}

/**
 * Format Decimal as currency (Malawian Kwacha)
 */
export function formatPrice(decimal: Decimal | number | null | undefined): string {
  const num = typeof decimal === 'number' ? decimal : decimalToNumber(decimal)
  return new Intl.NumberFormat('en-MW', {
    style: 'currency',
    currency: 'MWK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

/**
 * Serialize car data for client components
 */
export function serializeCar(car: any) {
  return {
    ...car,
    price: decimalToNumber(car.price),
    createdAt: car.createdAt.toISOString(),
    updatedAt: car.updatedAt.toISOString(),
    expiresAt: car.expiresAt.toISOString(),
  }
}

/**
 * Serialize multiple cars
 */
export function serializeCars(cars: any[]) {
  return cars.map(serializeCar)
}

/**
 * Serialize stats data
 */
export function serializeStats(stats: any) {
  return {
    ...stats,
    averagePrice: stats.averagePrice ? decimalToNumber(stats.averagePrice) : 0,
  }
}

/**
 * Generic function to serialize any object with Decimals and Dates
 */
export function serializeForClient(obj: any): any {
  if (obj === null || obj === undefined) return obj
  
  if (obj instanceof Date) {
    return obj.toISOString()
  }
  
  // Check if object has toNumber method (Decimal-like)
  if (obj && typeof obj === 'object' && typeof obj.toNumber === 'function') {
    return obj.toNumber()
  }
  
  if (Array.isArray(obj)) {
    return obj.map(serializeForClient)
  }
  
  if (typeof obj === 'object') {
    const serialized: any = {}
    for (const [key, value] of Object.entries(obj)) {
      serialized[key] = serializeForClient(value)
    }
    return serialized
  }
  
  return obj
}