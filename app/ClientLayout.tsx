'use client'

// Wrap all of our paths with a common header
import { usePathname } from 'next/navigation'
import { Header } from '@/components/layout/Header'

export default function ClientLayout({ children }: { children: React.ReactNode }) {

  const pathname = usePathname()
  const hideHeader = pathname.startsWith("/auth")

  return (
    <>
      {!hideHeader && <Header />}
      {children}
    </>
  )
}
