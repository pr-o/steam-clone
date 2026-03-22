import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
