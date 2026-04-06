import './globals.css'
import { ApplicationStoreProvider } from '@/providers/application-store-provider'
import ClientLayout from './ClientLayout'
import { Metadata } from 'next'

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
        <ApplicationStoreProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </ApplicationStoreProvider>
      </body>
    </html>
  )
}
