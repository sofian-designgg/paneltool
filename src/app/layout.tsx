import type { Metadata } from 'next'
import { Syne, Space_Grotesk } from 'next/font/google'
import './globals.css'

const syne = Syne({ subsets: ['latin'], variable: '--font-display' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-body' })

export const metadata: Metadata = {
  title: 'Sayuri Shop',
  description: 'Shop online',
  openGraph: {
    title: 'Sayuri Shop',
    description: 'Shop online',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Sayuri Shop',
    description: 'Shop online',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${syne.variable} ${spaceGrotesk.variable}`}>
      <body className="font-body antialiased bg-black text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}
