import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { UserRole } from '@prisma/client'
import { redirect } from 'next/navigation'

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}

export async function requireAuth() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }
  
  return session.user
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }
  
  if (session.user.role !== UserRole.ADMIN) {
    redirect('/')
  }
  
  return session.user
}

export async function getIsAdmin() {
  const session = await getServerSession(authOptions)
  return session?.user?.role === UserRole.ADMIN
}

export async function getIsAuthenticated() {
  const session = await getServerSession(authOptions)
  return !!session
}

