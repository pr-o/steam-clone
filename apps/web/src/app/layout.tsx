import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { TopNav } from '@/components/layout/TopNav'
import { SubNav } from '@/components/layout/SubNav'
import { Footer } from '@/components/layout/Footer'

const font = Nunito({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Steam',
  description: 'The ultimate destination for playing, discussing, and creating games.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={font.variable}>
      <body className="bg-steam-bg text-steam-text min-h-screen">
        <Providers>
          <TopNav />
          <SubNav />
          {/* 72px offset = 36px TopNav + 36px SubNav */}
          <main className="pt-[72px] min-h-[calc(100vh-72px)]">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
