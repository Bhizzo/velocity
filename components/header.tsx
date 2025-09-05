'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  Car, 
  Heart, 
  User, 
  Settings, 
  LogOut,
  Menu,
  Search,
  Plus
} from 'lucide-react'
import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { SearchDialog } from '@/components/search-dialog'
import Image from 'next/image'

export function Header() {
  const { data: session } = useSession()
  const [showSearch, setShowSearch] = useState(false)

  const isAdmin = session?.user?.role === 'ADMIN'

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg gradient-primary">
            <Image
              src='/images/logo.png'
              height={30}
              width={30}    
              alt='logo'        
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-none">Velocity</span>
            <span className="text-xs text-muted-foreground leading-none">Autotrader</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            href="/cars" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Browse Cars
          </Link>
          <Link 
            href="/featured" 
            className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
          >
            Featured
            <Badge variant="secondary" className="text-xs">Hot</Badge>
          </Link>
          {isAdmin && (
            <Link 
              href="/admin" 
              className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
            >
              <Settings className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Search */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(true)}
            className="hidden sm:flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Search cars...
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                    <AvatarFallback>
                      {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {session.user?.name && (
                      <p className="font-medium">{session.user.name}</p>
                    )}
                    {session.user?.email && (
                      <p className="text-xs text-muted-foreground">{session.user.email}</p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/favorites" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    My Favorites
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/cars/new" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Car
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => signOut()}
                  className="flex items-center gap-2 text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => signIn()}>
                Sign In
              </Button>
              <Button size="sm" onClick={() => signIn()}>
                Sign Up
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col space-y-4 mt-8">
                <Link 
                  href="/cars" 
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <Car className="h-5 w-5" />
                  Browse Cars
                </Link>
                <Link 
                  href="/featured" 
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  Featured Cars
                  <Badge variant="secondary" className="text-xs">Hot</Badge>
                </Link>
                {session && (
                  <Link 
                    href="/favorites" 
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors"
                  >
                    <Heart className="h-5 w-5" />
                    My Favorites
                  </Link>
                )}
                {isAdmin && (
                  <>
                    <Link 
                      href="/admin" 
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors"
                    >
                      <Settings className="h-5 w-5" />
                      Admin Dashboard
                    </Link>
                    <Link 
                      href="/admin/cars/new" 
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                      Add Car
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Search Dialog */}
      <SearchDialog open={showSearch} onOpenChange={setShowSearch} />
    </header>
  )
}