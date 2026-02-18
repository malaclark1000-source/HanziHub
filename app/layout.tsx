import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hanzi Hub',
  description: 'Anki Deck Distribution Platform for DLI UCM Mandarin Students',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
