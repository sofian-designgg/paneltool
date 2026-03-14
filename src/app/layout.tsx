import type { Metadata } from 'next'
import { Outfit, DM_Sans } from 'next/font/google'
import './globals.css'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-display' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-body' })

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
    <html lang="fr" className={`${outfit.variable} ${dmSans.variable}`}>
      <body className="font-body antialiased bg-black text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}
