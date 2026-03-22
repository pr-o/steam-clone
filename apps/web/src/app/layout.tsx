import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

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
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
