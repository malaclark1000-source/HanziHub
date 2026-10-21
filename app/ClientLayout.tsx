'use client'

// Wrap all of our paths with a common header and footer
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}
