'use client'

// Wrap all of our paths with a common header
import { Header } from '@/components/layout/Header'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
