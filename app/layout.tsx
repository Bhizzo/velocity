// app/layout.tsx (Updated)
import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Analytics } from '@vercel/analytics/react'
import { AuthProvider } from '@/components/providers/session-provider'
import { auth } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'] })

// Separate viewport export (NEW)
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

// Updated metadata without viewport
export const metadata = {
  title: 'Car Market Malawi | Find Your Perfect Car',
  description: 'Malawi\'s premier car marketplace. Browse, search and find cars from trusted sellers across all 28 districts.',
  keywords: 'cars Malawi, car marketplace, buy cars Malawi, sell cars, used cars, new cars',
  authors: [{ name: 'Car Market Malawi' }],
  openGraph: {
    title: 'Car Market Malawi | Find Your Perfect Car',
    description: 'Malawi\'s premier car marketplace. Browse, search and find cars from trusted sellers.',
    type: 'website',
    locale: 'en_MW',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Car Market Malawi',
    description: 'Find your perfect car in Malawi',
  },
  robots: {
    index: true,
    follow: true,
  },
  // viewport removed from here
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
          >
            <div className="min-h-screen flex flex-col bg-background">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}